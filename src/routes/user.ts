import express, { Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import Property from '../models/Property';
import { redis } from '../config/database';
import mongoose from 'mongoose';

const router = express.Router();

// Add property to favorites
router.post('/favorites/:propertyId', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.favorites.includes(property._id)) {
      res.status(400).json({ message: 'Property already in favorites' });
      return;
    }

    user.favorites.push(property._id);
    await user.save();

    // Clear user cache
    await redis.del(`user:${user._id}`);

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove property from favorites
router.delete('/favorites/:propertyId', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.propertyId
    );
    await user.save();

    // Clear user cache
    await redis.del(`user:${user._id}`);

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's favorites
router.get('/favorites', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cacheKey = `user:${req.user._id}:favorites`;
    const cachedFavorites = await redis.get(cacheKey);

    if (cachedFavorites) {
      res.json(JSON.parse(cachedFavorites));
      return;
    }

    const user = await User.findById(req.user._id)
      .populate('favorites')
      .select('favorites');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Cache favorites for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(user.favorites));

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Recommend property to another user
router.post('/recommend', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId, recipientEmail } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      res.status(404).json({ message: 'Recipient not found' });
      return;
    }

    // Check if property is already recommended to the user
    const alreadyRecommended = recipient.recommendationsReceived.some(
      (rec) =>
        rec.property.toString() === propertyId &&
        rec.from.toString() === req.user._id.toString()
    );

    if (alreadyRecommended) {
      res.status(400).json({ message: 'Property already recommended to this user' });
      return;
    }

    recipient.recommendationsReceived.push({
      property: new mongoose.Types.ObjectId(propertyId),
      from: req.user._id,
      date: new Date(),
    });

    await recipient.save();

    // Clear recipient's cache
    await redis.del(`user:${recipient._id}`);

    res.json({ message: 'Property recommended successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommendations received
router.get('/recommendations', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cacheKey = `user:${req.user._id}:recommendations`;
    const cachedRecommendations = await redis.get(cacheKey);

    if (cachedRecommendations) {
      res.json(JSON.parse(cachedRecommendations));
      return;
    }

    const user = await User.findById(req.user._id)
      .populate({
        path: 'recommendationsReceived',
        populate: [
          { path: 'property' },
          { path: 'from', select: 'email' },
        ],
      });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Cache recommendations for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(user.recommendationsReceived));

    res.json(user.recommendationsReceived);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 