import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api';

const AddWorkoutModal = ({ isOpen, onClose, onWorkoutAdded }) => {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');
    const [trainerId, setTrainerId] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        if (isOpen) {
            api.get('/api/Trainers')
                .then(res => setTrainers(res.data))
                .catch(err => toast.error("Failed to load trainers."));
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/SportClass', {
                name,
                duration: parseInt(duration),
                maxCapacity: parseInt(maxCapacity),
                trainerId: parseInt(trainerId),
                imageUrl: imageUrl
            });
            toast.success("Workout added successfully!");
            onWorkoutAdded();
            onClose();
        } catch (err) {
            toast.error("Failed to add workout.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <form onSubmit={handleSubmit} className="bg-[#161B28] w-full max-w-sm rounded-3xl p-8 border border-[#2DE8DA]/20 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#818FA2] hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-white font-black text-xl mb-6">Add New Workout</h2>

                <input type="text" placeholder="Workout Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0A0E17] p-3 rounded-xl text-white mb-4 border border-[#818FA2]/30" required />
                <input type="number" placeholder="Duration (min)" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-[#0A0E17] p-3 rounded-xl text-white mb-4 border border-[#818FA2]/30" required />
                <input type="number" placeholder="Max Capacity" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} className="w-full bg-[#0A0E17] p-3 rounded-xl text-white mb-4 border border-[#818FA2]/30" required />
                <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-[#0A0E17] p-3 rounded-xl text-white mb-4 border border-[#818FA2]/30" />

                <select value={trainerId} onChange={(e) => setTrainerId(e.target.value)} className="w-full bg-[#0A0E17] p-3 rounded-xl text-white mb-6 border border-[#818FA2]/30" required>
                    <option value="">Select a Trainer</option>
                    {trainers.map(t => (
                        <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                    ))}
                </select>

                <button type="submit" className="w-full bg-[#2DE8DA] text-[#0A0E17] font-black py-3 rounded-xl">Create Workout</button>
            </form>
        </div>
    );
};

export default AddWorkoutModal;