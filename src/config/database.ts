import mongoose from 'mongoose';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property-listing');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Redis Client
console.log('Attempting to connect to Redis at:', process.env.REDIS_URL || 'redis://localhost:6379');

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (error: Error) => {
  console.error('Redis Client Error:', error);
  if (error.message.includes('ECONNREFUSED')) {
    console.error('Make sure Redis is running and the connection URL is correct');
  }
});

redis.on('connect', () => console.log('Redis Client Connected'));
redis.on('ready', () => console.log('Redis Client Ready'));
redis.on('reconnecting', () => console.log('Redis Client Reconnecting...')); 