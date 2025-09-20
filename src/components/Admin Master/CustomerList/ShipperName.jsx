import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import sms from '../../../Assets/Images/sms-svgrepo-com.png';
import mail from '../../../Assets/Images/mail-reception-svgrepo-com.png';
import whatsapp from '../../../Assets/Images/whatsapp-svgrepo-com.png';
import { getApi, postApi, deleteApi, putApi } from "../Area Control/Zonemaster/ServicesApi";


function ShipperName() {

    const [getShipper, setGetShipper] = useState([]);  // To Get Receiver Data
    const [getCity, setGetCity] = useState([]); // To Get City Data
    const [getState, setGetState] = useState([]);  // To Get State Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addShipper, setAddShipper] = useState({
        shipperCode: '',
        custCode: '',
        shipperName: '',
        shipperAdd1: '',
        shipperAdd2: '',
        shipperPin: '',
        cityCode: '',
        stateCode: '',
        shipperMob: '',
        shipperEmail: '',
        gstNo: '',
        company: '',
    });

    const filteredgetShipper = getShipper.filter((shipper) =>
    (shipper?.Shipper_Code?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (shipper?.Shipper_Name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (shipper?.Add1?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (shipper?.Pin?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (shipper?.City_Name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (shipper?.State_Name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (shipper?.Mobile?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (shipper?.Email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (shipper?.GSTNo?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (shipper?.CompanyName?.toLowerCase().includes(searchQuery.toLowerCase()))
);


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetShipper.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetShipper.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };


    const fetchShipper = async () => {
        try {
            const response = await getApi("/Master/GetSmartShipperMaster");
            if (response.status === 1 && Array.isArray(response.data)) {
                setGetShipper(response.data);
            }
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchShipper();
    }, []);
    console.log(getShipper);

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
        if (addShipper.shipperCode !== '') return;
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddShipper({ ...addShipper, shipperCode: newCode });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
  const requestBody = {
    Shipper_Code: addShipper.shipperCode,
    Shipper_Name: addShipper.shipperName,
    Add1: addShipper.shipperAdd1,
    Add2: addShipper.shipperAdd2,
    Pin: addShipper.shipperPin,
    Mobile: addShipper.shipperMob,
    State_Code: addShipper.stateCode,
    GSTNo: addShipper.gstNo,
    Email: addShipper.shipperEmail,
    City_Code: addShipper.cityCode,
    CompanyName: addShipper.company
};

        try {
            const response = await putApi('/Master/UpdateSmartShipperMaster', requestBody, 'POST');
            if (response.status === 1) {
                setGetShipper(getShipper.map((shipper) => shipper.Shipper_Code === addShipper.shipperCode ? response.data : shipper));
                setAddShipper({
                    shipperCode: '',
                    custCode: '',
                    shipperName: '',
                    shipperAdd1: '',
                    shipperAdd2: '',
                    shipperPin: '',
                    cityCode: '',
                    stateCode: '',
                    shipperMob: '',
                    shipperEmail: '',
                    gstNo: '',
                    company: '',
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchShipper();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the receiver.', 'error');
            }
        } catch (error) {
            console.error('Error updating receiver:', error);
            Swal.fire('Error', 'Failed to update receiver data', 'error');
        }
    }

    const handleSaveShipper = async (e) => {
        e.preventDefault();

        const requestBody = {
            shipperCode: addShipper.shipperCode,
            // customerCode: addReceiver.custCode,
            shipperName: addShipper.shipperName,
            add1: addShipper.shipperAdd1,
            add2: addShipper.shipperAdd2,
            pin: addShipper.shipperPin,
            mobile: addShipper.shipperMob,
            stateCode: addShipper.stateCode,
            gstNo: addShipper.gstNo,
            email: addShipper.shipperEmail,
            cityCode: addShipper.cityCode,
            companyName: addShipper.company
        };

        try {
            const response = await postApi('/Master/AddShippmerMaster', requestBody, 'POST')
            if (response.status === 1) {
                setAddShipper({
                    shipperCode: '',
                    custCode: '',
                    shipperName: '',
                    shipperAdd1: '',
                    shipperAdd2: '',
                    shipperPin: '',
                    cityCode: '',
                    stateCode: '',
                    shipperMob: '',
                    shipperEmail: '',
                    gstNo: '',
                    company: '',
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchShipper();

            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add branch data', 'error');
        }
    };


    const handleDeleteShipper = async (Shipper_Code) => {
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
                await deleteApi(`/Master/DeleteShipperMaster?shipperCode=${Shipper_Code}`);
                setGetShipper(getShipper.filter((shipper) => shipper.Shipper_Code !== Shipper_Code));
                Swal.fire('Deleted!', 'Shipper Name has been deleted.', 'success');
                await fetchShipper();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Shipper Name', 'error');
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getShipper);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getShipper');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getShipper.xlsx');
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

            pdf.save('getShipper.pdf');
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
                                setAddShipper({
                                    shipperCode: '',
                                    custCode: '',
                                    shipperName: '',
                                    shipperAdd1: '',
                                    shipperAdd2: '',
                                    shipperPin: '',
                                    cityCode: '',
                                    stateCode: '',
                                    shipperMob: '',
                                    shipperEmail: '',
                                    gstNo: '',
                                    company: '',
                                });
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
                                    <th scope="col">Shipper_Code</th>
                                    <th scope="col">Shipper_Name</th>
                                    <th scope="col">Shipper_Add</th>
                                    <th scope="col">Pin_Code</th>
                                    <th scope="col">City_Name</th>
                                    <th scope="col">State_Name</th>
                                    <th scope="col">Mobile_No</th>
                                    <th scope="col">Email_ID</th>
                                    <th scope="col">GST_No</th>
                                    <th scope="col">Company</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((shipper, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{shipper.Shipper_Code}</td>
                                        <td>{shipper.Shipper_Name}</td>
                                        <td>{shipper.Add1}</td>
                                        <td>{shipper.Pin}</td>
                                        <td>{shipper.City_Name}</td>
                                        <td>{shipper.State_Name}</td>
                                        <td>{shipper.Mobile}</td>
                                        <td>{shipper.Email}</td>
                                        <td>{shipper.GSTNo}</td>
                                        <td>{shipper.CompanyName}</td> {/* ✅ Fixed spelling */}

                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setAddShipper({
                                                        shipperCode:shipper.Shipper_Code,
                                                        shipperName: shipper.Shipper_Name,
                                                        shipperAdd1:shipper.Add1,
                                                        shipperAdd2: shipper.Add2,
                                                        shipperPin:shipper.Pin,
                                                        cityCode:shipper.City_Code,
                                                        stateCode:shipper.State_Code,
                                                        shipperMob:shipper.Mobile,
                                                        shipperEmail:shipper.Email,
                                                        gstNo:shipper.GSTNo,
                                                        company:shipper.CompanyName,
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button onClick={() => handleDeleteShipper(shipper.Shipper_Code)} className='edit-btn'><i className='bi bi-trash'></i></button>
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
                                <header>Shipper Name Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSaveShipper}>
                                    <div className="fields2">
                                        <div className="input-field3">
                                            <label htmlFor="">Code </label>
                                            <input
                                                type="text" value={addShipper.shipperCode}
                                                onChange={(e) => setAddShipper({ ...addShipper, ShipperCode: e.target.value })}
                                                placeholder="Enter Code/ Generate Code"
                                                maxLength="3" />
                                        </div>

                                        <div className="input-field3">
                                            <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                onClick={handleGenerateCode}>Generate Code</button>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Shipper Name</label>
                                            <input type="text" value={addShipper.shipperName}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperName: e.target.value })}
                                                placeholder="Shipper Name" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" value={addShipper.shipperAdd1}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperAdd1: e.target.value })}
                                                placeholder="Address" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" value={addShipper.shipperAdd2}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperAdd2: e.target.value })}
                                                placeholder="Address" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Pin code</label>
                                            <input type="tel" id="pincode" name="pincode" maxLength="6"
                                                value={addShipper.shipperPin}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperPin: e.target.value })}
                                                placeholder="Pin Code" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">City Name</label>
                                            <select value={addShipper.cityCode}
                                                onChange={(e) => setAddShipper({ ...addShipper, cityCode: e.target.value })} required>
                                                <option value="" disabled >Select City</option>
                                                {getCity.length > 0 && getCity.map((city, index) => (
                                                    <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">State Name</label>
                                            <select value={addShipper.stateCode} required
                                                onChange={(e) => { setAddShipper({ ...addShipper, stateCode: e.target.value }) }}>
                                                <option value="" disabled >Select State</option>
                                                {getState.map((state, index) => (
                                                    <option value={state.State_Code} key={index}>{state.State_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Mobile No</label>
                                            <input type="tel" maxLength="10" id="mobile"
                                                value={addShipper.shipperMob}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperMob: e.target.value })}
                                                name="mobile" pattern="[0-9]{10}" placeholder="Mobile No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Email ID</label>
                                            <input type="email" value={addShipper.shipperEmail}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperEmail: e.target.value })}
                                                placeholder="Email Id" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">GST No</label>
                                            <input type="text" value={addShipper.gstNo}
                                                onChange={(e) => setAddShipper({ ...addShipper, gstNo: e.target.value })}
                                                placeholder="Gst No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Company Name</label>
                                            <input type="text" value={addShipper.company}
                                                onChange={(e) => setAddShipper({ ...addShipper, company: e.target.value })}
                                                placeholder="Company Name" required />
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

export default ShipperName;