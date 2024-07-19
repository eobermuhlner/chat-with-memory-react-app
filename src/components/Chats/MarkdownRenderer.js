import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCopy } from 'react-icons/fa';

const MarkdownRenderer = ({ text }) => {
    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
    };

    return (
        <ReactMarkdown
            children={text}
            components={{
                code: ({ node, inline, className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                        <code style={{
                            backgroundColor: '#2d2d2d',
                            color: '#f8f8f2',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            display: 'inline'
                        }} {...props}>
                            {children}
                        </code>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <SyntaxHighlighter
                                style={darcula}
                                language={className ? className.replace("language-", "") : ""}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Copy code</Tooltip>}
                            >
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                    }}
                                >
                                    <FaCopy />
                                </Button>
                            </OverlayTrigger>
                        </div>
                    );
                },
                pre: ({ node, children, ...props }) => {
                    return (
                        <div style={{ position: 'relative' }}>
                            <pre {...props} style={{ position: 'relative', padding: '10px', backgroundColor: '#2d2d2d', color: '#f8f8f2', borderRadius: '4px' }}>
                                {children}
                            </pre>
                        </div>
                    );
                },
            }}
        />
    );
};

export default MarkdownRenderer;
