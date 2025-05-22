import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:4000/user/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            const { data } = response;

            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            navigate('/groups');
        } catch (err) {
            if (err.response ) {
                setError(err.response.data.message || 'Signup failed');
            } else {
                setError('Failed to connect to server');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                        <p className="text-red-100">{error}</p>
                    </div>
                )}
                
                <div className="bg-amber-50 bg-opacity-10 backdrop-blur-sm border border-amber-200 border-opacity-30 rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-amber-900 px-6 py-4 border-b border-amber-700">
                        <h2 className="font-typewriter text-2xl text-amber-100 text-center tracking-wider">
                            <span className="text-amber-300">Start</span> Now
                        </h2>
                        <p className="text-xs text-amber-200 text-center mt-1 font-mono">
                            Create your account and enjoy your group project
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-8 py-6">
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-amber-100 font-noir text-sm mb-2">
                                USERNAME
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-4 py-2 bg-gray-800 bg-opacity-70 border border-amber-700 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-amber-900"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-amber-100 font-noir text-sm mb-2">
                                EMAIL
                            </label>
                            <input
                                type="text"
                                id="email"
                                className="w-full px-4 py-2 bg-gray-800 bg-opacity-70 border border-amber-700 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-amber-900"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-amber-100 font-noir text-sm mb-2">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 bg-gray-800 bg-opacity-70 border border-amber-700 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-amber-900"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-amber-100 font-noir text-sm mb-2">
                                CONFIRM PASSWORD
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full px-4 py-2 bg-gray-800 bg-opacity-70 border border-amber-700 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-amber-900"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-amber-700 hover:bg-amber-600 text-amber-100 font-typewriter py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    CREATING ACCOUNT...
                                </span>
                            ) : (
                                'SIGN UP'
                            )}
                        </button>
                    </form>

                    <div className="px-6 py-4 bg-gray-900 bg-opacity-30 text-center border-t border-amber-900">
                        <p className="text-xs text-amber-200">
                            Already have an account?{' '}
                            <Link to="/login" className="text-amber-400 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}