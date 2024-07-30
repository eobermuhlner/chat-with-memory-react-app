import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';

function UserItem({ user, onEdit, onDelete }) {
    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <strong>{user.username}</strong>
                </div>
                <div>
                    <Button variant="secondary" className="me-2" onClick={() => onEdit(user)}>Edit</Button>
                    <Button variant="danger" onClick={() => onDelete(user.id)}>Delete</Button>
                </div>
            </div>
        </ListGroup.Item>
    );
}

export default UserItem;
