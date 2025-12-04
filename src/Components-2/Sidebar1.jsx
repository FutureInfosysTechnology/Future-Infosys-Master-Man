import React, { useState } from "react";
import './Sidebar1.css';
import { Link } from 'react-router-dom';


function Sidebar1() {
    const [openMenu, setOpenMenu] = useState(null); // Track which menu is open
    const sideToggle = () => {
    if (document.body.classList.contains("toggle-sidebar")) {
      document.body.classList.add("closing-sidebar");
      setTimeout(() => {
        document.body.classList.remove("toggle-sidebar", "closing-sidebar");
      }, 300);
    }
  };
    const toggleMenu = (menuId) => {
        setOpenMenu(openMenu === menuId ? null : menuId); // Toggle or close the menu
    };
    const show=JSON.parse(localStorage.getItem("Login"));


    return (
        <aside id="sidebar1" className="sidebar1">
            <ul className="sidebar1-nav" id="sidebar1-nav">
                <li className="nav-item" onClick={sideToggle}>
                    <Link to="/dashboard" className="nav-link">
                        <i className="bi bi-grid"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>

                {show?.UserType=="Admin" &&
                <li className="nav-item">
                    <a href="#" className="nav-link collapsed"
                        onClick={() => toggleMenu('adminMaster')}>
                        <i className="bi bi-person"></i>
                        <span>Admin Master</span>
                        <i className={`bi ${openMenu === 'adminMaster' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
                    </a>

                    <ul id="components-nav"
                        className={`nav-content collapse ${openMenu === 'adminMaster' ? 'show' : ''}`}>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/branchmaster">
                                <i className="bi bi-asterisk"></i>
                                <span>Branch Master</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/customerlist">
                                <i className="bi bi-file-person"></i>
                                <span>Customer List</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/customercharges">
                                <i className="bi bi-cash-coin"></i>
                                <span>Consignee List</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/citymaster" className="link">
                                <i className="bi bi-buildings-fill"></i>
                                <span>City Master</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link tab="a" to="/tab" className="link">
                                <i className="bi bi-stack"></i>
                                <span>Area Control</span>
                            </Link>
                        </li>

                        

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/vendormaster">
                                <i className="bi bi-badge-vr"></i>
                                <span>Vendor Master</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/vehiclemaster">
                                <i className="bi bi-truck"></i>
                                <span>Vehicle Details</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/inventory">
                                <i className="bi bi-cart"></i>
                                <span>Stock Details</span>
                            </Link>
                        </li>

                        {show?.StatusMaster===1 && <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/regionmaster">
                                <i className="bi bi-globe-americas"></i>
                                <span>Status Master</span>
                            </Link>
                        </li>}
                    </ul>

                </li>
                }

                <li className="nav-item">
                    <a href="#" className="nav-link collapsed"
                        onClick={() => toggleMenu('booking')}>
                        <i className="bi bi-menu-button-wide"></i>
                        <span>Operation Management</span>
                        <i className={`bi ${openMenu === 'booking' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
                    </a>

                    <ul id="components1-nav"
                        className={`nav-content collapse ${openMenu === 'booking' ? 'show' : ''}`}>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/dailybooking" className="link">
                                <i className="bi bi-stack"></i>
                                <span>Docket Booking</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/dailymanifest">
                                <i className="bi bi-cart3"></i>
                                <span>Outgoing Manifest</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/inscan">
                                <i className="bi bi-truck"></i>
                                <span>Inscan Process Hub</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/runsheet">
                                <i className="bi bi-layout-text-sidebar-reverse"></i>
                                <span>Delivery Run Sheet</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/statusactivity">
                                <i className="bi bi-ui-checks-grid"></i>
                                <span>Status Activity Entry</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/podentry">
                                <i className="bi bi-ui-checks"></i>
                                <span>Delivery Updation</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/custquery">
                                <i className="bi bi-person-raised-hand"></i>
                                <span>Customer Queries</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/internationalbooking">
                                <i className="bi bi-person-raised-hand"></i>
                                <span>International Booking</span>
                            </Link>
                        </li>

                        { show?.VendorBillEntry===1 && <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/vendorbill">
                                <i className="bi bi-person-raised-hand"></i>
                                <span>Vendor Bill Entry</span>
                            </Link>
                        </li>}
                    </ul>

                </li>


                <li className="nav-item">
                    <a href="#" className="nav-link collapsed"
                        onClick={() => toggleMenu('docket')}>
                        <i className="bi bi-printer-fill"></i>
                        <span>Docket Receipt</span>
                        <i className={`bi ${openMenu === 'docket' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
                    </a>

                    <ul id="components2-nav"
                        className={`nav-content collapse ${openMenu === 'docket' ? 'show' : ''}`}>
                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/docketprint" className="link">
                                <i className="bi bi-printer"></i>
                                <span>Docket Print</span>
                            </Link>
                        </li>                        
                    </ul>
                </li>


                <li className="nav-item">
                    <a href="#" className="nav-link collapsed"
                        onClick={() => toggleMenu('invoice')}>
                        <i className="bi bi-receipt-cutoff"></i>
                        <span>Invoice / Billing</span>
                        <i className={`bi ${openMenu === 'invoice' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
                    </a>

                    <ul id="components3-nav"
                        className={`nav-content collapse ${openMenu === 'invoice' ? 'show' : ''}`}>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/invoice" className="link">
                                <i className="bi bi-receipt-cutoff"></i>
                                <span>Invoice Generate</span>
                            </Link>
                        </li>
                    </ul>
                </li>

                <li className="nav-item">
                    <a href="#" className="nav-link collapsed"
                        onClick={() => toggleMenu('laiser')}>
                        <i className="bi bi-cash-coin"></i>
                        <span>Laiser / Payment</span>
                        <i className={`bi ${openMenu === 'laiser' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
                    </a>

                    <ul id="components4-nav"
                        className={`nav-content collapse ${openMenu === 'laiser' ? 'show' : ''}`}>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/laiser" className="link">
                                <i className="bi bi-cash-stack"></i>
                                <span>Laiser / Payment</span>
                            </Link>
                        </li>
                    </ul>
                </li>

                <li className="nav-item">
                    <a href="#" className="nav-link collapsed"
                        onClick={() => toggleMenu('reports')}>
                        <i className="bi bi-clipboard-data"></i>
                        <span>Reports</span>
                        <i className={`bi ${openMenu === 'reports' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
                    </a>

                    <ul id="components5-nav"
                        className={`nav-content collapse ${openMenu === 'reports' ? 'show' : ''}`}>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/statusreport" className="link">
                                <i className="bi bi-filter-square"></i>
                                <span>Booking MIS Report</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/statement">
                                <i className="bi bi-layout-text-sidebar-reverse"></i>
                                <span>Booking Detail Report</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/salesregister">
                                <i className="bi bi-filter-square"></i>
                                <span>Invoice Ledger Report</span>
                            </Link>
                        </li>
                    </ul>
                </li>


                <li className="nav-item">
                    <a href="#" className="nav-link collapsed"
                        onClick={() => toggleMenu('userControl')}>
                        <i className="bi bi-universal-access"></i>
                        <span>User Control</span>
                        <i className={`bi ${openMenu === 'userControl' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
                    </a>
                    <ul id="forms-nav"
                        className={`nav-content collapse ${openMenu === 'userControl' ? 'show' : ''}`}>
                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/useradmin">
                                <i className="bi bi-incognito"></i>
                                <span>User Admin</span>
                            </Link>
                        </li>

                        <li className="compo-tab" id="compo-tab" onClick={sideToggle}>
                            <Link to="/branchadmin">
                                <i className="bi bi-x-diamond-fill"></i>
                                <span>Branch Admin</span>
                            </Link>
                        </li>
                    </ul>
                </li>

            </ul>
        </aside >

    );
};


export default Sidebar1;