import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Button, FormControl, InputGroup, Container, Row, Col, OverlayTrigger, Tooltip, Modal, Form } from 'react-bootstrap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaEye, FaEyeSlash, FaCopy } from 'react-icons/fa';

const MarkdownRenderer = ({ text }) => {
    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
    };

    return (
        <ReactMarkdown
            children={text}
            components={{
                code: ({ node, inline, className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                        <code style={{
                            backgroundColor: '#2d2d2d',
                            color: '#f8f8f2',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            display: 'inline'
                        }} {...props}>
                            {children}
                        </code>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <SyntaxHighlighter
                                style={darcula}
                                language={className ? className.replace("language-", "") : ""}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Copy code</Tooltip>}
                            >
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                    }}
                                >
                                    <FaCopy />
                                </Button>
                            </OverlayTrigger>
                        </div>
                    );
                },
                pre: ({ node, children, ...props }) => {
                    return (
                        <div style={{ position: 'relative' }}>
                            <pre {...props} style={{ position: 'relative', padding: '10px', backgroundColor: '#2d2d2d', color: '#f8f8f2', borderRadius: '4px' }}>
                                {children}
                            </pre>
                        </div>
                    );
                },
            }}
        />
    );
};

function ChatThread({ chat, onBack }) {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [title, setTitle] = useState(chat.title);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [transferToLongTerm, setTransferToLongTerm] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchChatDetails = async () => {
            try {
                const chatResponse = await axios.get(`http://localhost:8092/chats/${chat.id}`);
                const chatData = chatResponse.data;
                setTitle(chatData.title);

                const messagesResponse = await axios.get(`http://localhost:8092/chats/${chat.id}/messages`);
                const messages = messagesResponse.data.map(msg => ({
                    sender: msg.sender || 'User',
                    text: msg.text,
                    timestamp: msg.timestamp,
                    type: msg.type || 'User',
                    showSource: false,
                }));
                setChatHistory(messages);
            } catch (error) {
                console.error('Error fetching chat details or messages:', error);
            }
        };

        fetchChatDetails();
    }, [chat.id]);

    const handleSend = async () => {
        if (message.trim() === '') return;
        const newChatHistory = [...chatHistory, { sender: 'You', text: message, type: 'User', showSource: false }];
        setChatHistory([...newChatHistory, { sender: 'System', text: 'Typing...', type: 'System', showSource: false }]);
        setMessage('');

        try {
            const res = await axios.post(`http://localhost:8092/chats/${chat.id}/messages`, { message });
            const assistantMessages = res.data.messages.map(msg => ({
                sender: msg.sender,
                text: msg.text,
                timestamp: msg.timestamp,
                type: msg.type,
                showSource: false,
            }));
            setChatHistory([...newChatHistory, ...assistantMessages]);
        } catch (error) {
            console.error('Error sending message:', error);
            setChatHistory([...newChatHistory, { sender: 'System', text: 'Error sending message', type: 'System', showSource: false }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleShowSource = (index) => {
        const scrollPosition = window.scrollY;
        const updatedChatHistory = [...chatHistory];
        updatedChatHistory[index].showSource = !updatedChatHistory[index].showSource;
        setChatHistory(updatedChatHistory);
        window.scrollTo(0, scrollPosition);
    };

    const handleDeleteMessages = async () => {
        try {
            await axios.delete(`http://localhost:8092/chats/${chat.id}/messages`, {
                params: {
                    transferToLongTermMemory: transferToLongTerm
                }
            });
            setChatHistory([]); // Clear the chat history in UI
        } catch (error) {
            console.error('Error deleting messages:', error);
        } finally {
            setShowDeleteModal(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row className="w-100">
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Button variant="secondary" onClick={onBack} className="mb-3">Back to Chat List</Button>
                        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete All Messages</Button>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                        <h1 className="mb-0">{title}</h1>
                    </div>
                    <div style={{ flex: '1', border: '1px solid #ccc', padding: '10px', overflowY: 'auto', marginBottom: '10px', maxHeight: '50vh' }}>
                        {chatHistory && chatHistory.length > 0 && chatHistory.map((msg, index) => (
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
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>{msg.showSource ? 'Show Rendered' : 'Show Source'}</Tooltip>}
                                >
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => toggleShowSource(index)}
                                        className="ml-2 toggle-source-btn"
                                    >
                                        {msg.showSource ? <FaEyeSlash /> : <FaEye />}
                                    </Button>
                                </OverlayTrigger>
                                {msg.showSource ? (
                                    <pre>{msg.text}</pre>
                                ) : (
                                    <MarkdownRenderer text={msg.text} />
                                )}
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
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
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
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteMessages}>
                        Delete All
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ChatThread;
