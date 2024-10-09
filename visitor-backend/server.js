const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const db = require('./db'); // Import the database connection
const jwt = require('jsonwebtoken');
const setupTelegramBot = require('./telegrambot'); // Import the setup function


const app = express();
const LINE_CHANNEL_ACCESS_TOKEN = 'LWYLeMFO1QdwImd0AYbrgVVsypakOfhpxITTyfYdScN5NFIy4HnCNpUCr38lOiuEiRb0xlyim3n7AXFm/u69ADxrqMEPFRfeIIrMxEkjM48LeMi9xz6kjDnxqNb0oe1fRHNzk45i+BiY7JHHMO0x9gdB04t89/1O/w1cDnyilFU=';
const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';

app.use(bodyParser.urlencoded({ extended: true }));


app.use(bodyParser.json()); // Parse incoming JSON requests

// ตั้งค่า Telegram Bot
setupTelegramBot(app); // เรียกใช้ฟังก์ชันการตั้งค่า

// สร้าง Endpoint สำหรับส่งข้อความไปยังทุกกลุ่ม
app.post('/api/send-to-all', async (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.status(400).json({ error: 'ข้อความไม่สามารถเป็นค่าว่างได้' });
    }

    try {
        // รายชื่อ groupId ที่บอทเข้าร่วม (เก็บไว้ในตัวแปร)
        const groupIds = ['C627116cbe6564839ed6d036568e116cd', 'C6e145dbd339fd35d70e9db15cd972757', 'C799d938010665673df14809a3318b266'
            , 'Cfa2b6d33aed1d234d3c3a532a1c762d1', 'C2f416f38bf38fb7ace35202e79754bcd'
        ]; // ตัวอย่าง groupId

        // ส่งข้อความไปยังทุกกลุ่ม
        for (const groupId of groupIds) {
            await sendMessageToGroup(groupId, message);
        }

        res.status(200).json({ message: 'ส่งข้อความไปยังทุกกลุ่มสำเร็จ' });
    } catch (error) {
        console.error('Error sending message to groups:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการส่งข้อความ' });
    }
});

//notify
const sendLineNotify = async (message) => {
    const token = 'OTvdMta2V3hcJxLlplWiUGD2g6fOkCxvS54rOCeBGAX'; // Token ของคุณที่นี่
    try {
        const response = await axios.post('https://notify-api.line.me/api/notify',
            new URLSearchParams({ message }), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
        );
        return response;
    } catch (error) {
        throw new Error('Error sending message to LINE Notify');
    }
};

app.post('/send-message', async (req, res) => {
    const message = 'test'

    if (!message) {
        return res.status(400).send('กรุณาใส่ข้อความที่จะส่ง');
    }

    try {
        const response = await sendLineNotify(message);
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('เกิดข้อผิดพลาดในการส่งข้อความ');
    }
});


app.post('/webhook', (req, res) => {
    const events = req.body.events;

    events.forEach(event => {
        if (event.type === 'join') {
            const groupId = event.source.groupId;

            // ส่งข้อความเพื่อแสดง groupId กลับไปที่กลุ่ม
            const message = {
                type: 'text',
                text: `Group ID: ${groupId}`
            };

            // ฟังก์ชันส่งข้อความไปยัง LINE API
            replyMessage(event.replyToken, message);
        }
        // ตรวจสอบว่าเป็นข้อความจากสมาชิกในกลุ่ม
        if (event.type === 'message' && event.message.type === 'text') {
            // เพิ่มเงื่อนไขเพื่อไม่ให้ตอบกลับข้อความจากสมาชิก
            if (event.source.type === 'group') {
                // ไม่ต้องทำอะไร หรือสามารถแสดงข้อความว่าไม่ตอบกลับ
                console.log('Received message from group member, not replying.');
                return;
            }
        }
    });


    res.sendStatus(200);
});

// ฟังก์ชันสำหรับส่งข้อความกลับไปที่ LINE
function replyMessage(replyToken, message) {
    const axios = require('axios');

    axios.post('https://api.line.me/v2/bot/message/reply', {
        replyToken: replyToken,
        messages: [message]
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
        }
    })
        .then(response => {
            console.log('Message sent!');
        })
        .catch(err => {
            console.error('Error sending message:', err);
        });
}


app.post('/api/line-message', async (req, res) => {
    try {
        const { groupId, message } = req.body;

        if (!groupId || !message) {
            return res.status(400).json({ error: 'groupId and message are required' });
        }

        // ตัวอย่างการส่งข้อความไปยัง LINE
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                to: groupId,
                messages: [{ type: 'text', text: message }],
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message to LINE');
        }

        const data = await response.json();
        res.status(200).json({ message: 'Message sent successfully', data });
    } catch (error) {
        console.error('Error in line-message endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// PUT: Update user for a specific visitor
app.put('/api/visitor/:id/user', async (req, res) => {
    const visitorId = req.params.id;
    const { user } = req.body; // รับค่าผู้ใช้จาก body

    // ตรวจสอบว่าผู้ใช้ส่งข้อมูลมาหรือไม่
    if (!user) {
        return res.status(400).json({ message: 'กรุณาให้ชื่อผู้ใช้' }); // แจ้งเตือนหากไม่มีชื่อผู้ใช้
    }

    try {
        const [result] = await db.promise().query(
            'UPDATE visitor SET user = ? WHERE num = ?',
            [user, visitorId]
        );

        // ตรวจสอบว่าการอัปเดตสำเร็จ
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบผู้เยี่ยมชม หรืออัปเดตแล้ว' });
        }

        // ส่งการตอบสนองสำเร็จ
        res.json({
            message: 'อัปเดตชื่อผู้ใช้เรียบร้อยแล้ว'
        });
    } catch (err) {
        console.error('Error updating visitor user:', err);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดต' });
    }
});


// สร้าง API สำหรับการเข้าสู่ระบบ
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบว่าผู้ใช้ส่งข้อมูลมาครบหรือไม่
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide both username and password' });
    }

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        // ตรวจสอบว่าพบผู้ใช้หรือไม่
        if (results.length === 0) {
            return res.status(404).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        // สร้าง JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, 'samt_secret_manage', {
            expiresIn: '1h' // token หมดอายุใน 1 ชั่วโมง
        });

        return res.status(200).json({
            message: 'Login successful',
            token: token,
            username: user.username, // ส่ง username กลับไป
            name: user.name // สมมุติว่ามีฟิลด์ชื่อว่า 'name'
        });
    });
});

app.get('/api/visitor', (req, res) => {
    db.query('SELECT * FROM visitor ORDER BY timeout IS NOT NULL, DATETIMEIN DESC LIMIT 150', (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ message: 'An error occurred while fetching data.' });
        }

        const formattedResults = results.map(visitor => {
            let aimgroupThai;

            // ตรวจสอบค่า aimgroup และกำหนดค่าเป็นภาษาไทย
            switch (visitor.aimgroup) {
                case 'group_A':
                    aimgroupThai = 'จัดซื้อ/สโตร์';
                    break;
                case 'group_D':
                    aimgroupThai = 'Sales รับ/ส่งงานลูกค้า';
                    break;
                case 'group_Z':
                    aimgroupThai = 'อื่นๆ/ออฟฟิศ';
                    break;
                default:
                    aimgroupThai = 'ไม่ระบุ'; // ค่าที่ไม่ตรงกับกลุ่มใด ๆ
            }

            return {
                id: visitor.num,
                name: visitor.Name,
                phone: visitor.Phone,
                companyName: visitor.companyName,
                aimgroup: aimgroupThai, // ใช้ค่าที่แปลแล้ว
                aim: visitor.aim,
                toVisit: visitor.tovisit,
                vehicleRegistration: visitor.VEHICLEREGISTRATION,
                dateTimeIn: new Date(visitor.DATETIMEIN).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false }),
                timeOut: visitor.timeout ? new Date(visitor.timeout).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false }) : null,
                securityGuardName: visitor.seurityguardname,
                upToDate: new Date(visitor.uptodate).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false }),
                img: visitor.img,
                rule: visitor.rule,
                state: visitor.state,
                note: visitor.note,
                notify: visitor.notify,
                user: visitor.user
            };
        });
        res.json(formattedResults);
    });
});

// PUT: Update timeout for a specific visitor
app.put('/api/visitor/:id/timeout', async (req, res) => {
    const visitorId = req.params.id;
    const currentTime = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'); // Get current time in Asia/Bangkok timezone

    try {
        const [result] = await db.promise().query(
            'UPDATE visitor SET timeout = ? WHERE num = ?',
            [currentTime, visitorId]
        );

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Visitor not found or timeout already updated.' });
        }

        // Send success response
        res.json({
            message: 'Timeout updated successfully',
            timeout: currentTime
        });
    } catch (err) {
        console.error('Error updating timeout:', err);
        return res.status(500).json({ message: 'An error occurred while updating timeout.' });
    }
});

// DELETE: Remove a specific visitor
app.delete('/api/visitor/:id', async (req, res) => {
    const visitorId = req.params.id;

    try {
        const [result] = await db.promise().query(
            'DELETE FROM visitor WHERE num = ?',
            [visitorId]
        );

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Visitor not found.' });
        }

        // Send success response
        res.json({ message: 'Visitor deleted successfully.' });
    } catch (err) {
        console.error('Error deleting visitor:', err);
        return res.status(500).json({ message: 'An error occurred while deleting the visitor.' });
    }
});
// POST: Create a new visitor
app.post('/api/visitor', async (req, res) => {
    const { name, phone, companyName, purpose, vehicleRegistration, contactPerson, reason } = req.body; // Extract data from request body

    // Validate required fields
    if (!name || !phone || !companyName || !purpose || !vehicleRegistration || !contactPerson) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }); // Alert if any required field is missing
    }

    try {
        const [result] = await db.promise().query(
            `INSERT INTO visitor (Name, Phone, companyName, aimgroup, aim, VEHICLEREGISTRATION, tovisit, DATETIMEIN, rule) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`, // Insert current time with NOW() and rule = 1
            [name, phone, companyName, purpose, reason, vehicleRegistration, contactPerson, 1] // Set rule to 1
        );

        // Send success response
        res.status(201).json({
            message: 'เพิ่มข้อมูลผู้เยี่ยมชมสำเร็จ',
            visitorId: result.insertId // Return the ID of the newly created visitor
        });
    } catch (err) {
        console.error('Error creating visitor:', err);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้เยี่ยมชม' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
