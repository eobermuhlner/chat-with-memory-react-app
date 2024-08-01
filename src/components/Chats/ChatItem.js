import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

function ChatItem({ chat, onSelect, onEdit, onDelete }) {
    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between align-items-center">
                <div onClick={onSelect} style={{ cursor: 'pointer' }}>
                    <strong>{chat.title}</strong>
                </div>
                <div>
                    <Button variant="secondary" onClick={onEdit} className="me-2">Edit</Button>
                    <Button variant="danger" onClick={onDelete}>Delete</Button>
                </div>
            </div>
        </ListGroup.Item>
    );
}

export default ChatItem;
