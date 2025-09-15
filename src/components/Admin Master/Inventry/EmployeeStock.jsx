import React, { useState, useEffect } from "react";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import Swal from "sweetalert2";
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function EmployeeStock() {

    const [getEmpStock, setGetEmpStock] = useState([]);                // To Get Employee Stock Data
    const [getBranch, setGetBranch] = useState([]);                    // To Get Branch Data
    const [getEmp, setGetEmp] = useState([]);                          // To Get Employee Data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addEmpStock, setAddEmpStock] = useState({
        empCode: "",
        cityCode: "",
        qty: "",
        fromDocketNo: "",
        toDocketNo: "",
        stockDate: ""
    })


    const fetchEmployeeStockData = async () => {
        try {
            const response = await getApi('/Master/GetEmployeeStock');
            setGetEmpStock(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranchData = async () => {
        try {
            const response = await getApi('/Master/getBranch');
            setGetBranch(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmpData = async () => {
        try {
            const response = await getApi('/Master/GetEmployee');
            setGetEmp(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeStockData();
        fetchBranchData();
        fetchEmpData();
    }, []);


    const filteredgetEmp = getEmpStock.filter((emp) =>
        (emp && emp.Employee_Name && emp.Employee_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (emp && emp.City_Name && emp.City_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetEmp.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetEmp.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            Employee_Code: addEmpStock.empCode,
            City_Code: addEmpStock.cityCode,
            Qty: addEmpStock.qty,
            FromDocketNo: addEmpStock.fromDocketNo,
            ToDocketNo: addEmpStock.toDocketNo,
            Stock_Date: addEmpStock.stockDate
        }

        try {
            const response = await postApi('/Master/UpdateEmployeeStock', requestBody, 'POST');
            if (response.status === 1) {
                setGetEmpStock(getEmpStock.map((emp) => emp.Employee_Code === addEmpStock.empCode ? response.Data : emp));
                setAddEmpStock({
                    empCode: '',
                    cityCode: '',
                    qty: '',
                    fromDocketNo: '',
                    toDocketNo: '',
                    stockDate: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchEmployeeStockData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the employee stock.', 'error');
            }
        } catch (error) {
            console.error("Failed to update employee stock:", error);
            Swal.fire('Error', 'Failed to update employee stock data', 'error');
        }
    }

    const handleSaveEmpStockEntry = async (e) => {
        e.preventDefault();

        try {
            const response = await postApi(`/Master/addEmployeeStockIssue?Employee_Code=${addEmpStock.empCode}
                &City_Code=${addEmpStock.cityCode}
                &Qty=${addEmpStock.qty}
                &FromDocketNo=${addEmpStock.fromDocketNo}
                &ToDocketNo=${addEmpStock.toDocketNo}
                &Stock_Date=${addEmpStock.stockDate}`);
            if (response.status === 1) {
                setAddEmpStock({
                    empCode: "",
                    cityCode: "",
                    qty: "",
                    fromDocketNo: "",
                    toDocketNo: "",
                    stockDate: ""
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchEmployeeStockData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Employee Stock Entry data', 'error');
        }
    };



    const handleDeleteEmpStock = async (Employee_Code) => {
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
                await deleteApi(`/Master/DeleteEmployeestockissue?Employeecode=${Employee_Code}`);
                setGetEmpStock(getEmpStock.filter((emp) => emp.Employeecode !== Employee_Code));
                Swal.fire('Deleted!', 'Employee Stock has been deleted.', 'success');
                await fetchEmployeeStockData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Employee Stock', 'error');
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getEmpStock);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Stock');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'EmployeeStock.xlsx');
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

            pdf.save('EmployeeStock.pdf');
        });
    };

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);


    return (
        <>

            <div className="container1">
                <div className="addNew">
                    <div>
                        <button className='add-btn' onClick={() => {
                            setModalIsOpen(true); setIsEditMode(false);
                            setAddEmpStock({ empCode: "", cityCode: "", qty: "", fromDocketNo: "", toDocketNo: "", stockDate: "" })
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
                                <th scope="col">Employee_Name</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">From_Docket_No</th>
                                <th scope="col">To_Docket_No</th>
                                <th scope="col">City_Name</th>
                                <th scope="col">Stock_Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>

                            {currentRows.map((emp, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                    <td>{emp.Employee_Name}</td>
                                    <td>{emp.Qty}</td>
                                    <td>{emp.FromDocketNo}</td>
                                    <td>{emp.ToDocketNo}</td>
                                    <td>{emp.City_Name}</td>
                                    <td>{emp.Stock_Date}</td>
                                    <td>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                            <button className='edit-btn' onClick={() => {
                                                setIsEditMode(true);
                                                setAddEmpStock({
                                                    empCode: emp.Employee_Code,
                                                    qty: emp.Qty,
                                                    fromDocketNo: emp.FromDocketNo,
                                                    toDocketNo: emp.ToDocketNo,
                                                    cityCode: emp.City_Code,
                                                    stockDate: emp.Stock_Date
                                                });
                                                setModalIsOpen(true);
                                            }}>
                                                <i className='bi bi-pen'></i>
                                            </button>
                                            <button className='edit-btn' onClick={() => handleDeleteEmpStock(emp.Employee_Code)}>
                                                <i className='bi bi-trash'></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="row" style={{ whiteSpace: "nowrap" }}>
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
                        <label htmlFor="rowsPerPage" className="me-2">Rows per page: </label>
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

                <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                    className="custom-modal-volumetric" contentLabel="Modal">
                    <div className="custom-modal-content">
                        <div className="header-tittle">
                            <header>Employee Master</header>
                        </div>

                        <div className='container2'>
                            <form onSubmit={handleSaveEmpStockEntry}>
                                <div className="fields2">
                                    <div className="input-field1">
                                        <label htmlFor="">Employee Name</label>
                                        <select value={addEmpStock.empCode}
                                            onChange={(e) => setAddEmpStock({ ...addEmpStock, empCode: e.target.value })}
                                            required aria-readonly={isEditMode}>
                                            <option value="" disabled>Select Employee Name</option>
                                            {getEmp.map((emp, index) => (
                                                <option value={emp.Employee_Code} key={index}>{emp.Employee_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Branch Name</label>
                                        <select value={addEmpStock.cityCode}
                                            onChange={(e) => setAddEmpStock({ ...addEmpStock, cityCode: e.target.value })} required>
                                            <option disabled value="">Select Branch</option>
                                            {getBranch.map((branch, index) => (
                                                <option value={branch.Branch_Code} key={index}>{branch.Branch_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Quantity</label>
                                        <input type="text" placeholder="Quantity"
                                            value={addEmpStock.qty}
                                            onChange={(e) => setAddEmpStock({ ...addEmpStock, qty: e.target.value })} required />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">From Docket No</label>
                                        <input type="text" placeholder="From Docket No" required
                                            value={addEmpStock.fromDocketNo}
                                            onChange={(e) => setAddEmpStock({ ...addEmpStock, fromDocketNo: e.target.value })} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">To Docket No</label>
                                        <input type="text" placeholder="To Docket No" required
                                            value={addEmpStock.toDocketNo}
                                            onChange={(e) => setAddEmpStock({ ...addEmpStock, toDocketNo: e.target.value })} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Stock Date</label>
                                        <input type="date" required value={addEmpStock.stockDate}
                                            onChange={(e) => setAddEmpStock({ ...addEmpStock, stockDate: e.target.value })} />
                                    </div>

                                </div>
                                <div className='bottom-buttons'>
                                    {!isEditMode && (<button type='submit' className='ok-btn' >Submit</button>)}
                                    {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn' >Update</button>)}
                                    <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal >
            </div>
        </>
    )
}


export default EmployeeStock;