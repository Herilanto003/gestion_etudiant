const express = require("express");
const router = express.Router();
const etudiantController = require("../controllers/etudiantController");
const { validateEtudiant } = require("../middleware/validation");

// Routes pour les étudiants
router.get("/", etudiantController.getAllEtudiants);
router.get("/:id", etudiantController.getEtudiantById);
router.post("/", validateEtudiant, etudiantController.createEtudiant);
router.put("/:id", validateEtudiant, etudiantController.updateEtudiant);
router.delete("/:id", etudiantController.deleteEtudiant);
router.get("/:id/inscriptions", etudiantController.getEtudiantInscriptions);

module.exports = router;
