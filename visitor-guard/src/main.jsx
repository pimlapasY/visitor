import React from 'react';
import ReactDOM from 'react-dom/client';
import MainRouter from './MainRouter'; // Make sure to import the router component
import './index.css'; // Your global styles
import 'rsuite/dist/rsuite.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>
);
