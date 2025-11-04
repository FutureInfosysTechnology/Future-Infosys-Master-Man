import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import Header from '../../../Components-2/Header/Header';
import Sidebar1 from '../../../Components-2/Sidebar1';
import Footer from '../../../Components-2/Footer';
import { getApi, deleteApi, putApi, postApi } from "../Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";




function RegionMaster() {

    const [openRow, setOpenRow] = useState(null);
    const [getStatus, setGetStatus] = useState([]);     // To Get Bank Data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addActivity, setAddActivity] = useState({
        Activity_Code: "",
        Activity_Name: "",
        Description: "",
        IsActive: true,
        User: "Admin" // or dynamically from logged-in user
    });



    const filteredgetStatus = getStatus.filter((status) =>
        (status && status.Activity_Code && status.Activity_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (status && status.Activity_Name && status.Activity_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetStatus.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetStatus.length / rowsPerPage);



    const fetchActivityData = async () => {
        try {
            const response = await getApi('/Master/getAllActivities');
            setGetStatus(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchActivityData();
    }, []);


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleUpdateActivity = async (e) => {
        e.preventDefault();

        if (!addActivity.Activity_Code) {
            Swal.fire('Error', 'Activity Code is required to update.', 'error');
            return;
        }

        const requestBody = {
            Activity_Code: addActivity.Activity_Code,
            Activity_Name: addActivity.Activity_Name,
            Description: addActivity.Description,
            IsActive: addActivity.IsActive,
            User: "Admin" // or from logged-in user context
        };

        try {
            // ✅ Use PUT to match backend route
            const response = await putApi('/Master/updateActivityByCode', requestBody);

            if (response.status === 1) {
                // Update activity list in state
                setGetStatus(prevList =>
                    prevList.map(act =>
                        act.Activity_Code === addActivity.Activity_Code ? response.data : act
                    )
                );

                // Clear form & close modal
                setAddActivity({
                    Activity_Code: "",
                    Activity_Name: "",
                    Description: "",
                    IsActive: true,
                    User: "Admin"
                });

                Swal.fire('Updated!', response.message || 'Activity updated successfully.', 'success');
                setModalIsOpen(false);

                // Refresh list
                await fetchActivityData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update activity.', 'error');
            }
        } catch (error) {
            console.error('❌ Error updating Activity:', error);
            Swal.fire('Error', 'Failed to update activity data', 'error');
        }
    };

    const handleSaveActivity = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!addActivity.Activity_Code || !addActivity.Activity_Name) {
            Swal.fire('Error', 'Both Activity Code and Activity Name are required.', 'error');
            return;
        }

        try {
            // ✅ POST request body (not query string)
            const payload = {
                Activity_Code: addActivity.Activity_Code,
                Activity_Name: addActivity.Activity_Name,
                Description: addActivity.Description,
                IsActive: true,
                User: "Admin"
            }
            const saveResponse = await postApi("/Master/AddUpdateActivityMaster", payload);

            if (saveResponse.status === 1) {
                setGetStatus([...getStatus, saveResponse.data]);
                Swal.fire('Saved!', saveResponse.message || 'Activity saved successfully.', 'success');

                // optional UI update logic
                setAddActivity({
                    Activity_Code: "",
                    Activity_Name: "",
                    Description: "",
                    IsActive: true,
                    User: "Admin"
                });

                setModalIsOpen(false);
                await fetchActivityData();
            } else {
                Swal.fire('Error', saveResponse.message || 'Failed to save activity.', 'error');
            }
        } catch (err) {
            console.error('❌ Error saving activity:', err);
            Swal.fire('Error', 'Failed to save activity data', 'error');
        }
    };



    const handleDeleteActivity = async (Activity_Code) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this activity?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteApi(`/Master/deleteActivityByCode?Activity_Code=${Activity_Code}`);
                setGetStatus(getStatus.filter(f => f.Activity_Code !== Activity_Code));
                Swal.fire('Deleted!', 'The activity has been deleted.', 'success');
                await fetchActivityData(); // Refresh list after deletion
            } catch (err) {
                console.error('Delete Error:', err);
                Swal.fire('Error', 'Failed to delete activity', 'error');
            }
        }
    };


    const handleGenerateCode = (e) => {
        e.preventDefault();
        if (addActivity.Activity_Code !== '') return;
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddActivity({ ...addActivity, Activity_Code: newCode });
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getStatus);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getStatus');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'status.xlsx');
    };

    // const handleExportPDF = () => {
    //     const pdfData = getStatus.map(({ id, code, name }) =>
    //         [id, code, name]);

    //     const pdf = new jsPDF();

    //     pdf.setFontSize(18);
    //     pdf.text('Zone Data', 14, 20);

    //     const headers = [['Sr.No', 'Branch Code', 'Branch Name']];

    //     pdf.autoTable({
    //         head: headers,
    //         body: pdfData,
    //         startY: 30,
    //         theme: 'grid'
    //     });
    //     pdf.save('Branch.pdf');
    // };


    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <>
            <Header />
            <Sidebar1 style={{ zIndex: 9999 }} />
            <div className="main-body" id='main-body'>
                <div className="body">
                    <div className="container1">
                        <header style={{ fontWeight: "bold", fontSize: "15px" }}>Status Master</header>
                        <div className="addNew">
                            <div>
                                <button className='add-btn' onClick={() => {
                                    setModalIsOpen(true); setIsEditMode(false);
                                    setOpenRow(null);
                                    setAddActivity({
                                        Activity_Code: "",
                                        Activity_Name: "",
                                        Description: "",
                                        IsActive: true,
                                        User: "Admin"
                                    });
                                }}>
                                    <i className="bi bi-plus-lg"></i>
                                    <span>ADD NEW</span>
                                </button>

                                <div className="dropdown">
                                    <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                                    <div className="dropdown-content">
                                        <button onClick={handleExportExcel}>Export to Excel</button>
                                        <button >Export to PDF</button>
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
                                        <th scope="col">Activity Code</th>
                                        <th scope="col">Activity Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">IsActive</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {currentRows.map((status, index) => (
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
                                                            height: "30px",
                                                            width: "50px",
                                                            padding: "10px",
                                                        }}
                                                    >
                                                        <button className='edit-btn' onClick={() => {
                                                            setIsEditMode(true);
                                                            setOpenRow(null);
                                                            setAddActivity({
                                                                Activity_Code:status?.Activity_Code,
                                                                Activity_Name:status?.Activity_Name,
                                                                Description: status?.Description,
                                                                IsActive: status?.IsActive,
                                                                User:status?.User
                                                            });
                                                            setModalIsOpen(true);
                                                        }}>
                                                            <i className='bi bi-pen'></i>
                                                        </button>
                                                        <button onClick={() => {
                                                            handleDeleteActivity(status.Activity_Code);
                                                            setOpenRow(null);
                                                        }} className='edit-btn'><i className='bi bi-trash'></i></button>
                                                    </div>
                                                )}
                                            </td>
                                            <td>{index + 1}</td>
                                            <td>{status.Activity_Code}</td>
                                            <td>{status.Activity_Name}</td>
                                            <td>{status.Description}</td>
                                            <td>{status.IsActive ? 1 : 0}</td>

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
                            style={{
                                content: {
                                    height: "auto"
                                }
                            }}
                        >
                            <div className="custom-modal-content">
                                <div className="header-tittle">
                                    <header>Activity Master</header>
                                </div>
                                <div className='container2'>
                                    <form onSubmit={handleSaveActivity}>
                                        <div className="form first">
                                            <div className="details personal">
                                                <div className="fields2">
                                                    <div className="input-field1">
                                                        <label>Code</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Code / Generate Code"
                                                            value={addActivity.Activity_Code}
                                                            onChange={(e) => setAddActivity({ ...addActivity, Activity_Code: e.target.value })}
                                                            maxLength="3"
                                                            readOnly={!!isEditMode}
                                                        />
                                                    </div>

                                                    {!isEditMode && (
                                                        <div className="input-field1">
                                                            <button
                                                                type="button"
                                                                className="ok-btn"
                                                                style={{ marginTop: "18px", height: "35px" }}
                                                                onClick={handleGenerateCode}
                                                            >
                                                                Generate Code
                                                            </button>
                                                        </div>
                                                    )}

                                                    <div className="input-field1">
                                                        <label>Activity Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Activity Name"
                                                            value={addActivity.Activity_Name}
                                                            onChange={(e) => setAddActivity({ ...addActivity, Activity_Name: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label>Description</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Description"
                                                            value={addActivity.Description}
                                                            onChange={(e) => setAddActivity({ ...addActivity, Description: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='bottom-buttons'>
                                                {!isEditMode && <button type='submit' className='ok-btn'>Submit</button>}
                                                {isEditMode && <button type='button' onClick={handleUpdateActivity} className='ok-btn'>Update</button>}
                                                <button type='button' onClick={() => setModalIsOpen(false)} className='ok-btn'>Close</button>
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </Modal >
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default RegionMaster;