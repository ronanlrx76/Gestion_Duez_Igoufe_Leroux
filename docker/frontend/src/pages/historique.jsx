import { useState, useEffect } from 'react';
import fetchWithAuth from '../services/api';

export default function HistoriqueEmprunts() {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:8000/api/historique-emprunts/');
        const json = await res.json();
        if (json.status === "success") {
          setHistorique(json.data.results || json.data);
        }
      } catch (err) {
        console.error("Erreur historique:", err);
      } finally {
        setLoading(setLoading(false));
      }
    };
    fetchHistorique();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold border-l-4 border-blue-500 pl-4">📜 Historique Global des Emprunts</h1>
          <div className="text-sm text-gray-400 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
            Total : {historique.length} transactions
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700/50 text-gray-300 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Utilisateur</th>
                <th className="p-4 font-semibold">Livre & Exemplaire</th>
                <th className="p-4 font-semibold">Date Emprunt</th>
                <th className="p-4 font-semibold">Date Retour</th>
                <th className="p-4 font-semibold text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {historique.map((h, idx) => (
                <tr key={idx} className="hover:bg-gray-750 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-blue-300">{h.nom_utilisateur}</div>
                    <div className="text-[10px] text-gray-500">Moi</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-semibold text-white">{h.titre_livre}</div>
                    <div className="text-xs text-gray-400 italic">Exemplaire #{h.id_exemplaire}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    {new Date(h.date_emprunt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    {new Date(h.date_retour_effectif).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    Rendu
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {historique.length === 0 && !loading && (
            <div className="p-20 text-center text-gray-500 italic">
              Aucun historique disponible pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
