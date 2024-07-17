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
                        <Form.Label>Chat Title</Form.Label>
                        <Form.Control type="text" defaultValue={chat.title} />
                    </Form.Group>
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
