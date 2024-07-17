import React, { useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import AssistantItem from './AssistantItem';
import AssistantEditor from './AssistantEditor';

function AssistantList() {
    const [assistants, setAssistants] = useState([]);
    const [selectedAssistant, setSelectedAssistant] = useState(null);

    const handleCreateAssistant = () => {
        const newAssistant = { id: Date.now(), name: 'New Assistant' };
        setAssistants([...assistants, newAssistant]);
        setSelectedAssistant(newAssistant);
    };

    return (
        <div>
            <Button onClick={handleCreateAssistant}>Create New Assistant</Button>
            <ListGroup>
                {assistants.map(assistant => (
                    <AssistantItem key={assistant.id} assistant={assistant} onSelect={() => setSelectedAssistant(assistant)} />
                ))}
            </ListGroup>
            {selectedAssistant && <AssistantEditor assistant={selectedAssistant} onClose={() => setSelectedAssistant(null)} />}
        </div>
    );
}

export default AssistantList;
