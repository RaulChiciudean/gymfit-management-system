import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import AddWorkoutModal from './AddWorkoutModal';

const WorkoutLibrary = () => {
    const [workouts, setWorkouts] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All Workouts');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filters = ['All Workouts', 'Strength', 'Endurance', 'Flexibility'];

    const fetchWorkouts = async () => {
        try {
            const response = await api.get('/api/SportClass');
            setWorkouts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error loading workouts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null') {
            try {
                const decoded = jwtDecode(token);
                const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                setIsAdmin(roleClaim === 'Admin' || (Array.isArray(roleClaim) && roleClaim.includes('Admin')));
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        fetchWorkouts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this workout?")) {
            try {
                await api.delete(`/api/SportClass/${id}`);
                setWorkouts(workouts.filter(workout => workout.id !== id));
            } catch (error) {
                console.error("Error deleting workout:", error);
            }
        }
    };

    const filteredWorkouts = workouts.filter(workout => {
        if (!workout || !workout.name) return false;

        const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase());
        const nameLower = workout.name.toLowerCase();

        let matchesFilter = true;
        if (activeFilter === 'Strength') {
            matchesFilter = nameLower.includes('strength') || nameLower.includes('power') || nameLower.includes('pump') || nameLower.includes('lift') || nameLower.includes('body');
        } else if (activeFilter === 'Endurance') {
            matchesFilter = nameLower.includes('cardio') || nameLower.includes('hiit') || nameLower.includes('zumba') || nameLower.includes('run') || nameLower.includes('endurance');
        } else if (activeFilter === 'Flexibility') {
            matchesFilter = nameLower.includes('yoga') || nameLower.includes('pilates') || nameLower.includes('stretch') || nameLower.includes('flex');
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-[#0A0E17] text-white p-6 font-sans pb-24">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2 text-[#2DE8DA]">Workout Library</h1>
                    <p className="text-[#818FA2] text-sm">Choose your discipline and push your limits.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full sm:w-auto bg-[#2DE8DA] text-[#0A0E17] font-black px-5 py-2.5 rounded-xl text-sm hover:bg-cyan-300 transition-colors whitespace-nowrap uppercase tracking-wider"
                        >
                            + Add Workout
                        </button>
                    )}

                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search workouts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#161B28] border border-[#161B28]/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#2DE8DA] transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-5 py-2 rounded-full text-sm whitespace-nowrap transition-colors border ${
                            activeFilter === filter
                                ? 'border-[#2DE8DA] text-[#2DE8DA] bg-[#2DE8DA]/10 font-bold'
                                : 'border-[#161B28] text-[#818FA2] bg-[#161B28]/40 hover:border-[#818FA2]/40'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-[#2DE8DA] mt-10 text-center font-bold tracking-wide animate-pulse">Loading workouts...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {filteredWorkouts.map((workout) => (
                        <div key={workout.id} className="relative group rounded-2xl overflow-hidden h-[400px] border border-[#161B28]/60 bg-[#161B28]">
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(workout.id)}
                                    className="absolute top-4 right-4 z-20 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-xl transition-colors backdrop-blur-sm shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                            <Link to={`/workout/${workout.id}`} className="w-full h-full block text-left">
                                <img
                                    src={workout.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000"}
                                    alt={workout.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/40 to-transparent opacity-95"></div>
                                <div className="absolute bottom-0 left-0 w-full p-5 z-10">
                                    <span className="text-[#2DE8DA] text-[10px] font-bold uppercase tracking-widest mb-1 block">GYM WORKOUT</span>
                                    <h2 className="text-white text-2xl font-black mb-3 tracking-tight">{workout?.name || "Untitled Workout"}</h2>
                                    <div className="flex items-center gap-4 text-[#818FA2] text-xs font-medium">
                                        <div className="flex items-center gap-1">
                                            {workout?.duration || 0} min
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            <AddWorkoutModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onWorkoutAdded={fetchWorkouts}
            />
        </div>
    );
};

export default WorkoutLibrary;