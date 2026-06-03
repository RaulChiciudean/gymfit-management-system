import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import AuthModal from './AuthModal';

const MainMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, logout, user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleProfileClick = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            setIsModalOpen(true);
        } else {
            navigate('/profile');
        }
    };

    return (
        <nav className="bg-[#0A0E17] border-b border-[#161B28]/60 sticky top-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <Link to="/library" className="flex items-center gap-3 group">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:rotate-12">
                        <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="#2DE8DA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[#2DE8DA] font-black tracking-widest text-xl">PULSE</span>
                </Link>

                <div className="flex items-center gap-2 bg-[#161B28]/40 p-1.5 rounded-full border border-[#161B28]/60">
                    <Link
                        to="/library"
                        className={`px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                            isActive('/library') || location.pathname.includes('/workout')
                                ? 'bg-[#2DE8DA] text-[#0A0E17] font-black shadow-lg shadow-[#2DE8DA]/20'
                                : 'text-[#818FA2] hover:text-white'
                        }`}
                    >
                        WORKOUTS
                    </Link>

                    <button
                        onClick={handleProfileClick}
                        className={`px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                            isActive('/profile')
                                ? 'bg-[#2DE8DA] text-[#0A0E17] font-black shadow-lg shadow-[#2DE8DA]/20'
                                : 'text-[#818FA2] hover:text-white'
                        }`}
                    >
                        MY PROFILE
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn && (
                        <button
                            onClick={logout}
                            className="text-xs font-bold text-[#818FA2] hover:text-red-400 tracking-wide transition-colors"
                        >
                            LOGOUT
                        </button>
                    )}

                    <button
                        onClick={handleProfileClick}
                        className="w-10 h-10 rounded-full bg-[#161B28] flex items-center justify-center border-2 border-[#161B28] hover:border-[#2DE8DA] transition-colors"
                    >
                        <span className="text-white text-xs font-black tracking-tighter select-none uppercase">
                            {isLoggedIn && user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : '?'}
                        </span>
                    </button>
                </div>

            </div>

            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </nav>
    );
};

export default MainMenu;