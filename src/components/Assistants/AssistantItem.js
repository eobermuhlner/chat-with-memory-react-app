import React from 'react';
import {Button, ListGroup} from 'react-bootstrap';

function AssistantItem({ assistant, onEdit, onDelete }) {
    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <strong>{assistant.name}</strong>
                    <p>{assistant.description}</p>
                </div>
                <div>
                    <Button variant="secondary" className="me-2" onClick={() => onEdit(assistant)}>Edit</Button>
                    <Button variant="danger" onClick={() => onDelete(assistant.id)}>Delete</Button>
                </div>
            </div>
        </ListGroup.Item>
    );
}

export default AssistantItem;
