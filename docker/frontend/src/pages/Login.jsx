import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:8000/api/login/', {
            method: 'POST', // On précise la méthode
            headers: {
            'Content-Type': 'application/json', // On dit au serveur qu'on envoie du JSON
            },
            body: JSON.stringify({
            mail: email,   // Doit correspondre au champ 'mail' du Serializer
            mdp: password  // Doit correspondre au champ 'mdp' du Serializer
            }),
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.status === "success") {
                // 1. Stocker les tokens (access et refresh)
                localStorage.setItem('access_token', res.data.tokens.access);
                localStorage.setItem('refresh_token', res.data.tokens.refresh);
                
                // 2. Stocker les infos de l'utilisateur (optionnel)
                localStorage.setItem('user', JSON.stringify(res.data.user));
                // 3. Rediriger (exemple)
                navigate('/'); 
            } else {
                alert("Erreur : " + res.message);
            }
        })
        .catch((err) => {
            console.error("Erreur lors de la connexion:", err);
            alert("Une erreur réseau est survenue.");
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-8 px-4">
        <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Connexion</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-300 font-medium mb-1">Email</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Votre email"
                required
                />
            </div>
            <div>
                <label className="block text-gray-300 font-medium mb-1">Mot de passe</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Votre mot de passe"
                required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
                Se connecter
            </button>
            </form>
            <p className="mt-4 text-center text-gray-400">
            Pas encore de compte ?{' '}
            <NavLink to="/Signup" className="text-blue-500 hover:underline">
                S'inscrire
            </NavLink>
            </p>
        </div>
        </div>
    );
}
