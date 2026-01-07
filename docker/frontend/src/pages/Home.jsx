import { NavLink } from 'react-router-dom';
import LivreRow from '../components/Livres/LivreRow';
import { useState, useEffect } from 'react';

export default function Home() {
  // État de l'utilisateur
  const [user, setUser] = useState(null);

  // Livres récents/populaires
  const [livres, setLivres] = useState([]);

  useEffect(() => {
    // Récupération de l'utilisateur connecté depuis localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.prenom) {
      setUser(storedUser);
    }
  }, []);

  const username = user?.prenom;

  // Notifications dynamiques
  const notifications = username
    ? []
    : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Titre */}
        <h1 className="text-3xl font-bold text-center">
          {username ? `Bienvenue, ${username} !` : 'Bienvenue à la Bibliothèque UPJV Amiens'}
        </h1>
        <p className="text-gray-300 text-center mt-2">
          {username
            ? 'Gérez vos livres et emprunts facilement'
            : <>Veuillez <NavLink to="/Login" className="text-blue-500 hover:underline">vous connecter</NavLink> pour accéder aux fonctionnalités complètes</>}
        </p>

        {/* Raccourcis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <NavLink
            to={"/livres"}
            className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow text-white text-center font-semibold"
          >
            📚 Livres
          </NavLink>
          <NavLink
            to={username ? "/mes-emprunts" : "/login"}
            className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow text-white text-center font-semibold"
          >
            📝 Mes emprunts
          </NavLink>
          <NavLink
            to="/informations"
            className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow text-white text-center font-semibold"
          >
            ℹ️ Informations
          </NavLink>
        </div>

        {/* Notifications (uniquement si connecté) */}
        {username && notifications.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Notifications</h2>
            <ul className="list-disc list-inside text-gray-300">
              {notifications.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Nouveautés / Populaires */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Nouveautés / Populaires</h2>
          <div className="space-y-4">
            {livres.map((livre) => (
              <LivreRow key={livre.id} livre={livre} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
