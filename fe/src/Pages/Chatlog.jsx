import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Component/Navbar';
import { useAuth } from '../Component/auth-context';

export default function GroupChat() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const {
        user: currentUser,
        api,
        loading: authLoading
    } = useAuth();
    
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [groupDetails, setGroupDetails] = useState(null);
    const [error, setError] = useState('');
    const [isMember, setIsMember] = useState(false);
    const [newMemberUsername, setNewMemberUsername] = useState('');
    const [addMemberSuccess, setAddMemberSuccess] = useState('');
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [addMemberError, setAddMemberError] = useState('');
    
    const messagesEndRef = useRef(null);

    // Reset state ketika group berubah
    useEffect(() => {
        return () => {
            setMessages([]);
            setGroupDetails(null);
            setIsMember(false);
            setError('');
        };
    }, [groupId]);

    // Ambil detail group
    useEffect(() => {
        const fetchGroupDetails = async () => {
            if (!currentUser?.id) return;

            try {
                const response = await api.get(`/group/details/${groupId}`, {
                    userId: currentUser.id
                });

                if (response.data.success) {
                    setGroupDetails(response.data.data);
                    setIsMember(true);
                } else {
                    setError(response.data.message || 'Failed to load group details');
                    setIsMember(false);
                }
            } catch (err) {
                console.error('Error fetching group details:', err);
                setError(err.response?.data?.message || 'Failed to load group details');
                setIsMember(false);
            }
        };

        fetchGroupDetails();
    }, [currentUser, groupId, api]);

    // Ambil pesan group
    useEffect(() => {
        const fetchGroupMessages = async () => {
            if (!currentUser?.id || !isMember) return;

            try {
                setIsLoading(true);
                const response = await api.get(`/message/${groupId}`, {
                    userId: currentUser.id
                });
                console.log('Messages response:', response.data);

                if (response.data) {
                    setMessages(response.data.data || response.data);
                } else {
                    setError('Failed to load messages');
                }
            } catch (err) {
                console.error('Error fetching group messages:', err);
                setError('Failed to load messages');
            } finally {
                setIsLoading(false);
            }
        };

        if (isMember) {
            fetchGroupMessages();
        }
    }, [currentUser, groupId, isMember, api]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !isMember) return;

        try {
            const response = await api.post('/message/send', {
                groupId,
                message: newMessage
            });
            console.log('Message send response:', response.data);

            if (response.data) {
                setMessages(prev => [...prev, response.data]);
            setNewMessage('');
            } else {
                setError('Failed to send message: Invalid response format');
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setError('Failed to send message');
        }
    };

    const handleLeaveGroup = async () => {
        if (window.confirm('Are you sure you want to leave this group?')) {
            try {
                await api.put('/group/remove-member', {
                    groupId,
                    memberId: currentUser.id,
                    adminId: currentUser.id
                });
                navigate('/groups');
            } catch (error) {
                console.error("Failed to leave group:", error);
                setError('Failed to leave group');
            }
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!newMemberUsername.trim()) return;

        setIsAddingMember(true);
        setAddMemberError('');
        setAddMemberSuccess('');

        try {
            const response = await api.put('/group/add-member', {
                groupId,
                memberUsernames: [newMemberUsername.trim()],
                adminId: currentUser.id
            });

            if (response.data.success) {
                // Refresh group details
                const groupResponse = await api.get(`/group/details/${groupId}`, {
                    userId: currentUser.id
                });

                if (groupResponse.data.success) {
                    setGroupDetails(groupResponse.data.data);
                    setNewMemberUsername('');
                    setAddMemberSuccess(`${newMemberUsername} added successfully!`);
                    setTimeout(() => setAddMemberSuccess(''), 3000);
                }
            } else {
                throw new Error(response.data.message || 'Failed to add member');
            }
        } catch (error) {
            console.error("Failed to add member:", error);
            setAddMemberError(error.response?.data?.message || error.message || 'Failed to add member');
        } finally {
            setIsAddingMember(false);
        }
    };

    const isAdmin = groupDetails?.admins.some(admin => admin._id === currentUser?.id);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (authLoading) {
        return <div>Loading user data...</div>;
    }

    if (!currentUser) {
        navigate('/login');
        return null;
    }

    if (!isMember && !isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 p-4">
                <Navbar isOpen={isNavOpen} toggleNavbar={() => setIsNavOpen(!isNavOpen)} />
                <main className={`transition-all duration-300 ${isNavOpen ? 'ml-64' : 'ml-20'}`}>
                    <div className="flex justify-center items-center h-full">
                        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-center">
                            <h3 className="text-2xl text-amber-400 mb-4">Access Denied</h3>
                            <p className="text-gray-300 mb-6">{error || 'You are not a member of this group'}</p>
                            <button
                                onClick={() => navigate('/groups')}
                                className="bg-amber-600 hover:bg-amber-500 text-amber-100 px-4 py-2 rounded-md"
                            >
                                Back to Groups
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <Navbar isOpen={isNavOpen} toggleNavbar={() => setIsNavOpen(!isNavOpen)} />
            <main className={`transition-all duration-300 ${isNavOpen ? 'ml-64' : 'ml-20'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-gray-800 rounded-lg p-4 h-fit">
                        <h3 className="text-cyan-300 font-semibold mb-4">
                            {groupDetails?.name || 'Group'} Members
                        </h3>
                        <div className="space-y-2">
                            {groupDetails?.members.map(member => (
                                <div key={member._id} className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        member._id === currentUser?._id ? 'bg-amber-400' : 'bg-green-400'
                                    }`}></div>
                                    <span className={`text-sm ${
                                        member._id === currentUser?._id ? 'text-amber-300' : 'text-gray-300'
                                    }`}>
                                        {member.username}
                                        {groupDetails?.admins.some(admin => admin._id === member._id) && (
                                            <span className="ml-1 text-xs text-amber-400">(admin)</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Add Member Form (for admins) */}
                        {isAdmin && (
                            <form onSubmit={handleAddMember} className="mt-4">
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="memberUsername"
                                        value={newMemberUsername}
                                        onChange={(e) => setNewMemberUsername(e.target.value)}
                                        placeholder="Enter user's username"
                                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        disabled={isAddingMember}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isAddingMember || !newMemberUsername.trim()}
                                        className="bg-green-600 hover:bg-green-500 text-green-100 px-3 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAddingMember ? 'Adding...' : 'Add Member'}
                                    </button>
                                    {addMemberError && (
                                        <p className="text-xs text-red-400">{addMemberError}</p>
                                    )}
                                </div>
                            </form>
                        )}

                        <button
                            onClick={handleLeaveGroup}
                            className="mt-4 w-full text-xs text-red-400 hover:text-red-300 font-mono border border-red-400 px-2 py-1 rounded"
                        >
                            LEAVE GROUP
                        </button>
                    </div>

                    {/* Chat Box */}
                    <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
                        <div className="bg-gray-700 p-4 border-b border-cyan-600 flex justify-between items-center">
                            <h3 className="font-semibold text-cyan-300">
                                {groupDetails?.name || 'Group Chat'}
                            </h3>
                            <div className="text-xs text-gray-400">
                                {groupDetails?.members.length} members
                                {isAdmin && <span className="ml-1 text-amber-400">• Admin</span>}
                            </div>
                        </div>

                        <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-400 p-4">{error}</div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-amber-400 p-4">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div 
                                        key={message._id}
                                        className={`flex ${message.sender?._id === currentUser?._id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                            message.sender?._id === currentUser?._id 
                                                ? 'bg-amber-700 text-amber-100 rounded-br-none' 
                                                : 'bg-gray-700 text-gray-100 rounded-bl-none'
                                        }`}>
                                            <div className="text-xs text-amber-300 mb-1">
                                                {message.sender?.username} • {formatTime(message.createdAt)}
                                            </div>
                                            <p className="text-sm">{message.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="bg-gray-700 p-4 border-t border-gray-600">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !newMessage.trim()}
                                    className="bg-amber-600 hover:bg-amber-500 text-amber-100 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}