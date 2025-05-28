import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import Property from '../models/Property';
import { redis } from '../config/database';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create property
router.post(
  '/',
  auth,
  [
    body('propertyType').isIn(['house', 'apartment', 'condo', 'townhouse', 'land']),
    body('price').isNumeric(),
    body('location').notEmpty(),
    body('bedrooms').isNumeric(),
    body('bathrooms').isNumeric(),
    body('squareFootage').isNumeric(),
    body('yearBuilt').isNumeric(),
    body('lotSize').isNumeric(),
    body('description').notEmpty(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const property = new Property({
        ...req.body,
        createdBy: req.user._id,
      });

      await property.save();
      
      // Clear cache for property listings
      await redis.del('properties');

      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all properties with filtering
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = `properties:${JSON.stringify(req.query)}`;
    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      res.json(JSON.parse(cachedResult));
      return;
    }

    const filter: any = {};
    const {
      propertyType,
      minPrice,
      maxPrice,
      location,
      minBedrooms,
      minBathrooms,
      minSquareFootage,
      parking,
      status,
    } = req.query;

    if (propertyType) filter.propertyType = propertyType;
    if (location) filter.location = new RegExp(String(location), 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minBedrooms) filter.bedrooms = { $gte: Number(minBedrooms) };
    if (minBathrooms) filter.bathrooms = { $gte: Number(minBathrooms) };
    if (minSquareFootage) filter.squareFootage = { $gte: Number(minSquareFootage) };
    if (parking) filter.parking = parking === 'true';
    if (status) filter.status = status;

    const properties = await Property.find(filter)
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });

    // Cache the results for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(properties));

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get property by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = `property:${req.params.id}`;
    const cachedProperty = await redis.get(cacheKey);

    if (cachedProperty) {
      res.json(JSON.parse(cachedProperty));
      return;
    }

    const property = await Property.findById(req.params.id).populate('createdBy', 'email');
    
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    // Cache the property for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(property));

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update property
router.put('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    // Check if user owns the property
    if (property.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Clear cache
    await redis.del(`property:${req.params.id}`);
    await redis.del('properties');

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete property
router.delete('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    // Check if user owns the property
    if (property.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await property.deleteOne();

    // Clear cache
    await redis.del(`property:${req.params.id}`);
    await redis.del('properties');

    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 