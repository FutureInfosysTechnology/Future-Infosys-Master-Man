import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import Swal from "sweetalert2";


function PaymentReceived() {

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
            const imgWidth = 190; 
            const pageHeight = pdf.internal.pageSize.height; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;  

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

                    <form action="" className="order-form" style={{ margin: "0px" }}>

                        <div className="order-fields">
                            <div className="order-input">
                                <label htmlFor="">Client Name</label>
                                <select value="">
                                    <option disabled value="">Select Client Name</option>
                                    <option value="">Vivek</option>
                                    <option value="">Ramesh</option>
                                    <option value="">Suresh</option>
                                </select>
                            </div>

                            <div className="order-input">
                                <label htmlFor="">From Date</label>
                                <input type="date" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">To Date</label>
                                <input type="date" />
                            </div>
                        </div>
                    </form>

                    <div className="addNew">

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
                    </div>

                    <div className='table-container'>
                        <table className='table table-bordered table-sm'>
                            <thead className='table-info body-bordered table-sm'>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Bill No</th>
                                    <th scope="col">Customer Name</th>
                                    <th scope="col">Credit Type</th>
                                    <th scope="col">Billing Date</th>
                                    <th scope="col">Bill Amount</th>
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
                                            <button className='add-btn' style={{ width: "50px", marginRight: "5px" }} onClick={() => { setModalIsOpen(true); setModalData({ code: '', name: '' }) }}>
                                                <i className="bi bi-plus-lg"></i>
                                            </button>
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
                                left: '55%',
                                right: 'auto',
                                bottom: 'auto',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                height: '319px',
                                width: '860px',
                                borderRadius: '10px',
                                padding: "0px"
                            },
                        }}>
                        <div>
                            <div className="header-tittle">
                                <header>Payment Received Entry</header>
                            </div>
                            <div className='container2'>
                                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                    <div className="fields2">

                                        <div className="input-field">
                                            <label htmlFor="">Bill No</label>
                                            <input type="tel" placeholder="Enter Bill No" required />
                                        </div>


                                        <div className="input-field">
                                            <label htmlFor="">Cudtomer Name</label>
                                            <input type="text" placeholder="Enter Cudtomer Name" required />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Credit Type</label>
                                            <select name="" id="">
                                                <option value="" disabled>Select Credit Type</option>
                                                <option value="">1</option>
                                                <option value="">2</option>
                                                <option value="">3</option>
                                                <option value="">4</option>
                                            </select>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Billing Date</label>
                                            <input type="date" placeholder="Enter Billing Date" required />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Bill Amount</label>
                                            <input type="tel" placeholder="Enter Bill Amount" required />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">TDS</label>
                                            <input type="tel" placeholder="Enter TDS" required />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Received Amount</label>
                                            <input type="tel" placeholder="Enter Received Amount" required />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Discount Amount</label>
                                            <input type="tel" placeholder="Enter Discount Amount" required />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Receiver Name</label>
                                            <input type="text" placeholder="Enter Receiver Name" required />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Mode Of Payment</label>
                                            <select name="" id="">
                                                <option value="" disabled>Select Mode Of Payment</option>
                                                <option value="">UPI</option>
                                                <option value="">NEFT</option>
                                                <option value="">IMPS</option>
                                                <option value="">RTGS</option>
                                            </select>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Transaction No</label>
                                            <input type="tel" placeholder="Enter Txn No" required />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Received Date</label>
                                            <input type="date" required />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Cheque Date</label>
                                            <input type="date" required />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Bank Name</label>
                                            <select name="" id="">
                                                <option value="" disabled>Select Bank</option>
                                                <option value="">State Bank of India</option>
                                                <option value="">Union Bank</option>
                                                <option value="">IDBI Bank</option>
                                            </select>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Remarks</label>
                                            <input type="text" placeholder="Enter Remarks" required />
                                        </div>

                                        <div className='bottom-buttons' style={{ marginTop: "18px", marginLeft: "25px" }}>
                                            <button type='submit' className='ok-btn' >Submit</button>
                                            <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
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

export default PaymentReceived;