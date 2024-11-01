# Digital Art Portfolio Platform - ArtFolio

A modern web application designed for digital artists to showcase their artwork, manage their portfolios, and interact with their audience.

## Features

- Dynamic portfolio showcase
- User authentication and authorization
- Artwork management system
- Category and tag organization
- Image upload and management
- Responsive gallery layout
- User profile customization

## Tech Stack

### Frontend
- React.js
- TypeScript
- React Router
- Axios
- React Dropzone for image uploads
- Framer Motion for animations

### Backend
- NestJS
- SQLite
- JWT Authentication
- Sharp for image processing

## Getting Started

### Installation

1. Clone the repository

2. Install backend dependencies

3. Install frontend dependencies

4. Set up environment variables
Create `.env` files in both frontend and backend directories:

Backend `.env`:
`JWT_SECRET=d29ee863dedf1bdc991c61f0018835a1aa6cfeefb0a0cd8e1a5edbde7c9697b8e9c1431a7380a3f13ac0396104ee82ea125dbb8501fec1e03f5900aa34d94253
DATABASE_NAME=database.sqlite
DATABASE_SYNCHRONIZE=true
API_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000
EMAIL_USER=admin@admin.com
EMAIL_PASS=admin
PORT=3000`


## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Artwork Management
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get specific artwork
- `POST /api/artworks` - Create new artwork
- `PUT /api/artworks/:id` - Update artwork
- `DELETE /api/artworks/:id` - Delete artwork

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id/portfolio` - Get user's portfolio

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category 
- `PUT /api/categories/:id` - Update category 
- `DELETE /api/categories/:id` - Delete category 

## Key Features Implementation

### Gallery View
- Responsive masonry layout
- Lazy loading
- Image preview
- Filtering by category/tags

### User Profiles
- Customizable portfolio layout
- Bio and contact information
- Social media links
- Shop
