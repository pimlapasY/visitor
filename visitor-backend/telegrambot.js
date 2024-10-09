const TelegramBot = require('node-telegram-bot-api');

// ใส่ Token ของ Bot ที่คุณได้รับจาก BotFather
const token = '8011104782:AAH787pvlSVPH5bj1kdQsC32cUyDEMy0sb8';
const bot = new TelegramBot(token);

// ฟังก์ชันเพื่อการตั้งค่า Webhook
const setupTelegramBot = (app) => {
    // ตั้ง Webhook URL ของ Bot
    const webhookUrl = 'https://visitor.system-samt.com/api/webhook'; // เปลี่ยน URL ให้ตรงกับ server ของคุณ
    bot.setWebHook(webhookUrl);

    // รับข้อความจาก Webhook
    app.post('/api/webhook', (req, res) => {
        /* if (req.body.message) {
            const chatId = req.body.message.chat.id;
            // ส่ง ID ของกลุ่มกลับไปในกลุ่ม
            bot.sendMessage(chatId, `Group ID ของคุณคือ: ${chatId}`);
        } */
        // ตอบกลับให้ Telegram ว่ารับข้อมูลแล้ว
        res.sendStatus(200);
    });
};

// ส่งออกฟังก์ชันเพื่อให้สามารถนำไปใช้ใน server.js
module.exports = setupTelegramBot;
