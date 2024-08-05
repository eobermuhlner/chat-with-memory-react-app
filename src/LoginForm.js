import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from './api';
import UserEditor from './components/Users/UserEditor';
import ToastNotification, { showToast } from './components/ToastNotification';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showUserEditor, setShowUserEditor] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { username, password });
            onLogin(response.data.token);
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    const handleRegister = async (user) => {
        setShowUserEditor(false);
        showToast('Registered user', 'success');
    };

    return (
        <>
            <Form className="login-form" onSubmit={handleSubmit}>
                <ToastNotification />
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button className="login-button" variant="primary" type="submit">
                    Login
                </Button>

                <Button
                    className="create-account-button"
                    variant="secondary"
                    onClick={() => setShowUserEditor(true)}
                >
                    Create Account
                </Button>
            </Form>

            {showUserEditor && (
                <UserEditor
                    user={{ id: null, username: '', password: '', prompt: '', openApiKey: '', roles: [] }}
                    onClose={() => setShowUserEditor(false)}
                    onSave={handleRegister}
                    mode="register"
                />
            )}
        </>
    );
};

export default LoginForm;
