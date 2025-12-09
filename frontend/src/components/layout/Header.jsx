import React from "react";
import { FiMenu, FiBell, FiSearch } from "react-icons/fi";

const Header = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md hover:bg-gray-800 lg:hidden"
            >
              <FiMenu className="w-5 h-5 text-gray-300" />
            </button>
            <div className="hidden md:block">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button className="p-2 rounded-md hover:bg-gray-800 relative">
              <FiBell className="w-5 h-5 text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button> */}

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium">AD</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-gray-400">Administrateur</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
