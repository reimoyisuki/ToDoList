import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Component/Navbar';

export default function GroupChat() {
    const { groupId } = useParams();
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [groupDetails, setGroupDetails] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:4000/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setCurrentUser(response.data.data);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data');
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            if (!currentUser) return;

            try {
                const response = await axios.post(`http://localhost:4000/group/details/${groupId}`, {
                    userId: currentUser._id
                });

                if (response.data.success) {
                    setGroupDetails(response.data.data);
                } else {
                    setError('Failed to load group details');
                }
            } catch (err) {
                console.error('Error fetching group details:', err);
                setError('Failed to load group details');
            }
        };

        const fetchGroupMessages = async () => {
            if (!currentUser) return;

            try {
                setIsLoading(true);
                const response = await axios.post(`http://localhost:4000/message/${groupId}`, {
                    userId: currentUser._id
                });

                if (response.data.success) {
                    setMessages(response.data.data);
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

        fetchGroupDetails();
        fetchGroupMessages();
    }, [currentUser, groupId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post('http://localhost:4000/message/send', {
                groupId,
                senderId: currentUser._id,
                message: newMessage
            });

            if (response.data.success) {
                setMessages([...messages, response.data.data]);
                setNewMessage('');
            } else {
                setError('Failed to send message');
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setError('Failed to send message');
        }
    };

    const handleLeaveGroup = async () => {
        if (window.confirm('Are you sure you want to leave this group?')) {
            try {
                await axios.put('http://localhost:4000/group/remove-member', {
                    groupId,
                    memberId: currentUser._id,
                    adminId: currentUser._id
                });
                navigate('/groups');
            } catch (error) {
                console.error("Failed to leave group:", error);
                setError('Failed to leave group');
            }
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

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
                                        {groupDetails?.admins.some(admin => admin === member._id) && (
                                            <span className="ml-1 text-xs text-amber-400">(admin)</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
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
                                        className={`flex ${message.sender._id === currentUser?._id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                            message.sender._id === currentUser?._id 
                                                ? 'bg-amber-700 text-amber-100 rounded-br-none' 
                                                : 'bg-gray-700 text-gray-100 rounded-bl-none'
                                        }`}>
                                            <div className="text-xs text-amber-300 mb-1">
                                                {message.sender.username} • {formatTime(message.createdAt)}
                                            </div>
                                            <p className="text-sm">{message.message}</p>
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
