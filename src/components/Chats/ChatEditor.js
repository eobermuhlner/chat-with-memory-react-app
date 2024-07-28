import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Dropdown, DropdownButton, Badge } from 'react-bootstrap';
import { FaPlus, FaTimes } from 'react-icons/fa';
import ToastNotification, { showToast } from '../ToastNotification';

function ChatEditor({ chat, onClose, onSave }) {
    const [title, setTitle] = useState(chat.title);
    const [prompt, setPrompt] = useState(chat.prompt);
    const [assistants, setAssistants] = useState([]);
    const [selectedAssistants, setSelectedAssistants] = useState(chat.assistants || []);
    const [tools, setTools] = useState([]);
    const [selectedTools, setSelectedTools] = useState(chat.tools || []);
    const [documents, setDocuments] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState(chat.documents || []);

    useEffect(() => {
        axios.get('http://localhost:8092/assistants')
            .then(response => {
                setAssistants(response.data);
            })
            .catch(error => {
                showToast('Error fetching assistants: ' + error.message, 'error');
            });

        axios.get('http://localhost:8092/tools')
            .then(response => {
                setTools(response.data);
            })
            .catch(error => {
                showToast('Error fetching tools: ' + error.message, 'error');
            });

        axios.get('http://localhost:8092/documents')
            .then(response => {
                setDocuments(response.data);
            })
            .catch(error => {
                showToast('Error fetching documents: ' + error.message, 'error');
            });
    }, []);

    const handleSave = async () => {
        if (!title.trim()) {
            showToast('Chat must have a name', 'error');
            return;
        }
        if (selectedAssistants.length === 0) {
            showToast('Chat must have at least one assistant', 'error');
            return;
        }

        const updatedChat = { ...chat, title, prompt, assistants: selectedAssistants, tools: selectedTools, documents: selectedDocuments };
        try {
            if (chat.id == null) {
                const response = await axios.post('http://localhost:8092/chats', updatedChat);
                onSave(response.data);
                showToast('Chat created successfully', 'success');
            } else {
                await axios.put(`http://localhost:8092/chats/${chat.id}`, updatedChat);
                onSave(updatedChat);
                showToast('Chat updated successfully', 'success');
            }
            onClose();
        } catch (error) {
            showToast('Error saving chat: ' + error.message, 'error');
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

    const handleSelectDocument = (document) => {
        if (!selectedDocuments.some(d => d.id === document.id)) {
            setSelectedDocuments([...selectedDocuments, document]);
        }
    };

    const handleRemoveDocument = (documentId) => {
        setSelectedDocuments(selectedDocuments.filter(d => d.id !== documentId));
    };

    return (
        <Modal show onHide={onClose} size="lg">
            <ToastNotification />
            <Modal.Header closeButton>
                <Modal.Title>{chat.id == null ? 'Create Chat' : 'Edit Chat'}</Modal.Title>
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
                                    <Badge bg="light" key={assistant.id} className="mr-2 mb-2 d-flex align-items-center custom-badge" style={{ height: '2.5rem' }}>
                                        <div className="d-flex flex-column align-items-start">
                                            <span>{assistant.name}</span>
                                            <small className="text-muted">{assistant.description}</small>
                                        </div>
                                        <FaTimes className="ml-1 text-danger" style={{ cursor: 'pointer' }} onClick={() => handleRemoveAssistant(assistant.id)} />
                                    </Badge>
                                ))}
                            </div>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={<span><FaPlus /> Assistant</span>}
                                variant="primary"
                                className="ml-2"
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
                                    <Badge bg="light" key={tool} className="mr-2 mb-2 d-flex align-items-center custom-badge" style={{ height: '2.5rem' }}>
                                        {tool}
                                        <FaTimes className="ml-1 text-danger" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTool(tool)} />
                                    </Badge>
                                ))}
                            </div>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={<span><FaPlus /> Tool</span>}
                                variant="primary"
                                className="ml-2"
                            >
                                {tools.map(tool => (
                                    <Dropdown.Item key={tool} onClick={() => handleSelectTool(tool)}>
                                        {tool}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Documents</Form.Label>
                        <div className="d-flex align-items-center">
                            <div className="d-flex flex-wrap align-items-center overflow-auto" style={{ maxHeight: '200px', flex: 1 }}>
                                {selectedDocuments.map(document => (
                                    <Badge bg="light" key={document.id} className="mr-2 mb-2 d-flex align-items-center custom-badge" style={{ height: '2.5rem' }}>
                                        {document.name}
                                        <FaTimes className="ml-1 text-danger" style={{ cursor: 'pointer' }} onClick={() => handleRemoveDocument(document.id)} />
                                    </Badge>
                                ))}
                            </div>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={<span><FaPlus /> Document</span>}
                                variant="primary"
                                className="ml-2"
                            >
                                {documents.map(document => (
                                    <Dropdown.Item key={document.id} onClick={() => handleSelectDocument(document)}>
                                        {document.name}
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
