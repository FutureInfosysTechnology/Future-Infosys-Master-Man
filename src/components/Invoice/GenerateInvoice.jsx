import React, { useState, useEffect } from "react";
import { getApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";




function GenerateInvoice() {

    const [getCustomer, setGetCustomer] = useState([]);
    const [getCity, setGetCity] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            setData(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData('/Master/getCustomer', setGetCustomer);
        fetchData('/Master/getdomestic', setGetCity);
        fetchData('/Master/getMode', setGetMode);
    }, []);


    return (
        <>
            <div className="body">
                <div className="container1">

                    <div className="card" >
                        <div className="row g-3">
                            <form action="">
                                <div className="fields2">
                                    <div className="input-field3">
                                        <label htmlFor="">Client Type</label>
                                        <select>
                                            <option value="" disabled>CLient Type</option>
                                            <option value="client">Client</option>
                                        </select>
                                    </div>

                                    <div className="input-field3" style={{ width: "77%" }}>
                                        <label htmlFor="">Type</label>
                                        <div style={{
                                            display: "flex", flexDirection: "row", justifyContent: "space-between",
                                            height: "40px", border: "1px solid #4FD1C5", borderRadius: "5px", padding: "5px"
                                        }} className="production-radio">
                                            <div style={{ display: "flex", flexDirection: "row", width: "150px" }}>
                                                <input type="radio" name="type" id="type" style={{ height: "20px", width: "20px" }} />
                                                <label htmlFor="" style={{ marginTop: "5px" }}>Client Wise</label>
                                            </div>

                                            <div style={{ display: "flex", flexDirection: "row", width: "160px" }}>
                                                <input type="radio" name="type" id="type" style={{ height: "20px", width: "20px" }} />
                                                <label htmlFor="" style={{ marginTop: "5px" }}>Shipper Wise</label>
                                            </div>

                                            <div style={{ display: "flex", flexDirection: "row", width: "170px" }}>
                                                <input type="radio" name="type" id="type" style={{ height: "20px", width: "20px" }} />
                                                <label htmlFor="" style={{ marginTop: "5px" }}>Receiver Wise</label>
                                            </div>

                                            <div style={{ display: "flex", flexDirection: "row", width: "150px" }}>
                                                <input type="radio" name="type" id="type" style={{ height: "20px", width: "20px" }} />
                                                <label htmlFor="" style={{ marginTop: "5px" }}>Alarm No Wise</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card" >
                        <div className="row g-3">
                            <form action="">
                                <div className="fields2">
                                    <div className="input-field3">
                                        <label htmlFor="">Location</label>
                                        <select value="">
                                            <option value="" disabled>Select Location</option>
                                            {getCity.map((city, index) => (
                                                <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">Billing Type</label>
                                        <select value="">
                                            <option value="" disabled>Billing Type</option>
                                            <option value="">Client</option>
                                        </select>
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">Customer Type</label>
                                        <div style={{
                                            display: "flex", flexDirection: "row", justifyContent: "space-between",
                                            width: "170px", padding: "5px", border: "1px solid #4FD1C5", height: "40px", borderRadius: "5px"
                                        }} className="production-radio">
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="radio" name="order" id="order" style={{ height: "20px", width: "20px" }} />
                                                <label htmlFor="" style={{ marginTop: "5px" }}>All</label>
                                            </div>

                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="radio" name="order" id="order" style={{ height: "20px", width: "20px" }} />
                                                <label htmlFor="" style={{ marginTop: "5px" }}>Single</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-field3" style={{ width: "360px" }}>
                                        <label htmlFor="">Customer</label>
                                        <select value="" style={{ width: "360px" }}>
                                            <option value="" disabled>Select Customer</option>
                                            {getCustomer.map((cust, index) => (
                                                <option value={cust.Customer_Code} key={index}>{cust.Customer_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">From Date</label>
                                        <input type="date" />
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">To Date</label>
                                        <input type="date" />
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">Invoice Date</label>
                                        <input type="date" />
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">Mode</label>
                                        <select value="">
                                            <option value="" disabled>Select Mode</option>
                                        </select>
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">Invoice No</label>
                                        <input type="text" placeholder="Invoice No" />
                                    </div>
                                    <div className="input-field3" style={{ marginLeft: "-55px" }}>
                                        <label htmlFor="" style={{ marginTop: "18px" }}></label>
                                        <button className="ok-btn" style={{ height: "40px", width: "45px" }}><i className="bi bi-layout-text-sidebar"></i></button>
                                    </div>
                                </div>

                                <div className="bottom-buttons">
                                    <button className="ok-btn">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
};

export default GenerateInvoice;