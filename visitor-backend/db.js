// db.js
const mysql = require('mysql2');

// สร้างการเชื่อมต่อกับฐานข้อมูล
const connection = mysql.createConnection({
    host: '27.254.134.24',   // ชื่อโฮสต์ฐานข้อมูล
    user: 'system_visitor',        // ชื่อผู้ใช้ฐานข้อมูล
    password: 'samtadmin12', // รหัสผ่านฐานข้อมูล
    database: 'system_visitor' // ชื่อฐานข้อมูล
});


// เชื่อมต่อกับฐานข้อมูล
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;