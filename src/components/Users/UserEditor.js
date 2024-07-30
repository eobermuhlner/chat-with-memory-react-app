import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import ToastNotification, { showToast } from '../ToastNotification';
import axios from 'axios';
import PropTypes from 'prop-types';
import ChangePasswordDialog from './ChangePasswordDialog'; // Import the ChangePasswordDialog component

const API_URL = 'http://localhost:8092';

function UserEditor({ user, onClose, onSave }) {
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

    const handleSave = async () => {
        if (!username.trim()) {
            showToast('Username is required', 'error');
            return;
        }

        if (user.id === null && (password !== confirmPassword)) {
            showToast('Passwords do not match', 'error');
            return;
        }

        const updatedUser = { ...user, username, password: password || user.password };
        try {
            if (user.id === null) {
                const response = await axios.post(`${API_URL}/users`, updatedUser);
                onSave(response.data);
                showToast('User created successfully', 'success');
            } else {
                await axios.put(`${API_URL}/users/${user.id}`, updatedUser);
                onSave(updatedUser);
                showToast('User updated successfully', 'success');
            }
            onClose();
        } catch (error) {
            showToast('Error saving user: ' + error.message, 'error');
        }
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
