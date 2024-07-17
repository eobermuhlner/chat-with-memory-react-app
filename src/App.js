import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import ChatList from './components/Chats/ChatList';
import AssistantList from './components/Assistants/AssistantList';
import ChatThread from './components/Chats/ChatThread';

function App() {
    const [activeTab, setActiveTab] = useState('chats');
    const [selectedChat, setSelectedChat] = useState(null);

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
    };

    const handleBackToChatList = () => {
        setSelectedChat(null);
    };

    return (
        <Container fluid>
            <Row>
                <Col>
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
            <Row>
                <Col>
                    {activeTab === 'chats' && (
                        <>
                            {selectedChat ? (
                                <ChatThread chat={selectedChat} onBack={handleBackToChatList} />
                            ) : (
                                <ChatList onSelectChat={handleSelectChat} />
                            )}
                        </>
                    )}
                    {activeTab === 'assistants' && <AssistantList />}
                </Col>
            </Row>
        </Container>
    );
}

export default App;
