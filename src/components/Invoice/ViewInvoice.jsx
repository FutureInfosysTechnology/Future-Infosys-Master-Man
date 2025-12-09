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
import { getApi, deleteApi, putApi, postApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";



function ViewInvoice() {

    const navigate = useNavigate();
    const location = useLocation();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [EditIsOpen, setEditIsOpen] = useState(false);
    const [quary, setQuary] = useState("");
    const [filterData, setFilterData] = useState([]);
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
        invDate: null,
        customer: "ALL CLIENT DATA",
        invoiceNo: "",
    });
    const [modalData, setModalData] = useState({
        billNo: "",
        docketNo: "",
    });

    const [isAllChecked, setIsAllChecked] = useState(false);
    const [term, setTerm] = useState("");
    const [isChecked, setIsChecked] = useState({
        Delivery_Charges: false,
        Hamali_Charges: false,
        ODA_Charges: false,
        Charged_Weight: false,
        Consignee_Name: false,
        Fov_Charges: false,
        Packing_Charges: false,
        Other_Charges: false,
        Fuel_Charges: false,
        Volumetric_Weight: false,
        Docket_Charges: false,
        Green_Charges: false,
        Insurance_Charges: false,
        Actual_Weight: false,
        Rate_Per_Kg: false,
        Term_And_Conditions: false
    });

    const [termArr, setTermArr] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const allOptions = [
        { label: "ALL CLIENT DATA", value: "ALL CLIENT DATA" },
        ...getCustomer.map((cust) => ({
            label: cust.Customer_Name,
            value: cust.Customer_Code,
        })),
    ];
    useEffect(() => {
        const fetchSetup = async () => {
            try {
                const response = await getApi(`/Master/getInvoicesSetup`);

                if (response.status === 1) {
                    const setup = response.data[0];

                    const updatedChecks = {
                        Delivery_Charges: setup.Delivery_Charges,
                        Hamali_Charges: setup.Hamali_Charges,
                        ODA_Charges: setup.ODA_Charges,
                        Charged_Weight: setup.Charged_Weight,
                        Consignee_Name: setup.Consignee_Name,
                        Fov_Charges: setup.Fov_Charges,
                        Packing_Charges: setup.Packing_Charges,
                        Other_Charges: setup.Other_Charges,
                        Fuel_Charges: setup.Fuel_Charges,
                        Volumetric_Weight: setup.Volumetric_Weight,
                        Docket_Charges: setup.Docket_Charges,
                        Green_Charges: setup.Green_Charges,
                        Insurance_Charges: setup.Insurance_Charges,
                        Actual_Weight: setup.Actual_Weight,
                        Rate_Per_Kg: setup.Rate_Per_Kg,
                        Term_And_Conditions:true
                    };

                    setIsChecked(updatedChecks);
                    // If all values are true -> mark select all TRUE
                    const allSelected = Object.values(updatedChecks).every(v => v === true);
                    setIsAllChecked(allSelected);
                    setTermArr(response.Terms1_Conditions);
                }

            } catch (error) {
                console.log("Setup Fetch Error:", error);
            }
        };

        fetchSetup();
    }, []);


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

    const handleUpdate = async (e) => {
    e.preventDefault();

    try {
        // Prepare payload for API
        const requestPayload = {
            ID: 1, // Or your manifest/invoice ID dynamically
            Delivery_Charges: isChecked.Delivery_Charges ? 1 : 0,
            Hamali_Charges: isChecked.Hamali_Charges ? 1 : 0,
            ODA_Charges: isChecked.ODA_Charges ? 1 : 0,
            Charged_Weight: isChecked.Charged_Weight ? 1 : 0,
            Consignee_Name: isChecked.Consignee_Name ? 1 : 0,
            Fov_Charges: isChecked.Fov_Charges ? 1 : 0,
            Packing_Charges: isChecked.Packing_Charges ? 1 : 0,
            Other_Charges: isChecked.Other_Charges ? 1 : 0,
            Fuel_Charges: isChecked.Fuel_Charges ? 1 : 0,
            Volumetric_Weight: isChecked.Volumetric_Weight ? 1 : 0,
            Docket_Charges: isChecked.Docket_Charges ? 1 : 0,
            Green_Charges: isChecked.Green_Charges ? 1 : 0,
            Insurance_Charges: isChecked.Insurance_Charges ? 1 : 0,
            Actual_Weight: isChecked.Actual_Weight ? 1 : 0,
            Rate_Per_Kg: isChecked.Rate_Per_Kg ? 1 : 0,
            Terms_Conditions: isChecked.Term_And_Conditions ? 1 : 0,
            Terms1_Conditions: termArr || [] // Array of terms if any
        };

        const response = await putApi('/Master/updateInvoicesSetup', requestPayload);

        if (response.status === 1) {
            setModalIsOpen(false)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message || 'Something went wrong.'
            });
        }
    } catch (error) {
        console.error("Error updating invoice setup:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong while updating. Please try again.'
        });
    }
};


    const handleCheckChange = (e) => {
        const { name, checked } = e.target;

        // If ALL checkbox is toggled
        if (name === "all") {
            setIsAllChecked(checked); // update main checkbox

            const updated = Object.fromEntries(
                Object.keys(isChecked).map(k => [k, checked])
            );

            setIsChecked(updated);
            return;
        }

        // Individual Checkbox
        setIsChecked(prev => {
            const updated = { ...prev, [name]: checked };

            // If all single checkboxes are true -> selectAll = true
            const allSelected = Object.values(updated).every(v => v === true);
            setIsAllChecked(allSelected);

            return updated;
        });
    };



    useEffect(() => {

        fetchData('/Master/getCustomerdata', setGetCustomer);
    }, []);
    const handleDelete = async (BillNo) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this invoice?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });
        if (confirmDelete.isConfirmed) {
            try {
                await deleteApi(`/Smart/ResetInvoiceBill?BillNo=${BillNo}`);
                setInvoice(invoice.filter(inv => inv.BillNo !== BillNo));
                Swal.fire('Deleted!', 'this invoie has been deleted.', 'success');
            } catch (error) {
                console.error('Unable to delete Customer Rate:', error);
            }
        }
    }
    useEffect(() => {
        const saved = localStorage.getItem("termArr");
        if (saved) setTermArr(JSON.parse(saved));
    }, []);

    // Save whenever it changes
    useEffect(() => {
        localStorage.setItem("termArr", JSON.stringify(termArr));
    }, [termArr]);

    useEffect(() => {
        const filteredRows = currentRows.filter((row) => {
            const q = quary.toLowerCase();

            return (
                String(row.BillNo)?.toLowerCase().includes(q)
            );
        });

        setFilterData(filteredRows);
    }, [quary, currentRows, invoice, currentPage]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const payload = ({
                InvoiceNos: formData.invoiceNo || "",
                InvoiceDate: formData.invDate?.toISOString().split("T")[0] || "",
                BillFrom: formData.fromDate?.toISOString().split("T")[0] || "",
                BillTO: formData.toDate?.toISOString().split("T")[0] || "",
                CustomerName: getCustomer.find(f => f.Customer_Code === formData.customer)?.Customer_Name || "",
                Location_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code || "MUM",
                BranchName: JSON.parse(localStorage.getItem("Login"))?.Branch_Name || "MUMBAI",
                pageSize: rowsPerPage,
                pageNumber: currentPage,
            });

            const response = await postApi(`/Smart/getInvoiceGenerateData`, payload);
            console.log(response);

            if (response?.status === 1 && Array.isArray(response.Data)) {
                setInvoice(response.Data);
            } else {
                setInvoice([]);
                Swal.fire("Not Found", "No invoices found", "info");
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
    const handleOpenInvoicePrint = (invNo) => {
        navigate("/firstinvoice", { state: { invoiceNo: invNo, from: location.pathname, termArr: termArr, tab: "viewInvoice" } })
    };
    const handleAddRow = (e) => {
        e.preventDefault();

        if (!term) {
            Swal.fire({
                icon: 'warning',
                title: 'Input Empty',
                text: 'Terms is required.',
                confirmButtonText: 'OK',
            });
            return;
        }
        if (editIndex !== null) {
            // update existing row
            const updated = [...termArr];
            updated[editIndex] = term;
            setTermArr(updated);
            setEditIndex(null);
        } else {
            // add new row
            setTermArr((prev) => [...prev, term]);
        }
        setTerm("");
    };
    const handleDocketUpdate = async (action, docketNo, billNo, e) => {
        e.preventDefault();
        try {
            if (!docketNo || !billNo) {
                return Swal.fire("Missing Fields", "Docket No & Bill No are required", "warning");
            }

            const endpoint =
                action === "add"
                    ? "/Smart/AddMissingDocketToBill"
                    : "/Smart/RemoveDocketFromBill";

            const response = await putApi(
                `${endpoint}?DocketNo=${docketNo}&BillNo=${billNo}`
            );

            if (response.status === 1 || response.Status === 1) {
                Swal.fire("Success", response.message || response.Message, "success");
                setEditIsOpen(false);
            } else {
                Swal.fire("Failed", response.message || response.Message, "error");
            }

        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <>

            <div className="body">
                <div className="container1">
                    <form style={{ margin: "0px", padding: "0px", backgroundColor: "#f2f4f3" }} onSubmit={(e) => e.preventDefault()}>
                        <div className="fields2" style={{ display: "flex", alignItems: "center" }}>
                            <div className="input-field1">
                                <label htmlFor="">Customer</label>
                                <Select
                                    options={allOptions}
                                    value={
                                        formData.customer
                                            ? allOptions.find(c => c.value === formData.customer)
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
                                <label htmlFor="">Invoice No</label>
                                <input type="text" placeholder="Invoice No" value={formData.invoiceNo} onChange={(e) => handleFormChange(e.target.value, "invoiceNo")} />
                            </div>
                            <div className="bottom-buttons" style={{ marginTop: "20px", marginLeft: "10px" }}>
                                <button className="ok-btn" style={{ height: "35px" }} onClick={handleSubmit}>Submit</button>
                            </div>
                            <div className="bottom-buttons" style={{ marginTop: "20px", marginLeft: "10px" }}>
                                <button className="ok-btn" style={{ height: "35px" }} onClick={() => setModalIsOpen(true)}>SetUp</button>
                            </div>
                            <div style={{ display: "flex", flex: "1", justifyContent: "end", marginTop: "10px" }}>
                                <div className="search-input">
                                    <input
                                        className="add-input"
                                        type="text"
                                        placeholder="Search..."
                                        value={quary}
                                        onChange={(e) => setQuary(e.target.value)}
                                    />

                                    <button type="submit" title="search">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div style={{ width: "100%", display: "flex", justifyContent: "end", marginTop: "10px" }}>


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
                                    {filterData.map((row, index) => (
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
                                                        <button className="edit-btn" onClick={() => { setEditIsOpen(true); setOpenRow(null); setModalData({ billNo: row?.BillNo, docketNo: "" }) }}>
                                                            <i className="bi bi-pen" style={{ fontSize: "18px" }}></i>
                                                        </button>

                                                        <button className="edit-btn" onClick={() => { ; setOpenRow(null); handleOpenInvoicePrint(row.BillNo) }}>
                                                            <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: "18px" }}></i>
                                                        </button>
                                                        <button onClick={() => { ; setOpenRow(null); handleDelete(row.BillNo) }} className="edit-btn">
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
                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-custCharges" contentLabel="Modal"
                        style={{
                            content: {
                                width: '90%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap",
                                height:"80%"

                            },
                        }}>
                        <div className="custom modal-content">
                            <div className="header-tittle">
                                <header>Charges</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleUpdate}>
                                    <div className="fields2">
                                        {/* Select All */}
                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input
                                                type="checkbox"
                                                checked={isAllChecked}
                                                onChange={handleCheckChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                name="all"
                                                id="all"
                                            />
                                            <label htmlFor="all" style={{ marginLeft: "10px", fontSize: "12px" }}>All Select</label>
                                        </div>

                                        {/* Map through all checkboxes */}
                                        {Object.keys(isChecked).map(key => (
                                            <div
                                                className="input-field1"
                                                style={{ display: "flex", flexDirection: "row" }}
                                                key={key}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked[key]}
                                                    onChange={handleCheckChange}
                                                    style={{ width: "12px", height: "12px", marginTop: "5px" }}
                                                    name={key}
                                                    id={key}
                                                />
                                                <label htmlFor={key} style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                    {key.replace(/_/g, " ")}
                                                </label>
                                            </div>
                                        ))}

                                    </div>
                                    <div className='bottom-buttons'>
                                        <button  className='ok-btn'>Submit</button>
                                        <button type="button" onClick={(e) => { setModalIsOpen(false) }} className='ok-btn'>Close</button>
                                    </div>
                                </form>
                            </div>
                            {
                                isChecked.Term_And_Conditions && (
                                    <>

                                        <div className='container2' style={{ borderRadius: "0px", padding: "10px" }}>
                                            <div className="table-container" style={{ borderRadius: "0px" }}>
                                                <table className="table table-bordered table-sm">
                                                    <thead className="table-info">
                                                        <tr>
                                                            <th style={{ width: "95%" }}>Terms & Conditions</th>
                                                            <th style={{ width: "5%" }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="table-body">
                                                        <tr>
                                                            <td>
                                                                <input type="text" placeholder="Enter terms"
                                                                    style={{ textAlign: "start" }} value={term}
                                                                    onChange={(e) => setTerm(e.target.value)} />
                                                            </td>
                                                            <td>
                                                                <button className="ok-btn" style={{ width: "30px", height: "30px" }} onClick={handleAddRow}>
                                                                    <i className="bi bi-plus" style={{ fontSize: "18px" }}></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        {termArr.map((data, index) => (
                                                            <tr key={index}>
                                                                <td>{data}</td>
                                                                <td>
                                                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                                        <button className='edit-btn'
                                                                            onClick={() => {
                                                                                setTerm(data);
                                                                                setEditIndex(index);
                                                                            }}>
                                                                            <i className='bi bi-pen'></i>
                                                                        </button>
                                                                        <button onClick={() => {
                                                                            setTermArr(termArr.filter((_, ind) => ind !== index));
                                                                            setEditIndex(null);
                                                                            setTerm('');
                                                                        }}
                                                                            className='edit-btn'><i className='bi bi-trash'></i></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>

                                )
                            }
                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={EditIsOpen}
                        className="custom-modal-setup" contentLabel="Modal"
                        style={{
                            content: {
                                width: '80%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap",
                                minHeight: "60%",

                            },
                        }}>
                        <div className="custom modal-content">
                            <div className="header-tittle">
                                <header>Add or Remove Docket No</header>
                            </div>

                            <div className='container2'>
                                <form>
                                    <div className="fields2">

                                        <div className="input-field1">
                                            <label htmlFor="">Bill No</label>

                                            <input type="text" placeholder="Enter Bill no"
                                                value={modalData.billNo} readOnly
                                                onChange={(e) => setModalData({ ...modalData, billNo: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-field1">
                                            <label htmlFor="">Docket No</label>

                                            <input type="text" placeholder="Enter Docket no"
                                                value={modalData.docketNo} required
                                                onChange={(e) => setModalData({ ...modalData, docketNo: e.target.value })}
                                            />
                                        </div>
                                        <div className='bottom-buttons' style={{ display: "flex", alignItems: "end", marginTop: "20px", marginLeft: "10px", flexWrap: "wrap" }}>
                                            <button type="submit" className='ok-btn' onClick={(e) => handleDocketUpdate("add", modalData.docketNo, modalData.billNo, e)}>Add</button>
                                            <button type="submit" className='ok-btn' onClick={(e) => handleDocketUpdate("remove", modalData.docketNo, modalData.billNo, e)}>Remove</button>
                                            <button type="button" className='ok-btn' onClick={() => setEditIsOpen(false)}>close</button>
                                        </div>
                                    </div>

                                </form>
                            </div>

                        </div>
                    </Modal >

                </div>
            </div>

        </>
    );
};

export default ViewInvoice;