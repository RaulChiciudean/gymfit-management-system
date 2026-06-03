import React, { useState } from 'react';
import api from '../api';

const AddWorkoutModal = ({ isOpen, onClose, onWorkoutAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        duration: '',
        maxCapacity: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                name: formData.name,
                duration: parseInt(formData.duration),
                maxCapacity: parseInt(formData.maxCapacity)
            };

            const response = await api.post('/api/SportClass', payload);
            onWorkoutAdded(response.data);
            setFormData({ name: '', duration: '', maxCapacity: '' });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add workout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Add New Workout</h2>

                {error && <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">Workout Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                            placeholder="e.g., HIIT Core Crusher"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-zinc-400 text-sm mb-1">Duration (min)</label>
                            <input
                                type="number"
                                name="duration"
                                required
                                min="1"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                                placeholder="e.g., 45"
                            />
                        </div>
                        <div>
                            <label className="block text-zinc-400 text-sm mb-1">Max Capacity</label>
                            <input
                                type="number"
                                name="maxCapacity"
                                required
                                min="1"
                                value={formData.maxCapacity}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                                placeholder="e.g., 20"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-400 text-zinc-950 font-bold py-3 rounded-xl hover:bg-cyan-300 transition-colors mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Create Workout'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddWorkoutModal;