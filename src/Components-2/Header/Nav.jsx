import React from "react";
import './nav.css';
import '../Dashboard/Mainstyle.css';
import Navnotice from "./Navnotice";
import Navmessage from "./Navmessage";
import Navavtar from "./Navavtar";


function Nav() {
    const BranchName = JSON.parse(localStorage.getItem("Login"))?.Branch_Name;
    return (
        <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
                <div style={{color:"black",fontWeight:"bold",fontSize:"12px",marginRight:"10px"}}>BRANCH : {BranchName}</div>
                <Navnotice />
                <Navmessage />
                <Navavtar />
            </ul>

        </nav>
    )
}

export default Nav;