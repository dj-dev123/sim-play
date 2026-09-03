import { createContext, useContext, useEffect, useState } from 'react';
import api, { getToken, setToken } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        if (!getToken()) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.get('/user');
            setUser(data);
        } catch {
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();

        const handleUnauthorized = () => setUser(null);
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    const login = async (username, password) => {
        const { data } = await api.post('/login', { username, password });
        setToken(data.token);
        setUser(data.user);
        return data.redirect;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } finally {
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout, reloadUser: loadUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
