import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchWithAuth from '../services/api';

export default function Reservation() {
    const { id_livre } = useParams();
    const navigate = useNavigate();
    
    const [livre, setLivre] = useState(null);
    const [formData, setFormData] = useState({
        id_exemplaire: '',
        retour_prevu: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLivre = async () => {
            const res = await fetchWithAuth(`http://localhost:8000/api/books/${id_livre}/`);
            const json = await res.json();
            if (json.status === "success") setLivre(json.data);
            setLoading(false);
        };
        fetchLivre();
    }, [id_livre]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // On prépare le DTO pour l'API
        // Note: id_utilisateur peut être récupéré du token ou géré par le backend via request.user
        const dto = {
            id_livre: parseInt(id_livre),
            id_exemplaire: parseInt(formData.id_exemplaire),
            date_emprunt: new Date().toISOString().split('T')[0], // Date du jour
            retour_prevu: formData.retour_prevu
        };

        try {
            const res = await fetchWithAuth('http://localhost:8000/api/emprunts/', {
                method: 'POST',
                body: JSON.stringify(dto)
            });
            const json = await res.json();

            if (res.ok) {
                alert("Réservation réussie !");
                navigate('/mes-emprunts');
            } else {
                alert("Erreur: " + (json.message || "Vérifiez les dates"));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p className="text-center p-10 text-white">Chargement du livre...</p>;
    if (!livre) return <p className="text-center p-10 text-red-500">Livre introuvable.</p>;

    // On ne garde que les exemplaires dont le statut est "Disponible"
    const exemplairesDisponibles = livre.exemplaires_details?.filter(ex => ex.statut.toLowerCase() === 'disponible') || [];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="md:flex">
                    <div className="md:w-1/3">
                        <img src={livre.emplacement_image_couverture} alt={livre.titre} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-8 md:w-2/3">
                        <h1 className="text-2xl font-bold">{livre.titre}</h1>
                        <p className="text-blue-400 mb-6">{livre.prenom_auteur} {livre.nom_auteur}</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Choisir un exemplaire (État)</label>
                                <select 
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.id_exemplaire}
                                    onChange={(e) => setFormData({...formData, id_exemplaire: e.target.value})}
                                >
                                    <option value="">-- Sélectionnez un exemplaire --</option>
                                    {exemplairesDisponibles.map(ex => (
                                        <option key={ex.id_exemplaire} value={ex.id_exemplaire}>
                                            Exemplaire #{ex.id_exemplaire} - État: {ex.etat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Date de retour prévue</label>
                                <input 
                                    type="date" 
                                    required
                                    min={new Date().toISOString().split('T')[0]} // Empêche de choisir hier
                                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.retour_prevu}
                                    onChange={(e) => setFormData({...formData, retour_prevu: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={exemplairesDisponibles.length === 0}
                                className={`w-full py-3 rounded-lg font-bold transition ${
                                    exemplairesDisponibles.length === 0 
                                    ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                                    : 'bg-green-600 hover:bg-green-500 text-white'
                                }`}
                            >
                                {exemplairesDisponibles.length > 0 ? "Confirmer l'emprunt" : "Rupture de stock"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
