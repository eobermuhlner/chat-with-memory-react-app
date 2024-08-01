import React, { useState, useEffect } from 'react';
import api from '../../api';
import { ListGroup, Modal, Button } from 'react-bootstrap';
import ChatItem from './ChatItem';
import ChatEditor from './ChatEditor';
import ChatControls from './ChatControls';
import ToastNotification, { showToast } from '../ToastNotification';
import './ChatList.css';

function ChatList({ onSelectChat }) {
    const [chats, setChats] = useState([]);
    const [editingChat, setEditingChat] = useState(null);
    const [chatToDelete, setChatToDelete] = useState(null);

    useEffect(() => {
        api.get('/chats')
            .then(response => setChats(response.data))
            .catch(error => showToast('Error fetching chats: ' + error.message, 'error'));
    }, []);

    const handleCreateChat = async () => {
        try {
            const response = await api.get('/chats/new');
            setEditingChat(response.data);
        } catch (error) {
            showToast('Error initializing new chat: ' + error.message, 'error');
        }
    };

    const handleEditChat = async (chat) => {
        try {
            const response = await api.get(`/chats/${chat.id}`);
            setEditingChat(response.data);
        } catch (error) {
            showToast('Error fetching chat: ' + error.message, 'error');
        }
    };

    const handleDeleteChat = async (chatId) => {
        try {
            await api.delete(`/chats/${chatId}`);
            setChats(chats.filter(chat => chat.id !== chatId));
            setChatToDelete(null);
            showToast('Chat deleted successfully', 'success');
        } catch (error) {
            showToast('Error deleting chat: ' + error.message, 'error');
        }
    };

    const handleSaveEdit = (savedChat) => {
        setChats(chats.map(chat => (chat.id === savedChat.id ? savedChat : chat)));
        setEditingChat(null);
        showToast('Chat saved successfully', 'success');
    };

    return (
        <div>
            <ToastNotification />
            <ChatControls onCreateChat={handleCreateChat} />
            <div className="chat-list-container">
                <ListGroup>
                    {chats.map(chat => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            onSelect={() => onSelectChat(chat)}
                            onEdit={() => handleEditChat(chat)}
                            onDelete={() => setChatToDelete(chat.id)}
                        />
                    ))}
                </ListGroup>
            </div>
            {editingChat && (
                <ChatEditor chat={editingChat} onClose={() => setEditingChat(null)} onSave={handleSaveEdit} />
            )}
            <Modal show={!!chatToDelete} onHide={() => setChatToDelete(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this chat?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setChatToDelete(null)}>Cancel</Button>
                    <Button variant="danger" onClick={() => handleDeleteChat(chatToDelete)}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ChatList;
