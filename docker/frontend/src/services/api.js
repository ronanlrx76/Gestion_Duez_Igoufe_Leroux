const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('access_token');
    
    // Configuration de base
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, { ...options, headers });

    // SI ERREUR 401 : Le token a probablement expiré
    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
            // 1. Tenter de rafraîchir le token
            const refreshRes = await fetch('http://localhost:8000/api/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                // 2. Sauvegarder le nouvel access token
                localStorage.setItem('access_token', data.access);

                // 3. Relancer la requête initiale avec le nouveau token
                headers['Authorization'] = `Bearer ${data.access}`;
                return fetch(url, { ...options, headers });
            }
        }

        // Si le refresh a échoué ou s'il n'y a pas de refresh token
        localStorage.clear();
        window.location.href = '/Login';
        return Promise.reject("Session expirée");
    }

    return response;
};

export default fetchWithAuth;
