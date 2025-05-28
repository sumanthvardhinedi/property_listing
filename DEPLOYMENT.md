# Deployment Guide

This guide provides instructions for deploying the Property Listing Backend application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Redis Cloud account
- Git

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_secret
REDIS_URL=your_redis_cloud_url
PORT=10000
```

Replace the placeholder values with your actual configuration:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for JWT token generation
- `REDIS_URL`: Your Redis Cloud connection URL
- `PORT`: The port number for the application (default: 10000)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd property-listing-backend
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript project:
```bash
npm run build
```

## Production Deployment

### Option 1: Traditional Server Deployment

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start the application:
```bash
pm2 start dist/server.js --name "property-listing-backend"
```

3. Monitor the application:
```bash
pm2 monitor
```

### Option 2: Docker Deployment

1. Build the Docker image:
```bash
docker build -t property-listing-backend .
```

2. Run the container:
```bash
docker run -d \
  --name property-listing-backend \
  -p 10000:10000 \
  --env-file .env \
  property-listing-backend
```

## Health Check

Once deployed, verify the application is running:
```bash
curl http://localhost:10000/api/health
```

## Data Import

To import property data from CSV:
```bash
npm run import-csv
```

## Monitoring

- Monitor application logs:
```bash
pm2 logs property-listing-backend
```

- Check application status:
```bash
pm2 status
```

## Troubleshooting

1. If MongoDB connection fails:
   - Verify MONGODB_URI is correct
   - Check if IP address is whitelisted in MongoDB Atlas

2. If Redis connection fails:
   - Verify REDIS_URL is correct
   - Check Redis Cloud console for connection issues

3. For other issues:
   - Check application logs
   - Verify all environment variables are set correctly

## Security Considerations

1. Ensure JWT_SECRET is a strong, unique value
2. Keep .env file secure and never commit it to version control
3. Use HTTPS in production
4. Regularly update dependencies
5. Monitor application logs for suspicious activities

## Backup and Recovery

1. Configure automated MongoDB backups in Atlas
2. Regularly backup environment configurations
3. Document any custom modifications

## Support

For issues and support:
- Create an issue in the repository
- Contact the development team 