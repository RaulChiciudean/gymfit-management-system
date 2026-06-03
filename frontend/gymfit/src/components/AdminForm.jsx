import React, { useState } from 'react';
import axios from 'axios';

const AdminForm = () => {
    const [formData, setFormData] = useState({ name: '', duration: 0, trainerId: 1, maxCapacity: 20, enrolledStudents: 0 });
    const [statusMessage, setStatusMessage] = useState({ text: '', isError: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ text: '', isError: false });

        if (formData.name.trim().length < 3) {
            setStatusMessage({ text: "Numele antrenamentului trebuie să aibă cel puțin 3 caractere.", isError: true });
            return;
        }
        if (formData.duration < 10 || formData.duration > 180) {
            setStatusMessage({ text: "Durata trebuie să fie între 10 și 180 de minute.", isError: true });
            return;
        }
        if (formData.maxCapacity < 1 || formData.maxCapacity > 100) {
            setStatusMessage({ text: "Capacitatea clasei trebuie să fie între 1 și 100 de locuri.", isError: true });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/SportClass', formData);

            if (response.status === 201 || response.status === 200) {
                setStatusMessage({ text: `Succes! Antrenamentul "${formData.name}" a fost adăugat.`, isError: false });
                setFormData({ name: '', duration: 0, trainerId: formData.trainerId, maxCapacity: 20, enrolledStudents: 0 });
            }
        } catch (err) {
            console.error(err);
            setStatusMessage({ text: "Eroare la adăugare. Verifică datele introduse.", isError: true });
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-zinc-900 rounded-3xl mt-10 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">Add New Workout</h2>

            {statusMessage.text && (
                <div className={`p-4 mb-4 rounded-lg text-sm font-medium ${statusMessage.isError ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">Workout Name</label>
                    <input
                        type="text"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        minLength={3}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Duration (min)</label>
                        <input
                            type="number"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                            value={formData.duration || ''}
                            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                            required
                            min={10}
                            max={180}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Max Capacity</label>
                        <input
                            type="number"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                            value={formData.maxCapacity}
                            onChange={(e) => setFormData({...formData, maxCapacity: parseInt(e.target.value) || 20})}
                            required
                            min={1}
                            max={100}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">Trainer ID</label>
                    <input
                        type="number"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                        value={formData.trainerId || ''}
                        onChange={(e) => setFormData({...formData, trainerId: parseInt(e.target.value) || 1})}
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-cyan-400 text-black font-bold p-3 rounded-lg mt-4 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-400/20">
                    SAVE TO DATABASE
                </button>
            </form>
        </div>
    );
};

export default AdminForm;