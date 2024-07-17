import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Button } from 'react-bootstrap';
import ChatItem from './ChatItem';
import ChatEditor from './ChatEditor';

function ChatList({ onSelectChat }) {
    const [chats, setChats] = useState([]);
    const [editingChat, setEditingChat] = useState(null);

    useEffect(() => {
        // Fetch chats from the REST endpoint
        axios.get('http://localhost:8092/chats')
            .then(response => {
                setChats(response.data);
            })
            .catch(error => {
                console.error('Error fetching chats:', error);
            });
    }, []);

    const handleCreateChat = () => {
        const newChat = { id: Date.now(), title: 'New Chat' };
        setChats([...chats, newChat]);
        onSelectChat(newChat);
    };

    const handleEditChat = (chat) => {
        setEditingChat(chat);
    };

    const handleDeleteChat = async (chatId) => {
        try {
            await axios.delete(`http://localhost:8092/chats/${chatId}`);
            setChats(chats.filter(chat => chat.id !== chatId));
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    const handleSaveEdit = (updatedChat) => {
        setChats(chats.map(chat => (chat.id === updatedChat.id ? updatedChat : chat)));
        setEditingChat(null);
    };

    return (
        <div>
            <Button onClick={handleCreateChat} className="mb-3">Create New Chat</Button>
            <ListGroup>
                {chats.map(chat => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        onSelect={() => onSelectChat(chat)}
                        onEdit={handleEditChat}
                        onDelete={handleDeleteChat}
                    />
                ))}
            </ListGroup>
            {editingChat && <ChatEditor chat={editingChat} onClose={() => setEditingChat(null)} onSave={handleSaveEdit} />}
        </div>
    );
}

export default ChatList;
