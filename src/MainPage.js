import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Dropdown, DropdownButton } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import ChatList from './components/Chats/ChatList';
import AssistantList from './components/Assistants/AssistantList';
import ChatThread from './components/Chats/ChatThread';
import DocumentList from './components/Documents/DocumentList';
import UserList from './components/Users/UserList';
import UserEditor from './components/Users/UserEditor';
import api from './api';

const MainPage = ({ loginRequired, onLogout }) => {
    const [activeTab, setActiveTab] = useState('chats');
    const [selectedChat, setSelectedChat] = useState(null);
    const [roles, setRoles] = useState([]);
    const [showUserEditor, setShowUserEditor] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setRoles(decodedToken.roles || []);
        }
    }, []);

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
    };

    const handleBackToChatList = () => {
        setSelectedChat(null);
    };

    const handleShowUserEditor = () => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get('/current');
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Failed to fetch current user', error);
            }
        };
        fetchCurrentUser();

        setShowUserEditor(true);
    };

    const handleCloseUserEditor = () => {
        setShowUserEditor(false);
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
                                    <Nav.Link eventKey="documents">Documents</Nav.Link>
                                </Nav.Item>
                                {roles.includes('ROLE_ADMIN') && (
                                    <Nav.Item>
                                        <Nav.Link eventKey="users">Users</Nav.Link>
                                    </Nav.Item>
                                )}
                            </Nav>
                        </Col>
                        <Col className="p-0" xs="auto">
                            {loginRequired && (
                                <DropdownButton id="dropdown-basic-button" title="Account" variant="outline-secondary">
                                    <Dropdown.Item onClick={handleShowUserEditor}>Edit User</Dropdown.Item>
                                    <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
                                </DropdownButton>
                            )}
                        </Col>
                    </Row>
                    <Row className="flex-grow-1 m-0">
                        <Col className="p-0">
                            {activeTab === 'chats' && <ChatList onSelectChat={handleSelectChat} />}
                            {activeTab === 'assistants' && <AssistantList onSelectAssistant={() => {}} />}
                            {activeTab === 'documents' && <DocumentList />}
                            {activeTab === 'users' && roles.includes('ROLE_ADMIN') && <UserList />}
                        </Col>
                    </Row>
                </>
            )}
            {showUserEditor && currentUser && (
                <UserEditor
                    user={currentUser}
                    onClose={handleCloseUserEditor}
                    onSave={(updatedUser) => {
                        setCurrentUser(updatedUser);
                        handleCloseUserEditor();
                    }}
                    mode="edit"
                />
            )}
        </Container>
    );
};

export default MainPage;
