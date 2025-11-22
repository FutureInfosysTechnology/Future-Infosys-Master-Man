import React, { useEffect, useState } from "react";
import { getApi, postApi, putApi, deleteApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import DatePicker from "react-datepicker";

function ProductionEntry() {
    const extractArray = (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.Data)) return response.Data;
        return [];
    };
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        CreditNote_ID: "",
        date: new Date(),
        customer: "",
        noteNo: "",
        docketNo: "",
        parti: "",
        remark: "",
        amount: "",
        docketNo: "",
    });

    const [getCustomer, setGetCustomer] = useState([]);
    const [creditNotes, setCreditNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openRow, setOpenRow] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = creditNotes.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(creditNotes.length / rowsPerPage);
    function formatDateToYMD(dateStr) {
        if (!dateStr) return "";

        const [dd, mm, yyyy] = dateStr.split("/");

        return `${yyyy}-${mm}-${dd}`;
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    // 🔄 Fetch helper
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
        fetchCreditNotes();
    }, []);

    // 🧾 Get All Credit Notes
    const fetchCreditNotes = async () => {
        try {
            const res = await getApi("/Smart/GetAllCreditNotes");
            setCreditNotes(extractArray(res));
        } catch (err) {
            console.error("Fetch Credit Notes Error:", err);
        }
    };

    // ✍️ Handle input changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 🔁 Reset form
    const handleReset = () => {
        setFormData({
            CreditNote_ID: "",
            date: new Date(),
            customer: "",
            noteNo: "",
            docketNo: "",
            parti: "",
            remark: "",
            amount: "",
        });
        setIsEditMode(false);
        setOpenRow(null);
    };

    // 💾 ADD / SAVE Credit Note
    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.customer || !formData.date || !formData.noteNo) {
            return Swal.fire("Warning", "Customer ,Date and Docket No is required", "warning");
        }


        const payload = {
            Note_No: formData.noteNo,
            Docket_No: formData.docketNo,
            Note_Date: (formData.date),
            Customer_Code: String(formData.customer),
            Particulars: formData.parti,
            Remark: formData.remark,
            Amount: parseFloat(formData.amount),
        };

        try {
            const response = await postApi("/Smart/AddCreditNote", payload, "POST");
            Swal.fire("Success", response.message || "Credit Note Added Successfully", "success");
            handleReset();
            await fetchCreditNotes();
        } catch (err) {
            console.error("Save Error:", err);
            Swal.fire("Error", err.message || "Failed to save credit note", "error");
        }
    };

    // 🧰 UPDATE Credit Note
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!formData.CreditNote_ID) {
            Swal.fire("Warning", "Please select a record to update", "warning");
            return;
        }

        const payload = {
            CreditNote_ID: formData.CreditNote_ID,
            Note_No: formData.noteNo,
            Docket_No: formData.docketNo,
            Note_Date: (formData.date),
            Customer_Code: formData.customer,
            Particulars: formData.parti,
            Remark: formData.remark,
            Amount: parseFloat(formData.amount),
            User: formData.user
        };

        try {
            const response = await putApi("/Smart/UpdateCreditNote", payload);
            Swal.fire("Updated", response.message || "Credit Note Updated Successfully", "success");
            handleReset();
            await fetchCreditNotes();
        } catch (err) {
            console.error("Update Error:", err);
            Swal.fire("Error", err.message || "Failed to update credit note", "error");
        }
    };

    // ❌ DELETE Credit Note
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
            handleReset();
            fetchCreditNotes();
        } catch (err) {
            console.error("Delete Error:", err);
            Swal.fire("Error", err.message || "Failed to delete credit note", "error");
        }
    };

    // 🖱️ Populate form when row clicked
    const handleRowClick = (note) => {
        setFormData({
            CreditNote_ID: note.CreditNote_ID,
            date: formatDateToYMD(note.Note_Date),
            customer: note.Customer_Code,
            noteNo: note.Note_No,
            docketNo: note?.Docket_No,
            parti: note.Particulars,
            remark: note.Remark,
            amount: note.Amount,
        });
        setOpenRow(null);
        setIsEditMode(true);
    };
    const handleOpenCreditPrint = (invNo) => {
        navigate("/creditprint", { state: { invoiceNo: invNo, from: location.pathname, tab: "creditNote" } })
    };
    return (
        <>
            <div className="body">
                <div className="container1">
                    <form onSubmit={handleSave} style={{ margin: "0px", padding: "0px", background: " #f2f4f3" }}>
                        <div className="fields2">
                            <div className="input-field1">
                                <label>Customer</label>
                                <Select
                                    options={getCustomer.map((cust) => ({
                                        value: cust.Customer_Code,
                                        label: cust.Customer_Name
                                    }))}
                                    value={
                                        formData.customer
                                            ? {
                                                value: formData.customer,
                                                label:
                                                    getCustomer.find((c) => c.Customer_Code === formData.customer)
                                                        ?.Customer_Name || ""
                                            }
                                            : null
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
                                <label>Note Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.date}
                                    onChange={(date) => setFormData({ ...formData, date })}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label>Note No</label>
                                <input
                                    type="text"
                                    placeholder="Enter note no"
                                    name="noteNo"
                                    value={formData.noteNo}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="input-field3">
                                <label>Docket No</label>
                                <input
                                    type="text"
                                    placeholder="Enter docket no"
                                    name="docketNo"
                                    value={formData.docketNo}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="input-field3">
                                <label>Invoice No</label>
                                <input
                                    type="text"
                                    placeholder="Enter invoice no"
                                    name="parti"
                                    value={formData.parti}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="input-field3">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleFormChange}
                                />
                            </div>


                            <div className="input-field3">
                                <label>Remark</label>
                                <input
                                    type="text"
                                    placeholder="Enter remark"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleFormChange}
                                />
                            </div>

                            {/* BUTTONS */}
                            <div
                                className="input-field3"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "end",
                                    flexWrap: "wrap",
                                    marginTop: "16px",
                                    padding: "0px",
                                    flex: 1,


                                }}
                            >
                                <div className="bottom-buttons" style={{ padding: "0px" }}>
                                    {!isEditMode && (<button className="ok-btn" onClick={handleSave} style={{ margin: "0px" }}>
                                        Save
                                    </button>)}
                                </div>
                                <div className="bottom-buttons" style={{ padding: "0px" }}>
                                    {isEditMode && (<button type="button" className="ok-btn" onClick={handleUpdate} style={{ margin: "0px" }}>
                                        Update
                                    </button>)}
                                </div>
                                <div className="bottom-buttons" style={{ padding: "0px" }}>
                                    <button className="ok-btn" type="button" onClick={handleReset} style={{ margin: "0px" }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>


                    {/* TABLE */}
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
                                    <tr
                                        key={note.CreditNote_ID}
                                        style={{ fontSize: "12px", position: "relative" }}
                                    >
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
                                                    <button className='edit-btn' onClick={() => handleOpenCreditPrint("001")}>
                                                        <i className='bi bi-file-earmark-pdf-fill' style={{ fontSize: "18px" }}></i>
                                                    </button>
                                                    <button className="edit-btn">
                                                        <i className="bi bi-pen" style={{ fontSize: "15px" }} onClick={() => handleRowClick(note)}></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(note.CreditNote_ID)} className="edit-btn">
                                                        <i className="bi bi-trash" style={{ fontSize: "15px" }}></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td>{note.CreditNote_ID}</td>
                                        <td>{note?.Docket_No}</td>
                                        <td>{note.Note_No}</td>
                                        <td>{note.Note_Date}</td>
                                        <td>{note.Customer_Name}</td>
                                        <td>{note.Particulars}</td>
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
            </div>
        </>
    );
}

export default ProductionEntry;
