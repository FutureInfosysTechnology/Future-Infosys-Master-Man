import React from "react";
import '../Dashboard/Mainstyle.css';
import './Header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts//remixicon.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Logo from "./Logo";
import Searchbar from "./Searchbar";
import Nav from "./Nav";

function Header() {
    return (
        <header id="header" className="header fixed-top d-flex align-items-center justify-content-between g-10">
            <Logo />
            <div className="credit-box" style={{display:"flex",gap:"20px",justifyContent:"center",fontSize:"15px",fontWeight:"bold"}}>
                <span style={{background:"red",padding:"5px"}}>Available Credit Limit : 100000</span>
                <span style={{background:"red",padding:"5px"}}>Balance : 100000</span>
            </div>
            <Searchbar />
            <Nav />
        </header>
    )
};


export default Header;