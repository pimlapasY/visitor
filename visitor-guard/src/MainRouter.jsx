import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VisitorForm from './VisitorForm'; // Import the VisitorForm component
import App from './App'; // Import the main App component
import Welcome from './Welcome'; // Import the Welcome component
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import LineSendMessange from './LineSendMessange';
import LineNotify from './LineNotify';
const MainRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Welcome page route */}
                <Route path="/visitor-guard/Welcome" element={<Welcome />} />

                {/* Visitor Form route */}
                <Route path="/visitor-guard/Form" element={<VisitorForm />} />

                {/* Main App route */}
                <Route path="/visitor-guard" element={<App />} />
                <Route path="/visitor-guard/login" element={<Login />} />
                <Route path="/visitor-guard/dashboard" element={<AdminDashboard />} />
                <Route path="/visitor-guard/LineAdmin" element={<LineSendMessange />} />
                <Route path="/visitor-guard/LineNotify" element={<LineNotify />} />
            </Routes>
        </Router>
    );
};

export default MainRouter;
