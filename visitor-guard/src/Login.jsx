import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import {
    Container,
    Header,
    Content,
    Footer,
    Form,
    Button,
    Navbar,
    Panel,
    Input,
    Stack,
    Divider,
    VStack
} from 'rsuite';
import Swal from 'sweetalert2';

const Password = React.forwardRef((props, ref) => (
    <Input {...props} ref={ref} type="password" />
));

const Login = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // เปลี่ยน title ของหน้า
        document.title = "Login - SAMT Visitor";

        // เปลี่ยน Favicon
        const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
        favicon.rel = 'icon';
        // favicon.href = '/path/to/login-favicon.ico'; // แก้ไขให้เป็น path ของ favicon สำหรับหน้านี้
        document.head.appendChild(favicon);

        // ฟังก์ชันสำหรับตรวจสอบปุ่ม Enter
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // ป้องกันการส่งฟอร์ม
                handleLogin(); // เรียกใช้ฟังก์ชันเข้าสู่ระบบ
            }
        };

        // เพิ่ม event listener
        window.addEventListener('keydown', handleKeyDown);

        // ลบ event listener เมื่อ component ถูก unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [username, password]); // เพิ่ม dependencies เพื่อให้ access ฟังก์ชันได้

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://visitor.system-samt.com/api/login', {
                username,
                password
            });

            if (response.status === 200) {
                // ถ้าเข้าสู่ระบบสำเร็จ ทำสิ่งที่ต้องการ เช่น เก็บ token หรือย้ายไปหน้าอื่น
                console.log(response.data);
                const username = response.data.username; // ดึง username
                const name = response.data.name; // ดึง name
                localStorage.setItem('username', username); // เก็บ username
                localStorage.setItem('name', name); // เก็บ name

                Swal.fire({
                    title: 'Login',
                    text: 'เข้าสู่ระบบสำเร็จ!',
                    icon: 'success',
                    timer: 700, //0.7 วินาที
                    showConfirmButton: false // ไม่แสดงปุ่ม OK
                }).then(() => {
                    // Redirect to the dashboard page
                    window.location.href = '/visitor-guard/dashboard';
                });
            }
        } catch (error) {
            setError('Invalid username or password');
            console.error('Login error:', error);
        }
    };

    return (
        <Container>
            <Header>
                <Navbar style={{
                    backgroundColor: '#87CEEB', padding: '10px',
                }}>
                    <Navbar.Brand style={{ fontSize: '18px', fontWeight: 'bold' }}>SAMT Visitor</Navbar.Brand>
                </Navbar>
            </Header>
            <Content>
                <Stack alignItems="center" justifyContent="center" style={{ height: '80vh' }}>
                    <Panel header="Login to view visitor" bordered style={{ width: '45vh', height: '500px', }}>
                        <Form fluid style={{ marginTop: '10px' }}>
                            <Form.Group>
                                <Form.ControlLabel style={{ fontSize: '18px' }}>ชื่อเข้าระบบ/Username</Form.ControlLabel>
                                <Form.Control name="username" type="text" value={username} onChange={setUsername} style={{ fontSize: '14px' }} />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel style={{ fontSize: '18px' }}>รหัสผ่าน/Password</Form.ControlLabel>
                                <Form.Control name="password" autoComplete="off" accepter={Password} value={password} onChange={setPassword} style={{ fontSize: '14px' }} />
                            </Form.Group>

                            {error && <p style={{ color: 'red' }}>{error}</p>} {/* แสดง error message */}

                            <VStack spacing={10}>
                                <Button appearance="ghost" block onClick={handleLogin} style={{ fontSize: '18px', }}>
                                    Sign in
                                </Button><br />
                                <a
                                    href="#"
                                    style={{ fontSize: '15px', textDecoration: 'underline', color: '#007bff' }}
                                    onClick={() => alert('กรุณาติดต่อผู้พัฒนาระบบ')}
                                >
                                    Forgot password?
                                </a>
                            </VStack>
                        </Form>
                        <Divider>OR</Divider>
                        <Button block href='http://dr-koutei03.local/mainpage/' style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
                            Back To Dashboard
                        </Button>
                    </Panel>
                </Stack>
            </Content>
            <Footer />
        </Container>
    );
};

export default Login;
