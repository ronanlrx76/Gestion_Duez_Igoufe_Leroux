import { useState, useEffect, useCallback } from 'react';
import fetchWithAuth from '../../services/api'; 

export default function AdminAdd() {
  const [activeTab, setActiveTab] = useState('livre');
  const [auteurs, setAuteurs] = useState([]);
  
  const [livreData, setLivreData] = useState({ titre: '', id_auteur: '', image: '' });
  const [auteurData, setAuteurData] = useState({ nom: '', prenom: '' });

  // 1. Fonction pour charger les auteurs (mémorisée avec useCallback)
  const fetchAuteurs = useCallback(async () => {
    try {
      const res = await fetchWithAuth('http://localhost:8000/api/authors/');
      const json = await res.json();
      if (json.status === "success") {
        setAuteurs(json.data);
        console.log("Auteurs chargés:", json.data);
      }
    } catch (err) {
      console.error("Erreur auteurs:", err);
    }
  }, []);

  // 2. Chargement unique au montage du composant
  useEffect(() => {
    fetchAuteurs();
  }, [fetchAuteurs]);

  const handleAddAuteur = async (e) => {
    e.preventDefault();
    const res = await fetchWithAuth('http://localhost:8000/api/authors/', {
      method: 'POST',
      body: JSON.stringify(auteurData)
    });
    
    if (res.ok) {
      alert("Auteur ajouté !");
      setAuteurData({ nom: '', prenom: '' });
      // 3. On rafraîchit la liste des auteurs sans recharger la page
      fetchAuteurs(); 
    }
  };

  const handleAddLivre = async (e) => {
    e.preventDefault();
    const res = await fetchWithAuth('http://localhost:8000/api/books/', {
      method: 'POST',
      body: JSON.stringify({
        titre: livreData.titre,
        id_auteur: parseInt(livreData.id_auteur),
        emplacement_image_couverture: livreData.image
      })
    });
    if (res.ok) {
      alert("Livre ajouté !");
      setLivreData({ titre: '', id_auteur: '', image: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        
        {/* Navigation Onglets */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('livre')}
            className={`flex-1 py-4 font-bold transition ${activeTab === 'livre' ? 'bg-blue-600 text-white' : 'hover:bg-gray-750 text-gray-400'}`}
          >
            Ajouter un Livre
          </button>
          <button
            onClick={() => setActiveTab('auteur')}
            className={`flex-1 py-4 font-bold transition ${activeTab === 'auteur' ? 'bg-blue-600 text-white' : 'hover:bg-gray-750 text-gray-400'}`}
          >
            Ajouter un Auteur
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'livre' ? (
            /* FORMULAIRE LIVRE */
            <form onSubmit={handleAddLivre} className="space-y-5">
              <h2 className="text-xl font-semibold text-blue-400 mb-4">Nouveau Livre</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Titre du livre</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={livreData.titre}
                  onChange={(e) => setLivreData({...livreData, titre: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sélectionner l'Auteur</label>
                <select
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={livreData.id_auteur}
                  onChange={(e) => setLivreData({...livreData, id_auteur: e.target.value})}
                >
                  <option value="">-- Choisir un auteur --</option>
                  {auteurs.map(aut => (
                    <option key={aut.id_auteur} value={aut.id_auteur}>
                      {aut.nom} {aut.prenom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL Image Couverture</label>
                <input
                  type="text"
                  placeholder="nom_image.jpg"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={livreData.image}
                  onChange={(e) => setLivreData({...livreData, image: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold transition shadow-lg mt-4">
                Enregistrer le Livre
              </button>
            </form>
          ) : (
            /* FORMULAIRE AUTEUR */
            <form onSubmit={handleAddAuteur} className="space-y-5">
              <h2 className="text-xl font-semibold text-blue-400 mb-4">Nouvel Auteur</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={auteurData.nom}
                    onChange={(e) => setAuteurData({...auteurData, nom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={auteurData.prenom}
                    onChange={(e) => setAuteurData({...auteurData, prenom: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold transition shadow-lg mt-4">
                Enregistrer l'Auteur
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
