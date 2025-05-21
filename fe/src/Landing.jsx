import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Hero Section */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-4xl text-center">
                    <h1 className="font-typewriter text-4xl md:text-6xl text-amber-100 mb-6">
                        <span className="text-amber-400">Discuss, Play,</span> and Work Away?
                    </h1>
                    <p className="text-lg md:text-xl text-amber-200 mb-10 max-w-2xl mx-auto font-mono">
                        Your Perfect Group Discussion Platform
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link 
                            to="/login" 
                            className="bg-amber-700 hover:bg-amber-600 text-amber-100 px-8 py-3 rounded-md font-typewriter text-lg transition duration-300"
                        >
                            LOG IN
                        </Link>
                        <Link 
                            to="/signup" 
                            className="bg-transparent border-2 border-amber-600 hover:bg-amber-900/30 text-amber-100 px-8 py-3 rounded-md font-typewriter text-lg transition duration-300"
                        >
                            SIGN UP
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-800/50 py-12 px-8 border-t border-amber-900/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl text-amber-300 text-center mb-12 font-typewriter">
                        WHY USE Discuss?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Auto-Deleting Messages",
                                description: "Message can be deleted with double tap",
                            },
                            {
                                title: "To Do List",
                                description: "Manage your assignment to smaller pieces",
                            },
                            {
                                title: "Brainstorming Make it Easy",
                                description: "A whiteboard to discuss (or play)!",
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-gray-900/50 p-6 rounded-lg border border-amber-900/30">
                                <h3 className="text-xl text-amber-200 mb-2 font-typewriter">{feature.title}</h3>
                                <p className="text-amber-300 text-sm font-mono">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900/80 py-6 text-center border-t border-amber-900/20">
                <p className="text-xs text-amber-700 font-mono">
                    © {new Date().getFullYear()} Discuss • All rights reserved to Kelompok 10 • Make Your Group Project Fun
                </p>
            </footer>
        </div>
    );
}