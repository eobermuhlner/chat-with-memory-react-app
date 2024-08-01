import React, { useState, useEffect } from 'react';
import MainPage from './MainPage';
import LoginForm from './LoginForm';
import api from './api';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loginRequired, setLoginRequired] = useState(true); // Default to true

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await api.get('/login-required');
                setLoginRequired(response.data);
            } catch (error) {
                console.error('Error fetching config:', error);
            }
        };

        fetchConfig();
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    if (loginRequired && !token) {
        return <LoginForm onLogin={handleLogin} />;
    }

    return <MainPage loginRequired={loginRequired} onLogout={handleLogout} />;
}

export default App;
