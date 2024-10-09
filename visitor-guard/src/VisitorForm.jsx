import React, { useState, useEffect } from 'react';
import { Panel, Input, SelectPicker, Button, Row, Col, Container, Loader, Placeholder } from 'rsuite';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './visitor.css'
const VisitorForm = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize navigate
    const [acceptedTerms, setAcceptedTerms] = useState(false); // State for checkbox
    const [selectedPurpose, setSelectedPurpose] = useState(null); // State for selected purpose
    const [companyName, setCompanyName] = useState('');
    const [vehicleRegistration, setVehicleRegistration] = useState('');
    const [visitorName, setVisitorName] = useState(''); // State for visitor name
    const [visitorPhone, setVisitorPhone] = useState('');
    const [contactPerson, setContactPerson] = useState(''); // State for contact person
    const [reason, setReason] = useState(''); // State for reason
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    const purposeOptions = [
        { label: 'จัดซื้อ/สโตร์', value: 'group_A' },
        { label: 'โคราช/QC', value: 'group_B' },
        { label: 'Sales ติดต่องาน', value: 'group_C' },
        { label: 'Sales Delivery', value: 'group_D' },
        { label: 'อื่นๆ/ออฟฟิศ', value: 'group_Z' },
    ];

    useEffect(() => {
        // เปลี่ยน title ของหน้า
        document.title = "Form - SAMT Visitor";

        // เปลี่ยน Favicon
        const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
        favicon.rel = 'icon';
        //favicon.href = '/path/to/login-favicon.ico'; // แก้ไขให้เป็น path ของ favicon สำหรับหน้านี้
        document.head.appendChild(favicon);

        // Cleanup function เมื่อ component ถูก unmount
        /*   return () => {
              document.title = "SAMT Visitor"; // เปลี่ยนกลับเป็น title เดิม
              favicon.href = '/path/to/default-favicon.ico'; // เปลี่ยนกลับเป็น favicon เดิม
          }; */
    }, []);
    const LINE_GROUP_IDS = {
        group_A: 'C627116cbe6564839ed6d036568e116cd',
        group_B: 'C6e145dbd339fd35d70e9db15cd972757',
        group_C: 'C799d938010665673df14809a3318b266',
        group_D: 'Cfa2b6d33aed1d234d3c3a532a1c762d1',
        group_Z: 'C2f416f38bf38fb7ace35202e79754bcd',
    };


    const TELEGRAM_GROUP_IDS = {
        group_A: '-4598355637',
        group_B: '-4507567485',
        group_C: '-4538116513',
        group_D: '-4598867780',
        group_Z: '-4565889227',
    };

    // ฟังก์ชันเพื่อดึง label ของวัตถุประสงค์จาก value ที่เลือก
    const getPurposeLabel = (value) => {
        const purpose = purposeOptions.find(option => option.value === value);
        return purpose ? purpose.label : 'ไม่ทราบวัตถุประสงค์';
    };
    // ฟังก์ชันสำหรับส่งข้อความไปยังกลุ่ม LINE
    const sendMessageToLineGroup = async (groupId, visitorData) => {
        try {
            const purposeLabel = getPurposeLabel(visitorData.purpose);

            const message =
                `Visitor ${purposeLabel}\n
— คุณ ${visitorData.name} 
— จากบริษัท ${visitorData.companyName} 
— ต้องการพบ ${visitorData.contactPerson}\n
🔗 Link: https://system-samt.com/visitor-guard/dashboard`;

            const response = await fetch('https://visitor.system-samt.com/api/line-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupId,
                    message,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            console.log('Message sent to LINE group successfully:', data);
        } catch (error) {
            console.error('Error sending message to LINE:', error);
        }
    };

    // ฟังก์ชันสำหรับส่งข้อความไปยังกลุ่ม Telegram
    const sendMessageToTelegramGroup = async (groupId, visitorData) => {
        try {
            const purposeLabel = getPurposeLabel(visitorData.purpose);

            const message =
                `Visitor ${purposeLabel}\n
— คุณ ${visitorData.name} 
— จากบริษัท ${visitorData.companyName} 
— ต้องการพบ ${visitorData.contactPerson}\n
🔗 Link: https://system-samt.com/visitor-guard/dashboard`;

            const response = await fetch('https://visitor.system-samt.com/api/telegram-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupId,
                    message,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message to Telegram');
            }

            const data = await response.json();
            console.log('Message sent to Telegram group successfully:', data);
        } catch (error) {
            console.error('Error sending message to Telegram:', error);
        }
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!visitorName || !visitorPhone || !companyName || !selectedPurpose || !vehicleRegistration || !contactPerson) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        // Get the corresponding group ID for the selected purpose
        const groupId = LINE_GROUP_IDS[selectedPurpose];
        const telegramGroupId = TELEGRAM_GROUP_IDS[selectedPurpose];


        if (!groupId) {
            Swal.fire({
                icon: 'warning',
                title: 'กลุ่มไม่ถูกต้อง',
                text: 'กรุณาเลือกกลุ่มที่ถูกต้อง',
                confirmButtonText: 'ตกลง'
            });
            return;
        }
        setLoading(true); // แสดง Loader

        try {
            const visitorData = {
                name: visitorName,
                phone: visitorPhone,
                companyName,
                purpose: selectedPurpose,
                vehicleRegistration,
                contactPerson,
                reason,
            };

            const response = await fetch('https://visitor.system-samt.com/api/visitor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitorData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create visitor');
            }

            // ส่งข้อความไปยัง LINE พร้อมข้อมูลผู้เข้ามาติดต่อ
            await sendMessageToLineGroup(groupId, visitorData);
            // ส่งข้อความไปยัง Telegram พร้อมข้อมูลผู้เข้ามาติดต่อ
            await sendMessageToTelegramGroup(telegramGroupId, visitorData);

            setLoading(false); // ซ่อน Loader

            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: data.message,
                confirmButtonText: 'ตกลง',
            }).then(() => {
                navigate('/visitor-guard/Welcome', {
                    state: {
                        name: visitorName,
                        time: new Date().toLocaleString('th-TH'),
                    },
                });
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: error.message,
                confirmButtonText: 'ตกลง',
            });
        }
    };


    return (
        <>

            <Container>

                <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                    <h4>ลงทะเบียนสำหรับบุคคลภายนอก</h4>
                    <h4>Registration for external visitors</h4>
                </div>
                <Panel scrollShadow style={{ position: 'relative' }} >
                    <div style={{ padding: '20px' }}>
                        {errorMessage && <Message type="error">{errorMessage}</Message>}
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <div className="form-group">
                                    <label style={{ marginBottom: '8px' }}>ชื่อ-นามสกุล/Full name</label>
                                    <Input
                                        placeholder="กรุณากรอกชื่อ-นามสกุล"
                                        style={{ marginBottom: '20px' }}
                                        value={visitorName}
                                        onChange={(value) => setVisitorName(value)}
                                    />
                                </div>
                            </Col>

                            <Col xs={24} sm={12}>
                                <div className="form-group">
                                    <label style={{ marginBottom: '8px' }}>เบอร์โทร/Tel</label>
                                    <Input
                                        type="tel"
                                        placeholder="กรุณากรอกเบอร์โทร"
                                        style={{ marginBottom: '20px' }}
                                        value={visitorPhone}
                                        onChange={(value) => {
                                            if (/^\d*$/.test(value)) {
                                                setVisitorPhone(value);
                                            }
                                        }}
                                    />
                                </div>
                            </Col>

                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <div className="form-group">
                                    <label style={{ marginBottom: '8px' }}>บริษัท/Company</label>
                                    <Input
                                        placeholder="กรุณากรอกชื่อบริษัท"
                                        style={{ marginBottom: '20px' }}
                                        value={companyName}
                                        onChange={(value) => setCompanyName(value)}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="form-group">
                                    <label style={{ marginBottom: '8px' }}>บุคคลที่ต้องติดต่อ/Contact Person</label>
                                    <Input
                                        placeholder="กรุณากรอกชื่อผู้ติดต่อ"
                                        style={{ marginBottom: '20px' }}
                                        value={contactPerson}
                                        onChange={(value) => setContactPerson(value)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <div className="form-group">
                                    <label style={{ marginBottom: '8px' }}>วัตถุประสงค์/Purpose</label>
                                    <SelectPicker
                                        data={purposeOptions}
                                        searchable={false}
                                        placeholder="กรุณาเลือกวัตถุประสงค์"
                                        style={{ width: '100%', marginBottom: '20px' }}
                                        onChange={(value) => setSelectedPurpose(value)}
                                        value={selectedPurpose}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="form-group">
                                    <label style={{ marginBottom: '8px' }}>เหตุผลที่มา/Purpose of visit</label>
                                    <Input
                                        as="textarea"
                                        placeholder="กรุณาอธิบายเหตุผล"
                                        style={{ resize: 'none', marginBottom: '20px' }}
                                        rows={3}
                                        value={reason}
                                        onChange={(value) => setReason(value)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Col xs={24} sm={12}>
                            <div className="form-group">
                                <label style={{ marginBottom: '8px' }}>เลขทะเบียนรถ/Vehicle registration number</label>
                                <Input
                                    placeholder="กรุณากรอกเลขทะเบียนรถ"
                                    style={{ marginBottom: '20px' }}
                                    value={vehicleRegistration}
                                    onChange={(value) => setVehicleRegistration(value)}
                                />
                            </div>
                        </Col>
                    </div>

                </Panel>
                <Panel>
                    <div style={{ marginBottom: '20px', maxHeight: '400px', overflowY: 'auto' }}>
                        <h4>ข้อกำหนดและเงื่อนไข / Terms and Conditions</h4>
                        <ul>
                            <li>1. ผู้มาติดต่อให้ติดบัตรอนุญาตตลอดเวลา. / Visitors must wear a visitor badge at all times.</li>
                            <li>2. ผู้มาติดต่อเข้าพื้นที่ได้เฉพาะที่มีใบอนุญาตเท่านั้น. / Visitors are allowed access only to areas with permission.</li>
                            <li>3. ผู้มาติดต่อต้องปฏิบัติตามกฎความปลอดภัยที่บริษัทกำหนดอย่างเคร่งครัด. / Visitors must strictly adhere to the company's safety regulations.</li>
                            <li>4. ผู้มาติดต่อยินยอมให้บันทึกข้อมูลส่วนบุคคล. / Visitors consent to the recording of personal information.</li>
                        </ul>
                        <Checkbox
                            checked={acceptedTerms}
                            onChange={() => setAcceptedTerms(!acceptedTerms)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                        <span style={{ fontWeight: 'bold' }}> {/* ขนาดข้อความใน span */}
                            เพื่อใช้ตามวัตถุประสงค์ที่บริษัทได้ประกาศไว้เกี่ยวกับด้านความปลอดภัย. / For the purposes declared by the company regarding safety.
                        </span>
                    </div>




                    <Button
                        appearance="primary"
                        style={{
                            marginTop: '40px',
                            bottom: '20px',
                            left: '20px',
                            right: '20px',
                            width: 'calc(100% - 40px)',
                            display: 'block',
                        }}
                        disabled={!acceptedTerms}
                        onClick={handleSubmit}
                    >
                        ตกลงและยอมรับตามเงื่อนไข
                        {loading && <Loader backdrop content="loading..." />}
                    </Button>
                </Panel>
            </Container >
        </>
    );
};

export default VisitorForm;
