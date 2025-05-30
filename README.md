# Property Listing Backend

A TypeScript/Node.js backend for managing property listings with CRUD operations, advanced filtering, user authentication, property favorites, and recommendations.

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