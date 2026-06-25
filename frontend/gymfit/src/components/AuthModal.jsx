import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api.js";
import { AuthContext } from './AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLoginMode) {
                // 1. Facem logarea standard
                const res = await api.post('/api/Auth/login', {
                    email,
                    password
                });

                const token = res.data.token;

                // 2. Setăm token-ul în localStorage imediat pentru ca
                // interceptorul API să îl poată folosi la următoarea cerere
                localStorage.setItem('token', token);
                login(token);

                // 3. Verificăm istoricul abonamentelor
                const historyRes = await api.get('/api/Account/subscription-history');

                onClose(); // Închidem modalul

                // 4. Redirecționăm în funcție de istoric
                if (historyRes.data.length === 0) {
                    navigate('/choose-plan'); // Cont nou fără istoric
                } else {
                    navigate('/library'); // Cont vechi cu istoric
                }

            } else {
                await api.post('/api/Auth/register-full', {
                    firstName,
                    lastName,
                    email,
                    password
                });
                alert("Account created successfully! Please log in.");
                setIsLoginMode(true);
                setFirstName('');
                setLastName('');
                setPassword('');
            }
        } catch (err) {
            console.error(err);
            if (err.response?.data?.errors) {
                const firstErrorKey = Object.keys(err.response.data.errors)[0];
                setError(err.response.data.errors[firstErrorKey][0]);
            } else if (Array.isArray(err.response?.data) && err.response.data.length > 0) {
                setError(err.response.data[0].description);
            } else {
                setError("An error occurred. Please check your credentials and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="bg-[#161B28] w-full max-w-md rounded-[2rem] p-8 border border-[#2DE8DA]/20 shadow-2xl shadow-[#2DE8DA]/10 relative">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[#818FA2] hover:text-white transition-colors"
                >
                    ✕
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                        {isLoginMode ? 'Welcome Back' : 'Join Pulse'}
                    </h2>
                    <p className="text-[#818FA2] text-sm">
                        {isLoginMode ? 'Log in to manage your workouts.' : 'Create an account to start your journey.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLoginMode && (
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-[10px] text-[#2DE8DA] mb-1 font-bold uppercase tracking-wider">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-[#0A0E17] border border-[#818FA2]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#2DE8DA] transition-colors"
                                    placeholder="John"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] text-[#2DE8DA] mb-1 font-bold uppercase tracking-wider">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-[#0A0E17] border border-[#818FA2]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#2DE8DA] transition-colors"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] text-[#2DE8DA] mb-1 font-bold uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0A0E17] border border-[#818FA2]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#2DE8DA] transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-[#2DE8DA] mb-1 font-bold uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0A0E17] border border-[#818FA2]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#2DE8DA] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-4 rounded-xl font-black bg-[#2DE8DA] text-[#0A0E17] hover:bg-cyan-300 transition-all uppercase tracking-widest text-sm disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLoginMode(!isLoginMode);
                            setError('');
                        }}
                        className="text-[#818FA2] hover:text-white text-xs transition-colors"
                    >
                        {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;