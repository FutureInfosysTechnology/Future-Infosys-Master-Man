import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


function TransportEntry() {
    const [openRow, setOpenRow] = useState(null);
    const [getTransport, setGetTransport] = useState([]);            // To Get Transport Data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addTransport, setAddTransport] = useState({
        TransportCode: "",
        TransportName: "",
        ContactPerson: "",
        Address: "",
        MobileNo: "",
        Email: ""
    })


    const filteredgetVehicle = getTransport.filter((transport) =>
        (transport && transport.Transport_Code && transport.Transport_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (transport && transport.Transport_Name && transport.Transport_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetVehicle.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetVehicle.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };


    const fetchData = async () => {
        try {
            const response = await getApi('/Master/gettransport');
            setGetTransport(Array.isArray(response.Data) ? response.Data : []);
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
        setAddTransport({ ...addTransport, TransportCode: newCode });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            Transport_Code: addTransport.TransportCode,
            Transport_Name: addTransport.TransportName,
            Contact_Person: addTransport.ContactPerson,
            Address: addTransport.Address,
            MobileNo: addTransport.MobileNo,
            Email_Id: addTransport.Email
        }

        try {
            const response = await postApi('/Master/UpdateTransport', requestBody, 'POST');
            if (response.status === 1) {
                setGetTransport(getTransport.map((transport) => transport.Transport_Code === addTransport.TransportCode ? response.Data : transport));
                setAddTransport({
                    TransportCode: '',
                    TransportName: '',
                    ContactPerson: '',
                    Address: '',
                    MobileNo: '',
                    Email: ''
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the Transport.', 'error');
            }
        } catch (error) {
            console.error('Error updating Transport:', error);
            Swal.fire('Error', 'Failed to update Transport data', 'error');
        }
    }


    const handleSaveTransport = async (e) => {
        e.preventDefault();

        try {
            const response = await postApi(`/Master/addTransportMaster?Transport_Code=${addTransport.TransportCode}
                  &Transport_Name=${addTransport.TransportName}
                  &Contact_Person=${addTransport.ContactPerson}
                  &Address=${addTransport.Address}
                  &MobileNo=${addTransport.MobileNo}
                  &Email_Id=${addTransport.Email}`);
            if (response.status === 1) {
                setGetTransport([...getTransport, response.Data]);
                setAddTransport({
                    TransportCode: "",
                    TransportName: "",
                    ContactPerson: "",
                    Address: "",
                    MobileNo: "",
                    Email: ""
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Transport data', 'error');
        }
    };


    const handleDeleteTransport = async (Transport_Code) => {
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
                await deleteApi(`/Master/DeletetransportDetail?transportCode=${Transport_Code}`);
                setGetTransport(getTransport.filter((transport) => transport.transportCode !== Transport_Code));
                Swal.fire('Deleted!', 'The Transport has been deleted.', 'success');
                await fetchData();
            } catch (err) {
                console.error('Delete Error:', err);
                Swal.fire('Error', 'Failed to delete Transport', 'error');
            }
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getTransport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getTransport');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getTransport.xlsx');
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

            pdf.save('getTransport.pdf');
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
                                setAddTransport({
                                    TransportCode: "", TransportName: "", ContactPerson: "", Address: "",
                                    MobileNo: "", Email: ""
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
                        <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                            <thead className='table-sm'>
                                <tr>
                                    <th scope="col">Actions</th>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Transport_Code</th>
                                    <th scope="col">Transport_Name</th>
                                    <th scope="col">Contact_Person</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Mobile_No</th>
                                    <th scope="col">Email_ID</th>

                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((transport, index) => (
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
                                                        left: "80px",
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
                                                    setAddTransport({
                                                        TransportCode: transport.Transport_Code,
                                                        TransportName: transport.Transport_Name,
                                                        ContactPerson: transport.Contact_Person,
                                                        Address: transport.Address,
                                                        MobileNo: transport.MobileNo,
                                                        Email: transport.Email_Id
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button onClick={() => {
                                                     setOpenRow(null);
                                                     handleDeleteTransport(transport.Transport_Code);
                                                     }} className='edit-btn'><i className='bi bi-trash'></i></button>
                                                </div>
                                            )}
                                        </td>

                                        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                        <td>{transport.Transport_Code}</td>
                                        <td>{transport.Transport_Name}</td>
                                        <td>{transport.Contact_Person}</td>
                                        <td>{transport.Address}</td>
                                        <td>{transport.MobileNo}</td>
                                        <td>{transport.Email_Id}</td>

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
                                <header>Transport Master</header>
                            </div>
                            <div className='container2'>
                                <form onSubmit={handleSaveTransport}>

                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Code </label>
                                            <input type="text"
                                                placeholder="enter your code/ generate code"
                                                value={addTransport.TransportCode}
                                                onChange={(e) => setAddTransport({ ...addTransport, TransportCode: e.target.value })}
                                                maxLength="3" readOnly={isEditMode} />
                                        </div>

                                        {!isEditMode && (
                                            <div className="input-field1">
                                                <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                    onClick={handleGenerateCode}>Generate Code</button>
                                            </div>
                                        )}

                                        <div className="input-field1">
                                            <label htmlFor="">Name</label>
                                            <input type="text" value={addTransport.TransportName}
                                                onChange={(e) => setAddTransport({ ...addTransport, TransportName: e.target.value })}
                                                placeholder="Enter Name" required />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Contacted Person</label>
                                            <input type="text" value={addTransport.ContactPerson}
                                                onChange={(e) => setAddTransport({ ...addTransport, ContactPerson: e.target.value })}
                                                placeholder="Enter Contacted Person" required />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Address</label>
                                            <input type="text" value={addTransport.Address}
                                                onChange={(e) => setAddTransport({ ...addTransport, Address: e.target.value })}
                                                placeholder="Enter Address" required />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Mobile No</label>
                                            <input type="tel" maxLength="10" id="mobile" value={addTransport.MobileNo}
                                                onChange={(e) => setAddTransport({ ...addTransport, MobileNo: e.target.value })}
                                                name="mobile" pattern="[0-9]{10}" placeholder="enter your mobile no" required />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Email Id</label>
                                            <input type="email" value={addTransport.Email}
                                                onChange={(e) => setAddTransport({ ...addTransport, Email: e.target.value })}
                                                placeholder="Enter Email" required />
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

export default TransportEntry;