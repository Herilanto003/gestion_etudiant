import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import Button from "../common/Button";
import Input from "../common/Input";
import EtudiantCard from "./EtudiantCard";
import Modal from "../common/Modal";
import EtudiantForm from "./EtudiantForm";
import { etudiantApi } from "../../services/api";
import toast from "react-hot-toast";

const EtudiantList = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchEtudiants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) {
        params.nom = searchTerm;
      }
      const response = await etudiantApi.getAll(params);
      setEtudiants(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des étudiants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEtudiants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEtudiants();
  };

  const handleCreate = async (data) => {
    try {
      setFormLoading(true);
      await etudiantApi.create(data);
      toast.success("Étudiant créé avec succès");
      setIsModalOpen(false);
      fetchEtudiants();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors de la création");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setFormLoading(true);
      await etudiantApi.update(selectedEtudiant.id, data);
      toast.success("Étudiant mis à jour avec succès");
      setIsModalOpen(false);
      setSelectedEtudiant(null);
      fetchEtudiants();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Erreur lors de la mise à jour"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (etudiant) => {
    if (window.confirm(`Supprimer ${etudiant.prenom} ${etudiant.nom} ?`)) {
      try {
        await etudiantApi.delete(etudiant.id);
        toast.success("Étudiant supprimé avec succès");
        fetchEtudiants();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleEdit = (etudiant) => {
    setSelectedEtudiant(etudiant);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (selectedEtudiant) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Étudiants</h2>
          <p className="text-gray-400">
            Gestion des étudiants ({etudiants.length} total)
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedEtudiant(null);
            setIsModalOpen(true);
          }}
        >
          <FiPlus className="w-4 h-4" />
          Nouvel étudiant
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" variant="secondary">
                <FiSearch className="w-4 h-4" />
                Rechercher
              </Button>

              <Button variant="outline">
                <FiFilter className="w-4 h-4" />
                Filtres
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Students Grid */}
      {loading ? (
        <div className="card flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des étudiants...</p>
          </div>
        </div>
      ) : etudiants.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <FiSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            Aucun étudiant trouvé
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm
              ? "Essayez avec d'autres termes de recherche"
              : "Commencez par ajouter un nouvel étudiant"}
          </p>
          <Button
            onClick={() => {
              setSelectedEtudiant(null);
              setIsModalOpen(true);
            }}
          >
            <FiPlus className="w-4 h-4" />
            Ajouter un étudiant
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {etudiants.map((etudiant) => (
            <EtudiantCard
              key={etudiant.id}
              etudiant={etudiant}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEtudiant(null);
        }}
        title={selectedEtudiant ? "Modifier l'étudiant" : "Nouvel étudiant"}
        size="lg"
      >
        <EtudiantForm
          etudiant={selectedEtudiant}
          onSubmit={handleSubmit}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default EtudiantList;
