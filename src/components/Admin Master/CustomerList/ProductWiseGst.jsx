import React, { useState, useEffect } from "react";
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import Modal from 'react-modal';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";


function ProductWiseGst() {

    const [getGST, setGetGST] = useState([]);                     // To Get GST Data
    const [getMode, setGetMode] = useState([]);                   // To Get Mode Data
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addGST, setAddGST] = useState({
        modeCode: "",
        serviceTax: "",
        fromDate: "",
        toDate: ""
    })


    const fetchGSTData = async () => {
        try {
            const response = await getApi('/Master/GetGst');
            setGetGST(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchModeData = async () => {
        try {
            const response = await getApi('/Master/getMode');
            setGetMode(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGSTData();
        fetchModeData();
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            Mode_Code: addGST.modeCode,
            Services_Tax: addGST.serviceTax,
            From_Date: addGST.fromDate.trim(),
            To_Date: addGST.toDate
        }

        try {
            const response = await postApi('/Master/UpdateGST', requestBody, 'POST');
            if (response.status === 1) {
                setGetGST(getGST.map((gst) => gst.Mode_Code === addGST.modeCode ? response.Data : gst));
                setAddGST({ modeCode: '', serviceTax: '', fromDate: '', toDate: '' });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchGSTData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the GST.', 'error');
            }
        } catch (error) {
            console.error("Failed to update GST:", error);
            Swal.fire('Error', 'Failed to update GST data', 'error');
        }
    }

    const handleSaveGST = async (e) => {
        e.preventDefault();

        const requestBody = {
            Mode_Code: addGST.modeCode,
            Services_Tax: addGST.serviceTax,
            From_Date: addGST.fromDate,
            To_Date: addGST.toDate
        }

        try {
            const response = await getApi(`/Master/AddGst?Mode_Code=${addGST.modeCode}
                &Services_Tax=${addGST.serviceTax}
                &From_Date=${addGST.fromDate}
                &To_Date=${addGST.toDate}`);

            if (response.status === 1) {
                setGetGST([...getGST, response.Data]);
                setAddGST({ modeCode: '', serviceTax: '', fromDate: '', toDate: '' });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchGSTData();
            }
            else if (response.status === 0) {
                Swal.fire('Duplicate Name Not Allowed!', response.message || 'Your changes have been saved.', 'error');

            }
            else {
                Swal.fire('Duplicate Name Not Allowed!', 'Data not added', 'error')
            }
        } catch {
            Swal.fire('Duplicate Name Not Allowed!', 'Failed to save GST data', 'error');
        }
    };


    const handleDeleteGST = async (Mode_Code) => {
        try {
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (confirmation.isConfirmed) {
                await deleteApi(`/Master/DeleteGst?Modecode=${Mode_Code}`);
                setGetGST(getGST.filter((gst) => gst.Modecode !== Mode_Code));
                Swal.fire('Deleted!', 'GST Data has been deleted.', 'success');
                await fetchGSTData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete GST Data', 'error');
        }
    };


    const filteredgetGST = getGST.filter((gst) =>
        (gst && gst.Mode_Name && gst.Mode_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (gst && gst.Services_Tax && gst.Services_Tax.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetGST.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetGST.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };


    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getGST);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getGST');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'GST.xlsx');
    };

    const handleExportPDF = () => {
        const pdfData = getGST.map(({ id, modeCode, serviceTax, fromDate, toDate }) => [id, modeCode, serviceTax, fromDate, toDate]);
        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text('GST Data', 14, 20);
        const headers = [['Sr.No', 'Mode Code', 'GST %', 'From Date', 'To Date']];
        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 30,
            theme: 'grid'
        });
        pdf.save('GST.pdf');
    };

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    return (
        <>
            <div className="body">
                <div className="container1">
                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => {
                                setModalIsOpen(true); setIsEditMode(false);
                                setAddGST({ modeCode: "", serviceTax: "", fromDate: "", toDate: "" })
                            }}>
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
                            <input className="add-input" type="text" placeholder="search"
                                value={searchQuery} onChange={handleSearchChange} />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className='table-container'>
                        <table className='table table-bordered table-sm'>
                            <thead className='table-sm'>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Mode Code</th>
                                    <th scope="col">Mode Name</th>
                                    <th scope="col">GST %</th>
                                    <th scope="col">From Date</th>
                                    <th scope="col">To Date</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((gst, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{gst.Mode_Code}</td>
                                        <td>{gst.Mode_Name}</td>
                                        <td>{gst.Services_Tax}</td>
                                        <td>{formatDate(gst.From_Date)}</td>
                                        <td>{formatDate(gst.To_Date)}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setAddGST({
                                                        modeCode: gst.Mode_Code,
                                                        serviceTax: gst.Services_Tax,
                                                        fromDate: gst.From_Date,
                                                        toDate: gst.To_Date
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button className='edit-btn' onClick={() => handleDeleteGST(gst.Mode_Code)}>
                                                    <i className='bi bi-trash'></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="row" style={{whiteSpace:"nowrap" }}>
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
                            <label htmlFor="rowsPerPage"  className="me-2">Rows per page: </label>
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


                    <Modal id="modal" overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-gst" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Customer GST Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSaveGST}>

                                    <div className="fields2">
                                        <div className="input-field">
                                            <label htmlFor="">Mode</label>
                                            <select value={addGST.modeCode}
                                                onChange={(e) => setAddGST({ ...addGST, modeCode: e.target.value })} required>
                                                <option value="" disabled >Select Mode</option>
                                                {getMode.map((mode, index) => (
                                                    <option value={mode.Mode_Code} key={index}>{mode.Mode_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Good Service Tax %</label>
                                            <input type="text" placeholder="GST %" required
                                                value={addGST.serviceTax}
                                                onChange={(e) => setAddGST({ ...addGST, serviceTax: e.target.value })} />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">From Date</label>
                                            <input type="date" required
                                                value={addGST.fromDate}
                                                onChange={(e) => setAddGST({ ...addGST, fromDate: e.target.value })} />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">To Date</label>
                                            <input type="date" required
                                                value={addGST.toDate}
                                                onChange={(e) => setAddGST({ ...addGST, toDate: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className='bottom-buttons' style={{ marginTop: "20px" }}>
                                        {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                        {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >
                </div>
            </div>
        </>
    )
}

export default ProductWiseGst;