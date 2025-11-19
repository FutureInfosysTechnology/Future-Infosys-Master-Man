import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import Modal from 'react-modal';
import { getApi, deleteApi, postApi } from "../Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";



function BankName() {
    const [openRow, setOpenRow] = useState(null);
    const [getBankName, setGetBankName] = useState([]);     // To Get Bank Data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addBank, setAddBank] = useState({
        BankCode: "",
        BankName: ""
    })



    const filteredgetBankName = getBankName.filter((bank) =>
        (bank && bank.Bank_Code && bank.Bank_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (bank && bank.Bank_Name && bank.Bank_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetBankName.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetBankName.length / rowsPerPage);



    const fetchBankData = async () => {
        try {
            const response = await getApi('/Master/Getbank');
            setGetBankName(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBankData();
    }, []);


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            BankCode: addBank.BankCode,
            BankName: addBank.BankName
        };

        try {
            const response = await postApi('/Master/UpdateBank', requestBody, 'POST');
            if (response.status === 1) {
                setGetBankName(getBankName.map((bank) => bank.Bank_Code === addBank.BankCode ? response.Data : bank));
                setAddBank({ BankCode: '', BankName: '' });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchBankData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the Bank.', 'error');
            }
        } catch (error) {
            console.error('Error updating Bank Name:', error);
            Swal.fire('Error', 'Failed to update bank data', 'error');
        }
    }

    const handleSaveBank = async (e) => {
        e.preventDefault();

        if (!addBank.BankCode || !addBank.BankName) {
            Swal.fire('Error', 'Both Bank Code and Bank Name are required.', 'error');
            return;
        }

        try {
            const saveResponse = await postApi(`/Master/AddBank?BankCode=${addBank.BankCode}&BankName=${addBank.BankName}`);

            if (saveResponse.status === 1) {
                setGetBankName([...getBankName, saveResponse.Data]);
                setAddBank({ BankCode: '', BankName: '' });
                Swal.fire('Saved!', saveResponse.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchBankData();
            }
            else {
                Swal.fire('Error!', saveResponse.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Error checking Bank existence or saving:', err);
            Swal.fire('Error', 'Failed to check Bank existence or save Bank data', 'error');
        }
    };


    const handleDeleteBank = async (Bank_Code) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this zone?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteApi(`/Master/DeleteBank?BankCode=${Bank_Code}`);
                setGetBankName(getBankName.filter((bank) => bank.BankCode !== Bank_Code));
                Swal.fire('Deleted!', 'The Bank has been deleted.', 'success');
                await fetchBankData();
            } catch (err) {
                console.error('Delete Error:', err);
                Swal.fire('Error', 'Failed to delete Bank', 'error');
            }
        }
    };

    const handleGenerateCode = () => {
        if (addBank.BankCode !== '') return;
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddBank({ ...addBank, BankCode: newCode });
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getBankName);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getBankName');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'Branch.xlsx');
    };

    const handleExportPDF = () => {
        const pdfData = getBankName.map(({ id, code, name }) =>
            [id, code, name]);

        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text('Zone Data', 14, 20);

        const headers = [['Sr.No', 'Branch Code', 'Branch Name']];

        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 30,
            theme: 'grid'
        });
        pdf.save('Branch.pdf');
    };


    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;



    return (
        <>
            <div className="body">
                <div className="container1">
                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => {
                                setModalIsOpen(true); setIsEditMode(false);
                                setAddBank({ BankCode: '', BankName: '' })
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
                            <input className="add-input" value={searchQuery}
                                onChange={handleSearchChange} type="text" placeholder="search" />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>


                    <div className="table-container">
                        <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                            <thead className='table-sm'>
                                <tr>
                                    <th scope="col">Actions</th>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Bank Code</th>
                                    <th scope="col">Bank Name</th>
                                </tr>
                            </thead>
                            <tbody>

                                {currentRows.map((bank, index) => (
                                    <tr key={index} style={{ fontSize: "12px", position: "relative" }}>
                                        <td>
                                            <PiDotsThreeOutlineVerticalFill
                                                style={{ fontSize: "20px", cursor: "pointer" }}
                                                onClick={() => setOpenRow(openRow === index ? null : index)}
                                            />
                                            {openRow === index && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        flexDirection: "row",
                                                        position: "absolute",
                                                        alignItems: "center",
                                                        left: "100px",
                                                        top: "0px",
                                                        borderRadius: "10px",
                                                        backgroundColor: "white",
                                                        zIndex: "999999",
                                                        height: "30px",
                                                        width: "50px",
                                                        padding: "10px",
                                                    }}
                                                >
                                                    <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setOpenRow(null);
                                                    setAddBank({
                                                        BankCode: bank.Bank_Code,
                                                        BankName: bank.Bank_Name
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button onClick={() =>{
                                                 handleDeleteBank(bank.Bank_Code);
                                                 setOpenRow(null);
                                                 }} className='edit-btn'><i className='bi bi-trash'></i></button>
                                                </div>
                                            )}
                                        </td>
                                        <td>{index + 1}</td>
                                        <td>{bank.Bank_Code}</td>
                                        <td>{bank.Bank_Name}</td>

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
                        className="custom-modal-mode" contentLabel="Modal"
                    >
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Bank Master</header>
                            </div>
                            <div className='container2'>
                                <form onSubmit={handleSaveBank}>

                                    <div className="form first">
                                        <div className="details personal">
                                            <div className="fields2">
                                                <div className="input-field1">
                                                    <label htmlFor="">Code </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Code/ Generate Code"
                                                        value={addBank.BankCode}
                                                        onChange={(e) => setAddBank({ ...addBank, BankCode: e.target.value })}
                                                        maxLength="3" readOnly={isEditMode} required/>
                                                </div>

                                                {!isEditMode && (
                                                    <div className="input-field1">
                                                        <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                            onClick={handleGenerateCode}>Generate Code</button>
                                                    </div>
                                                )}

                                                <div className="input-field1">
                                                    <label htmlFor="">Bank Name</label>
                                                    <input type="text" placeholder="Enter Bank" required
                                                        value={addBank.BankName}
                                                        onChange={(e) => setAddBank({ ...addBank, BankName: e.target.value })} />
                                                </div>

                                            </div>
                                        </div>
                                        <div className='bottom-buttons'>
                                            {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                            {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                            <button onClick={() => {setModalIsOpen(false)}} className='ok-btn'>close</button>
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

export default BankName;