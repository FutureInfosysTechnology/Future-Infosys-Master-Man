import React, { useState, useEffect } from "react";
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import sms from '../../../Assets/Images/sms-svgrepo-com.png';
import mail from '../../../Assets/Images/mail-reception-svgrepo-com.png';
import whatsapp from '../../../Assets/Images/whatsapp-svgrepo-com.png';
import { deleteApi, getApi, postApi } from "../Area Control/Zonemaster/ServicesApi";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function CustomerName() {

    const [error, setError] = useState(null);
    const [getCity, setGetCity] = useState([]);                     //To Get City Data
    const [loading, setLoading] = useState(true);
    const [getState, setGetState] = useState([]);                   //To Get State Data
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [getCustomer, setGetCustomer] = useState([]);             // To Get Customer Data
    const [getBranchName, setGetBranchName] = useState([]);         // To Get Branch Name Data
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [discountOption, setDiscountOption] = useState("Yes");
    const [gstOption, setGstOption] = useState("Yes");
    const [fuelOption, setFuelOption] = useState("Yes");
    const [isDiscountEnabled, setIsDiscountEnabled] = useState(true);
    const [isGstEnabled, setIsGstEnabled] = useState(true);
    const [isFuelEnabled, setIsFuelEnabled] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [contractData, setContractData] = useState({
        creditDate: firstDayOfMonth,
        dueDate: today,
        contractAmount: '',
        depositAmount: '',
        balance: '',
        advAmt: ''
    });
    const [addCustData, setAddCustData] = useState({
        custCode: '',
        custName: '',
        bookingType: '',
        custMob: '',
        emailID: '',
        custAdd1: '',
        custAdd2: '',
        custAdd3: '',
        pinCode: '',
        stateCode: '',
        gstNo: '',
        hsnNo: '',
        gstType: '',
        gst: '',
        fuel: '',
        discount: '',
        billPeriod: '',
        custStatus: '',
        contactPerson: '',
        contactPersonMob: '',
        cityCode: '',
        bankBranch: '',
        description: '',
        sms: false,
        email: false,
        whatApp: false,
        userName: '',
        Password: '',
        DepartmentCode: ''
    })
    console.log(addCustData);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleDiscountChange = (e) => {
        const value = e.target.value;
        setDiscountOption(value);
        setIsDiscountEnabled(value === "Yes");
    };


    const handleGstChange = (e) => {
        const value = e.target.value;
        setGstOption(value);
        setIsGstEnabled(value === "Yes");
    };

    const handleFuelChange = (e) => {
        const value = e.target.value;
        setFuelOption(value);
        setIsFuelEnabled(value === "Yes");
    };


    const handleGenerateCode = () => {
        if (addCustData.custCode !== '') return;
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddCustData({ ...addCustData, custCode: newCode });
    };



    const fetchCustomerData = async () => {
        try {
            const response = await getApi('/Master/getCustomerData');
            setGetCustomer(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCustomerData();
    }, [])


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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi('/Master/getBranch');
                setGetBranchName(Array.isArray(response.Data) ? response.Data : []);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    const handleContractSubmit = (e) => {
        e.preventDefault();
        setAddCustData({ ...addCustData, ...contractData });
        setModalIsOpen1(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            CustomerCode: addCustData.custCode,
            CustomerName: addCustData.custName,
            BookingType: addCustData.bookingType,
            CustomerMob: addCustData.custMob,
            EmailId: addCustData.emailID,
            CustomerAdd1: addCustData.custAdd1,
            CustomerAdd2: addCustData.custAdd2,
            CustomerAdd3: addCustData.custAdd3,
            PinCode: addCustData.pinCode,
            StateCode: addCustData.stateCode,
            CityCode: addCustData.cityCode,
            GstNo: addCustData.gstNo,
            HSNNo: addCustData.hsnNo || "",
            GstType: addCustData.gstType,
            Discount: addCustData.discount,
            BillingPeriod: addCustData.billPeriod,
            CustomerStatus: addCustData.custStatus,
            ContactPerson: addCustData.contactPerson,
            ContactPersonMob: addCustData.contactPersonMob,
            AdvanceAmt: contractData.advAmt,
            CreditDate: contractData.creditDate,
            DueDate: contractData.dueDate,
            ContactAmount: contractData.contractAmount,
            DepositAmount: contractData.depositAmount,
            BalanceAmount: contractData.balance,
            Description: addCustData.description,
            SMS: addCustData.sms,
            Email: addCustData.email,
            WhatApp: addCustData.whatApp,
            userName: addCustData.userName,
            Password: addCustData.Password,
            DepartmentCode: addCustData.DepartmentCode
        }

        try {
            const response = await postApi('/Master/updateCustomer', requestBody, 'POST');
            if (response.status === 1) {
                setGetCustomer(getCustomer.map((cust) => cust.Customer_Code === addCustData.custCode ? response.Data : cust));
                setAddCustData({
                    custCode: '',
                    custName: '',
                    bookingType: '',
                    custMob: '',
                    emailID: '',
                    custAdd1: '',
                    custAdd2: '',
                    custAdd3: '',
                    pinCode: '',
                    stateCode: '',
                    gstNo: '',
                    hsnNo: '',
                    gstType: '',
                    gst: '',
                    fuel: '',
                    discount: '',
                    billPeriod: '',
                    custStatus: '',
                    contactPerson: '',
                    contactPersonMob: '',
                    cityCode: '',
                    bankBranch: '',
                    description: '',
                    sms: false,
                    email: false,
                    whatApp: false,
                    userName: '',
                    Password: '',
                    DepartmentCode: ''
                });
                setContractData({
                    creditDate: firstDayOfMonth,
                    dueDate: today,
                    contractAmount: '',
                    depositAmount: '',
                    balance: '',
                    advAmt: ''
                });
                setPasswordVisible(false);
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCustomerData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the customer.', 'error');
            }
        } catch (err) {
            console.error('Error updating customer:', err);
            Swal.fire('Error', 'Failed to update customer data', 'error');
        }
    }


    const handleSaveCustomerName = async (e) => {
        e.preventDefault();

        const requestBody = {
            customerCode: addCustData.custCode,
            customerName: addCustData.custName,
            bookingType: addCustData.bookingType,
            customerMob: addCustData.custMob,
            emailId: addCustData.emailID,
            customerAdd1: addCustData.custAdd1,
            customerAdd2: addCustData.custAdd2,
            customerAdd3: addCustData.custAdd3,
            pinCode: addCustData.pinCode,
            stateCode: addCustData.stateCode,
            gstNo: addCustData.gstNo,
            hsnNo: addCustData.hsnNo,
            gstType: addCustData.gstType,
            customerGst: addCustData.gst,
            gst_Yes_No: gstOption,
            customerFuel: addCustData.fuel,
            fuel_Yes_No1: fuelOption,
            discount: addCustData.discount,
            billingPeriod: addCustData.billPeriod,
            customerStatus: addCustData.custStatus,
            contactPerson: addCustData.contactPerson,
            contactPersonMob: addCustData.contactPersonMob.trim(),
            bankBranch: addCustData.bankBranch,
            advanceAmt: contractData.advAmt,
            creditDate: contractData.creditDate,
            dueDate: contractData.dueDate,
            contactAmount: contractData.contractAmount,
            depositAmount: contractData.depositAmount,
            balanceAmount: contractData.balance,
            description: addCustData.description,
            sms: addCustData.sms,
            email: addCustData.email,
            whatApp: addCustData.whatApp,
            cityCode: addCustData.cityCode,
            userName: addCustData.userName,
            Password: addCustData.Password,
            DepartmentCode: addCustData.DepartmentCode
        }

        try {
            const saveResponse = await postApi('/Master/addCustomer', requestBody, 'POST')
            if (saveResponse.status === 1) {
                setGetCustomer([...getCustomer, saveResponse.Data]);
                setAddCustData({
                    custCode: '',
                    custName: '',
                    bookingType: '',
                    custMob: '',
                    emailID: '',
                    custAdd1: '',
                    custAdd2: '',
                    custAdd3: '',
                    pinCode: '',
                    stateCode: '',
                    gstNo: '',
                    hsnNo: '',
                    gstType: '',
                    gst: '',
                    fuel: '',
                    discount: '',
                    billPeriod: '',
                    custStatus: '',
                    contactPerson: '',
                    contactPersonMob: '',
                    bankBranch: '',
                    description: '',
                    sms: false,
                    email: false,
                    whatsapp: false,
                    cityCode: '',
                    userName: '',
                    Password: '',
                    DepartmentCode: ''
                });
                Swal.fire('Saved!', saveResponse.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCustomerData();
            } else {
                Swal.fire('Duplicate Name Not Allow!', saveResponse.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Customer data', 'error');
        }
    };
    const handleDateChange = (field,date) => {
    setContractData({ ...contractData, [field]: date });
  };
    const handleDeleteCustName = async (Customer_Code) => {
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
                await deleteApi(`/Master/deleteCustomer?CustomerCode=${Customer_Code}`);
                setGetCustomer(getCustomer.filter((cust) => cust.CustomerCode !== Customer_Code));
                Swal.fire('Deleted!', 'Customer Name has been deleted.', 'success');
                await fetchCustomerData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Customer Name', 'error');
        }
    };



    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getCustomer);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getCustomer');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getCustomer.xlsx');
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

            pdf.save('getCustomer.pdf');
        });
    };


    const filteredgetCustomer = getCustomer.filter((cust) =>
        (cust && cust.Booking_Type && cust.Booking_Type.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (cust && cust.Customer_Mob && cust.Customer_Mob.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (cust && cust.Customer_Add3 && cust.Customer_Add3.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (cust && cust.Customer_Add1 && cust.Customer_Add1.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (cust && cust.Customer_Add2 && cust.Customer_Add2.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (cust && cust.Gst_No && cust.Gst_No.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (cust && cust.HSN_NO && cust.HSN_NO.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetCustomer.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetCustomer.length / rowsPerPage);
    console.log(currentRows);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
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
                                setAddCustData({
                                    custCode: '',
                                    custName: '',
                                    bookingType: '',
                                    custMob: '',
                                    emailID: '',
                                    custAdd1: '',
                                    custAdd2: '',
                                    custAdd3: '',
                                    pinCode: '',
                                    stateCode: '',
                                    gstNo: '',
                                    hsnNo: '',
                                    gstType: '',
                                    gst: '',
                                    fuel: '',
                                    discount: '',
                                    billPeriod: '',
                                    custStatus: '',
                                    contactPerson: '',
                                    contactPersonMob: '',
                                    cityCode: '',
                                    bankBranch: '',
                                    description: '',
                                    sms: false,
                                    email: false,
                                    whatApp: false,
                                    userName: '',
                                    Password: '',
                                    DepartmentCode: ''
                                });
                                setContractData({
                                    creditDate: firstDayOfMonth,
                                    dueDate: today,
                                    contractAmount: '',
                                    depositAmount: '',
                                    balance: '',
                                    advAmt: ''
                                });
                                setModalIsOpen(true); setIsEditMode(false);
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
                        <table className='table table-bordered table-sm' style={{whiteSpace:"nowrap"}}>
                            <thead className='table-sm'>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Customer_Code</th>
                                    <th scope="col">Customer_Name</th>
                                    <th scope="col">Booking_Type</th>
                                    <th scope="col">Mobile_No</th>
                                    <th scope="col">Email_ID</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Pin_Code</th>
                                    <th scope="col">GST</th>
                                    <th scope="col">HSN_No</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((cust, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{cust.Customer_Code}</td>
                                        <td>{cust.Customer_Name}</td>
                                        <td>{cust.Booking_Type}</td>
                                        <td>{cust.Customer_Mob}</td>
                                        <td>{cust.Email_Id}</td>
                                        <td>{cust.Customer_Add1}</td>
                                        <td>{cust.Pin_Code}</td>
                                        <td>{cust.Gst_No}</td>
                                        <td>{cust.HSN_NO}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setAddCustData({
                                                        custCode: cust.Customer_Code,
                                                        custName: cust.Customer_Name,
                                                        bookingType: cust.Booking_Type,
                                                        custAdd1: cust.Customer_Add1,
                                                        custAdd2: cust.Customer_Add2,
                                                        custAdd3: cust.Customer_Add3,
                                                        contactPerson: cust.Contact_Person,
                                                        contactPersonMob: cust.Contact_Person_Mob.trim(),
                                                        emailID: cust.Email_Id,
                                                        pinCode: cust.Pin_Code,
                                                        cityCode: cust.City_Code,
                                                        bankBranch: cust.Branch_Code,
                                                        gstType: cust.Gst_Type,
                                                        gstNo: cust.Gst_No,
                                                        hsnNo: cust.HSN_NO,
                                                        custMob: cust.Customer_Mob,
                                                        description: cust.Description,
                                                        stateCode: cust.State_Code,
                                                        discount: cust.Discount,
                                                        gst: cust.CustomerGst,
                                                        fuel: cust.CustomerFuel,
                                                        sms: cust.SMS,
                                                        whatApp: cust.WhatApp,
                                                        email: cust.Email,
                                                        userName: cust.userName,
                                                        Password: cust.Password,
                                                        DepartmentCode: cust.DepartmentCode
                                                    });
                                                    setGstOption(cust.Gst_Yes_No);
                                                    setFuelOption(cust.Fuel_Yes_No1);
                                                    setContractData({
                                                        contractAmount: cust.Contact_Amount,
                                                        creditDate: cust.Credit_Date===null?firstDayOfMonth:cust.Credit_Date,
                                                        dueDate: cust.Due_Date===null?today:cust.Due_Date,
                                                        advAmt: cust.AdvanceAmt,
                                                        balance: cust.Balance_Amount,
                                                        depositAmount: cust.Deposit_Amount
                                                    })
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button onClick={() => handleDeleteCustName(cust.Customer_Code)} className='edit-btn'>
                                                    <i className='bi bi-trash'></i></button>
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
                        className="custom-modal"
                        style={{
                            content: {
                                width: '90%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap"
                            },
                        }}
                        contentLabel="Modal">
                        <div className="custom-modal-content" style={{ width: "100%" }}>
                            <div className="header-tittle">
                                <header>Customer Name Master</header>
                            </div>

                            <div className='container2' style={{ whiteSpace: "nowrap" }}>
                                <form onSubmit={handleSaveCustomerName}>
                                    <div className="form first">
                                        <div className="details personal">
                                            <div className="fields2" style={{}}>

                                                <div className="input-field3">
                                                    <label htmlFor="">Code</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Code/ Generate Code"
                                                        value={addCustData.custCode}
                                                        onChange={(e) => setAddCustData({ ...addCustData, custCode: e.target.value })}
                                                        maxLength="3" required readOnly={isEditMode} />
                                                </div>

                                                {!isEditMode && (
                                                    <div className="input-field3">
                                                        <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                            onClick={handleGenerateCode}>Generate Code</button>
                                                    </div>
                                                )}

                                                <div className="input-field3">
                                                    <label htmlFor="">Customer Name</label>
                                                    <input type="text" placeholder="Customer Name" required
                                                        value={addCustData.custName}
                                                        onChange={(e) => setAddCustData({ ...addCustData, custName: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Cash / Credit</label>
                                                    <select value={addCustData.bookingType}
                                                        onChange={(e) => setAddCustData({ ...addCustData, bookingType: e.target.value })} required>
                                                        <option value="" disabled >Cash/ Credit</option>
                                                        <option value="Cash">Cash</option>
                                                        <option value="Credit">Credit</option>
                                                    </select>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Customer Mobile No</label>
                                                    <input type="tel" maxLength="10" id="mobile"
                                                        name="mobile" pattern="[0-9]{10}" placeholder="Customer Mobile No"
                                                        value={addCustData.custMob} required
                                                        onChange={(e) => setAddCustData({ ...addCustData, custMob: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Email ID</label>
                                                    <input type="email" placeholder="Email Id"
                                                        value={addCustData.emailID} required
                                                        onChange={(e) => setAddCustData({ ...addCustData, emailID: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Address</label>
                                                    <input type="text" placeholder="Address"
                                                        value={addCustData.custAdd1} required
                                                        onChange={(e) => setAddCustData({ ...addCustData, custAdd1: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Address</label>
                                                    <input type="text" placeholder="Address"
                                                        value={addCustData.custAdd2} required
                                                        onChange={(e) => setAddCustData({ ...addCustData, custAdd2: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Address</label>
                                                    <input type="text" placeholder="Address"
                                                        value={addCustData.custAdd3} required
                                                        onChange={(e) => setAddCustData({ ...addCustData, custAdd3: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Pin code</label>
                                                    <input type="tel" id="pincode" name="pincode" maxLength="6"
                                                        placeholder="Pin Code" value={addCustData.pinCode} required
                                                        onChange={(e) => setAddCustData({ ...addCustData, pinCode: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">State Name</label>
                                                    <select required value={addCustData.stateCode}
                                                        onChange={(e) => setAddCustData({ ...addCustData, stateCode: e.target.value })}>
                                                        <option value="" disabled >State Name</option>
                                                        {getState.map((state, index) => (
                                                            <option value={state.State_Code} key={index}>{state.State_Name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">City Name</label>
                                                    <select required
                                                        value={addCustData.cityCode}
                                                        onChange={(e) => setAddCustData({ ...addCustData, cityCode: e.target.value })}>
                                                        <option value="" disabled>City Name</option>
                                                        {getCity.map((city, index) => (
                                                            <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Brnach Name</label>
                                                    <select value={addCustData.bankBranch}
                                                        onChange={(e) => setAddCustData({ ...addCustData, bankBranch: e.target.value })} required>
                                                        <option value="">Branch Name</option>
                                                        {getBranchName.map((branch, index) => (
                                                            <option value={branch.Branch_Code} key={index}>{branch.Branch_Name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">GST No</label>
                                                    <input type="tel" value={addCustData.gstNo}
                                                        onChange={(e) => setAddCustData({ ...addCustData, gstNo: e.target.value })}
                                                        placeholder="Gst No." required />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">HSN No</label>
                                                    <input type="text" value={addCustData.hsnNo}
                                                        onChange={(e) => setAddCustData({ ...addCustData, hsnNo: e.target.value })}
                                                        placeholder="HSN No" required />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">GST Type</label>
                                                    <select value={addCustData.gstType} required
                                                        onChange={(e) => setAddCustData({ ...addCustData, gstType: e.target.value })}>
                                                        <option value="" disabled >GST Type</option>
                                                        <option value="Transport">Transport</option>
                                                        <option value="Client">Client</option>
                                                    </select>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">GST %</label>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <input style={{
                                                            width: "70%", borderRight: "transparent",
                                                            borderTopRightRadius: "0px", borderBottomRightRadius: "0px"
                                                        }} type="text" placeholder="GST" value={addCustData.gst}
                                                            onChange={(e) => setAddCustData({ ...addCustData, gst: e.target.value })}
                                                            disabled={!isGstEnabled} required />
                                                        <select style={{
                                                            width: "30%", borderLeft: "transparent",
                                                            borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px",
                                                            padding: "0px",
                                                            textAlign: "center"
                                                        }} value={gstOption} onChange={handleGstChange}>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Fuel</label>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <input style={{
                                                            width: "70%", borderRight: "transparent",
                                                            borderTopRightRadius: "0px", borderBottomRightRadius: "0px"
                                                        }} type="text" placeholder="Fuel" value={addCustData.fuel}
                                                            onChange={(e) => setAddCustData({ ...addCustData, fuel: e.target.value })}
                                                            disabled={!isFuelEnabled} required />
                                                        <select style={{
                                                            width: "30%", borderLeft: "transparent",
                                                            borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px",
                                                            padding: "0px",
                                                            textAlign: "center"
                                                        }} value={fuelOption} onChange={handleFuelChange}>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Discount</label>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <input style={{
                                                            width: "70%", borderRight: "transparent",
                                                            borderTopRightRadius: "0px", borderBottomRightRadius: "0px"
                                                        }} type="text" placeholder="Discount" value={addCustData.discount}
                                                            onChange={(e) => setAddCustData({ ...addCustData, discount: e.target.value })}
                                                            disabled={!isDiscountEnabled} required />
                                                        <select style={{
                                                            width: "30%", borderLeft: "transparent",
                                                            borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px",
                                                            padding: "0px",
                                                            textAlign: "center"
                                                        }} value={discountOption} onChange={handleDiscountChange}>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Billing Period</label>
                                                    <select value={addCustData.billPeriod} required
                                                        onChange={(e) => setAddCustData({ ...addCustData, billPeriod: e.target.value })}>
                                                        <option value="" disabled >Billing Period</option>
                                                        <option>Monthly</option>
                                                        <option>Quaterly</option>
                                                        <option>Half Yearly</option>
                                                        <option>Yearly</option>
                                                    </select>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Contract Amount</label>
                                                    <div className="dropdown">
                                                        <button onClick={(e) => { e.preventDefault(); setModalIsOpen1(true); }} type="button" className="ok-btn"
                                                            style={{ height: "35px", fontSize: "14px", width: "100%" }}>
                                                            {contractData.contractAmount ? `Amount: ${contractData.contractAmount}` : 'Contract Amount'}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Customer Status</label>
                                                    <select value={addCustData.custStatus} required
                                                        onChange={(e) => setAddCustData({ ...addCustData, custStatus: e.target.value })}>
                                                        <option value="" disabled >Customer Status</option>
                                                        <option>Active</option>
                                                        <option>Inactive</option>
                                                    </select>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Contant Person</label>
                                                    <input type="text" value={addCustData.contactPerson}
                                                        onChange={(e) => setAddCustData({ ...addCustData, contactPerson: e.target.value })}
                                                        placeholder="Contact Person" required />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Contact Person Mobile No</label>
                                                    <input type="tel" maxLength="10"
                                                        value={addCustData.contactPersonMob}
                                                        onChange={(e) => setAddCustData({ ...addCustData, contactPersonMob: e.target.value })}
                                                        name="contactPersonMob" pattern="[0-9]{10}" placeholder="Mobile No" required />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Description</label>
                                                    <input type="text" placeholder="Description"
                                                        value={addCustData.description}
                                                        onChange={(e) => setAddCustData({ ...addCustData, description: e.target.value })} required />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">User Name</label>
                                                    <input type="text" placeholder="User Name" value={addCustData.userName}
                                                        onChange={(e) => setAddCustData({ ...addCustData, userName: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Password</label>
                                                    <div className="password-container" style={{ position: 'relative' }}>
                                                        <input
                                                            type={passwordVisible ? 'text' : 'password'}
                                                            placeholder="Password"
                                                            required value={addCustData.Password}
                                                            onChange={(e) => setAddCustData({ ...addCustData, Password: e.target.value })}
                                                        />
                                                        <div
                                                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                                            onClick={togglePasswordVisibility}
                                                            className="fa-eye" >
                                                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Department</label>
                                                    <select value={addCustData.DepartmentCode}
                                                        onChange={(e) => setAddCustData({ ...addCustData, DepartmentCode: e.target.value })}>
                                                        <option value="" disabled>Select Department</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                    </select>
                                                </div>

                                                <div className="input-field1">
                                                    <div className="select-radio">
                                                        <input type="checkbox" name="sms" id="sms"
                                                            checked={addCustData.sms}
                                                            onChange={(e) => setAddCustData({ ...addCustData, sms: e.target.checked })} />

                                                        <img src={sms} />

                                                        <input type="checkbox" name="email" id="email"
                                                            checked={addCustData.email}
                                                            onChange={(e) => setAddCustData({ ...addCustData, email: e.target.checked })} />

                                                        <img src={mail} />

                                                        <input type="checkbox" name="whatApp" id="whatsapp"
                                                            checked={addCustData.whatApp}
                                                            onChange={(e) => setAddCustData({ ...addCustData, whatApp: e.target.checked })} />

                                                        <img src={whatsapp} />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='bottom-buttons' style={{}}>
                                            {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                            {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                            <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >


                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen1}
                        className="custom-modal"
                        style={{
                            content: {

                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap"
                            },
                        }}>
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Contract Details</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleContractSubmit}>
                                    <div className="fields2">

                                        <div className="input-field1">
                                            <label htmlFor="">Credit Date</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={contractData.creditDate}
                                                onChange={(date) => handleDateChange("creditDate",date)}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Due Date</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={contractData.dueDate}
                                                onChange={(date) => handleDateChange("dueDate",date)}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Contract Amount</label>
                                            <input type="text" placeholder="Enter Contract Amount" required
                                                value={contractData.contractAmount}
                                                onChange={(e) => setContractData({ ...contractData, contractAmount: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Advance Amount</label>
                                            <input type="text" placeholder="Advance Amount"
                                                value={contractData.advAmt}
                                                onChange={(e) => setContractData({ ...contractData, advAmt: e.target.value })} required />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Deposit Amount</label>
                                            <input type="text" placeholder="Enter Deposit Amount" required
                                                value={contractData.depositAmount}
                                                onChange={(e) => setContractData({ ...contractData, depositAmount: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Balance</label>
                                            <input type="text" placeholder="Enter Balance" required
                                                value={contractData.balance}
                                                onChange={(e) => setContractData({ ...contractData, balance: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className='bottom-buttons'>
                                        <button type='submit' className='ok-btn'>Submit</button>
                                        <button onClick={() => setModalIsOpen1(false)} className='ok-btn'>close</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </Modal >
                </div >
            </div >
        </>
    )
}

export default CustomerName;