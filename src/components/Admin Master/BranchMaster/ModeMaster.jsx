import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import Modal from 'react-modal';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";



function ModeMaster() {

    const [openRow, setOpenRow] = useState(null);
    const [getMode, setGetMode] = useState([]);              // To Get Mode Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addMode, setAddMode] = useState({
        modeCode: '',
        modeName: '',
    })
    const [searchQuery, setSearchQuery] = useState('');



    const filteredgetMode = getMode.filter((mode) =>
        (mode && mode.Mode_Code && mode.Mode_Code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mode && mode.Mode_Name && mode.Mode_Name.toLowerCase().includes(searchQuery.toLowerCase()))
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetMode.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetMode.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
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
        fetchModeData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            ModeCode: addMode.modeCode,
            ModeName: addMode.modeName
        }

        try {
            const response = await postApi('/Master/UpdateMode', requestBody, 'POST');
            if (response.status === 1) {
                setGetMode(getMode.map((mode) => mode.Mode_Code === addMode.modeCode ? response.Data : mode));
                setAddMode({ modeCode: '', modeName: '' });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchModeData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the mode.', 'error');
            }
        } catch (error) {
            console.error('Error updating mode:', error);
            Swal.fire('Error', 'Failed to update mode data', 'error');
        }
    }

    const handleSaveMode = async (e) => {
        e.preventDefault();
        if (!addMode.modeCode || !addMode.modeName) {
            Swal.fire('Error', 'Both Mode Code and Mode Name are required.', 'error');
            return;
        }

        try {
            const response = await getApi(
                `/Master/addMode?ModeCode=${addMode.modeCode}&ModeName=${addMode.modeName}`
            );
            if (response.status === 1) {
                setGetMode([...getMode, response.Data]);
                setAddMode({ modeCode: '', modeName: '' });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchModeData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add mode data', 'error');
        }
    };


    const handleDeleteMode = async (Mode_Code) => {
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
                await deleteApi(`/Master/Deletemode?modecode=${Mode_Code}`);
                setGetMode(getMode.filter((mode) => mode.modecode !== Mode_Code));
                Swal.fire('Deleted!', 'Mode has been deleted.', 'success');
                await fetchModeData();
            }
            setOpenRow(null);
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Mode', 'error');
        }
    };

    const handleGenerateCode = () => {
        if (addMode.modeCode !== '') return;
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddMode({ ...addMode, modeCode: newCode });
    };



    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getMode);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getMode');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'Branch.xlsx');
    };

    const handleExportPDF = () => {
        const pdfData = getMode.map(({ id, code, name }) => [id, code, name]);
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
        <div className="body">
            <div className="container1">
                <div className="addNew">
                    <div>
                        <button className='add-btn' onClick={() => {
                            setModalIsOpen(true); setIsEditMode(false);
                            setAddMode({ modeCode: '', modeName: '' })
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
                    <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                        <thead className='table-sm'>
                            <tr>
                                <th scope="col">Actions</th>
                                <th scope="col">Sr.No</th>
                                <th scope="col">Mode Code</th>
                                <th scope="col">Mode Name</th>

                            </tr>
                        </thead>
                        <tbody className='table-body'>

                            {currentRows.map((mode, index) => (
                                <tr key={`${mode.id}-${index}`} style={{ fontSize: "12px", position: "relative" }}>
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
                                                    left: "150px",
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
                                                    setAddMode({
                                                        modeCode: mode.Mode_Code,
                                                        modeName: mode.Mode_Name
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i></button>
                                                <button onClick={() =>{
                                                     handleDeleteMode(mode.Mode_Code);
                                                    setOpenRow(null);
                                                }} className='edit-btn'><i className='bi bi-trash'></i></button>
                                            </div>
                                        )}
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{mode.Mode_Code}</td>
                                    <td>{mode.Mode_Name}</td>

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
                            <header>Mode Master</header>
                        </div>
                        <div className='container2'>
                            <form onSubmit={handleSaveMode}>

                                <div className="form first">
                                    <div className="details personal">
                                        <div className="fields2">
                                            <div className="input-field1">
                                                <label htmlFor="">Mode Code </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter Code/ Generate Code"
                                                    value={addMode.modeCode}
                                                    onChange={(e) => setAddMode({ ...addMode, modeCode: e.target.value })}
                                                    readOnly={isEditMode} />
                                            </div>

                                            {!isEditMode && (
                                                <div className="input-field1">
                                                    <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                        onClick={handleGenerateCode}>Generate Code</button>
                                                </div>
                                            )}

                                            <div className="input-field1">
                                                <label htmlFor="">Mode Name</label>
                                                <input type="text" placeholder="Enter Mode" value={addMode.modeName}
                                                    onChange={(e) => setAddMode({ ...addMode, modeName: e.target.value })} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='bottom-buttons' >
                                        {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                        {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal >
            </div>
        </div>
    )
}

export default ModeMaster;