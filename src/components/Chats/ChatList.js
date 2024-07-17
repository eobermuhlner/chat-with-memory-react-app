import React, { useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import ChatItem from './ChatItem';
import ChatEditor from './ChatEditor';

function ChatList() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    const handleCreateChat = () => {
        const newChat = { id: Date.now(), name: 'New Chat' };
        setChats([...chats, newChat]);
        setSelectedChat(newChat);
    };

    return (
        <div>
            <Button onClick={handleCreateChat}>Create New Chat</Button>
            <ListGroup>
                {chats.map(chat => (
                    <ChatItem key={chat.id} chat={chat} onSelect={() => setSelectedChat(chat)} />
                ))}
            </ListGroup>
            {selectedChat && <ChatEditor chat={selectedChat} onClose={() => setSelectedChat(null)} />}
        </div>
    );
}

export default ChatList;
