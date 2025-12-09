import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiBook,
  FiUser,
  FiClock,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import { coursApi } from "../services/api";
import toast from "react-hot-toast";

const Cours = () => {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCours, setSelectedCours] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    intitule: "",
    description: "",
    credits: 3,
    professeur: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  const fetchCours = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? { intitule: searchTerm } : {};
      const response = await coursApi.getAll(params);
      setCours(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCours();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCours();
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = "Le code est requis";
    if (!formData.intitule.trim()) errors.intitule = "L'intitulé est requis";
    if (!formData.professeur.trim())
      errors.professeur = "Le professeur est requis";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormLoading(true);
      if (selectedCours) {
        await coursApi.update(selectedCours.id, formData);
        toast.success("Cours mis à jour avec succès");
      } else {
        await coursApi.create(formData);
        toast.success("Cours créé avec succès");
      }
      setIsModalOpen(false);
      setSelectedCours(null);
      setFormData({
        code: "",
        intitule: "",
        description: "",
        credits: 3,
        professeur: "",
      });
      fetchCours();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors de l'opération");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (cours) => {
    setSelectedCours(cours);
    setFormData({
      code: cours.code,
      intitule: cours.intitule,
      description: cours.description || "",
      credits: cours.credits,
      professeur: cours.professeur,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (cours) => {
    if (window.confirm(`Supprimer le cours "${cours.intitule}" ?`)) {
      try {
        await coursApi.delete(cours.id);
        toast.success("Cours supprimé avec succès");
        fetchCours();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const CoursForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Code du cours <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => {
              setFormData({ ...formData, code: e.target.value });
              if (formErrors.code) setFormErrors({ ...formErrors, code: "" });
            }}
            placeholder="MATH101"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              formErrors.code ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all`}
          />
          {formErrors.code && (
            <p className="mt-2 text-sm text-red-400">{formErrors.code}</p>
          )}
        </div>

        {/* Intitulé */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Intitulé <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.intitule}
            onChange={(e) => {
              setFormData({ ...formData, intitule: e.target.value });
              if (formErrors.intitule)
                setFormErrors({ ...formErrors, intitule: "" });
            }}
            placeholder="Mathématiques Avancées"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              formErrors.intitule ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all`}
          />
          {formErrors.intitule && (
            <p className="mt-2 text-sm text-red-400">{formErrors.intitule}</p>
          )}
        </div>

        {/* Crédits */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Nombre de crédits
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.credits}
            onChange={(e) =>
              setFormData({ ...formData, credits: parseInt(e.target.value) })
            }
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
          />
        </div>

        {/* Professeur */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Professeur <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.professeur}
            onChange={(e) => {
              setFormData({ ...formData, professeur: e.target.value });
              if (formErrors.professeur)
                setFormErrors({ ...formErrors, professeur: "" });
            }}
            placeholder="Dr. Martin"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              formErrors.professeur ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all`}
          />
          {formErrors.professeur && (
            <p className="mt-2 text-sm text-red-400">{formErrors.professeur}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          placeholder="Description du cours..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(false);
            setSelectedCours(null);
          }}
          className="px-6 py-3 text-gray-300 font-medium hover:text-white hover:bg-gray-800 rounded-lg transition-all"
          disabled={formLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={formLoading}
        >
          {formLoading
            ? "Enregistrement..."
            : selectedCours
            ? "Mettre à jour"
            : "Créer"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Cours</h2>
          <p className="text-gray-400">Gestion des cours académiques</p>
        </div>

        <Button
          onClick={() => {
            setSelectedCours(null);
            setFormData({
              code: "",
              intitule: "",
              description: "",
              credits: 3,
              professeur: "",
            });
            setIsModalOpen(true);
          }}
        >
          <FiPlus className="w-5 h-5" />
          Nouveau cours
        </Button>
      </div>

      {/* Search */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="secondary" onClick={handleSearch}>
              <FiSearch className="w-4 h-4" />
              Rechercher
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                fetchCours();
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      {/* Cours List */}
      {loading ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Chargement des cours...</p>
        </div>
      ) : cours.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <FiBook className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Aucun cours trouvé
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm
              ? "Aucun cours ne correspond à votre recherche"
              : "Commencez par créer un nouveau cours"}
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <FiPlus className="w-5 h-5" />
            Créer un cours
          </Button>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Intitulé
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Professeur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Crédits
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Inscriptions
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {cours.map((coursItem) => (
                  <tr
                    key={coursItem.id}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          <FiBook className="w-5 h-5 text-gray-300" />
                        </div>
                        <span className="font-semibold text-white">
                          {coursItem.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white mb-1">
                          {coursItem.intitule}
                        </p>
                        {coursItem.description && (
                          <p className="text-sm text-gray-400 truncate max-w-xs">
                            {coursItem.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <FiUser className="w-4 h-4" />
                        <span>{coursItem.professeur}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-gray-800 text-sm font-medium text-white">
                        {coursItem.credits} crédits
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <FiClock className="w-4 h-4" />
                        <span className="font-medium">
                          {coursItem.inscriptions?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(coursItem)}
                          className="p-2 rounded-lg hover:bg-gray-800 transition-colors group"
                          title="Modifier"
                        >
                          <FiEdit2 className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(coursItem)}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group"
                          title="Supprimer"
                        >
                          <FiTrash2 className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCours(null);
        }}
        title={selectedCours ? "Modifier le cours" : "Nouveau cours"}
        size="lg"
      >
        <CoursForm />
      </Modal>
    </div>
  );
};

export default Cours;
