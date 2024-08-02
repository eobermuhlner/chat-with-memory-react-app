import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FaTools, FaFile } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './AssistantItem.css'; // Use its own CSS

function AssistantItem({ assistant, onSelect, onEdit, onDelete }) {
    const renderBadges = (items, Icon) => (
        items.map(item => (
            <Badge bg="light" key={item.id || item} className="mr-2 mb-2 d-flex align-items-center custom-badge">
                <Icon className="me-2" />
                {item.name || item}
            </Badge>
        ))
    );

    return (
        <div className="assistant-item">
            <div className="assistant-item-table">
                <div onClick={onSelect} className="assistant-item-title">
                    <strong>{assistant.name}</strong>
                    <p>{assistant.description}</p>
                </div>
                <div className="assistant-item-badges-container">
                    <div className="assistant-item-badges">
                        {renderBadges(assistant.tools, FaTools)}
                        {renderBadges(assistant.documents, FaFile)}
                    </div>
                </div>
                <div className="assistant-item-buttons">
                    <Button variant="secondary" onClick={() => onEdit(assistant)} className="me-2">Edit</Button>
                    <Button variant="danger" onClick={() => onDelete(assistant.id)}>Delete</Button>
                </div>
            </div>
            <div className="assistant-item-card">
                <div onClick={onSelect} className="assistant-item-title">
                    <strong>{assistant.name}</strong>
                    <p>{assistant.description}</p>
                </div>
                <div className="assistant-item-badges-container">
                    <div className="assistant-item-badges">
                        {renderBadges(assistant.tools, FaTools)}
                        {renderBadges(assistant.documents, FaFile)}
                    </div>
                </div>
                <div className="assistant-item-buttons">
                    <Button variant="secondary" onClick={() => onEdit(assistant)} className="me-2">Edit</Button>
                    <Button variant="danger" onClick={() => onDelete(assistant.id)}>Delete</Button>
                </div>
            </div>
        </div>
    );
}

AssistantItem.propTypes = {
    assistant: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default AssistantItem;
