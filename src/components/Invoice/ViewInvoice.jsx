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
import { getApi ,deleteApi} from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";



function ViewInvoice() {


    const navigate = useNavigate();
    const location = useLocation();
    const [modalIsOpen, setModalIsOpen] = useState(false);
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
    const [isFovChecked, setIsFovChecked] = useState(false);
    const [isTermChecked, setIsTermChecked] = useState(false);
    const [isConsigChecked, setIsConsigChecked] = useState(false);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [isDocketChecked, setIsDocketChecked] = useState(false);
    const [isDeliveryChecked, setIsDeliveryChecked] = useState(false);
    const [isPackingChecked, setIsPackingChecked] = useState(false);
    const [isGreenChecked, setIsGreenChecked] = useState(false);
    const [isHamaliChecked, setIsHamaliChecked] = useState(false);
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [isInsuranceChecked, setIsInsuranceChecked] = useState(false);
    const [isODAChecked, setIsODAChecked] = useState(false);
    const [isFuelChecked, setIsFuelChecked] = useState(false);
    const [isCharedChecked, setIsCharedChecked] = useState(false);
    const [isVolChecked, setIsVolChecked] = useState(false);
    const [isActualChecked, setIsActualChecked] = useState(false);
    const [isRateChecked, setIsRateChecked] = useState(false);
    const [term, setTerm] = useState("");
    const [termArr, setTermArr] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
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
    const handleCheckboxChange = (field, value) => {
        const newState = {
            [field]: value
        };
        const currentState = JSON.parse(localStorage.getItem("toggelChargs")) || {};
        localStorage.setItem("toggelChargs", JSON.stringify({ ...currentState, ...newState }));
    };
    const handleAllChange = () => {
        const newValue = !isAllChecked;

        setIsAllChecked(newValue);

        const allFields = {
            isAllChecked: newValue,
            isFovChecked: newValue,
            isDocketChecked: newValue,
            isDeliveryChecked: newValue,
            isPackingChecked: newValue,
            isGreenChecked: newValue,
            isHamaliChecked: newValue,
            isOtherChecked: newValue,
            isInsuranceChecked: newValue,
            isODAChecked: newValue,
            isFuelChecked: newValue,
            isTermChecked: newValue,
            isCharedChecked: newValue,
            isActualChecked: newValue,
            isVolChecked: newValue,
            isRateChecked: newValue,
            isConsigChecked:newValue,
        };
        // Update React states
        setIsAllChecked(newValue);
        setIsFovChecked(newValue);
        setIsDocketChecked(newValue);
        setIsDeliveryChecked(newValue);
        setIsPackingChecked(newValue);
        setIsGreenChecked(newValue);
        setIsHamaliChecked(newValue);
        setIsOtherChecked(newValue);
        setIsInsuranceChecked(newValue);
        setIsODAChecked(newValue);
        setIsFuelChecked(newValue);
        setIsTermChecked(newValue);
        setIsCharedChecked(newValue);
        setIsActualChecked(newValue);
        setIsVolChecked(newValue);
        setIsRateChecked(newValue);
        setIsConsigChecked(newValue);
        // Save to localStorage
        localStorage.setItem("toggelChargs", JSON.stringify(allFields));
    };
    useEffect(() => {
        const allFields = {
            isFovChecked,
            isDocketChecked,
            isDeliveryChecked,
            isPackingChecked,
            isGreenChecked,
            isHamaliChecked,
            isOtherChecked,
            isInsuranceChecked,
            isODAChecked,
            isFuelChecked,
            isTermChecked,
            isActualChecked,
            isCharedChecked,
            isVolChecked,
            isRateChecked,
            isConsigChecked,
        };

        // Check if all are true
        const allChecked = Object.values(allFields).every(Boolean);
        setIsAllChecked(allChecked);
        handleCheckboxChange('isAllChecked', allChecked)
    }, [
        isFovChecked,
        isDocketChecked,
        isDeliveryChecked,
        isPackingChecked,
        isGreenChecked,
        isHamaliChecked,
        isOtherChecked,
        isInsuranceChecked,
        isODAChecked,
        isFuelChecked,
        isTermChecked,
        isActualChecked,
        isCharedChecked,
        isVolChecked,
        isRateChecked,
        isConsigChecked,
    ]);

    const handleFovChange = (e) => {
        setIsFovChecked(e.target.checked);

        handleCheckboxChange('isFovChecked', e.target.checked);
    }

    const handleTermChange = (e) => {
        setIsTermChecked(e.target.checked);
        handleCheckboxChange('isTermChecked', e.target.checked);
    }

    const handleConsigChange = (e) => {
        setIsConsigChecked(e.target.checked);
        handleCheckboxChange('isConsigChecked', e.target.checked);
    }

    const handleDocketChange = (e) => {
        setIsDocketChecked(e.target.checked);

        handleCheckboxChange('isDocketChecked', e.target.checked);
    }

    const handleDeliveryChange = (e) => {
        setIsDeliveryChecked(e.target.checked);

        handleCheckboxChange('isDeliveryChecked', e.target.checked);
    }

    const handlePackingChange = (e) => {
        setIsPackingChecked(e.target.checked);
        handleCheckboxChange('isPackingChecked', e.target.checked);
    }

    const handleGreenChange = (e) => {
        setIsGreenChecked(e.target.checked);

        handleCheckboxChange('isGreenChecked', e.target.checked);
    }

    const handleHamaliChange = (e) => {
        setIsHamaliChecked(e.target.checked);

        handleCheckboxChange('isHamaliChecked', e.target.checked);
    }

    const handleOtherChange = (e) => {
        setIsOtherChecked(e.target.checked);

        handleCheckboxChange('isOtherChecked', e.target.checked);
    }

    const handleInsuranceChange = (e) => {
        setIsInsuranceChecked(e.target.checked);

        handleCheckboxChange('isInsuranceChecked', e.target.checked);
    }

    const handleODAChange = (e) => {
        setIsODAChecked(e.target.checked);

        handleCheckboxChange('isODAChecked', e.target.checked);
    }

    const handleFuelChange = (e) => {
        setIsFuelChecked(e.target.checked);

        handleCheckboxChange('isFuelChecked', e.target.checked);
    }
    const handleRateChange = (e) => {
        setIsRateChecked(e.target.checked);

        handleCheckboxChange('isRateChecked', e.target.checked);
    }
    const handleActualChange = (e) => {
        setIsActualChecked(e.target.checked);

        handleCheckboxChange('isActualChecked', e.target.checked);
    }
    const handleVolChange = (e) => {
        setIsVolChecked(e.target.checked);

        handleCheckboxChange('isVolChecked', e.target.checked);
    }
    const handleCharedChange = (e) => {
        setIsCharedChecked(e.target.checked);

        handleCheckboxChange('isCharedChecked', e.target.checked);
    }

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("toggelChargs"));
        if (savedState) {
            setIsAllChecked(savedState.isAllChecked || false);
            setIsFovChecked(savedState.isFovChecked || false);
            setIsTermChecked(savedState.isTermChecked || false);
            setIsDocketChecked(savedState.isDocketChecked || false);
            setIsDeliveryChecked(savedState.isDeliveryChecked || false);
            setIsPackingChecked(savedState.isPackingChecked || false);
            setIsGreenChecked(savedState.isGreenChecked || false);
            setIsHamaliChecked(savedState.isHamaliChecked || false);
            setIsOtherChecked(savedState.isOtherChecked || false);
            setIsInsuranceChecked(savedState.isInsuranceChecked || false);
            setIsODAChecked(savedState.isODAChecked || false);
            setIsFuelChecked(savedState.isFuelChecked || false);
            setIsRateChecked(savedState.isRateChecked || false);
            setIsActualChecked(savedState.isActualChecked || false);
            setIsVolChecked(savedState.isVolChecked || false);
            setIsCharedChecked(savedState.isCharedChecked || false);
            setIsConsigChecked(savedState.isConsigChecked || false)

        }
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
                   setInvoice(invoice.filter(inv=>inv.BillNo!==BillNo));
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
                Location_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code || "MUM",
                BranchName: JSON.parse(localStorage.getItem("Login"))?.Branch_Name || "MUMBAI",
                pageSize: rowsPerPage,
                pageNumber: currentPage,
            });

            const response = await getApi(`/Smart/getInvoiceGenerateData?${queryParams.toString()}`);
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
        navigate("/firstinvoice", { state: { invoiceNo: invNo, from: location.pathname, termArr: termArr } })
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
    return (
        <>

            <div className="body">
                <div className="container1">
                    <form style={{ margin: "0px", padding: "0px" }} onSubmit={(e) => e.preventDefault()}>
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
                                            ? { value: formData.customer, label: getCustomer.find(c => c.Customer_Code === formData.customer)?.Customer_Name }
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
                                <button className="ok-btn" style={{ height: "35px" }} onClick={handleSubmit}>Submit</button>
                            </div>
                            <div className="bottom-buttons" style={{ marginTop: "20px", marginLeft: "10px" }}>
                                <button className="ok-btn" style={{ height: "35px" }} onClick={() => setModalIsOpen(true)}>SetUp</button>
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
                                                        <button className="edit-btn" onClick={() => handleOpenInvoicePrint(row.BillNo)}>
                                                            <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: "18px" }}></i>
                                                        </button>
                                                        <button onClick={() => handleDelete(row.BillNo)} className="edit-btn">
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
                        className="custom-modal-setup" contentLabel="Modal"
                        style={{
                            content: {
                                width: '80%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap",
                                minHeight: "60%",
                                display: "flex",
                                justifyContent: "center",

                            },
                        }}>
                        <div className="custom modal-content">
                            <div className="header-tittle">
                                <header>Charges</header>
                            </div>

                            <div className='container2'>
                                <form>
                                    <div className="fields2">
                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isAllChecked}
                                                onChange={handleAllChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fov" id="fov" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                All Select</label>
                                        </div>
                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isFovChecked}
                                                onChange={handleFovChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fov" id="fov" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Fov_Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isDocketChecked}
                                                onChange={handleDocketChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="docket" id="docket" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Docket_Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isDeliveryChecked}
                                                onChange={handleDeliveryChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="delivery" id="delivery" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Delivery_Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isPackingChecked}
                                                onChange={handlePackingChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="packing" id="packing" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Packing_Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isGreenChecked}
                                                onChange={handleGreenChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="green" id="green" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Green_Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isHamaliChecked}
                                                onChange={handleHamaliChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="hamali" id="hamali" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Hamali_Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isOtherChecked}
                                                onChange={handleOtherChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="other" id="other" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Other_Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isInsuranceChecked}
                                                onChange={handleInsuranceChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="insurance" id="insurance" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Insurance_Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isODAChecked}
                                                onChange={handleODAChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="oda" id="oda" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                ODA_Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isFuelChecked}
                                                onChange={handleFuelChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fuel" id="fuel" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Fuel_Charges</label>
                                        </div>
                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isActualChecked}
                                                onChange={handleActualChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fuel" id="fuel" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Actual_Weight</label>
                                        </div>
                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isCharedChecked}
                                                onChange={handleCharedChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fuel" id="fuel" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Charged_Weight</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isVolChecked}
                                                onChange={handleVolChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fuel" id="fuel" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Volumetric_Weight</label>
                                        </div>
                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isRateChecked}
                                                onChange={handleRateChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fuel" id="fuel" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Rate_Per_Kg</label>
                                        </div>
                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isConsigChecked}
                                                onChange={handleConsigChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fuel" id="fuel" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Consignee_Name</label>
                                        </div>
                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isTermChecked}
                                                onChange={handleTermChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fuel" id="fuel" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Terms & Conditions</label>
                                        </div>
                                    </div>
                                    <div className='bottom-buttons'>
                                        <button onClick={(e) => { e.preventDefault(); setModalIsOpen(false) }} className='ok-btn'>close</button>
                                    </div>
                                </form>
                            </div>
                            {
                                isTermChecked && (
                                    <>
                                        {/* <div className="header-tittle"> */}
                                        {/* <header>Terms & Conditions</header> */}
                                        {/* </div> */}
                                        <div className='container2' style={{ borderRadius: "0px" }}>
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

                </div>
            </div>

        </>
    );
};

export default ViewInvoice;