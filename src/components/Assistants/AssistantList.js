import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Button } from 'react-bootstrap';
import AssistantItem from './AssistantItem';
import AssistantEditor from './AssistantEditor';

function AssistantList() {
    const [assistants, setAssistants] = useState([]);
    const [editingAssistant, setEditingAssistant] = useState(null);

    useEffect(() => {
        // Fetch assistants from the REST endpoint
        axios.get('http://localhost:8092/assistants')
            .then(response => {
                setAssistants(response.data);
            })
            .catch(error => {
                console.error('Error fetching assistants:', error);
            });
    }, []);

    const handleCreateAssistant = () => {
        const newAssistant = { id: Date.now(), name: '', description: '', prompt: '', sortIndex: 0 };
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
            await axios.delete(`http://localhost:8092/assistants/${assistantId}`);
            setAssistants(assistants.filter(assistant => assistant.id !== assistantId));
        } catch (error) {
            console.error('Error deleting assistant:', error);
        }
    };

    const handleSaveEdit = (updatedAssistant) => {
        if (updatedAssistant.id === editingAssistant.id) {
            // If the assistant is newly created, add it to the list
            setAssistants([...assistants, updatedAssistant]);
        } else {
            // Otherwise, update the existing assistant in the list
            setAssistants(assistants.map(assistant => (assistant.id === updatedAssistant.id ? updatedAssistant : assistant)));
        }
        setEditingAssistant(null);
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
                        onDelete={() => handleDeleteAssistant(assistant.id)}
                    />
                ))}
            </ListGroup>
            {editingAssistant && <AssistantEditor assistant={editingAssistant} onClose={() => setEditingAssistant(null)} onSave={handleSaveEdit} />}
        </div>
    );
}

export default AssistantList;
