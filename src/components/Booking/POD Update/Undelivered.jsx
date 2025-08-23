import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';
import 'react-toggle/style.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';




function Undelivered() {
    const today = new Date();
    const time = String(today.getHours()).padStart(2, "0") + ":" + String(today.getMinutes()).padStart(2, "0");
    const [zones, setZones] = useState([]);

    const [editIndex, setEditIndex] = useState(null);
    const [modalData, setModalData] = useState({ code: '', name: '' });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState({
            DocketNo: '',
            toDate: today,
            time: time,
            Status: "",
            Reciept: "",
    
        });
         const statusOptions = [
        { value: "Arrived", label: "Arrived" },
        { value: "Schedule", label: "Schedule" },
        { value: "Dispatch", label: "Dispatch" },
        { value: "Delivered", label: "Delivered" },
        { value: "Return", label: "Return" }  // (maybe you meant "Return"?)
    ];
    const handleDateChange = (date, field) => {
          setFormData({ ...formData, [field]: date });
    };
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = zones.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(zones.length / rowsPerPage);

    const handleEdit = (index) => {
        setEditIndex(index);
        setModalData({ code: zones[index].code, name: zones[index].name });
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

    const handleSave = (index) => {
        const updatedZones = [...zones];
        updatedZones[editIndex] = { id: editIndex + 1, ...modalData };
        setZones(updatedZones);
        setEditIndex(null);
        setModalIsOpen(false);
        Swal.fire('Saved!', 'Your changes have been saved.', 'success');
    };



    /**************** function to export table data in excel and pdf ************/
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(zones);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Zones');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'zones.xlsx');
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

            pdf.save('zones.pdf');
        });
    };

    // Handle changing page
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    return (
        <>

            <div className="body">
                <div className="container1">

                    <header style={{ color: "black", fontSize: "18px", fontWeight: "600" }}>Undelivered Master</header>

                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>

                        <div className="fields2">
                            <div className="input-field3">
                                <label htmlFor="">Docket No</label>
                                <input type="tel" placeholder="Enter Docket No" value={formData.DocketNo}
                                    onChange={(e) => setFormData({ ...formData, DocketNo: e.target.value })} />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Status</label>
                                <Select
                                    options={statusOptions}
                                    value={statusOptions.find(opt => opt.value === formData.Status) || null}
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            Status: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Status"
                                    required
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
                                <label htmlFor="">Date</label>
                                <DatePicker
                                                                    selected={formData.toDate}
                                                                    onChange={(date) => handleDateChange(date, "toDate")}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    className="form-control form-control-sm"
                                                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Time</label>
                                <input type="time" value={formData.time} onChange={(e) => { setFormData({ ...formData, time: e.target.value }) }} />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Nature Of Receipt</label>
                               <Select
                                    options={statusOptions}
                                    value={statusOptions.find(opt => opt.value === formData.Reciept) || null}
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            Reciept: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Reciept"
                                    required
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
                                <label htmlFor="">Receiver Name</label>
                                <input type="text" placeholder="Enter Receiver Name" />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Mobile No</label>
                                <input type="tel" maxLength="10" id="mobile"
                                    name="mobile" pattern="[0-9]{10}" placeholder="Enter Mobile No" />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Remark</label>
                                <input type="text" placeholder="Enter Remark" />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Upload Image</label>
                                <input style={{ padding: "5px" }} type="file" />
                            </div>

                            <div className="input-field3">
                                <label htmlFor=""></label>
                            </div>

                            <div className="input-field3">
                                <label style={{ marginBottom: "18px" }}></label>
                                <button style={{ height: "40px", width:"60px" }} className="ok-btn">Submit</button>
                            </div>

                            <div className="input-field3">
                                <label style={{ marginBottom: "18px" }}></label>
                                <button style={{ height: "40px", width:"60px" }} className="ok-btn">Cancel</button>
                            </div>
                        </div>
                    </form>
                    <span style={{ height: "1px", backgroundColor: "#aaa" }}></span>

                    <form action="">
                        <div className="fields2">
                            <div className="input-field3">
                                <label htmlFor="">Docket No</label>
                                <input  type="tel" placeholder="Docket No" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Actual Weight</label>
                                <input  type="tel" placeholder="Actual Weight" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Booking Date</label>
                                <input  type="date" placeholder="Booking Date" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Volume Weight</label>
                                <input  type="tel" placeholder="Volume Weight" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Consignor</label>
                                <input  type="text" placeholder="Consignor" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Charge Weight</label>
                                <input  type="tel" placeholder="Charge Weight" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Shipper</label>
                                <input  type="text" placeholder="Shipper" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Vendor Name</label>
                                <input  type="text" placeholder="Vendor Name" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Consignee</label>
                                <input  type="text" placeholder="Consignee" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Vendor Awb No</label>
                                <input  type="tel" placeholder="Vendor Awb No" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Pin code</label>
                                <input type="tel"  id="pincode" name="pincode" maxLength="6" pattern="[0-9]{10}"
                                    placeholder="Pin Code" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Manifest No</label>
                                <input  type="tel" placeholder="Manifest No" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Mobile No</label>
                                <input  type="tel" maxLength="10" id="mobile"
                                    name="mobile" pattern="[0-9]{10}" placeholder="Mobile No" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Manifest Date</label>
                                <input  type="tel" placeholder="Manifest Date" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Type Of Cust</label>
                                <input  type="text" placeholder="Type Of Cust" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Runsheet No</label>
                                <input  type="tel" placeholder="Runsheet No" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Package Type</label>
                                <input  type="text" placeholder="Package Type" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Runsheet Date</label>
                                <input  type="date" placeholder="Runsheet Date" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Mode</label>
                                <input  type="text" placeholder="Mode" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Delivery Boy</label>
                                <input  type="text" placeholder="Delivery Boy" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Origin</label>
                                <input  type="text" placeholder="Origin" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Invoice No</label>
                                <input  type="tel" placeholder="Invoice No" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Destination</label>
                                <input  type="text" placeholder="Destination" disabled />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Invoice Date</label>
                                <input  type="date" placeholder="Invoice Date" disabled />
                            </div>

                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}


export default Undelivered;