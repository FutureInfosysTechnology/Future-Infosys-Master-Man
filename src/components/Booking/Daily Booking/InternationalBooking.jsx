import React, { useState, useEffect } from 'react'
import Footer from '../../../Components-2/Footer';
import Header from '../../../Components-2/Header/Header';
import Sidebar1 from '../../../Components-2/Sidebar1';
import Modal from 'react-modal';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

function InternationalBooking() {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [modalIsOpen3, setModalIsOpen3] = useState(false);
    const [modalIsOpen4, setModalIsOpen4] = useState(false);
    const [selectedCharges, setSelectedCharges] = useState("");
    const [toggleActive, setToggleActive] = useState(false);

    const onToggle = () => setToggleActive(!toggleActive);

    const handleCheckboxChange = (value) => {
        setSelectedCharges((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id='main-body'>
                <div className="body">

                    <div className="container1">

                        <div className='container-2' style={{ border: "transparent" }}>
                            <div className="card left-card" >
                                <div className="section-title">Customer Docket Information</div>
                                <form action="" style={{ padding: "0px", margin: "0px", marginBottom: "10px" }}>
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="shipper">Docket No</label>
                                            <input type="text" placeholder="Docket No"
                                                disabled={!toggleActive}
                                            />
                                        </div>
                                        <div className='toggle-button'>
                                            <Toggle
                                                onClick={onToggle}
                                                on={<h2>ON</h2>}
                                                off={<h2>OFF</h2>}
                                                offstyle="danger"
                                                active={toggleActive}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="booking-date">Booking Date</label>
                                            <input
                                                id="booking-date"
                                                type="date"
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Customer Code</label>
                                            <input type="tel" placeholder="Customer Code" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Customer Name</label>
                                            <select value="">
                                                <option value="" disabled>Customer Name</option>
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Shipper Name</label>
                                            <select value="">
                                                <option value="" disabled>Shipper Name</option>
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Shipper Mobile No</label>
                                            <input type="tel" maxLength={10} placeholder="Shipper Mobile No" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Shipper Address</label>
                                            <input type="text" placeholder="Shipper Address" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Shipper Address</label>
                                            <input type="text" placeholder="Shipper Address" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Pin Code</label>
                                            <input type="tel" maxLength={6} placeholder="Pin Code" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">GST No</label>
                                            <input type="text" maxLength={16} placeholder="GST No" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Aadhar No</label>
                                            <input type="tel" maxLength={12} placeholder="Aadhar No" />
                                        </div>
                                    </div>
                                </form>

                                <div className="card" style={{ border: "transparent", padding: "0px" }}>
                                    <div className="section-title">Vendor Information</div>
                                    <form action="" style={{ padding: "0px" }}>
                                        <div className="fields2">
                                            <div className="input-field1">
                                                <label htmlFor="">Vendor Name</label>
                                                <select value="">
                                                    <option value="" disabled>Vendor Name</option>
                                                </select>
                                            </div>

                                            <div className="input-field1">
                                                <label htmlFor="">Vendor Docket No</label>
                                                <input type="text" placeholder='Vendor Docket No' />
                                            </div>

                                            <div className="input-field1">
                                                <label htmlFor="">Vendor Name 2</label>
                                                <select value="">
                                                    <option value="" disabled>Vendor Name2</option>
                                                </select>
                                            </div>

                                            <div className="input-field1">
                                                <label htmlFor="">Vendor Docket No2</label>
                                                <input type="text" placeholder='Vendor Docket No2' />
                                            </div>

                                            <div className="input-field1">
                                                <label htmlFor="">Origin</label>
                                                <input type="text" placeholder='Origin' />
                                            </div>

                                            <div className="input-field1">
                                                <label htmlFor="">Destination</label>
                                                <input type="text" placeholder='Destination' />
                                            </div>

                                            <div className="input-field1">
                                                <label htmlFor="">Pin Code</label>
                                                <input type="tel" maxLength={6} placeholder='Pin Code' />
                                            </div>

                                            <div className="input-field1">
                                                <label htmlFor="">Zone Name</label>
                                                <input type="text" placeholder='Zone Name' />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="card right-card">
                                <div className="section-title">Receiver Information</div>
                                <form action="" style={{ padding: "0px", margin: "0px", marginBottom: "10px" }}>
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Receiver Name</label>
                                            <select value="">
                                                <option value="" disabled>Receiver Name</option>
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Mobile No</label>
                                            <input type="tel" maxLength={10} placeholder="Mobile No" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Address</label>
                                            <input type="text" placeholder="Address" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">City Name</label>
                                            <select value="">
                                                <option value="" disabled>Select City</option>
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Country Name</label>
                                            <select value="">
                                                <option value="" disabled>Select Country</option>
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">GST No</label>
                                            <input type="text" placeholder="GST No" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Product</label>
                                            <select value="">
                                                <option value="" disabled>Select Product</option>
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Destination</label>
                                            <select value="">
                                                <option value="" disabled>Destination</option>
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">QTY</label>
                                            <input type="tel" placeholder="QTY" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Dox/Spx</label>
                                            <input type="tel" placeholder="Dox/Spx" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Invoice Details</label>
                                            <button
                                                onClick={(e) => { e.preventDefault(); setModalIsOpen3(true); }}
                                                className="ok-btn" style={{ height: "35px", width: "100%", color: "black" }}>
                                                <i className="bi bi-receipt-cutoff"></i>
                                            </button>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Performance Invoice</label>
                                            <button
                                                onClick={(e) => { e.preventDefault(); setModalIsOpen4(true); }}
                                                className="ok-btn" style={{ height: "35px", width: "100%", color: "black" }}>
                                                <i className="bi bi-receipt-cutoff"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <div className="card" style={{ border: "transparent", padding: "0px" }}>
                                    <div className="section-title">Charges Information</div>
                                    <form action="" style={{ padding: "0px", margin: "0px" }}>
                                        <div className="fields2">
                                            <div className="input-field1">
                                                <label htmlFor="">Volumetric Wt</label>
                                                <input type="tel" placeholder=" Volumetric Wt" />
                                            </div>
                                            <div className="input-field1">
                                                <label htmlFor="" style={{ marginTop: "18px" }}></label>
                                                <button className="ok-btn"
                                                    onClick={(e) => { e.preventDefault(); setModalIsOpen1(true); }}
                                                    style={{ height: "35px", width: "100%", color: "black" }}>
                                                    <i className="bi bi-calculator" style={{ fontSize: "20px" }}></i>
                                                </button>
                                            </div>

                                            <div className="input-field1">
                                                <label htmlFor="">Vendor Weight</label>
                                                <input type="tel" placeholder=" Vendor Weight" />
                                            </div>
                                            <div className="input-field1">
                                                <label htmlFor="" style={{ marginTop: "18px" }}></label>
                                                <button className="ok-btn"
                                                    onClick={(e) => { e.preventDefault(); setModalIsOpen1(true); }}
                                                    style={{ height: "35px", width: "100%", color: "black" }}>
                                                    <i className="bi bi-calculator" style={{ fontSize: "20px" }}></i>
                                                </button>
                                            </div>

                                            {selectedCharges.includes("Actual Weight") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Actual Weight</label>
                                                    <input type="tel" placeholder="Actual Weight" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Charged Weight") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Charged Weight</label>
                                                    <input type="tel" placeholder="Charged Weight" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Rate Per Kg") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Rate Per Kg</label>
                                                    <input type="tel" placeholder="Rate Per Kg" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Amount") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Amount</label>
                                                    <input type="tel" placeholder="Amount" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Discount") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Discount</label>
                                                    <input type="tel" placeholder="Discount" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("ODA Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">ODA Charges</label>
                                                    <input type="tel" placeholder="ODA Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Fuel Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Fuel Charges</label>
                                                    <input type="tel" placeholder="Fuel Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Clearance Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Clearance Charges</label>
                                                    <input type="tel" placeholder="Clearance Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Security Surcharge") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Security Surcharge</label>
                                                    <input type="tel" placeholder="Security Surcharge" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("DGR Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">DGR Charges</label>
                                                    <input type="tel" placeholder="DGR Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Packing Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Packing Charges</label>
                                                    <input type="tel" placeholder="Packing Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Ad Code Reg.") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Ad Code Reg.</label>
                                                    <input type="text" placeholder="Ad Code Reg." />
                                                </div>
                                            )}

                                            {selectedCharges.includes("ADC Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">ADC Charges</label>
                                                    <input type="tel" placeholder="ADC Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("AWB Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">AWB Charges</label>
                                                    <input type="tel" placeholder="AWB Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Large Size Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Large Size Charges</label>
                                                    <input type="tel" placeholder="Large Size Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Transportation Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Transportation Charges</label>
                                                    <input type="tel" placeholder="Transportation Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Loading / Unloading" && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Loading / Unloading</label>
                                                    <input type="tel" placeholder="Loading / Unloading" />
                                                </div>
                                            ))}

                                            {selectedCharges.includes("DHL Risk Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">DHL Risk Charges</label>
                                                    <input type="tel" placeholder="DHL Risk Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Fov Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Fov Charges</label>
                                                    <input type="tel" placeholder="Fov Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("GST") && (
                                                <>
                                                    <div className="input-field1">
                                                        <label htmlFor="">GST</label>
                                                        <input type="tel" placeholder="GST" />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="" style={{ marginTop: "18px" }}></label>
                                                        <button className="ok-btn" style={{ height: "35px", width: "100%" }}
                                                            onClick={(e) => { e.preventDefault(); setModalIsOpen2(true); }}>
                                                            <i className="bi bi-cash-coin" style={{ fontSize: "24px" }}></i>
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {selectedCharges.includes("Other Charges") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Other Charges</label>
                                                    <input type="tel" placeholder="Other Charges" />
                                                </div>
                                            )}

                                            {selectedCharges.includes("Total Amount") && (
                                                <div className="input-field1">
                                                    <label htmlFor="">Total Amount</label>
                                                    <input type="tel" placeholder="Total Amount" />
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="bottom-card">
                            <button className="ok-btn">Save</button>
                            <button className="ok-btn">Delete</button>
                            <button className="ok-btn" onClick={() => setModalIsOpen(true)}>Setup</button>
                            <button className="ok-btn">Print</button>
                            <button className="ok-btn">Label</button>
                        </div>


                        <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                            className="custom-modal-setup2">
                            <div>

                                <div className="header-tittle">
                                    <header>Charges</header>
                                </div>

                                <div className='container2'>
                                    <form>
                                        <div className="fields2">
                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Actual Weight" checked={selectedCharges.includes("Actual Weight")}
                                                    onChange={() => handleCheckboxChange("Actual Weight")} />
                                                <label htmlFor="actual-weight" style={{ marginLeft: "10px", fontSize: "12px" }}>Actual Weight</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Charged Weight" checked={selectedCharges.includes("Charged Weight")}
                                                    onChange={() => handleCheckboxChange("Charged Weight")} />
                                                <label htmlFor="charged-weight" style={{ marginLeft: "10px", fontSize: "12px" }}>Charged Weight</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Rate Per Kg" checked={selectedCharges.includes("Rate Per Kg")}
                                                    onChange={() => handleCheckboxChange("Rate Per Kg")} />
                                                <label htmlFor="rate-per-kg" style={{ marginLeft: "10px", fontSize: "12px" }}>Rate Per Kg</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Amount" checked={selectedCharges.includes("Amount")}
                                                    onChange={() => handleCheckboxChange("Amount")} />
                                                <label htmlFor="amount" style={{ marginLeft: "10px", fontSize: "12px" }}>Amount</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Discount" checked={selectedCharges.includes("Discount")}
                                                    onChange={() => handleCheckboxChange("Discount")} />
                                                <label htmlFor="discount" style={{ marginLeft: "10px", fontSize: "12px" }}>Discount</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="ODA Charges" checked={selectedCharges.includes("ODA Charges")}
                                                    onChange={() => handleCheckboxChange("ODA Charges")} />
                                                <label htmlFor="oda-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>ODA Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Fuel Charges" checked={selectedCharges.includes("Fuel Charges")}
                                                    onChange={() => handleCheckboxChange("Fuel Charges")} />
                                                <label htmlFor="fuel-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>Fuel Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Clearance Charges" checked={selectedCharges.includes("Clearance Charges")}
                                                    onChange={() => handleCheckboxChange("Clearance Charges")} />
                                                <label htmlFor="clearance-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>Clearance Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Security Surcharge" checked={selectedCharges.includes("Security Surcharge")}
                                                    onChange={() => handleCheckboxChange("Security Surcharge")} />
                                                <label htmlFor="security-surcharge" style={{ marginLeft: "10px", fontSize: "12px" }}>Security Surcharge</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="DGR Charges" checked={selectedCharges.includes("DGR Charges")}
                                                    onChange={() => handleCheckboxChange("DGR Charges")} />
                                                <label htmlFor="dgr-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>DGR Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Packing Charges" checked={selectedCharges.includes("Packing Charges")}
                                                    onChange={() => handleCheckboxChange("Packing Charges")} />
                                                <label htmlFor="packing-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>Packing Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Ad Code Reg." checked={selectedCharges.includes("Ad Code Reg.")}
                                                    onChange={() => handleCheckboxChange("Ad Code Reg.")} />
                                                <label htmlFor="ad-code-reg" style={{ marginLeft: "10px", fontSize: "12px" }}>Ad Code Reg.</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="ADC Charges" checked={selectedCharges.includes("ADC Charges")}
                                                    onChange={() => handleCheckboxChange("ADC Charges")} />
                                                <label htmlFor="adc-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>ADC Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="AWB Charges" checked={selectedCharges.includes("AWB Charges")}
                                                    onChange={() => handleCheckboxChange("AWB Charges")} />
                                                <label htmlFor="awb-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>AWB Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Large Size Charges" checked={selectedCharges.includes("Large Size Charges")}
                                                    onChange={() => handleCheckboxChange("Large Size Charges")} />
                                                <label htmlFor="large-size-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>Large Size Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Transportation Charges" checked={selectedCharges.includes("Transportation Charges")}
                                                    onChange={() => handleCheckboxChange("Transportation Charges")} />
                                                <label htmlFor="transportation-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>Transportation Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Loading / Unloading" checked={selectedCharges.includes("Loading / Unloading")}
                                                    onChange={() => handleCheckboxChange("Loading / Unloading")} />
                                                <label htmlFor="loading-unloading" style={{ marginLeft: "10px", fontSize: "12px" }}>Loading / Unloading</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="DHL Risk Charges" checked={selectedCharges.includes("DHL Risk Charges")}
                                                    onChange={() => handleCheckboxChange("DHL Risk Charges")} />
                                                <label htmlFor="dhl-risk-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>DHL Risk Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="FOV Charges" checked={selectedCharges.includes("FOV Charges")}
                                                    onChange={() => handleCheckboxChange("FOV Charges")} />
                                                <label htmlFor="fov-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>FOV Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="GST" checked={selectedCharges.includes("GST")}
                                                    onChange={() => handleCheckboxChange("GST")} />
                                                <label htmlFor="gst" style={{ marginLeft: "10px", fontSize: "12px" }}>GST</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Other Charges" checked={selectedCharges.includes("Other Charges")}
                                                    onChange={() => handleCheckboxChange("Other Charges")} />
                                                <label htmlFor="other-charges" style={{ marginLeft: "10px", fontSize: "12px" }}>Other Charges</label>
                                            </div>

                                            <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    value="Total Amount" checked={selectedCharges.includes("Total Amount")}
                                                    onChange={() => handleCheckboxChange("Total Amount")} />
                                                <label htmlFor="total-amount" style={{ marginLeft: "10px", fontSize: "12px" }}>Total Amount</label>
                                            </div>
                                        </div>

                                        <div className='bottom-buttons' style={{ marginLeft: "25px", marginTop: "18px" }}>
                                            <button onClick={(e) => { e.preventDefault(); setModalIsOpen(false) }} className='ok-btn'>close</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Modal >

                        <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen1}
                            style={{
                                content: {
                                    top: '53%',
                                    left: '55%',
                                    right: 'auto',
                                    bottom: 'auto',
                                    marginRight: '-50%',
                                    transform: 'translate(-50%, -50%)',
                                    height: '200px',
                                    width: '990px',
                                    borderRadius: '5px',
                                    padding: "0px"
                                },
                            }}>
                            <div>
                                <div className="header-tittle">
                                    <header>Vendor Volumetric Calculate</header>
                                </div>
                                <div className='container2'>
                                    <div className="table-container">
                                        <table className="table table-bordered table-sm">
                                            <thead className="table-info">
                                                <tr>
                                                    <th>Length</th>
                                                    <th>Width</th>
                                                    <th>Height</th>
                                                    <th>CFT</th>
                                                    <th>DIV</th>
                                                    <th>QTY</th>
                                                    <th>Vol Wt</th>
                                                    <th>Actual Wt</th>
                                                    <th>Charged Wt</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-body">
                                                <tr>
                                                    <td><input type="tel" placeholder="Length" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="Width" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="Height" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="CFT" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="DIV" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="QTY" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="Vol Wt" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="Actual Wt" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="Charged Wt" style={{ textAlign: "center" }} /></td>
                                                    <td>
                                                        <button className="ok-btn" style={{ width: "30px", height: "30px" }}>
                                                            <i className="bi bi-plus" style={{ fontSize: "18px" }}></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bottom-buttons">
                                        <button className="ok-btn">Submit</button>
                                        <button className="ok-btn" onClick={() => setModalIsOpen1(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </Modal >

                        <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen2}
                            className="custom-modal-volumetric" contentLabel='Modal'>
                            <div className='custom-modal-content'>
                                <div className="header-tittle">
                                    <header>GST</header>
                                </div>
                                <div className='container2'>
                                    <form>
                                        <div className="fields2">
                                            <div className="input-field" style={{ width: "60%" }}>
                                                <label htmlFor="">CGST</label>
                                                <input type="tel" placeholder=" CGST Charges" />
                                            </div>

                                            <div className="input-field" style={{ width: "30%" }}>
                                                <label htmlFor="">Percentage %</label>
                                                <input type="tel" placeholder="CGST %" />
                                            </div>
                                        </div>

                                        <div className="fields2">
                                            <div className="input-field" style={{ width: "60%" }}>
                                                <label htmlFor="">SGST</label>
                                                <input type="tel" placeholder=" SGST Charges" />
                                            </div>

                                            <div className="input-field" style={{ width: "30%" }}>
                                                <label htmlFor="">Percentage %</label>
                                                <input type="tel" placeholder="SGST %" />
                                            </div>
                                        </div>

                                        <div className="fields2">
                                            <div className="input-field" style={{ width: "60%" }}>
                                                <label htmlFor="">IGST</label>
                                                <input type="tel" placeholder=" IGST Charges" />
                                            </div>

                                            <div className="input-field" style={{ width: "30%" }}>
                                                <label htmlFor="">Percentage %</label>
                                                <input type="tel" placeholder="IGST %" />
                                            </div>
                                        </div>

                                        <div className="fields2">
                                            <div className="input-field" style={{ width: "60%" }}>
                                                <label htmlFor="">Total GST</label>
                                                <input type="tel" placeholder=" GST Charges" />
                                            </div>

                                            <div className="input-field" style={{ width: "30%" }}>
                                                <label htmlFor="">Percentage %</label>
                                                <input type="tel" placeholder="GST %" />
                                            </div>

                                        </div>
                                        <div className="bottom-buttons">
                                            <button className="ok-btn">Submit</button>
                                            <button className="ok-btn" onClick={() => setModalIsOpen2(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Modal >

                        <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen3}
                            style={{
                                content: {
                                    top: '53%',
                                    left: '55%',
                                    right: 'auto',
                                    bottom: 'auto',
                                    marginRight: '-50%',
                                    transform: 'translate(-50%, -50%)',
                                    height: '200px',
                                    width: '80%',
                                    borderRadius: '5px',
                                    padding: "0px"
                                },
                            }}>
                            <div>
                                <div className="header-tittle">
                                    <header>Invoice Details</header>
                                </div>
                                <div className='container2'>
                                    <div className="table-container">
                                        <table className="table table-bordered table-sm">
                                            <thead className="table-info">
                                                <tr>
                                                    <th>PO No</th>
                                                    <th>PO Date</th>
                                                    <th>Invoice No</th>
                                                    <th>Invoice Value</th>
                                                    <th>Description</th>
                                                    <th>QTY</th>
                                                    <th>E-Way Bill No</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-body">
                                                <tr>
                                                    <td><input type="tel" placeholder="PO No" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="PO Date" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="Invoice No" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="Invoice Value" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="Description" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="QTY" style={{ textAlign: "center" }} /></td>
                                                    <td><input type="tel" placeholder="E-Way Bill No" style={{ textAlign: "center" }} /></td>
                                                    <td>
                                                        <button className="ok-btn" style={{ width: "30px", height: "30px" }}>
                                                            <i className="bi bi-plus" style={{ fontSize: "18px" }}></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bottom-buttons">
                                        <button className="ok-btn">Submit</button>
                                        <button className="ok-btn" onClick={() => setModalIsOpen3(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </Modal >

                        <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen4}
                            style={{
                                content: {
                                    top: '53%',
                                    left: '55%',
                                    right: 'auto',
                                    bottom: 'auto',
                                    marginRight: '-50%',
                                    transform: 'translate(-50%, -50%)',
                                    height: '500px',
                                    width: '85%',
                                    borderRadius: '5px',
                                    padding: "0px"
                                },
                            }}>
                            <div>
                                <div className="header-tittle">
                                    <header>Performance Invoice</header>
                                </div>
                                <div className="container1">

                                    <div className='container-2'>
                                        <div className="card left-card" >
                                            <div className="section-title">SHIPPER</div>
                                            <form action="" style={{ margin: "0px", padding: "0px" }}>
                                                <div className="fields2">
                                                    <div className="input-field1">
                                                        <label htmlFor="">Shipper</label>
                                                        <select value="">
                                                            <option value="" disabled>Select Shipper</option>
                                                            <option value=""></option>
                                                        </select>
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Shipper Address</label>
                                                        <input type="text" placeholder='Shipper Address' />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Shipper Address</label>
                                                        <input type="text" placeholder='Shipper Address' />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Shipper City</label>
                                                        <select value="">
                                                            <option value="" disabled>Select City</option>
                                                            <option value=""></option>
                                                        </select>
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Pin Code</label>
                                                        <input type="tel" maxLength={6} placeholder='Pin Code' />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Shipper State</label>
                                                        <select value="">
                                                            <option value="" disabled>Select State</option>
                                                            <option value=""></option>
                                                        </select>
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Aadhar No</label>
                                                        <input type="tel" maxLength={12} placeholder='Aadhar No' />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">GST No</label>
                                                        <input type="text" maxLength={16} placeholder='GST No' />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        <div className="card right-card">
                                            <div className="section-title">RECEIVER</div>
                                            <form action="" style={{ margin: "0px", padding: "0px" }}>
                                                <div className="fields2">
                                                    <div className="input-field1">
                                                        <label htmlFor="">Receiver</label>
                                                        <select value="">
                                                            <option value="" disabled>Select Receiver</option>
                                                            <option value=""></option>
                                                        </select>
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Receiver Address</label>
                                                        <input type="text" placeholder='Receiver Address' />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Receiver Address</label>
                                                        <input type="text" placeholder='Receiver Address' />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Receiver City</label>
                                                        <select value="">
                                                            <option value="" disabled>Select City</option>
                                                            <option value=""></option>
                                                        </select>
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Pin Code</label>
                                                        <input type="tel" maxLength={6} placeholder='Pin Code' />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Receiver State</label>
                                                        <select value="">
                                                            <option value="" disabled>Select State</option>
                                                            <option value=""></option>
                                                        </select>
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">Mobile No</label>
                                                        <input type="tel" maxLength={10} placeholder='Mobile No' />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label htmlFor="">GST No</label>
                                                        <input type="text" maxLength={16} placeholder='GST No' />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                    </div>

                                    <div className="card">
                                        <div className="section-title">Courier Details</div>
                                        <form style={{ margin: "0px", padding: "0px" }}>
                                            <div className="fields2">
                                                <div className="input-field3">
                                                    <label htmlFor="">Invoice No</label>
                                                    <input type="tel" placeholder='Invoice No' />
                                                </div>
                                                <div className="input-field3">
                                                    <label htmlFor="">Invoice Date</label>
                                                    <input type="date" />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Docket No</label>
                                                    <input type="text" placeholder='Docket No' />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Country of Origin</label>
                                                    <select value="">
                                                        <option value="" disabled>Select Country</option>
                                                        <option value="">India</option>
                                                    </select>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Final Destination</label>
                                                    <select value="">
                                                        <option value="" disabled>Select Destination</option>
                                                        <option value=""></option>
                                                    </select>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">No of Boxes</label>
                                                    <input type="tel" placeholder='No of Boxes' />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Total Weight</label>
                                                    <input type="tel" placeholder='Total Weight' />
                                                </div>
                                            </div>
                                        </form>
                                    </div>



                                    <div className='table-container' style={{ margin: "0px" }}>
                                        <table className='table table-bordered table-sm'>
                                            <thead className='table-info table-sm'>
                                                <tr>
                                                    <th scope="col">Sr.No</th>
                                                    <th scope="col">Desciption Of Goods</th>
                                                    <th scope="col">HSN Code</th>
                                                    <th scope="col">QTY</th>
                                                    <th scope="col">Rate</th>
                                                    <th scope="col">Total Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className='table-body'>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="bottom-buttons">
                                        <button className='ok-btn'>Save</button>
                                        <button className='ok-btn' onClick={() => setModalIsOpen4(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </Modal >
                    </div >

                </div >
                <Footer />
            </div>
        </>
    )
}

export default InternationalBooking;