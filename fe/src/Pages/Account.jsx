import { useState } from 'react';
import { useAuth } from '../Component/auth-context';
import Navbar from '../Component/Navbar';

const Account = () => {
  const { user, logout, updateUsername } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  // Fungsi untuk mendapatkan tanggal registrasi
  const getRegistrationDate = () => {
    const date = new Date(user?.createdAt || Date.now());
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle username update
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    try {
      setLoading(true);
      await updateUsername(newUsername);
      setIsEditingUsername(false);
      setNewUsername('');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <Navbar isOpen={isNavOpen} toggleNavbar={() => setIsNavOpen(!isNavOpen)} />
      
      <main className={`transition-all duration-300 ${isNavOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="min-h-[calc(100vh-2rem)] bg-gray-900">
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-amber-400 mb-8 border-b border-amber-700 pb-4">
              Account Settings
            </h1>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-amber-900/30">
              {/* Profile Section */}
              <div className="flex items-center gap-6 mb-8 p-4 bg-gray-700/20 rounded-lg">
                <div className="w-20 h-20 rounded-full bg-amber-700 flex items-center justify-center text-2xl text-amber-100 shadow-lg">
                  {user?.username?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-amber-100 font-mono">
                    {user?.username}
                  </h2>
                  <p className="text-amber-400 text-sm mt-1">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                {/* Username Edit Section */}
                <div className="p-4 bg-gray-700/30 rounded-lg border border-amber-900/20">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <label className="block text-sm text-amber-400 mb-2 font-mono">
                        USERNAME
                      </label>
                      {isEditingUsername ? (
                        <form onSubmit={handleUsernameUpdate} className="flex gap-2">
                          <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="New username"
                            className="flex-1 px-3 py-1 bg-gray-600 border border-amber-700 rounded-md text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            disabled={loading}
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-3 py-1 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-md text-sm flex items-center gap-1"
                          >
                            {loading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingUsername(false)}
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-amber-100 rounded-md text-sm"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-amber-100 font-semibold">
                            {user?.username}
                          </p>
                          <button
                            onClick={() => setIsEditingUsername(true)}
                            className="text-amber-500 hover:text-amber-400 text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                    </div>
                  </div>
                </div>

                {/* Email Section */}
                <div className="p-4 bg-gray-700/30 rounded-lg border border-amber-900/20">
                  <label className="block text-sm text-amber-400 mb-2 font-mono">
                    EMAIL ADDRESS
                  </label>
                  <p className="text-amber-100 font-semibold">
                    {user?.email}
                  </p>
                </div>

                {/* Member Since Section */}
                <div className="p-4 bg-gray-700/30 rounded-lg border border-amber-900/20">
                  <label className="block text-sm text-amber-400 mb-2 font-mono">
                    MEMBER SINCE
                  </label>
                  <p className="text-amber-100 font-semibold">
                    {getRegistrationDate()}
                  </p>
                </div>

                {/* Owned Groups Section */}
                <div className="p-4 bg-gray-700/30 rounded-lg border border-amber-900/20">
                  <label className="block text-sm text-amber-400 mb-2 font-mono">
                    OWNED GROUPS ({user?.groups?.filter(g => g.isAdmin).length || 0})
                  </label>
                  <div className="space-y-3 mt-2">
                    {user?.groups?.filter(g => g.isAdmin).map(group => (
                      <div key={group.id} className="p-3 bg-gray-600/20 rounded-md border border-amber-900/20">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-amber-200 font-semibold">{group.name}</h3>
                            <p className="text-amber-400 text-sm">{group.description}</p>
                          </div>
                          <div className="text-xs text-amber-500">
                            {group.memberCount} members
                          </div>
                        </div>
                      </div>
                    ))}
                    {user?.groups?.filter(g => g.isAdmin).length === 0 && (
                      <p className="text-amber-500 text-sm">You don't own any groups yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-8 flex justify-end border-t border-amber-900/30 pt-6">
                <button
                  onClick={logout}
                  className="px-6 py-2 bg-red-700/80 hover:bg-red-600 text-amber-100 rounded-md 
                    transition-colors flex items-center gap-2 group"
                >
                  <svg 
                    className="w-5 h-5 group-hover:rotate-90 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;