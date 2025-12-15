import { useState } from 'react';
import LivreRow from '../components/Livres/LivreRow';

const livresMock = [
  {
    id: 1,
    titre: 'Le Kama-Sutra',
    auteur: 'Ronan Leroux',
    nb_disponibles: 3,
    nb_exemplaires: 5,
    emplacement_image_couverture: 'kamasutra.jpg',
    description: 'Un livre pour apprendre la vraie vie pas à pas.'
  },
  {
    id: 2,
    titre: 'La Drague pour les nuls',
    auteur: 'Alexis Duez',
    nb_disponibles: 0,
    nb_exemplaires: 1,
    emplacement_image_couverture: 'drague.jpg',
  },
  {
    id: 3,
    titre: 'Le sexe pour les nuls',
    auteur: 'Ronan Leroux',
    nb_disponibles: 2,
    nb_exemplaires: 4,
    emplacement_image_couverture: 'lesnuls.jpg',
    description: 'Apprenez Python facilement avec des exemples concrets.'
  }
];

function highlightText(text, query) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-yellow-300 text-black rounded px-1">{part}</span>
    ) : (
      part
    )
  );
}

export default function Livres() {
  const [search, setSearch] = useState('');

  const filteredLivres = livresMock.filter((livre) => {
    const query = search.toLowerCase();
    return (
      livre.titre.toLowerCase().includes(query) ||
      (livre.auteur && livre.auteur.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Catalogue des livres</h1>

        <input
          type="text"
          placeholder="Rechercher par titre ou auteur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="bg-gray-800 rounded-lg shadow overflow-hidden space-y-4">
          {filteredLivres.length > 0 ? (
            filteredLivres.map((livre) => (
              <div key={livre.id} className="p-4 border-b border-gray-700">
                <h2 className="text-white font-semibold text-lg">
                  {highlightText(livre.titre, search)}
                </h2>
                <p className="text-gray-300 mb-2">
                  {highlightText(livre.auteur, search)}
                </p>
                <LivreRow livre={livre} />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center p-6">Aucun livre trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
}
