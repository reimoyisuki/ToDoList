import { useAuth } from './auth-context';

const UserProfile = ({ isOpen }) => {
    const { user, loading } = useAuth();

    console.log('UserProfile render - user:', user); // Debugging

    const getInitials = () => {
        if (!user?.username) return '??';
        return user.username
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        console.log('Loading user data...'); // Debugging
        return (
            <div className="flex items-center p-2 border-b border-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
                {isOpen && (
                    <div className="ml-3 space-y-2">
                        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-3 w-32 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                )}
            </div>
        );
    }

    console.log('Rendering with user:', user); // Debugging

    return (
        <div className="flex items-center p-2 border-b border-gray-700">
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white">
                    <span className="text-lg">{getInitials()}</span>
                </div>
            </div>
            {isOpen && (
                <div className="ml-3">
                    <p className="font-bold text-white">
                        {user?.username || 'Guest'}
                    </p>
                    <p className="text-sm text-gray-300">
                        {user?.email || 'guest@example.com'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserProfile;