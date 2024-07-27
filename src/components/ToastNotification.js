// ToastNotification.js
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => {
    return <ToastContainer position="top-right" autoClose={5000} hideProgressBar />;
};

export const showToast = (message, type = 'info') => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'warning':
            toast.warn(message);
            break;
        case 'info':
        default:
            toast.info(message);
            break;
    }
};

export default ToastNotification;
