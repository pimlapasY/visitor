import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Input, Badge, Header, Navbar, Nav } from 'rsuite';
import axios from 'axios';
import DashboardDetails from './DashboardDetails';
import Swal from 'sweetalert2';
import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const { Column, HeaderCell, Cell } = Table;

const AdminDashboard = () => {
    const navigate = useNavigate(); // Initialize navigate
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');

    useEffect(() => {
        if (!username || !name) {
            console.log('Username or name not found in localStorage. Redirecting...');
            // Redirect ไปหน้า login
            navigate('/visitor-guard/login');
        }
    }, [username, name, navigate]);

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // เปลี่ยน title ของหน้า
        document.title = "ข้อมูลผู้มาติดต่อบริษัท";

        // เปลี่ยน Favicon
        const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
        favicon.rel = 'icon';
        //favicon.href = '/path/to/login-favicon.ico'; // แก้ไขให้เป็น path ของ favicon สำหรับหน้านี้
        document.head.appendChild(favicon);

        // Cleanup function เมื่อ component ถูก unmount
    }, []);

    const fetchData = () => {
        axios
            .get('https://visitor.system-samt.com/api/visitor')
            .then((response) => {
                const result = response.data;
                setData(result);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleOpen = (visitor) => {
        setSelectedVisitor(visitor);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setSelectedVisitor(null);
    };

    const filteredData = data.filter((item) => {
        const searchTermLower = searchTerm.toLowerCase();

        const matchesPhoneNumber = item.phone // ใช้ฟิลด์เบอร์โทร
            ? item.phone.toLowerCase().includes(searchTermLower)
            : false;

        const matchesName = item.name
            ? item.name.toLowerCase().includes(searchTermLower)
            : false;

        const matchesCompany = item.companyName
            ? item.companyName.toLowerCase().includes(searchTermLower)
            : false;

        return matchesPhoneNumber || matchesName || matchesCompany;
    });

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

    const exportToCSV = () => {
        const csvData = filteredData.map((row) => {


            return {
                ชื่อ: row.name,
                บริษัท: row.companyName,
                ติดต่อ: row.toVisit,
                เบอร์โทร: row.phone ? `'${row.phone}` : '', // เพิ่ม apostrophe
                เวลาเข้า: row.dateTimeIn,
                เวลาออก: row.timeOut,
                รับทราบ: row.user === null ? 'รอยืนยัน' : row.user,
            };
        });

        const csvRows = [
            Object.keys(csvData[0]).join(','), // headers
            ...csvData.map(row => Object.values(row).join(',')) // values
        ].join('\n');

        // Add BOM for UTF-8
        const blob = new Blob(['\uFEFF' + csvRows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'visitor_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    {username == '6703425' ?
                        <Nav>
                            <Nav.Item
                                as={Link} // Use Link component
                                to="/visitor-guard/LineAdmin" // Set the destination path
                                style={{ fontSize: '18px', whiteSpace: 'nowrap' }}
                            >
                                Line Send
                            </Nav.Item>
                        </Nav>
                        : ''}
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

            <div style={{ marginBottom: '20px', marginTop: '50px', alignItems: 'center', display: 'flex', flexDirection: 'column' }} >
                <h2>ข้อมูลผู้มาติดต่อ จากภายนอก</h2><br />
                <Input
                    placeholder="ค้นหาโดย บริษัท ชื่อผู้ติดต่อ เบอร์โทร"
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                    style={{ width: '300px', marginBottom: '20px' }}
                />
                <Button appearance="primary" onClick={exportToCSV} style={{ marginBottom: '20px' }}>
                    Export to CSV
                </Button>
            </div>

            <Table
                autoHeight
                style={{ width: '100%', cursor: 'pointer', fontSize: '16px' }}
                data={filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
                onRowClick={(rowData) => handleOpen(rowData)} // Open modal on row click
            >
                <Column align="center" flexGrow={1}>
                    <HeaderCell>#</HeaderCell>
                    <Cell>
                        {(rowData, rowIndex) => (page - 1) * rowsPerPage + rowIndex + 1}
                    </Cell>
                </Column>

                <Column flexGrow={1}>
                    <HeaderCell>ชื่อ</HeaderCell>
                    <Cell style={{ color: 'blue' }} dataKey="name" />
                </Column>
                <Column flexGrow={1}>
                    <HeaderCell>บริษัท</HeaderCell>
                    <Cell dataKey="companyName" />
                </Column>

                <Column flexGrow={1}>
                    <HeaderCell>ติดต่อ</HeaderCell>
                    <Cell dataKey="toVisit" />
                </Column>

                <Column flexGrow={1}>
                    <HeaderCell>เบอร์โทร</HeaderCell>
                    <Cell dataKey="phone" />
                </Column>

                <Column flexGrow={1}>
                    <HeaderCell>เวลาเข้า</HeaderCell>
                    <Cell dataKey="dateTimeIn" />
                </Column>

                <Column flexGrow={1}>
                    <HeaderCell>เวลาออก</HeaderCell>
                    <Cell dataKey="timeOut" />
                </Column>

                <Column flexGrow={1} align="center">
                    <HeaderCell>รับทราบ</HeaderCell>
                    <Cell>
                        {(rowData) => {
                            if (rowData.user === null) {
                                return (
                                    <Badge color="orange" content="รอยืนยัน" />
                                );
                            } else {
                                return <Badge style={{ whiteSpace: 'nowrap' }} color="green" content={rowData.user} />;
                            }
                        }}
                    </Cell>
                </Column>
            </Table>

            <Pagination
                style={{ margin: '20px' }}
                total={filteredData.length}
                limit={rowsPerPage}
                activePage={page}
                onChangePage={handleChangePage}
                onChangeLimit={(value) => setRowsPerPage(value)}
                layout={['total', 'pager', 'limit']}
                limitOptions={[10, 20, 30]}
            />

            {
                selectedVisitor && (
                    <DashboardDetails
                        open={modalOpen}
                        handleClose={handleClose}
                        visitor={selectedVisitor}
                        afterUpdate={fetchData}
                    />
                )
            }
        </>
    );
};

export default AdminDashboard;
