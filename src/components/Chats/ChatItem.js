import React from 'react';
import { ListGroup, Button, Badge } from 'react-bootstrap';
import { FaTools, FaUser, FaFileAlt } from 'react-icons/fa';  // Import necessary icons

function ChatItem({ chat, onSelect, onEdit, onDelete }) {
    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between align-items-center">
                <div onClick={onSelect} style={{ cursor: 'pointer' }}>
                    <strong>{chat.title}</strong>
                </div>
                <div className="flex-grow-1 mx-3">
                    <div className="d-flex flex-wrap align-items-start">
                        {chat.assistants.map(assistant => (
                            <Badge bg="light" key={assistant.id} className="mr-2 mb-2 d-flex align-items-center custom-badge" style={{ height: '2.5rem' }}>
                                <FaUser className="me-2" />  {/* Icon for assistants with margin end */}
                                <div className="d-flex flex-column align-items-start">
                                    <span>{assistant.name}</span>
                                    <small className="text-muted">{assistant.description}</small>
                                </div>
                            </Badge>
                        ))}
                    </div>
                    <div className="d-flex flex-wrap align-items-start">
                        {chat.tools.map(tool => (
                            <Badge bg="light" key={tool} className="mr-2 mb-2 d-flex align-items-center custom-badge" style={{ height: '2.5rem' }}>
                                <FaTools className="me-2" />  {/* Icon for tools with margin end */}
                                {tool}
                            </Badge>
                        ))}
                    </div>
                    <div className="d-flex flex-wrap align-items-start">
                        {chat.documents.map(document => (
                            <Badge bg="light" key={document.id} className="mr-2 mb-2 d-flex align-items-center custom-badge" style={{ height: '2.5rem' }}>
                                <FaFileAlt className="me-2" />  {/* Icon for documents with margin end */}
                                {document.name}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div>
                    <Button variant="secondary" onClick={onEdit} className="me-2">Edit</Button>
                    <Button variant="danger" onClick={onDelete}>Delete</Button>
                </div>
            </div>
        </ListGroup.Item>
    );
}

export default ChatItem;
