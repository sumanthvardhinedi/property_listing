# Property Listing Backend

## Project Overview

This backend system is designed for managing property listings, supporting user authentication, CRUD operations, advanced filtering, property favorites, recommendations, and caching. It is built as part of the SDE Intern Backend Assignment and demonstrates real-world backend engineering skills using TypeScript, Node.js, MongoDB, and Redis.

## Assignment Requirements

- **Import CSV Data:** Import property listings from a provided CSV file into MongoDB for initial data population.
- **CRUD Operations:** Implement create, read, update, and delete operations for properties. Only the creator (identified by the `createdBy` field) can update or delete their properties.
- **Advanced Filtering:** Enable users to filter/search properties based on 10+ attributes (type, price, location, bedrooms, bathrooms, square footage, year built, lot size, parking, status, etc.).
- **Caching:** Integrate Redis to cache frequent read/write operations for improved performance.
- **User Authentication:** Allow users to register and log in with email/password. Use JWT for authentication and secure endpoints.
- **Favorites:** Allow users to favorite properties and manage their favorites (add, remove, list).
- **Recommendations (Bonus):** Allow users to recommend properties to other registered users by email. Recipients can view all properties recommended to them.
- **Deployment (Bonus):** Deploy the backend to a free hosting service (e.g., Render) and provide a public API URL.

## Dataset Usage

- Download the dataset CSV from: [Property Listings CSV](https://cdn2.gro.care/db424fd9fb74_1748258398689.csv)
- Use the provided import script to populate the MongoDB database with property data for testing and demonstration.

## Workflow Summary

1. **Import CSV Data:** Use the import script to seed the database.
2. **User Registration/Login:** Users register and log in to receive a JWT token.
3. **CRUD Operations:** Authenticated users can create, update, and delete their own properties. All users can view properties.
4. **Advanced Filtering:** Users can search and filter properties using query parameters.
5. **Favorites:** Authenticated users can favorite/unfavorite properties and view their favorites.
6. **Recommendations:** Authenticated users can recommend properties to other users by email and view received recommendations.
7. **Caching:** Redis is used to cache property lists and favorites for faster access.
8. **Deployment:** The backend is deployed and accessible via a public URL.

## Submission Instructions

- **Deployed Application Link:** Public URL of the deployed backend (e.g., Render).
- **Recorded Video:** A walkthrough video explaining the code, features, and API usage.
- **GitHub Repository:** This repository, with a detailed README and documented code.

## Features

- **CRUD Operations for Properties:** Only the creator can update or delete their properties.
- **Advanced Search/Filtering:** Filter properties by type, price, location, bedrooms, bathrooms, square footage, parking, and status.
- **User Authentication:** Register and login with email/password using JWT.
- **Property Favorites:** Add, remove, and list favorite properties.
- **Recommendations:** Recommend properties to other users and view received recommendations.
- **Caching:** Redis caching for property listings and user favorites.

## Tech Stack

- **TypeScript / Node.js**
- **MongoDB**
- **Redis** (for caching)
- **Express.js**

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd property-listing-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   REDIS_URL=redis://<username>:<password>@<redis-url>:<port>
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build and start production server:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Properties

- **GET /api/properties:** Get all properties with filtering.
- **GET /api/properties/:id:** Get a property by ID.
- **POST /api/properties:** Create a new property (auth required).
- **PUT /api/properties/:id:** Update a property (auth required, owner only).
- **DELETE /api/properties/:id:** Delete a property (auth required, owner only).

### Users

- **POST /api/auth/register:** Register a new user.
- **POST /api/auth/login:** Login and get JWT token.
- **GET /api/users/favorites:** Get user's favorite properties (auth required).
- **POST /api/users/favorites/:propertyId:** Add a property to favorites (auth required).
- **DELETE /api/users/favorites/:propertyId:** Remove a property from favorites (auth required).
- **POST /api/users/recommend:** Recommend a property to another user (auth required).
- **GET /api/users/recommendations:** Get recommendations received (auth required).

## License

ISC 