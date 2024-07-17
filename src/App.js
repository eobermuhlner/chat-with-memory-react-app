import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import ChatList from './components/Chats/ChatList';
import AssistantList from './components/Assistants/AssistantList';

function App() {
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Nav variant="tabs" defaultActiveKey="/chats">
                        <Nav.Item>
                            <Nav.Link href="/chats">Chats</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/assistants">Assistants</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ChatList />
                </Col>
                <Col>
                    <AssistantList />
                </Col>
            </Row>
        </Container>
    );
}

export default App;
