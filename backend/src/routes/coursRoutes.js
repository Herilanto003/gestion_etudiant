const express = require("express");
const router = express.Router();
const coursController = require("../controllers/coursController");
const { validateCours } = require("../middleware/validation");

// Routes pour les cours
router.get("/", coursController.getAllCours);
router.get("/:id", coursController.getCoursById);
router.post("/", validateCours, coursController.createCours);
router.put("/:id", validateCours, coursController.updateCours);
router.delete("/:id", coursController.deleteCours);
router.get("/:id/inscriptions", coursController.getCoursInscriptions);

module.exports = router;
