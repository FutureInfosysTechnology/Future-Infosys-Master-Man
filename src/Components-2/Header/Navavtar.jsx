import React from "react";
import profileImg from '../../Assets/Images/person.png';
import '../Dashboard/Mainstyle.css';
import './nav.css';
import { useNavigate } from "react-router-dom";


function Navavtar() {


    const navigate = useNavigate();

    const handleSignOut = () => {
        // Perform sign-out logic (e.g., clearing tokens)
        localStorage.removeItem('token');

        navigate('/login');
    }

    const handleProfile = () => {
        navigate('/profile')
    }
    return (
        <li className="nav-item dropdown pe-3">
            <a href="#" className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                <img src={profileImg} alt="Profile" className="rounded-circle" />
                <span className="d-none d-md-block dropdown-toggle ps-2">Vivek Singh</span>
            </a>

            <ul style={{ position: "fixed", right: "0%" }} className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header" style={{ display: "flex", flexDirection: "row" }}>
                    <div className="box" style={{ marginRight: "15px" }}>
                        <img style={{ height: "40px", width: "40px" }} src={profileImg} alt="" />
                    </div>
                    <div className="box2" style={{ display: "flex", flexDirection: "column" }}>
                        <h6>Vivek Singh</h6>
                        <span>Web Developer</span>
                    </div>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li>
                    <a href="" className="dropdown-item d-flex align-items-center">
                        <i className="bi bi-person"></i>
                        <span onClick={handleProfile}>My Profile</span>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li>
                    <a href="" className="dropdown-item d-flex align-items-center">
                        <i className="bi bi-gear"></i>
                        <span>Account Settings</span>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li>
                    <a href="" className="dropdown-item d-flex align-items-center">
                        <i className="bi bi-question-circle"></i>
                        <span>Need Help?</span>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>
                <li>
                    <a href="#" className="dropdown-item d-flex align-items-center">
                        <i className="bi bi-box-arrow-right"></i>
                        <span onClick={handleSignOut}>Sign Out</span>
                    </a>
                </li>

            </ul>
        </li>
    )
}

export default Navavtar;