import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Input, Badge } from 'rsuite';
import axios from 'axios';
import './App.css';
import DetailModal from './DetailModal';
import VisitorForm from './VisitorForm'; // Import VisitorForm
import Swal from 'sweetalert2';
const { Column, HeaderCell, Cell } = Table;

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // เปลี่ยน title ของหน้า
    document.title = "ข้อมูลผู้มาติดต่อ สำหรับ รปภ.";

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

    const matchesVehicleRegistration = item.vehicleRegistration
      ? item.vehicleRegistration.toLowerCase().includes(searchTermLower)
      : false;

    const matchesName = item.name
      ? item.name.toLowerCase().includes(searchTermLower)
      : false;

    const matchesCompany = item.companyName
      ? item.companyName.toLowerCase().includes(searchTermLower)
      : false;

    return matchesVehicleRegistration || matchesName || matchesCompany;
  });



  return (
    <>

      <div style={{ marginBottom: '20px', marginTop: '50px', alignItems: 'center', display: 'flex', flexDirection: 'column' }} >
        <h3>ข้อมูลผู้มาติดต่อ สำหรับ รปภ.</h3>
        <Input
          placeholder="ค้นหาโดย ทะเบียนรถ บริษัท ชื่อผู้ติดต่อ"
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
          style={{ width: '300px', marginBottom: '20px' }}
        />
      </div>

      <Table
        autoHeight
        style={{ width: '100%', cursor: 'pointer', }}
        data={filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
        onRowClick={(rowData) => handleOpen(rowData)} // Open modal on row click
      >
        <Column align="center" width={20}>
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
          <HeaderCell>ชื่อบริษัท</HeaderCell>
          <Cell dataKey="companyName" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>ติดต่อ</HeaderCell>
          <Cell dataKey="toVisit" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>เลขทะเบียนรถ</HeaderCell>
          <Cell dataKey="vehicleRegistration" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>เวลาเข้า</HeaderCell>
          <Cell dataKey="dateTimeIn" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>เวลาออก</HeaderCell>
          <Cell>
            {(rowData) => {
              if (rowData.timeOut === null && rowData.user != null) {
                return (
                  <Badge color="blue" content="รอออก" />
                );
              } else if (rowData.user === null) {
                return (
                  <Badge color="orange" content="รอยืนยัน" />
                );
              } else {
                return <span>{rowData.timeOut}</span>; // Use a span for better styling control
              }
            }}
          </Cell>
        </Column>


      </Table >

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
          <DetailModal
            open={modalOpen}
            handleClose={handleClose}
            visitor={selectedVisitor}
            afterUpdate={fetchData}
          />
        )
      }
    </>
  );
}

export default App;
