import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
// import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Modal from 'react-modal'; // Import Modal



// Set the app element for accessibility
Modal.setAppElement('#root');

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);