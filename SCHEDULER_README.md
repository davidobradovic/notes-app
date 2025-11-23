# Scheduler Feature

This document describes the new scheduler feature added to the notes app.

## Features

- **Calendar View**: Full calendar with month, week, and day views
- **Event Management**: Create, edit, and delete events
- **User Authentication**: Events are tied to authenticated users
- **Responsive Design**: Works on desktop and mobile devices
- **Serbian Localization**: Interface in Serbian language

## Backend API Endpoints

The scheduler uses the following API endpoints:

### Events
- `GET /api/events` - Get all events for the authenticated user
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an existing event
- `DELETE /api/events/:id` - Delete an event

### Event Data Structure
```json
{
  "id": 1,
  "title": "Meeting",
  "description": "Team meeting",
  "start": "2024-01-15T10:00:00Z",
  "end": "2024-01-15T11:00:00Z",
  "allDay": false,
  "createdAt": "2024-01-15T09:00:00Z",
  "updatedAt": "2024-01-15T09:00:00Z",
  "userId": 1
}
```

## Database Schema

The scheduler uses a new `Event` model in the Prisma schema:

```prisma
model Event {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  start       DateTime
  end         DateTime
  allDay      Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
}
```

## How to Use

1. **Access the Scheduler**: Navigate to `/scheduler` in the app
2. **Create Events**: Click on "Dodaj događaj" button or click on a time slot in the calendar
3. **Edit Events**: Click on an existing event to edit it
4. **Delete Events**: Open an event and click the delete button
5. **View Events**: Switch between month, week, and day views

## Navigation

The scheduler is accessible from:
- Main navigation bar on all pages
- Direct URL: `/scheduler`

## Dependencies Added

- `react-big-calendar`: Calendar component
- `moment`: Date manipulation library

## Setup Instructions

1. The database migration has already been applied
2. The backend routes are configured
3. The frontend component is ready to use
4. Start both servers:
   - Backend: `cd notes-backend && npm run dev`
   - Frontend: `npm run dev`

## Features Included

✅ Calendar with multiple views (month/week/day)  
✅ Create, edit, and delete events  
✅ User authentication and data isolation  
✅ Responsive design for mobile and desktop  
✅ Serbian language interface  
✅ Navigation between all app pages  
✅ Auto-save functionality  
✅ Event validation  

The scheduler is now fully integrated into your notes app!
