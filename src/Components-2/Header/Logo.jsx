import React from "react";
import './Logo.css';
import '../Dashboard/Mainstyle.css';
import futurelogo from '../../Assets/Images/logo-img.png';

function Logo() {
    const handleToggleSidebar = () => {
        document.body.classList.toggle('toggle-sidebar');
    }
    return (
        <div className="d-flex align-items-center justify-content-between">
            <i className="bi bi-list toggle-sidebar-btn"
                id="toggle-btn"
                onClick={handleToggleSidebar}></i>
            <a href="/" className="logo d-flex align-items-center" style={{ textDecoration: "none" }}>
            <img src={futurelogo} className="logo-img" alt="" />
            </a>

            

        </div>
    )
}

export default Logo;