import React, { useState } from 'react';
import {
    Modal,
    Button,
    Grid,
    Row,
    Col
} from 'rsuite'; // Import RSuite components
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faStreetView, faUserCheck } from '@fortawesome/free-solid-svg-icons';


const DetailModal = ({ open, handleClose, visitor, afterUpdate }) => {
    const [timeout, setTimeout] = useState(visitor.timeout ? new Date(visitor.timeout) : null);

    const handleTimeoutUpdate = async (id) => {
        const currentTime = new Date().toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok',
            hour12: false
        });

        try {
            const response = await fetch(`https://visitor.system-samt.com/api/visitor/${id}/timeout`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setTimeout(currentTime);
                afterUpdate(); // Call the function to reload data in App.jsx

                // Show success alert
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'อัปเดตเวลาออกเรียบร้อยแล้ว',
                    confirmButtonText: 'ตกลง'
                });

                handleClose(); // Close modal after successful update
            } else {
                console.error('Failed to update timeout');
                // Show error alert
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด!',
                    text: 'ไม่สามารถอัปเดตเวลาออกได้',
                    confirmButtonText: 'ตกลง'
                });
            }
        } catch (error) {
            console.error('Error occurred while updating timeout:', error);
            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด!',
                text: 'เกิดข้อผิดพลาดในการอัปเดต',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    const handleDelete = async (visitorId, name) => {
        const result = await Swal.fire({
            title: 'ต้องการลบ',
            text: name,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`https://visitor.system-samt.com/api/visitor/${visitorId}`);
                console.log('ลบผู้เยี่ยมชม:', response.data);
                afterUpdate(); // เรียกใช้ฟังก์ชัน fetchData เพื่ออัปเดตข้อมูล
                Swal.fire(
                    'ลบเรียบร้อย!',
                    'ผู้เยี่ยมชมของคุณถูกลบแล้ว.',
                    'success'
                );
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการลบผู้เยี่ยมชม:', error);
                Swal.fire(
                    'เกิดข้อผิดพลาด!',
                    'มีข้อผิดพลาดเกิดขึ้นในการลบผู้เยี่ยมชม.',
                    'error'
                );
            }
        }
    };


    return (
        <Modal open={open} onClose={handleClose} size="sm"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',

            }}
        >
            <Modal.Header style={{ display: 'flex', }}>
                <h5 style={{ marginRight: '10px' }}>รายละเอียดผู้มาติดต่อ</h5>
                {visitor.user === null ?
                    <Button appearance="ghost" size='sm' color='red' onClick={() => handleDelete(visitor.id, visitor.name)}>
                        <FontAwesomeIcon icon={faTrashCan} style={{ marginRight: '8px' }} /> ลบ
                    </Button> : ''}
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <Row>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px' }}>
                            <strong>ชื่อ:</strong> <span>{visitor.name}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px' }}>
                            <strong>เบอร์โทร:</strong> <span>{visitor.phone}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px' }}>
                            <strong>บริษัท:</strong> <span>{visitor.companyName}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px' }}>
                            <strong>จุดมุ่งหมาย:</strong> <span>{visitor.aimgroup} [{visitor.aim}]</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px' }}>
                            <strong>ติดต่อ:</strong> <span>{visitor.toVisit}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px' }}>
                            <strong>ทะเบียน:</strong> <span>{visitor.vehicleRegistration}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px' }}>
                            <strong>เวลาเข้า:</strong> <span>{visitor.dateTimeIn}</span>
                        </Col>
                        <Col xs={24} sm={12} style={{ marginBottom: '10px' }}>
                            <strong>เวลาออก:</strong> <span>{visitor.timeOut != null ? visitor.timeOut : 'ยังไม่ออก'}</span>
                        </Col>
                    </Row>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button onClick={handleClose} appearance="default">ยกเลิก</Button> */}
                {(visitor.timeOut === null && visitor.user != null) ?
                    <span style={{ color: 'green', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button onClick={handleClose} style={{ float: 'right' }}>
                            ปิด
                        </Button>
                        <Button onClick={() => handleTimeoutUpdate(visitor.id)} appearance="primary"><FontAwesomeIcon icon={faUserCheck} style={{ marginRight: '10px' }} /> แจ้งออก</Button>
                    </span> :
                    (visitor.user === null) ?
                        <span style={{ color: 'orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button onClick={handleClose} style={{ float: 'right' }}>
                                ปิด
                            </Button>
                            รอยืนยัน
                        </span> :
                        <span style={{ color: 'green', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button onClick={handleClose} style={{ float: 'right' }} >
                                ปิด
                            </Button> เสร็จสมบูรณ์
                        </span>
                }
            </Modal.Footer>
        </Modal>
    );
};

export default DetailModal;
