import React, { useState, useEffect } from 'react';
import { getApi } from '../../Admin Master/Area Control/Zonemaster/ServicesApi';
import './statusStyle.css';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';


function VendorWiseReport() {

    const [getCity, setGetCity] = useState([]);
    const [getVendor, setGetVendor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vendorData, setVendorData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [formData, setFormData] = useState({
        VendorName: "",
        fromdt: "",
        todt: ""
    });

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
        fetchData('/Master/getVendor', setGetVendor);
    }, []);


    const handlesave = async (e) => {
        e.preventDefault();

        if (!formData.fromdt || !formData.todt) {
            Swal.fire('Error', 'Both From Date and To Date are required.', 'error');
            return;
        }

        const { fromdt, todt, VendorName } = formData;

        const params = new URLSearchParams({
            fromdt: fromdt,
            todt: todt,
            Vendor_Name: VendorName
        });

        const url = `https://sunraise.in/JdCourierlablePrinting/Booking/VendorDeliveryReport?${params.toString()}`;

        try {
            const response = await axios.get(url);
            console.log(response.data);
            if (response.data.status === 1) {
                setVendorData(response.data.Data);
                setFormData({ fromdt: "", todt: "", VendorName: "" });
                Swal.fire('Saved!', response.message || 'Data have been fetched.', 'success');
            }
        } catch (error) {
            console.error("Unable to fetch Vendor Wise Report:", error);
        }
    }


    const indexOfLastRecord = currentPage * rowsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
    const currentRecords = vendorData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(vendorData.length / rowsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleDateChange = (date, field) => {
        if (date) {
            const formattedDate = date.toLocaleDateString('en-GB');
            setFormData((prevState) => ({
                ...prevState,
                [field]: formattedDate,
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [field]: '',
            }));
        }
    };


    return (
        <>

            <div className="body">
                <div className="shadow-status">

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

                    <form style={{ margin: "0px" }} onSubmit={handlesave}>
                        <div className="fields2">

                            {/* <div className="input-field3">
                                <label htmlFor="">Type Of Report</label>
                                <select >
                                    <option value="" disabled>Select Report</option>
                                    <option value="">Details Wise</option>
                                    <option value="">Summary Wise</option>
                                </select>
                            </div> */}

                            <div className="input-field3" style={{ width: "300px" }}>
                                <label htmlFor="">Vendor Name</label>
                                <select value={formData.VendorName} style={{ width: "300px" }}
                                    onChange={(e) => setFormData({ ...formData, VendorName: e.target.value })}>
                                    <option value="" disabled>Select Vendor</option>
                                    {getVendor.map((vendor, index) => (
                                        <option value={vendor.Vendor_Code} key={index}>{vendor.Vendor_Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">From Date</label>
                                <DatePicker
                                    selected={formData.fromdt ? new Date(formData.fromdt.split('/').reverse().join('-')) : null}
                                    onChange={(date) => handleDateChange(date, 'fromdt')}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    placeholderText='From Date'
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">To Date</label>
                                <DatePicker
                                    selected={formData.todt ? new Date(formData.todt.split('/').reverse().join('-')) : null}
                                    onChange={(date) => handleDateChange(date, 'todt')}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    placeholderText='To Date'
                                />
                            </div>

                            <div className="bottom-buttons" style={{ marginTop: "18px" }}>
                                <button className='ok-btn' type='submit'>Submit</button>
                                <button className='ok-btn' style={{ width: "150px" }}>Status Report</button>
                            </div>

                            {/* <div className="input-field3">
                                <label htmlFor="">Status</label>
                                <select>
                                    <option value="" disabled>Select Status</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Destination</label>
                                <select style={{ width: "250px" }}>
                                    <option value="" disabled> Select Destination</option>
                                    {getCity.map((city, index) => (
                                        <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                    ))}
                                </select>
                            </div> */}
                        </div>
                    </form>

                    <div className="table-container">
                        <table className='table table-bordered table-sm'>
                            <thead>
                                <tr>
                                    <th>Sr No</th>
                                    <th>Docket No</th>
                                    <th>Vendor Name</th>
                                    <th>Vendor_Docket_No</th>
                                    <th>Book Date</th>
                                    <th>Customer_Name</th>
                                    <th>RecvName</th>
                                    <th>Consignee_Name</th>
                                    <th>Status</th>
                                    <th>Origin_Name</th>
                                    <th>Destination</th>
                                    <th>Mode_Name</th>
                                    <th>T_Flag</th>
                                    <th>Qty</th>
                                    <th>ActualWt</th>
                                    <th>DelvDT</th>
                                    <th>DelvTime</th>
                                    <th>Remark</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentRecords.length > 0 ? (
                                    currentRecords.map((item, index) => (
                                        <tr key={index} className="fontsizesmall">
                                            <td>{index + 1}</td>
                                            <td>{item.DocketNo}</td>
                                            <td>{item.Vendor_Name}</td>
                                            <td>{item.vendorAwbno}</td>
                                            <td>{item.BookDate}</td>
                                            <td>{item.Customer_Name}</td>
                                            <td>{item.RecvName}</td>
                                            <td>{item.Consignee_Name}</td>
                                            <td>{item.Status}</td>
                                            <td>{item.Origin_Name}</td>
                                            <td>{item.Destination_Name}</td>
                                            <td>{item.Mode_Name}</td>
                                            <td>{item.T_Flag}</td>
                                            <td>{item.Qty}</td>
                                            <td>{item.ActualWt}</td>
                                            <td>{item.DelvDT}</td>
                                            <td>{item.DelvTime}</td>
                                            <td>{item.Remark}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={16} className="text-center">
                                            No data available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
                        <div className="pagination">
                            <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                {'<'}
                            </button>
                            <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                            <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                {'>'}
                            </button>
                        </div>

                        <div className="rows-per-page" style={{ display: "flex", flexDirection: "row", color: "black", marginLeft: "10px" }}>
                            <label htmlFor="rowsPerPage" style={{ marginTop: "16px", marginRight: "10px" }}>Rows per page:</label>
                            <select
                                id="rowsPerPage"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                style={{ height: "40px", width: "60px", marginTop: "10px" }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default VendorWiseReport;