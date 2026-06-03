import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MainMenu from './components/MainMenu';
import Profile from './components/Profile';
import WorkoutLibrary from './components/WorkoutLibrary';
import WorkoutDetails from './components/WorkoutDetails';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <MainMenu />

            <Routes>
                <Route path="/" element={<Navigate to="/library" replace />} />
                <Route path="/library" element={<WorkoutLibrary />} />


                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/workout/:id"
                    element={
                        <PrivateRoute>
                            <WorkoutDetails />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;