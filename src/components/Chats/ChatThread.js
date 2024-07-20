import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col, Modal } from 'react-bootstrap';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import DeleteMessagesModal from './DeleteMessagesModal';

const ChatThread = ({ chat, onBack }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [title, setTitle] = useState(chat.title);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteLongTermModal, setShowDeleteLongTermModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false); // New state for transfer modal
    const [transferToLongTerm, setTransferToLongTerm] = useState(true);
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
        const updatedChatHistory = [...chatHistory];
        updatedChatHistory[index].showSource = !updatedChatHistory[index].showSource;
        setChatHistory(updatedChatHistory);
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

    const handleDeleteLongTermMemory = async () => {
        try {
            await axios.delete(`http://localhost:8092/chats/${chat.id}/messages/long-term`);
        } catch (error) {
            console.error('Error deleting long term memory:', error);
        } finally {
            setShowDeleteLongTermModal(false);
        }
    };

    const handleTransferToLongTerm = async () => {
        try {
            await axios.post(`http://localhost:8092/chats/${chat.id}/messages/transfer-to-long-term`);
        } catch (error) {
            console.error('Error transferring messages to long term memory:', error);
        } finally {
            setShowTransferModal(false);
        }
    };

    useEffect(() => {
        const lastMessage = chatHistory[chatHistory.length - 1];
        if (lastMessage && lastMessage.sender === 'System') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row className="w-100">
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Button variant="secondary" onClick={onBack} className="mb-3">Back to Chat List</Button>
                        <div>
                            <Button variant="warning" onClick={() => setShowTransferModal(true)}>Transfer to Long Term Memory</Button>
                            <Button variant="danger" onClick={() => setShowDeleteModal(true)} className="mr-2">Delete All Messages</Button>
                            <Button variant="danger" onClick={() => setShowDeleteLongTermModal(true)}>Delete Long Term Memory</Button>
                        </div>
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
            <Modal show={showDeleteLongTermModal} onHide={() => setShowDeleteLongTermModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the long-term memory?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteLongTermModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteLongTermMemory}>
                        Delete Long Term Memory
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Transfer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to transfer all short-term messages to long-term memory?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTransferModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleTransferToLongTerm}>
                        Transfer to Long Term Memory
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ChatThread;
