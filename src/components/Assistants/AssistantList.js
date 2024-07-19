import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Modal, Button, Form } from 'react-bootstrap';
import AssistantItem from './AssistantItem';
import AssistantEditor from './AssistantEditor';

function AssistantList() {
    const [assistants, setAssistants] = useState([]);
    const [editingAssistant, setEditingAssistant] = useState(null);
    const [assistantToDelete, setAssistantToDelete] = useState(null);
    const [deleteMessages, setDeleteMessages] = useState(false); // State for checkbox

    useEffect(() => {
        // Fetch assistants from the REST endpoint
        fetchAssistants();
    }, []);

    const fetchAssistants = () => {
        axios.get('http://localhost:8092/assistants')
            .then(response => {
                setAssistants(response.data);
            })
            .catch(error => {
                console.error('Error fetching assistants:', error);
            });
    };

    const handleCreateAssistant = () => {
        const newAssistant = { name: '', description: '', prompt: '', sortIndex: 0 };
        setEditingAssistant(newAssistant);
    };

    const handleEditAssistant = async (assistant) => {
        try {
            const response = await axios.get(`http://localhost:8092/assistants/${assistant.id}`);
            setEditingAssistant(response.data);
        } catch (error) {
            console.error('Error fetching assistant:', error);
        }
    };

    const handleDeleteAssistant = async (assistantId) => {
        try {
            await axios.delete(`http://localhost:8092/assistants/${assistantId}`, { params: { deleteMessages } });
            setAssistants(assistants.filter(assistant => assistant.id !== assistantId));
            setAssistantToDelete(null);
            setDeleteMessages(false); // Reset the checkbox state
        } catch (error) {
            console.error('Error deleting assistant:', error);
        }
    };

    const handleSaveEdit = async (updatedAssistant) => {
        try {
            let response;
            if (updatedAssistant.id === undefined) {
                // If the assistant is newly created, post it to the server
                response = await axios.post('http://localhost:8092/assistants', updatedAssistant);
            } else {
                // Otherwise, update the existing assistant on the server
                response = await axios.put(`http://localhost:8092/assistants/${updatedAssistant.id}`, updatedAssistant);
            }
            setEditingAssistant(null);
            fetchAssistants();
        } catch (error) {
            console.error('Error saving assistant:', error);
        }
    };

    const confirmDeleteAssistant = (assistantId) => {
        setAssistantToDelete(assistantId);
    };

    const handleCancelDelete = () => {
        setAssistantToDelete(null);
        setDeleteMessages(false); // Reset the checkbox state
    };

    return (
        <div>
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

export default AssistantList;
