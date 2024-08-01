import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import ToastNotification, { showToast } from '../ToastNotification';
import api from '../../api';
import PropTypes from 'prop-types';

function ChangePasswordDialog({ userId, onClose }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        try {
            const response = await api.put(`/users/${userId}/password`, { oldPassword, newPassword });
            if (response.status === 200) {
                showToast('Password updated successfully', 'success');
                onClose();
            } else {
                showToast(response.data, 'error');
            }
        } catch (error) {
            showToast('Error changing password: ' + error.message, 'error');
        }
    };

    return (
        <Modal show onHide={onClose}>
            <ToastNotification />
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleChangePassword}>
                    Change Password
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

ChangePasswordDialog.propTypes = {
    userId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ChangePasswordDialog;
