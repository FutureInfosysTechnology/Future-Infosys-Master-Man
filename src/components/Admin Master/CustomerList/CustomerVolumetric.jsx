import React, { useState, useEffect } from "react";
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { postApi, getApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";


function CustomerVolumetric() {

    const [getVolumetric, setGetVolumetric] = useState([]);                // To Get Volumetric Data
    const [getCustomerName, setGetCustomerName] = useState([]);            // To Get Customer Name Data
    const [getMode, setGetMode] = useState([]);                            // To Get Mode Data
    const [selectedCustName, setSelectedCustName] = useState('');
    const [selectedCustCode, setSelectedCustCode] = useState('');
    const [selectedModeCode, setSelectedModeCode] = useState('');
    const [selectedModeName, setSelectedModeName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [readOnly, setReadOnly] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addVolumteric, setAddVolumetric] = useState({
        CustomerCode: '',
        ModeCode: '',
        Centimeter: '',
        Feet: '',
        Inches: '',
        InchesFeet: ''
    })                                                            // To Add Volumetric Data


    const filteredgetVolumetric = getVolumetric.filter((vol) =>
        (vol && vol.Customer_Code && vol.Customer_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vol && vol.Customer_Name && vol.Customer_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetVolumetric.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetVolumetric.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };


    const fetchCustVolumetricData = async () => {
        try {
            const response = await getApi('/Master/GetCustomerVolumetric');
            setGetVolumetric(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerData = async () => {
        try {
            const response = await getApi('/Master/getCustomer');
            setGetCustomerName(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
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
        fetchCustVolumetricData();
        fetchCustomerData();
        fetchModeData();
    }, []);


    const handleCustNameChange = (e) => {
        const custName = e.target.value;
        setSelectedCustName(custName);

        const selectedCust = getCustomerName.find((cust) => cust.Customer_Name === custName);
        if (selectedCust) {
            setSelectedCustCode(selectedCust.Customer_Code);
            setAddVolumetric({
                ...addVolumteric,
                CustomerCode: selectedCust.Customer_Code.toString(),
            });
        }
    };

    const handleModeNameChange = (e) => {
        const modeName = e.target.value;
        setSelectedModeName(modeName);

        const selectedMode = getMode.find((mode) => mode.Mode_Name === modeName);
        if (selectedMode) {
            setSelectedModeCode(selectedMode.Mode_Code);
            setAddVolumetric({
                ...addVolumteric,
                ModeCode: selectedMode.Mode_Code,
            });
        }
    };

    const handleOpenModal = () => {
        setModalIsOpen(true);
        setReadOnly(false);
        setSelectedCustName('');
        setSelectedCustCode('');
        setSelectedModeName('');
        setSelectedModeCode('');
        setAddVolumetric({
            CustomerCode: '',
            ModeCode: '',
            Centimeter: '',
            Feet: '',
            Inches: '',
            InchesFeet: ''
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            CustomerCode: addVolumteric.CustomerCode ? addVolumteric.CustomerCode.toString() : "",
            ModeCode: addVolumteric.ModeCode,
            Centimeter: addVolumteric.Centimeter,
            Feet: addVolumteric.Feet,
            Inches: addVolumteric.Inches,
            InchesFeet: addVolumteric.InchesFeet
        }

        try {
            const response = await postApi('/Master/UpdateCustomerVolumetric', requestBody, 'POST');
            if (response.status === 1) {
                setGetVolumetric(getVolumetric.map((volumetric) => volumetric.Customer_Code === addVolumteric.CustomerCode ? response.Data : volumetric));
                setAddVolumetric({
                    CustomerCode: '',
                    ModeCode: '',
                    Centimeter: '',
                    Feet: '',
                    Inches: '',
                    InchesFeet: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCustVolumetricData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the customer volumetric.', 'error');
            }
        } catch (error) {
            console.error('Failed to update customer volumetric:', error);
            Swal.fire('Error', 'Failed to update customer volumetric data', 'error');
        }
    }



    const handleSaveVolumetric = async (e) => {
        e.preventDefault();

        const requestBody = {
            CustomerCode: addVolumteric.CustomerCode,
            ModeCode: addVolumteric.ModeCode,
            Centimeter: addVolumteric.Centimeter,
            Feet: addVolumteric.Feet,
            Inches: addVolumteric.Inches,
            InchesFeet: addVolumteric.InchesFeet
        }

        try {
            const response = await postApi('/Master/AddCustomerVolumetric', requestBody, 'POST');
            if (response.status === 1) {
                setGetVolumetric([...getVolumetric, response.Data]);
                setAddVolumetric({
                    CustomerCode: '',
                    ModeCode: '',
                    Centimeter: '',
                    Feet: '',
                    Inches: '',
                    InchesFeet: ''
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCustVolumetricData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Volumetric data', 'error');
        }
    };


    const handleDeleteVolumetric = async (Customer_Code) => {
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
                await deleteApi(`/Master/DeleteCustvolumetric?Customer_Code=${Customer_Code}`);
                setGetVolumetric(getVolumetric.filter((vol) => vol.Customer_Code !== Customer_Code));
                Swal.fire('Deleted!', 'Volumetric has been deleted.', 'success');
                await fetchCustVolumetricData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Volumetric', 'error');
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getVolumetric);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getVolumetric');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getVolumetric.xlsx');
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

            pdf.save('getVolumetric.pdf');
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
                            <button className='add-btn' onClick={handleOpenModal}>
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
                                    <th scope="col">Code</th>
                                    <th scope="col">Customer Name</th>
                                    <th scope="col">Mode Code</th>
                                    <th scope="col">Mode Name</th>
                                    <th scope="col">Centimeter</th>
                                    <th scope="col">Feet</th>
                                    <th scope="col">Inches</th>
                                    <th scope="col">Inches Feet</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((vol, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{vol.Customer_Code}</td>
                                        <td>{vol.Customer_Name}</td>
                                        <td>{vol.Mode_Code}</td>
                                        <td>{vol.Mode_Name}</td>
                                        <td>{vol.Centimeter}</td>
                                        <td>{vol.Feet}</td>
                                        <td>{vol.Inches}</td>
                                        <td>{vol.Inches_Feet}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setReadOnly(true);
                                                    setAddVolumetric({
                                                        CustomerCode: vol.Customer_Code,
                                                        ModeCode: vol.Mode_Code,
                                                        Centimeter: vol.Centimeter,
                                                        Feet: vol.Feet,
                                                        Inches: vol.Inches,
                                                        InchesFeet: vol.Inches_Feet
                                                    });
                                                    setSelectedCustCode(vol.Customer_Code);
                                                    setSelectedModeCode(vol.Mode_Code);
                                                    setSelectedCustName(vol.Customer_Name);
                                                    setSelectedModeName(vol.Mode_Name);
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button className='edit-btn' onClick={() => handleDeleteVolumetric(vol.Customer_Code)}><i className='bi bi-trash'></i></button>
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

                    <Modal id="modal" overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-volumetric" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Customer Volumetric</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSaveVolumetric}>

                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Code </label>
                                            <input
                                                type="text" value={selectedCustCode}
                                                placeholder="enter your code/ generate code"
                                                maxLength="3" readOnly />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Customer Name</label>
                                            <select value={selectedCustName} onChange={handleCustNameChange} required aria-readonly={readOnly}>
                                                <option value="" disabled >Select Customer Name</option>
                                                {getCustomerName.map((cust, index) => (
                                                    <option value={cust.Customer_Name} key={index}>{cust.Customer_Name}</option>
                                                ))}
                                            </select>
                                        </div>


                                        <div className="input-field1">
                                            <label htmlFor="">Mode Code</label>
                                            <input
                                                type="text"
                                                value={selectedModeCode}
                                                readOnly
                                                placeholder="Mode Code will auto-fill"
                                            />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Mode</label>
                                            <select value={selectedModeName} onChange={handleModeNameChange} required>
                                                <option value="" disabled >Select Mode</option>
                                                {getMode.map((mode, index) => (
                                                    <option value={mode.Mode_Name} key={index}>{mode.Mode_Name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Volumetric Calculation Formula</label>
                                        </div>
                                    </div>

                                    <div className="fields2">
                                        <div className="input-field3">
                                            <label htmlFor="">Centimeter</label>
                                            <input type="tel" value={addVolumteric.Centimeter}
                                                onChange={(e) => setAddVolumetric({ ...addVolumteric, Centimeter: e.target.value })}
                                                placeholder="Enter Centimeters" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Feet</label>
                                            <input type="tel" value={addVolumteric.Feet}
                                                onChange={(e) => setAddVolumetric({ ...addVolumteric, Feet: e.target.value })}
                                                placeholder="Enter Feet" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Inches</label>
                                            <input type="tel" value={addVolumteric.Inches}
                                                onChange={(e) => setAddVolumetric({ ...addVolumteric, Inches: e.target.value })}
                                                placeholder="Enter Inches" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Feet</label>
                                            <input type="tel" value={addVolumteric.InchesFeet}
                                                onChange={(e) => setAddVolumetric({ ...addVolumteric, InchesFeet: e.target.value })}
                                                placeholder="Enter Feet" />
                                        </div>
                                    </div>

                                    <div className='bottom-buttons'>
                                        {!readOnly && (<button type='submit' className='ok-btn'>Submit</button>)}
                                        {readOnly && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
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

export default CustomerVolumetric;