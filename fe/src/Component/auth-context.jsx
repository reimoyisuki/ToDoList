import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Axios instance yang stabil
    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: 'http://localhost:4000',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        instance.interceptors.request.use(config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return instance;
    }, []);

    const fetchUserProfile = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/user/profile');
            if (data.success) {
                setUser({
                    id: data.data._id,
                    username: data.data.username,
                    email: data.data.email
                });
            }
            return data.data;
        } catch (error) {
            console.error("Profile fetch error:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, [api]);

    const login = useCallback(async (credentials) => {
        try {
            setLoading(true);
            const { data } = await api.post('/user/login', credentials);
            
            if (data.success && data.token) {
                localStorage.setItem('token', data.token);
                await fetchUserProfile();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [api, fetchUserProfile]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
    }, []);

    const updateUsername = useCallback(async (newUsername) => {
        try {
            const response = await api.put('/user/update-username', { newUsername });
            if (response.data.success) {
                setUser(prev => ({ ...prev, username: newUsername }));
                return true;
            }
            return false;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Update failed');
        }
    }, [api]);

    // Nilai konteks yang stabil
    const contextValue = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        updateUsername,
        api
    }), [user, loading, login, logout, updateUsername, api]);

    // Effect untuk load user awal
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [fetchUserProfile, user]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};