import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Button, FormControl, InputGroup, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ text }) => {
    return (
        <ReactMarkdown
            children={text}
            components={{
                code: ({ node, inline, className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                        <code style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2', padding: '2px 4px', borderRadius: '4px', display: 'inline' }} {...props}>
                            {children}
                        </code>
                    ) : (
                        <SyntaxHighlighter
                            style={darcula}
                            language={className ? className.replace("language-", "") : ""}
                            PreTag="div"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
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
    const [assistants, setAssistants] = useState([]);
    const [selectedAssistants, setSelectedAssistants] = useState(chat.assistants || []);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchChatDetails = async () => {
            try {
                const chatResponse = await axios.get(`http://localhost:8092/chats/${chat.id}`);
                const chatData = chatResponse.data;
                setTitle(chatData.title);
                setSelectedAssistants(chatData.assistants || []);

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

    useEffect(() => {
        const fetchAssistants = async () => {
            try {
                const response = await axios.get('http://localhost:8092/assistants');
                setAssistants(response.data);
            } catch (error) {
                console.error('Error fetching assistants:', error);
            }
        };

        fetchAssistants();
    }, []);

    const handleSend = async () => {
        if (message.trim() === '') return;
        const newChatHistory = [...chatHistory, { sender: 'You', text: message, type: 'User', showSource: false }];
        setChatHistory([...newChatHistory, { sender: 'System', text: 'Typing...', type: 'System', showSource: false }]);
        setMessage('');

        try {
            const res = await axios.post(`http://localhost:8092/chats/${chat.id}/send`, { message });
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

    const handleTitleChange = async (e) => {
        setTitle(e.target.value);
        try {
            await axios.put(`http://localhost:8092/chats/${chat.id}`, { ...chat, title: e.target.value });
        } catch (error) {
            console.error('Error updating title:', error);
        }
    };

    const handleAddAssistant = async (assistant) => {
        if (!selectedAssistants.some(a => a.id === assistant.id)) {
            const updatedAssistants = [...selectedAssistants, assistant];
            setSelectedAssistants(updatedAssistants);
            try {
                await axios.put(`http://localhost:8092/chats/${chat.id}`, { ...chat, assistants: updatedAssistants });
            } catch (error) {
                console.error('Error adding assistant:', error);
            }
        }
    };

    const handleRemoveAssistant = async (assistantId) => {
        const updatedAssistants = selectedAssistants.filter(a => a.id !== assistantId);
        setSelectedAssistants(updatedAssistants);
        try {
            await axios.put(`http://localhost:8092/chats/${chat.id}`, { ...chat, assistants: updatedAssistants });
        } catch (error) {
            console.error('Error removing assistant:', error);
        }
    };

    const toggleShowSource = (index) => {
        const scrollPosition = window.scrollY;
        const updatedChatHistory = [...chatHistory];
        updatedChatHistory[index].showSource = !updatedChatHistory[index].showSource;
        setChatHistory(updatedChatHistory);
        window.scrollTo(0, scrollPosition);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row className="w-100">
                <Col>
                    <Button variant="secondary" onClick={onBack} className="mb-3">Back to Chat List</Button>
                    <FormControl
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        className="mb-3"
                    />
                    <h5>Assistants</h5>
                    <DropdownButton
                        id="dropdown-basic-button"
                        title="Add Assistant"
                        className="mb-3"
                    >
                        {assistants.map(assistant => (
                            <Dropdown.Item key={assistant.id} onClick={() => handleAddAssistant(assistant)}>
                                {assistant.name}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                    <div className="assistants-list mb-3">
                        {selectedAssistants.map(assistant => (
                            <div key={assistant.id} className="assistant-item">
                                {assistant.name}
                                <Button variant="link" size="sm" onClick={() => handleRemoveAssistant(assistant.id)} className="remove-assistant-button">
                                    <FaTimes />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div style={{ flex: '1', border: '1px solid #ccc', padding: '10px', overflowY: 'auto', marginBottom: '10px', maxHeight: '50vh' }}>
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
                                <Button variant="link" size="sm" onClick={() => toggleShowSource(index)} className="ml-2 toggle-source-btn">
                                    {msg.showSource ? 'Show Rendered' : 'Show Source'}
                                </Button>
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
        </Container>
    );
}

export default ChatThread;
