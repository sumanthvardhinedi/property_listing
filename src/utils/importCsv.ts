import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import Property from '../models/Property';

dotenv.config();

const CSV_URL = 'https://cdn2.gro.care/db424fd9fb74_1748258398689.csv';

async function downloadCSV(): Promise<string> {
  const response = await axios({
    method: 'GET',
    url: CSV_URL,
    responseType: 'stream'
  });

  const writer = fs.createWriteStream('./data.csv');
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve('./data.csv'));
    writer.on('error', reject);
  });
}

async function importCSV(filePath: string) {
  const results: any[] = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          await connectDB();
          console.log(`Importing ${results.length} properties...`);
          
          for (const row of results) {
            const property = new Property({
              propertyType: row.property_type?.toLowerCase() || 'house',
              price: parseFloat(row.price) || 0,
              location: row.location || 'Unknown',
              bedrooms: parseInt(row.bedrooms) || 0,
              bathrooms: parseInt(row.bathrooms) || 0,
              squareFootage: parseInt(row.square_footage) || 0,
              yearBuilt: parseInt(row.year_built) || 2000,
              lotSize: parseInt(row.lot_size) || 0,
              description: row.description || 'No description available',
              parking: row.parking === 'true',
              status: row.status?.toLowerCase() || 'available'
            });
            
            await property.save();
          }
          
          console.log('Import completed successfully!');
          resolve(results.length);
        } catch (error) {
          reject(error);
        }
      });
  });
}

async function main() {
  try {
    console.log('Downloading CSV file...');
    const filePath = await downloadCSV();
    
    console.log('Starting import...');
    const count = await importCSV(filePath);
    
    console.log(`Successfully imported ${count} properties`);
    
    // Clean up
    fs.unlinkSync(filePath);
    
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
} 