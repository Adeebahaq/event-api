// routes/eventRoutes.js 
const express    = require("express");
const controller = require("../controllers/eventController");

const router = express.Router();

router.post  ("/",    controller.createEvent);
router.get   ("/",    controller.listEvents);
router.get   ("/:id", controller.getEvent);

module.exports = router;
