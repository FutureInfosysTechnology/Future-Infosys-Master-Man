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



function PendingInvoice() {


    const [invoice, setInvoice] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [editIndex, setEditIndex] = useState(null);
    const [modalData, setModalData] = useState({
        code: '', date: '', shipper: '', receiver: '', from: '', to: '',
        pc: '', weight: '', invoiceno: '', invoicevalue: ''
    });
    const [getCustomer, setGetCustomer] = useState([]);
    const [getBranch, setGetBranch] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const extrectArray = (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.Data)) return response.Data;
        return [];
    }
    const handleFormChange = (value, key) => {
        setFormData({ ...formData, [key]: value })
    }
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = invoice.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(invoice.length / rowsPerPage);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        fromDate: firstDayOfMonth,
        toDate: today,
        customer: "ALL CUSTOMER DATA",
        branch: "ALL BRANCH DATA",
        mode: "ALL MODE DATA",
    });
    // Merge static + API
    const customerOptions = [
        { value: "ALL CUSTOMER DATA", label: "ALL CUSTOMER DATA" },
        ...getCustomer.map(cust => ({
            value: cust.Customer_Code,
            label: cust.Customer_Name
        }))
    ];

    const branchOptions = [
        { value: "ALL BRANCH DATA", label: "ALL BRANCH DATA" },
        ...getBranch.map(branch => ({
            value: branch.Branch_Code,
            label: branch.Branch_Name
        }))
    ];

    const modeOptions = [
        { value: "ALL MODE DATA", label: "ALL MODE DATA" },
        ...getMode.map(mode => ({
            value: mode.Mode_Code,
            label: mode.Mode_Name
        }))
    ];

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const queryParams = new URLSearchParams({
                branchCode: formData.branch || "ALL BRANCH DATA",
                customerCode: formData.customer || "ALL CUSTOMER DATA",
                modeCode: formData.mode || "ALL MODE DATA",
                fromDate: formData.fromDate?.toISOString().split("T")[0] || "",
                toDate: formData.toDate?.toISOString().split("T")[0] || ""
            });

            const response = await getApi(`/Smart/GetPendingInvoice?${queryParams.toString()}`);

            if (response?.status === 1 && Array.isArray(response.Data)) {
                setInvoice(response.Data);
            } else {
                setInvoice([]);
                Swal.fire("Info", response?.message || "No pending invoices found", "info");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            Swal.fire("Error", "Failed to fetch pending invoices", "error");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData('/Master/getCustomerdata', setGetCustomer);
        fetchData('/Master/GetAllBranchData', setGetBranch);
        fetchData('/Master/getMode', setGetMode);
    }, []);

    const handleEdit = (index) => {
        setEditIndex(index);
        setModalData({
            code: invoice[index].code, date: invoice[index].date, shipper: invoice[index].shipper,
            receiver: invoice[index].receiver, from: invoice[index].from, to: invoice[index].to, pc: invoice[index].pc,
            weight: invoice[index].weight, invoiceno: invoice[index].invoiceno, invoicevalue: invoice[index].invoicevalue
        });
        setModalIsOpen(true);
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
                const updatedZones = invoice.filter((_, i) => i !== index);
                setInvoice(updatedZones);
                Swal.fire(
                    'Deleted!',
                    'Your zone has been deleted.',
                    'success'
                );
            }
        });
    };


    const handleSave = () => {
        const updatedZones = [...invoice];
        updatedZones[editIndex] = { id: editIndex + 1, ...modalData };
        setInvoice(updatedZones);
        setModalIsOpen(false);
        setEditIndex(null);
        Swal.fire('Saved!', 'Your changes have been saved.', 'success');
    };

    /**************** function to export table data in excel and pdf ************/
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(invoice);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Zones');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'invoice.xlsx');
    };

    const handleExportPDF = () => {
        const input = document.getElementById('table-to-pdf');

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190; // Set width of the image
            const pageHeight = pdf.internal.pageSize.height; // Get the height of the PDF page
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate the height of the image
            let heightLeft = imgHeight;

            let position = 10;  /****Set the margin top of pdf */

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save('invoice.pdf');
        });
    };

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
    const handleOpenInvoicePrint = (zone) => {
        const code = zone.code;
        const date = zone.date;
        const shipper = zone.shipper;
        const url = `/firstinvoice?manifestNo=${encodeURIComponent(code)}&sumQty=${encodeURIComponent(date)}&sumActualWt=${encodeURIComponent(shipper)}`;
        const newWindow = window.open(
            url,
            '_blank', 'width=900,height=600,fullscreen=yes'
        );

        if (newWindow) {
            newWindow.focus();
        }
    };

    return (
        <>

            <div className="body">
                <div className="container1">
                    <form onSubmit={handleSubmit} style={{ margin: "0px", padding: "0px" }}>
                        <div className="fields2" style={{ display: "flex", alignItems: "center" }}>
                            <div className="input-field1">
                                <label htmlFor="">Customer</label>
                                <Select
                                    options={customerOptions}
                                    value={customerOptions.find(opt => opt.value === formData.customer) || null}
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
                            <div className="input-field1">
                                <label htmlFor="">Branch Name</label>
                                <Select
                                    options={branchOptions}
                                    value={branchOptions.find(opt => opt.value === formData.branch) || null}
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            branch: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Branch"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
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
                                />
                            </div>
                            <div className="input-field1">
                                <label htmlFor="">Branch Name</label>
                                <Select
                                    options={modeOptions}
                                    value={modeOptions.find(opt => opt.value === formData.mode) || null}
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            mode: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Branch"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
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
                            <div className="bottom-buttons" style={{ marginTop: "20px", marginLeft: "10px" }}>
                                <button className="ok-btn" style={{ height: "35px" }} type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                        <div className="dropdown">
                            <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                            <div className="dropdown-content">
                                <button onClick={handleExportExcel}>Export to Excel</button>
                                <button onClick={handleExportPDF}>Export to PDF</button>
                            </div>
                        </div>
                        <div className="search-input">
                            <input style={{ marginLeft: "150px" }} className="add-input" type="text" placeholder="search" />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>

                    </div>
                    {loading ? (<div className="loader"></div>) : (
                    <div className="table-container" style={{ whiteSpace: "nowrap" }}>
                        <table className="table table-bordered table-sm">
                            <thead className="table-sm">
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Docket No</th>
                                    <th>Booking Date</th>
                                    <th>Customer Name</th>
                                    <th>Consignee Name</th>
                                    <th>Mode</th>
                                    <th>From</th>
                                    <th>Branch Name</th>
                                    <th>To</th>
                                    <th>Pcs</th>
                                    <th>Actual Wt</th>
                                    <th>Volumetric Wt</th>
                                    <th>Charged Wt</th>
                                    <th>Invoice No</th>
                                    <th>Invoice Value</th>
                                    <th>E-Way Bill No</th>
                                    <th>Bill No</th>
                                    <th>Payment Type</th>
                                    <th>Type</th>
                                    <th>Rate/Kg</th>
                                    <th>Rate</th>
                                    <th>Fuel %</th>
                                    <th>Fuel Charges</th>
                                    <th>FOV Charges</th>
                                    <th>Docket Charges</th>
                                    <th>ODA Charges</th>
                                    <th>Delivery Charges</th>
                                    <th>Packing Charges</th>
                                    <th>Hamali Charges</th>
                                    <th>Other Charges</th>
                                    <th>Insurance Charges</th>
                                    <th>IGST %</th>
                                    <th>IGST Amt</th>
                                    <th>CGST %</th>
                                    <th>CGST Amt</th>
                                    <th>SGST %</th>
                                    <th>SGST Amt</th>
                                    <th>Total Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {currentRows.length === 0 ? (
                                    <tr>
                                        <td colSpan="100%" className="text-center text-danger">
                                            No Pending Invoices Found
                                        </td>
                                    </tr>
                                ) : (
                                    currentRows.map((zone, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{zone.DocketNo}</td>
                                            <td>{zone.BookDate}</td>
                                            <td>{zone.customerName}</td>
                                            <td>{zone.consigneeName}</td>
                                            <td>{zone.ModeName}</td>
                                            <td>{zone.fromDest}</td>
                                            <td>{zone.Branch_Name}</td>
                                            <td>{zone.toDest}</td>
                                            <td>{zone.pcs}</td>
                                            <td>{zone.actualWt}</td>
                                            <td>{zone.VolumetricWt}</td>
                                            <td>{zone.ChargedWt}</td>
                                            <td>{zone.invoiceNo}</td>
                                            <td>{zone.invoiceValue}</td>
                                            <td>{zone.eWayBillNo}</td>
                                            <td>{zone.BillNo}</td>
                                            <td>{zone.T_Flag}</td>
                                            <td>{zone.DoxSpx}</td>
                                            <td>{zone.RatePerkg}</td>
                                            <td>{zone.Rate}</td>
                                            <td>{zone.FuelPer}</td>
                                            <td>{zone.FuelCharges}</td>
                                            <td>{zone.Fov_Chrgs}</td>
                                            <td>{zone.DocketChrgs}</td>
                                            <td>{zone.ODA_Chrgs}</td>
                                            <td>{zone.DeliveryChrgs}</td>
                                            <td>{zone.PackingChrgs}</td>
                                            <td>{zone.HamaliChrgs}</td>
                                            <td>{zone.OtherCharges}</td>
                                            <td>{zone.InsuranceChrgs}</td>
                                            <td>{zone.IGSTPer}</td>
                                            <td>{zone.IGSTAMT}</td>
                                            <td>{zone.CGSTPer}</td>
                                            <td>{zone.CGSTAMT}</td>
                                            <td>{zone.SGSTPer}</td>
                                            <td>{zone.SGSTAMT}</td>
                                            <td>{zone.TotalAmt}</td>
                                            <td>
                                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                    <button className="edit-btn" onClick={() => handleOpenInvoicePrint(zone)}>
                                                        <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: "20px" }}></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(index)} className="edit-btn">
                                                        <i className="bi bi-trash" style={{ fontSize: "20px" }}></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>)}



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
                        style={{
                            content: {
                                top: '50%',
                                left: '55%',
                                right: 'auto',
                                bottom: 'auto',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                height: '253px',
                                width: '650px',
                                borderRadius: '10px',
                                padding: "0px"
                            },
                        }}>
                        <div>
                            <div className="header-tittle">
                                <header>View Invoice</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>

                                    <div className="fields2">
                                        <div className="input-field">
                                            <label htmlFor="mode-select" className="label">Mode Name</label>
                                            <select name="" id="mode-select" value={modalData.mode}
                                                onChange={(e) => setModalData({ ...modalData, mode: e.target.value })}>
                                                <option value="" disabled>Select Mode</option>
                                                <option value="Air">Air</option>
                                                <option value="Road">Road</option>
                                            </select>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">State Name</label>
                                            <select name="" id="" value={modalData.name}
                                                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}>
                                                <option value="" disabled>Select State</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Delhi">Delhi</option>
                                                <option value="Karnataka">Karnataka</option>
                                                <option value="Goa">Goa</option>
                                                <option value="Punjab">Punjab</option>
                                                <option value="Rajasthan">Rajasthan</option>
                                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                <option value="Bihar">Bihar</option>
                                                <option value="Haryana">Haryana</option>
                                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                            </select>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Vendor Name</label>
                                            <select name="" id="">
                                                <option value="" disabled>Select Vendor</option>
                                                <option value="">1</option>
                                                <option value="">2</option>
                                            </select>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Zone Name</label>
                                            <select name="" id="">
                                                <option value="" disabled>Select Zone</option>
                                                <option value="">1</option>
                                                <option value="">2</option>
                                            </select>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Country Name</label>
                                            <select name="" id="">
                                                <option value="" disabled>Select Country</option>
                                                <option value="">India</option>
                                                <option value="">United State Of America</option>
                                                <option value="">China</option>
                                                <option value="">Russia</option>
                                                <option value="">South Korea</option>
                                                <option value="">Nepal</option>
                                            </select>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Destination</label>
                                            <select name="" id="">
                                                <option value="" disabled>Select Destination</option>
                                                <option value="">1</option>
                                                <option value="">2</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className='bottom-buttons' style={{ marginTop: "20px" }}>
                                        <button type='submit' className='ok-btn'>Submit</button>
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
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

export default PendingInvoice;