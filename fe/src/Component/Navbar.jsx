import { IoChatbubblesOutline } from 'react-icons/io5';
import UserProfile from './UserProfile';
import { FaHome, FaUser, FaTasks, FaChalkboard } from 'react-icons/fa';
import { LuPanelLeftOpen, LuPanelLeftClose } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Navbar = ({ isOpen, toggleNavbar }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const getActiveState = (text) => {
        const routeMap = {
            'Group Chat': '/chatlog',
            'ToDo List': '/todolist',
            'Board': '/board',
            'Account': '/account',
        };
        return location.pathname.startsWith(routeMap[text] || '');
    };

    return (
        <div className={`fixed left-0 top-0 h-full bg-gray-900/90 text-amber-700 transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-20'} border-r border-amber-900/30`}>
            <div className="p-4 flex flex-col h-full">
                <button 
                    onClick={toggleNavbar}
                    className="self-end mb-4 hover:text-amber-400 text-xl p-1 rounded-md transition-colors"
                    aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {isOpen ? <LuPanelLeftClose size={24} /> : <LuPanelLeftOpen size={24} />}
                </button>
                
                <UserProfile isOpen={isOpen} />
                
                <nav className="mt-8 flex-1">
                    <ul className="space-y-2">
                        <NavItem 
                            isOpen={isOpen} 
                            icon={<IoChatbubblesOutline size={20} />} 
                            text="Group" 
                            to="/groups"
                            active={getActiveState('Group Chat')} 
                        />
                        <NavItem 
                            isOpen={isOpen} 
                            icon={<FaTasks size={20} />} 
                            text="ToDo List" 
                            to="/todolist"
                            active={getActiveState('ToDo List')} 
                        />
                        <NavItem 
                            isOpen={isOpen} 
                            icon={<FaChalkboard size={20} />} 
                            text="Board" 
                            to="/board"
                            active={getActiveState('Board')} 
                        />
                        <NavItem 
                            isOpen={isOpen} 
                            icon={<FaUser size={20} />} 
                            text="Account" 
                            to="/account"
                            active={getActiveState('Account')} 
                        />
                    </ul>
                </nav>
            </div>
        </div>
    );
};

const NavItem = ({ isOpen, icon, text, to, active }) => {
    return (
        <li className="relative group">
            <Link 
                to={to}
                className={`flex items-center p-3 pl-5 rounded-lg transition-colors duration-200 relative font-mono
                    ${active 
                        ? 'bg-amber-900/30 text-amber-400 border border-amber-800/50' 
                        : 'hover:bg-gray-800/50 hover:text-amber-300'}
                `}
            >
                <span className={`absolute left-0 top-0 h-full w-1 transition-all duration-300
                    ${active ? 'bg-amber-500' : 'bg-amber-600 scale-y-0 group-hover:scale-y-100 origin-top'}`}
                />
                
                <span className="text-xl">{icon}</span>
                {isOpen && <span className="ml-3">{text}</span>}
            </Link>
        </li>
    );
};

export default Navbar;