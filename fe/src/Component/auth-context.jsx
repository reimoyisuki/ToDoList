import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

<<<<<<< HEAD
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
=======
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
>>>>>>> b3a8c170a67c2f1e38ad7026600f93d2844fa505
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
    }, [api, fetchUserProfile]);

<<<<<<< HEAD
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
=======
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
>>>>>>> b3a8c170a67c2f1e38ad7026600f93d2844fa505
            }
            return false;
        } catch (error) {
<<<<<<< HEAD
            console.error("Profile error:", error.response?.data || error.message);
            if (error.response?.status === 401) logout();
        } finally {
            setLoading(false);
=======
            throw new Error(error.response?.data?.message || 'Update failed');
>>>>>>> b3a8c170a67c2f1e38ad7026600f93d2844fa505
        }
    }, [api]);

<<<<<<< HEAD
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
=======
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
>>>>>>> b3a8c170a67c2f1e38ad7026600f93d2844fa505

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
<<<<<<< HEAD
    if (!context) {
=======
    if (context === undefined) {
>>>>>>> b3a8c170a67c2f1e38ad7026600f93d2844fa505
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};