import React, { memo } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

const ChatInput = ({ message, setMessage, handleSend, handleKeyDown }) => {
    console.log('ChatInput render');  // For debugging render calls
    return (
        <InputGroup className="mb-3">
            <FormControl
                as="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                style={{ resize: 'none', height: '100px' }}
            />
            <Button onClick={handleSend} variant="primary">
                Send
            </Button>
        </InputGroup>
    );
};

export default memo(ChatInput, (prevProps, nextProps) => prevProps.message === nextProps.message);
