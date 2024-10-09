import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input } from 'rsuite';

const LineNotify = () => {
    const [message, setMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSendMessage = async () => {
        if (!message) {
            alert('กรุณาพิมพ์ข้อความก่อนส่ง');
            return;
        }

        try {
            // เปลี่ยน URL ไปที่ proxy server ของคุณ
            const response = await axios.post('https://visitor.system-samt.com/send-message',
                {
                    messages: [
                        {
                            type: 'text',
                            text: message, // ส่งข้อความไปยัง backend
                        },
                    ],
                }
            );

            if (response.status === 200) {
                setResponseMessage('ข้อความถูกส่งแล้ว!');
            }
        } catch (error) {
            setResponseMessage('เกิดข้อผิดพลาดในการส่งข้อความ');
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <h1>ส่งข้อความไปยัง LINE Notify</h1>
            <Input
                placeholder="พิมพ์ข้อความที่นี่..."
                value={message}
                onChange={(value) => setMessage(value)}
                style={{ marginBottom: '10px' }}
            />
            <Button appearance="primary" onClick={handleSendMessage}>ส่งข้อความ</Button>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default LineNotify;
