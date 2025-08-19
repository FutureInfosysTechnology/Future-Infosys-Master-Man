import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



function VendorBill() {


    const [zones, setZones] = useState([]);

    const [editIndex, setEditIndex] = useState(null);
    const [modalData, setModalData] = useState({ code: '', name: '' });
    const [modalIsOpen, setModalIsOpen] = useState(false);
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
                                            <select>
                                                <option disabled value="">Select Vendor Name</option>
                                                <option value="">1</option>
                                                <option value="">2</option>
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Bill No</label>
                                            <input type="text" placeholder='Enter Bill No' />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Bill Date</label>
                                            <input type="date" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Bill From</label>
                                            <input type="date" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Bill To</label>
                                            <input type="date" />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Vendor AWB No</label>
                                            <input type="text" placeholder='Enter Vendor AWB No' />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">AWB No</label>
                                            <input type="text" placeholder='Enter AWB No' />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Amount</label>
                                            <input type="tel" placeholder='Enter Amount' />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Fuel Charges</label>
                                            <input type="tel" placeholder='Enter Fuel Charges' />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Other Charges</label>
                                            <input type="tel" placeholder='Enter Other Charges' />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">GST</label>
                                            <input type="text" placeholder='Enter GST' />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Total Amount</label>
                                            <input type="tel" placeholder='Enter Total Amount' />
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