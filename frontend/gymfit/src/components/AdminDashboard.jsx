import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('trainers'); // 'trainers' | 'workouts' | 'users'

    // State-uri pentru Antrenori
    const [trainers, setTrainers] = useState([]);
    const [newTrainer, setNewTrainer] = useState({ firstName: '', lastName: '' });

    // State-uri pentru Clase/Antrenamente
    const [workouts, setWorkouts] = useState([]);
    const [newWorkout, setNewWorkout] = useState({ name: '', duration: 60, maxCapacity: 20, trainerId: '', imageUrl: '' });

    // State-uri pentru Utilizatori
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (activeTab === 'trainers') fetchTrainers();
        if (activeTab === 'workouts') { fetchWorkouts(); fetchTrainers(); }
        if (activeTab === 'users') fetchUsers();
    }, [activeTab]);

    // ==========================================
    // LOGICĂ ANTRENORI
    // ==========================================
    const fetchTrainers = async () => {
        try {
            const res = await api.get('/api/Trainers');
            setTrainers(res.data);
        } catch (err) {
            toast.error("Failed to load trainers");
        }
    };

    const addTrainer = async (e) => {
        e.preventDefault();
        if (!newTrainer.firstName || !newTrainer.lastName) return toast.error("Fill in all fields");
        try {
            await api.post('/api/Trainers', newTrainer);
            setNewTrainer({ firstName: '', lastName: '' });
            fetchTrainers();
            toast.success("Trainer added successfully!");
        } catch (err) {
            toast.error("Failed to add trainer");
        }
    };

    const deleteTrainer = async (id) => {
        if (!window.confirm("Are you sure you want to delete this trainer?")) return;
        try {
            await api.delete(`/api/Trainers/${id}`);
            fetchTrainers();
            toast.success("Trainer removed");
        } catch (err) {
            toast.error("Cannot delete trainer (might be assigned to a class)");
        }
    };

    // ==========================================
    // LOGICĂ CLASE / ANTRENAMENTE
    // ==========================================
    const fetchWorkouts = async () => {
        try {
            const res = await api.get('/api/SportClass');
            setWorkouts(res.data);
        } catch (err) {
            toast.error("Failed to load classes");
        }
    };

    const addWorkout = async (e) => {
        e.preventDefault();
        if (!newWorkout.name || !newWorkout.trainerId) return toast.error("Name and Trainer are required");
        try {
            await api.post('/api/SportClass', {
                ...newWorkout,
                trainerId: parseInt(newWorkout.trainerId),
                duration: parseInt(newWorkout.duration),
                maxCapacity: parseInt(newWorkout.maxCapacity)
            });
            setNewWorkout({ name: '', duration: 60, maxCapacity: 20, trainerId: '', imageUrl: '' });
            fetchWorkouts();
            toast.success("New class created!");
        } catch (err) {
            toast.error("Failed to create class");
        }
    };

    const deleteWorkout = async (id) => {
        if (!window.confirm("Delete this workout class?")) return;
        try {
            await api.delete(`/api/SportClass/${id}`);
            fetchWorkouts();
            toast.success("Class deleted");
        } catch (err) {
            toast.error("Failed to delete class");
        }
    };

    // ==========================================
    // LOGICĂ UTILIZATORI
    // ==========================================
    const fetchUsers = async () => {
        try {
            // Notă: Va trebui să te asiguri că ai acest endpoint creat în backend (ex: AccountController)
            const res = await api.get('/api/Account/users');
            setUsers(res.data);
        } catch (err) {
            toast.error("Failed to load users list (Check backend endpoint)");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0E17] text-white p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white">HQ <span className="text-[#2DE8DA]">DASHBOARD</span></h1>
                        <p className="text-[#818FA2] text-sm mt-1">Manage your trainers, workouts, and system users.</p>
                    </div>

                    {/* Switcher de Taburi */}
                    <div className="flex bg-[#161B28] p-1.5 rounded-xl border border-zinc-800 self-start">
                        <button
                            onClick={() => setActiveTab('trainers')}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'trainers' ? 'bg-[#2DE8DA] text-[#0A0E17]' : 'text-[#818FA2] hover:text-white'}`}
                        >
                            💼 Trainers
                        </button>
                        <button
                            onClick={() => setActiveTab('workouts')}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'workouts' ? 'bg-[#2DE8DA] text-[#0A0E17]' : 'text-[#818FA2] hover:text-white'}`}
                        >
                            🏋️ Classes
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'users' ? 'bg-[#2DE8DA] text-[#0A0E17]' : 'text-[#818FA2] hover:text-white'}`}
                        >
                            👥 Users
                        </button>
                    </div>
                </div>

                <hr className="border-zinc-800 mb-8" />

                {/* ================= TAB 1: ANTRENORI ================= */}
                {activeTab === 'trainers' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-[#161B28] p-6 rounded-[2rem] border border-[#161B28]/60 h-fit">
                            <h3 className="text-lg font-black mb-4 uppercase tracking-wide text-[#2DE8DA]">Add New Trainer</h3>
                            <form onSubmit={addTrainer} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-black tracking-wider text-[#818FA2] block mb-1">First Name</label>
                                    <input type="text" className="w-full bg-[#0A0E17] border border-zinc-800 rounded-xl p-3 text-white font-bold focus:border-[#2DE8DA] outline-none transition-colors" placeholder="John" value={newTrainer.firstName} onChange={(e) => setNewTrainer({...newTrainer, firstName: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-black tracking-wider text-[#818FA2] block mb-1">Last Name</label>
                                    <input type="text" className="w-full bg-[#0A0E17] border border-zinc-800 rounded-xl p-3 text-white font-bold focus:border-[#2DE8DA] outline-none transition-colors" placeholder="Doe" value={newTrainer.lastName} onChange={(e) => setNewTrainer({...newTrainer, lastName: e.target.value})} />
                                </div>
                                <button type="submit" className="w-full py-3.5 mt-2 rounded-xl font-black bg-[#2DE8DA] text-[#0A0E17] text-xs uppercase tracking-widest hover:bg-cyan-300 transition-all shadow-lg shadow-[#2DE8DA]/10">Save Trainer</button>
                            </form>
                        </div>

                        <div className="lg:col-span-2 bg-[#161B28] p-6 rounded-[2rem] border border-[#161B28]/60">
                            <h3 className="text-lg font-black mb-4 uppercase tracking-wide text-white">Active Rosters ({trainers.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {trainers.map(t => (
                                    <div key={t.id} className="bg-[#0A0E17] p-4 rounded-2xl border border-zinc-800/50 flex justify-between items-center hover:border-zinc-700 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-sm text-[#2DE8DA]">{t.firstName[0]}{t.lastName[0]}</div>
                                            <p className="font-bold text-sm text-white">{t.firstName} {t.lastName}</p>
                                        </div>
                                        <button onClick={() => deleteTrainer(t.id)} className="text-xs font-black text-red-500/70 hover:text-red-400 tracking-wider px-3 py-1.5 rounded-lg hover:bg-red-500/5 transition-colors">REMOVE</button>
                                    </div>
                                ))}
                                {trainers.length === 0 && <p className="text-[#818FA2] text-xs col-span-full">No trainers registered yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= TAB 2: CLASE ================= */}
                {activeTab === 'workouts' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-[#161B28] p-6 rounded-[2rem] border border-[#161B28]/60 h-fit">
                            <h3 className="text-lg font-black mb-4 uppercase tracking-wide text-[#2DE8DA]">Create Sport Class</h3>
                            <form onSubmit={addWorkout} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-black tracking-wider text-[#818FA2] block mb-1">Class Name</label>
                                    <input type="text" className="w-full bg-[#0A0E17] border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none" placeholder="Crossfit Power" value={newWorkout.name} onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] uppercase font-black tracking-wider text-[#818FA2] block mb-1">Duration (Min)</label>
                                        <input type="number" className="w-full bg-[#0A0E17] border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none" value={newWorkout.duration} onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-black tracking-wider text-[#818FA2] block mb-1">Capacity</label>
                                        <input type="number" className="w-full bg-[#0A0E17] border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none" value={newWorkout.maxCapacity} onChange={(e) => setNewWorkout({...newWorkout, maxCapacity: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-black tracking-wider text-[#818FA2] block mb-1">Assign Trainer</label>
                                    <select className="w-full bg-[#0A0E17] border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none" value={newWorkout.trainerId} onChange={(e) => setNewWorkout({...newWorkout, trainerId: e.target.value})}>
                                        <option value="">Select Trainer...</option>
                                        {trainers.map(t => (
                                            <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-black tracking-wider text-[#818FA2] block mb-1">Image URL</label>
                                    <input type="text" className="w-full bg-[#0A0E17] border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none" placeholder="https://..." value={newWorkout.imageUrl} onChange={(e) => setNewWorkout({...newWorkout, imageUrl: e.target.value})} />
                                </div>
                                <button type="submit" className="w-full py-3.5 mt-2 rounded-xl font-black bg-[#2DE8DA] text-[#0A0E17] text-xs uppercase tracking-widest hover:bg-cyan-300 transition-all">Launch Class</button>
                            </form>
                        </div>

                        <div className="lg:col-span-2 bg-[#161B28] p-6 rounded-[2rem] border border-[#161B28]/60">
                            <h3 className="text-lg font-black mb-4 uppercase tracking-wide text-white">Active Workouts ({workouts.length})</h3>
                            <div className="flex flex-col gap-3">
                                {workouts.map(w => (
                                    <div key={w.id} className="bg-[#0A0E17] p-4 rounded-2xl border border-zinc-800/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <img src={w.imageUrl || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=200"} className="w-12 h-12 object-cover rounded-xl" alt="" />
                                            <div>
                                                <p className="font-bold text-base">{w.name}</p>
                                                <p className="text-xs text-[#818FA2]">{w.duration} min • Cap: {w.maxCapacity} seats</p>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteWorkout(w.id)} className="text-xs font-black text-red-500/70 hover:text-red-400 self-end sm:self-center tracking-wider px-3 py-1.5 rounded-lg hover:bg-red-500/5">DELETE CLASS</button>
                                    </div>
                                ))}
                                {workouts.length === 0 && <p className="text-[#818FA2] text-xs">No fitness classes launched yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= TAB 3: UTILIZATORI ================= */}
                {activeTab === 'users' && (
                    <div className="bg-[#161B28] p-6 rounded-[2rem] border border-[#161B28]/60">
                        <h3 className="text-lg font-black mb-4 uppercase tracking-wide text-white">Registered Members</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                <tr className="border-b border-zinc-800 text-[#818FA2] text-xs uppercase tracking-wider">
                                    <th className="py-4 font-black">User Email</th>
                                    <th className="py-4 font-black">Membership Tier</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/40">
                                {users.map((u, index) => (
                                    <tr key={index} className="hover:bg-zinc-800/10">
                                        <td className="py-4 font-bold text-white">{u.email}</td>
                                        <td className="py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                    u.membershipTier === 'Elite'
                                                        ? 'bg-[#2DE8DA]/10 text-[#2DE8DA] border border-[#2DE8DA]/20'
                                                        : 'bg-zinc-800 text-zinc-400'
                                                }`}>
                                                    {u.membershipTier || 'Free / Pro'}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="2" className="py-6 text-center text-[#818FA2] text-xs">
                                            No users fetched. Make sure your C# API endpoint `api/Account/users` is fully setup!
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;