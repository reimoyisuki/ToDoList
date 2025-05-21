import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [credentials, setCredentials] = useState({
        emailOrUsername: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Determine if input is email or username
        const isEmail = credentials.emailOrUsername.includes('@');
        const loginData = {
            [isEmail ? 'email' : 'username']: credentials.emailOrUsername,
            password: credentials.password
        };

        console.log('Logging in with:', loginData);

        try {
            const response = await axios.post('http://localhost:4000/user/login', loginData);
            const { data } = response;
            
            if (data.success && data.token) {
                localStorage.setItem('token', data.token);
                console.log('Login successful, redirecting...');
                navigate('/chatlog');
            } else {
                setError('Login failed - Invalid response from server');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Login failed');
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
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                    <p className="text-red-100">{error}</p>
                </div>
            )}
            <div className="bg-amber-50 bg-opacity-10 backdrop-blur-sm border border-amber-200 border-opacity-30 rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-amber-900 px-6 py-4 border-b border-amber-700">
                    <h2 className="font-typewriter text-2xl text-amber-100 text-center tracking-wider">
                        <span className="text-amber-300">Welcome</span> Back!
                    </h2>
                    <p className="text-xs text-amber-200 text-center mt-1 font-mono">
                        Continue planning with your group?
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="px-8 py-6">
                    <div className="mb-6">
                        <label htmlFor="emailOrUsername" className="block text-amber-100 font-noir text-sm mb-2">
                            USERNAME OR EMAIL
                        </label>
                        <input
                            type="text"
                            id="emailOrUsername"
                            className="w-full px-4 py-2 bg-gray-800 bg-opacity-70 border border-amber-700 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-amber-900"
                            placeholder="Enter your username or email"
                            value={credentials.emailOrUsername}
                            onChange={(e) => setCredentials({...credentials, emailOrUsername: e.target.value})}
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="password" className="block text-amber-100 font-noir text-sm mb-2">
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 bg-gray-800 bg-opacity-70 border border-amber-700 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-amber-900"
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            required
                            minLength="6"
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
                                AUTHENTICATING...
                            </span>
                        ) : (
                            'LOG IN'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-900 bg-opacity-30 text-center border-t border-amber-900">
                    <p className="text-xs text-amber-700 font-mono">
                        Make Your Group Project Fun
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
}