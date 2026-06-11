// services/eventService.js

//  business logic for events.
//Throws errors with status codes attached.
// The controller catches those and passes them to errorHandler via next(err).

const { v4: uuidv4 }              = require("uuid");
const { readDB, writeDB }         = require("../db");
const { validateEventInput }      = require("../utils/validators");
const { createError }             = require("../middlewares/errorHandler");

function createEvent({ name, totalSeats, date }) {
  // 1. Validate input
  const validationError = validateEventInput({ name, totalSeats, date });
  if (validationError) throw createError(validationError, 400);

  const db = readDB();

  // 2. Unique name check (case-insensitive)
  const duplicate = db.events.find(
    (e) => e.name.toLowerCase() === name.trim().toLowerCase()
  );
  if (duplicate) throw createError(`An event named "${name.trim()}" already exists.`, 409);

  // 3. Build and persist
  const event =
  {
    id:             uuidv4(),
    name:           name.trim(),
    totalSeats,
    availableSeats: totalSeats,
    date:           new Date(date).toISOString(),
    createdAt:      new Date().toISOString(),
  };

  db.events.push(event);
  writeDB(db);

  return event;
}

function listEvents({ upcoming, sort })
{
  const db = readDB();

  let events = db.events.map((event) => 
  {
    const totalRegistrations = db.registrations.filter(
      (r) => r.eventId === event.id && r.status === "active"
    ).length;
    return { ...event, totalRegistrations };
  });

  if (upcoming === "true") {
    const now = new Date();
    events = events.filter((e) => new Date(e.date) > now);
  }

  const order = sort === "desc" ? -1 : 1;
  events.sort((a, b) => order * (new Date(a.date) - new Date(b.date)));

  return events;
}

function getEventById(id)
{
  const db    = readDB();
  const event = db.events.find((e) => e.id === id);

  if (!event) throw createError("Event not found.", 404);

  const registrations = db.registrations.filter(
    (r) => r.eventId === event.id && r.status === "active"
  );

  return { ...event, totalRegistrations: registrations.length, registrations };
}

module.exports = { createEvent, listEvents, getEventById };
