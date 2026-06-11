// utils/validators.js
//
// Pvalidation functions 
function validateEventInput({ name, totalSeats, date }) 
{
  if (!name || typeof name !== "string" || !name.trim()) 
  {
    return "Event name is required.";
  }

  if (
    totalSeats === undefined || totalSeats === null ||
    typeof totalSeats !== "number" || !Number.isInteger(totalSeats) ||totalSeats <= 0 ) 
  {
    return "totalSeats must be a positive integer greater than 0.";
  }

  if (!date) 
  {
    return "Event date is required.";
  }

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) 
  {
    return "Invalid date format. Use ISO 8601 (e.g. 2027-12-31T18:00:00Z).";
  }

  if (parsed <= new Date()) 
  {
    return "Event date must be in the future.";
  }

  return null;
}

function validateRegistrationInput({ userName, eventId })
{
  if (!userName || typeof userName !== "string" || !userName.trim())
  {
    return "userName is required.";
  }

  if (!eventId || typeof eventId !== "string" || !eventId.trim())
  {
    return "eventId is required.";
  }

  return null;
}

module.exports = { validateEventInput, validateRegistrationInput };
