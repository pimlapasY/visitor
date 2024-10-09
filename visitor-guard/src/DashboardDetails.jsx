import React, { useState, useEffect } from 'react'; // เพิ่มการนำเข้า useEffect
import {
    Modal,
    Button,
    Grid,
    Row,
    Col,
    Badge
} from 'rsuite'; // Import RSuite components
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faStreetView, faUserCheck } from '@fortawesome/free-solid-svg-icons';

const DashboardDetails = ({ open, handleClose, visitor, afterUpdate }) => {
    const [timeout, setTimeout] = useState(visitor.timeout ? new Date(visitor.timeout) : null);
    const name = localStorage.getItem('name');

    useEffect(() => {
        if (!name) {
            console.log('Username or name not found in localStorage. Redirecting...');
            // Redirect ไปหน้า login หรือหน้าอื่นถ้าข้อมูลไม่มี
            window.location.href = '/';
        }
    }, [name]); // กำหนดให้ effect ทำงานเมื่อ username หรือ name เปลี่ยนแปลง

    const handleUpdate = async (id, userName) => {
        console.log(id)
        try {
            const response = await fetch(`https://visitor.system-samt.com/api/visitor/${id}/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userName // ส่งค่าผู้ใช้ใหม่
                })
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'อัปเดตข้อมูลผู้เยี่ยมชมเรียบร้อยแล้ว',
                    confirmButtonText: 'ตกลง'
                });
                afterUpdate(); // เรียกฟังก์ชันเพื่อโหลดข้อมูลใหม่ใน App.jsx
                handleClose(); // ปิด modal หลังจากอัปเดตสำเร็จ
            } else {
                console.error('Failed to update visitor user');
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด!',
                    text: 'ไม่สามารถอัปเดตข้อมูลผู้เยี่ยมชมได้',
                    confirmButtonText: 'ตกลง'
                });
            }
        } catch (error) {
            console.error('Error occurred while updating visitor user:', error);
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด!',
                text: 'เกิดข้อผิดพลาดในการอัปเดต',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    return (
        <Modal open={open} onClose={handleClose} size="lg"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Modal.Header style={{ display: 'flex', }}>
                <h5 style={{ marginRight: '10px', fontSize: '1.3rem' }}>รายละเอียดผู้มาติดต่อ</h5>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Row>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px', fontSize: '1.2rem' }}> {/* ปรับขนาดฟอนต์ที่นี่ */}
                            <strong>ชื่อ:</strong> <span>{visitor.name}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                            <strong>เบอร์โทร:</strong> <span>{visitor.phone}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                            <strong>บริษัท:</strong> <span>{visitor.companyName}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                            <strong>จุดมุ่งหมาย:</strong> <span>{visitor.aimgroup} [{visitor.aim}]</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                            <strong>ติดต่อ:</strong> <span>{visitor.toVisit}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                            <strong>ทะเบียน:</strong> <span>{visitor.vehicleRegistration}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                            <strong>เวลาเข้า:</strong> <span>{visitor.dateTimeIn}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                            <strong>เวลาออก:</strong> <span>{visitor.timeOut != null ? visitor.timeOut : 'ยังไม่ออก'}</span>
                        </Col>
                    </Row>
                </Grid>
            </Modal.Body>

            <Modal.Footer>
                {(visitor.user === null) ?
                    <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button onClick={handleClose} style={{ float: 'right' }} size='lg'>
                            ปิด
                        </Button>
                        <Button appearance='ghost' color='primary' size='lg' onClick={() => handleUpdate(visitor.id, name)}> {/* ใช้ visitor.num แทน visitor.id */}
                            รับทราบ
                        </Button>
                    </span> :
                    <span style={{ color: 'green', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size='lg' onClick={handleClose} style={{ float: 'right' }} >
                            ปิด
                        </Button>
                        <Badge color="green" content={`ผู้รับทราบ: ${visitor.user}`} style={{ padding: "7px" }} />
                    </span>
                }
            </Modal.Footer>
        </Modal>
    );
};

export default DashboardDetails;
