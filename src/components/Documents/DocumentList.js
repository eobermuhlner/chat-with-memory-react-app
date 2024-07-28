import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Modal, Button, Form, Spinner } from 'react-bootstrap';
import DocumentItem from './DocumentItem';
import ToastNotification, { showToast } from '../ToastNotification';

function DocumentList() {
    const [documents, setDocuments] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [file, setFile] = useState(null);
    const [splitterStrategy, setSplitterStrategy] = useState('Paragraph');
    const [segments, setSegments] = useState([]);
    const [showSegmentsModal, setShowSegmentsModal] = useState(false);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // New loading state

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = () => {
        axios.get('http://localhost:8092/documents')
            .then(response => {
                setDocuments(response.data);
            })
            .catch(error => {
                showToast('Error fetching documents: ' + error.message, 'error');
            });
    };

    const fetchSegments = (documentId) => {
        axios.get(`http://localhost:8092/documents/${documentId}/segments`)
            .then(response => {
                setSegments(response.data);
                setCurrentSegmentIndex(0);
                setShowSegmentsModal(true);
            })
            .catch(error => {
                showToast('Error fetching segments: ' + error.message, 'error');
            });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSplitterChange = (e) => {
        setSplitterStrategy(e.target.value);
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('splitter', splitterStrategy);

        setIsLoading(true);

        try {
            await axios.post('http://localhost:8092/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchDocuments();
            setShowUploadModal(false);
            setFile(null);
            setSplitterStrategy('Paragraph');
            showToast('Document uploaded successfully', 'success');
        } catch (error) {
            showToast('Error uploading document: ' + error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteDocument = async (documentId) => {
        try {
            await axios.delete(`http://localhost:8092/documents/${documentId}`);
            setDocuments(documents.filter(document => document.id !== documentId));
            showToast('Document deleted successfully', 'success');
        } catch (error) {
            showToast('Error deleting document: ' + error.message, 'error');
        }
    };

    const handleNextSegment = () => {
        setCurrentSegmentIndex((prevIndex) => (prevIndex + 1) % segments.length);
    };

    const handlePreviousSegment = () => {
        setCurrentSegmentIndex((prevIndex) => (prevIndex - 1 + segments.length) % segments.length);
    };

    return (
        <div>
            <ToastNotification />
            <Button onClick={() => setShowUploadModal(true)} className="mb-3">Upload New Document</Button>
            <ListGroup>
                {documents.map(document => (
                    <DocumentItem
                        key={document.id}
                        document={document}
                        onDelete={() => handleDeleteDocument(document.id)}
                        onViewSegments={() => fetchSegments(document.id)}
                    />
                ))}
            </ListGroup>

            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>File</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Splitter Strategy</Form.Label>
                            <Form.Control as="select" value={splitterStrategy} onChange={handleSplitterChange}>
                                <option value="Paragraph">Paragraph</option>
                                <option value="AI">AI</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUploadModal(false)} disabled={isLoading}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpload} disabled={isLoading}>
                        {isLoading ? <Spinner animation="border" size="sm" /> : 'Upload'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSegmentsModal} onHide={() => setShowSegmentsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Document Segments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {segments.length > 0 ? (
                        <div className="segment-container">
                            <div className="d-flex justify-content-between mt-3">
                                <Button onClick={handlePreviousSegment}>{"<"}</Button>
                                <span>{currentSegmentIndex + 1} / {segments.length}</span>
                                <Button onClick={handleNextSegment}>{">"}</Button>
                            </div>
                            <pre className="segment-text">{segments[currentSegmentIndex].text}</pre>
                        </div>
                    ) : (
                        <div>No segments available</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSegmentsModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DocumentList;
