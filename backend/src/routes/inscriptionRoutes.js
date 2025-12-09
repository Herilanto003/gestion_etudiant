const express = require("express");
const router = express.Router();
const inscriptionController = require("../controllers/inscriptionController");
const { validateInscription } = require("../middleware/validation");

// Routes pour les inscriptions
router.get("/", inscriptionController.getAllInscriptions);
router.get("/stats", inscriptionController.getInscriptionStats);
router.get("/:id", inscriptionController.getInscriptionById);
router.post("/", validateInscription, inscriptionController.createInscription);
router.put(
  "/:id",
  validateInscription,
  inscriptionController.updateInscription
);
router.delete("/:id", inscriptionController.deleteInscription);

module.exports = router;
