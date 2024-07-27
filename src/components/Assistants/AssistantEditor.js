import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Dropdown, DropdownButton, Card } from 'react-bootstrap';
import { FaPlus, FaTimes } from 'react-icons/fa';

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
        axios.get('http://localhost:8092/tools')
            .then(response => {
                setTools(response.data);
            })
            .catch(error => {
                console.error('Error fetching tools:', error);
            });

        axios.get('http://localhost:8092/documents')
            .then(response => {
                setDocuments(response.data);
            })
            .catch(error => {
                console.error('Error fetching documents:', error);
            });
    }, []);

    const handleSave = async () => {
        const updatedAssistant = { ...assistant, name, description, prompt, sortIndex, tools: selectedTools, documents: selectedDocuments };
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

export default AssistantEditor;
