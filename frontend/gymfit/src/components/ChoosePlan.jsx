import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from "react-hot-toast";

const ChoosePlan = () => {
    const navigate = useNavigate();

    const handleSelectPlan = async (tier) => {
        try {
            // Dacă alege ELITE, apelăm endpoint-ul de upgrade pe care îl avem deja
            if (tier === 'Elite') {
                await api.post('/api/Account/upgrade');
            } else {
                // Pentru PRO, am putea crea un endpoint de tip "activate-free-plan"
                // Sau pur și simplu îi permitem accesul (dacă logica ta permite)
                await api.post('/api/Account/activate-pro');
            }
            toast.success(`You are now on the ${tier} plan!`);
            navigate('/library');
        } catch (err) {
            toast.error("Failed to set your plan. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0E17] text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-black mb-2">Choose your path</h1>
            <p className="text-[#818FA2] mb-12">Select the plan that fits your goals.</p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* PRO PLAN */}
                <div className="bg-[#161B28] p-8 rounded-[2rem] border border-[#161B28] hover:border-[#818FA2]/30 transition-all">
                    <h2 className="text-2xl font-black mb-4">PRO</h2>
                    <p className="text-[#818FA2] mb-6">Standard access to gym classes.</p>
                    <button onClick={() => handleSelectPlan('Pro')} className="w-full py-4 bg-[#161B28] border border-[#2DE8DA] text-[#2DE8DA] rounded-xl font-bold uppercase hover:bg-[#2DE8DA] hover:text-[#0A0E17]">
                        Choose Pro
                    </button>
                </div>

                {/* ELITE PLAN */}
                <div className="bg-[#161B28] p-8 rounded-[2rem] border border-[#2DE8DA] shadow-lg shadow-[#2DE8DA]/20">
                    <h2 className="text-2xl font-black mb-4 text-[#2DE8DA]">ELITE</h2>
                    <p className="text-[#818FA2] mb-6">Unlimited access + priority booking.</p>
                    <button onClick={() => handleSelectPlan('Elite')} className="w-full py-4 bg-[#2DE8DA] text-[#0A0E17] rounded-xl font-black uppercase hover:bg-cyan-300">
                        Choose Elite
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChoosePlan;