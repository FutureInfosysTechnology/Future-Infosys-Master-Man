import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import sms from '../../../Assets/Images/sms-svgrepo-com.png';
import mail from '../../../Assets/Images/mail-reception-svgrepo-com.png';
import whatsapp from '../../../Assets/Images/whatsapp-svgrepo-com.png';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";


function VendorName() {
    const [openRow, setOpenRow] = useState(null);
    const [getVendor, setGetVendor] = useState([]);            // to get vendor data
    const [international, setInternational] = useState([]);    //  to get city data
    const [state, setState] = useState([]);                    // to get state data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [vendorData, setVendorData] = useState({
        vendorCode: '',
        vendorName: '',
        contactPerson: '',
        pinCode: '',
        vendAdd: '',
        vendMob: '',
        contMob: '',
        stateCode: '',
        email: '',
        fuelCharge: '',
        cityCode: ''
    })                                                         // to add vendor data



    const filteredVendor = getVendor.filter((vendor) =>
        (vendor && vendor.Vendor_Code && vendor.Vendor_Code?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Vendor_Name && vendor.Vendor_Name?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredVendor.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredVendor.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };



    const fetchVendorData = async () => {
        try {
            const response = await getApi('/Master/getVendor');
            setGetVendor(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchVendorData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi('/Master/getdomestic');
                setInternational(Array.isArray(response.Data) ? response.Data : []);
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
                setState(Array.isArray(response.Data) ? response.Data : []);
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
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setVendorData({ ...vendorData, vendorCode: newCode });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            VendorCode: vendorData.vendorCode.trim(),
            VendorName: vendorData.vendorName,
            ContactPerson: vendorData.contactPerson,
            VendorAdr: vendorData.vendAdd,
            PinCode: vendorData.pinCode,
            MobileNo: vendorData.vendMob,
            MobileNo2: vendorData.contMob,
            StateCode: vendorData.stateCode,
            Email: vendorData.email,
            FuelCharges: vendorData.fuelCharge,
            CityCode: vendorData.cityCode
        }

        try {
            const response = await postApi('/Master/UpdateVendor', requestBody, 'POST');
            if (response.status === 1) {
                setGetVendor(getVendor.map((vendor) => vendor.Vendor_Code === vendorData.vendorCode ? response.Data : vendor));
                setVendorData({
                    vendorCode: '',
                    vendorName: '',
                    contactPerson: '',
                    vendAdd: '',
                    pinCode: '',
                    vendMob: '',
                    contMob: '',
                    stateCode: '',
                    email: '',
                    fuelCharge: '',
                    cityCode: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchVendorData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the vendor.', 'error');
            }
        } catch (error) {
            console.error("Failed to update Vendor:", error);
            Swal.fire('Error', 'Failed to update vendor data', 'error');
        }
    }


    const handleSaveVendor = async (e) => {
        e.preventDefault();

        const requestBody = {
            VendorCode: vendorData.vendorCode.trim(),
            VendorName: vendorData.vendorName,
            ContactPerson: vendorData.contactPerson,
            VendorAdr: vendorData.vendAdd,
            PinCode: vendorData.pinCode,
            MobileNo: vendorData.vendMob,
            MobileNo2: vendorData.contMob,
            StateCode: vendorData.stateCode,
            Email: vendorData.email,
            FuelCharges: vendorData.fuelCharge,
            CityCode: vendorData.cityCode
        }

        try {
            const response = await postApi('/Master/addVendor', requestBody, 'POST')
            if (response.status === 1) {
                setGetVendor([...getVendor, response.Data]);
                setVendorData({
                    vendorCode: '',
                    vendorName: '',
                    contactPerson: '',
                    pinCode: '',
                    vendAdd: '',
                    vendMob: '',
                    contMob: '',
                    stateCode: '',
                    email: '',
                    fuelCharge: '',
                    cityCode: ''
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchVendorData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Vendor Name', 'error');
        }
    };

    const handleDeleteVendor = async (Customer_Code) => {
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
                await deleteApi(`/Master/deleteVendor?VendorCode=${Customer_Code}`);
                setGetVendor(getVendor.filter((vendor) => vendor.VendorCode !== Customer_Code));
                Swal.fire('Deleted!', 'Vendor has been deleted.', 'success');
                await fetchVendorData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Vendor', 'error');
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getVendor);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getVendor');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getVendor.xlsx');
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

            pdf.save('getVendor.pdf');
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
                                setVendorData({
                                    vendorCode: '', vendorName: '', contactPerson: '', pinCode: '',
                                    vendAdd: '', vendMob: '', contMob: '', stateCode: '', email: '',
                                    fuelCharge: '', cityCode: ''
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
                            <input className="add-input" value={searchQuery}
                                onChange={handleSearchChange} type="text" placeholder="search" />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    <div className='table-container'>
                        <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                            <thead className='table-sm'>
                                <tr>
                                    <th scope="col" style={{ width: "250px" }}>Actions</th>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Vendor_Code</th>
                                    <th scope="col">Vendor_Name</th>
                                    <th scope="col">Mobile_No</th>
                                    <th scope="col">Email_Id</th>
                                    <th scope="col">Vendor_Address</th>
                                    <th scope="col">Pin_Code</th>
                                    <th scope="col">Contact_Person</th>
                                    <th scope="col">State_Name</th>
                                    <th scope="col">City_Name</th>

                                </tr>
                            </thead>
                            <tbody className='table-body'>
                                {currentRows.map((vendor, index) => (
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
                                                        left: "130px",
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
                                                    setVendorData({
                                                        vendorCode: vendor.Vendor_Code.trim(),
                                                        vendorName: vendor.Vendor_Name,
                                                        vendAdd: vendor.Vendor_Adr,
                                                        pinCode: vendor.Pin_Code,
                                                        contactPerson: vendor.Contact_Person,
                                                        email: vendor.Email,
                                                        vendMob: vendor.Mobile_No,
                                                        contMob: vendor.Mobile_No_2,
                                                        fuelCharge: vendor.Fuel_Charges,
                                                        cityCode: vendor.City_Code,
                                                        stateCode: vendor.State_Code
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button className='edit-btn' onClick={() =>{ 
                                                    setOpenRow(null);
                                                    handleDeleteVendor(vendor.Vendor_Code);
                                                    }}>
                                                    <i className='bi bi-trash'></i>
                                                </button>
                                                </div>
                                            )}
                                        </td>
                                        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                        <td>{vendor.Vendor_Code}</td>
                                        <td>{vendor.Vendor_Name}</td>
                                        <td>{vendor.Mobile_No}</td>
                                        <td>{vendor.Email}</td>
                                        <td>{vendor.Vendor_Adr}</td>
                                        <td>{vendor.Pin_Code}</td>
                                        <td>{vendor.Contact_Person}</td>
                                        <td>{vendor.State_Name}</td>
                                        <td>{vendor.City_Name}</td>

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
                        className="custom-modal-vendor" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Vendor Name Master</header>
                            </div>
                            <div className='container2'>
                                <form onSubmit={handleSaveVendor}>

                                    <div className="fields2">
                                        <div className="input-field3">
                                            <label htmlFor="">Code </label>
                                            <input type="text"
                                                placeholder="Enter Code/ Generate Code"
                                                value={vendorData.vendorCode}
                                                onChange={(e) => setVendorData({ ...vendorData, vendorCode: e.target.value })}
                                                maxLength="3" readOnly={isEditMode} />
                                        </div>

                                        {!isEditMode && (
                                            <div className="input-field3">
                                                <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                    onClick={handleGenerateCode}>Generate Code</button>
                                            </div>
                                        )}

                                        <div className="input-field3">
                                            <label htmlFor="">Vendor Name</label>
                                            <input type="text" placeholder="Enter Vendor Name"
                                                value={vendorData.vendorName}
                                                onChange={(e) => setVendorData({ ...vendorData, vendorName: e.target.value })} required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Mobile No</label>
                                            <input type="tel" maxLength="10" id="mobile"
                                                value={vendorData.vendMob}
                                                onChange={(e) => setVendorData({ ...vendorData, vendMob: e.target.value })}
                                                name="mobile" pattern="[0-9]{10}" placeholder="Enter Mobile No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Email ID</label>
                                            <input type="email" placeholder="Enter Email Id"
                                                value={vendorData.email} required
                                                onChange={(e) => setVendorData({ ...vendorData, email: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" placeholder="Enter Address"
                                                value={vendorData.vendAdd}
                                                onChange={(e) => setVendorData({ ...vendorData, vendAdd: e.target.value })} required />
                                        </div>

                                        <div className="input-field3" >
                                            <label htmlFor="">Pin code</label>
                                            <input type="tel" id="pincode" name="pincode" maxLength="6"
                                                value={vendorData.pinCode}
                                                onChange={(e) => setVendorData({ ...vendorData, pinCode: e.target.value })}
                                                placeholder="Enter Pin Code" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">City Name</label>
                                            <select value={vendorData.cityCode}
                                                onChange={(e) => setVendorData({ ...vendorData, cityCode: e.target.value })} required>
                                                <option value="" disabled>Select City</option>
                                                {international.map((city, index) => (
                                                    <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">State Name</label>
                                            <select value={vendorData.stateCode}
                                                onChange={(e) => setVendorData({ ...vendorData, stateCode: e.target.value })} required>
                                                <option value="" disabled>Select State</option>
                                                {state.map((state, index) => (
                                                    <option value={state.State_Code} key={index}>{state.State_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3" >
                                            <label htmlFor="">Contact Person</label>
                                            <input type="text" placeholder="Enter Contact Person" required
                                                value={vendorData.contactPerson}
                                                onChange={(e) => setVendorData({ ...vendorData, contactPerson: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Mobile No</label>
                                            <input type="tel" maxLength="10" id="mobile"
                                                value={vendorData.contMob}
                                                onChange={(e) => setVendorData({ ...vendorData, contMob: e.target.value })}
                                                name="mobile" pattern="[0-9]{10}" placeholder="Enter Mobile No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Fuel %</label>
                                            <input type="text" placeholder="Enter Client Fuel %" required
                                                value={vendorData.fuelCharge}
                                                onChange={(e) => setVendorData({ ...vendorData, fuelCharge: e.target.value })} />
                                        </div>

                                    </div>

                                    <div className="select-radio">
                                        <input type="checkbox" name="mode" id="SMS" />
                                        <img src={sms} />

                                        <input type="checkbox" name="mode" id="E-mail" />
                                        <img src={mail} />

                                        <input type="checkbox" name="mode" id="Fax" />
                                        <img src={whatsapp} />
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

export default VendorName;