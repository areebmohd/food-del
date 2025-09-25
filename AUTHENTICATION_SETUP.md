# User Authentication System Setup

## Backend Setup

1. **Environment Variables**: Create a `.env` file in the backend directory with:
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

2. **Dependencies**: All required dependencies are already installed in package.json:
   - bcrypt (for password hashing)
   - jsonwebtoken (for JWT tokens)
   - mongoose (for database operations)

## API Endpoints

### User Registration
- **POST** `/api/user/register`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: User data and JWT token

### User Login
- **POST** `/api/user/login`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: User data and JWT token

### Get User Profile (Protected)
- **GET** `/api/user/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile data

## Features Implemented

✅ **Backend**:
- User model with email and password validation
- Password hashing with bcrypt
- JWT token generation and verification
- Email uniqueness validation
- Password minimum length validation (8 characters)
- Authentication middleware
- Error handling and validation

✅ **Frontend**:
- Authentication context for state management
- Login/Registration form with validation
- Dynamic navbar showing login/logout based on auth state
- User email display in navbar
- Form validation and error messages
- Loading states during API calls

## Security Features

- Passwords are hashed using bcrypt with salt rounds
- JWT tokens expire after 7 days
- Email addresses are stored in lowercase for consistency
- Input validation on both frontend and backend
- Protected routes require valid JWT tokens

## Usage

1. Start the backend server: `npm run server` (from backend directory)
2. Start the frontend: `npm run dev` (from frontend directory)
3. Users can register with email and password (min 8 characters)
4. Users can login with their credentials
5. Navbar shows user email and logout button when logged in
6. Login button appears when user is not authenticated
