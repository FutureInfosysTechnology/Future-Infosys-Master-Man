import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import Swal from "sweetalert2";
import Footer from "../../Components-2/Footer";
import Header from "../../Components-2/Header/Header";
import Sidebar1 from "../../Components-2/Sidebar1";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'react-toggle/style.css';
import { getApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";



function ViewInvoice() {


    const navigate = useNavigate();
    const location = useLocation();

    const [invoice, setInvoice] = useState([])
    const [openRow, setOpenRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [getCustomer, setGetCustomer] = useState([]);
    const [error, setError] = useState(null);
    const extrectArray = (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.Data)) return response.Data;
        return [];
    }
    const handleFormChange = (value, key) => {
        setFormData({ ...formData, [key]: value })
    }
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = invoice.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(invoice.length / rowsPerPage);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        fromDate: firstDayOfMonth,
        toDate: today,
        invDate: today,
        customer: "",
        invoiceNo: "",
    });
    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            console.log("API Response for", endpoint, response);  // 👀 Check here
            setData(extrectArray(response));
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData('/Master/getCustomerdata', setGetCustomer);
    }, []);
    const handleDelete = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your zone has been deleted.',
                    'success'
                );
            }
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const queryParams = new URLSearchParams({
                InvoiceNos: formData.invoiceNo || "",
                InvoiceDate: formData.invDate?.toISOString().split("T")[0] || "",
                BillFrom: formData.fromDate?.toISOString().split("T")[0] || "",
                BillTO: formData.toDate?.toISOString().split("T")[0] || "",
                CustomerName: formData.customer || "",
                BranchName: JSON.parse(localStorage.getItem("Login"))?.Branch_Code || "MUM"
            });

            const response = await getApi(`/Smart/getInvoiceGenerateData?${queryParams.toString()}`);
            console.log(response);

            if (response?.status === 1 && Array.isArray(response.Data)) {
                setInvoice(response.Data);
            } else {
                setInvoice([]);
                Swal.fire("Info", response?.message || "No invoices found", "info");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setInvoice([]);
            Swal.fire("Error", "Failed to fetch invoices", "error");
        } finally {
            setLoading(false);
        }
    };

    /**************** function to export table data in excel and pdf ************/
    // Handle changing page
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const handleOpenInvoicePrint = (invData) => {
        navigate("/firstinvoice", { state: { invoiceData: invData, from: location.pathname } })
    };

    return (
        <>

            <div className="body">
                <div className="container1">
                    <form style={{ margin: "0px", padding: "0px" }} onSubmit={handleSubmit}>
                        <div className="fields2" style={{ display: "flex", alignItems: "center" }}>
                            <div className="input-field1">
                                <label htmlFor="">Customer</label>
                                <Select
                                    options={getCustomer.map(cust => ({
                                        value: cust.Customer_Code,   // adjust keys from your API
                                        label: cust.Customer_Name
                                    }))}
                                    value={
                                        formData.customer
                                            ? { value: formData.customer,label:getCustomer.find(c => c.Customer_Code === formData.customer)?.Customer_Name}
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            customer: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                                    styles={{
                                        placeholder: (base) => ({
                                            ...base,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }),
                                        menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                                    }}
                                    placeholder="Select Customer"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                />

                            </div>
                            <div className="input-field3">
                                <label htmlFor="">From</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.fromDate}
                                    onChange={(date) => handleFormChange(date, "fromDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">To</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.toDate}
                                    onChange={(date) => handleFormChange(date, "toDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>
                            <div className="input-field3">
                                <label htmlFor="">Invoice Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.invDate}
                                    onChange={(date) => handleFormChange(date, "invDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>
                            <div className="input-field3">
                                <label htmlFor="">Invoice No</label>
                                <input type="text" placeholder="Invoice No" value={formData.invoiceNo} onChange={(e) => handleFormChange(e.target.value, "invoiceNo")} />
                            </div>
                            <div className="bottom-buttons" style={{ marginTop: "20px", marginLeft: "10px" }}>
                                <button className="ok-btn" style={{ height: "35px" }} type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                    <div style={{ width: "100%", display: "flex", justifyContent: "end", marginTop: "10px" }}>
                        <div className="search-input">
                            <input style={{}} className="add-input" type="text" placeholder="search" />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>

                    </div>
                    {loading ? (<div className="loader"></div>) : (
                        <div className='table-container' style={{ margin: "0px" }}>
                            <table className="table table-bordered table-sm" style={{ whiteSpace: "nowrap" }}>
                                <thead className="table-sm">
                                    <tr>
                                        <th>Actions</th>
                                        <th>Sr.No</th>
                                        <th>Bill No</th>
                                        <th>Invoice Date</th>
                                        <th>Invoice Due Date</th>
                                        <th>Customer Name</th>
                                        <th>Branch Name</th>
                                        <th>Total Qty</th>
                                        <th>CGST</th>
                                        <th>SGST</th>
                                        <th>IGST</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRows.map((row, index) => (
                                        <tr key={index} style={{ fontSize: "12px", position: "relative" }}>
                                            {/* Actions */}
                                            <td>
                                                <PiDotsThreeOutlineVerticalFill
                                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                                    onClick={() => setOpenRow(openRow === index ? null : index)}
                                                />
                                                {openRow === index && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            flexDirection: "row",
                                                            position: "absolute",
                                                            alignItems: "center",
                                                            left: "70px",
                                                            top: "0px",
                                                            borderRadius: "10px",
                                                            backgroundColor: "white",
                                                            zIndex: "999999",
                                                            height: "30px",
                                                            width: "50px",
                                                            padding: "10px",
                                                        }}
                                                    >
                                                        <button className="edit-btn" onClick={() => handleOpenInvoicePrint(row)}>
                                                            <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: "18px" }}></i>
                                                        </button>
                                                        <button onClick={() => handleDelete(index)} className="edit-btn">
                                                            <i className="bi bi-trash" style={{ fontSize: "18px" }}></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Data columns */}
                                            <td>{index + 1}</td>
                                            <td>{row.BillNo}</td>
                                            <td>{row.InvoiceDate}</td>
                                            <td>{row.InvoiceDue}</td>
                                            <td>{row.Customer_Name}</td>
                                            <td>{row.Branch_Name}</td>
                                            <td>{row.TotalQty}</td>
                                            <td>{row.CGSTAMT}</td>
                                            <td>{row.SGSTAMT}</td>
                                            <td>{row.IGSTAMT}</td>
                                            <td>{row.TotalAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div >)
                    }

                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div className="pagination">
                            <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>{"<"}</button>
                            <span style={{ color: "#333", padding: "5px" }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>{">"}</button>
                        </div>

                        <div className="rows-per-page" style={{ display: "flex", flexDirection: "row", color: "black", marginLeft: "10px" }}>
                            <label style={{ marginTop: "16px", marginRight: "10px" }}>Rows per page:</label>
                            <select style={{ height: "40px", width: "60px", marginTop: "10px" }} value={rowsPerPage} onChange={handleRowsPerPageChange}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={200}>200</option>
                                <option value={500}>500</option>
                            </select>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default ViewInvoice;