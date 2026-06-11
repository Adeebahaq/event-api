// services/registrationService.js


const { v4: uuidv4 }                    = require("uuid");
const { readDB, writeDB, withLock }     = require("../db");
const { validateRegistrationInput }     = require("../utils/validators");
const { createError }                   = require("../middlewares/errorHandler");

async function registerUser({ userName, eventId })
{
  // 1. Validate input
  const validationError = validateRegistrationInput({ userName, eventId });
  if (validationError) throw createError(validationError, 400);

  // 2. All seat-related checks happen inside the lock to prevent overbooking
  return withLock(eventId, () =>
  {
    const db    = readDB();
    const event = db.events.find((e) => e.id === eventId);

    if (!event)  
        throw createError("Event not found.", 404);

    if (new Date(event.date) <= new Date()) 
      throw createError("Cannot register for a past event.", 400);

    const alreadyRegistered = db.registrations.find(
      (r) =>
        r.eventId === eventId &&
        r.userName.toLowerCase() === userName.trim().toLowerCase() &&
        r.status === "active"
    );

    if (alreadyRegistered)
       throw createError(`"${userName.trim()}" is already registered for this event.`, 409);

    if (event.availableSeats <= 0)
       throw createError("Event is full. No seats available.", 409);

    // 3. Create registration + decrement seat 
    const registration = {
      id:           uuidv4(),
      eventId,
      userName:     userName.trim(),
      status:       "active",
      registeredAt: new Date().toISOString(),
      cancelledAt:  null,
    };

    const eventIndex = db.events.findIndex((e) =>
    e.id === eventId);
    db.events[eventIndex].availableSeats -= 1;
    db.registrations.push(registration);
    writeDB(db);

    return { registration, availableSeats: db.events[eventIndex].availableSeats };
  });
}

async function cancelRegistration(registrationId)
{
  //  pre-lock check
  const db  = readDB();
  const reg = db.registrations.find(
    (r) => r.id === registrationId);

  if (!reg)  
      throw createError("Registration not found.", 404);
  if (reg.status === "cancelled") 
      throw createError("Registration is already cancelled.", 409);

  // Restore seat inside the lock
  return withLock(reg.eventId, () =>
    {
    const db2      = readDB();
    const regIdx   = db2.registrations.findIndex((r) => r.id === registrationId);
    const eventIdx = db2.events.findIndex((e) => e.id === reg.eventId);

    // Double-cancel guard 
    if (db2.registrations[regIdx].status === "cancelled") 
    {
      throw createError("Registration is already cancelled.", 409);
    }

    db2.registrations[regIdx].status      = "cancelled";
    db2.registrations[regIdx].cancelledAt = new Date().toISOString();

    if (eventIdx !== -1)
    {
      db2.events[eventIdx].availableSeats = Math.min(
        db2.events[eventIdx].availableSeats + 1,
        db2.events[eventIdx].totalSeats
      );
    }

    writeDB(db2);

    return {
      registration:   db2.registrations[regIdx],
      availableSeats: eventIdx !== -1 ? db2.events[eventIdx].availableSeats : null,
    };
  });
}

function listRegistrations({ eventId, userName, status })
 {
  const db = readDB();
  let registrations = db.registrations;

  if (eventId)  
       registrations = registrations.filter((r) => r.eventId === eventId);


  if (userName) 
    registrations = registrations.filter((r) => r.userName.toLowerCase() === userName.toLowerCase());

  registrations = registrations.filter((r) => r.status === (status || "active"));

  return registrations;
}

module.exports = { registerUser, cancelRegistration, listRegistrations };
