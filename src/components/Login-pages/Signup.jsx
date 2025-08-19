import React from "react";
import './signup.css';
import { useNavigate } from "react-router-dom";



function Signup() {

    const navigate = useNavigate();

    const handleNavigation=()=>{
        navigate('/');
    };

    return (
        <>

            <div className="signup-body">
                <div className="signup-container">
                    <div className="form-container1 sign-up-container1">
                        <form action="#" className="login-form">
                            <h1>Create Account</h1>
                            <div className="social-container">
                                <a href="#" className="social">
                                    <i className="bi bi-facebook" style={{color:"blue"}}></i>
                                </a>

                                <a href="#" className="social">
                                    <i className="bi bi-google" style={{color:"orange"}}></i>
                                </a>

                                <a href="#" className="social">
                                    <i className="bi bi-linkedin" style={{color:"blue"}}></i>
                                </a>
                            </div>

                            <span className="login-span">or use your email for registration </span>
                            <div className="infield">
                                <input className="login-input" type="text" placeholder="Name" />
                                <label className="login-label" htmlFor=""></label>
                            </div>

                            <div className="infield">
                                <input className="login-input" type="email" placeholder="Email" />
                                <label className="login-label" htmlFor=""></label>
                            </div>

                            <div className="infield">
                                <input className="login-input" type="password" placeholder="Password" />
                                <label className="login-label" htmlFor=""></label>
                            </div>
                            <button className="sign-button">Sign Up</button>


                            <div className="bottom-div">
                                <a href="#" className="forgot">Already have an account.</a>
                                <button className="sign-button" onClick={handleNavigation}> Sign In</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Signup;