import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Dropdown, DropdownButton, Card } from 'react-bootstrap';
import { FaPlus, FaTimes } from 'react-icons/fa';

function ChatEditor({ chat, onClose, onSave }) {
    const [title, setTitle] = useState(chat.title);
    const [prompt, setPrompt] = useState(chat.prompt);
    const [assistants, setAssistants] = useState([]);
    const [selectedAssistants, setSelectedAssistants] = useState(chat.assistants);
    const [tools, setTools] = useState([]);
    const [selectedTools, setSelectedTools] = useState(chat.tools || []);

    useEffect(() => {
        axios.get('http://localhost:8092/assistants')
            .then(response => {
                setAssistants(response.data);
            })
            .catch(error => {
                console.error('Error fetching assistants:', error);
            });

        axios.get('http://localhost:8092/tools')
            .then(response => {
                setTools(response.data);
            })
            .catch(error => {
                console.error('Error fetching tools:', error);
            });
    }, []);

    const handleSave = async () => {
        const updatedChat = { ...chat, title, prompt, assistants: selectedAssistants, tools: selectedTools };
        try {
            if (chat.id === undefined) {
                const response = await axios.post('http://localhost:8092/chats', updatedChat);
                onSave(response.data);
            } else {
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

    const handleSelectTool = (tool) => {
        if (!selectedTools.includes(tool)) {
            setSelectedTools([...selectedTools, tool]);
        }
    };

    const handleRemoveTool = (tool) => {
        setSelectedTools(selectedTools.filter(t => t !== tool));
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{chat.id === undefined ? 'Create Chat' : 'Edit Chat'}</Modal.Title>
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
                            as="textarea"
                            rows={6}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Assistants</Form.Label>
                        <div className="d-flex align-items-center">
                            <div className="d-flex flex-wrap align-items-center overflow-auto" style={{ maxHeight: '200px', flex: 1 }}>
                                {selectedAssistants.map(assistant => (
                                    <Card key={assistant.id} className="mr-2 mb-2" style={{ width: 'auto' }}>
                                        <Card.Body className="d-flex justify-content-between align-items-center p-2">
                                            <div>
                                                <div>{assistant.name}</div>
                                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                    {assistant.description}
                                                </div>
                                            </div>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveAssistant(assistant.id)}>
                                                <FaTimes />
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={<FaPlus />}
                                variant="primary"
                                className="mr-2"
                            >
                                {assistants.map(assistant => (
                                    <Dropdown.Item key={assistant.id} onClick={() => handleSelectAssistant(assistant)}>
                                        {assistant.name}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Tools</Form.Label>
                        <div className="d-flex align-items-center">
                            <div className="d-flex flex-wrap align-items-center overflow-auto" style={{ maxHeight: '200px', flex: 1 }}>
                                {selectedTools.map(tool => (
                                    <Card key={tool} className="mr-2 mb-2" style={{ width: 'auto' }}>
                                        <Card.Body className="d-flex justify-content-between align-items-center p-2">
                                            <div>{tool}</div>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveTool(tool)}>
                                                <FaTimes />
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={<FaPlus />}
                                variant="primary"
                                className="mr-2"
                            >
                                {tools.map(tool => (
                                    <Dropdown.Item key={tool} onClick={() => handleSelectTool(tool)}>
                                        {tool}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
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
