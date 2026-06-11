# Event Registration System API

A simple Event Registration System API built with Node.js 
## Features
- Create events with seat limits and future dates
- Register users for events
- Prevent duplicate registrations
- Handle full event constraints
- Cancel registrations
- View events with available seats and sorting

## Setup

```bash
git clone https://github.com/Adeebahaq/event-api
cd event-api
npm install
node  index.js
 ```
Server runs at `http://localhost:3000`
 
---
 
## Endpoints
 
| Method | URL | Description |
|---|---|---|
| GET | /events | List all events |
| POST | /events | Create an event |
| GET | /events/:id | Get one event |
| POST | /registrations | Register a user |
| DELETE | /registrations/:id | Cancel registration |
| GET | /registrations | List registrations |
 
---
 
##  Examples
 
**Create event**
```bash
POST /events
{ "name": "My Event", "totalSeats": 10, "date": "2027-09-01T10:00:00Z" }
```
 
**Register user**
```bash
POST /registrations
{ "userName": "Alice", "eventId": "your-event-id" }
```
 
**Cancel**
```bash
DELETE /registrations/your-registration-id
```
 
---
 
## Rules
 
- Event name must be unique
- Event date must be in the future
- Seats must be greater than 0
- Same user can't register twice for the same event
- Cancelling a registration restores the seat