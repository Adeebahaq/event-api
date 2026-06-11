// routes/registrationRoutes.js 
const express    = require("express");
const controller = require("../controllers/registrationController");

const router = express.Router();

router.post   ("/",    controller.registerUser);
router.delete ("/:id", controller.cancelRegistration);
router.get    ("/",    controller.listRegistrations);

module.exports = router;
