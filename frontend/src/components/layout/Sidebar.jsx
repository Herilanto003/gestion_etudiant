import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiClipboard,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: "/", icon: FiHome, label: "Dashboard" },
    { path: "/etudiants", icon: FiUsers, label: "Étudiants" },
    { path: "/cours", icon: FiBook, label: "Cours" },
    { path: "/inscriptions", icon: FiClipboard, label: "Inscriptions" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-auto
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <span className="text-black font-bold text-xl">SG</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">StudentGEST</h1>
                <p className="text-xs text-gray-400">Gestion Éducative</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }
                `}
                onClick={onClose}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="px-4 py-3 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-300">Version 1.0.0</p>
              <p className="text-xs text-gray-400">© 2024 StudentGEST</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
