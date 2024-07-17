import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Dropdown, DropdownButton } from 'react-bootstrap';

function ChatEditor({ chat, onClose, onSave }) {
    const [title, setTitle] = useState(chat.title);
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

    const handleSave = () => {
        const updatedChat = { ...chat, title, assistants: selectedAssistants };
        onSave(updatedChat);
        onClose();
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
                        <ul className="list-group mt-2">
                            {selectedAssistants.map(assistant => (
                                <li key={assistant.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {assistant.name}
                                    <Button variant="danger" size="sm" onClick={() => handleRemoveAssistant(assistant.id)}>Remove</Button>
                                </li>
                            ))}
                        </ul>
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
