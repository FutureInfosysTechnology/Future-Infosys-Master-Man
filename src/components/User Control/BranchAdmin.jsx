import React, { useEffect, useState } from 'react'
import Footer from '../../Components-2/Footer';
import Sidebar1 from '../../Components-2/Sidebar1';
import Header from '../../Components-2/Header/Header';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';

function BranchAdmin() {

    const [getBranch, setGetBranch] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedOperation, setSelectedOperation] = useState("");

    const handleRadioChange = (value) => {
        setSelectedOption((prev) => (prev === value ? "" : value));
    };

    const handleCheckboxChange = (value) => {
        setSelectedOperation((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const fetchBranchData = async () => {
        try {
            const response = await getApi('/Master/getAllBranchData');
            setGetBranch(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
        }
    };

    useEffect(() => {
        fetchBranchData();
    })

    return (
        <>

            <Header />
            <Sidebar1 />

            <div className="main-body" id="main-body">
                <div className="container">
                    <form action="" className="order-form">
                        <div className="order-fields">
                            <div className="order-input">
                                <label htmlFor="">User Name</label>
                                <input type="text" placeholder='UserName' />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Password</label>
                                <input type="password" placeholder='Password' />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Branch Name</label>
                                <select>
                                    <option value="" disabled>Select Branch</option>
                                    {getBranch.map((branch, index) => (
                                        <option value={branch.Branch_Code} key={index}>{branch.Branch_Name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='production-header'>
                            <div className="production-radio">
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <input type="radio" id='master' name='section' value="Master"
                                        checked={selectedOption === "Master"}
                                        onChange={() => handleRadioChange("Master")} />
                                    <label htmlFor="master">Master</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <input type="radio" id='operation' name='section' value="Operation"
                                        checked={selectedOption === "Operation"}
                                        onChange={() => handleRadioChange("Operation")} />
                                    <label htmlFor="operation">Operation</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <input type="radio" id="crm" name="section" value="CRM"
                                        checked={selectedOption === "CRM"}
                                        onChange={() => handleRadioChange("CRM")} />
                                    <label htmlFor="crm">CRM</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <input type="radio" id="reports" name="section" value="Reports"
                                        checked={selectedOption === "Reports"}
                                        onChange={() => handleRadioChange("Reports")} />
                                    <label htmlFor="reports">Reports</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <input type="radio" id="billings" name="section" value="Billings"
                                        checked={selectedOption === "Billings"}
                                        onChange={() => handleRadioChange("Billings")} />
                                    <label htmlFor="billings">Billings</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", marginRight: "20px" }}>
                                    <input type="radio" id="payments" name="section" value="Payments"
                                        checked={selectedOption === "Payments"}
                                        onChange={() => handleRadioChange("Payments")} />
                                    <label htmlFor="payments">Payments</label>
                                </div>
                            </div>
                        </div>
                        {selectedOption === "Master" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px", flexWrap:"wrap" }}>
                                <div style={{ width: "200px", border: "1px solid silver", borderRadius: "5px", marginBottom:"10px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="master">Master</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Branch Master" checked={selectedOperation.includes("Branch Master")}
                                                onChange={() => handleCheckboxChange("Branch Master")} />
                                            <label htmlFor="branch-master" style={{ marginLeft: "10px" }}>Branch Master</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Customer List" checked={selectedOperation.includes("Customer List")}
                                                onChange={() => handleCheckboxChange("Customer List")} />
                                            <label htmlFor="customer-list" style={{ marginLeft: "10px" }}>Customer List</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="City Master" checked={selectedOperation.includes("City Master")}
                                                onChange={() => handleCheckboxChange("City Master")} />
                                            <label htmlFor="city-master" style={{ marginLeft: "10px" }}>City Master</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Area Control" checked={selectedOperation.includes("Area Control")}
                                                onChange={() => handleCheckboxChange("Area Control")} />
                                            <label htmlFor="area-control" style={{ marginLeft: "10px" }}>Area Control</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Customer Charges" checked={selectedOperation.includes("Customer Charges")}
                                                onChange={() => handleCheckboxChange("Customer Charges")} />
                                            <label htmlFor="customer-charges" style={{ marginLeft: "10px" }}>Customer Charges</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Vendor Master" checked={selectedOperation.includes("Vendor Master")}
                                                onChange={() => handleCheckboxChange("Vendor Master")} />
                                            <label htmlFor="vendor-master" style={{ marginLeft: "10px" }}>Vendor Master</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Transport Master" checked={selectedOperation.includes("Transport Master")}
                                                onChange={() => handleCheckboxChange("Transport Master")} />
                                            <label htmlFor="transport-master" style={{ marginLeft: "10px" }}>Transport Master</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Inventory" checked={selectedOperation.includes("Inventory")}
                                                onChange={() => handleCheckboxChange("Inventory")} />
                                            <label htmlFor="inventory" style={{ marginLeft: "10px" }}>Inventory</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Region Master" checked={selectedOperation.includes("Region Master")}
                                                onChange={() => handleCheckboxChange("Region Master")} />
                                            <label htmlFor="region-master" style={{ marginLeft: "10px" }}>Region Master</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Branch Master") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Branch Master</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Branch Name</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Mode Master</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Bank Name</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Delivery Boy's Name</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Customer List") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Customer List</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Customer Name</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Receiver Name</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Customer Rate</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Customer Volumetric</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("City Master") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "140px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">City Master</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>International City</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Domestic City</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Pin Code</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Area Control") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Area Control</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>City Control</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Multiple City</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>State Master</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Country Master</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Customer Charges") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Customer Charges</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Customer Charges</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Customer ODA</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Update Customer Rate</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>GST Charges</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Vendor Master") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Vendor Master</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vendor Name</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vendor Rate</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vendor Charges</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vendor GST Master</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Transport Master") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "150px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Transport Master</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vehicle Master</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Transport Master</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Driver Master</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Inventory") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Inventory</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Stock Entry</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Branch Stock</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Customer Stock</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Employee Stock</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Region Master") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "80px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Region Master</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Region Master</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {selectedOption === "Operation" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px" }}>
                                <div style={{ width: "200px", border: "1px solid silver", borderRadius: "5px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="">Operation</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Booking" checked={selectedOperation.includes("Booking")}
                                                onChange={() => handleCheckboxChange("Booking")} />
                                            <label htmlFor="booking" style={{ marginLeft: "10px" }}>Booking</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Manifest" checked={selectedOperation.includes("Manifest")}
                                                onChange={() => handleCheckboxChange("Manifest")} />
                                            <label htmlFor="manifest" style={{ marginLeft: "10px" }}>Manifest</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Parcel Scan Data" checked={selectedOperation.includes("Parcel Scan Data")}
                                                onChange={() => handleCheckboxChange("Parcel Scan Data")} />
                                            <label htmlFor="dispatch" style={{ marginLeft: "10px" }}>Parcel Scan Data</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Run Sheet Entry" checked={selectedOperation.includes("Run Sheet Entry")}
                                                onChange={() => handleCheckboxChange("Run Sheet Entry")} />
                                            <label htmlFor="trip-sheet" style={{ marginLeft: "10px" }}>Run Sheet Entry</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Status Activity Entry" checked={selectedOperation.includes("Status Activity Entry")}
                                                onChange={() => handleCheckboxChange("Status Activity Entry")} />
                                            <label htmlFor="inscan" style={{ marginLeft: "10px" }}>Status Activity Entry</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="POD Record Update" checked={selectedOperation.includes("POD Record Update")}
                                                onChange={() => handleCheckboxChange("POD Record Update")} />
                                            <label htmlFor="pod-update" style={{ marginLeft: "10px" }}>POD Record Update</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Customer Queries" checked={selectedOperation.includes("Customer Queries")}
                                                onChange={() => handleCheckboxChange("Customer Queries")} />
                                            <label htmlFor="pod" style={{ marginLeft: "10px" }}>Customer Queries</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Booking") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "260px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Booking</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Daily Booking</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Daily Expenses</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Auto Mail</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Short Entry</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Bulk Import Data</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vendor Bill Entry</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Manifest") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "230px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Manifest</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Pending Manifest</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Create Manifest</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>View Manifest</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Forwarding Manifest</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Bulk Import Manifest</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Parcel Scan Data") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "120px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Parcel Scan Data</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Scan By AirwayBill No</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Scan By Manifest No</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Run Sheet Entry") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Run Sheet Entry</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Pending DRS</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Create DRS</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>View DRS</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Import DRS</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Status Activity Entry") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "150px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Status Activity Entry</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Activity Entry</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Excel Import</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Activity Tracking</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("POD Record Update") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "150px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">POD Record Update</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Delivered</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>UnDelivered</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Bulk Import(Excel)</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Customer Queries") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "150px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Customer Queries</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Complaint</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>View Complaint Status</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Querry</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedOption === "CRM" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px" }}>
                                <div style={{ width: "220px", border: "1px solid silver", borderRadius: "5px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="">CRM</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Customer Queries" checked={selectedOperation.includes("Customer Queries")}
                                                onChange={() => handleCheckboxChange("Customer Queries")} />
                                            <label htmlFor="customer queries" style={{ marginLeft: "10px" }}>Customer Queries</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Customer Queries") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "160px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Customer Queries</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Complaint</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>View Complaint Status</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Querry</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedOption === "Reports" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px" }}>
                                <div style={{ width: "220px", border: "1px solid silver", borderRadius: "5px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="">Reports</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Status Report" checked={selectedOperation.includes("Status Report")}
                                                onChange={() => handleCheckboxChange("Status Report")} />
                                            <label htmlFor="booking" style={{ marginLeft: "10px" }}>Status Report</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Statement Wise Report" checked={selectedOperation.includes("Statement Wise Report")}
                                                onChange={() => handleCheckboxChange("Statement Wise Report")} />
                                            <label htmlFor="manifest" style={{ marginLeft: "10px" }}>Statement Wise Report</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Sales Register Report" checked={selectedOperation.includes("Sales Register Report")}
                                                onChange={() => handleCheckboxChange("Sales Register Report")} />
                                            <label htmlFor="dispatch" style={{ marginLeft: "10px" }}>Sales Register Report</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Status Report") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "160px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Status Report</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Customer Wise Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vendor Wise Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vehicle Wise Report</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Statement Wise Report") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "160px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Statement Wise Report</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Statement Wise Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Checklist Wise Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Mode Wise Report</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Sales Register Report") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Sales Register Report</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Sales Register Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Checklist Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Unbuild Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Bill View Report</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedOption === "Billings" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px" }}>
                                <div style={{ width: "220px", border: "1px solid silver", borderRadius: "5px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="">Billings</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Invoice Generate" checked={selectedOperation.includes("Invoice Generate")}
                                                onChange={() => handleCheckboxChange("Invoice Generate")} />
                                            <label htmlFor="booking" style={{ marginLeft: "10px" }}>Invoice Generate</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Invoice Generate") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "160px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Invoice Generate</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Generate Generate</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>View Generate</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Pending Generate</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedOption === "Payments" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px" }}>
                                <div style={{ width: "220px", border: "1px solid silver", borderRadius: "5px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="">Payments</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Laiser" checked={selectedOperation.includes("Laiser")}
                                                onChange={() => handleCheckboxChange("Laiser")} />
                                            <label htmlFor="booking" style={{ marginLeft: "10px" }}>Laiser</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Laiser") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "160px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Laiser</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Payment Received Entry</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Pay Out Standing</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Credit Note</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ width: "100%" }}>
                            <div className="bottom-buttons">
                                <button className='ok-btn'>Submit</button>
                                <button className='ok-btn'>Reset</button>
                            </div>
                        </div>
                    </form>
                </div>
                <Footer />
            </div>

        </>
    )
}

export default BranchAdmin;