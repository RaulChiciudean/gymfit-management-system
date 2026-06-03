import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from './AuthContext';

const WorkoutDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [workout, setWorkout] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', duration: 0, trainerId: 1, maxCapacity: 20 });
    const [selectedDay, setSelectedDay] = useState('Monday');

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        api.get(`/api/SportClass/${id}`)
            .then(res => {
                setWorkout(res.data);
                setEditData(res.data);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleJoinClass = async () => {
        try {
            await api.post('/api/bookings', {
                classId: id.toString(),
                className: workout.name,
                day: selectedDay,
                duration: workout.duration
            });

            alert(`Booking successful for ${selectedDay}!`);

            const res = await api.get(`/api/SportClass/${id}`);
            setWorkout(res.data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to book the class.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this class?")) {
            try {
                await api.delete(`/api/SportClass/${id}`);
                alert("Class deleted successfully!");
                navigate('/library');
            } catch (err) {
                console.error(err);
                alert("Failed to delete the class.");
            }
        }
    };

    const handleSaveUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/SportClass/${id}`, editData);
            alert("Changes saved successfully!");
            const updatedWorkout = await api.get(`/api/SportClass/${id}`);
            setWorkout(updatedWorkout.data);
            setEditData(updatedWorkout.data);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save changes.");
        }
    };

    if (!workout) return <div className="p-10 text-[#2DE8DA] text-center bg-[#0A0E17] min-h-screen">Loading details...</div>;

    const enrolledKey = `enrolled${selectedDay}`;
    const currentEnrolled = workout[enrolledKey] || 0;
    const availableSeats = (workout.maxCapacity || 20) - currentEnrolled;

    return (
        <div className="min-h-screen bg-[#0A0E17] text-white p-6 pb-20 font-sans">
            <div className="max-w-5xl mx-auto">
                <Link to="/library" className="text-[#818FA2] hover:text-white mb-6 inline-block text-sm">← Back to Library</Link>

                <div className="relative h-[280px] rounded-[2rem] overflow-hidden mb-8 border border-[#161B28]">
                    <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000" className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/40 to-transparent flex items-end p-8">
                        {isEditing ? (
                            <div className="w-full">
                                <label className="block text-xs text-[#2DE8DA] mb-1 font-bold uppercase tracking-wider">Workout Name</label>
                                <input
                                    type="text"
                                    className="bg-[#0A0E17] border border-[#2DE8DA] rounded-xl p-3 text-2xl font-black w-full text-white focus:outline-none"
                                    value={editData.name}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                />
                            </div>
                        ) : (
                            <h1 className="text-5xl font-black tracking-tight">{workout.name}</h1>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#818FA2] mb-3">Select Schedule Day</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {daysOfWeek.map(day => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => setSelectedDay(day)}
                                className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                                    selectedDay === day
                                        ? 'bg-[#2DE8DA] text-[#0A0E17] border-[#2DE8DA] shadow-lg shadow-[#2DE8DA]/10'
                                        : 'bg-[#161B28] text-[#818FA2] border-transparent hover:border-[#818FA2]/30'
                                }`}
                            >
                                {day.substring(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSaveUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end mb-8">
                        <div className="bg-[#161B28] p-6 rounded-[2rem] border border-[#161B28]/60">
                            <p className="text-[#818FA2] text-[10px] font-black uppercase tracking-wider mb-1">Expert Coach</p>
                            {isEditing ? (
                                <input
                                    type="number"
                                    className="w-full bg-[#0A0E17] border border-zinc-700 rounded-lg p-1.5 text-white font-bold"
                                    value={editData.trainerId || ''}
                                    onChange={(e) => setEditData({...editData, trainerId: parseInt(e.target.value) || 1})}
                                />
                            ) : (
                                <p className="text-base font-bold truncate">
                                    {workout.trainer ? `${workout.trainer.firstName} ${workout.trainer.lastName}` : `Trainer #${workout.trainerId}`}
                                </p>
                            )}
                        </div>

                        <div className="bg-[#161B28] p-6 rounded-[2rem] border border-[#161B28]/60">
                            <p className="text-[#818FA2] text-[10px] font-black uppercase tracking-wider mb-1">Duration</p>
                            {isEditing ? (
                                <input
                                    type="number"
                                    className="w-full bg-[#0A0E17] border border-zinc-700 rounded-lg p-1.5 text-[#2DE8DA] font-bold"
                                    value={editData.duration}
                                    onChange={(e) => setEditData({...editData, duration: parseInt(e.target.value) || 0})}
                                />
                            ) : (
                                <p className="text-base font-bold">{workout.duration} min <span className="text-[#2DE8DA] block text-xs font-medium">{selectedDay}</span></p>
                            )}
                        </div>

                        <div className="bg-[#161B28] p-6 rounded-[2rem] border border-[#161B28]/60">
                            <p className="text-[#818FA2] text-[10px] font-black uppercase tracking-wider mb-1">Available Seats</p>
                            {isEditing ? (
                                <input
                                    type="number"
                                    className="w-full bg-[#0A0E17] border border-zinc-700 rounded-lg p-1.5 text-emerald-400 font-bold"
                                    value={editData.maxCapacity}
                                    onChange={(e) => setEditData({...editData, maxCapacity: parseInt(e.target.value) || 0})}
                                />
                            ) : (
                                <p className={`text-base font-bold ${availableSeats === 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                                    {availableSeats} left <span className="text-[#818FA2] text-xs font-normal block">of {workout.maxCapacity || 20}</span>
                                </p>
                            )}
                        </div>

                        <div>
                            {isEditing ? (
                                <div className="flex flex-col gap-2">
                                    <button type="submit" className="w-full py-3.5 rounded-xl font-bold bg-emerald-500 text-black text-xs uppercase tracking-wider">Save</button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="w-full py-2 rounded-xl font-bold bg-zinc-800 text-zinc-400 text-xs">Cancel</button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleJoinClass}
                                    disabled={availableSeats <= 0}
                                    className={`w-full h-[68px] rounded-xl font-black text-sm tracking-widest transition-all ${
                                        availableSeats <= 0
                                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                            : 'bg-[#2DE8DA] text-[#0A0E17] hover:bg-cyan-300 shadow-lg shadow-[#2DE8DA]/10'
                                    }`}
                                >
                                    {availableSeats <= 0 ? 'CLASS FULL' : 'BOOK NOW'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {user?.role === 'Admin' && (
                    <div className="flex gap-4 border-t border-[#161B28] pt-6">
                        {!isEditing && (
                            <>
                                <button onClick={() => setIsEditing(true)} className="text-xs text-[#818FA2] hover:text-white transition-colors">🔧 Edit Class Settings</button>
                                <button onClick={handleDelete} className="text-xs text-red-500/60 hover:text-red-400 transition-colors">🗑️ Delete Class</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutDetails;