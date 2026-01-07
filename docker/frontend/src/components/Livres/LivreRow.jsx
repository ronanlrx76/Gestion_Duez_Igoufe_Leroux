import { useNavigate } from 'react-router-dom';

export default function LivreRow({ livre }) {
  const navigate = useNavigate();  
  // 1. Adaptation aux noms de champs de ton Serializer Django
  // Ton Serializer utilise 'id_livre' et non 'id'
  const idLivre = livre.id_livre; 
  const disponible = livre.nb_disponibles > 0;

  // 2. Récupération de l'utilisateur pour la réservation
  const handleReserver = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!storedUser) {
      alert("Vous devez être connecté pour réserver un livre.");
      navigate('/login');
      return;
    }

    // Ici tu feras plus tard ton fetch POST vers /api/emprunts/
    console.log(`Demande de réservation pour le livre ID: ${idLivre}`);
  };

  const handleEnSavoirPlus = () => {
    // On utilise bien l'ID de la base de données pour l'URL
    navigate(`/livres/${idLivre}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors border-b border-gray-700 last:border-0">
      
      {/* Image : Gestion de l'URL Media de Django */}
      <img
        src={livre.emplacement_image_couverture || '/covers/default.jpg'}
        alt={livre.titre}
        className="w-20 h-28 sm:w-16 sm:h-24 object-cover rounded shadow-md mx-auto sm:mx-0"
      />

      {/* Infos livre */}
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-white text-lg font-semibold leading-tight">
          {livre.titre}
        </h2>
        <p className="text-gray-400 text-sm italic">
          {/* Auteur ID en attendant que ton Serializer renvoie le nom */}
          Auteur ID: {livre.id_auteur}
        </p>
      </div>

      {/* État de Disponibilité */}
      <div className="flex flex-col items-center sm:items-end min-w-[120px]">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            disponible ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}
        >
          {disponible ? 'Disponible' : 'Épuisé'}
        </span>
        <p className="text-gray-500 text-xs mt-2 font-medium">
          {livre.nb_disponibles || 0} sur {livre.nb_exemplaires || 0} en rayon
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-row sm:flex-col lg:flex-row gap-2 justify-center">
        <button
          onClick={handleEnSavoirPlus}
          className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition text-sm font-semibold"
        >
          Détails
        </button>
        <button
          onClick={handleReserver}
          disabled={!disponible}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition ${
            disponible
              ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
          }`}
        >
          Réserver
        </button>
      </div>
    </div>
  );
}
