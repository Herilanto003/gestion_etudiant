import React, { useState, useEffect } from "react";

const EtudiantForm = ({ etudiant, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (etudiant) {
      setFormData({
        matricule: etudiant.matricule || "",
        nom: etudiant.nom || "",
        prenom: etudiant.prenom || "",
        dateNaissance: etudiant.dateNaissance
          ? new Date(etudiant.dateNaissance).toISOString().split("T")[0]
          : "",
        email: etudiant.email || "",
        telephone: etudiant.telephone || "",
        adresse: etudiant.adresse || "",
      });
    }
  }, [etudiant]);

  const validate = () => {
    const newErrors = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = "Le matricule est requis";
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }

    if (!formData.dateNaissance) {
      newErrors.dateNaissance = "La date de naissance est requise";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matricule */}
        <div>
          <label
            htmlFor="matricule"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Matricule <span className="text-red-400">*</span>
          </label>
          <input
            id="matricule"
            name="matricule"
            type="text"
            value={formData.matricule}
            onChange={handleChange}
            placeholder="ETU001"
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.matricule ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          />
          {errors.matricule && (
            <p className="mt-1 text-sm text-red-400">{errors.matricule}</p>
          )}
        </div>

        {/* Nom */}
        <div>
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Nom <span className="text-red-400">*</span>
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Dupont"
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.nom ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          />
          {errors.nom && (
            <p className="mt-1 text-sm text-red-400">{errors.nom}</p>
          )}
        </div>

        {/* Prénom */}
        <div>
          <label
            htmlFor="prenom"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Prénom <span className="text-red-400">*</span>
          </label>
          <input
            id="prenom"
            name="prenom"
            type="text"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Jean"
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.prenom ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          />
          {errors.prenom && (
            <p className="mt-1 text-sm text-red-400">{errors.prenom}</p>
          )}
        </div>

        {/* Date de naissance */}
        <div>
          <label
            htmlFor="dateNaissance"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Date de naissance <span className="text-red-400">*</span>
          </label>
          <input
            id="dateNaissance"
            name="dateNaissance"
            type="date"
            value={formData.dateNaissance}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.dateNaissance ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          />
          {errors.dateNaissance && (
            <p className="mt-1 text-sm text-red-400">{errors.dateNaissance}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jean.dupont@example.com"
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.email ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label
            htmlFor="telephone"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Téléphone
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="+1234567890"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Adresse */}
      <div>
        <label
          htmlFor="adresse"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          Adresse
        </label>
        <input
          id="adresse"
          name="adresse"
          type="text"
          value={formData.adresse}
          onChange={handleChange}
          placeholder="123 Rue de Paris"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : etudiant ? "Mettre à jour" : "Créer"}
        </button>
      </div>
    </div>
  );
};

export default EtudiantForm;
