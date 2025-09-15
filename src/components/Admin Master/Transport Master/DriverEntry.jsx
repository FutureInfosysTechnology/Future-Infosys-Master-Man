import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";



function DriverEntry() {

    const [getDriver, setGetDriver] = useState([]);              // To Get Driver Data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addDriver, setAddDriver] = useState({
        DriverName: "",
        Address: "",
        MobileNo: "",
        EmergencyContactNo: "",
        Email: "",
        Gender: "",
        BloodGroup: "",
        IdProof1: "",
        IDProof1No: "",
        IdProof2: "",
        IDProof2No: "",
        DriverCode: ""
    })


    const filteredgetDriver = getDriver.filter((driver) =>
        (driver && driver.Driver_Code && driver.Driver_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (driver && driver.Driver_Name && driver.Driver_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetDriver.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetDriver.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };


    const fetchData = async () => {
        try {
            const response = await getApi('/Master/getGetdriver');
            setGetDriver(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleGenerateCode = () => {
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddDriver({ ...addDriver, DriverCode: newCode });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            Driver_Code: addDriver.DriverCode,
            Driver_Name: addDriver.DriverName,
            Address: addDriver.Address,
            MobileNo: addDriver.MobileNo,
            Emergency_ContactNo: addDriver.EmergencyContactNo,
            Email_Id: addDriver.Email,
            Gender: addDriver.Gender,
            Blood_Group: addDriver.BloodGroup,
            Identity_Proof1: addDriver.IdProof1,
            ID_Proof1_Number: addDriver.IDProof1No,
            Identity_Proof2: addDriver.IdProof2,
            ID_Proof2_Number: addDriver.IDProof2No
        }

        try {
            const response = await postApi('/Master/UpdateDriver', requestBody, 'POST');
            if (response.status === 1) {
                setGetDriver(getDriver.map((driver) => driver.Driver_Code === addDriver.DriverCode ? response.Data : driver));
                setAddDriver({
                    DriverCode: '',
                    DriverName: '',
                    Address: '',
                    MobileNo: '',
                    EmergencyContactNo: '',
                    Email: '',
                    Gender: '',
                    BloodGroup: '',
                    IdProof1: '',
                    IdProof2: '',
                    IDProof1No: '',
                    IDProof2No: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the Driver.', 'error');
            }
        } catch (error) {
            console.error("Failed to update Driver:", error);
            Swal.fire('Error', 'Failed to update Driver data', 'error');
        }
    }

    const handleSaveDriver = async (e) => {
        e.preventDefault();

        const requestBody = {
            Driver_Code: addDriver.DriverCode,
            Driver_Name: addDriver.DriverName,
            Address: addDriver.Address,
            MobileNo: addDriver.MobileNo,
            Emergency_ContactNo: addDriver.EmergencyContactNo,
            Email_Id: addDriver.Email,
            Gender: addDriver.Gender,
            Blood_Group: addDriver.BloodGroup,
            Identity_Proof1: addDriver.IdProof1,
            ID_Proof1_Number: addDriver.IDProof1No,
            Identity_Proof2: addDriver.IdProof2,
            ID_Proof2_Number: addDriver.IDProof2No
        }

        try {
            const response = await postApi('/Master/addDriver', requestBody, 'POST');
            if (response.status === 1) {
                setGetDriver([...getDriver, response.Data]);
                setAddDriver({
                    DriverName: '',
                    Address: '',
                    MobileNo: '',
                    EmergencyContactNo: '',
                    Email: "",
                    Gender: '',
                    BloodGroup: '',
                    IdProof1: '',
                    IDProof1No: '',
                    IdProof2: '',
                    IDProof2No: '',
                    DriverCode: ''
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add branch data', 'error');
        }
    };


    const handleDeleteDriver = async (Driver_Code) => {
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
                await deleteApi(`/Master/DeleteDriverDetail?DriverCode=${Driver_Code}`);
                setGetDriver(getDriver.filter((driver) => driver.DriverCode !== Driver_Code));
                Swal.fire('Deleted!', 'The Driver has been deleted.', 'success');
                await fetchData();
            } catch (err) {
                console.error('Delete Error:', err);
                Swal.fire('Error', 'Failed to delete Driver', 'error');
            }
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getDriver);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getDriver');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getDriver.xlsx');
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

            pdf.save('getDriver.pdf');
        });
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
                                setAddDriver({
                                    DriverName: "", Address: "", MobileNo: "", EmergencyContactNo: "", Email: "", Gender: "",
                                    BloodGroup: "", IdProof1: "", IDProof1No: "", IdProof2: "", IDProof2No: "", DriverCode: ""
                                })
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
                                    <th scope="col">Driver_Code</th>
                                    <th scope="col">Driver_Name</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Mobile_No</th>
                                    <th scope="col">Emergency_Contatc_No</th>
                                    <th scope="col">Email_ID</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Blood_Group</th>
                                    <th scope="col">ID_Proof1</th>
                                    <th scope="col">ID_Proof1_No</th>
                                    <th scope="col">ID_Proof2</th>
                                    <th scope="col">ID_Proof2_No</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((driver, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                        <td>{driver.Driver_Code}</td>
                                        <td>{driver.Driver_Name}</td>
                                        <td>{driver.Address}</td>
                                        <td>{driver.MobileNo}</td>
                                        <td>{driver.Emergency_ContactNo}</td>
                                        <td>{driver.Email_Id}</td>
                                        <td>{driver.Gender}</td>
                                        <td>{driver.Blood_Group}</td>
                                        <td>{driver.Identity_Proof1}</td>
                                        <td>{driver.ID_Proof1_Number}</td>
                                        <td>{driver.Identity_Proof2}</td>
                                        <td>{driver.ID_Proof2_Number}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setAddDriver({
                                                        DriverCode: driver.Driver_Code,
                                                        DriverName: driver.Driver_Name,
                                                        Address: driver.Address,
                                                        MobileNo: driver.MobileNo,
                                                        EmergencyContactNo: driver.Emergency_ContactNo,
                                                        Email: driver.Email_Id,
                                                        Gender: driver.Gender,
                                                        BloodGroup: driver.Blood_Group,
                                                        IdProof1: driver.Identity_Proof1,
                                                        IDProof1No: driver.ID_Proof1_Number,
                                                        IdProof2: driver.Identity_Proof2,
                                                        IDProof2No: driver.ID_Proof2_Number
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button onClick={() => handleDeleteDriver(driver.Driver_Code)} className='edit-btn'>
                                                    <i className='bi bi-trash'></i>
                                                </button>
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


                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-custCharges" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Driver Master</header>
                            </div>
                            <div className='container2'>
                                <form onSubmit={handleSaveDriver}>

                                    <div className="fields2">
                                        <div className="input-field3">
                                            <label htmlFor="">Code </label>
                                            <input type="text"
                                                placeholder="enter your code/ generate code"
                                                value={addDriver.DriverCode}
                                                onChange={(e) => setAddDriver({ ...addDriver, DriverCode: e.target.value })}
                                                maxLength="3" readOnly={isEditMode} />
                                        </div>

                                        {!isEditMode && (
                                            <div className="input-field3">
                                                <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                    onClick={handleGenerateCode}>Generate Code</button>
                                            </div>
                                        )}

                                        <div className="input-field3">
                                            <label htmlFor="">Name</label>
                                            <input type="text" value={addDriver.DriverName}
                                                onChange={(e) => setAddDriver({ ...addDriver, DriverName: e.target.value })}
                                                placeholder="Enter Name" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" value={addDriver.Address}
                                                onChange={(e) => setAddDriver({ ...addDriver, Address: e.target.value })}
                                                placeholder="Enter Address" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Mobile No</label>
                                            <input type="tel" maxLength="10" id="mobile" value={addDriver.MobileNo}
                                                onChange={(e) => setAddDriver({ ...addDriver, MobileNo: e.target.value })}
                                                name="mobile" pattern="[0-9]{10}" placeholder="Enter Mobile No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Emergency Contact No</label>
                                            <input type="tel" maxLength="10" id="mobile" value={addDriver.EmergencyContactNo}
                                                onChange={(e) => setAddDriver({ ...addDriver, EmergencyContactNo: e.target.value })}
                                                name="mobile" pattern="[0-9]{10}" placeholder="Enter Emergency Contact No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Email Id</label>
                                            <input type="email" value={addDriver.Email}
                                                onChange={(e) => setAddDriver({ ...addDriver, Email: e.target.value })}
                                                placeholder="Enter Email" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Gender</label>
                                            <select value={addDriver.Gender}
                                                onChange={(e) => setAddDriver({ ...addDriver, Gender: e.target.value })} required>
                                                <option disabled value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Blood Group</label>
                                            <select value={addDriver.BloodGroup}
                                                onChange={(e) => setAddDriver({ ...addDriver, BloodGroup: e.target.value })} required>
                                                <option disabled value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Identity Proof</label>
                                            <select value={addDriver.IdProof1}
                                                onChange={(e) => setAddDriver({ ...addDriver, IdProof1: e.target.value })} required>
                                                <option disabled value="">Select ID Proof</option>
                                                <option value="Aadhaar Card">Aadhaar Card</option>
                                                <option value="Pan Card">Pan Card</option>
                                                <option value="Voter ID">Voter ID</option>
                                                <option value="Passport">Passport</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">ID Proof Number</label>
                                            <input type="tel" value={addDriver.IDProof1No}
                                                onChange={(e) => setAddDriver({ ...addDriver, IDProof1No: e.target.value })}
                                                placeholder="Enter ID Proof No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Identity Proof2</label>
                                            <select value={addDriver.IdProof2}
                                                onChange={(e) => setAddDriver({ ...addDriver, IdProof2: e.target.value })} required>
                                                <option disabled value="">Select Second ID Proof</option>
                                                <option value="Aadhaar Card">Aadhaar Card</option>
                                                <option value="Pan Card">Pan Card</option>
                                                <option value="Voter ID">Voter ID</option>
                                                <option value="Passport">Passport</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">ID Proof2 Number</label>
                                            <input type="tel" value={addDriver.IDProof2No}
                                                onChange={(e) => setAddDriver({ ...addDriver, IDProof2No: e.target.value })}
                                                placeholder="Enter Second ID Proof No" required />
                                        </div>
                                    </div>

                                    <div className='bottom-buttons'>
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
    );
};

export default DriverEntry;