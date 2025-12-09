const prisma = require("../config/database");

// Récupérer tous les étudiants
exports.getAllEtudiants = async (req, res) => {
  try {
    const { nom, prenom, email } = req.query;

    const whereClause = {};

    if (nom) {
      whereClause.nom = { contains: nom, mode: "insensitive" };
    }

    if (prenom) {
      whereClause.prenom = { contains: prenom, mode: "insensitive" };
    }

    if (email) {
      whereClause.email = { contains: email, mode: "insensitive" };
    }

    const etudiants = await prisma.etudiant.findMany({
      where: whereClause,
      orderBy: { nom: "asc" },
      include: {
        inscriptions: {
          include: {
            cours: true,
          },
        },
      },
    });

    res.json(etudiants);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des étudiants" });
  }
};

// Récupérer un étudiant par son ID
exports.getEtudiantById = async (req, res) => {
  try {
    const { id } = req.params;

    const etudiant = await prisma.etudiant.findUnique({
      where: { id: parseInt(id) },
      include: {
        inscriptions: {
          include: {
            cours: true,
          },
        },
      },
    });

    if (!etudiant) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    res.json(etudiant);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'étudiant" });
  }
};

// Créer un nouvel étudiant
exports.createEtudiant = async (req, res) => {
  try {
    const { matricule, nom, prenom, dateNaissance, email, telephone, adresse } =
      req.body;

    // Vérifier si le matricule ou l'email existe déjà
    const existingEtudiant = await prisma.etudiant.findFirst({
      where: {
        OR: [{ matricule }, { email }],
      },
    });

    if (existingEtudiant) {
      return res.status(400).json({
        error:
          existingEtudiant.matricule === matricule
            ? "Un étudiant avec ce matricule existe déjà"
            : "Un étudiant avec cet email existe déjà",
      });
    }

    const etudiant = await prisma.etudiant.create({
      data: {
        matricule,
        nom,
        prenom,
        dateNaissance: new Date(dateNaissance),
        email,
        telephone,
        adresse,
      },
    });

    res.status(201).json(etudiant);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'étudiant" });
  }
};

// Mettre à jour un étudiant
exports.updateEtudiant = async (req, res) => {
  try {
    const { id } = req.params;
    const { matricule, nom, prenom, dateNaissance, email, telephone, adresse } =
      req.body;

    // Vérifier si l'étudiant existe
    const existingEtudiant = await prisma.etudiant.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingEtudiant) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    // Vérifier si le nouveau matricule ou email existe déjà (sauf pour l'étudiant courant)
    if (
      matricule !== existingEtudiant.matricule ||
      email !== existingEtudiant.email
    ) {
      const duplicate = await prisma.etudiant.findFirst({
        where: {
          AND: [
            { id: { not: parseInt(id) } },
            {
              OR: [{ matricule }, { email }],
            },
          ],
        },
      });

      if (duplicate) {
        return res.status(400).json({
          error:
            duplicate.matricule === matricule
              ? "Un autre étudiant avec ce matricule existe déjà"
              : "Un autre étudiant avec cet email existe déjà",
        });
      }
    }

    const updatedEtudiant = await prisma.etudiant.update({
      where: { id: parseInt(id) },
      data: {
        matricule,
        nom,
        prenom,
        dateNaissance: dateNaissance
          ? new Date(dateNaissance)
          : existingEtudiant.dateNaissance,
        email,
        telephone,
        adresse,
      },
    });

    res.json(updatedEtudiant);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'étudiant" });
  }
};

// Supprimer un étudiant
exports.deleteEtudiant = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'étudiant existe
    const existingEtudiant = await prisma.etudiant.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingEtudiant) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    await prisma.etudiant.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'étudiant" });
  }
};

// Récupérer les inscriptions d'un étudiant
exports.getEtudiantInscriptions = async (req, res) => {
  try {
    const { id } = req.params;

    const etudiant = await prisma.etudiant.findUnique({
      where: { id: parseInt(id) },
      include: {
        inscriptions: {
          include: {
            cours: true,
          },
        },
      },
    });

    if (!etudiant) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    res.json(etudiant.inscriptions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des inscriptions" });
  }
};
