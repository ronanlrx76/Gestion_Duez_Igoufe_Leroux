import { useState, useEffect, useCallback } from 'react';
import fetchWithAuth from '../../services/api';

export default function AdminAdd() {
  // 1. On ajoute 'exemplaire' aux onglets
  const [activeTab, setActiveTab] = useState('exemplaire'); 
  const [auteurs, setAuteurs] = useState([]);
  const [livres, setLivres] = useState([]); // Pour le select des exemplaires

  const [livreData, setLivreData] = useState({ titre: '', id_auteur: '', image: '' });
  const [auteurData, setAuteurData] = useState({ nom: '', prenom: '' });
  const [exemplaireData, setExemplaireData] = useState({ 
    id_livre: '', 
    statut: 'disponible', 
    etat: 'neuf' 
  });
  // Fonctions de chargement
  const fetchAuteurs = useCallback(async () => {
    try {
      const res = await fetchWithAuth('http://localhost:8000/api/authors/');
      const json = await res.json();
      if (json.status === "succes" || json.status === "success") setAuteurs(json.data);
    } catch (err) { console.error("Erreur auteurs:", err); }
  }, []);

  const fetchLivres = useCallback(async () => {
    try {
      const res = await fetchWithAuth('http://localhost:8000/api/books/');
      const json = await res.json();
      if (json.status === "succes" || json.status === "success") {
        // On prend .results car la route books est paginée
        setLivres(json.data.results || json.data);
      }
    } catch (err) { console.error("Erreur livres:", err); }
  }, []);

  useEffect(() => {
    fetchAuteurs();
    fetchLivres();
  }, [fetchAuteurs, fetchLivres]);

  // Handlers POST
  const handleAddExemplaire = async (e) => {
    e.preventDefault();
    const res = await fetchWithAuth('http://localhost:8000/api/exemplaires/', {
      method: 'POST',
      body: JSON.stringify({ 
        id_livre: parseInt(exemplaireData.id_livre),
        statut: exemplaireData.statut,
        etat: exemplaireData.etat
      })
    });

    if (res.ok) {
      alert("Exemplaire physique ajouté avec succès !");
      setExemplaireData({ id_livre: '', statut: 'disponible', etat: 'neuf' });
    } else {
      const errorData = await res.json();
      alert("Erreur : " + errorData.message);
    }
  };

  const handleAddAuteur = async (e) => {
    e.preventDefault();
    const res = await fetchWithAuth('http://localhost:8000/api/authors/', {
      method: 'POST',
      body: JSON.stringify(auteurData)
    });
    if (res.ok) {
      alert("Auteur ajouté !");
      setAuteurData({ nom: '', prenom: '' });
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
      fetchLivres(); // Pour qu'il apparaisse dans la liste des exemplaires
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        
        {/* Navigation Onglets */}
        <div className="flex border-b border-gray-700 bg-gray-800/50">
          {['exemplaire', 'livre', 'auteur'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-400'
              }`}
            >
              {tab === 'exemplaire' ? 'Stock' : tab}
                </button>
          ))}
        </div>
        <div className="p-8">
          {/* FORMULAIRE EXEMPLAIRE */}
          {activeTab === 'exemplaire' && (
                <form onSubmit={handleAddExemplaire} className="space-y-5">
                  <h2 className="text-xl font-semibold text-blue-400">Entrée en stock d'un exemplaire</h2>
                  
                  {/* Sélection du Livre */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Livre concerné</label>
                    <select
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                      value={exemplaireData.id_livre}
                      onChange={(e) => setExemplaireData({...exemplaireData, id_livre: e.target.value})}
                    >
                      <option value="">-- Sélectionner le titre --</option>
                      {livres.map(l => <option key={l.id_livre} value={l.id_livre}>{l.titre}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Statut (souvent automatique mais requis par ton API) */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Statut initial</label>
                      <select
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 outline-none"
                        value={exemplaireData.statut}
                        onChange={(e) => setExemplaireData({...exemplaireData, statut: e.target.value})}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="maintenance">En réparation</option>
                        <option value="perdu">Perdu</option>
                      </select>
                    </div>

                    {/* État physique */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">État du livre</label>
                      <select
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 outline-none"
                        value={exemplaireData.etat}
                        onChange={(e) => setExemplaireData({...exemplaireData, etat: e.target.value})}
                      >
                        <option value="neuf">Neuf</option>
                        <option value="bon état">Bon état</option>
                        <option value="usé">Usé</option>
                        <option value="abîmé">Abîmé</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition shadow-lg mt-4">
                    Enregistrer l'exemplaire
                  </button>
                </form>
          )}
          {/* FORMULAIRE LIVRE (Ton code existant) */}
          {activeTab === 'livre' && (
            <form onSubmit={handleAddLivre} className="space-y-5">
              <h2 className="text-xl font-semibold text-green-400">Nouveau Livre (Référence)</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Titre</label>
                <input type="text" required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 outline-none" value={livreData.titre} onChange={(e) => setLivreData({...livreData, titre: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Auteur</label>
                <select required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 outline-none" value={livreData.id_auteur} onChange={(e) => setLivreData({...livreData, id_auteur: e.target.value})}>
                  <option value="">-- Choisir un auteur --</option>
                  {auteurs.map(aut => <option key={aut.id_auteur} value={aut.id_auteur}>{aut.nom} {aut.prenom}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image</label>
                <input type="text" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 outline-none" value={livreData.image} onChange={(e) => setLivreData({...livreData, image: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold transition">Enregistrer</button>
            </form>
          )}

          {/* FORMULAIRE AUTEUR (Ton code existant) */}
          {activeTab === 'auteur' && (
            <form onSubmit={handleAddAuteur} className="space-y-5">
              <h2 className="text-xl font-semibold text-purple-400">Nouvel Auteur</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nom" required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 outline-none" value={auteurData.nom} onChange={(e) => setAuteurData({...auteurData, nom: e.target.value})} />
                <input type="text" placeholder="Prénom" required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 outline-none" value={auteurData.prenom} onChange={(e) => setAuteurData({...auteurData, prenom: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-bold transition">Enregistrer</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
