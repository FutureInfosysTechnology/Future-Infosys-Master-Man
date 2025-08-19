import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import Modal from 'react-modal';
import { getApi, postApi, deleteApi } from '../Area Control/Zonemaster/ServicesApi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


function EmployeeName() {

    const [getEmp, setGetEmp] = useState([]);               // to get Employee Data
    const [getBranch, setGetBranch] = useState([]);         //To Get Branch Name Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');     // to Search Data
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addEmp, setAddEmp] = useState({
        empName: '',
        empCode: '',
        mobileNo: '',
        cityCode: '',
        userName: '',
        pass: ''
    })                                                      // To Add New Data



    const filteredgetEmp = getEmp.filter((emp) =>
        (emp && emp.Employee_Name && emp.Employee_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (emp && emp.User_Name && emp.User_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (emp && emp.Password && emp.Password.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (emp && emp.City_Name && emp.CIty_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetEmp.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetEmp.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
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
        fetchEmpData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
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
        fetchData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            Employee_Code: addEmp.empCode,
            Employee_Name: addEmp.empName,
            Employee_Mob: addEmp.mobileNo,
            City_Code: addEmp.cityCode,
            User_Name: addEmp.userName,
            Password: addEmp.pass
        };

        try {
            const response = await postApi('/Master/updateEmployee', requestBody, 'POST');
            if (response.status === 1) {
                setGetEmp(getEmp.map((emp) => emp.Employee_Code === addEmp.empCode ? response.Data : emp));
                setAddEmp({
                    empCode: '',
                    empName: '',
                    mobileNo: '',
                    cityCode: '',
                    userName: '',
                    pass: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchEmpData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the Employee.', 'error');
            }
        } catch (error) {
            console.error("Errro updating Employee:", error);
            Swal.fire('Error', 'Failed to update employee data', 'error');
        }
    }


    const handleSaveEmp = async (e) => {
        e.preventDefault();

        const requestBody = {
            EmployeeName: addEmp.empName,
            EmployeeCode: addEmp.empCode,
            MobileNo: addEmp.mobileNo,
            CityCode: addEmp.cityCode,
            UserName: addEmp.userName,
            Password: addEmp.pass
        }

        try {
            const response = await postApi('/Master/AddEmployee', requestBody, 'POST')
            if (response.status === 1) {
                setGetEmp([...getEmp, response.Data]);
                setAddEmp({
                    empName: '',
                    empCode: '',
                    mobileNo: '',
                    cityCode: '',
                    userName: '',
                    pass: ''
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchEmpData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add branch data', 'error');
        }
    };

    const handleDeleteEmp = async (Employee_Code) => {
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
                await deleteApi(`/Master/DeleteEmployee?empcode=${Employee_Code}`);
                setGetEmp(getEmp.filter((emp) => emp.empcode !== Employee_Code));
                Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
                await fetchEmpData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Employee', 'error');
        }
    };

    const handleGenerateCode = () => {
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddEmp({ ...addEmp, empCode: newCode });
    };



    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getEmp);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getEmp');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getEmp.xlsx');
    };

    const handleExportPDF = () => {
        const pdfData = getEmp.map(({ id, code, name }) =>
            [id, code, name]);

        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text('Zone Data', 14, 20);
        const headers = [['Sr.No', 'Zone Code', 'Zone Name']];
        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 30,
            theme: 'grid'
        });
        pdf.save('Zone.pdf');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

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
                                setAddEmp({ empCode: '', empName: '', mobileNo: '', cityCode: '', userName: '', pass: '' })
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
                                    <th scope="col" >Sr.No</th>
                                    <th scope="col" >Employee_Code</th>
                                    <th scope="col" >Employee_Name</th>
                                    <th scope="col" >Employee_Mob</th>
                                    <th scope="col" >User_Name</th>
                                    <th scope="col" >Password</th>
                                    <th scope="col" >CIty_Name</th>
                                    <th scope="col" >Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((emp, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{emp.Employee_Code}</td>
                                        <td>{emp.Employee_Name}</td>
                                        <td>{emp.Employee_Mob}</td>
                                        <td>{emp.User_Name}</td>
                                        <td>{emp.Password}</td>
                                        <td>{emp.CIty_Name}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setAddEmp({
                                                        empCode: emp.Employee_Code,
                                                        empName: emp.Employee_Name,
                                                        mobileNo: emp.Employee_Mob,
                                                        userName: emp.User_Name,
                                                        pass: emp.Password,
                                                        cityCode: emp.City_Code
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button onClick={() => handleDeleteEmp(emp.Employee_Code)} className='edit-btn'><i className='bi bi-trash'></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
                        <div className="pagination">
                            <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                {'<'}
                            </button>
                            <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                            <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                {'>'}
                            </button>
                        </div>

                        <div className="rows-per-page" style={{ display: "flex", flexDirection: "row", color: "black", marginLeft: "10px" }}>
                            <label htmlFor="rowsPerPage" style={{ marginTop: "16px", marginRight: "10px" }}>Rows per page:</label>
                            <select
                                id="rowsPerPage"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                style={{ height: "40px", width: "60px", marginTop: "10px" }}
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
                                <form onSubmit={handleSaveEmp}>

                                    <div className="form first">
                                        <div className="details personal">
                                            <div className="fields2">
                                                <div className="input-field1">
                                                    <label htmlFor="">Employee Code</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Code/ generate code"
                                                        value={addEmp.empCode} readOnly={isEditMode}
                                                        onChange={(e) => setAddEmp({ ...addEmp, empCode: e.target.value })} />
                                                </div>

                                                {!isEditMode && (
                                                    <div className="input-field1">
                                                        <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                            onClick={handleGenerateCode}>Generate Code</button>
                                                    </div>
                                                )}

                                                <div className="input-field1">
                                                    <label htmlFor="">Employee Name</label>
                                                    <input type="text" value={addEmp.empName}
                                                        onChange={(e) => setAddEmp({ ...addEmp, empName: e.target.value })}
                                                        placeholder="Enter Employee Name" required />
                                                </div>

                                                <div className="input-field1">
                                                    <label htmlFor="">Mobile No</label>
                                                    <input type="tel" maxLength="10" id="mobile" value={addEmp.mobileNo}
                                                        onChange={(e) => setAddEmp({ ...addEmp, mobileNo: e.target.value })}
                                                        name="mobile" pattern="[0-9]{10}" placeholder="Enter Mobile No" />
                                                </div>

                                                <div className="input-field1">
                                                    <label htmlFor="">Branch Name</label>
                                                    <select value={addEmp.cityCode}
                                                        onChange={(e) => setAddEmp({ ...addEmp, cityCode: e.target.value })}>
                                                        <option value="" disabled >Select City</option>
                                                        {getBranch.map((branch, index) => (
                                                            <option value={branch.Branch_Code} key={index}>{branch.Branch_Name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-field1">
                                                    <label htmlFor="">User Name</label>
                                                    <input type="text" value={addEmp.userName}
                                                        onChange={(e) => setAddEmp({ ...addEmp, userName: e.target.value })}
                                                        placeholder="Enter User Name" />
                                                </div>

                                                <div className="input-field1">
                                                    <label htmlFor="">Password</label>
                                                    <div className="password-container" style={{ position: 'relative' }}>
                                                        <input
                                                            type={passwordVisible ? 'text' : 'password'}
                                                            value={addEmp.pass}
                                                            onChange={(e) => setAddEmp({ ...addEmp, pass: e.target.value })}
                                                            placeholder="Enter Password"
                                                            required
                                                        />
                                                        <span
                                                            onClick={togglePasswordVisibility}
                                                            className="fa-eye">
                                                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='bottom-buttons'>
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
        </>
    );
};

export default EmployeeName;