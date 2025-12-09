import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiUser,
  FiBook,
  FiCalendar,
  FiTrendingUp,
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { inscriptionApi, etudiantApi, coursApi } from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

// Composant Modal amélioré
const Modal = ({ isOpen, onClose, title, children, size = "lg" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-gray-900 rounded-xl shadow-2xl ${
          size === "lg" ? "max-w-2xl" : "max-w-md"
        } w-full max-h-[90vh] overflow-y-auto border border-gray-800`}
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Composant Button amélioré
const Button = ({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
}) => {
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary:
      "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700",
    outline: "border border-gray-700 text-gray-300 hover:bg-gray-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

const Inscriptions = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInscription, setSelectedInscription] = useState(null);
  const [formData, setFormData] = useState({
    etudiantId: "",
    coursId: "",
    anneeAcademique: "",
    semestre: "1",
    note: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inscriptionsRes, etudiantsRes, coursRes, statsRes] =
        await Promise.all([
          inscriptionApi.getAll(),
          etudiantApi.getAll(),
          coursApi.getAll(),
          inscriptionApi.getStats(),
        ]);
      setInscriptions(inscriptionsRes.data);
      setEtudiants(etudiantsRes.data);
      setCours(coursRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.etudiantId) errors.etudiantId = "L'étudiant est requis";
    if (!formData.coursId) errors.coursId = "Le cours est requis";
    if (!formData.anneeAcademique)
      errors.anneeAcademique = "L'année académique est requise";
    if (!/^\d{4}-\d{4}$/.test(formData.anneeAcademique)) {
      errors.anneeAcademique = "Format invalide (ex: 2023-2024)";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormLoading(true);
      const data = {
        ...formData,
        etudiantId: parseInt(formData.etudiantId),
        coursId: parseInt(formData.coursId),
        semestre: parseInt(formData.semestre),
        note: formData.note ? parseFloat(formData.note) : null,
      };

      if (selectedInscription) {
        await inscriptionApi.update(selectedInscription.id, data);
        toast.success("Inscription mise à jour avec succès");
      } else {
        await inscriptionApi.create(data);
        toast.success("Inscription créée avec succès");
      }
      setIsModalOpen(false);
      setSelectedInscription(null);
      setFormData({
        etudiantId: "",
        coursId: "",
        anneeAcademique: "",
        semestre: "1",
        note: "",
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors de l'opération");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (inscription) => {
    setSelectedInscription(inscription);
    setFormData({
      etudiantId: inscription.etudiantId.toString(),
      coursId: inscription.coursId.toString(),
      anneeAcademique: inscription.anneeAcademique,
      semestre: inscription.semestre.toString(),
      note: inscription.note ? inscription.note.toString() : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (inscription) => {
    if (window.confirm("Supprimer cette inscription ?")) {
      try {
        await inscriptionApi.delete(inscription.id);
        toast.success("Inscription supprimée avec succès");
        fetchData();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const InscriptionForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Étudiant */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Étudiant <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.etudiantId}
            onChange={(e) => {
              setFormData({ ...formData, etudiantId: e.target.value });
              if (formErrors.etudiantId)
                setFormErrors({ ...formErrors, etudiantId: "" });
            }}
            className={`w-full px-4 py-3 bg-gray-800 border ${
              formErrors.etudiantId ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all`}
            required
          >
            <option value="">Sélectionner un étudiant</option>
            {etudiants.map((etudiant) => (
              <option key={etudiant.id} value={etudiant.id}>
                {etudiant.prenom} {etudiant.nom} ({etudiant.matricule})
              </option>
            ))}
          </select>
          {formErrors.etudiantId && (
            <p className="mt-2 text-sm text-red-400">{formErrors.etudiantId}</p>
          )}
        </div>

        {/* Cours */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Cours <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.coursId}
            onChange={(e) => {
              setFormData({ ...formData, coursId: e.target.value });
              if (formErrors.coursId)
                setFormErrors({ ...formErrors, coursId: "" });
            }}
            className={`w-full px-4 py-3 bg-gray-800 border ${
              formErrors.coursId ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all`}
            required
          >
            <option value="">Sélectionner un cours</option>
            {cours.map((coursItem) => (
              <option key={coursItem.id} value={coursItem.id}>
                {coursItem.intitule} ({coursItem.code})
              </option>
            ))}
          </select>
          {formErrors.coursId && (
            <p className="mt-2 text-sm text-red-400">{formErrors.coursId}</p>
          )}
        </div>

        {/* Année académique */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Année académique <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.anneeAcademique}
            onChange={(e) => {
              setFormData({ ...formData, anneeAcademique: e.target.value });
              if (formErrors.anneeAcademique)
                setFormErrors({ ...formErrors, anneeAcademique: "" });
            }}
            placeholder="2023-2024"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              formErrors.anneeAcademique ? "border-red-500" : "border-gray-700"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all`}
            required
          />
          {formErrors.anneeAcademique && (
            <p className="mt-2 text-sm text-red-400">
              {formErrors.anneeAcademique}
            </p>
          )}
        </div>

        {/* Semestre */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Semestre <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.semestre}
            onChange={(e) =>
              setFormData({ ...formData, semestre: e.target.value })
            }
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
            required
          >
            <option value="1">Semestre 1</option>
            <option value="2">Semestre 2</option>
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Note (optionnelle)
          </label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.5"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="0-20"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(false);
            setSelectedInscription(null);
          }}
          className="px-6 py-3 text-gray-300 font-medium hover:text-white hover:bg-gray-800 rounded-lg transition-all"
          disabled={formLoading}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={formLoading}
        >
          {formLoading
            ? "Enregistrement..."
            : selectedInscription
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
          <h2 className="text-3xl font-bold text-white mb-1">Inscriptions</h2>
          <p className="text-gray-400">Gestion des inscriptions aux cours</p>
        </div>

        <Button
          onClick={() => {
            setSelectedInscription(null);
            setFormData({
              etudiantId: "",
              coursId: "",
              anneeAcademique: "",
              semestre: "1",
              note: "",
            });
            setIsModalOpen(true);
          }}
        >
          <FiPlus className="w-5 h-5" />
          Nouvelle inscription
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total inscriptions</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalInscriptions}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <FiUser className="w-7 h-7 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Étudiants inscrits</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalEtudiants}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <FiBook className="w-7 h-7 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Cours actifs</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalCours}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10">
                <FiCalendar className="w-7 h-7 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Moyenne notes</p>
                <p className="text-3xl font-bold text-white">
                  {stats.moyenneNotes?.[0]?.moyenne?.toFixed(1) || "0.0"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <FiTrendingUp className="w-7 h-7 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="secondary">
              <FiSearch className="w-4 h-4" />
              Rechercher
            </Button>

            <Button variant="outline">
              <FiFilter className="w-4 h-4" />
              Filtres
            </Button>
          </div>
        </div>
      </div>

      {/* Inscriptions List */}
      {loading ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Chargement des inscriptions...</p>
        </div>
      ) : inscriptions.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <FiCalendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Aucune inscription
          </h3>
          <p className="text-gray-400 mb-6">
            Commencez par créer une nouvelle inscription
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <FiPlus className="w-5 h-5" />
            Créer une inscription
          </Button>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Cours
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Année/Semestre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {inscriptions.map((inscription) => (
                  <tr
                    key={inscription.id}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-gray-300" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {inscription.etudiant?.prenom}{" "}
                            {inscription.etudiant?.nom}
                          </p>
                          <p className="text-sm text-gray-400">
                            {inscription.etudiant?.matricule}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">
                          {inscription.cours?.intitule}
                        </p>
                        <p className="text-sm text-gray-400">
                          {inscription.cours?.code}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-gray-800 text-sm font-medium text-white">
                        {inscription.anneeAcademique} - S{inscription.semestre}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {inscription.note ? (
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            inscription.note >= 10
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {inscription.note}/20
                        </span>
                      ) : (
                        <span className="text-gray-400">Non noté</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {format(
                        new Date(inscription.dateInscription),
                        "dd/MM/yyyy"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(inscription)}
                          className="p-2 rounded-lg hover:bg-gray-800 transition-colors group"
                          title="Modifier"
                        >
                          <FiEdit2 className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(inscription)}
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
          setSelectedInscription(null);
        }}
        title={
          selectedInscription
            ? "Modifier l'inscription"
            : "Nouvelle inscription"
        }
        size="lg"
      >
        <InscriptionForm />
      </Modal>
    </div>
  );
};

export default Inscriptions;
