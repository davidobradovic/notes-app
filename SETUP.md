# Notes App Setup Instructions

This is a full-stack notes application with a Next.js frontend and Node.js/Express backend.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd notes-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Seed the database with test users:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3001`

## Frontend Setup

1. Navigate to the root directory (if not already there):
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## Test Users

After running the seed script, you can use these test accounts:

- **Owner account:**
  - Username: `owner`
  - Password: `owner123`
  - Role: `owner` (can see all notes)

- **Regular user account:**
  - Username: `user`
  - Password: `user123`
  - Role: `user` (can only see today's notes)

## Features

### Frontend
- Rich text editor using TipTap
- Serbian language interface
- Authentication with JWT tokens
- Auto-save functionality
- Responsive design
- Notes management
- Price table functionality

### Backend
- RESTful API with Express.js
- SQLite database with Prisma ORM
- JWT authentication
- User roles (owner/user)
- CORS enabled for frontend communication

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/notes` - Get notes (filtered by user role)
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Project Structure

```
notes-app/
├── app/                    # Next.js app directory
│   ├── login/             # Login page
│   ├── table/             # Price table page
│   └── page.js            # Main notes page
├── components/            # React components
│   ├── tiptap-*          # TipTap editor components
│   └── AuthGuard.jsx     # Authentication guard
├── lib/                   # Utility functions
├── notes-backend/         # Backend application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── types/         # TypeScript types
│   └── prisma/            # Database schema and migrations
└── styles/                # SCSS styles
```

## Development

- Backend runs on port 3001
- Frontend runs on port 3000
- Database is SQLite (dev.db)
- Hot reload enabled for both frontend and backend

## Troubleshooting

1. **Database issues**: Run `npx prisma migrate reset` to reset the database
2. **Port conflicts**: Change ports in respective package.json files
3. **CORS issues**: Ensure backend CORS is properly configured
4. **Authentication issues**: Check JWT secret in backend environment
