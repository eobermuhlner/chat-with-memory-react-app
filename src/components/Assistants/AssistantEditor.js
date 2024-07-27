import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Dropdown, DropdownButton, Card } from 'react-bootstrap';
import { FaPlus, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import ToastNotification, { showToast } from '../ToastNotification';

const API_URL = 'http://localhost:8092';

function AssistantEditor({ assistant, onClose, onSave }) {
    const [name, setName] = useState(assistant.name);
    const [description, setDescription] = useState(assistant.description);
    const [prompt, setPrompt] = useState(assistant.prompt);
    const [sortIndex, setSortIndex] = useState(assistant.sortIndex);
    const [tools, setTools] = useState([]);
    const [selectedTools, setSelectedTools] = useState(assistant.tools || []);
    const [documents, setDocuments] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState(assistant.documents || []);

    useEffect(() => {
        const fetchToolsAndDocuments = async () => {
            try {
                const [toolsResponse, documentsResponse] = await Promise.all([
                    axios.get(`${API_URL}/tools`),
                    axios.get(`${API_URL}/documents`)
                ]);
                setTools(toolsResponse.data);
                setDocuments(documentsResponse.data);
            } catch (error) {
                showToast('Error fetching tools or documents: ' + error.message, 'error');
            }
        };
        fetchToolsAndDocuments();
    }, []);

    const handleSave = async () => {
        const updatedAssistant = { ...assistant, name, description, prompt, sortIndex, tools: selectedTools, documents: selectedDocuments };
        try {
            if (assistant.id === null) {
                const response = await axios.post(`${API_URL}/assistants`, updatedAssistant);
                onSave(response.data);
                showToast('Assistant created successfully', 'success');
            } else {
                await axios.put(`${API_URL}/assistants/${assistant.id}`, updatedAssistant);
                onSave(updatedAssistant);
                showToast('Assistant updated successfully', 'success');
            }
            onClose();
        } catch (error) {
            showToast('Error saving assistant: ' + error.message, 'error');
        }
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

    const handleRemoveDocument = (document) => {
        setSelectedDocuments(selectedDocuments.filter(d => d.id !== document.id));
    };

    return (
        <Modal show onHide={onClose} size="lg">
            <ToastNotification />
            <Modal.Header closeButton>
                <Modal.Title>{assistant.id === null ? 'Create Assistant' : 'Edit Assistant'}</Modal.Title>
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
                                title={<span><FaPlus /> Tool</span>}
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
                    <Form.Group>
                        <Form.Label>Documents</Form.Label>
                        <div className="d-flex align-items-center">
                            <div className="d-flex flex-wrap align-items-center overflow-auto" style={{ maxHeight: '200px', flex: 1 }}>
                                {selectedDocuments.map(document => (
                                    <Card key={document.id} className="mr-2 mb-2" style={{ width: 'auto' }}>
                                        <Card.Body className="d-flex justify-content-between align-items-center p-2">
                                            <div>{document.name}</div>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveDocument(document)}>
                                                <FaTimes />
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={<span><FaPlus /> Document</span>}
                                variant="primary"
                                className="mr-2"
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

AssistantEditor.propTypes = {
    assistant: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default AssistantEditor;
