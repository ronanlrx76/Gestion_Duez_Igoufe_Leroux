import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';         // Ton App.jsx avec routes et Navbar
import './index.css';            // Tailwind + styles globaux

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
