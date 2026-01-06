import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function LivreDetail() {
  const { id } = useParams();
  const [livre, setLivre] = useState(null);

  // Mock de livres
  const mockLivres = [
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
      titre: 'JavaScript Avancé',
      auteur: 'Jane Smith',
      nb_disponibles: 0,
      nb_exemplaires: 2,
      emplacement_image_couverture: 'livre2.jpeg',
      description: 'Approfondissement JavaScript pour développeurs.'
    },
    {
      id: 3,
      titre: 'Python pour tous',
      auteur: 'Alice Martin',
      nb_disponibles: 2,
      nb_exemplaires: 4,
      emplacement_image_couverture: 'livre3.jpeg',
      description: 'Apprenez Python facilement avec des exemples concrets.'
    }
  ];

  useEffect(() => {
    const found = mockLivres.find((l) => l.id === parseInt(id));
    setLivre(found);
  }, [id]);

  if (!livre) return <p className="text-white text-center mt-10">Livre introuvable</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={`/covers/${livre.emplacement_image_couverture}`}
            alt={livre.titre}
            className="w-48 h-72 object-cover rounded"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{livre.titre}</h1>
            <p className="text-gray-300 mt-2">Auteur : {livre.auteur}</p>
            <p className="text-gray-300 mt-2">
              Disponibles : {livre.nb_disponibles} / {livre.nb_exemplaires}
            </p>
            <p className="text-gray-300 mt-4">{livre.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
