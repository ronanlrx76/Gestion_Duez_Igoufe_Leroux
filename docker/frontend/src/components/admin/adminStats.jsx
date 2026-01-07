export default function AdminStats({ stats, loading }) {
    if (loading) return <div className="animate-pulse text-gray-400">Chargement des statistiques...</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Livres Totaux</p>
                <p className="text-3xl font-bold">{stats?.stock?.general?.total_livres_differents || 0}</p>
            </div>
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Emprunts Actifs</p>
                <p className="text-3xl font-bold text-blue-400">{stats?.emprunts_actifs?.count || 0}</p>
            </div>
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Retards Critiques</p>
                <p className="text-3xl font-bold text-red-500">{stats?.retards?.count || 0}</p>
            </div>
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Exemplaires en rayon</p>
                <p className="text-3xl font-bold text-green-400">{stats?.stock?.general?.total_exemplaires_physiques || 0}</p>
            </div>
        </div>
    );
}
