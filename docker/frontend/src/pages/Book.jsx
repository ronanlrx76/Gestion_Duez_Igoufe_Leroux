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
    
    // États pour la pagination
    const [pagination, setPagination] = useState({
        next: null,
        previous: null,
        count: 0
    });
    // On stocke l'URL actuelle pour pouvoir changer de page
    const [currentUrl, setCurrentUrl] = useState(`http://localhost:8000/api/books/`);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setLoading(true);
            
            // On construit l'URL avec le filtre de recherche
            // Note: Si on clique sur "Suivant", currentUrl contiendra déjà les bons paramètres
            const fetchUrl = search 
                ? `http://localhost:8000/api/books/?title=${search}` 
                : currentUrl;

            fetch(fetchUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(res => {
                if (res.status === "success") {
                    setLivres(res.data.results);
                    setPagination({
                        next: res.data.next,
                        previous: res.data.previous,
                        count: res.data.count
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur fetch livres:", err);
                setLoading(false);
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, currentUrl]);

    // Reset de la page quand on fait une nouvelle recherche
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentUrl(`http://localhost:8000/api/books/`); // Revenir en page 1
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-5xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold mb-6">Catalogue des livres</h1>

                <input
                    type="text"
                    placeholder="Rechercher un titre..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full mb-6 p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <p className="p-6 text-center text-gray-400 animate-pulse">Chargement du catalogue...</p>
                    ) : livres.length > 0 ? (
                        <>
                            {livres.map((livre) => (
                                <div key={livre.id_livre} className="p-4 border-b border-gray-700 hover:bg-gray-750 transition">
                                    <h2 className="text-white font-semibold text-lg">
                                        {highlightText(livre.titre, search)}
                                    </h2>
                                    <LivreRow livre={livre} />
                                </div>
                            ))}
                            
                            {/* BARRE DE PAGINATION */}
                            <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                                <span className="text-sm text-gray-400">
                                    Total: <span className="font-bold text-white">{pagination.count}</span> livres
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={!pagination.previous}
                                        onClick={() => setCurrentUrl(pagination.previous)}
                                        className={`px-4 py-2 rounded text-sm font-bold transition ${
                                            !pagination.previous 
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                                        }`}
                                    >
                                        Précédent
                                    </button>
                                    <button
                                        disabled={!pagination.next}
                                        onClick={() => setCurrentUrl(pagination.next)}
                                        className={`px-4 py-2 rounded text-sm font-bold transition ${
                                            !pagination.next 
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                                        }`}
                                    >
                                        Suivant
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-400 text-center p-6">Aucun livre trouvé</p>
                    )}
                </div>
            </div>
        </div>
    );
}
