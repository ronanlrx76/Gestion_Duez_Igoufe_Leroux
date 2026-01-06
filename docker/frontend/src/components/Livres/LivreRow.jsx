import { useNavigate } from 'react-router-dom';

export default function LivreRow({ livre, user }) {
  const disponible = livre.nb_disponibles > 0;
  const navigate = useNavigate();

  const handleEnSavoirPlus = () => {
    navigate(`/Livres/${livre.id}`);
  };

  const handleReserver = () => {
    if (!user) {
      navigate('/Login');
      return;
    }
    console.log(`Réservation du livre ${livre.titre} par ${user.prenom}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-800 border-b border-gray-700">
      {/* Image */}
      <img
        src={`/covers/${livre.emplacement_image_couverture}`}
        alt={livre.titre}
        className="w-24 h-36 sm:w-16 sm:h-24 object-cover rounded mx-auto sm:mx-0"
      />

      {/* Infos livre */}
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-white text-lg font-semibold">{livre.titre}</h2>
        <p className="text-gray-300">{livre.auteur}</p>
      </div>

      {/* Disponibilité */}
      <div className="text-center sm:text-right">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            disponible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {disponible ? 'Disponible' : 'Indisponible'}
        </span>
        <p className="text-gray-400 text-xs mt-1">
          {livre.nb_disponibles} / {livre.nb_exemplaires} dispo
        </p>
      </div>

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0 sm:ml-4 justify-center sm:justify-end">
        <button
          onClick={handleEnSavoirPlus}
          className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition font-medium text-sm"
        >
          En savoir plus
        </button>
        <button
          onClick={handleReserver}
          disabled={!disponible}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            disponible
              ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Réserver
        </button>
      </div>
    </div>
  );
}
