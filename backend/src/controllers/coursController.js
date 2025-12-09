const prisma = require("../config/database");

// Récupérer tous les cours
exports.getAllCours = async (req, res) => {
  try {
    const { intitule, professeur } = req.query;

    const whereClause = {};

    if (intitule) {
      whereClause.intitule = { contains: intitule, mode: "insensitive" };
    }

    if (professeur) {
      whereClause.professeur = { contains: professeur, mode: "insensitive" };
    }

    const cours = await prisma.cours.findMany({
      where: whereClause,
      orderBy: { intitule: "asc" },
      include: {
        inscriptions: {
          include: {
            etudiant: true,
          },
        },
      },
    });

    res.json(cours);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des cours" });
  }
};

// Récupérer un cours par son ID
exports.getCoursById = async (req, res) => {
  try {
    const { id } = req.params;

    const cours = await prisma.cours.findUnique({
      where: { id: parseInt(id) },
      include: {
        inscriptions: {
          include: {
            etudiant: true,
          },
        },
      },
    });

    if (!cours) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    res.json(cours);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du cours" });
  }
};

// Créer un nouveau cours
exports.createCours = async (req, res) => {
  try {
    const { code, intitule, description, credits, professeur } = req.body;

    // Vérifier si le code existe déjà
    const existingCours = await prisma.cours.findUnique({
      where: { code },
    });

    if (existingCours) {
      return res
        .status(400)
        .json({ error: "Un cours avec ce code existe déjà" });
    }

    const cours = await prisma.cours.create({
      data: {
        code,
        intitule,
        description,
        credits: credits || 3,
        professeur,
      },
    });

    res.status(201).json(cours);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du cours" });
  }
};

// Mettre à jour un cours
exports.updateCours = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, intitule, description, credits, professeur } = req.body;

    // Vérifier si le cours existe
    const existingCours = await prisma.cours.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCours) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    // Vérifier si le nouveau code existe déjà (sauf pour le cours courant)
    if (code && code !== existingCours.code) {
      const duplicate = await prisma.cours.findUnique({
        where: { code },
      });

      if (duplicate) {
        return res
          .status(400)
          .json({ error: "Un autre cours avec ce code existe déjà" });
      }
    }

    const updatedCours = await prisma.cours.update({
      where: { id: parseInt(id) },
      data: {
        code: code || existingCours.code,
        intitule: intitule || existingCours.intitule,
        description:
          description !== undefined ? description : existingCours.description,
        credits: credits !== undefined ? credits : existingCours.credits,
        professeur: professeur || existingCours.professeur,
      },
    });

    res.json(updatedCours);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du cours" });
  }
};

// Supprimer un cours
exports.deleteCours = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le cours existe
    const existingCours = await prisma.cours.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCours) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    await prisma.cours.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du cours" });
  }
};

// Récupérer les étudiants inscrits à un cours
exports.getCoursInscriptions = async (req, res) => {
  try {
    const { id } = req.params;

    const cours = await prisma.cours.findUnique({
      where: { id: parseInt(id) },
      include: {
        inscriptions: {
          include: {
            etudiant: true,
          },
        },
      },
    });

    if (!cours) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    res.json(cours.inscriptions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des inscriptions" });
  }
};
