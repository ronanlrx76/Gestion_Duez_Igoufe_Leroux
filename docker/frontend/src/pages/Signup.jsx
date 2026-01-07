import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idRole, setIdRole] = useState(1); // 1 pour Étudiant par défaut (à adapter selon tes IDs en base)

  const handleSubmit = (e) => {
    e.preventDefault();

    // On prépare l'objet pour qu'il match parfaitement ton RegisterInputSerializer
    const data = {
      nom: nom,
      prenom: prenom,
      email: email,
      password: password,
      date_naissance: dateNaissance,
      id_role: parseInt(idRole) // On s'assure que c'est un entier pour le serializer
    };

    fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
          navigate('/Login');
        } else {
          // Gestion des erreurs (ex: email déjà utilisé)
          alert("Erreur : " + (res.message || "Vérifiez vos informations"));
        }
      })
      .catch((err) => {
        console.error("Erreur Inscription:", err);
        alert("Une erreur réseau est survenue.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-8 px-4">
      <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Inscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-medium mb-1 text-sm">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Prénom"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1 text-sm">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Nom"
                required
              />
            </div>
          </div>

          {/* Liste déroulante pour le Rôle */}
          <div>
            <label className="block text-gray-300 font-medium mb-1 text-sm">Vous êtes :</label>
            <select
              value={idRole}
              onChange={(e) => setIdRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={2}>Étudiant</option>
              <option value={3}>Enseignant</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1 text-sm">Date de naissance</label>
            <input
              type="date"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="votre@email.fr"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1 text-sm">Mot de passe (8 car. min)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="********"
              minLength="8"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold mt-4"
          >
            Créer mon compte
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Déjà un compte ?{' '}
          <NavLink to="/Login" className="text-blue-500 hover:underline">
            Se connecter
          </NavLink>
        </p>
      </div>
    </div>
  );
}
