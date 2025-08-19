import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function ForwardingManifest() {
    const [maniDate,setManiDate]=useState(new Date());
    const handleDateChange=(date)=>
    {
        setManiDate(date);
    }
    return (
        <>
            <div className="body">
                <div className="container1">
                    <div className="production-header">
                        <div className="production-radio">
                            <div className="order-no">
                                <input type="radio" name="supplier" id="supplier" />
                                <label htmlFor="order">Manifest</label>
                            </div>

                            <div className="order-no">
                                <input type="radio" name="supplier" id="supplier" />
                                <label htmlFor="">Forwarding</label>
                            </div>
                        </div>
                    </div>

                    <form action="">
                        <div className="fields2">
                            <div className="input-field3">
                                <label htmlFor="">Manifest Date</label>
                                <DatePicker
                                              selected={maniDate}
                                              onChange={(date) => handleDateChange(date)}
                                              dateFormat="dd/MM/yyyy"
                                              className="form-control form-control-sm"
                                            />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Mode</label>
                                <select value="">
                                    <option value="" disabled>Select Mode</option>
                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">From Location</label>
                                <select value="">
                                    <option value="" disabled>Select Location</option>
                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Destination</label>
                                <select value="">
                                    <option value="" disabled>Select Destination</option>
                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Vendor Name</label>
                                <select value="">
                                    <option value="" disabled>Select Vendor Name</option>
                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Vendor Docket No</label>
                                <input type="tel" placeholder="Vendor Docket No" />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Import</label>
                                <input type="file" placeholder="choose file" style={{ paddingTop: "5px" }} />
                            </div>

                            <div className="bottom-buttons" style={{ marginTop: "18px"}}>
                                <button className="generate-btn" style={{fontSize:"12px"}}>Download Sample</button>
                                <button className="generate-btn">Error Log</button>
                            </div>
                        </div>


                    </form>
                </div>
            </div>
        </>
    );
};

export default ForwardingManifest;