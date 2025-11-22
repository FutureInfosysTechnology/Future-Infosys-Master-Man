import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom"
import { getApi, deleteApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
function CreditPrint() {
    const extractArray = (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.Data)) return response.Data;
        return [];
    };
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creditNotes, setCreditNotes] = useState([]);
    const [getCustomer, setGetCustomer] = useState([]);
    const [formData, setFormData] = useState({
        from: firstDayOfMonth,
        to: today,
        customer: "",
        Note_No: "",
    })
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openRow, setOpenRow] = useState(null);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = creditNotes.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(creditNotes.length / rowsPerPage);
    const allCust = [
        { value: "", label: "All CUSTOMER DATA" },   // Add ALL option
        ...getCustomer.map((cust) => ({
            value: cust.Customer_Code,
            label: cust.Customer_Name
        }))
    ]

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const location = useLocation();
    console.log(formData);
    const navigate = useNavigate();
    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            setData(extractArray(response));
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // 🧠 Load Customers and Credit Notes
    useEffect(() => {
        fetchData("/Master/getCustomerdata", setGetCustomer);
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await getApi(`/Smart/GetCreditNote?Note_No=${formData.Note_No}&FromDate=${formData.from.toISOString().split("T")[0]}&ToDate=${formData.to.toISOString().split("T")[0]}&Customer_Code=${formData.customer}&page=${currentPage}&limit=${rowsPerPage}`);
            if (response.data.length > 0) {
                console.log(response);
                console.log(response.data);
                setCreditNotes(response.data);
                Swal.fire("Success", response.message || "Credit Note records are fetched", "success");
            }
            else {
                Swal.fire("Warning", `No Record Found`, "warning");
                setCreditNotes([]);
            }
        }
        catch (error) {
            console.error("API Error:", error);
        }
        finally {
        }
    }

    const handleDelete = async (CreditNote_ID) => {
        setOpenRow(null);
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the credit note.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        });

        if (!confirm.isConfirmed) return;

        try {
            const response = await deleteApi(`/Smart/DeleteCreditNote?CreditNote_ID=${CreditNote_ID}`);
            Swal.fire("Deleted!", response.message || "Credit Note Deleted Successfully", "success");
            setCreditNotes(creditNotes.filter(d => d.CreditNote_ID !== CreditNote_ID));
        } catch (err) {
            console.error("Delete Error:", err);
            Swal.fire("Error", err.message || "Failed to delete credit note", "error");
        }
    };

    const handleOpenCreditPrint = (invNo) => {
        navigate("/creditprint", { state: { invoiceNo: invNo, from: location.pathname, tab: "creditPrint" } })
    };

    return (
        <>
            <div className="container1">
                <form onSubmit={handleSubmit} style={{ background: " #f2f4f3" }}>
                    <div className="fields2">
                        <div className="input-field1">
                            <label>Customer</label>
                            <Select
                                options={allCust}  // [{value: "", label: "All Customers"}, ...]
                                value={
                                    allCust.find((c) => c.value === formData.customer) || null
                                }
                                onChange={(selectedOption) =>
                                    setFormData({
                                        ...formData,
                                        customer: selectedOption ? selectedOption.value : ""
                                    })
                                }
                                menuPortalTarget={document.body}
                                styles={{
                                    container: (base) => ({ ...base, width: "100%" }),
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
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
                                selected={formData.from}
                                onChange={(date) => setFormData({ ...formData, from: date })}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                            />
                        </div>
                        <div className="input-field3">
                            <label htmlFor="">To</label>
                            <DatePicker
                                portalId="root-portal"
                                selected={formData.to}
                                onChange={(date) => setFormData({ ...formData, to: date })}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                            />
                        </div>


                        <div className="input-field3">
                            <label htmlFor="">Note No</label>
                            <input type="text" placeholder="Enter Note no" value={formData.Note_No}
                                onChange={(e) => setFormData({ ...formData, Note_No: e.target.value })} />
                        </div>



                        <div className="bottom-buttons" style={{ marginTop: "22px", marginLeft: "12px" }}>
                            <button type='submit' className='ok-btn'>Submit</button>
                            <button type="button" className='ok-btn' onClick={() => {
                                setFormData({
                                    from: firstDayOfMonth,
                                    to: today,
                                    customer: "",
                                    Note_No: "",
                                })
                            }}>Cancel</button>
                        </div>
                    </div>
                </form>
                <div className="table-container">
                    <table className="table table-bordered table-sm" style={{ whiteSpace: "nowrap" }}>
                        <thead className="table-head">
                            <tr>
                                <th>Actions</th>
                                <th>ID</th>
                                <th>Docket No</th>
                                <th>Note No</th>
                                <th>Note Date</th>
                                <th>Customer Name</th>
                                <th>Invoice No</th>
                                <th>Remark</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentRows.map((note, index) => (
                                <tr key={note.CreditNote_ID} style={{ fontSize: "12px", position: "relative" }}>
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
                                                    left: "100px",
                                                    top: "0px",
                                                    borderRadius: "10px",
                                                    backgroundColor: "white",
                                                    zIndex: "999999",
                                                    height: "30px",
                                                    width: "50px",
                                                    padding: "10px",
                                                }}
                                            >
                                                <button className='edit-btn'>
                                                    <i className='bi bi-file-earmark-pdf-fill' onClick={() => handleOpenCreditPrint("001")} style={{ fontSize: "18px" }} ></i>
                                                </button>
                                                <button className="edit-btn">
                                                    <i className="bi bi-trash" onClick={() => handleDelete(note?.CreditNote_ID)} style={{ fontSize: "15px" }}></i>
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td>{note.CreditNote_ID}</td>
                                    <td>{note.Docket_No}</td>
                                    <td>{note.Note_No}</td>
                                    <td>{note.Note_Date}</td>
                                    <td>{note.Customer_Name}</td>
                                    <td>{note.Particulars}</td> {/* matches API */}
                                    <td>{note.Remark}</td>
                                    <td>{note.Amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="row" style={{ whiteSpace: "nowrap" }}>
                    <div className="pagination col-12 col-md-6 d-flex justify-content-center align-items-center mb-2 mb-md-0">
                        <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            {'<'}
                        </button>
                        <span style={{ color: "#333", padding: "5px" }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            {'>'}
                        </button>
                    </div>

                    <div className="rows-per-page col-12 col-md-6 d-flex justify-content-center justify-content-md-end align-items-center">
                        <label htmlFor="rowsPerPage" className="me-2">Rows per page: </label>
                        <select
                            id="rowsPerPage"
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            style={{ height: "40px", width: "50px" }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

            </div>
        </>
    )
}

export default CreditPrint;