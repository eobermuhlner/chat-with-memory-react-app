import React, { useEffect, useRef, memo } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MarkdownRenderer from './MarkdownRenderer';

const ChatMessage = ({ msg, index, toggleShowSource, setSize }) => {
    const messageRef = useRef();

    useEffect(() => {
        if (messageRef.current) {
            const height = messageRef.current.getBoundingClientRect().height;
            setSize(index, height);
        }
    }, [index, setSize, msg]);

    return (
        <div
            ref={messageRef}
            style={{
                margin: '10px 0',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                background: msg.type === 'User' ? '#edf6ff' :
                    msg.type === 'Assistant' ? '#f6ffed' :
                        msg.type === 'System' ? '#f0f0f0' : '#fff6ed'
            }}
        >
            <strong>{msg.sender}:</strong>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{msg.showSource ? 'Show Rendered' : 'Show Source'}</Tooltip>}
            >
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => toggleShowSource(index)}
                    className="ml-2 toggle-source-btn"
                >
                    {msg.showSource ? <FaEyeSlash /> : <FaEye />}
                </Button>
            </OverlayTrigger>
            {msg.showSource ? (
                <pre>{msg.text}</pre>
            ) : (
                <MarkdownRenderer text={msg.text} />
            )}
        </div>
    );
};

export default memo(ChatMessage, (prevProps, nextProps) =>
    prevProps.msg === nextProps.msg &&
    prevProps.index === nextProps.index &&
    prevProps.toggleShowSource === nextProps.toggleShowSource &&
    prevProps.setSize === nextProps.setSize
);
