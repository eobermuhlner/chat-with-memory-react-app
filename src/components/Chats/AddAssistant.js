import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

function AddAssistant({ show, handleClose }) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Assistant</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Assistant Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter assistant name" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Add Assistant
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddAssistant;
