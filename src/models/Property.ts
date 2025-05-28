import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  propertyType: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  lotSize: number;
  parking: boolean;
  amenities: string[];
  description: string;
  status: 'available' | 'sold' | 'pending';
  createdBy: mongoose.Types.ObjectId;
  images: string[];
}

const propertySchema = new Schema({
  propertyType: {
    type: String,
    required: true,
    enum: ['house', 'apartment', 'condo', 'townhouse', 'land']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  squareFootage: {
    type: Number,
    required: true,
    min: 0
  },
  yearBuilt: {
    type: Number,
    required: true
  },
  lotSize: {
    type: Number,
    required: true,
    min: 0
  },
  parking: {
    type: Boolean,
    default: false
  },
  amenities: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'pending'],
    default: 'available'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String
  }]
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
propertySchema.index({ location: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ status: 1 });

const PropertyModel = mongoose.model<IProperty>('Property', propertySchema);
export default PropertyModel; 