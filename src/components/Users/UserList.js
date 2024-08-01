import React, { useState, useEffect } from 'react';
import api from '../../api';
import { ListGroup, Modal, Button, Form } from 'react-bootstrap';
import UserItem from './UserItem';
import UserEditor from './UserEditor';
import ToastNotification, { showToast } from '../ToastNotification';

function UserList() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get(`/users`);
            setUsers(response.data);
        } catch (error) {
            showToast('Error fetching users: ' + error.message, 'error');
        }
    };

    const handleCreateUser = () => {
        const newUser = { id: null, username: '', password: '' };
        setEditingUser(newUser);
    };

    const handleEditUser = async (user) => {
        try {
            const response = await api.get(`/users/${user.id}`);
            setEditingUser(response.data);
        } catch (error) {
            showToast('Error fetching user: ' + error.message, 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            setUserToDelete(null);
            showToast('User deleted successfully', 'success');
        } catch (error) {
            showToast('Error deleting user: ' + error.message, 'error');
        }
    };

    const handleSaveEdit = async (updatedUser) => {
        if (editingUser.id == null) {
            setUsers(prevUsers => [...prevUsers, updatedUser]);
        } else {
            setUsers(prevUsers => prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
        }
        setEditingUser(null);
    };

    const confirmDeleteUser = (userId) => {
        setUserToDelete(userId);
    };

    const handleCancelDelete = () => {
        setUserToDelete(null);
    };

    return (
        <div>
            <ToastNotification />
            <Button onClick={handleCreateUser} className="mb-3">Create New User</Button>
            <ListGroup>
                {users.map(user => (
                    <UserItem
                        key={user.id}
                        user={user}
                        onEdit={() => handleEditUser(user)}
                        onDelete={() => confirmDeleteUser(user.id)}
                    />
                ))}
            </ListGroup>
            {editingUser && <UserEditor user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveEdit} />}

            <Modal show={!!userToDelete} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteUser(userToDelete)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserList;
