// MainPage.js
import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import ChatList from './components/Chats/ChatList';
import AssistantList from './components/Assistants/AssistantList';
import ChatThread from './components/Chats/ChatThread';

const MainPage = () => {
    const [activeTab, setActiveTab] = useState('chats');
    const [selectedChat, setSelectedChat] = useState(null);

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
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
                            </Nav>
                        </Col>
                    </Row>
                    <Row className="flex-grow-1 m-0">
                        <Col className="p-0">
                            {activeTab === 'chats' && <ChatList onSelectChat={handleSelectChat} />}
                            {activeTab === 'assistants' && <AssistantList />}
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default MainPage;
