import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Axios instance dengan interceptor
    const api = axios.create({
        baseURL: 'http://localhost:4000',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Interceptor untuk menambahkan token
    api.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Fungsi login
    const login = async (credentials) => {
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
            throw new Error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // Fungsi fetch profil user
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/user/profile');
            
            if (data.success) {
                setUser({
                    id: data.data._id,
                    username: data.data.username,
                    email: data.data.email,
                    createdAt: data.data.createdAt,
                    groups: data.data.groups?.map(g => ({
                        id: g._id,
                        name: g.name,
                        description: g.description,
                        isAdmin: g.isAdmin,
                        memberCount: g.memberCount
                    })) || []
                });
            }
        } catch (error) {
            console.error("Profile error:", error.response?.data || error.message);
            if (error.response?.status === 401) logout();
        } finally {
            setLoading(false);
        }
    };

    // Fungsi update username
    const updateUsername = async (newUsername) => {
        try {
            if (!user?.id) throw new Error('User ID not found');
            
            const { data } = await api.put(`/changename/${user.id}`, {
                newUsername
            });

            if (data.success) {
                setUser(prev => ({
                    ...prev,
                    username: newUsername
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Update error:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || 
                (error.code === 11000 ? 'Username already exists' : 'Update failed');
            throw new Error(errorMsg);
        }
    };

    // Fungsi logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Auto-fetch profile saat mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await fetchUserProfile();
                } catch (error) {
                    logout();
                }
            } else {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    // Value context
    const value = {
        user,
        loading,
        login,
        logout,
        updateUsername,
        refreshProfile: fetchUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};