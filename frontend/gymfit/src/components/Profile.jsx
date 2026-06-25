import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { toast } from "react-hot-toast";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [bookedClasses, setBookedClasses] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, bookingsRes, historyRes] = await Promise.all([
                    api.get('/api/Auth/profile'),
                    api.get('/api/bookings'),
                    api.get('/api/Account/subscription-history')
                ]);

                setUser(profileRes.data);
                setBookedClasses(bookingsRes.data);
                setHistory(historyRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load profile or subscription data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpgrade = async () => {
        try {
            await api.post('/api/Account/upgrade');
            // Setăm tier pe 1 (valoarea din backend pentru Elite) ca să se actualizeze instant interfața
            setUser(prev => ({ ...prev, tier: 1 }));

            const historyRes = await api.get('/api/Account/subscription-history');
            setHistory(historyRes.data);

            toast.success("Welcome to Elite status!");
        } catch (err) {
            toast.error("Upgrade failed. Please try again.");
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await api.delete(`/api/bookings/${id}`);
                toast.success("Booking deleted successfully!");
                setBookedClasses(prevBookings => prevBookings.filter(b => b.id !== id));
            } catch (err) {
                toast.error("The cancelling has failed.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0E17] text-white flex items-center justify-center font-sans">
                <p className="text-sm tracking-widest text-[#818FA2] uppercase animate-pulse">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0E17] text-white flex items-center justify-center font-sans">
                <p className="text-sm tracking-widest text-red-400 uppercase">{error}</p>
            </div>
        );
    }

    // Verificăm dacă userul este Elite (1) sau Pro (0 sau nedefinit)
    const isElite = user?.tier === 1 || user?.tier === 'Elite';
    const isPro = user?.tier === 0 || user?.tier === 'Pro' || user?.tier == null;

    return (
        <div className="min-h-screen bg-[#0A0E17] text-white font-sans p-6 pb-24">
            <div className="max-w-5xl mx-auto">

                <div className="flex flex-col items-center text-center mt-4 mb-10">
                    <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#2DE8DA] to-cyan-500 shadow-xl shadow-[#2DE8DA]/10 mb-2 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-[#161B28] flex items-center justify-center text-white text-2xl font-black uppercase">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                    </div>

                    <div className="mb-3">
                        <span className={`font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${isElite ? 'bg-purple-500 text-white shadow-purple-500/20' : 'bg-[#2DE8DA] text-[#0A0E17] shadow-[#2DE8DA]/20'}`}>
                            {isElite ? 'Elite' : 'Pro'} USER
                        </span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight mb-1">
                        {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-[#818FA2] text-xs tracking-wide mb-4">
                        {user?.email}
                    </p>

                    {/* Buton Upgrade - Apare doar dacă userul este PRO */}
                    {isPro && (
                        <button
                            onClick={handleUpgrade}
                            className="bg-transparent border border-[#2DE8DA] text-[#2DE8DA] hover:bg-[#2DE8DA] hover:text-[#0A0E17] transition-all text-xs font-black px-6 py-2 rounded-full uppercase tracking-wider mb-6 cursor-pointer z-10 relative"
                        >
                            Upgrade to ELITE
                        </button>
                    )}

                    <div className="flex gap-3">
                        <span className="px-4 py-1.5 bg-[#161B28] text-[#2DE8DA] rounded-full text-xs font-bold border border-[#2DE8DA]/20">⚡ 24 Days Streak</span>
                        <span className="px-4 py-1.5 bg-[#161B28] text-white rounded-full text-xs font-bold">🏆 Level Elite 4</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="flex flex-col gap-4">
                        <div className="bg-[#161B28] rounded-[2rem] p-6 border border-[#161B28]/50">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[#818FA2] text-xs font-bold uppercase mb-1">Total Bookings</p>
                                    <p className="text-3xl font-black text-[#2DE8DA]">{bookedClasses.length}</p>
                                </div>
                                <div className="text-xl">📅</div>
                            </div>

                            {/* Progresie vizibilă doar pentru utilizatorii Pro */}
                            {isPro && (
                                <div className="mt-2">
                                    <div className="flex justify-between text-[10px] text-[#818FA2] mb-1">
                                        <span>Capacity</span>
                                        <span>{bookedClasses.length} / 10</span>
                                    </div>
                                    <div className="w-full bg-[#0A0E17] h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#2DE8DA] h-full transition-all duration-500"
                                            style={{ width: `${Math.min((bookedClasses.length / 10) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-[#161B28] rounded-[2rem] p-6 border border-[#161B28]/50 flex items-center justify-between">
                            <div>
                                <p className="text-[#818FA2] text-xs font-bold uppercase mb-1">Avg Duration</p>
                                <p className="text-3xl font-black text-white">45 <span className="text-sm font-normal text-[#818FA2]">min</span></p>
                            </div>
                            <div className="text-xl">⏱️</div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#161B28] rounded-[2rem] p-8 border border-[#161B28]/50 relative">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#2DE8DA]"></span>
                            My Booked Training Schedule
                        </h2>

                        {bookedClasses.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-[#818FA2]/20 rounded-2xl">
                                <p className="text-[#818FA2] text-sm mb-4">No reservations for this week.</p>
                                <Link to="/library" className="text-xs bg-[#2DE8DA] text-[#0A0E17] font-black px-5 py-2.5 rounded-full uppercase tracking-wider">Explore library</Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-2">
                                {bookedClasses.map((item) => (
                                    <div key={item.id} className="bg-[#0A0E17] border border-[#161B28] rounded-2xl p-4 flex items-center justify-between group">
                                        <div>
                                            <span className="text-[10px] font-black text-[#2DE8DA] uppercase block">{item.day}</span>
                                            <h3 className="text-base font-bold text-white group-hover:text-[#2DE8DA] transition-colors">{item.className}</h3>
                                            <p className="text-[#818FA2] text-xs">{item.duration} min • Confirmed</p>
                                        </div>
                                        <button onClick={() => handleCancelBooking(item.id)} className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/5 px-4 py-2 rounded-xl border border-red-500/10">Cancel</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Istoricul Abonamentelor și Plăților */}
                <div className="bg-[#161B28] rounded-[2rem] p-8 border border-[#161B28]/50">
                    <h3 className="text-sm font-black uppercase text-[#818FA2] mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Billing & Subscription History
                    </h3>

                    {history.length === 0 ? (
                        <p className="text-[#818FA2] text-sm italic">No payment transactions found.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {history.map((sub) => (
                                <div key={sub.id} className="bg-[#0A0E17] border border-[#161B28]/60 rounded-xl p-4 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-black px-2 py-0.5 rounded uppercase ${sub.tier === 1 ? 'bg-purple-600 text-white' : 'bg-cyan-600 text-white'}`}>
                                                {sub.tier === 1 ? 'ELITE' : 'PRO'}
                                            </span>
                                            <span className="text-xs text-green-400 font-medium">● Active</span>
                                        </div>
                                        <p className="text-xs text-[#818FA2]">
                                            Purchased: {new Date(sub.startDate).toLocaleDateString()} • Expires: {new Date(sub.expiryDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-[#2DE8DA]">${sub.amountPaid.toFixed(2)}</p>
                                        <p className="text-[10px] text-[#818FA2] uppercase tracking-wider">Paid via PulsePay</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;