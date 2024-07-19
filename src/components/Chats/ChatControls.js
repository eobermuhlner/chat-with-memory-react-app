import React from 'react';
import { Button } from 'react-bootstrap';

function ChatControls({ onCreateChat }) {
    return (
        <div className="mb-3">
            <Button onClick={onCreateChat}>Create New Chat</Button>
        </div>
    );
}

export default ChatControls;
