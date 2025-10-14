import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


function ProductWiseFuel() {
    const [openRow, setOpenRow] = useState(null);
    const [getCust, setGetCust] = useState([]);                    // to get customer charges data
    const [getCustName, setGetCustName] = useState([]);            // To Get Customer Name Data
    const [getMode, setGetMode] = useState([]);                    // To Get Mode Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFovChecked, setIsFovChecked] = useState(false);
    const [isDocketChecked, setIsDocketChecked] = useState(false);
    const [isDeliveryChecked, setIsDeliveryChecked] = useState(false);
    const [isPackingChecked, setIsPackingChecked] = useState(false);
    const [isGreenChecked, setIsGreenChecked] = useState(false);
    const [isHamaliChecked, setIsHamaliChecked] = useState(false);
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [isODAChecked, setIsODAChecked] = useState(false);
    const [isInsuranceChecked, setIsInsuranceChecked] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addCust, setAddCust] = useState({
        custCode: '',
        modeCode: '',
        fuelCharge: '',
        fovCharge: '',
        docketCharge: '',
        deliveryCharge: '',
        packingCharge: '',
        greenCharge: '',
        hamaliCharge: '',
        otherCharge: '',
        insuranceCharge: '',
        fromDate: '',
        toDate: ''
    })


    const fetchCustChargesData = async () => {
        try {
            const response = await getApi('/Master/GetcustomerCharges');
            setGetCust(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerData = async () => {
        try {
            const response = await getApi('/Master/getCustomerData');
            setGetCustName(Array.isArray(response.Data) ? response.Data : []);
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
        fetchCustomerData();
        fetchCustChargesData();
        fetchModeData();
    }, [])

    const getCustomerNameByCode = (code) => {
        const customer = getCustName.find(cust => cust.Customer_Code === code);
        return customer ? customer.Customer_Name : 'Unknown';
    };

    const getModeNameByCode = (modeCode) => {
        const trimmedModeCode = modeCode.trim().toLowerCase();
        const mode = getMode.find(m => m.Mode_Code.trim().toLowerCase() === trimmedModeCode);
        return mode ? mode.Mode_Name : 'Unknown';
    };

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("ChargesState"));
        if (savedState) {
            setIsFovChecked(savedState.isFovChecked || false);
            setIsDocketChecked(savedState.isDocketChecked || false);
            setIsDeliveryChecked(savedState.isDeliveryChecked || false);
            setIsPackingChecked(savedState.isPackingChecked || false);
            setIsGreenChecked(savedState.isGreenChecked || false);
            setIsHamaliChecked(savedState.isHamaliChecked || false);
            setIsOtherChecked(savedState.isOtherChecked || false);
            setIsInsuranceChecked(savedState.isInsuranceChecked || false);
            setIsODAChecked(savedState.isODAChecked || false);
        }
    }, []);

    const handleCheckboxChange = (field, value) => {
        const newState = {
            [field]: value
        };
        const currentState = JSON.parse(localStorage.getItem("ChargesState")) || {};
        localStorage.setItem("ChargesState", JSON.stringify({ ...currentState, ...newState }));
    };


    const handleFovChange = (e) => {
        setIsFovChecked(e.target.checked);
        handleCheckboxChange('isFovChecked', e.target.checked);
    };

    const handleDocketChange = (e) => {
        setIsDocketChecked(e.target.checked);
        handleCheckboxChange('isDocketChecked', e.target.checked);
    };

    const handleDeliveryChange = (e) => {
        setIsDeliveryChecked(e.target.checked);
        handleCheckboxChange('isDeliveryChecked', e.target.checked);
    };

    const handlePackingChange = (e) => {
        setIsPackingChecked(e.target.checked);
        handleCheckboxChange('isPackingChecked', e.target.checked);
    };

    const handleGreenChange = (e) => {
        setIsGreenChecked(e.target.checked);
        handleCheckboxChange('isGreenChecked', e.target.checked);
    };

    const handleHamaliChange = (e) => {
        setIsHamaliChecked(e.target.checked);
        handleCheckboxChange('isHamaliChecked', e.target.checked);
    };

    const handleOtherChange = (e) => {
        setIsOtherChecked(e.target.checked);
        handleCheckboxChange('isOtherChecked', e.target.checked);
    };

    const handleODAChange = (e) => {
        setIsODAChecked(e.target.checked);
        handleCheckboxChange('isODAChecked', e.target.checked);
    };

    const handleInsuranceChange = (e) => {
        setIsInsuranceChecked(e.target.checked);
        handleCheckboxChange('isInsuranceChecked', e.target.checked);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            CustomerCode: addCust.custCode,
            ModeCode: addCust.modeCode,
            FuelCharges: addCust.fuelCharge,
            FovCharges: addCust.fovCharge,
            DocketCharges: addCust.docketCharge,
            DeliveryCharges: addCust.deliveryCharge,
            PackingCharges: addCust.packingCharge,
            GreenCharges: addCust.greenCharge,
            HamaliCharges: addCust.hamaliCharge,
            OtherCharges: addCust.otherCharge,
            InsuranceCharges: addCust.insuranceCharge,
            FromDate: addCust.fromDate,
            ToDate: addCust.toDate
        }

        try {
            const response = await postApi('/Master/UpdateCustomerCharges', requestBody, 'POST');
            if (response.status === 1) {
                setGetCust(getCust.map((charges) => charges.Customer_Code === addCust.custCode ? response.Data : charges));
                setAddCust({
                    custCode: '',
                    modeCode: '',
                    fuelCharge: '',
                    fovCharge: '',
                    docketCharge: '',
                    deliveryCharge: '',
                    packingCharge: '',
                    greenCharge: '',
                    hamaliCharge: '',
                    otherCharge: '',
                    insuranceCharge: '',
                    fromDate: '',
                    toDate: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCustChargesData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the customer charges.', 'error');
            }
        } catch (error) {
            console.error('Error updating receiver:', error);
            Swal.fire('Error', 'Failed to update customer charges data', 'error');
        }
    }


    const handleSaveCustomer = async (e) => {
        e.preventDefault();

        const requestBody = {
            customerCode: addCust.custCode,
            modeCode: addCust.modeCode,
            fuelCharges: addCust.fuelCharge,
            fovCharges: addCust.fovCharge,
            docketCharges: addCust.docketCharge,
            deliveryCharges: addCust.deliveryCharge,
            packingCharges: addCust.packingCharge,
            greenCharges: addCust.greenCharge,
            hamaliCharges: addCust.hamaliCharge,
            otherCharges: addCust.otherCharge,
            insuranceCharges: addCust.insuranceCharge,
            fromDate: addCust.fromDate,
            toDate: addCust.toDate
        }

        try {
            const response = await postApi('/Master/AddCustomerCharges', requestBody, 'POST')
            if (response.status === 1) {
                setGetCust([...getCust, response.Data]);
                setAddCust({
                    custCode: '',
                    modeCode: '',
                    fuelCharge: '',
                    fovCharge: '',
                    docketCharge: '',
                    deliveryCharge: '',
                    packingCharge: '',
                    greenCharge: '',
                    hamaliCharge: '',
                    otherCharge: '',
                    insuranceCharge: '',
                    fromDate: '',
                    toDate: ''
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCustChargesData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Customer Charges data', 'error');
        }
    };

    const handleDeleteCustCharges = async (Customer_Code) => {
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
                await deleteApi(`/Master/DeleteCustomerCharges?Customer_Code=${Customer_Code}`);
                setGetCust(getCust.filter((charges) => charges.Customer_Code !== Customer_Code));
                Swal.fire('Deleted!', 'Charges has been deleted.', 'success');
                await fetchCustChargesData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Charges', 'error');
        }
    };


    const filteredgetCharges = getCust.filter((cust) =>
        (cust && cust.Mode_Code && cust.Mode_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetCharges.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetCharges.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };


    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getCust);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getCust');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getCust.xlsx');
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

            pdf.save('getCust.pdf');
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
                                setAddCust({
                                    custCode: '', modeCode: '', fuelCharge: '', fovCharge: '', docketCharge: '',
                                    deliveryCharge: '', packingCharge: '', greenCharge: '', hamaliCharge: '',
                                    otherCharge: '', insuranceCharge: '', fromDate: '', toDate: ''
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
                                    <th scope="col">Customer_Name</th>
                                    <th scope="col">Mode</th>
                                    <th scope="col">Fuel_Charge</th>
                                    <th scope="col">Fov_Charge</th>
                                    <th scope="col">Docket_Charge</th>
                                    <th scope="col">Delivery_Charge</th>
                                    <th scope="col">Packing_Charge</th>
                                    <th scope="col">Green_Charge</th>
                                    <th scope="col">Hamali_Charge</th>
                                    <th scope="col">Other_Charge</th>
                                    <th scope="col">Insurance_Charge</th>
                                    <th scope="col">From_Date</th>
                                    <th scope="col">To_Date</th>

                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((cust, index) => (
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
                                                        left: "60px",
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
                                                        setAddCust({
                                                            custCode: cust.Customer_Code,
                                                            modeCode: cust.Mode_Code,
                                                            fuelCharge: cust.Fuel_Charges,
                                                            fovCharge: cust.Fov_Charges,
                                                            docketCharge: cust.Docket_Charges,
                                                            deliveryCharge: cust.Dilivery_Charges,
                                                            packingCharge: cust.Packing_Charges,
                                                            greenCharge: cust.Green_Charges,
                                                            hamaliCharge: cust.Hamali_Charges,
                                                            otherCharge: cust.Other_Charges,
                                                            insuranceCharge: cust.Insurance_Charges,
                                                            fromDate: cust.From_Date,
                                                            toDate: cust.To_Date
                                                        });
                                                        setModalIsOpen(true);
                                                    }}>
                                                        <i className='bi bi-pen'></i>
                                                    </button>
                                                    <button className='edit-btn' onClick={() => {
                                                        handleDeleteCustCharges(cust.Customer_Code);
                                                        setOpenRow(null);
                                                    }}>
                                                        <i className='bi bi-trash'></i></button>
                                                </div>
                                            )}
                                        </td>

                                        <td>{cust.ID}</td>
                                        <td>{getCustomerNameByCode(cust.Customer_Code)}</td>
                                        <td>{getModeNameByCode(cust.Mode_Code)}</td>
                                        <td>{cust.Fuel_Charges}</td>
                                        <td>{cust.Fov_Charges}</td>
                                        <td>{cust.Docket_Charges}</td>
                                        <td>{cust.Dilivery_Charges}</td>
                                        <td>{cust.Packing_Charges}</td>
                                        <td>{cust.Green_Charges}</td>
                                        <td>{cust.Hamali_Charges}</td>
                                        <td>{cust.Other_Charges}</td>
                                        <td>{cust.Insurance_Charges}</td>
                                        <td>{formatDate(cust.From_Date)}</td>
                                        <td>{formatDate(cust.To_Date)}</td>

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


                    <Modal id="modal" overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-custCharges" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Customer Charges Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSaveCustomer}>

                                    <div className="form first">
                                        <div className="details personal">

                                            <div className="fields2">
                                                <div className="input-field1">
                                                    <label htmlFor="">Customer Name</label>
                                                    <select value={addCust.custCode}
                                                        onChange={(e) => setAddCust({ ...addCust, custCode: e.target.value })} required
                                                        aria-readonly={isEditMode}>
                                                        <option value="" disabled >Select Customer Name</option>
                                                        {getCustName.map((cust, index) => (
                                                            <option value={cust.Customer_Name} key={index}>{cust.Customer_Name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-field1">
                                                    <label htmlFor="">Mode</label>
                                                    <select required value={addCust.modeCode}
                                                        onChange={(e) => setAddCust({ ...addCust, modeCode: e.target.value })}>
                                                        <option value="" disabled >Select Mode</option>
                                                        {getMode.map((mode, index) => (
                                                            <option value={mode.Mode_Code} key={index}>{mode.Mode_Name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-field1">
                                                    <label htmlFor="">Fuel Charges</label>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <input required style={{
                                                            width: "80%",
                                                            borderBottomRightRadius: "0px",
                                                            borderTopRightRadius: "0px",
                                                            borderRightColor: "transparent"
                                                        }} value={addCust.fuelCharge}
                                                            onChange={(e) => setAddCust({ ...addCust, fuelCharge: e.target.value })}
                                                            type="text" placeholder="Enter Fuel Charges" />
                                                        <button className="ok-btn"
                                                            style={{
                                                                height: "35px",
                                                                width: "30%",
                                                                fontSize: "20px", padding: "5px",
                                                                borderTopLeftRadius: "0px",
                                                                borderBottomLeftRadius: "0px"
                                                            }} onClick={(e) => { e.preventDefault(); setModalIsOpen1(true); }}><i className="bi bi-cash-coin"></i></button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="fields2">
                                                {isFovChecked && (
                                                    <div className="input-field2">
                                                        <label htmlFor="">FOV </label>
                                                        <input type="text" value={addCust.fovCharge}
                                                            onChange={(e) => setAddCust({ ...addCust, fovCharge: e.target.value })}
                                                            placeholder="Enter FOV " required />
                                                    </div>
                                                )}

                                                {isDocketChecked && (
                                                    <div className="input-field2">
                                                        <label htmlFor="">Docket Charges</label>
                                                        <input type="text" value={addCust.docketCharge}
                                                            onChange={(e) => setAddCust({ ...addCust, docketCharge: e.target.value })}
                                                            placeholder="Enter Docket Charges" required />
                                                    </div>
                                                )}

                                                {isDeliveryChecked && (
                                                    <div className="input-field2">
                                                        <label htmlFor="">Delivery Charges</label>
                                                        <input type="text" value={addCust.deliveryCharge}
                                                            onChange={(e) => setAddCust({ ...addCust, deliveryCharge: e.target.value })}
                                                            placeholder="Enter Delivery Charges" required />
                                                    </div>
                                                )}

                                                {isPackingChecked && (
                                                    <div className="input-field2">
                                                        <label htmlFor="">Packing Charges</label>
                                                        <input type="text" value={addCust.packingCharge}
                                                            onChange={(e) => setAddCust({ ...addCust, packingCharge: e.target.value })}
                                                            placeholder="Enter Packing Charges" required />
                                                    </div>
                                                )}

                                                {isGreenChecked && (
                                                    <div className="input-field2">
                                                        <label htmlFor="">Green Charges</label>
                                                        <input type="text" value={addCust.greenCharge}
                                                            onChange={(e) => setAddCust({ ...addCust, greenCharge: e.target.value })}
                                                            placeholder="Enter Green Charges" required />
                                                    </div>
                                                )}

                                                {isHamaliChecked && (
                                                    <div className="input-field2">
                                                        <label htmlFor="">Hamali Charges</label>
                                                        <input type="text" value={addCust.hamaliCharge}
                                                            onChange={(e) => setAddCust({ ...addCust, hamaliCharge: e.target.value })}
                                                            placeholder="Enter Hamali Charges" required />
                                                    </div>
                                                )}

                                                {isOtherChecked && (
                                                    <div className="input-field2">
                                                        <label htmlFor="">Other Charges</label>
                                                        <input type="text" value={addCust.otherCharge}
                                                            onChange={(e) => setAddCust({ ...addCust, otherCharge: e.target.value })}
                                                            placeholder="Enter Other Charges" required />
                                                    </div>
                                                )}

                                                {isInsuranceChecked && (
                                                    <div className="input-field2">
                                                        <label htmlFor="">Insurance Charges</label>
                                                        <input type="text" value={addCust.insuranceCharge}
                                                            onChange={(e) => setAddCust({ ...addCust, insuranceCharge: e.target.value })}
                                                            placeholder="Enter Insurance Charges" required />
                                                    </div>
                                                )}

                                                <div className="input-field2">
                                                    <label htmlFor="">From</label>
                                                    <input type="date" value={addCust.fromDate}
                                                        onChange={(e) => setAddCust({ ...addCust, fromDate: e.target.value })}
                                                        placeholder="enter from date" required />
                                                </div>

                                                <div className="input-field2">
                                                    <label htmlFor="">To Date</label>
                                                    <input type="date" value={addCust.toDate}
                                                        onChange={(e) => setAddCust({ ...addCust, toDate: e.target.value })}
                                                        placeholder="enter till date" required />
                                                </div>

                                                <div className='bottom-buttons' style={{ marginTop: "18px", marginLeft: "25px" }}>
                                                    {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                                    {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                                    <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen1}
                        className="custom-modal-charges" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Charges</header>
                            </div>

                            <div className='container2'>
                                <form>
                                    <div className="fields2">

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isFovChecked}
                                                onChange={handleFovChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fov" id="fov" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Fov Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isDocketChecked}
                                                onChange={handleDocketChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="docket" id="docket" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Docket Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isDeliveryChecked}
                                                onChange={handleDeliveryChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="delivery" id="delivery" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Delivery Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isPackingChecked}
                                                onChange={handlePackingChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="packing" id="packing" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Packing Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isGreenChecked}
                                                onChange={handleGreenChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="green" id="green" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Green Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isHamaliChecked}
                                                onChange={handleHamaliChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="hamali" id="hamali" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Hamali Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isOtherChecked}
                                                onChange={handleOtherChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="other" id="other" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Other Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isODAChecked}
                                                onChange={handleODAChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="oda" id="oda" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                ODA Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isInsuranceChecked}
                                                onChange={handleInsuranceChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="insurance" id="insurance" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Insurance Charges</label>
                                        </div>

                                        <div className='bottom-buttons' style={{ marginLeft: "25px", marginTop: "18px" }}>
                                            <button onClick={(e) => { e.preventDefault(); setModalIsOpen1(false) }} className='ok-btn'>Submit</button>
                                            <button onClick={(e) => { e.preventDefault(); setModalIsOpen1(false) }} className='ok-btn'>close</button>
                                        </div>

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

export default ProductWiseFuel;