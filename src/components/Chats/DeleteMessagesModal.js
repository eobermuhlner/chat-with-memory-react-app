import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const DeleteMessagesModal = ({ show, handleClose, handleDelete, transferToLongTerm, setTransferToLongTerm }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete All Messages</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete all messages?</p>
                <Form.Check
                    type="checkbox"
                    label="Transfer to long-term memory"
                    checked={transferToLongTerm}
                    onChange={(e) => setTransferToLongTerm(e.target.checked)}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete All
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteMessagesModal;
