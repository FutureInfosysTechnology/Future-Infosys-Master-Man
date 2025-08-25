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
                            <form action="">
                                <div className="fields2">

                                    <div className="input-field3">
                                        <label htmlFor="">Branch Name</label>
                                        <select value="">
                                            <option value="" disabled>Select Branch</option>
                                            {getCity.map((city, index) => (
                                                <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                     <div className="input-field3">
                                        <label htmlFor="">Type</label>
                                        <select>
                                            <option value="" disabled>Select Type</option>
                                            <option value="client">Client Wise</option>
                                            <option value="client">Shipper Wise</option>
                                            <option value="client">Receiver Wise</option>
                                            <option value="client">Alarm No Wise</option>
                                        </select>
                                   </div>
                                    
                                     <div className="input-field3">
                                        <label htmlFor="">Customer Type</label>
                                        <select value="">
                                            <option value="" disabled>Select Customer</option>
                                            <option value="">All</option>
                                            <option value="">Single</option>
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
                                        <label htmlFor="">Client Type</label>
                                        <select>
                                            <option value="" disabled>CLient Type</option>
                                            <option value="client">Client</option>
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
                                        <label htmlFor="">Customer</label>
                                        <select value="">
                                            <option value="" disabled>Select Customer</option>
                                            {getCustomer.map((cust, index) => (
                                                <option value={cust.Customer_Code} key={index}>{cust.Customer_Name}</option>
                                            ))}
                                        </select>
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

                                    <div className="input-field3">
                                        <label htmlFor="" style={{ marginTop: "18px" }}></label>
                                        <button className="ok-btn" style={{ height: "35px", width: "50px" }}><i className="bi bi-layout-text-sidebar"></i></button>
                                    </div>

                                    <div className="bottom-buttons input-field3" style={{}}>
                                        <button className="ok-btn">Submit</button>
                                    </div>
                                </div>
                            </form>
                </div >
            </div >
        </>
    );
};

export default GenerateInvoice;