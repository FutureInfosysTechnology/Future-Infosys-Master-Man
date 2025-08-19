import React from "react";
import { useNavigate } from "react-router-dom";



function SignOut() {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    };

    return (
        <>
            <div className="body">
                <div className="container" style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex"
                }}>
                    <div className="box" style={{
                        height: "200px",
                        width: "350px",
                        boxShadow: "2px 2px 2px #aaa",
                        border: "1px solid #4FD1C5",
                        borderRadius: "5px",
                        padding: "20px",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <h1 style={{ fontSize: "22px", fontWeight: "600" }}>Logout Successful</h1>
                        <p style={{ fontSize: "16px" }}>You have been successfully logged out.</p>
                        <span style={{ color: "blue", cursor:"pointer" }} onClick={handleClick}>Back to Login</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignOut;