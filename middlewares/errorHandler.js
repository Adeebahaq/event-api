// middlewares/errorHandler.js

// Single place where ALL errors land.


function errorHandler(err, req, res, next)
{       
  const status  = err.status  || 500;
  const message = err.message || "Unexpected server error.";

  
  if (status >= 500) {
    console.error(`[${new Date().toISOString()}] 500 Error:`, err.stack);
  }

  res.status(status).json({ error: message });
}

// attach a status code to error before throwing
function createError(message, status)
{
  const err  = new Error(message);
  err.status = status;
  return err;
}

module.exports = { errorHandler, createError };
