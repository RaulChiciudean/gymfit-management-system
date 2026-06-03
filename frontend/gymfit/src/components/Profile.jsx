import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [bookedClasses, setBookedClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, bookingsRes] = await Promise.all([
                    api.get('/api/Auth/profile'),
                    api.get('/api/bookings')
                ]);

                setUser(profileRes.data);
                setBookedClasses(bookingsRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load profile or booking data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCancelBooking = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await api.delete(`/api/bookings/${id}`);
                setBookedClasses(prevBookings => prevBookings.filter(b => b.id !== id));
            } catch (err) {
                console.error(err);
                alert("Failed to cancel booking. Please try again.");
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
                        <span className="bg-[#2DE8DA] text-[#0A0E17] font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md shadow-[#2DE8DA]/20">
                            PRO USER
                        </span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight mb-1">
                        {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-[#818FA2] text-xs tracking-wide mb-4">
                        {user?.email}
                    </p>

                    <div className="flex gap-3">
                        <span className="px-4 py-1.5 bg-[#161B28] text-[#2DE8DA] rounded-full text-xs font-bold border border-[#2DE8DA]/20">⚡ 24 Days Streak</span>
                        <span className="px-4 py-1.5 bg-[#161B28] text-white rounded-full text-xs font-bold">🏆 Level Elite 4</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    <div className="flex flex-col gap-4">
                        <div className="bg-[#161B28] rounded-[2rem] p-6 border border-[#161B28]/50 flex items-center justify-between">
                            <div>
                                <p className="text-[#818FA2] text-xs font-bold uppercase mb-1">Total Bookings</p>
                                <p className="text-3xl font-black text-[#2DE8DA]">{bookedClasses.length}</p>
                            </div>
                            <div className="text-xl">📅</div>
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

                <div className="bg-[#161B28] rounded-[2rem] p-6 border border-[#161B28]/50">
                    <h3 className="text-sm font-black uppercase text-[#818FA2] mb-4">Recent Achievements</h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between p-3 bg-[#0A0E17] rounded-xl border border-[#161B28]/30">
                            <div className="flex items-center gap-3"><span>🔥</span>
                                <div>
                                    <p className="text-sm font-bold">Iron Heart</p>
                                    <p className="text-xs text-[#818FA2]">Committed to the grind. Sessions active.</p>
                                </div>
                            </div>
                            <span className="text-[11px] text-[#2DE8DA] font-semibold">Unlocked</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;