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



function ViewInvoice() {


    const [zones, setZones] = useState([{ code: "INV001", date: "2025-08-25", shipper: "ABC Pvt Ltd", receiver: "XYZ Ltd", from: "Mumbai", to: "Delhi", pc: "5", weight: "50", invoiceno: "1001", invoicevalue: "5000" },
    { code: "INV002", date: "2025-08-26", shipper: "LMN Pvt Ltd", receiver: "OPQ Ltd", from: "Pune", to: "Bangalore", pc: "3", weight: "20", invoiceno: "1002", invoicevalue: "3000" }]);
    const [editIndex, setEditIndex] = useState(null);
    const [modalData, setModalData] = useState({
        code: '', date: '', shipper: '', receiver: '', from: '', to: '',
        pc: '', weight: '', invoiceno: '', invoicevalue: ''
    });
    const [getCustomer, setGetCustomer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const extrectArray = (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.Data)) return response.Data;
        return [];
    }
    const handleFormChange = (value, key) => {
        setFormData({ ...formData, [key]: value })
    }
    const [openRow, setOpenRow] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = zones.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(zones.length / rowsPerPage);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        fromDate: firstDayOfMonth,
        toDate: today,
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
    const handleEdit = (index) => {
        setEditIndex(index);
        setModalData({
            code: zones[index].code, date: zones[index].date, shipper: zones[index].shipper,
            receiver: zones[index].receiver, from: zones[index].from, to: zones[index].to, pc: zones[index].pc,
            weight: zones[index].weight, invoiceno: zones[index].invoiceno, invoicevalue: zones[index].invoicevalue
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
                const updatedZones = zones.filter((_, i) => i !== index);
                setZones(updatedZones);
                Swal.fire(
                    'Deleted!',
                    'Your zone has been deleted.',
                    'success'
                );
            }
        });
    };


    const handleSave = () => {
        const updatedZones = [...zones];
        updatedZones[editIndex] = { id: editIndex + 1, ...modalData };
        setZones(updatedZones);
        setModalIsOpen(false);
        setEditIndex(null);
        Swal.fire('Saved!', 'Your changes have been saved.', 'success');
    };

    /**************** function to export table data in excel and pdf ************/
    // Handle changing page
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
                    <form style={{ margin: "0px", padding: "0px" }}>
                        <div className="fields2" style={{ display: "flex", alignItems: "center" }}>
                            <div className="input-field3">
                                <label htmlFor="">Customer</label>
                                <Select
                                    options={getCustomer.map(cust => ({
                                        value: cust.Customer_Code,   // adjust keys from your API
                                        label: cust.Customer_Name
                                    }))}
                                    value={
                                        formData.customer
                                            ? getCustomer.find(c => c.Customer_Code === formData.customer)
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
                    <div className='table-container' style={{ margin: "0px" }}>
                        <table className='table table-bordered table-sm'>
                            <thead className='table-sm'>
                                <tr>
                                    <th scope="col">Actions</th>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Customer Name</th>
                                    <th scope="col">City Name</th>
                                    <th scope="col">Bill No</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Total GST</th>
                                    <th scope="col">Sub Total(Amt + Gst)</th>
                                    <th scope="col">Invoice Date</th>
                                    <th scope="col">From Date</th>
                                    <th scope="col">To Date</th>
                                    
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((zone, index) => (
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
                                                     <button className='edit-btn' onClick={() => handleOpenInvoicePrint(zone)}>
                                                    <i className='bi bi-file-earmark-pdf-fill' style={{ fontSize: "18px" }}></i>
                                                </button>
                                                <button onClick={() => handleDelete(index)} className='edit-btn'>
                                                    <i className='bi bi-trash' style={{ fontSize: "18px" }}></i>
                                                </button>
                                                </div>
                                            )}</td>
                                        <td>{index + 1}</td>
                                        <td>{zone.receiver}</td>
                                        <td>{zone.from}</td>
                                        <td>{zone.code}</td>
                                        <td>{zone.pc}</td>
                                        <td>{zone.pc}</td>
                                        <td>{zone.weight}</td>
                                        <td>{zone.date}</td>
                                        <td>{zone.date}</td>
                                        <td>{zone.date}</td>
                                        <td>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            {'<'}
                        </button>
                        <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                        <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            {'>'}
                        </button>
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

export default ViewInvoice;