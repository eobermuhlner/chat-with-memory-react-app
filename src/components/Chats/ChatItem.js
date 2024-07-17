import React from 'react';
import { ListGroup, ButtonGroup } from 'react-bootstrap';

function ChatItem({ chat, onSelect, onEdit, onDelete }) {
    return (
        <ListGroup.Item action onClick={onSelect}>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <strong>{chat.title}</strong>
                </div>
                <ButtonGroup>
                    <div
                        className="btn btn-warning"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(chat);
                        }}
                    >
                        Edit
                    </div>
                    <div
                        className="btn btn-danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(chat.id);
                        }}
                    >
                        Delete
                    </div>
                </ButtonGroup>
            </div>
        </ListGroup.Item>
    );
}

export default ChatItem;
