# Event Registration System API

A simple Event Registration System API built with Node.js and Express.js.

## Features
- Create events with seat limits and future dates
- Register users for events
- Prevent duplicate registrations
- Handle full event constraints
- Cancel registrations
- View events with available seats and sorting

## Rules
- Event name must be unique
- Total seats must be greater than 0
- Event date must be in the future
- Users cannot register twice for the same event
- Cannot register if event is full

## Tech Stack
- Node.js
- JSON file storage

## Setup

```bash
git clone https://github.com/Adeebahaq/event-api
cd event-api
npm install
npm start
```

## API Endpoints
Create Event
POST /events
Register User
POST /register
View Events
GET /events
Cancel Registration
DELETE /cancel
Notes
Handles race conditions and duplicate requests
Ensures accurate seat count



