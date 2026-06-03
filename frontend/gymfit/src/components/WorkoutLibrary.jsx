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

    // useEffect curat, care rulează o singură dată
    useEffect(() => {
        const initPage = async () => {
            // 1. Verificare Token
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verificăm dacă token-ul are structura validă înainte de decodare
                    if (token.split('.').length === 3) {
                        const decoded = jwtDecode(token);
                        const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

                        const isUserAdmin = roleClaim === 'Admin' || (Array.isArray(roleClaim) && roleClaim.includes('Admin'));
                        setIsAdmin(isUserAdmin);
                    } else {
                        throw new Error("Invalid token structure");
                    }
                } catch (error) {
                    console.error("Eroare token:", error);
                    localStorage.removeItem('token'); // Ștergem token-ul dacă e stricat
                }
            }

            // 2. Fetch date
            try {
                const response = await api.get('/api/SportClass');
                setWorkouts(response.data);
            } catch (error) {
                console.error("Eroare la încărcare:", error);
            } finally {
                setLoading(false);
            }
        };

        initPage();
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
        const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = true;
        const nameLower = workout.name.toLowerCase();

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
        <div className="min-h-screen bg-[#121212] text-white p-6 font-sans pb-24">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Workout Library</h1>
                    <p className="text-zinc-400 text-sm">Choose your discipline and push your limits.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Butonul apare doar dacă isAdmin este true */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full sm:w-auto bg-cyan-400 text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-cyan-300 transition-colors whitespace-nowrap"
                        >
                            + Add Workout
                        </button>
                    )}

                    <div className="relative w-full md:w-80">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search workouts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
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
                                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-cyan-400 mt-10 text-center">Loading workouts...</p>
            ) : filteredWorkouts.length === 0 ? (
                <div className="text-center mt-12">
                    <p className="text-zinc-500">No workouts found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {filteredWorkouts.map((workout) => (
                        <div key={workout.id} className="relative group rounded-2xl overflow-hidden h-[400px]">
                            {isAdmin && (
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(workout.id); }}
                                    className="absolute top-4 right-4 z-20 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-xl transition-colors backdrop-blur-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                            <Link to={`/workout/${workout.id}`} className="w-full h-full block text-left animate-fadeIn">
                                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000" alt={workout.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent opacity-90"></div>
                                <div className="absolute bottom-0 left-0 w-full p-5 z-10">
                                    <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-1 block">GYM WORKOUT</span>
                                    <h2 className="text-white text-2xl font-bold mb-3">{workout.name}</h2>
                                    <div className="flex items-center gap-4 text-zinc-300 text-xs font-medium">
                                        <div className="flex items-center gap-1">{workout.duration} min</div>
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
                onWorkoutAdded={(newWorkout) => setWorkouts([...workouts, newWorkout])}
            />
        </div>
    );
};

export default WorkoutLibrary;