import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  // Bloquer le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay avec blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${sizes[size]} animate-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Carte avec glassmorphism et bordures lumineuses */}
        <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Effet de brillance en haut */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

          {/* Header avec dégradé */}
          <div className="relative bg-linear-to-r from-gray-800/50 to-gray-900/50 px-6 py-5 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h3
                id="modal-title"
                className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent"
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                className="group p-2 rounded-lg bg-gray-800/50 hover:bg-red-500/20 border border-gray-700 hover:border-red-500/50 transition-all duration-200 hover:scale-110"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* Content avec scrollbar personnalisée */}
          <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            <div className="text-gray-100">{children}</div>
          </div>

          {/* Effet de brillance en bas */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoom-in-95 {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .zoom-in-95 {
          animation: zoom-in-95 0.2s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #4b5563, #6b7280);
          border-radius: 4px;
          transition: background 0.2s;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #6b7280, #9ca3af);
        }
      `}</style>
    </div>
  );
};

export default Modal;
