import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

function AssistantEditor({ assistant, onClose, onSave }) {
    const [name, setName] = useState(assistant.name);
    const [description, setDescription] = useState(assistant.description);
    const [prompt, setPrompt] = useState(assistant.prompt);
    const [sortIndex, setSortIndex] = useState(assistant.sortIndex);

    const handleSave = async () => {
        const updatedAssistant = { ...assistant, name, description, prompt, sortIndex };
        try {
            if (assistant.id === undefined) {
                // Create a new assistant
                const response = await axios.post('http://localhost:8092/assistants', updatedAssistant);
                onSave(response.data);
            } else {
                // Update an existing assistant
                await axios.put(`http://localhost:8092/assistants/${assistant.id}`, updatedAssistant);
                onSave(updatedAssistant);
            }
            onClose();
        } catch (error) {
            console.error('Error saving assistant:', error);
        }
    };

    return (
        <Modal show onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{assistant.id === undefined ? 'Create Assistant' : 'Edit Assistant'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
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
                        <Form.Label>Sort Index</Form.Label>
                        <Form.Control
                            type="number"
                            value={sortIndex}
                            onChange={(e) => setSortIndex(parseInt(e.target.value))}
                        />
                    </Form.Group>
                </Form>
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
    );
}

export default AssistantEditor;
