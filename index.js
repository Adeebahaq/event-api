// index.js
const express = require("express");

const eventRoutes        = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const { errorHandler }   = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());

// Routes 
app.use("/events",        eventRoutes);
app.use("/registrations", registrationRoutes);

// Health Check 
app.get("/", (req, res) =>
  {
  res.json(
    {
    message: "Event Registration API",
    endpoints: {
      "POST   /events":            "Create event",
      "GET    /events":            "List events  (?upcoming=true & ?sort=asc|desc)",
      "GET    /events/:id":        "Event details + active registrations",
      "POST   /registrations":     "Register user for event",
      "DELETE /registrations/:id": "Cancel registration",
      "GET    /registrations":     "List registrations (?eventId & ?userName & ?status)",
    },
  });
});

// Not found
app.use((req, res) =>
{
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Middleware 
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nEvent Registration API  →  http://localhost:${PORT}\n`);
});

module.exports = app;
