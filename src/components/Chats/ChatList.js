import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Modal, Button } from 'react-bootstrap';
import ChatListItem from './ChatListItem';
import ChatEditor from './ChatEditor';
import ChatControls from './ChatControls';
import ToastNotification, { showToast } from '../ToastNotification';

function ChatList({ onSelectChat }) {
    const [chats, setChats] = useState([]);
    const [editingChat, setEditingChat] = useState(null);
    const [chatToDelete, setChatToDelete] = useState(null);

    useEffect(() => {
        // Fetch chats from the REST endpoint
        axios.get('http://localhost:8092/chats')
            .then(response => {
                setChats(response.data);
            })
            .catch(error => {
                showToast('Error fetching chats: ' + error.message, 'error');
            });
    }, []);

    const handleCreateChat = async () => {
        try {
            const response = await axios.get('http://localhost:8092/chats/new');
            const newChatTemplate = response.data;
            setEditingChat(newChatTemplate);  // Open the ChatEditor with the new chat template
        } catch (error) {
            showToast('Error initializing new chat: ' + error.message, 'error');
        }
    };

    const handleEditChat = async (chat) => {
        try {
            const response = await axios.get(`http://localhost:8092/chats/${chat.id}`);
            setEditingChat(response.data);
        } catch (error) {
            showToast('Error fetching chat: ' + error.message, 'error');
        }
    };

    const handleDeleteChat = async (chatId) => {
        try {
            await axios.delete(`http://localhost:8092/chats/${chatId}`);
            setChats(chats.filter(chat => chat.id !== chatId));
            setChatToDelete(null);
            showToast('Chat deleted successfully', 'success');
        } catch (error) {
            showToast('Error deleting chat: ' + error.message, 'error');
        }
    };

    const handleSaveEdit = (savedChat) => {
        if (editingChat.id == null) {
            setChats([...chats, savedChat]);
        } else {
            setChats(chats.map(chat => (chat.id === savedChat.id ? savedChat : chat)));
        }
        setEditingChat(null);
        showToast('Chat saved successfully', 'success');
    };

    const confirmDeleteChat = (chatId) => {
        setChatToDelete(chatId);
    };

    const handleCancelDelete = () => {
        setChatToDelete(null);
    };

    return (
        <div>
            <ToastNotification />
            <ChatControls onCreateChat={handleCreateChat} />
            <ListGroup>
                {chats.map(chat => (
                    <ChatListItem
                        key={chat.id}
                        chat={chat}
                        onSelect={() => onSelectChat(chat)}
                        onEdit={() => handleEditChat(chat)}
                        onDelete={() => confirmDeleteChat(chat.id)}
                    />
                ))}
            </ListGroup>
            {editingChat && <ChatEditor chat={editingChat} onClose={() => setEditingChat(null)} onSave={handleSaveEdit} />}

            <Modal show={!!chatToDelete} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this chat?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteChat(chatToDelete)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ChatList;
