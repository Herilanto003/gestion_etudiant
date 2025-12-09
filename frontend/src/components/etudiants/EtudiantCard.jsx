import React from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { format } from "date-fns";

const EtudiantCard = ({ etudiant, onEdit, onDelete }) => {
  return (
    <div className="card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <FiUser className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {etudiant.prenom} {etudiant.nom}
            </h3>
            <p className="text-sm text-gray-400">
              Matricule: {etudiant.matricule}
            </p>
          </div>
        </div>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(etudiant)}
            className="p-2 rounded-md hover:bg-gray-800"
            title="Modifier"
          >
            <FiEdit2 className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => onDelete(etudiant)}
            className="p-2 rounded-md hover:bg-red-500/10"
            title="Supprimer"
          >
            <FiTrash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <FiMail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 truncate">{etudiant.email}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <FiCalendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">
            {format(new Date(etudiant.dateNaissance), "dd/MM/yyyy")}
          </span>
        </div>

        {etudiant.telephone && (
          <div className="flex items-center space-x-2 text-sm">
            <FiPhone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{etudiant.telephone}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {etudiant.inscriptions?.length || 0} cours inscrits
          </span>
          <span className="text-xs px-2 py-1 bg-gray-800 rounded">
            Créé le {format(new Date(etudiant.createdAt), "dd/MM/yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EtudiantCard;
