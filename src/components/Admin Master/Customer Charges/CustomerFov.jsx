import React, { useState } from "react";
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';


function CustomerFov() {

    const [code, setCode] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 3) {
            setCode(value);
        }
    };

    const generateRandomCode = () => {
        const randomCode = Math.floor(100 + Math.random() * 900).toString();
        setCode(randomCode);
    };


    const [zones, setZones] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);


    const rowsPerPage = 10;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = zones.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(zones.length / rowsPerPage);




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

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);



    return (
        <>

            <div className="body">
                <div className="container1">
                    <header style={{ color: "black", fontSize: "18px", fontWeight: "600" }}>Customer FOV Charges</header>

                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => { setModalIsOpen(true); }}>
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
                            <thead className='table-info body-bordered table-sm'>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Club No</th>
                                    <th scope="col">Customer Name</th>
                                    <th scope="col">Mode</th>
                                    <th scope="col">Docket Point</th>
                                    <th scope="col">Docket Point 2</th>
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
                                                <button className='edit-btn'>
                                                    <i className='bi bi-pen'></i></button>
                                                <button className='edit-btn'>
                                                    <i className='bi bi-trash'></i></button>
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

                    {/* Modal for adding new zone */}
                    <Modal id="modal" overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        style={{
                            content: {
                                top: '50%',
                                left: '55%',
                                right: 'auto',
                                bottom: 'auto',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                height: '374px',
                                width: '660px',
                                padding: "0px",
                                borderRadius: '10px',
                            },
                        }}>
                        <div>
                            <div className="header-tittle">
                                <header>Customer FOV Charges</header>
                            </div>

                            <div className='container2'>
                                <form>

                                    <div className="fields2">

                                        <div className="input-field">
                                            <label htmlFor="">Code </label>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <input style={{
                                                    width: "150px",
                                                    borderBottomRightRadius: "0px",
                                                    borderTopRightRadius: "0px",
                                                    borderRightColor: "transparent"
                                                }}
                                                    type="text"
                                                    placeholder="Enter Code/ Generate Code"
                                                    value={code} onChange={handleInputChange}
                                                    maxLength="3" />
                                                <button className="ok-btn"
                                                    style={{
                                                        height: "40px",
                                                        fontSize: "10px", padding: "5px",
                                                        borderTopLeftRadius: "0px",
                                                        borderBottomLeftRadius: "0px"
                                                    }}
                                                    onClick={generateRandomCode}>Generate Code</button>
                                            </div>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Customer Name</label>
                                            <select required>
                                                <option disabled >Select Customer Name</option>
                                                <option>Vivek Singh</option>
                                                <option value="">Ramesh Kumar</option>
                                            </select>
                                        </div>


                                        <div className="input-field">
                                            <label htmlFor="">Code</label>
                                            <input type="tel" disabled placeholder="Select Customer Name" required />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Mode</label>
                                            <select required>
                                                <option disabled >Select Mode</option>
                                                <option>Air</option>
                                                <option value="">Road</option>
                                            </select>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">FOV %</label>
                                            <input type="tel" placeholder="Enter FOV %" />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">FOV </label>
                                            <input type="tel" placeholder="Enter FOV" />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Amount</label>
                                            <input type="tel" placeholder="Enter Amount" />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">From Date</label>
                                            <input type="date" placeholder="Enter Inches" />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">To Date</label>
                                            <input type="date" placeholder="Enter Feet" />
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
                </div>
            </div>

        </>
    );
};

export default CustomerFov;