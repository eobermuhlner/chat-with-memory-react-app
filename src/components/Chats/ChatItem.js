import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FaTools, FaUser, FaFile } from 'react-icons/fa';
import './ChatItem.css';

function ChatItem({ chat, onSelect, onEdit, onDelete }) {
    const renderBadges = (items, Icon) => (
        items.map(item => (
            <Badge bg="light" key={item.id || item} className="mr-2 mb-2 d-flex align-items-center custom-badge">
                <Icon className="me-2" />
                {item.name || item}
            </Badge>
        ))
    );

    return (
        <div className="chat-item">
            <div className="chat-item-table">
                <div onClick={onSelect} className="chat-item-title">
                    <strong>{chat.title}</strong>
                </div>
                <div className="chat-item-badges-container">
                    <div className="chat-item-badges">
                        {renderBadges(chat.assistants, FaUser)}
                        {renderBadges(chat.tools, FaTools)}
                        {renderBadges(chat.documents, FaFile)}
                    </div>
                </div>
                <div className="chat-item-buttons">
                    <Button variant="secondary" onClick={onEdit} className="me-2">Edit</Button>
                    <Button variant="danger" onClick={onDelete}>Delete</Button>
                </div>
            </div>
            <div className="chat-item-card">
                <div onClick={onSelect} className="chat-item-title">
                    <strong>{chat.title}</strong>
                </div>
                <div className="chat-item-badges-container">
                    <div className="chat-item-badges">
                        {renderBadges(chat.assistants, FaUser)}
                        {renderBadges(chat.tools, FaTools)}
                        {renderBadges(chat.documents, FaFile)}
                    </div>
                </div>
                <div className="chat-item-buttons">
                    <Button variant="secondary" onClick={onEdit} className="me-2">Edit</Button>
                    <Button variant="danger" onClick={onDelete}>Delete</Button>
                </div>
            </div>
        </div>
    );
}

export default ChatItem;
