import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import './Welcome.css'; // Add custom styles here
import { Button } from 'rsuite';

const Welcome = () => {
    const location = useLocation(); // Access the location object
    const navigate = useNavigate(); // Initialize navigate

    // Extract name and time from location state
    const name = location.state?.name || 'Unknown';
    const time = location.state?.time || 'Not available';

    return (
        <div className="welcome-container">
            {/* Animation for the heading */}
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="welcome-title"
            >
                ยินดีต้อนรับ
            </motion.h1>

            {/* Display visitor's name and time */}
            <div className="visitor-item">
                <p>ลงทะเบียนสำเร็จ!</p>
                <p>คุณ {name}</p>
                <p>{time}</p>
                <br></br>
            </div>

            {/* Animation for the subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                className="welcome-subtitle"
            >
                SHIPPO ASAHI MOULDS (THAILAND)
            </motion.p>

            {/* Button with animation */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 1 }}
            >
                <Button
                    className="start-button"
                    onClick={() => navigate('/visitor-guard/Form')} // Navigate to the Form route
                >
                    กลับหน้าลงทะเบียน
                </Button>
            </motion.div>
        </div>
    );
};

export default Welcome;
