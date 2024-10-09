import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Message, Input, Grid, Row, Col, Header, Navbar, Nav } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const LineSendMessage = () => {
    const [message, setMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');

    useEffect(() => {
        if (username !== '6703425') {
            alert('คุณไม่มีสิทธิ์เข้าจัดการหน้านี้');
            navigate('/visitor-guard/login');
        }
    }, [username, name, navigate]);

    const handleSendMessage = async () => {
        if (!message) {
            alert('กรุณาพิมพ์ข้อความก่อนส่ง');
            return;
        }

        try {
            const response = await axios.post('https://visitor.system-samt.com/api/send-to-all', { message });
            setResponseMessage(response.data.message);
            setMessage('');
        } catch (error) {
            setResponseMessage('เกิดข้อผิดพลาดในการส่งข้อความ');
            console.error('Error sending message:', error);
        }
    };
    const handleLogout = () => {
        // Clear the local storage
        localStorage.removeItem('username');
        localStorage.removeItem('name');

        // Show a confirmation message
        Swal.fire({
            title: 'ออกจากระบบ',
            text: 'คุณออกจากระบบสำเร็จ!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Redirect to the login page
            window.location.href = '/visitor-guard/login';
        });
    };

    return (
        <>
            <Header>
                <Navbar
                    style={{
                        backgroundColor: '#87CEEB',
                        fontFamily: 'Arial, sans-serif',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap', // Allows wrapping on smaller screens
                        padding: '10px',
                    }}
                >
                    <Navbar.Brand style={{ fontSize: '18px', fontWeight: 'bold', flex: '1' }}>SAMT Visitor</Navbar.Brand>

                    <Nav>
                        <Nav.Item style={{ fontSize: '18px', whiteSpace: 'nowrap' }}>
                            <FontAwesomeIcon icon={faUserTie} style={{ marginRight: '10px' }} /> Welcome, {name || 'Guest'}!
                        </Nav.Item>
                    </Nav>
                    <Nav>
                        <Nav.Item
                            as={Link} // Use Link component
                            to="/visitor-guard/dashboard" // Set the destination path
                            style={{ fontSize: '18px', whiteSpace: 'nowrap' }}
                        >
                            Dashboard
                        </Nav.Item>
                    </Nav>
                    <Nav pullRight>
                        <Nav.Item>
                            <Button
                                appearance="default"
                                onClick={handleLogout}
                                style={{ width: '200px', maxWidth: '100%', fontSize: '16px' }}
                            >
                                Logout
                            </Button>
                        </Nav.Item>
                    </Nav>
                </Navbar>
            </Header>
            <Grid >
                <Row style={{ marginTop: '100px' }}>
                    <Col xs={24}>
                        <h2>ส่งข้อความไปยังทุกกลุ่ม</h2>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <Input
                            as="textarea"
                            rows={4}
                            placeholder="พิมพ์ข้อความที่นี่..."
                            value={message}
                            onChange={(value) => setMessage(value)}
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <Button appearance="primary" onClick={handleSendMessage}>ส่งข้อความ</Button>
                    </Col>
                </Row>
                {responseMessage && (
                    <Row>
                        <Col xs={24}>
                            <Message style={{ marginTop: '10px' }}>{responseMessage}</Message>
                        </Col>
                    </Row>
                )}
                <br></br>
                <Row>
                    <Col xs={24}>
                        <Input value={'------------------- นี่คือข้อความทดสอบระบบ'} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <Input value={'------------------- นี่คือข้อความแจ้งเตือน'} />
                    </Col>
                </Row>
            </Grid>
        </>
    );
};

export default LineSendMessage;
