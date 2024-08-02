import React, { useEffect, useState } from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import AssistantItem from './AssistantItem';
import AssistantEditor from './AssistantEditor';
import PropTypes from 'prop-types';
import api from '../../api';
import ToastNotification, { showToast } from '../ToastNotification';
import './AssistantList.css';

function AssistantList() {
    const [assistants, setAssistants] = useState([]);
    const [editingAssistant, setEditingAssistant] = useState(null);
    const [assistantToDelete, setAssistantToDelete] = useState(null);
    const [deleteMessages, setDeleteMessages] = useState(false);

    useEffect(() => {
        fetchAssistants();
    }, []);

    const fetchAssistants = async () => {
        try {
            const response = await api.get('/assistants');
            setAssistants(response.data);
        } catch (error) {
            showToast('Error fetching assistants: ' + error.message, 'error');
        }
    };

    const handleCreateAssistant = () => {
        const newAssistant = { id: null, name: '', description: '', prompt: '', sortIndex: 0, tools: [], documents: [] };
        setEditingAssistant(newAssistant);
    };

    const handleEditAssistant = async (assistant) => {
        try {
            const response = await api.get(`/assistants/${assistant.id}`);
            setEditingAssistant(response.data);
        } catch (error) {
            showToast('Error fetching assistant: ' + error.message, 'error');
        }
    };

    const handleDeleteAssistant = async (assistantId) => {
        try {
            await api.delete(`/assistants/${assistantId}`, { params: { deleteMessages } });
            setAssistants(prevAssistants => prevAssistants.filter(assistant => assistant.id !== assistantId));
            setAssistantToDelete(null);
            setDeleteMessages(false);
            showToast('Assistant deleted successfully', 'success');
        } catch (error) {
            showToast('Error deleting assistant: ' + error.message, 'error');
        }
    };

    const handleSaveEdit = async (updatedAssistant) => {
        if (editingAssistant.id == null) {
            setAssistants(prevAssistants => [...prevAssistants, updatedAssistant]);
        } else {
            setAssistants(prevAssistants => prevAssistants.map(assistant => assistant.id === updatedAssistant.id ? updatedAssistant : assistant));
        }
        setEditingAssistant(null);
    };

    const confirmDeleteAssistant = (assistantId) => {
        setAssistantToDelete(assistantId);
    };

    const handleCancelDelete = () => {
        setAssistantToDelete(null);
        setDeleteMessages(false);
    };

    return (
        <div>
            <ToastNotification />
            <Button onClick={handleCreateAssistant} className="mb-3">Create New Assistant</Button>
            <ListGroup>
                {assistants.map(assistant => (
                    <AssistantItem
                        key={assistant.id}
                        assistant={assistant}
                        onEdit={() => handleEditAssistant(assistant)}
                        onDelete={() => confirmDeleteAssistant(assistant.id)}
                    />
                ))}
            </ListGroup>
            {editingAssistant && <AssistantEditor assistant={editingAssistant} onClose={() => setEditingAssistant(null)} onSave={handleSaveEdit} />}

            <Modal show={!!assistantToDelete} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this assistant?
                    <Form.Check
                        type="checkbox"
                        label="Also delete all messages"
                        checked={deleteMessages}
                        onChange={(e) => setDeleteMessages(e.target.checked)}
                        className="mt-3"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteAssistant(assistantToDelete)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

AssistantList.propTypes = {
    onSelectAssistant: PropTypes.func.isRequired,
};

export default AssistantList;
