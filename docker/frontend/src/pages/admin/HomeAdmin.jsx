import { useState, useEffect } from 'react';
import AdminStats from '../../components/admin/adminStats';
import QuickActionCard from '../../components/admin/quickActionCard';
import fetchWithAuth from '../../services/api';

export default function HomeAdmin() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithAuth('http://localhost:8000/api/admin/dashboard/')
        .then(res => res.json())
        .then(res => {
            if (res.status === "success") {
                setStats(res.data);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Erreur stats:", err);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Tableau de Bord Administrateur</h1>
                <p className="text-gray-400 mb-8">Gestion du catalogue et monitoring de la bibliothèque</p>

                {/* Section Stats (Composant Main) */}
                <AdminStats stats={stats} loading={loading} />

                {/* Section Actions de Gestion */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">Gestion du Catalogue</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Ajouter */}
                        <QuickActionCard 
                            title="Ajouter un Livre / Auteur" 
                            description="Enregistrer de nouvelles références dans la base."
                            icon="➕"
                            to="/admin/ajouter"
                            color="bg-green-600"
                        />
                        
                        {/* Modifier / Supprimer */}
                        <QuickActionCard 
                            title="Modifier / Supprimer" 
                            description="Editer les titres, auteurs ou supprimer des ouvrages."
                            icon="✏️"
                            to="/admin/actions"
                            color="bg-blue-600"
                        />

                        {/* Gestion des Exemplaires */}
                        <QuickActionCard 
                            title="Stock & Exemplaires" 
                            description="Gérer les codes-barres, l'état physique et la disponibilité."
                            icon="📋"
                            to="/admin/exemplaires"
                            color="bg-purple-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
