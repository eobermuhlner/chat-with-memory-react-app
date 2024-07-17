import React from 'react';
import { ListGroup, ButtonGroup, Button } from 'react-bootstrap';

function AssistantItem({ assistant, onEdit, onDelete }) {
    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <strong>{assistant.name}</strong>
                    <p>{assistant.description}</p>
                </div>
                <ButtonGroup>
                    <Button variant="warning" onClick={() => onEdit(assistant)}>Edit</Button>
                    <Button variant="danger" onClick={() => onDelete(assistant.id)}>Delete</Button>
                </ButtonGroup>
            </div>
        </ListGroup.Item>
    );
}

export default AssistantItem;
