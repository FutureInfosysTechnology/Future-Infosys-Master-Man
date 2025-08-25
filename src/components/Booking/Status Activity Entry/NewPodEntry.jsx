import React, { useEffect, useState } from "react";
import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi"
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import Swal from "sweetalert2";
import Select from 'react-select';
import 'react-toggle/style.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function NewPodEntry() {

    const [zones, setZones] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [modalData, setModalData] = useState({ code: '', name: '' });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [status, setStatus] = useState(null);
    const today = new Date();
    const time = String(today.getHours()).padStart(2, "0") + ":" + String(today.getMinutes()).padStart(2, "0");


    const [getCity, setGetCity] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        toDate: today,
        fromDest: '',
        toDest: '',
        time: time
    });
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            setData(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(today.toISOString().slice(11,16),"+",today.toLocaleTimeString().slice(0,5));
        fetchData('/Master/getdomestic', setGetCity);

    }, []);

    const statusOptions = [
        { value: "delivered", label: "Delivered" },
        { value: "undelivered", label: "Undelivered" },
        { value: "return", label: "Return" }
    ];

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

            <div className="container1">
                <form action="" className="order-form">
                    <div className="order-fields" style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>

                        <div className="input-field3">
                            <label htmlFor="">Docket No</label>
                            <input type="text" placeholder="Enter Docket No" />
                        </div>
                        <div className="bottom-buttons" style={{ marginTop: "28px" }}>
                            <button type="submit" className="ok-btn">Find</button>
                        </div>

                        {/*<div className="order-input">
                            <label htmlFor="">Status</label>
                            <Select
                                options={statusOptions}
                                value={status}
                                onChange={(option) => setStatus(option)}
                                placeholder="Select Destination"
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
                        </div>*/}
                    </div>
                </form>

                {/*<div className="addNew">
                    <button className='add-btn' onClick={() => { setModalIsOpen(true); setModalData({ code: '', name: '' }) }}>
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

                    <div className="search-input">
                        <input className="add-input" type="text" placeholder="search" />
                        <button type="submit" title="search">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>*/}

                <div className='table-container'>
                    <table className='table table-bordered table-sm'>
                        <thead className='table-info body-bordered table-sm'>
                            <tr>
                                <th scope="col">Sr.No</th>
                                <th scope="col">Date</th>
                                <th scope="col">Time</th>
                                <th scope="col">From</th>
                                <th scope="col">To</th>
                                <th scope="col">Remark</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            <tr>
                                <td>1</td>
                                <td><DatePicker
                                portalId="root-portal" 
                                    selected={formData.toDate}
                                    onChange={(date) => handleDateChange(date, "toDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                /></td>
                                <td>
                                    <input type="time" value={formData.time} onChange={(e) => { setFormData({ ...formData, time: e.target.value }) }} />
                                </td>
                                <td><Select
                                    options={getCity.map(city => ({
                                        value: city.City_Code,   // adjust keys from your API
                                        label: city.City_Name
                                    }))}
                                    value={
                                        formData.fromDest
                                            ? { value: formData.fromDest, label: getCity.find(c => c.City_Code === formData.fromDest)?.City_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) => {
                                        console.log(selectedOption);
                                        setFormData({
                                            ...formData,
                                            fromDest: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    }
                                    placeholder="Select City"
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
                                /></td>
                                <td><Select
                                    options={getCity.map(city => ({
                                        value: city.City_Code,   // adjust keys from your API
                                        label: city.City_Name
                                    }))}
                                    value={
                                        formData.toDest
                                            ? { value: formData.toDest, label: getCity.find(c => c.City_Code === formData.toDest)?.City_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            toDest: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select City"
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
                                /></td>
                                <td><input type="text" /></td>
                                <td>
                                    <button type="submit" className="ok-btn" style={{ width: "60px", height: "30px" }}>Add +</button>
                                </td>
                            </tr>
                            {currentRows.map((zone, index) => (
                                <tr key={zone.id}>
                                    <td>{zone.id}</td>
                                    <td>{zone.code}</td>
                                    <td>{zone.name}</td>
                                    <td>{zone.name}</td>
                                    <td>{zone.name}</td>
                                    <td>{zone.name}</td>
                                    <td>
                                        <button onClick={() => handleEdit(index)} className='edit-btn'>
                                            <i className='bi bi-pen'></i></button>
                                        <button onClick={() => handleDelete(index)} className='edit-btn'>
                                            <i className='bi bi-trash'></i></button>
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
                            left: '54%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            height: '202px',
                            width: '650px',
                            borderRadius: '10px',
                            padding: "0px"
                        },
                    }}>
                    <div>
                        <div className="header-tittle">
                            <header>Activity Entry</header>
                        </div>
                        <div className='container2'>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ paddingBottom: "20px" }}>
                                <div className="fields2">

                                    <div className="input-field">
                                        <label htmlFor="">From Station</label>
                                        <input type="text" placeholder="Enter From Station" required />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="">To Station</label>
                                        <input type="text" placeholder="Enter To Station" required />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="">Date</label>
                                        <input type="date" required />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="">Time</label>
                                        <input type="time" required />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="">Status</label>
                                        <input type="text" placeholder="Enter Status" required />
                                    </div>

                                    <div className='bottom-buttons' style={{ marginLeft: "25px", marginTop: "17px" }}>
                                        <button type='submit' className='ok-btn'>Submit</button>
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </Modal >
            </div>

        </>
    );
};

export default NewPodEntry;