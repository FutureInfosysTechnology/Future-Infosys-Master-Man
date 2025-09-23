import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Select from 'react-select';
import Modal from 'react-modal';
import sms from '../../../Assets/Images/sms-svgrepo-com.png';
import mail from '../../../Assets/Images/mail-reception-svgrepo-com.png';
import whatsapp from '../../../Assets/Images/whatsapp-svgrepo-com.png';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";


function ReceiverName() {

    const [getReceiver, setGetReceiver] = useState([]);  // To Get Receiver Data
    const [getCity, setGetCity] = useState([]); // To Get City Data
    const [getState, setGetState] = useState([]);  // To Get State Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addReceiver, setAddReceiver] = useState({
        receiverCode: '',
        receiverName: '',
        receiverAdd1: '',
        receiverAdd2: '',
        receiverPin: '',
        cityCode: '',
        stateCode: '',
        receiverMob: '',
        receiverEmail: '',
        gstNo: '',
        hsnNo: '',
        sms: false,
        emailId: false,
        whatsApp: false
    })


    const filteredgetReceiver = getReceiver.filter((receiver) =>
        (receiver && receiver.Receiver_Code && receiver.Receiver_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (receiver && receiver.Receiver_Name && receiver.Receiver_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (receiver && receiver.Receiver_Add1 && receiver.Receiver_Add1.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (receiver && receiver.Receiver_Pin && receiver.Receiver_Pin.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (receiver && receiver.City_Code && receiver.City_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (receiver && receiver.State_Code && receiver.State_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (receiver && receiver.Receiver_Mob && receiver.Receiver_Mob.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (receiver && receiver.Receiver_Email && receiver.Receiver_Email.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (receiver && receiver.GSTNo && receiver.GSTNo.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (receiver && receiver.HSNNo && receiver.HSNNo.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetReceiver.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetReceiver.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };



    const fetchReceiverData = async () => {
        try {
            const response = await getApi('/Master/GetReceiver');
            setGetReceiver(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchReceiverData();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi('/Master/getdomestic');
                setGetCity(Array.isArray(response.Data) ? response.Data : []);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi('/Master/GetState');
                setGetState(Array.isArray(response.Data) ? response.Data : []);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleGenerateCode = () => {
        if (addReceiver.receiverCode !== '') return;
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddReceiver({ ...addReceiver, receiverCode: newCode });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            ReceiverCode: addReceiver.receiverCode,
            ReceiverName: addReceiver.receiverName,
            ReceiverAdd1: addReceiver.receiverAdd1,
            ReceiverAdd2: addReceiver.receiverAdd2,
            ReceiverPin: addReceiver.receiverPin,
            CityCode: addReceiver.cityCode,
            StateCode: addReceiver.stateCode,
            ReceiverMob: addReceiver.receiverMob,
            ReceiverEmail: addReceiver.receiverEmail,
            GSTNo: addReceiver.gstNo.toUpperCase(),
            HSNNo: addReceiver.hsnNo,
            SMS: addReceiver.sms,
            EmailId: addReceiver.emailId,
            WhatApp: addReceiver.whatsApp
        }

        try {
            const response = await postApi('/Master/UpdateReceiver', requestBody, 'POST');
            if (response.status === 1) {
                setGetReceiver(getReceiver.map((receiver) => receiver.Receiver_Code === addReceiver.receiverCode ? response.Data : receiver));
                setAddReceiver({
                    receiverCode: '',
                    receiverName: '',
                    receiverAdd1: '',
                    receiverAdd2: '',
                    receiverPin: '',
                    cityCode: '',
                    stateCode: '',
                    receiverMob: '',
                    receiverEmail: '',
                    gstNo: '',
                    hsnNo: '',
                    sms: false,
                    emailId: false,
                    whatsApp: false
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchReceiverData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the receiver.', 'error');
            }
        } catch (error) {
            console.error('Error updating receiver:', error);
            Swal.fire('Error', 'Failed to update receiver data', 'error');
        }
    }

    const handleSaveReceiver = async (e) => {
        e.preventDefault();

        const requestBody = {
            receiverCode: addReceiver.receiverCode,
            receiverName: addReceiver.receiverName,
            receiverAdd1: addReceiver.receiverAdd1,
            receiverAdd2: addReceiver.receiverAdd2,
            receiverPin: addReceiver.receiverPin,
            cityCode: addReceiver.cityCode,
            stateCode: addReceiver.stateCode,
            receiverMob: addReceiver.receiverMob,
            receiverEmail: addReceiver.receiverEmail,
            gstNo: addReceiver.gstNo.toUpperCase(),
            hsnNo: addReceiver.hsnNo,
            sms: addReceiver.sms,
            emailId: addReceiver.emailId,
            whatsApp: addReceiver.whatsApp
        }

        try {
            const response = await postApi('/Master/AddReceiver', requestBody, 'POST')
            if (response.status === 1) {
                setGetReceiver([...getReceiver, response.Data]);
                setAddReceiver({
                    receiverCode: '',
                    receiverName: '',
                    receiverAdd1: '',
                    receiverAdd2: '',
                    receiverPin: '',
                    cityCode: '',
                    stateCode: '',
                    receiverMob: '',
                    receiverEmail: '',
                    gstNo: '',
                    hsnNo: '',
                    sms: false,
                    emailId: false,
                    whatApp: false
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchReceiverData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add branch data', 'error');
        }
    };


    const handleDeleteReceiver = async (Receiver_Code) => {
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
                await deleteApi(`/Master/DeleteReciever?RecieverCode=${Receiver_Code}`);
                setGetReceiver(getReceiver.filter((receiver) => receiver.RecieverCode !== Receiver_Code));
                Swal.fire('Deleted!', 'Receiver Name has been deleted.', 'success');
                await fetchReceiverData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Receiver Name', 'error');
        }
    };


    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getReceiver);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getReceiver');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getReceiver.xlsx');
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

            pdf.save('getReceiver.pdf');
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
                                setAddReceiver({
                                    receiverCode: '', receiverName: '', receiverAdd1: '', receiverAdd2: '',
                                    receiverPin: '', cityCode: '', stateCode: '', receiverMob: '', receiverEmail: '',
                                    gstNo: '', hsnNo: '', sms: false, emailId: false, whatsApp: false
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
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Receiver_Code</th>
                                    <th scope="col">Receiver_Name</th>
                                    <th scope="col">Receiver_Add</th>
                                    <th scope="col">Pin_Code</th>
                                    <th scope="col">City_Name</th>
                                    <th scope="col">State_Name</th>
                                    <th scope="col">Mobile_No</th>
                                    <th scope="col">Email_ID</th>
                                    <th scope="col">GST_No</th>
                                    <th scope="col">HSN_No</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((receiver, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{receiver.Receiver_Code}</td>
                                        <td>{receiver.Receiver_Name}</td>
                                        <td>{receiver.Receiver_Add1}</td>
                                        <td>{receiver.Receiver_Pin}</td>
                                        <td>{receiver.City_Name}</td>
                                        <td>{receiver.State_Name}</td>
                                        <td>{receiver.Receiver_Mob}</td>
                                        <td>{receiver.Receiver_Email}</td>
                                        <td>{receiver.GSTNo}</td>
                                        <td>{receiver.HSNNo}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setAddReceiver({
                                                        receiverCode: receiver.Receiver_Code,
                                                        receiverName: receiver.Receiver_Name,
                                                        gstNo: receiver.GSTNo,
                                                        receiverAdd1: receiver.Receiver_Add1,
                                                        receiverAdd2: receiver.Receiver_Add2,
                                                        receiverPin: receiver.Receiver_Pin,
                                                        receiverMob: receiver.Receiver_Mob,
                                                        stateCode: receiver.State_Code,
                                                        cityCode:receiver.City_Code,
                                                        receiverEmail: receiver.Receiver_Email,
                                                        hsnNo: receiver.HSNNo,
                                                        sms: false,
                                                        emailId: false,
                                                        whatApp: false
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button onClick={() => handleDeleteReceiver(receiver.Receiver_Code)} className='edit-btn'><i className='bi bi-trash'></i></button>
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
                        className="custom-modal-receiver" contentLabel="Modal"
                        style={{
                            content: {
                                width: '90%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap"
                            },
                        }}>
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Receiver Name Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSaveReceiver}>
                                    <div className="fields2">
                                        <div className="input-field3">
                                            <label htmlFor="">Code </label>
                                            <input
                                                type="text" value={addReceiver.receiverCode}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverCode: e.target.value })}
                                                placeholder="Enter Code/ Generate Code"
                                                maxLength="3" readOnly={isEditMode} />
                                        </div>

                                        {!isEditMode && (
                                            <div className="input-field3">
                                                <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                    onClick={handleGenerateCode}>Generate Code</button>
                                            </div>
                                        )}

                                        <div className="input-field3">
                                            <label htmlFor="">Customer Name</label>
                                            <input type="text" value={addReceiver.receiverName}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverName: e.target.value })}
                                                placeholder="Customer Name" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" value={addReceiver.receiverAdd1}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverAdd1: e.target.value })}
                                                placeholder="Address" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" value={addReceiver.receiverAdd2}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverAdd2: e.target.value })}
                                                placeholder="Address" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Pin code</label>
                                            <input type="tel" id="pincode" name="pincode" maxLength="6"
                                                value={addReceiver.receiverPin}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverPin: e.target.value })}
                                                placeholder="Pin Code" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">City Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getCity.map((city) => ({
                                                    value: city.City_Code,
                                                    label: city.City_Name,
                                                }))}
                                                value={
                                                    addReceiver.cityCode
                                                        ? {
                                                            value: addReceiver.cityCode,
                                                            label:
                                                                getCity.find((c) => c.City_Code === addReceiver.cityCode)
                                                                    ?.City_Name || "",
                                                        }
                                                        : null
                                                }
                                                onChange={(selected) =>
                                                    setAddReceiver({
                                                        ...addReceiver,
                                                        cityCode: selected ? selected.value : "",
                                                    })
                                                }
                                                placeholder="Select City"
                                                isSearchable={true}
                                                isClearable={false}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />

                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">State Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getState.map((st) => ({
                                                    value: st.State_Code,
                                                    label: st.State_Name,
                                                }))}
                                                value={
                                                    addReceiver.stateCode
                                                        ? {
                                                            value: addReceiver.stateCode,
                                                            label:
                                                                getState.find((s) => s.State_Code === addReceiver.stateCode)
                                                                    ?.State_Name || "",
                                                        }
                                                        : null
                                                }
                                                onChange={(selected) =>
                                                    setAddReceiver({
                                                        ...addReceiver,
                                                        stateCode: selected ? selected.value : "",
                                                    })
                                                }
                                                placeholder="Select State"
                                                isSearchable={true}
                                                isClearable={false}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />

                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Mobile No</label>
                                            <input type="tel" maxLength="10" id="mobile"
                                                value={addReceiver.receiverMob}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverMob: e.target.value })}
                                                name="mobile" pattern="[0-9]{10}" placeholder="Mobile No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Email ID</label>
                                            <input type="email" value={addReceiver.receiverEmail}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverEmail: e.target.value })}
                                                placeholder="Email Id" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">GST No</label>
                                            <input type="text" value={addReceiver.gstNo}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, gstNo: e.target.value })}
                                                placeholder="Gst No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">HSN No</label>
                                            <input type="text" value={addReceiver.hsnNo}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, hsnNo: e.target.value })}
                                                placeholder="HSN No" required />
                                        </div>

                                        <div className="input-field2">
                                            <div className="select-radio">
                                                <input type="checkbox" name="mode" id="SMS"
                                                    checked={addReceiver.sms}
                                                    onChange={(e) => setAddReceiver({ ...addReceiver, sms: e.target.checked })} />
                                                <img src={sms} />

                                                <input type="checkbox" name="mode" id="E-mail"
                                                    checked={addReceiver.emailId}
                                                    onChange={(e) => setAddReceiver({ ...addReceiver, emailId: e.target.checked })} />
                                                <img src={mail} />

                                                <input type="checkbox" name="mode" id="WHATSAPP"
                                                    checked={addReceiver.whatsApp}
                                                    onChange={(e) => setAddReceiver({ ...addReceiver, whatsApp: e.target.checked })} />
                                                <img src={whatsapp} />
                                            </div>
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
    )
}

export default ReceiverName;