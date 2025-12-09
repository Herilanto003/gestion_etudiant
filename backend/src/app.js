const express = require("express");
const cors = require("cors");
require("dotenv").config();

const etudiantRoutes = require("./routes/etudiantRoutes");
const coursRoutes = require("./routes/coursRoutes");
const inscriptionRoutes = require("./routes/inscriptionRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/etudiants", etudiantRoutes);
app.use("/api/cours", coursRoutes);
app.use("/api/inscriptions", inscriptionRoutes);

// Route d'accueil
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue dans l'API de gestion des étudiants",
    endpoints: {
      étudiants: "/api/etudiants",
      cours: "/api/cours",
      inscriptions: "/api/inscriptions",
    },
    documentation:
      "Consultez le README pour plus d'informations sur l'utilisation de l'API",
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV}`);
  console.log(`URL: http://localhost:${PORT}`);
});

module.exports = app;
