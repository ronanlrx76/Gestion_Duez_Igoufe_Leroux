import { useState, useEffect } from 'react';
import fetchWithAuth from '../services/api'; // Vérifie le chemin vers ton service

export default function MesEmprunts() {
    const [emprunts, setEmprunts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMesEmprunts = async () => {
            try {
                // Utilise ton fetchWithAuth qui récupère le token dans le localStorage
                const res = await fetchWithAuth('http://localhost:8000/api/emprunts/');
                const json = await res.json();

                if (json.status === "success") {
                    setEmprunts(json.data.results || json.data);
                } else {
                    setError("Impossible de charger vos emprunts.");
                }
            } catch (err) {
                console.error("Erreur fetch emprunts:", err);
                setError("Une erreur est survenue lors de la communication avec le serveur.");
            } finally {
                setLoading(false);
            }
        };

        getMesEmprunts();
    }, []);

    // Fonction pour vérifier si un emprunt est en retard
    const isOverdue = (dateRetourPrevu) => {
        return new Date(dateRetourPrevu) < new Date() && dateRetourPrevu !== null;
    };

    if (loading) return <div className="text-center p-10 text-gray-400">Chargement de vos emprunts...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    📚 Mes Emprunts en cours
                </h1>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid gap-4">
                    {emprunts.length > 0 ? (
                        emprunts.map((emprunt) => (
                            <div 
                                key={emprunt.id_emprunt} 
                                className={`bg-gray-800 border-l-4 p-5 rounded-r-lg shadow-lg flex justify-between items-center ${
                                    isOverdue(emprunt.retour_prevu) ? 'border-red-500' : 'border-blue-500'
                                }`}
                            >
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {emprunt.livre_titre || `Livre #${emprunt.id_exemplaire}`}
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Emprunté le : <span className="text-gray-200">{new Date(emprunt.date_emprunt).toLocaleDateString()}</span>
                                    </p>
                                    <p className="text-sm mt-1">
                                        Retour prévu : 
                                        <span className={`ml-2 font-mono ${isOverdue(emprunt.retour_prevu) ? 'text-red-400 font-bold' : 'text-green-400'}`}>
                                            {new Date(emprunt.retour_prevu).toLocaleDateString()}
                                        </span>
                                    </p>
                                </div>

                                <div className="text-right">
                                    {isOverdue(emprunt.retour_prevu) ? (
                                        <span className="bg-red-900 text-red-200 text-xs uppercase px-3 py-1 rounded-full font-black animate-pulse">
                                            En retard
                                        </span>
                                    ) : (
                                        <span className="bg-blue-900 text-blue-200 text-xs uppercase px-3 py-1 rounded-full font-bold">
                                            Actif
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-800 rounded-xl border border-dashed border-gray-600">
                            <p className="text-gray-500 italic">Vous n'avez aucun emprunt en cours pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
