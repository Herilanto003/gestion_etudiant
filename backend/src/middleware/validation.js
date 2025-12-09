const validateEtudiant = (req, res, next) => {
  const { matricule, nom, prenom, dateNaissance, email } = req.body;

  const errors = [];

  if (!matricule || matricule.trim().length === 0) {
    errors.push("Le matricule est requis");
  }

  if (!nom || nom.trim().length === 0) {
    errors.push("Le nom est requis");
  }

  if (!prenom || prenom.trim().length === 0) {
    errors.push("Le prénom est requis");
  }

  if (!dateNaissance) {
    errors.push("La date de naissance est requise");
  } else if (isNaN(Date.parse(dateNaissance))) {
    errors.push("La date de naissance n'est pas valide");
  }

  if (!email || email.trim().length === 0) {
    errors.push("L'email est requis");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("L'email n'est pas valide");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateCours = (req, res, next) => {
  const { code, intitule, professeur } = req.body;

  const errors = [];

  if (!code || code.trim().length === 0) {
    errors.push("Le code du cours est requis");
  }

  if (!intitule || intitule.trim().length === 0) {
    errors.push("L'intitulé du cours est requis");
  }

  if (!professeur || professeur.trim().length === 0) {
    errors.push("Le nom du professeur est requis");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateInscription = (req, res, next) => {
  const { etudiantId, coursId, anneeAcademique, semestre } = req.body;

  const errors = [];

  if (!etudiantId || isNaN(etudiantId)) {
    errors.push("L'ID de l'étudiant est requis et doit être un nombre");
  }

  if (!coursId || isNaN(coursId)) {
    errors.push("L'ID du cours est requis et doit être un nombre");
  }

  if (!anneeAcademique || anneeAcademique.trim().length === 0) {
    errors.push("L'année académique est requise");
  } else if (!/^\d{4}-\d{4}$/.test(anneeAcademique)) {
    errors.push("L'année académique doit être au format YYYY-YYYY");
  }

  if (semestre && (semestre < 1 || semestre > 2)) {
    errors.push("Le semestre doit être 1 ou 2");
  }

  if (req.body.note && (req.body.note < 0 || req.body.note > 20)) {
    errors.push("La note doit être entre 0 et 20");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = {
  validateEtudiant,
  validateCours,
  validateInscription,
};
