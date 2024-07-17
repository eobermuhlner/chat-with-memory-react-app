import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ChatEditor({ chat, onClose }) {
    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Chat Name</Form.Label>
                        <Form.Control type="text" defaultValue={chat.name} />
                    </Form.Group>
                    {/* Add other chat properties and controls here */}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={onClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ChatEditor;
