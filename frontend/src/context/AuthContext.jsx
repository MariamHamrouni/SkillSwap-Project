import { createContext, useState, useEffect, useContext } from 'react';

// 1. Création du Context
const AuthContext = createContext();

// 2. Le Provider (Le composant qui va englober l'app)
export const AuthProvider = ({ children }) => {
    // État de l'utilisateur (null si pas connecté)
    const [user, setUser] = useState(null);

    // Au chargement de la page, on vérifie le localStorage
    useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
        try {
            // On essaie de lire le JSON
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(userInfo));
        } catch (error) {
            // Si le JSON est cassé, on nettoie tout pour éviter le crash
            console.error("Erreur lecture localStorage:", error);
            localStorage.removeItem('userInfo');
            setUser(null);
        }
    }
}, []);

    // Fonction de Connexion (appelée après le succès d'Axios)
    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData); // Met à jour l'état immédiatement
    };

    // Fonction de Déconnexion
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Un petit Hook personnalisé pour faciliter l'import (Bonus "Pro")
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};