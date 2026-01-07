const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('access_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, { ...options, headers });

    // Si 401, on tente le refresh
    if (response.status === 401) {
        console.warn("Access token expiré ou invalide, tentative de refresh...");
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            console.error("Pas de refresh token disponible.");
            handleLogout();
            return response;
        }

        try {
            const refreshRes = await fetch('http://localhost:8000/api/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                
                // VÉRIFICATION CRITIQUE : quel est le nom de la clé ?
                const newAccess = data.access || data.token; 
                
                if (newAccess) {
                    console.log("Nouveau token obtenu avec succès !");
                    localStorage.setItem('access_token', newAccess);
                    headers['Authorization'] = `Bearer ${newAccess}`;
                    
                    // On rejoue la requête initiale
                    return fetch(url, { ...options, headers });
                }
            } else {
                console.error("Le refresh token a expiré lui aussi.");
                handleLogout();
            }
        } catch (err) {
            console.error("Erreur réseau pendant le refresh:", err);
            // On ne déconnecte pas forcément ici, c'est peut-être juste une coupure réseau
        }
    }

    return response;
};

// Fonction isolée pour éviter de répéter le code de redirection
const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // On évite le .clear() qui peut supprimer des préférences utilisateur utiles
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

export default fetchWithAuth;
