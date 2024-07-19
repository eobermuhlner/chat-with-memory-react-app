import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col } from 'react-bootstrap';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import DeleteMessagesModal from './DeleteMessagesModal';

const ChatThread = ({ chat, onBack }) => {
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
                            <ChatMessage
                                key={index}
                                msg={msg}
                                index={index}
                                toggleShowSource={toggleShowSource}
                            />
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <ChatInput
                        message={message}
                        setMessage={setMessage}
                        handleSend={handleSend}
                        handleKeyDown={handleKeyDown}
                    />
                </Col>
            </Row>
            <DeleteMessagesModal
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                handleDelete={handleDeleteMessages}
                transferToLongTerm={transferToLongTerm}
                setTransferToLongTerm={setTransferToLongTerm}
            />
        </Container>
    );
};

export default ChatThread;
