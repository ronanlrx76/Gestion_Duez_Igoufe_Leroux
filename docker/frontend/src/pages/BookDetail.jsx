import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Skeleton = () => (
  <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-56 h-80 bg-gray-700 rounded-lg shadow-2xl"></div>
      <div className="flex-1 space-y-4">
        <div className="h-10 bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="h-20 bg-gray-700 rounded-lg"></div>
          <div className="h-20 bg-gray-700 rounded-lg"></div>
        </div>
        <div className="h-32 bg-gray-700 rounded-lg mt-8"></div>
        <div className="h-12 bg-gray-700 rounded-xl mt-10"></div>
      </div>
    </div>
  </div>
);

export default function LivreDetail() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL (ex: /livre/3)
  const [livre, setLivre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // On appelle l'API pour récupérer un livre spécifique
    // Assure-toi que ta route Django accepte les requêtes de ce type
    fetch(`http://localhost:8000/api/books/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          setLivre(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement livre:", err);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      {/* 2. Logique d'affichage */}
      {loading ? (
        <Skeleton />
      ) : livre ? (
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img
                src={livre.emplacement_image_couverture || '/covers/default.jpg'}
                alt={livre.titre}
                className="w-56 h-80 object-cover rounded-lg shadow-2xl border border-gray-600"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white">{livre.titre}</h1>
              <p className="text-blue-400 font-medium text-lg mt-2">Auteur ID: {livre.id_auteur}</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Disponibles</p>
                  <p className="text-2xl font-bold text-green-400">{livre.nb_disponibles}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-2xl font-bold text-gray-200">{livre.nb_exemplaires}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 text-gray-200">Description</h2>
                <p className="text-gray-300 mt-4 leading-relaxed">{livre.description || "Aucune description."}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-xl text-gray-400">Livre introuvable (ID: {id})</p>
        </div>
      )}
    </div>
  );
}
