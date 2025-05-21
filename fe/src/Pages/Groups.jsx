import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Component/Navbar';
import { useAuth } from '../Component/auth-context';

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { user: authUser, loading: authLoading } = useAuth();
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroup, setNewGroup] = useState({
        name: '',
        description: '',
        memberUsernames: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !authUser) {
            navigate('/login');
            return;
        }

        if (authUser) {
            const fetchUserGroups = async (userId) => {
                try {
                    const response = await axios.get(`http://localhost:4000/group/user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    console.log('Groups response:', response.data);

                    if (response.data.success) {
                        setGroups(response.data.data || []);
                    } else {
                        setError('Failed to load groups');
                        setGroups([]);
                        setIsLoading(false);
                    }
                } catch (err) {
                    console.error('Error fetching user groups:', err);
                    setError('Failed to load groups');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchUserGroups(authUser.id);
        }
    }, [authUser, authLoading, navigate]);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        
        if (!authUser?.id) {
        setError('User information is not available');
        return;
        }

        try {
            setIsLoading(true);
            setError('');

            // Convert member usernames string to array
            const usernames = newGroup.memberUsernames
                .split(',')
                .map(username => username.trim())
                .filter(username => username !== '');
            
            const allMembers = [authUser.id]; // Use authUser.id instead of currentUser._id

            if (usernames.length > 0) {
                const memberIds = await Promise.all(
                    usernames.map(async (username) => {
                        try {
                            const response = await axios.get(`http://localhost:4000/user/username/${username}`, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            });
                            return response.data.data._id;
                        } catch (error) {
                            console.error(`User ${username} not found`);
                            throw new Error(`User "${username}" not found`);
                        }
                    })
                );
                allMembers.push(...memberIds);
            }

            // Validate members array
            if (allMembers.length === 0) {
                throw new Error("Group must have at least one member");
            }

            const response = await axios.post('http://localhost:4000/group/create', {
                name: newGroup.name,
                description: newGroup.description,
                members: allMembers
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setGroups([...groups, response.data.data]);
                setShowCreateModal(false);
                setNewGroup({
                    name: '',
                    description: '',
                    memberUsernames: ''
                });
            } else {
                setError(response.data.message || 'Failed to create group');
            }
        } catch (err) {
            console.error('Error creating group:', err);
            setError(err.message || 'Failed to create group');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <Navbar isOpen={isNavOpen} toggleNavbar={() => setIsNavOpen(!isNavOpen)} />
            <main className={`transition-all duration-300 ${isNavOpen ? 'ml-64' : 'ml-20'}`}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-cyan-300">Your Groups</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-amber-600 hover:bg-amber-500 text-amber-100 px-4 py-2 rounded-md"
                            >
                                Create Group
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="bg-gray-800/50 border border-gray-700 rounded-md p-8 text-center">
                            <h3 className="text-xl text-amber-400 mb-2">No Groups Yet</h3>
                            <p className="text-gray-400 mb-4">Create your first group to start collaborating</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-amber-600 hover:bg-amber-500 text-amber-100 px-6 py-2 rounded-md"
                            >
                                Create Group
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groups.map(group => (
                                <div 
                                    key={group._id} 
                                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-amber-500/30 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/chatlog/${group._id}`)}
                                >
                                    <div className="bg-gray-700 p-4 border-b border-gray-600">
                                        <h3 className="font-semibold text-amber-300 truncate">{group.name}</h3>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                            {group.description || 'No description provided'}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>
                                                {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                                            </span>
                                            <span>
                                                Created {formatDate(group.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Group Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700">
                            <div className="bg-gray-700 p-4 border-b border-gray-600 flex justify-between items-center">
                                <h3 className="font-semibold text-amber-300">Create New Group</h3>
                                <button 
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-300"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleCreateGroup} className="p-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Group Name</label>
                                        <input
                                            type="text"
                                            value={newGroup.name}
                                            onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                                            placeholder="My Awesome Group"
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Description (Optional)</label>
                                        <textarea
                                            value={newGroup.description}
                                            onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                                            placeholder="What's this group about?"
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            rows="3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">
                                            Add Members (Optional, comma-separated usernames)
                                        </label>
                                        <input
                                            type="text"
                                            value={newGroup.memberUsernames}
                                            onChange={(e) => setNewGroup({...newGroup, memberUsernames: e.target.value})}
                                            placeholder="username1, username2"
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            You will automatically be added as the first member and admin
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 text-gray-300 hover:text-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-amber-600 hover:bg-amber-500 text-amber-100 px-4 py-2 rounded-md disabled:opacity-50"
                                    >
                                        {isLoading ? 'Creating...' : 'Create Group'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}