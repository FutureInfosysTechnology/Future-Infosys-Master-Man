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
import Select from 'react-select';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


function CustomerName() {
    const [openRow, setOpenRow] = useState(null);
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
    const [fuelOption, setFuelOption] = useState("No");
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
        contractAmount: 0,
        depositAmount: 0,
        balance: 0,
        advAmt: 0
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
        gst: '0',
        fuel: '0',
        discount: '0',
        billPeriod: 'Monthly',
        custStatus: 'Active',
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
        DepartmentCode: '1',
        multiBranch: '',
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
                const response = await getApi('/Master/getAllBranchData');
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
        const errors = [];
        if (!addCustData.custCode) errors.push("Customer Code is required");
        if (!addCustData.custName) errors.push("Customer Name is required");
        if (!addCustData.bankBranch) errors.push("Branch is required");
        if (!addCustData.custStatus) errors.push("Customer Status is required");
        if (!addCustData.bookingType) errors.push("Booking Mode is required");
        if (!addCustData.billPeriod) errors.push("Billing Period is required");
        if (!addCustData.cityCode) errors.push("City Code is required");
        if (!addCustData.stateCode) errors.push("State Code is required");
        if (!addCustData.gstType) errors.push("GST Type is required");
        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: errors.map(err => `<div>${err}</div>`).join(''),
            });
            return;
        }
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
            GstNo: addCustData.gstNo.toUpperCase(),
            HSN_No: addCustData.hsnNo || "",
            GstType: addCustData.gstType,
            CustomerGst: addCustData.gst,
            Gst_Yes_No: gstOption,
            CustomerFuel: addCustData.fuel,
            Fuel_Yes_No1: fuelOption,
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
            UserName: addCustData.userName,
            Password: addCustData.Password,
            Department: addCustData.DepartmentCode,
            MultipleSingleBranch: addCustData.multiBranch,
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
                    gst: '0',
                    fuel: '0',
                    discount: '0',
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
                    DepartmentCode: '',
                    multiBranch: ''
                });
                setContractData({
                    creditDate: firstDayOfMonth,
                    dueDate: today,
                    contractAmount: '0',
                    depositAmount: '0',
                    balance: '0',
                    advAmt: '0'
                });
                setGstOption("Yes");
                setFuelOption("No");
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
        const errors = [];
        if (!addCustData.custCode) errors.push("Customer Code is required");
        if (!addCustData.custName) errors.push("Customer Name is required");
        if (!addCustData.bankBranch) errors.push("Branch is required");
        if (!addCustData.custStatus) errors.push("Customer Status is required");
        if (!addCustData.bookingType) errors.push("Booking Mode is required");
        if (!addCustData.billPeriod) errors.push("Billing Period is required");
        if (!addCustData.cityCode) errors.push("City Code is required");
        if (!addCustData.stateCode) errors.push("State Code is required");
        if (!addCustData.gstType) errors.push("GST Type is required");
        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: errors.map(err => `<div>${err}</div>`).join(''),
            });
            return;
        }
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
            gstNo: addCustData.gstNo.toUpperCase(),
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
            UserName: addCustData.userName,
            Password: addCustData.Password,
            departmentCode: addCustData.DepartmentCode,
            MultipleSingleBranch: addCustData.multiBranch,
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
                    gst: '0',
                    fuel: '0',
                    discount: '0',
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
                    DepartmentCode: '',
                    multiBranch: '',
                });
                setContractData({
                    creditDate: firstDayOfMonth,
                    dueDate: today,
                    contractAmount: '0',
                    depositAmount: '0',
                    balance: '0',
                    advAmt: '0'
                });
                setGstOption("Yes");
                setFuelOption("No");
                setPasswordVisible(false);
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
    const handleDateChange = (field, date) => {
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
                                    gst: '0',
                                    fuel: '0',
                                    discount: '0',
                                    billPeriod: 'Monthly',
                                    custStatus: 'Active',
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
                                    DepartmentCode: '1',
                                    multiBranch: '',
                                });
                                setContractData({
                                    creditDate: firstDayOfMonth,
                                    dueDate: today,
                                    contractAmount: 0,
                                    depositAmount: 0,
                                    balance: 0,
                                    advAmt: 0
                                });
                                setGstOption("Yes");
                                setFuelOption("No");
                                setPasswordVisible(false);
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
                        <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                            <thead className='table-sm'>
                                <tr>
                                    <th scope="col">Actions</th>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Branch_Name</th>
                                    <th scope="col">Customer_Code</th>
                                    <th scope="col">Customer_Name</th>
                                    <th scope="col">GST</th>
                                    <th scope="col">Booking_Type</th>
                                    <th scope="col">Mobile_No</th>
                                    <th scope="col">Email_ID</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Pin_Code</th>
                                    <th scope="col">HSN_No</th>

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
                                                            billPeriod: cust.Billing_Period,
                                                            custStatus: cust.Customer_Status,
                                                            DepartmentCode: cust.DepartmentCode,
                                                            multiBranch: cust.Manage_Code

                                                        });
                                                        setGstOption(cust.Gst_Yes_No);
                                                        setFuelOption(cust.Fuel_Yes_No1);
                                                        setContractData({
                                                            contractAmount: cust.Contact_Amount,
                                                            creditDate: cust.Credit_Date === null ? firstDayOfMonth : cust.Credit_Date,
                                                            dueDate: cust.Due_Date === null ? today : cust.Due_Date,
                                                            advAmt: cust.AdvanceAmt,
                                                            balance: cust.Balance_Amount,
                                                            depositAmount: cust.Deposit_Amount
                                                        })
                                                        setModalIsOpen(true);
                                                    }}>
                                                        <i className='bi bi-pen'></i>
                                                    </button>
                                                    <button onClick={() => {
                                                        handleDeleteCustName(cust.Customer_Code);
                                                        setOpenRow(null);
                                                    }} className='edit-btn'>
                                                        <i className='bi bi-trash'></i></button>
                                                </div>
                                            )}
                                        </td>

                                        <td>{index + 1}</td>
                                        <td>{cust.Branch_Name}</td>
                                        <td>{cust.Customer_Code}</td>
                                        <td>{cust.Customer_Name}</td>
                                        <td>{cust.Gst_No}</td>
                                        <td>{cust.Booking_Type}</td>
                                        <td>{cust.Customer_Mob}</td>
                                        <td>{cust.Email_Id}</td>
                                        <td>{cust.Customer_Add1}</td>
                                        <td>{cust.Pin_Code}</td>
                                        <td>{cust.HSN_NO}</td>

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
                                                    <label htmlFor="">Brnach Name</label>
                                                    <Select
                                                        className="blue-selectbooking"
                                                        classNamePrefix="blue-selectbooking"
                                                        options={getBranchName.map((branch) => ({
                                                            value: branch.Branch_Code,
                                                            label: branch.Branch_Name,
                                                        }))}
                                                        value={
                                                            addCustData.bankBranch
                                                                ? {
                                                                    value: addCustData.bankBranch,
                                                                    label:
                                                                        getBranchName.find((b) => b.Branch_Code === addCustData.bankBranch)
                                                                            ?.Branch_Name || "",
                                                                }
                                                                : null
                                                        }
                                                        onChange={(selected) =>
                                                            setAddCustData({
                                                                ...addCustData,
                                                                bankBranch: selected ? selected.value : "",
                                                            })
                                                        }
                                                        placeholder="Branch Name"
                                                        isSearchable={true}
                                                        isClearable={false}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                    />

                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Code</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Code/ Generate Code"
                                                        value={addCustData.custCode}
                                                        onChange={(e) => setAddCustData({ ...addCustData, custCode: e.target.value })}
                                                        maxLength="3" readOnly={isEditMode} />
                                                </div>

                                                {!isEditMode && (
                                                    <div className="input-field3">
                                                        <button type="button" className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                            onClick={handleGenerateCode}>Generate Code</button>
                                                    </div>
                                                )}

                                                <div className="input-field3">
                                                    <label htmlFor="">Customer Name</label>
                                                    <input type="text" placeholder="Customer Name"
                                                        value={addCustData.custName}
                                                        onChange={(e) => setAddCustData({ ...addCustData, custName: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Booking Mode</label>
                                                    <Select
                                                        className="blue-selectbooking"
                                                        classNamePrefix="blue-selectbooking"
                                                        options={[
                                                            { value: "Cash", label: "Cash" },
                                                            { value: "Credit", label: "Credit" },
                                                            { value: "To-pay", label: "To-pay" },
                                                            { value: "Google Pay", label: "Google Pay" },
                                                            { value: "RTGS", label: "RTGS" },
                                                            { value: "NEFT", label: "NEFT" }
                                                        ]}

                                                        value={
                                                            addCustData.bookingType
                                                                ? { value: addCustData.bookingType, label: addCustData.bookingType }
                                                                : null
                                                        }
                                                        onChange={(selected) =>
                                                            setAddCustData({
                                                                ...addCustData,
                                                                bookingType: selected ? selected.value : "",
                                                            })
                                                        }
                                                        placeholder="Select Booking Mode"
                                                        isSearchable={false}
                                                        isClearable={false}
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                    />

                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Customer Mobile No</label>
                                                    <input type="tel" maxLength="10" id="mobile"
                                                        name="mobile" pattern="[0-9]{10}" placeholder="Customer Mobile No"
                                                        value={addCustData.custMob}
                                                        onChange={(e) => setAddCustData({ ...addCustData, custMob: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Email ID</label>
                                                    <input type="email" placeholder="Email Id"
                                                        value={addCustData.emailID}
                                                        onChange={(e) => setAddCustData({ ...addCustData, emailID: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Address</label>
                                                    <input type="text" placeholder="Address"
                                                        value={addCustData.custAdd1}
                                                        onChange={(e) => setAddCustData({ ...addCustData, custAdd1: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Address</label>
                                                    <input type="text" placeholder="Address"
                                                        value={addCustData.custAdd2}
                                                        onChange={(e) => setAddCustData({ ...addCustData, custAdd2: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Address</label>
                                                    <input type="text" placeholder="Address"
                                                        value={addCustData.custAdd3}
                                                        onChange={(e) => setAddCustData({ ...addCustData, custAdd3: e.target.value })} />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Pin code</label>
                                                    <input type="tel" id="pincode" name="pincode" maxLength="6"
                                                        placeholder="Pin Code" value={addCustData.pinCode}
                                                        onChange={(e) => setAddCustData({ ...addCustData, pinCode: e.target.value })} />
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
                                                            addCustData.stateCode
                                                                ? {
                                                                    value: addCustData.stateCode,
                                                                    label:
                                                                        getState.find((s) => s.State_Code === addCustData.stateCode)
                                                                            ?.State_Name || "",
                                                                }
                                                                : null
                                                        }
                                                        onChange={(selected) =>
                                                            setAddCustData({
                                                                ...addCustData,
                                                                stateCode: selected ? selected.value : "",
                                                            })
                                                        }
                                                        placeholder="State Name"
                                                        isSearchable={true}
                                                        isClearable={false}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                    />

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
                                                            addCustData.cityCode
                                                                ? {
                                                                    value: addCustData.cityCode,
                                                                    label:
                                                                        getCity.find((c) => c.City_Code === addCustData.cityCode)
                                                                            ?.City_Name || "",
                                                                }
                                                                : null
                                                        }
                                                        onChange={(selected) =>
                                                            setAddCustData({
                                                                ...addCustData,
                                                                cityCode: selected ? selected.value : "",
                                                            })
                                                        }
                                                        placeholder="City Name"
                                                        isSearchable={true}
                                                        isClearable={false}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                    />

                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">GST No</label>
                                                    <input type="tel" value={addCustData.gstNo}
                                                        onChange={(e) => setAddCustData({ ...addCustData, gstNo: e.target.value })}
                                                        placeholder="Gst No." />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">HSN No</label>
                                                    <input type="text" value={addCustData.hsnNo}
                                                        onChange={(e) => setAddCustData({ ...addCustData, hsnNo: e.target.value })}
                                                        placeholder="HSN No" />
                                                </div>

                                                <div className="input-field3">
                                                    <label>GST Type</label>
                                                    <Select
                                                        className="blue-selectbooking"
                                                        classNamePrefix="blue-selectbooking"
                                                        options={[
                                                            { value: "Transport", label: "Transport" },
                                                            { value: "Client", label: "Client" },
                                                        ]}
                                                        value={
                                                            addCustData.gstType
                                                                ? { value: addCustData.gstType, label: addCustData.gstType }
                                                                : null
                                                        }
                                                        onChange={(selected) =>
                                                            setAddCustData({
                                                                ...addCustData,
                                                                gstType: selected ? selected.value : "",
                                                            })
                                                        }
                                                        placeholder="Select GST Type"
                                                        isSearchable={false}
                                                        isClearable={false}
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                    />

                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">GST %</label>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <input style={{
                                                            width: "70%", borderRight: "transparent",
                                                            borderTopRightRadius: "0px", borderBottomRightRadius: "0px"
                                                        }} type="text" placeholder="GST" value={addCustData.gst}
                                                            onChange={(e) => setAddCustData({ ...addCustData, gst: e.target.value })}
                                                            disabled={!isGstEnabled} />
                                                        <select style={{
                                                            width: "30%", borderLeft: "transparent",
                                                            borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px",
                                                            padding: "0px",
                                                            textAlign: "center"
                                                        }} value={gstOption || "Yes"} onChange={handleGstChange}>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Fuel %</label>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <input style={{
                                                            width: "70%", borderRight: "transparent",
                                                            borderTopRightRadius: "0px", borderBottomRightRadius: "0px"
                                                        }} type="text" placeholder="Fuel" value={addCustData.fuel}
                                                            onChange={(e) => setAddCustData({ ...addCustData, fuel: e.target.value })}
                                                            disabled={!isFuelEnabled} />
                                                        <select style={{
                                                            width: "30%", borderLeft: "transparent",
                                                            borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px",
                                                            padding: "0px",
                                                            textAlign: "center"
                                                        }} value={fuelOption || "No"} onChange={handleFuelChange}>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Discount %</label>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <input style={{
                                                            width: "70%", borderRight: "transparent",
                                                            borderTopRightRadius: "0px", borderBottomRightRadius: "0px"
                                                        }} type="text" placeholder="Discount" value={addCustData.discount}
                                                            onChange={(e) => setAddCustData({ ...addCustData, discount: e.target.value })}
                                                            disabled={!isDiscountEnabled} />
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
                                                    <Select
                                                        className="blue-selectbooking"
                                                        classNamePrefix="blue-selectbooking"
                                                        options={[
                                                            { value: "Monthly", label: "Monthly" },
                                                            { value: "Quarterly", label: "Quarterly" },
                                                            { value: "Half Yearly", label: "Half Yearly" },
                                                            { value: "Yearly", label: "Yearly" },
                                                        ]}
                                                        value={
                                                            addCustData.billPeriod
                                                                ? { value: addCustData.billPeriod, label: addCustData.billPeriod }
                                                                : null
                                                        }
                                                        onChange={(selected) =>
                                                            setAddCustData({
                                                                ...addCustData,
                                                                billPeriod: selected ? selected.value : "",
                                                            })
                                                        }
                                                        placeholder="Billing Period"
                                                        isSearchable={false}
                                                        isClearable={false}
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                    />

                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Wallet Amount</label>
                                                    <div className="dropdown">
                                                        <button onClick={(e) => { e.preventDefault(); setModalIsOpen1(true); }} type="button" className="ok-btn"
                                                            style={{ height: "35px", fontSize: "14px", width: "100%" }}>
                                                            {contractData.contractAmount ? `Amount: ${contractData.contractAmount}` : 'Wallet Amount'}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Customer Status</label>
                                                    <Select
                                                        className="blue-selectbooking"
                                                        classNamePrefix="blue-selectbooking"
                                                        options={[
                                                            { value: "Active", label: "Active" },
                                                            { value: "Inactive", label: "Inactive" },
                                                        ]}
                                                        value={
                                                            addCustData.custStatus
                                                                ? { value: addCustData.custStatus, label: addCustData.custStatus }
                                                                : null
                                                        }
                                                        onChange={(selected) =>
                                                            setAddCustData({
                                                                ...addCustData,
                                                                custStatus: selected ? selected.value : "",
                                                            })
                                                        }
                                                        placeholder="Customer Status"
                                                        isSearchable={false}
                                                        isClearable={false}
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                    />

                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Contant Person</label>
                                                    <input type="text" value={addCustData.contactPerson}
                                                        onChange={(e) => setAddCustData({ ...addCustData, contactPerson: e.target.value })}
                                                        placeholder="Contact Person" />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Mobile No</label>
                                                    <input type="tel" maxLength="10"
                                                        value={addCustData.contactPersonMob}
                                                        onChange={(e) => setAddCustData({ ...addCustData, contactPersonMob: e.target.value })}
                                                        name="contactPersonMob" pattern="[0-9]{10}" placeholder="Mobile No" />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Description</label>
                                                    <input type="text" placeholder="Description"
                                                        value={addCustData.description}
                                                        onChange={(e) => setAddCustData({ ...addCustData, description: e.target.value })} />
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
                                                            value={addCustData.Password}
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
                                                    <Select
                                                        className="blue-selectbooking"
                                                        classNamePrefix="blue-selectbooking"
                                                        options={[
                                                            { value: "1", label: "1" },
                                                            { value: "2", label: "2" },
                                                        ]}
                                                        value={
                                                            addCustData.DepartmentCode
                                                                ? { value: addCustData.DepartmentCode, label: addCustData.DepartmentCode }
                                                                : { value: "1", label: "1" }
                                                        }
                                                        onChange={(selected) =>
                                                            setAddCustData({
                                                                ...addCustData,
                                                                DepartmentCode: selected ? selected.value : "",
                                                            })
                                                        }
                                                        placeholder="Select Department"
                                                        isSearchable={false}
                                                        isClearable={false}
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                    />

                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">Manage Branch</label>
                                                    <Select
                                                        className="blue-selectbooking"
                                                        classNamePrefix="blue-selectbooking"
                                                        options={getBranchName.map((branch) => ({
                                                            value: branch.Branch_Code,
                                                            label: branch.Branch_Name,
                                                        }))}
                                                        value={
                                                            addCustData.multiBranch
                                                                ? {
                                                                    value: addCustData.multiBranch,
                                                                    label:
                                                                        getBranchName.find((b) => b.Branch_Code === addCustData.multiBranch)
                                                                            ?.Branch_Name || "",
                                                                }
                                                                : null
                                                        }
                                                        onChange={(selected) =>
                                                            setAddCustData({
                                                                ...addCustData,
                                                                multiBranch: selected ? selected.value : "",
                                                            })
                                                        }
                                                        placeholder="Select Manage Branch"
                                                        isSearchable={true}
                                                        isClearable={false}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                    />

                                                </div>
                                                <div className="input-field2">
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
                                                <div className='bottom-buttons' style={{ marginTop: "15px", marginLeft: "10px" }}>
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
                                <header>Wallet Details</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleContractSubmit}>
                                    <div className="fields2">

                                        <div className="input-field1">
                                            <label htmlFor="">Credit Date</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={contractData.creditDate}
                                                onChange={(date) => handleDateChange("creditDate", date)}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Due Date</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={contractData.dueDate}
                                                onChange={(date) => handleDateChange("dueDate", date)}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Wallet Amount</label>
                                            <input type="text" placeholder="Enter Wallet Amount"
                                                value={contractData.contractAmount}
                                                onChange={(e) => setContractData({ ...contractData, contractAmount: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Advance Amount</label>
                                            <input type="text" placeholder="Advance Amount"
                                                value={contractData.advAmt}
                                                onChange={(e) => setContractData({ ...contractData, advAmt: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Deposit Amount</label>
                                            <input type="text" placeholder="Enter Deposit Amount"
                                                value={contractData.depositAmount}
                                                onChange={(e) => setContractData({ ...contractData, depositAmount: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Balance</label>
                                            <input type="text" placeholder="Enter Balance"
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