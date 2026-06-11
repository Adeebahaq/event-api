// controllers/registrationController.js


/** 
 HTTP layer for registrations.
 Responsibilities:
  1. Extract data from req
  2. Call the service
  3. Send the response (or pass error to next)

*/



const registrationService = require("../services/registrationService");

async function registerUser(req, res, next)
{
  try
  {
    const { registration, availableSeats } = await registrationService.registerUser(req.body);
    res.status(201).json({ message: "Registration successful.", registration, availableSeats });
  }
   catch (err)
  {
    next(err);
  }
}

async function cancelRegistration(req, res, next)
{
  try 
  {
    const { registration, availableSeats } = await registrationService.cancelRegistration(req.params.id);
    res.json({ message: "Registration cancelled successfully.", registration, availableSeats });
  } 
  catch (err) 
  {
    next(err);
  }
}

function listRegistrations(req, res, next)
{
  try
  {
    const registrations = registrationService.listRegistrations(req.query);
    res.json({ count: registrations.length, registrations });
  } 
  catch (err)
  {
    next(err);
  }
}

module.exports = { registerUser, cancelRegistration, listRegistrations };
