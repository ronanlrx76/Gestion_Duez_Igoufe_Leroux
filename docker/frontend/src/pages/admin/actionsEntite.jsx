import { useState, useEffect, useCallback } from 'react';
import fetchWithAuth from '../../services/api';

export default function AdminActions() {
  const [activeTab, setActiveTab] = useState('livre');
  const [auteurs, setAuteurs] = useState([]);
  const [livres, setLivres] = useState([]);
  const [exemplaires, setExemplaires] = useState([]);
  
  const [selectedLivreId, setSelectedLivreId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleTerminerEmprunt = async (exemplaireId) => {
  if (!window.confirm("Confirmer le retour du livre ? Cela libérera l'exemplaire.")) return;

  try {
    // 1. On supprime l'emprunt (DELETE)
    // Note : Comme c'est un OneToOne avec primary_key=True sur id_exemplaire, 
    // l'ID de l'emprunt est le même que celui de l'exemplaire.
    const resDelete = await fetchWithAuth(`http://localhost:8000/api/emprunts/${exemplaireId}/`, {
      method: 'DELETE'
    });

    if (resDelete.ok) {
      alert("Livre rendu avec succès !");
      
      // 3. Rafraîchir les données
      fetchExemplaires(selectedLivreId);
      setEditingItem(null); // On ferme le volet
    } else {
      alert("Erreur lors du retour du livre.");
    }
  } catch (err) {
    console.error("Erreur retour livre:", err);
  }
};

  // --- FETCH DES DONNÉES ---
  const fetchData = useCallback(async () => {
    try {
      const [resAut, resLiv] = await Promise.all([
        fetchWithAuth('http://localhost:8000/api/authors/'),
        fetchWithAuth('http://localhost:8000/api/books/')
      ]);
      const jAut = await resAut.json();
      const jLiv = await resLiv.json();

      // On remplace proprement sans cumuler
      if (jAut.status === "success") setAuteurs(jAut.data.results || jAut.data);
      if (jLiv.status === "success") setLivres(jLiv.data.results || jLiv.data);
      
    } catch (err) { console.error("Erreur:", err); }
  }, []);

  const fetchExemplaires = useCallback(async (livreId) => {
    try {
      const res = await fetchWithAuth(`http://localhost:8000/api/exemplaires/?id_livre=${livreId}`);
      const json = await res.json();
      if (json.status === "success") setExemplaires(json.data.results);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (activeTab === 'exemplaire' && selectedLivreId) fetchExemplaires(selectedLivreId);
  }, [selectedLivreId, activeTab, fetchExemplaires]);

  // --- RENDU DES LISTES (Séparé pour éviter les mélanges) ---
  const renderList = () => {
    // CAS 1 : Onglet Auteur
    if (activeTab === 'auteur') {
      return auteurs.map(aut => (
        <div key={`aut-${aut.id_auteur}`} onClick={() => setEditingItem(aut)}
          className={`p-3 rounded-lg cursor-pointer flex justify-between ${editingItem?.id_auteur === aut.id_auteur ? 'bg-blue-900 border-blue-500 border' : 'hover:bg-gray-700'}`}>
          <span>{aut.nom} {aut.prenom}</span>
          <small className="text-gray-500">ID Auteur: {aut.id_auteur}</small>
        </div>
      ));
    }

    // CAS 2 : Onglet Livre
    if (activeTab === 'livre') {
      return livres.map(liv => (
        <div key={`liv-${liv.id_livre}`} onClick={() => setEditingItem(liv)}
          className={`p-3 rounded-lg cursor-pointer flex justify-between ${editingItem?.id_livre === liv.id_livre ? 'bg-blue-900 border-blue-500 border' : 'hover:bg-gray-700'}`}>
          <span>{liv.titre}</span>
          <small className="text-gray-500">ID Livre: {liv.id_livre}</small>
        </div>
      ));
    }

    // CAS 3 : Onglet Exemplaire (Après sélection du livre)
    if (activeTab === 'exemplaire') {
      if (!selectedLivreId) {
        return livres.map(l => (
          <div key={`sel-liv-${l.id_livre}`} onClick={() => setSelectedLivreId(l.id_livre)} className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer flex justify-between">
            <span>{l.titre}</span>
            <span className="text-blue-400">Choisir →</span>
          </div>
        ));
      }
      return exemplaires.map(ex => (
        <div key={`ex-${ex.id_exemplaire}`} onClick={() => setEditingItem(ex)}
          className={`p-3 rounded-lg cursor-pointer flex justify-between ${editingItem?.id_exemplaire === ex.id_exemplaire ? 'bg-blue-900 border-blue-500 border' : 'hover:bg-gray-700'}`}>
          <span>Exemplaire #{ex.id_exemplaire}</span>
          <span className="text-xs italic">{ex.statut}</span>
        </div>
      ));
    }
  };

  // --- ACTIONS DE MISE À JOUR ---
const handleUpdate = async (e) => {
  e.preventDefault();
  let url = "";
  let body = {};

  // Construction dynamique selon l'onglet
  if (activeTab === 'auteur') {
    url = `http://localhost:8000/api/authors/${editingItem.id_auteur}/`;
    body = { nom: editingItem.nom, prenom: editingItem.prenom };
  } else if (activeTab === 'livre') {
    url = `http://localhost:8000/api/books/${editingItem.id_livre}/`;
    body = { 
      titre: editingItem.titre, 
      id_auteur: editingItem.id_auteur, 
      emplacement_image_couverture: editingItem.emplacement_image_couverture 
    };
  } else {
    url = `http://localhost:8000/api/exemplaires/${editingItem.id_exemplaire}/`;
    body = { 
      id_livre: editingItem.id_livre, 
      statut: editingItem.statut, 
      etat: editingItem.etat 
    };
  }

  try {
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });

    if (res.ok) {
      alert("Modification enregistrée avec succès !");
      setIsEditing(false);
      // Rafraîchir les données
      if (activeTab === 'exemplaire') fetchExemplaires(selectedLivreId);
      else fetchData();
    } else {
      alert("Erreur lors de la sauvegarde.");
    }
  } catch (err) {
    console.error("Erreur PUT:", err);
  }
};

// --- ACTION DE SUPPRESSION ---
const handleDelete = async (type, id) => {
  if (!window.confirm(`Voulez-vous vraiment supprimer cet élément (${type} #${id}) ?`)) return;

  const endpoints = { 
    livre: `books/${id}/`, 
    auteur: `authors/${id}/`, 
    exemplaire: `exemplaires/${id}/` 
  };

  try {
    const res = await fetchWithAuth(`http://localhost:8000/api/${endpoints[type]}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      setEditingItem(null);
      setIsEditing(false);
      // Rafraîchir la liste correspondante
      if (type === 'exemplaire') fetchExemplaires(selectedLivreId);
      else fetchData();
    }
  } catch (err) {
    console.error("Erreur DELETE:", err);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLONNE GAUCHE */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex gap-2 mb-4">
            {['livre', 'auteur', 'exemplaire'].map(t => (
              <button key={t} onClick={() => {setActiveTab(t); setEditingItem(null); setSelectedLivreId(null);}} 
                className={`flex-1 py-1 rounded ${activeTab === t ? 'bg-blue-600' : 'bg-gray-700 text-xs'}`}>{t}</button>
            ))}
          </div>
          <div className="h-[500px] overflow-y-auto space-y-2">
            {renderList()}
          </div>
          {selectedLivreId && activeTab === 'exemplaire' && (
            <button onClick={() => setSelectedLivreId(null)} className="w-full mt-2 text-xs text-blue-400 underline">Retour aux livres</button>
          )}
        </div>

        {/* COLONNE DROITE (DÉTAILS & ACTIONS) */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-10 h-fit min-h-[400px]">
          {editingItem ? (
          <div className="space-y-6">
            {/* Header commun */}
            <div className="border-b border-gray-700 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-blue-400 capitalize">{activeTab}</h2>
                <p className="text-xs text-gray-500 italic">ID: #{editingItem.id_auteur || editingItem.id_livre || editingItem.id_exemplaire}</p>
              </div>
              <button onClick={() => {setIsEditing(false); setEditingItem(null);}} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {!isEditing ? (
              /* --- 1. MODE VUE (DÉTAILS) --- */
              <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
                <div className="space-y-3">
                  {activeTab === 'auteur' && <p><span className="text-gray-500 text-xs block">Nom complet</span> {editingItem.nom} {editingItem.prenom}</p>}
                  {activeTab === 'livre' && <p><span className="text-gray-500 text-xs block">Titre</span> {editingItem.titre}</p>}
                  
                  {activeTab === 'exemplaire' && (
                    <>
                      <p><span className="text-gray-500 text-xs block">Statut</span> 
                        <span className={`px-2 py-0.5 rounded text-xs ${editingItem.statut === 'disponible' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>{editingItem.statut}</span>
                      </p>
                      <p><span className="text-gray-500 text-xs block">État</span> {editingItem.etat}</p>
                      
                      {/* --- C'EST ICI QU'IL MANQUAIT LE BLOC --- */}
                      {editingItem.info_emprunt && (
                        <div className="mt-4 p-4 bg-blue-900/40 border border-blue-500/50 rounded-lg animate-in zoom-in duration-300">
                          <h3 className="text-blue-400 text-xs font-bold uppercase mb-2">👤 Emprunteur Actuel</h3>
                          <p className="text-sm text-white font-medium">{editingItem.info_emprunt.nom_utilisateur}</p>
                          <p className="text-xs text-gray-400">Retour prévu : {new Date(editingItem.info_emprunt.retour_prevu).toLocaleDateString()}</p>
                          <button 
                            onClick={() => handleTerminerEmprunt(editingItem.id_exemplaire)}
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white text-xs py-1.5 rounded font-bold transition-all"
                          >
                            Marquer comme rendu
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <button onClick={() => setIsEditing(true)} className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold transition">✏️ Modifier</button>
                  <button onClick={() => handleDelete(activeTab, editingItem.id_auteur || editingItem.id_livre || editingItem.id_exemplaire)} className="w-full border border-red-500/50 text-red-500 hover:bg-red-500/10 py-2 rounded font-bold transition">🗑️ Supprimer</button>
                </div>
              </div>
            ) : (
              /* --- 2. MODE ÉDITION (FORMULAIRE) --- */
              <form onSubmit={handleUpdate} className="space-y-4 animate-in fade-in duration-300">
                {activeTab === 'auteur' && (
                  <>
                    <input type="text" value={editingItem.nom} onChange={(e) => setEditingItem({...editingItem, nom: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded" placeholder="Nom" />
                    <input type="text" value={editingItem.prenom} onChange={(e) => setEditingItem({...editingItem, prenom: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded" placeholder="Prénom" />
                  </>
                )}

                {activeTab === 'livre' && (
                  <>
                    <input type="text" value={editingItem.titre} onChange={(e) => setEditingItem({...editingItem, titre: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded" placeholder="Titre" />
                  </>
                )}

                {activeTab === 'exemplaire' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Statut</label>
                      <select value={editingItem.statut} onChange={(e) => setEditingItem({...editingItem, statut: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded">
                        <option value="disponible">Disponible</option>
                        <option value="emprunté">Emprunté</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">État</label>
                      <select value={editingItem.etat} onChange={(e) => setEditingItem({...editingItem, etat: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded">
                        <option value="Neuf">Neuf</option>
                        <option value="Bon état">Bon état</option>
                        <option value="Usé">Usé</option>
                        <option value="Abîmé">Abîmé</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded font-bold">Enregistrer</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded">Annuler</button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 italic text-center py-20">
            Sélectionnez un élément à gauche pour voir les détails.
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
