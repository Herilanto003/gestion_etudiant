import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Etudiants from "./pages/Etudiants";
import Cours from "./pages/Cours";
import Inscriptions from "./pages/Inscriptions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="etudiants" element={<Etudiants />} />
          <Route path="cours" element={<Cours />} />
          <Route path="inscriptions" element={<Inscriptions />} />

          {/* Redirect to dashboard for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
