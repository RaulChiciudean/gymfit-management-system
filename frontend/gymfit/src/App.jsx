import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import WorkoutLibrary from './components/WorkoutLibrary';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute'; // IMPORT NOU
import WorkoutDetails from './components/WorkoutDetails';
import { Toaster } from 'react-hot-toast';
import ChoosePlan from "./components/ChoosePlan.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx"; // IMPORT DASHBOARD

function App() {
    return (
        <Router>
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: '#161B28',
                    color: '#fff',
                    border: '1px solid #2DE8DA',
                }
            }} />
            <MainMenu />
            <Routes>
                <Route path="/" element={<Navigate to="/library" replace />} />

                {/* Rute protejate doar pentru utilizatorii logați */}
                <Route element={<PrivateRoute />}>
                    <Route path="/library" element={<WorkoutLibrary />} />
                    <Route path="/workout/:id" element={<WorkoutDetails />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Ruta protejată EXCLUSIV pentru Admini */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                <Route path="*" element={<Navigate to="/library" replace />} />
                <Route path="/choose-plan" element={<ChoosePlan />} />

            </Routes>
        </Router>
    );
}

export default App;