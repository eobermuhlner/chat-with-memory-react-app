import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup } from 'react-bootstrap';
import ChatListItem from './ChatListItem';
import ChatEditor from './ChatEditor';
import ChatControls from './ChatControls';

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

    const handleCreateChat = async () => {
        try {
            const response = await axios.get('http://localhost:8092/chats/new');
            const newChatTemplate = response.data;

            const createResponse = await axios.post('http://localhost:8092/chats', newChatTemplate);
            const createdChat = createResponse.data;
            setChats([...chats, createdChat]);
            onSelectChat(createdChat);
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    };

    const handleEditChat = async (chat) => {
        try {
            const response = await axios.get(`http://localhost:8092/chats/${chat.id}`);
            setEditingChat(response.data);
        } catch (error) {
            console.error('Error fetching chat:', error);
        }
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
            <ChatControls onCreateChat={handleCreateChat} />
            <ListGroup>
                {chats.map(chat => (
                    <ChatListItem
                        key={chat.id}
                        chat={chat}
                        onSelect={() => onSelectChat(chat)}
                        onEdit={() => handleEditChat(chat)}
                        onDelete={() => handleDeleteChat(chat.id)}
                    />
                ))}
            </ListGroup>
            {editingChat && <ChatEditor chat={editingChat} onClose={() => setEditingChat(null)} onSave={handleSaveEdit} />}
        </div>
    );
}

export default ChatList;
