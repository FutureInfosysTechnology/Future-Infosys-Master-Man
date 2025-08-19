import React, { useState } from "react";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';



function DailyExpenses() {

    const [multipleCity, setmultipleCity] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [modalData, setModalData] = useState({ code: '', name: '' });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);


    const rowsPerPage = 10;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = multipleCity.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(multipleCity.length / rowsPerPage);


    /**************** function to edit table row ************/
    const handleEdit = (index) => {
        setEditIndex(index);
        setModalData({ mode: multipleCity[index].mode, name: multipleCity[index].name });
        setModalIsOpen(true);
    };

    /**************** function to delete table row ************/
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
                const updatedZones = multipleCity.filter((_, i) => i !== index);
                setmultipleCity(updatedZones);
                Swal.fire('Deleted!', 'Your zone has been deleted.', 'success');
            }
        });
    };



    /**************** function to edit and save table row ************/
    const handleSave = () => {
        const updatedZones = [...multipleCity];
        updatedZones[editIndex] = { id: editIndex + 1, ...modalData };
        setmultipleCity(updatedZones);
        setModalIsOpen(false);
        setEditIndex(null);
        Swal.fire('Saved!', 'Your changes have been saved.', 'success');
    };



    /**************** function to export table data in excel and pdf ************/
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(multipleCity);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'multipleCity');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'multipleCity.xlsx');
    };

    const handleExportPDF = () => {
        const pdfData = multipleCity.map(({ id, mode, name }) => [id, mode, name]);

        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text('Zone Data', 14, 20);
        const headers = [['Sr.No', 'Mode Name', 'State Name']];

        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 30,
            theme: 'grid'
        });

        pdf.save('multipleCity.pdf');
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
                        <table className='table table-bordered table-sm'>
                            <thead>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Destination Name</th>
                                    <th scope="col">Consignee name</th>
                                    <th scope="col">Booking Date</th>
                                    <th scope="col">Expense Docket No</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Forwarding No</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>
                                {currentRows.map((zone, index) => (
                                    <tr key={zone.id}>
                                        <td>{zone.id}</td>
                                        <td>{zone.mode}</td>
                                        <td>{zone.name}</td>
                                        <td>{zone.name}</td>
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
                        className="custom-modal-custCharges">
                        <div>
                            <div className="header-tittle">
                                <header>Daily Expenses</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={(e) => { e.preventDefault(); handleSave() }}
                                    style={{ paddingBottom: "5px" }}>

                                    <div className="fields2">

                                        <div className="input-field3">
                                            <label htmlFor="">Expense Docket No</label>
                                            <input type="text" placeholder="Expense Docket No" />
                                        </div>
                                        <div className="input-field3">
                                            <label htmlFor="mode-select" className="label">Customer Name</label>
                                            <input type="text" placeholder="Enter Customer Name" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Booking</label>
                                            <input type="text" placeholder="Enter Booking" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Consignor</label>
                                            <input type="text" placeholder="Enter Consignor" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Consignee</label>
                                            <input type="text" placeholder="Enter Consignee" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Vendor</label>
                                            <input type="text" placeholder="Enter Vendor" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Product</label>
                                            <input type="text" placeholder="Enter Product" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Destination</label>
                                            <input type="text" placeholder="Enter Destination" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Manifest Number</label>
                                            <input type="tel" placeholder="Enter Manifest Number" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Expense Date</label>
                                            <input type="date" placeholder="Enter Date" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">No. PCL</label>
                                            <input type="text" placeholder="Enter PCL" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Weight</label>
                                            <input type="tel" placeholder="Enter Weight" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Received Amount</label>
                                            <input type="tel" placeholder="Enter Received Amount" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Balance Amount</label>
                                            <input type="tel" placeholder="Enter Balance Amount" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Total Amount</label>
                                            <input type="tel" placeholder="Enter Total Amount" />
                                        </div>
                                    </div>
                                </form>

                                <span style={{ height: "1px", backgroundColor: "#aaa" }}></span>

                                <form action="">
                                    <div className="fields2">
                                        <div className="input-field3">
                                            <label htmlFor="">Receiver Name</label>
                                            <input type="text" placeholder="Enter Receiver Name" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Received Amount</label>
                                            <input type="tel" placeholder="Enter Received Amount" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Expense Date</label>
                                            <input type="date" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Remark</label>
                                            <input type="text" placeholder="Enter Remark" />
                                        </div>
                                    </div>

                                    <div className="bottom-buttons">
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

export default DailyExpenses;