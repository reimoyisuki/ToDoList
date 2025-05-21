import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Setup axios instance
    const api = axios.create({
        baseURL: 'http://localhost:4000',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    });

    const login = async (credentials) => {
        try {
            setLoading(true);
            const { data } = await api.post('/user/login', credentials);
            
            if (data.success && data.token) {
                localStorage.setItem('authToken', data.token);
                await fetchUserProfile();
                setUser({
                    username: data.data.username,
                    email: data.data.email
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/user/profile');
            
            if (data.success) {
                setUser({
                    username: data.data.username,
                    email: data.data.email
                });
            }
        } catch (error) {
            console.error("Profile fetch error:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const value = {
        user,
        loading,
        login,
        logout: () => {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);