import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Dropdown, DropdownButton, Badge } from 'react-bootstrap';
import ToastNotification, { showToast } from '../ToastNotification';
import api from '../../api';
import PropTypes from 'prop-types';
import ChangePasswordDialog from './ChangePasswordDialog';
import { FaPlus, FaTimes } from 'react-icons/fa';

function UserEditor({ user, onClose, onSave, mode }) {
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [prompt, setPrompt] = useState(user.prompt || '');
    const [openaiApiKey, setOpenaiApiKey] = useState(user.openaiApiKey || '');
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
    const [roles, setRoles] = useState(user.roles || []);
    const [availableRoles, setAvailableRoles] = useState([]);

    useEffect(() => {
        if (mode === 'register') {
            setAvailableRoles([])
        } else {
            const fetchRoles = async () => {
                try {
                    const response = await api.get('/roles');
                    setAvailableRoles(response.data);
                } catch (error) {
                    showToast('Error fetching roles: ' + error.message, 'error');
                }
            };
            fetchRoles();
        }
    }, []);

    const handleSave = async () => {
        if (!username.trim()) {
            showToast('Username is required', 'error');
            return;
        }

        if (user.id === null && password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (mode === 'register') {
            const newUser = { ...user, username, password, prompt, openaiApiKey, roles };
            try {
                const response = await api.post('/register', newUser);
                onSave(response.data);
                showToast('User registered successfully', 'success');
                onClose();
            } catch (error) {
                showToast('Error registering user: ' + error.message, 'error');
            }
        } else {
            const updatedUser = { ...user, username, password: password || user.password, prompt, openaiApiKey, roles };
            try {
                if (user.id === null) {
                    const response = await api.post('/users', updatedUser);
                    onSave(response.data);
                    showToast('User created successfully', 'success');
                } else {
                    await api.put(`/users/${user.id}`, updatedUser);
                    onSave(updatedUser);
                    showToast('User updated successfully', 'success');
                }
                onClose();
            } catch (error) {
                showToast('Error saving user: ' + error.message, 'error');
            }
        }
    };

    const handleSelectRole = (role) => {
        if (!roles.includes(role)) {
            setRoles([...roles, role]);
        }
    };

    const handleRemoveRole = (role) => {
        setRoles(roles.filter(r => r !== role));
    };

    return (
        <>
            <Modal show onHide={onClose}>
                <ToastNotification />
                <Modal.Header closeButton>
                    <Modal.Title>{mode === 'register' ? 'Register User' : user.id === null ? 'Create User' : 'Edit User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        {user.id === null && (
                            <>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>
                            </>
                        )}
                        <Form.Group>
                            <Form.Label>Prompt</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>OpenAPI Key</Form.Label>
                            <Form.Control
                                type="text"
                                value={openaiApiKey}
                                onChange={(e) => setOpenaiApiKey(e.target.value)}
                            />
                        </Form.Group>
                        {mode !== 'register' && (
                            <Form.Group>
                                <Form.Label>Roles</Form.Label>
                                <div className="d-flex align-items-center">
                                    <div className="d-flex flex-wrap align-items-center overflow-auto" style={{ maxHeight: '200px', flex: 1 }}>
                                        {roles.map(role => (
                                            <Badge bg="light" key={role} className="mr-2 mb-2 d-flex align-items-center custom-badge" style={{ height: '2.5rem' }}>
                                                {role}
                                                <FaTimes className="ml-1 text-danger" style={{ cursor: 'pointer' }} onClick={() => handleRemoveRole(role)} />
                                            </Badge>
                                        ))}
                                    </div>
                                    <DropdownButton
                                        id="dropdown-basic-button"
                                        title={<span><FaPlus /> Role</span>}
                                        variant="primary"
                                        className="ml-2"
                                    >
                                        {availableRoles.map(role => (
                                            <Dropdown.Item key={role} onClick={() => handleSelectRole(role)}>
                                                {role}
                                            </Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </div>
                            </Form.Group>
                        )}
                    </Form>
                    {user.id !== null && (
                        <Button
                            variant="link"
                            onClick={() => setShowChangePasswordDialog(true)}
                        >
                            Change Password
                        </Button>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {mode === 'register' ? 'Register' : user.id === null ? 'Create' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {showChangePasswordDialog && (
                <ChangePasswordDialog
                    userId={user.id}
                    onClose={() => setShowChangePasswordDialog(false)}
                />
            )}
        </>
    );
}

UserEditor.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
};

export default UserEditor;
