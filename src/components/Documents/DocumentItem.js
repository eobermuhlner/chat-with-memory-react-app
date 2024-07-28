import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

function DocumentItem({ document, onDelete, onViewSegments }) {
    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <strong>{document.name}</strong>
                    <p>{document.size} bytes</p>
                </div>
                <div>
                    <Button variant="primary" className="me-2" onClick={onViewSegments}>View Segments</Button>
                    <Button variant="danger" onClick={onDelete}>Delete</Button>
                </div>
            </div>
        </ListGroup.Item>
    );
}

export default DocumentItem;
