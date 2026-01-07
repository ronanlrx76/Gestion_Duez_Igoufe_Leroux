import { use, useState } from 'react';
import { Bars3Icon, XMarkIcon, BellIcon, UserCircleIcon, PowerIcon } from '@heroicons/react/24/outline';
import { NavLink, Outlet, Link, useNavigate  } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const navigation = [
  { name: 'ACCUEIL', href: '/' },
  { name: 'LIVRES', href: '/livres' },
  { name: 'INFORMATIONS', href: '/informations' },
  {name: 'EMPRUNTS', href: '/mes-emprunts' }
];

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  // On récupère l'user stocké au login
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const isConnected = !!storedUser; // Transforme l'objet en booléen
  // role dans JWT
  const token = localStorage.getItem('access_token');
  let isAdmin = false;
  if (token) {
        try {
            const decoded = jwtDecode(token);
            // 'role' est la clé que tu as injectée côté Django dans refresh['role']
            isAdmin = decoded.role === 'administrateur';
            
            // Tu peux aussi récupérer d'autres infos si besoin
            // const prenom = decoded.prenom; 
        } catch (error) {
            console.error("Token invalide", error);
            console.log(token);
        }
    }

  const handleLogout = () => {
    localStorage.clear(); // Supprime tokens et user
    navigate('/login');
    //window.location.reload(); // Pour rafraîchir l'état de la navbar
  };

  return (
    <>
      <nav className="bg-gray-800 fixed w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/accueil" className="text-white text-2xl font-bold tracking-tight">
                Bibli'IUT
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-white border-b-2 border-blue-500 px-3 py-2 font-medium'
                      : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-blue-500 px-3 py-2 font-medium transition'
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Icons Desktop */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              {isConnected ? (
                <>
                  {/* SI CONNECTÉ */}
                  <button className="p-2 rounded-full hover:bg-gray-700 transition">
                    <BellIcon className="h-6 w-6 text-white" />
                  </button>
                  
                  <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                    <span className="text-sm font-medium">{storedUser.prenom}</span>
                    <NavLink to="/profile" className="p-1 rounded-full hover:bg-gray-700 transition">
                      <UserCircleIcon className="h-6 w-6 text-blue-400" />
                    </NavLink>
                  </div>
                  {isAdmin && (
                    <NavLink to="/admin/dashboard/" className="p-2 rounded-full hover:bg-gray-700 transition" title="Admin Panel">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 12c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
                      </svg>
                    </NavLink>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-red-900/30 transition text-red-500"
                    title="Déconnexion"
                  >
                    <PowerIcon className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <>  
                  <button className="p-2 rounded-full hover:bg-gray-700 transition">
                    <BellIcon className="h-6 w-6 text-white" />
                  </button>
                  {/* User icon redirige vers /Login */}
                  <NavLink to="/login" className="p-2 rounded-full hover:bg-gray-700 transition">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-gray-700 focus:outline-none transition"
              >
                {isOpen ? <XMarkIcon className="h-6 w-6 text-white" /> : <Bars3Icon className="h-6 w-6 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    isActive
                      ? 'block text-white bg-gray-700 px-3 py-2 rounded-md font-medium'
                      : 'block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md font-medium transition'
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="flex px-3 py-2 space-x-4 mt-2">
                {/* User icon mobile redirige vers /Login */}
                <NavLink to="/login" className="p-2 rounded-full hover:bg-gray-700 transition">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                </NavLink>
                <button className="p-2 rounded-full hover:bg-gray-700 transition">
                  <BellIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  );
}
