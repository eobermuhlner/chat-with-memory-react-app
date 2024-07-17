import React from 'react';
import { ListGroup } from 'react-bootstrap';

function ChatItem({ chat, onSelect }) {
    return (
        <ListGroup.Item action onClick={onSelect}>
            {chat.name}
        </ListGroup.Item>
    );
}

export default ChatItem;
