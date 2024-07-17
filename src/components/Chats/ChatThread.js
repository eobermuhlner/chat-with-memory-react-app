import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, FormControl, InputGroup, Container, Row, Col } from 'react-bootstrap';

function ChatThread({ chat, onBack }) {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        // Fetch initial chat messages from the REST endpoint
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8092/chats/${chat.id}/messages`);
                const messages = response.data.map(msg => ({
                    sender: msg.sender || 'User',
                    text: msg.text,
                    timestamp: msg.timestamp,
                    type: msg.type || 'User' // Default to 'User' if type is not provided
                }));
                setChatHistory(messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [chat.id]);

    const handleSend = async () => {
        if (message.trim() === '') return;
        const newChatHistory = [...chatHistory, { sender: 'You', text: message, type: 'User' }];
        setChatHistory([...newChatHistory, { sender: 'System', text: 'Typing...', type: 'System' }]);
        setMessage('');

        try {
            const res = await axios.post('http://localhost:8092/chats/send', { message });
            const assistantMessages = res.data.messages.map(msg => ({
                sender: msg.sender,
                text: msg.text,
                timestamp: msg.timestamp,
                type: msg.type
            }));
            setChatHistory([...newChatHistory, ...assistantMessages]);
        } catch (error) {
            console.error('Error sending message:', error);
            setChatHistory([...newChatHistory, { sender: 'System', text: 'Error sending message', type: 'System' }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row className="w-100">
                <Col>
                    <Button variant="secondary" onClick={onBack} className="mb-3">Back to Chat List</Button>
                    <h2>{chat.title}</h2>
                    <div style={{ flex: '1', border: '1px solid #ccc', padding: '10px', overflowY: 'auto', marginBottom: '10px', maxHeight: '70vh' }}>
                        {chatHistory.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    margin: '10px 0',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    background: msg.type === 'User' ? '#edf6ff' :
                                        msg.type === 'Assistant' ? '#f6ffed' :
                                            msg.type === 'System' ? '#f0f0f0' : '#fff6ed'
                                }}
                            >
                                <strong>{msg.sender}:</strong>
                                <pre style={{ margin: '5px 0' }}>{msg.text}</pre>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
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
                </Col>
            </Row>
        </Container>
    );
}

export default ChatThread;
