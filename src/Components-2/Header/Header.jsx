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
        <header id="header" className="header fixed-top d-flex align-items-center">
            <Logo/>
            <Searchbar/>
            <Nav/>
        </header>
    )
};


export default Header;