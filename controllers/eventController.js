// controllers/eventController.js


/** 
  HTTP layer for events.
  Responsibilities:
      Extract data from req
      Call the service
      Send the response or pass error to next

*/

const eventService = require("../services/eventService");

function createEvent(req, res, next)
{
  try {
    const event = eventService.createEvent(req.body);
    res.status(201).json({ message: "Event created successfully.", event });
  } 
  catch (err) 
  {
    next(err);  // errorHandler middleware
  }
}

function listEvents(req, res, next) 
{
  try {
    const events = eventService.listEvents(req.query);
    res.json({ count: events.length, events });
  } 
  catch (err) 
  {
    next(err);
  }
}

function getEvent(req, res, next)
 {
  try
  {
    const event = eventService.getEventById(req.params.id);
    res.json(event);
  }
  catch (err)
  {
    next(err);
  }
}

module.exports = { createEvent, listEvents, getEvent };
