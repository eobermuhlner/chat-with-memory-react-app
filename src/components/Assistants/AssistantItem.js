import React from 'react';
import { ListGroup } from 'react-bootstrap';

function AssistantItem({ assistant, onSelect }) {
    return (
        <ListGroup.Item action onClick={onSelect}>
            {assistant.name}
        </ListGroup.Item>
    );
}

export default AssistantItem;
