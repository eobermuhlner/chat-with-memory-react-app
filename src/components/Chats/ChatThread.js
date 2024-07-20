import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Button, Container, Row, Col, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import DeleteMessagesModal from './DeleteMessagesModal';
import { BsArrowLeft, BsTrash, BsEraser, BsBoxArrowInRight } from 'react-icons/bs';

const ChatThread = ({ chat, onBack }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [title, setTitle] = useState(chat.title);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteLongTermModal, setShowDeleteLongTermModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferToLongTerm, setTransferToLongTerm] = useState(true);
    const [showSourceModal, setShowSourceModal] = useState(false);
    const [sourceContent, setSourceContent] = useState('');
    const listRef = useRef(null);
    const sizeMap = useRef({});

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

    const debouncedHandleSend = debounce(handleSend, 300);

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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            debouncedHandleSend();
        }
    };

    const toggleShowSource = (index) => {
        setSourceContent(chatHistory[index].text);
        setShowSourceModal(true);
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
        if (listRef.current) {
            listRef.current.scrollToItem(chatHistory.length - 1, 'end');
        }
    }, [chatHistory]);

    const getSize = useCallback(index => sizeMap.current[index] || 50, []);

    const setSize = useCallback((index, size) => {
        listRef.current.resetAfterIndex(index);
        sizeMap.current = { ...sizeMap.current, [index]: size };
    }, []);

    const renderRow = ({ index, style }) => (
        <div style={style}>
            <ChatMessage
                msg={chatHistory[index]}
                index={index}
                toggleShowSource={toggleShowSource}
                setSize={setSize}
            />
        </div>
    );

    return (
        <Container fluid className="d-flex flex-column" style={{ height: '100vh', padding: 0 }}>
            <Row className="w-100 m-0">
                <Col className="d-flex justify-content-between align-items-center p-2 border-bottom">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-back">Back to Chat List</Tooltip>}>
                        <Button variant="secondary" onClick={onBack}>
                            <BsArrowLeft />
                        </Button>
                    </OverlayTrigger>
                    <h1 className="mb-0">{title}</h1>
                    <div>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-transfer">Transfer to Long Term Memory</Tooltip>}>
                            <Button variant="warning" onClick={() => setShowTransferModal(true)}>
                                <BsBoxArrowInRight />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-delete">Delete All Messages</Tooltip>}>
                            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                                <BsTrash />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-delete-long-term">Delete Long Term Memory</Tooltip>}>
                            <Button variant="danger" onClick={() => setShowDeleteLongTermModal(true)}>
                                <BsEraser />
                            </Button>
                        </OverlayTrigger>
                    </div>
                </Col>
            </Row>
            <Row className="flex-grow-1 w-100 m-0" style={{ overflowY: 'auto' }}>
                <Col className="d-flex flex-column p-2">
                    <div style={{ flex: '1 1 auto', padding: '10px', overflowY: 'auto', marginBottom: '10px', maxHeight: 'calc(100vh - 150px)' }}>
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    height={height}
                                    width={width}
                                    itemCount={chatHistory.length}
                                    itemSize={getSize}
                                    ref={listRef}
                                >
                                    {renderRow}
                                </List>
                            )}
                        </AutoSizer>
                    </div>
                </Col>
            </Row>
            <Row className="w-100 m-0" style={{ flexShrink: 0 }}>
                <Col className="p-2">
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
            <Modal show={showSourceModal} onHide={() => setShowSourceModal(false)} dialogClassName="source-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Markdown Source</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <pre>{sourceContent}</pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSourceModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ChatThread;