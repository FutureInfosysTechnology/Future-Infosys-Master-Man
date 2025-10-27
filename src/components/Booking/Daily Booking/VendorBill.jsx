import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from "sweetalert2";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import DatePicker from 'react-datepicker';
import { getApi, postApi, putApi, deleteApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";

function VendorBill() {
    const getTodayDate = () => {
        const today = new Date();
        return today;
    };
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    const [zones, setZones] = useState([]);
    const [getVendor, setGetVendor] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [modalData, setModalData] = useState({ code: '', name: '' });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        vendorCode: "",
        vendorAwbNo: "",
        billNo: "",
        billDate: getTodayDate(),
        billFrom: getTodayDate(),
        billTo: getTodayDate(),
        amount: 0,
        fuelChrgs: 0,
        otherChrgs: 0,
        gst: 0,
        totalAmt: 0,
    });
    const fetchData = async (endpoint, setData) => {


        try {
            const response = await getApi(endpoint);
            // Check if the response contains data, then update the corresponding state
            if (response && response.Data) {
                setData(Array.isArray(response.Data) ? response.Data : []);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error(`Error fetching data from ${endpoint}:`, err);
        }
    };
    useEffect(() => {

        fetchData('/Master/getVendor', setGetVendor);


    }, []);
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

            <div className='body'>
                <div className="container1">
                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => { setModalIsOpen(true) }}>
                                <i className="bi bi-plus-lg"></i>
                                <span>ADD NEW</span>
                            </button>

                            <div className="dropdown">
                                <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                                <div className="dropdown-content">
                                    <button onClick={handleExportExcel}>Export to Excel</button>
                                    <button onClick={handleExportPDF}>Export to PDF</button>
                                </div>
                            </div>
                        </div>

                        <div className="search-input">
                            <input className="add-input" type="text" placeholder="search" />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className='table-container'>
                        <table className='table table-bordered table-sm' >
                            <thead>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">AWB No</th>
                                    <th scope="col">Booking Date</th>
                                    <th scope='col'>Customer</th>
                                    <th scope='col'>Consignee</th>
                                    <th scope='col'>Destination</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((zone, index) => (
                                    <tr key={zone.id}>
                                        <td>{zone.id}</td>
                                        <td>{zone.code}</td>
                                        <td>{zone.name}</td>
                                        <td>{zone.name}</td>
                                        <td>{zone.name}</td>
                                        <td>{zone.name}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <button onClick={() => handleEdit(index)} className='edit-btn'><i className='bi bi-pen'></i></button>
                                                <button onClick={() => handleDelete(index)} className='edit-btn'><i className='bi bi-trash'></i></button>
                                            </div>
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
                        className="custom-modal-volumetric" contentLabel='Modal'>
                        <div className='custom-modal-content'>
                            <div className="header-tittle">
                                <header>Vendor Bill Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>

                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Vendor Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getVendor.map(v => ({ value: v.Vendor_Code, label: v.Vendor_Name }))}
                                                value={
                                                    formData.vendorCode
                                                        ? { value: formData.vendorCode, label: getVendor.find(opt => opt.Vendor_Code === formData.vendorCode)?.Vendor_Name || "" }
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        vendorCode: selectedOption.value,
                                                    }));
                                                }}
                                                placeholder="Select Vendor Name"
                                                isSearchable
                                                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll area
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps it above other UI
                                                }}
                                            />
                                        </div>

                                        {/* 🟩 Bill No */}
                                        <div className="input-field1">
                                            <label>Bill No</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Bill No"
                                                value={formData.billNo}
                                                onChange={(e) => setFormData(prev => ({ ...prev, billNo: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 Bill Date */}
                                        <div className="input-field1">
                                            <label>Bill Date</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={formData.billDate}
                                                onChange={(date) => handleDateChange(date, "billDate")}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        {/* 🟩 Bill From */}
                                        <div className="input-field1">
                                            <label>Bill From</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={formData.billFrom}
                                                onChange={(date) => handleDateChange(date, "billFrom")}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        {/* 🟩 Bill To */}
                                        <div className="input-field1">
                                            <label>Bill To</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={formData.billTo}
                                                onChange={(date) => handleDateChange(date, "billTo")}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>


                                        {/* 🟩 Vendor AWB No */}
                                        <div className="input-field1">
                                            <label>Vendor AWB No</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Vendor AWB No"
                                                value={formData.vendorAwbNo}
                                                onChange={(e) => setFormData(prev => ({ ...prev, vendorAwbNo: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 Amount */}
                                        <div className="input-field1">
                                            <label>Amount</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter Amount"
                                                value={formData.amount}
                                                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 Fuel Charges */}
                                        <div className="input-field1">
                                            <label>Fuel Charges</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter Fuel Charges"
                                                value={formData.fuelChrgs}
                                                onChange={(e) => setFormData(prev => ({ ...prev, fuelChrgs: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 Other Charges */}
                                        <div className="input-field1">
                                            <label>Other Charges</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter Other Charges"
                                                value={formData.otherChrgs}
                                                onChange={(e) => setFormData(prev => ({ ...prev, otherChrgs: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 GST */}
                                        <div className="input-field1">
                                            <label>GST</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter GST"
                                                value={formData.gst}
                                                onChange={(e) => setFormData(prev => ({ ...prev, gst: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 Total Amount */}
                                        <div className="input-field1">
                                            <label>Total Amount</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter Total Amount"
                                                value={formData.totalAmt}
                                                onChange={(e) => setFormData(prev => ({ ...prev, totalAmt: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className='bottom-buttons'>
                                        <button type='submit' className='ok-btn'>Submit</button>
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >

                </div >
            </div>

        </>
    );
};

export default VendorBill;