import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Component/auth-context';
import Landing from './Landing';
import Login from './Auth/Login';
import Signup from './Auth/Register';
import Chatlog from './Pages/Chatlog';
import Navbar from './Component/Navbar';
import TodoList from './Pages/TodoList';
import Drawboard from './Pages/Board';
import Account from './Pages/Account';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/navbar" element={<Navbar />} />
                    <Route 
                        path="/chatlog" 
                        element={
                            <ProtectedRoute>
                                <Navbar />
                                <Chatlog />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/todolist" 
                        element={
                            <ProtectedRoute>
                                <Navbar />
                                <TodoList />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/board" 
                        element={
                            <ProtectedRoute>
                                <Navbar />
                                <Drawboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/account" 
                        element={
                            <ProtectedRoute>
                                <Navbar />
                                <Account />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;