import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap'; // Import Button
import ChatList from './components/Chats/ChatList';
import AssistantList from './components/Assistants/AssistantList';
import ChatThread from './components/Chats/ChatThread';
import DocumentList from './components/Documents/DocumentList';
import UserList from './components/Users/UserList'; // Import the UserList component

const MainPage = ({ loginRequired, onLogout }) => { // Accept onLogout prop
    const [activeTab, setActiveTab] = useState('chats');
    const [selectedChat, setSelectedChat] = useState(null);

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
    };

    const handleSelectAssistant = (assistant) => {
        // do nothing
    };

    const handleBackToChatList = () => {
        setSelectedChat(null);
    };

    return (
        <Container fluid style={{ padding: 0, height: '100vh' }}>
            {selectedChat ? (
                <ChatThread chat={selectedChat} onBack={handleBackToChatList} />
            ) : (
                <>
                    <Row className="m-0">
                        <Col className="p-0">
                            <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => {
                                setActiveTab(selectedKey);
                                setSelectedChat(null);  // Reset selected chat when switching tabs
                            }}>
                                <Nav.Item>
                                    <Nav.Link eventKey="chats">Chats</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="assistants">Assistants</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="documents">Documents</Nav.Link> {/* Document Tab */}
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="users">Users</Nav.Link> {/* New Users Tab */}
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col className="p-0" xs="auto">
                            {loginRequired && (
                                <Button variant="outline-danger" onClick={onLogout}>Logout</Button>
                            )}
                        </Col>
                    </Row>
                    <Row className="flex-grow-1 m-0">
                        <Col className="p-0">
                            {activeTab === 'chats' && <ChatList onSelectChat={handleSelectChat} />}
                            {activeTab === 'assistants' && <AssistantList onSelectAssistant={handleSelectAssistant} />}
                            {activeTab === 'documents' && <DocumentList />}
                            {activeTab === 'users' && <UserList />}
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default MainPage;
