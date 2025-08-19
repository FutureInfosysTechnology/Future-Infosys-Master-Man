import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './statusStyle.css';
import { getApi } from '../../Admin Master/Area Control/Zonemaster/ServicesApi';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";



function Customer_Status() {

    const [getCustomer, setGetCustomer] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [formData, setFormData] = useState({
        CustomerName: "",
        fromdt: "",
        todt: ""
    });


    const fetchCustomerData = async () => {
        try {
            const response = await getApi('/Master/getCustomer');
            setGetCustomer(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Unable to fetch customer data:', err);
        }
    };
    useEffect(() => {
        fetchCustomerData();
    }, [])


    const handlesave = async (e) => {
        e.preventDefault();

        if (!formData.fromdt || !formData.todt) {
            Swal.fire('Error', 'Both From Date and To Date are required.', 'error');
            return;
        }

        const { fromdt, todt, CustomerName } = formData;

        const params = new URLSearchParams({
            fromdt: fromdt,
            todt: todt,
            CustomerName: CustomerName
        });

        const url = `https://sunraise.in/JdCourierlablePrinting/Booking/StatusReport?${params.toString()}`;

        try {
            const response = await axios.get(url);

            if (response.data.status === 1) {
                setCustomerData(response.data.Data);
                setFormData({ fromdt: "", todt: "", CustomerName: "" });
                Swal.fire('Saved!', response.data.message || 'Data have been fetched.', 'success');
            }
        } catch (error) {
            console.error("Unable to fetch Customer Wise Report:", error);
        }
    }

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(customerData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer Data');
        XLSX.writeFile(workbook, 'Customer_Data.xlsx');
    };

    const indexOfLastRecord = currentPage * rowsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
    const currentRecords = customerData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(customerData.length / rowsPerPage);

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
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12 d-flex justify-content-center">
                    <div className="shadow-status">
                        <form style={{ marginBottom: "10px" }} onSubmit={handlesave}>
                            <div className="fields2">
                                <div className='input-field1'>
                                    <label>Customer Name</label>
                                    <select value={formData.CustomerName}
                                        onChange={(e) => setFormData({ ...formData, CustomerName: e.target.value })}>
                                        <option value="" disabled>Select Customer</option>
                                        <option value="ALL Client Data">ALL Client Data</option>
                                        {getCustomer.map((cust, index) => (
                                            <option value={cust.Customer_Name} key={index}>{cust.Customer_Name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-field3">
                                    <label>From Date</label>
                                    <DatePicker
                                        selected={formData.fromdt ? new Date(formData.fromdt.split('/').reverse().join('-')) : null}
                                        onChange={(date) => handleDateChange(date, 'fromdt')}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
                                        placeholderText='From Date'
                                    />
                                </div>
                                <div className="input-field3">
                                    <label>To Date</label>
                                    <DatePicker
                                        selected={formData.todt ? new Date(formData.todt.split('/').reverse().join('-')) : null}
                                        onChange={(date) => handleDateChange(date, 'todt')}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
                                        placeholderText='To Date'
                                    />
                                </div>

                                <div className="bottom-buttons" style={{ paddingTop: "18px" }}>
                                    <button className='ok-btn' type='submit'>Submit</button>
                                    <button className='ok-btn' onClick={exportToExcel} style={{ width: "150px" }}>Export to Excel</button>
                                </div>
                            </div>
                        </form>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="table-info">
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>Docket No</th>
                                        <th>BookDate</th>
                                        <th>Customer_Name</th>
                                        <th>Receiver_Name</th>
                                        <th>Consignee_Name</th>
                                        <th>Origin</th>
                                        <th>Destination</th>
                                        <th>Mode</th>
                                        <th>Vendor</th>
                                        <th>Vendor_Docket_No</th>
                                        <th>Flag</th>
                                        <th>Qty</th>
                                        <th>Weight</th>
                                        <th>Status</th>
                                        <th>Delivery_Date</th>
                                        <th>Delivery_Time</th>
                                        <th>Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.length > 0 ? (
                                        currentRecords.map((item, index) => (
                                            <tr key={index} className="fontsizesmall">
                                                <td>{index + 1}</td>
                                                <td>{item.DocketNo}</td>
                                                <td>{item.BookDate}</td>
                                                <td>{item.Customer_Name}</td>
                                                <td>{item.RecvName}</td>
                                                <td>{item.Consignee_Name}</td>
                                                <td>{item.Origin_Name}</td>
                                                <td>{item.Destination_Name}</td>
                                                <td>{item.Mode_Name}</td>
                                                <td>{item.Vendor_Name}</td>
                                                <td>{item.vendorAwbno}</td>
                                                <td>{item.T_Flag}</td>
                                                <td>{item.Qty}</td>
                                                <td>{item.ActualWt}</td>
                                                <td>{item.Status}</td>
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
            </div>
        </div>
    );
};

export default Customer_Status;