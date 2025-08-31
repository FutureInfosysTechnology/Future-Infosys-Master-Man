import React, { useEffect, useState } from "react";
import './login.css';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";


function NewLogin() {

    const [login, setLogin] = useState({ userName: '', password: '' });
    const navigate = useNavigate();


    useEffect(() => {
        const container = document.getElementById('container');
        const overlayBtn = document.getElementById('overlayBtn');

        const handleOverlayClick = () => {
            container.classList.toggle('right-panel-active');
            overlayBtn.classList.remove('btnScaled');
            window.requestAnimationFrame(() => {
                overlayBtn.classList.add('btnScaled');
            });
        };
        overlayBtn.addEventListener('click', handleOverlayClick);
        return () => {
            overlayBtn.removeEventListener('click', handleOverlayClick);
        };
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLogin(prevState => ({ ...prevState, [name]: value }));
    };

    const handleNavigation = () => {
        navigate('/signup');
    };

    const handleSaveLogin = async (e) => {
        e.preventDefault();
        const { userName, password } = login;
        if (!userName || !password) {
            Swal.fire('Error', 'Username and Password are required', 'error');
            return;
        }
        try {
            const response = await getApi(`/Master/UserLogin?UserName=${encodeURIComponent(userName)}&Password=${encodeURIComponent(password)}`);
            if (response.status === 1) {
                Swal.fire('Success', 'Login successful!', 'success');
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login Error:', err);
            Swal.fire('Error', 'Invalid username or password. Please try again.', 'error');
        }
    };


    return (
        <div className="login-body">
            <div className="login-container" id="container">
                <div className="form-container sign-up-container">
                    <form action="#" className="login-form">
                        <h1>Create Account</h1>

                        <span className="login-span">or use your email for registration </span>
                        <div className="infield">
                            <label htmlFor="">Full Name</label>
                            <input className="login-input" type="text" placeholder="Full Name" />
                            <label className="login-label" htmlFor=""></label>
                        </div>

                        <div className="infield">
                            <label htmlFor="">Email</label>
                            <input className="login-input" type="email" placeholder="Email" />
                            <label className="login-label" htmlFor=""></label>
                        </div>

                        <div className="infield">
                            <label htmlFor="">Password</label>
                            <input className="login-input" type="password" placeholder="Password" />
                            <label className="login-label" htmlFor=""></label>
                        </div>
                        <button className="login-button">Sign Up</button>

                        <div className="social-container">
                            <a href="#" className="social">
                                <i className="bi bi-facebook" style={{ color: "blue" }}></i>
                            </a>

                            <a href="#" className="social">
                                <i className="bi bi-google" style={{ color: "orange" }}></i>
                            </a>

                            <a href="#" className="social">
                                <i className="bi bi-linkedin" style={{ color: "blue" }}></i>
                            </a>
                        </div>
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form action="#" className="login-form" onSubmit={handleSaveLogin}>
                        <h1>Sign In</h1>

                        <span className="login-span">or use your email for registration </span>

                        <div className="infield">
                            <label htmlFor="">User Name</label>
                            <input className="login-input" type="text" name="userName"
                                value={login.userName}
                                onChange={handleInputChange}
                                placeholder="Username" />
                            <label className="login-label" htmlFor=""></label>
                        </div>

                        <div className="infield">
                            <label htmlFor="">Password</label>
                            <input className="login-input" type="password"
                                name="password"
                                value={login.password}
                                onChange={handleInputChange}
                                placeholder="Password" />
                            <label className="login-label" htmlFor=""></label>
                        </div>

                        <a href="#" className="forgot" style={{ fontSize: "12px" }}>Forgot password?</a>
                        <button className="login-button">Sign In</button>

                        <div className="bottom-div">
                            <a href="#" className="forgot">Don't have an account? Create new account</a>
                            <button className="login-button" onClick={handleNavigation}> Sign Up</button>
                        </div>

                        <div className="social-container">
                            <a href="#" className="social">
                                <i className="bi bi-facebook" style={{ color: "blue" }}></i>
                            </a>

                            <a href="#" className="social">
                                <i className="bi bi-google" style={{ color: "orange" }}></i>
                            </a>

                            <a href="#" className="social">
                                <i className="bi bi-linkedin" style={{ color: "blue" }}></i>
                            </a>
                        </div>
                    </form>
                </div>

                <div className="overlay-container" id="overlayCon">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            {/* <h1>Welcome Back!</h1> */}
                            {/* <p>To keep connected with us please login with your personal info</p> */}
                            <button className="login-button">Sign In</button>
                        </div>

                        <div className="overlay-panel overlay-right">
                            <button className="login-button">Sign Up</button>
                        </div>
                    </div>

                    <button className="login-button" id="overlayBtn"></button>

                </div>
            </div>
        </div>
    )
}

export default NewLogin;