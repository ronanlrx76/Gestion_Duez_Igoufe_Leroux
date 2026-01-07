import { useState, useEffect } from 'react';
import LivreRow from '../components/Livres/LivreRow';

function highlightText(text, query) {
    if (!query || !text) return text;
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
    const [livres, setLivres] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch des livres depuis l'API
    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        setLoading(true);
        // On ajoute le paramètre ?title= pour le filtrage côté Backend
        const url = `http://localhost:8000/api/books/?title=${search}`;
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === "success") {
                // Ton API renvoie la liste dans res.data.results (pagination)
                setLivres(res.data.results);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Erreur fetch livres:", err);
            setLoading(false);
        });
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }, [search]); // Se redéclenche dès que 'search' change

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-5xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold mb-6">Catalogue des livres</h1>

                <input
                    type="text"
                    placeholder="Rechercher un titre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-6 p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <p className="p-6 text-center text-gray-400">Chargement du catalogue...</p>
                    ) : livres.length > 0 ? (
                        livres.map((livre) => (
                            <div key={livre.id_livre} className="p-4 border-b border-gray-700 hover:bg-gray-750 transition">
                                <h2 className="text-white font-semibold text-lg">
                                    {highlightText(livre.titre, search)}
                                </h2>
                                {/* Note: Ton serializer actuel ne renvoie que l'ID de l'auteur, pas son nom */}
                                <p className="text-gray-400 text-sm mb-2">Auteur ID: {livre.id_auteur}</p>
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
