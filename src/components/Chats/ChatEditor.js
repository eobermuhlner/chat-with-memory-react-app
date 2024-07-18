import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

function ChatEditor({ chat, onClose, onSave }) {
    const [title, setTitle] = useState(chat.title);
    const [prompt, setPrompt] = useState(chat.prompt);
    const [assistants, setAssistants] = useState([]);
    const [selectedAssistants, setSelectedAssistants] = useState(chat.assistants);

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

    const handleSave = async () => {
        const updatedChat = { ...chat, title, prompt, assistants: selectedAssistants };
        try {
            if (chat.id === undefined) {
                // Create a new chat
                const response = await axios.post('http://localhost:8092/chats', updatedChat);
                onSave(response.data);
            } else {
                // Update an existing chat
                await axios.put(`http://localhost:8092/chats/${chat.id}`, updatedChat);
                onSave(updatedChat);
            }
            onClose();
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    };

    const handleSelectAssistant = (assistant) => {
        if (!selectedAssistants.some(a => a.id === assistant.id)) {
            setSelectedAssistants([...selectedAssistants, assistant]);
        }
    };

    const handleRemoveAssistant = (assistantId) => {
        setSelectedAssistants(selectedAssistants.filter(a => a.id !== assistantId));
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Chat Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Prompt</Form.Label>
                        <Form.Control
                            type="text"
                            as="textarea"
                            rows={6}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Assistants</Form.Label>
                        <DropdownButton
                            id="dropdown-basic-button"
                            title="Add Assistant"
                        >
                            {assistants.map(assistant => (
                                <Dropdown.Item key={assistant.id} onClick={() => handleSelectAssistant(assistant)}>
                                    {assistant.name}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                        <div className="assistants-list mt-2">
                            {selectedAssistants.map(assistant => (
                                <div key={assistant.id} className="assistant-item d-flex justify-content-between align-items-center">
                                    {assistant.name}
                                    <Button variant="link" size="sm" onClick={() => handleRemoveAssistant(assistant.id)} className="remove-assistant-button">
                                        <FaTimes />
                                    </Button>
                                </div>
                            ))}
                        </div>
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

export default ChatEditor;
