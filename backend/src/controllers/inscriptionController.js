const prisma = require("../config/database");

// Récupérer toutes les inscriptions
exports.getAllInscriptions = async (req, res) => {
  try {
    const { anneeAcademique, semestre, etudiantId, coursId } = req.query;

    const whereClause = {};

    if (anneeAcademique) {
      whereClause.anneeAcademique = anneeAcademique;
    }

    if (semestre) {
      whereClause.semestre = parseInt(semestre);
    }

    if (etudiantId) {
      whereClause.etudiantId = parseInt(etudiantId);
    }

    if (coursId) {
      whereClause.coursId = parseInt(coursId);
    }

    const inscriptions = await prisma.inscription.findMany({
      where: whereClause,
      orderBy: { dateInscription: "desc" },
      include: {
        etudiant: true,
        cours: true,
      },
    });

    res.json(inscriptions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des inscriptions" });
  }
};

// Récupérer une inscription par son ID
exports.getInscriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const inscription = await prisma.inscription.findUnique({
      where: { id: parseInt(id) },
      include: {
        etudiant: true,
        cours: true,
      },
    });

    if (!inscription) {
      return res.status(404).json({ error: "Inscription non trouvée" });
    }

    res.json(inscription);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'inscription" });
  }
};

// Créer une nouvelle inscription
exports.createInscription = async (req, res) => {
  try {
    const { etudiantId, coursId, anneeAcademique, semestre } = req.body;

    // Vérifier si l'étudiant existe
    const etudiant = await prisma.etudiant.findUnique({
      where: { id: parseInt(etudiantId) },
    });

    if (!etudiant) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    // Vérifier si le cours existe
    const cours = await prisma.cours.findUnique({
      where: { id: parseInt(coursId) },
    });

    if (!cours) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    // Vérifier si l'inscription existe déjà
    const existingInscription = await prisma.inscription.findFirst({
      where: {
        etudiantId: parseInt(etudiantId),
        coursId: parseInt(coursId),
        anneeAcademique,
        semestre: semestre || 1,
      },
    });

    if (existingInscription) {
      return res
        .status(400)
        .json({
          error:
            "Cet étudiant est déjà inscrit à ce cours pour cette année et ce semestre",
        });
    }

    const inscription = await prisma.inscription.create({
      data: {
        etudiantId: parseInt(etudiantId),
        coursId: parseInt(coursId),
        anneeAcademique,
        semestre: semestre || 1,
      },
      include: {
        etudiant: true,
        cours: true,
      },
    });

    res.status(201).json(inscription);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'inscription" });
  }
};

// Mettre à jour une inscription (notamment pour ajouter/modifier une note)
exports.updateInscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    // Vérifier si l'inscription existe
    const existingInscription = await prisma.inscription.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingInscription) {
      return res.status(404).json({ error: "Inscription non trouvée" });
    }

    const updatedInscription = await prisma.inscription.update({
      where: { id: parseInt(id) },
      data: {
        note: note !== undefined ? parseFloat(note) : existingInscription.note,
      },
      include: {
        etudiant: true,
        cours: true,
      },
    });

    res.json(updatedInscription);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'inscription" });
  }
};

// Supprimer une inscription
exports.deleteInscription = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'inscription existe
    const existingInscription = await prisma.inscription.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingInscription) {
      return res.status(404).json({ error: "Inscription non trouvée" });
    }

    await prisma.inscription.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'inscription" });
  }
};

// Obtenir les statistiques d'inscription
exports.getInscriptionStats = async (req, res) => {
  try {
    const { anneeAcademique } = req.query;

    const whereClause = {};

    if (anneeAcademique) {
      whereClause.anneeAcademique = anneeAcademique;
    }

    // Nombre total d'inscriptions
    const totalInscriptions = await prisma.inscription.count({
      where: whereClause,
    });

    // Nombre d'étudiants inscrits
    const etudiantsInscrits = await prisma.inscription.groupBy({
      by: ["etudiantId"],
      where: whereClause,
      _count: true,
    });

    // Nombre de cours avec inscriptions
    const coursAvecInscriptions = await prisma.inscription.groupBy({
      by: ["coursId"],
      where: whereClause,
      _count: true,
    });

    // Moyenne des notes par cours
    const moyenneNotes = await prisma.inscription.groupBy({
      by: ["coursId"],
      where: {
        ...whereClause,
        note: { not: null },
      },
      _avg: {
        note: true,
      },
    });

    res.json({
      totalInscriptions,
      totalEtudiants: etudiantsInscrits.length,
      totalCours: coursAvecInscriptions.length,
      moyenneNotes: moyenneNotes.map((item) => ({
        coursId: item.coursId,
        moyenne: item._avg.note,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des statistiques" });
  }
};
