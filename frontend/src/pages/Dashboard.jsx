import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiBook,
  FiClipboard,
  FiTrendingUp,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { etudiantApi, coursApi, inscriptionApi } from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    etudiants: 0,
    cours: 0,
    inscriptions: 0,
    moyenneNotes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [etudiantsRes, coursRes, inscriptionsRes] = await Promise.all([
          etudiantApi.getAll(),
          coursApi.getAll(),
          inscriptionApi.getAll(),
        ]);

        const inscriptions = inscriptionsRes.data;

        // Calculate average note
        const notes = inscriptions.filter((i) => i.note).map((i) => i.note);
        const moyenne =
          notes.length > 0
            ? (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1)
            : 0;

        setStats({
          etudiants: etudiantsRes.data.length,
          cours: coursRes.data.length,
          inscriptions: inscriptions.length,
          moyenneNotes: moyenne,
        });

        // Prepare chart data
        const currentYear = new Date().getFullYear();
        const months = [
          "Jan",
          "Fév",
          "Mar",
          "Avr",
          "Mai",
          "Jun",
          "Jul",
          "Aoû",
          "Sep",
          "Oct",
          "Nov",
          "Déc",
        ];

        const inscriptionsByMonth = months.map((month, index) => {
          const monthInscriptions = inscriptions.filter((ins) => {
            const date = new Date(ins.dateInscription);
            return (
              date.getMonth() === index && date.getFullYear() === currentYear
            );
          });
          return monthInscriptions.length;
        });

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Inscriptions",
              data: inscriptionsByMonth,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderColor: "rgba(255, 255, 255, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Étudiants",
      value: stats.etudiants,
      icon: FiUsers,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      change: "+12%",
    },
    {
      title: "Cours",
      value: stats.cours,
      icon: FiBook,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      change: "+5%",
    },
    {
      title: "Inscriptions",
      value: stats.inscriptions,
      icon: FiClipboard,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      change: "+18%",
    },
    {
      title: "Moyenne Notes",
      value: stats.moyenneNotes,
      icon: FiTrendingUp,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      change: "+2%",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Nouvel étudiant inscrit",
      user: "Jean Dupont",
      time: "Il y a 5 min",
    },
    {
      id: 2,
      action: "Note ajoutée",
      user: "Mathématiques Avancées",
      time: "Il y a 1 heure",
    },
    {
      id: 3,
      action: "Cours créé",
      user: "Physique Quantique",
      time: "Il y a 2 heures",
    },
    {
      id: 4,
      action: "Inscription validée",
      user: "Marie Curie",
      time: "Il y a 3 heures",
    },
    {
      id: 5,
      action: "Profil mis à jour",
      user: "Pierre Durand",
      time: "Il y a 1 jour",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400">Aperçu général du système</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {loading ? "..." : stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-green-400">{stat.change}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    vs mois dernier
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Inscriptions par mois
              </h3>
              <p className="text-sm text-gray-400">
                Année {new Date().getFullYear()}
              </p>
            </div>
            <FiCalendar className="w-5 h-5 text-gray-400" />
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : chartData ? (
            <div className="h-64">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: "#d1d5db",
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                      ticks: {
                        color: "#d1d5db",
                      },
                    },
                    y: {
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                      ticks: {
                        color: "#d1d5db",
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400">Aucune donnée disponible</p>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Activités récentes
              </h3>
              <p className="text-sm text-gray-400">Dernières actions</p>
            </div>
            <FiBarChart2 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-400"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-400">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left">
            <FiUsers className="w-6 h-6 text-blue-400 mb-2" />
            <p className="font-medium text-white">Ajouter un étudiant</p>
            <p className="text-sm text-gray-400">
              Créer un nouveau profil étudiant
            </p>
          </button>

          <button className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left">
            <FiBook className="w-6 h-6 text-green-400 mb-2" />
            <p className="font-medium text-white">Créer un cours</p>
            <p className="text-sm text-gray-400">Ajouter un nouveau cours</p>
          </button>

          <button className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left">
            <FiClipboard className="w-6 h-6 text-purple-400 mb-2" />
            <p className="font-medium text-white">Nouvelle inscription</p>
            <p className="text-sm text-gray-400">
              Inscrire un étudiant à un cours
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
