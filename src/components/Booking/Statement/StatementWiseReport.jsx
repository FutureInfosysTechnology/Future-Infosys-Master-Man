import React, { useState, useEffect } from 'react';
import { getApi } from '../../Admin Master/Area Control/Zonemaster/ServicesApi';


function StatementWiseReport() {

    const [getCity, setGetCity] = useState([]);
    const [getCustomer, setGetCustomer] = useState([]);
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
        fetchData('/Master/getdomestic', setGetCity);
        fetchData('/Master/getCustomer', setGetCustomer);
    }, []);


    return (
        <>

            <div className="body">
                <div className="container1" style={{ padding: "20px" }}>

                    <div className="addNew">
                        <div style={{ marginLeft: "10px" }}>
                            <div className="dropdown">
                                <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                                <div className="dropdown-content">
                                    <button>Export to Excel</button>
                                    <button>Export to PDF</button>
                                </div>
                            </div>
                        </div>

                        <div className="search-input">
                            <input className="add-input" type="text" placeholder="search" />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <form action="" style={{ margin: "0px" }}>
                        <div className="fields2">

                            <div className="input-field3" style={{ marginLeft: "0px" }}>
                                <label htmlFor="">Type Of Report</label>
                                <select value="">
                                    <option value="" disabled>Select Report</option>
                                    <option value="">Booking Date</option>
                                    <option value="">Manifest Date</option>
                                    <option value="">Details Wise</option>
                                    <option value="">Summary Wise</option>
                                </select>
                            </div>

                            <div className="input-field3" style={{ width: "300px" }}>
                                <label htmlFor="">Customer Name</label>
                                <select value="" style={{ width: "300px" }}>
                                    <option value="" disabled>Select Customer</option>
                                    {getCustomer.map((customer, index) => (
                                        <option value={customer.Customer_Code} key={index}>{customer.Customer_Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Customer Type</label>
                                <select value="">
                                    <option value="" disabled>Select Customer Type</option>
                                    <option value="">Resolved</option>
                                    <option value="">Pending</option>
                                </select>
                            </div>

                            <div className="input-field3" style={{ width: "250px" }}>
                                <label htmlFor="">Destination</label>
                                <select value="" style={{ width: "250px" }}>
                                    <option value="" disabled> Select Destination</option>
                                    {getCity.map((city, index) => (
                                        <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3" style={{ marginLeft: "0px" }}>
                                <label htmlFor="">From Date</label>
                                <input type="date" />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">To Date</label>
                                <input type="date" />
                            </div>

                            <div className="bottom-buttons" style={{ marginTop: "18px" }}>
                                <button className='ok-btn'>Submit</button>
                                <button className='ok-btn' style={{ width: "110px" }}>Setup Report</button>
                            </div>
                        </div>
                    </form>

                    <div className="table-container">
                        <table className='table table-bordered table-sm'>
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Customer Type</th>
                                    <th>Destination</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>
    )
}

export default StatementWiseReport;