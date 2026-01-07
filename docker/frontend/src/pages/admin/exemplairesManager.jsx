import { useState, useEffect } from 'react';
import fetchWithAuth from '../../services/api';

export default function ExemplairesManager() {
  const [livres, setLivres] = useState([]);
  const [selectedLivreId, setSelectedLivreId] = useState('');
  const [exemplaires, setExemplaires] = useState([]);
  const [loadingEx, setLoadingEx] = useState(false);

  // 1. Charger les livres au montage (pour la liste déroulante)
  useEffect(() => {
    fetchWithAuth('http://localhost:8000/api/books/')
      .then(res => res.json())
      .then(json => {
        if (json.status === "succes" || json.status === "success") {
          // Gestion de la pagination : on prend .results
          setLivres(json.data.results || json.data);
        }
      })
      .catch(err => console.error("Erreur livres:", err));
  }, []);

  // 2. Charger les exemplaires quand le livre sélectionné change
  useEffect(() => {
    if (!selectedLivreId) {
      setExemplaires([]);
      return;
    }

    setLoadingEx(true);
    fetchWithAuth(`http://localhost:8000/api/exemplaires/?id_livre=${selectedLivreId}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === "succes" || json.status === "success") {
          setExemplaires(json.data.results);
        }
        setLoadingEx(false);
      })
      .catch(err => {
        console.error("Erreur exemplaires:", err);
        setLoadingEx(false);
      });
  }, [selectedLivreId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold border-l-4 border-blue-500 pl-4">Gestion des Exemplaires</h1>

        {/* Sélection du Livre */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <label className="block text-sm font-medium text-gray-400 mb-2">Choisir un livre pour voir l'inventaire</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={selectedLivreId}
            onChange={(e) => setSelectedLivreId(e.target.value)}
          >
            <option value="">-- Sélectionner un ouvrage --</option>
            {livres.map(livre => (
              <option key={livre.id_livre} value={livre.id_livre}>
                {livre.titre}
              </option>
            ))}
          </select>
        </div>

        {/* Affichage des Exemplaires */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
          <div className="bg-gray-750 px-6 py-4 border-b border-gray-700">
            <h2 className="font-semibold">Liste des exemplaires physiques</h2>
          </div>

          {loadingEx ? (
            <div className="p-10 text-center animate-pulse text-blue-400">Recherche des exemplaires...</div>
          ) : exemplaires.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">ID Exemplaire</th>
                  <th className="px-6 py-3">État</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {exemplaires.map(ex => (
                  <tr key={ex.id_exemplaire} className="hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4 font-mono text-sm text-blue-300">#{ex.id_exemplaire}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        ex.statut === 'disponible' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {ex.statut === 'disponible' ? 'DISPONIBLE' : 'EMPRUNTÉ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-white text-sm underline">Historique</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center text-gray-500">
              {selectedLivreId ? "Aucun exemplaire enregistré pour ce livre." : "Veuillez sélectionner un livre ci-dessus."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
