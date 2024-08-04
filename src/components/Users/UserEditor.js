import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Dropdown, DropdownButton, Badge } from 'react-bootstrap';
import ToastNotification, { showToast } from '../ToastNotification';
import api from '../../api';
import PropTypes from 'prop-types';
import ChangePasswordDialog from './ChangePasswordDialog'; // Import the ChangePasswordDialog component
import { FaPlus, FaTimes } from 'react-icons/fa';

function UserEditor({ user, onClose, onSave }) {
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [prompt, setPrompt] = useState(user.prompt || '');
    const [openApiKey, setOpenApiKey] = useState(user.openApiKey || '');
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
    const [roles, setRoles] = useState(user.roles || []);
    const [availableRoles, setAvailableRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get('/roles'); // Adjust the endpoint as necessary
                setAvailableRoles(response.data);
            } catch (error) {
                showToast('Error fetching roles: ' + error.message, 'error');
            }
        };
        fetchRoles();
    }, []);

    const handleSave = async () => {
        if (!username.trim()) {
            showToast('Username is required', 'error');
            return;
        }

        if (user.id === null && (password !== confirmPassword)) {
            showToast('Passwords do not match', 'error');
            return;
        }

        const updatedUser = { ...user, username, password: password || user.password, prompt, openApiKey, roles };
        try {
            if (user.id === null) {
                const response = await api.post(`/users`, updatedUser);
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
                    <Modal.Title>{user.id === null ? 'Create User' : 'Edit User'}</Modal.Title>
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
                                value={openApiKey}
                                onChange={(e) => setOpenApiKey(e.target.value)}
                            />
                        </Form.Group>
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
                        Save Changes
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
};

export default UserEditor;
