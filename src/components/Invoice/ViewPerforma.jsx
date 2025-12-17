import { useState } from "react";
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";



function ViewPerforma() {
    const navigate = useNavigate();
    const location = useLocation();

    const [invoice, setInvoice] = useState([])
    const [openRow, setOpenRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
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
        invDate: firstDayOfMonth,
        dueDate: today,
        invoiceNo: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            

            const queryParams = new URLSearchParams({
                invoiceNos: formData.invoiceNo,
                invoiceDate: formData.invDate?.toISOString().split("T")[0] || "",
                invoiceDue: formData.dueDate?.toISOString().split("T")[0] || "",
                pageSize: rowsPerPage,
                pageNumber: currentPage,
                locationCode: JSON.parse(localStorage.getItem("Login"))?.Branch_Code || "MUM",
                // branchName: JSON.parse(localStorage.getItem("Login"))?.Branch_Name || "MUMBAI",
            });

            const response = await getApi(`/Smart/GetProformaInvoicesGroupby?${queryParams.toString()}`);
            console.log(response);
            if (response?.status === 1 && Array.isArray(response.data)) {
                setInvoice(response.data);
            } else {
                setInvoice([]);
                Swal.fire("Info", response?.message || "No Performa invoices found", "info");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setInvoice([]);
            Swal.fire("Error", "Failed to fetch performa invoices", "error");
        } 
    };
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
    const handleOpenInvoicePrint = (invNo) => {
        navigate("/performanceinvoice", { state: { invoiceNo: invNo, from: location.pathname, tab: "viewPerformance" } })
    };

    return (
        <>

            <div className="body">
                <div className="container1">
                    <form style={{ margin: "0px", padding: "0px", backgroundColor: "#f2f4f3" }} onSubmit={handleSubmit}>
                        <div className="fields2" style={{ display: "flex", alignItems: "center" }}>
                            <div className="input-field3">
                                <label htmlFor="">Invoice No</label>
                                <input type="text" placeholder="Invoice No" value={formData.invoiceNo} onChange={(e) => handleFormChange(e.target.value, "invoiceNo")} />
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
                                <label htmlFor="">Due Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.dueDate}
                                    onChange={(date) => handleFormChange(date, "dueDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>
                            <div className="bottom-buttons" style={{ marginTop: "20px", marginLeft: "10px" }}>
                                <button className="ok-btn" style={{ height: "35px" }} type="submit">Submit</button>
                            </div>

                            <div style={{ display: "flex", flex: "1", justifyContent: "end", marginTop: "10px" }}>
                                <div className="search-input mt-2">
                                    <input style={{}} className="add-input" type="text" placeholder="search" />
                                    <button type="submit" title="search">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>

                            </div>

                        </div>
                    </form>

                    {loading ? (<div className="loader"></div>) : (
                        <div className='table-container' style={{ margin: "0px" }}>
                            <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                                <thead className='table-sm'>
                                    <tr>
                                        <th>Actions</th>
                                        <th>Sr.No</th>
                                        <th>Invoice No</th>
                                        <th>Invoice Date</th>
                                        <th>Invoice Due Date</th>
                                        <th>Docket No</th>
                                        <th>Qty</th>
                                        <th>Total Weight</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRows.map((row, index) => (
                                        <tr key={index} style={{ fontSize: "12px", position: "relative" }}>
                                            <td><PiDotsThreeOutlineVerticalFill
                                                style={{ fontSize: "20px", cursor: "pointer" }}
                                                onClick={() =>
                                                    setOpenRow(openRow === index ? null : index) // toggle only this row
                                                }
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
                                                            padding: "10px"
                                                        }}
                                                    >
                                                        <button className='edit-btn' onClick={() => handleOpenInvoicePrint(row.InvoiceNo)}>
                                                            <i className='bi bi-file-earmark-pdf-fill' style={{ fontSize: "18px" }}></i>
                                                        </button>
                                                        <button onClick={() => handleDelete(index)} className='edit-btn'>
                                                            <i className='bi bi-trash' style={{ fontSize: "18px" }}></i>
                                                        </button>
                                                    </div>
                                                )}</td>
                                            <td>{index + 1}</td>
                                            <td>{row.InvoiceNo}</td>
                                            <td>{row.InvoiceDate}</td>
                                            <td>{row.InvoiceDue}</td>
                                            <td>{row.DocketNo}</td>
                                            <td>{row.Qty}</td>
                                            <td>{row.TotalWeight}</td>

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
                </div >
            </div >

        </>
    );
};

export default ViewPerforma;