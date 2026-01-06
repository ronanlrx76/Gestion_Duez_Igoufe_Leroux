import { useState } from 'react';
import { Bars3Icon, XMarkIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { NavLink, Outlet, Link  } from 'react-router-dom';

const navigation = [
  { name: 'ACCUEIL', href: '/' },
  { name: 'LIVRES', href: '/Livres' },
  { name: 'INFORMATIONS', href: '/Informations' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 fixed w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/Accueil" className="text-white text-2xl font-bold tracking-tight">
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
              <button className="p-2 rounded-full hover:bg-gray-700 transition">
                <BellIcon className="h-6 w-6 text-white" />
              </button>
              {/* User icon redirige vers /Login */}
              <NavLink to="/Login" className="p-2 rounded-full hover:bg-gray-700 transition">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </NavLink>
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
                <NavLink to="/Login" className="p-2 rounded-full hover:bg-gray-700 transition">
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
