import React, { useState, useEffect } from 'react'
import Footer from '../../Components-2/Footer';
import Sidebar1 from '../../Components-2/Sidebar1';
import Header from '../../Components-2/Header/Header';
import { postApi, getApi, putApi, deleteApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { ImEye } from "react-icons/im";
import { ImEyeBlocked } from "react-icons/im";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

function UserAdmin() {
    const [openRow, setOpenRow] = useState(null);
    const [eye, setEye] = useState(true);
    const [eyeDis, setEyeDis] = useState(false);
    const [getData, setGetData] = useState([]);
    const [getEmployee, setGetEmployee] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedOperation, setSelectedOperation] = useState("");
    const [formData, setFormData] = useState({
        ID:"",
        UserName: "",
        Employee_Code: "",
        Password: "",
        City_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
        UserType: "User",
        DocketBooking: 0,
        DocketPrint: 0,
        CoshTopayBooking: 0,
        Smartbooking: 0,
        AutoMail: 0,
        BulkImportData: 0,
        VendorBillEntry: 0,
        PendingManifest: 0,
        OutgoingManifest: 0,
        ViewManifest: 0,
        BuilkimportManifest: 0,
        ScanbyDocketNo: 0,
        InscanProcessView: 0,
        DeliveryPending: 0,
        DeliveryBooking: 0,
        DrsView: 0,
        Drsimport: 0,
        Statusactivity: 0,
        StatusactivityimportBulk: 0,
        StatusactivityTracking: 0,
        DeliveryEntry: 0,
        ReturnEntry: 0,
        BulkUploadExcel: 0,
        DocketPrint1: 0,
        Docketprint2: 0,
        Docketprint3: 0,
        Docketprint4: 0,
        LebelPrintin: 0,
        StickerPrinting: 0,
        InternationalBooking: 0,
        ComplaintRegister: 0,
        ViewComplaintStatus: 0,
        ComplaintQuery: 0,
        PendingInvoice: 0,
        GenerateInvoice: 0,
        ViewInvoice: 0,
        InvoiceSummary: 0,
        Docket_Print: 0,
        PerformanceInvoice: 0,
        ViewPerformanceInvoice: 0,
        PaymentReceivedEntry: 0,
        PayOutStanding: 0,
        CreditBooking: 0,
        CreditNoteView: 0,
        MISReport: 0,
        VendorMISReport: 0,
        BookingModeReport: 0,
        BookingDetail: 0,
        TotalChargesReport: 0,
        ModeWiseReport: 0,
        InvoiceLedgerReport: 0,
        ChecklistReport: 0,
        UnbuildReport: 0,
        BillViewReport: 0,
    });
    const togglePass = () => {
        setEye((eye) => !eye);
    }
    useEffect(() => {
        console.log(formData);
    }, [formData])
    useEffect(() => {
        if (!formData.Password) {
            setEyeDis(true);
        }
        else {
            setEyeDis(false);
        }
    }, [formData.Password])
    const fetchEmpData = async () => {
        try {
            const response = await getApi('/Master/GetEmployee');
            setGetEmployee(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
        }
    };
    const fechUserData = async () => {
        try {
            const response = await getApi('/Master/GetOperationManagement');
            setGetData(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
        }
    };

    useEffect(() => {
        fetchEmpData();
        fechUserData();
    }, []);

    const handleDelete = async (ID) => {
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
                await deleteApi(`/Master/DeleteOperationManagement?ID=${ID}`);
                setGetData(getData.filter((data) => data.ID !== ID));
                Swal.fire('Deleted!', 'The User has been deleted.', 'success');
                 setFormData({
            ID: "",
            UserName: "",
            Employee_Code: "",
            Password: "",
            City_Code: "",
            UserType: "Admin",
            DocketBooking: 0,
            DocketPrint: 0,
            CoshTopayBooking: 0,
            Smartbooking: 0,
            AutoMail: 0,
            BulkImportData: 0,
            VendorBillEntry: 0,
            PendingManifest: 0,
            OutgoingManifest: 0,
            ViewManifest: 0,
            BuilkimportManifest: 0,
            ScanbyDocketNo: 0,
            InscanProcessView: 0,
            DeliveryPending: 0,
            DeliveryBooking: 0,
            DrsView: 0,
            Drsimport: 0,
            Statusactivity: 0,
            StatusactivityimportBulk: 0,
            StatusactivityTracking: 0,
            DeliveryEntry: 0,
            ReturnEntry: 0,
            BulkUploadExcel: 0,
            DocketPrint1: 0,
            Docketprint2: 0,
            Docketprint3: 0,
            Docketprint4: 0,
            LebelPrintin: 0,
            StickerPrinting: 0,
            InternationalBooking: 0,
            ComplaintRegister: 0,
            ViewComplaintStatus: 0,
            ComplaintQuery: 0,
            PendingInvoice: 0,
            GenerateInvoice: 0,
            ViewInvoice: 0,
            InvoiceSummary: 0,
            Docket_Print: 0,
            PerformanceInvoice: 0,
            ViewPerformanceInvoice: 0,
            PaymentReceivedEntry: 0,
            PayOutStanding: 0,
            CreditBooking: 0,
            CreditNoteView: 0,
            MISReport: 0,
            VendorMISReport: 0,
            BookingModeReport: 0,
            BookingDetail: 0,
            TotalChargesReport: 0,
            ModeWiseReport: 0,
            InvoiceLedgerReport: 0,
            ChecklistReport: 0,
            UnbuildReport: 0,
            BillViewReport: 0,
        });
        setSelectedOperation('');
        setSelectedOption('');
                await fechUserData();
            } catch (err) {
                console.error('Delete Error:', err);
                Swal.fire('Error', 'Failed to delete User Admin', 'error');
            }
        }
    };

    const handleRadioChange = (value) => {
        setSelectedOption((prev) => (prev === value ? "" : value));
    };

    const handleCheckboxChange = (value) => {
        setSelectedOperation((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const handleCheckboxselected = (e) => {
        const { name, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };
    const ResetAll = (e) => {
        e.preventDefault();
        setFormData({
            ID:"",
            UserName: "",
            Employee_Code: "",
            Password: "",
            City_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
            UserType: "User",
            DocketBooking: 0,
            DocketPrint: 0,
            CoshTopayBooking: 0,
            Smartbooking: 0,
            AutoMail: 0,
            BulkImportData: 0,
            VendorBillEntry: 0,
            PendingManifest: 0,
            OutgoingManifest: 0,
            ViewManifest: 0,
            BuilkimportManifest: 0,
            ScanbyDocketNo: 0,
            InscanProcessView: 0,
            DeliveryPending: 0,
            DeliveryBooking: 0,
            DrsView: 0,
            Drsimport: 0,
            Statusactivity: 0,
            StatusactivityimportBulk: 0,
            StatusactivityTracking: 0,
            DeliveryEntry: 0,
            ReturnEntry: 0,
            BulkUploadExcel: 0,
            DocketPrint1: 0,
            Docketprint2: 0,
            Docketprint3: 0,
            Docketprint4: 0,
            LebelPrintin: 0,
            StickerPrinting: 0,
            InternationalBooking: 0,
            ComplaintRegister: 0,
            ViewComplaintStatus: 0,
            ComplaintQuery: 0,
            PendingInvoice: 0,
            GenerateInvoice: 0,
            ViewInvoice: 0,
            InvoiceSummary: 0,
            Docket_Print: 0,
            PerformanceInvoice: 0,
            ViewPerformanceInvoice: 0,
            PaymentReceivedEntry: 0,
            PayOutStanding: 0,
            CreditBooking: 0,
            CreditNoteView: 0,
            MISReport: 0,
            VendorMISReport: 0,
            BookingModeReport: 0,
            BookingDetail: 0,
            TotalChargesReport: 0,
            ModeWiseReport: 0,
            InvoiceLedgerReport: 0,
            ChecklistReport: 0,
            UnbuildReport: 0,
            BillViewReport: 0,
        });
        setSelectedOperation('');
        setSelectedOption('');
    }
    const handlesave = async (e) => {
        e.preventDefault();

        const requestBody = {
            UserName: formData.UserName || "",
            Employee_Code: formData.Employee_Code || "",
            Password: formData.Password || "",
            City_Code: formData.City_Code || "",
            UserType: formData.UserType || "",
            DocketBooking: formData.DocketBooking ? 1 : 0,
            CoshTopayBooking: formData.CoshTopayBooking ? 1 : 0,
            Smartbooking: formData.Smartbooking ? 1 : 0,
            AutoMail: formData.AutoMail ? 1 : 0,
            BulkImportData: formData.BulkImportData ? 1 : 0,
            VendorBillEntry: formData.VendorBillEntry ? 1 : 0,
            PendingManifest: formData.PendingManifest ? 1 : 0,
            OutgoingManifest: formData.OutgoingManifest ? 1 : 0,
            ViewManifest: formData.ViewManifest ? 1 : 0,
            BuilkimportManifest: formData.BuilkimportManifest ? 1 : 0,
            ScanbyDocketNo: formData.ScanbyDocketNo ? 1 : 0,
            InscanProcessView: formData.InscanProcessView ? 1 : 0,
            DeliveryBooking: formData.DeliveryBooking ? 1 : 0,
            DrsView: formData.DrsView ? 1 : 0,
            Drsimport: formData.Drsimport ? 1 : 0,
            Statusactivity: formData.Statusactivity ? 1 : 0,
            StatusactivityimportBulk: formData.StatusactivityimportBulk ? 1 : 0,
            StatusactivityTracking: formData.StatusactivityTracking ? 1 : 0,
            DeliveryEntry: formData.DeliveryEntry ? 1 : 0,
            ReturnEntry: formData.ReturnEntry ? 1 : 0,
            BulkUploadExcel: formData.BulkUploadExcel ? 1 : 0,
            DocketPrint1: formData.DocketPrint1 ? 1 : 0,
            Docketprint2: formData.Docketprint2 ? 1 : 0,
            Docketprint3: formData.Docketprint3 ? 1 : 0,
            Docketprint4: formData.Docketprint4 ? 1 : 0,
            LebelPrintin: formData.LebelPrintin ? 1 : 0,
            StickerPrinting: formData.StickerPrinting ? 1 : 0,
            InternationalBooking: formData.InternationalBooking ? 1 : 0,
            ComplaintRegister: formData.ComplaintRegister ? 1 : 0,
            ViewComplaintStatus: formData.ViewComplaintStatus ? 1 : 0,
            ComplaintQuery: formData.ComplaintQuery ? 1 : 0,
            PendingInvoice: formData.PendingInvoice ? 1 : 0,
            GenerateInvoice: formData.GenerateInvoice ? 1 : 0,
            ViewInvoice: formData.ViewInvoice ? 1 : 0,
            InvoiceSummary: formData.InvoiceSummary ? 1 : 0,
            Docket_Print: formData.Docket_Print ? 1 : 0,
            PerformanceInvoice: formData.PerformanceInvoice ? 1 : 0,
            ViewPerformanceInvoice: formData.ViewPerformanceInvoice ? 1 : 0,
            PaymentReceivedEntry: formData.PaymentReceivedEntry ? 1 : 0,
            PayOutStanding: formData.PayOutStanding ? 1 : 0,
            CreditBooking: formData.CreditBooking ? 1 : 0,
            CreditNoteView: formData.CreditNoteView ? 1 : 0,
            MISReport: formData.MISReport ? 1 : 0,
            VendorMISReport: formData.VendorMISReport ? 1 : 0,
            BookingModeReport: formData.BookingModeReport ? 1 : 0,
            BookingDetail: formData.BookingDetail ? 1 : 0,
            TotalChargesReport: formData.TotalChargesReport ? 1 : 0,
            ModeWiseReport: formData.ModeWiseReport ? 1 : 0,
            InvoiceLedgerReport: formData.InvoiceLedgerReport ? 1 : 0,
            ChecklistReport: formData.ChecklistReport ? 1 : 0,
        };
        try {
            const response = await postApi('/Master/addOperationManagement', requestBody, 'POST');
            if (response.status === 1) {
                setGetData([...getData, response?.data]);
                ResetAll(e);
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                await fechUserData();
            }
        } catch (error) {
            console.error('Unable to add Admin:', error);
        }
    }
    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            ID:formData.ID,
            UserName: formData.UserName || "",
            Employee_Code: formData.Employee_Code || "",
            Password: formData.Password || "",
            City_Code: formData.City_Code || "",
            UserType: formData.UserType || "",
            DocketBooking: formData.DocketBooking ? 1 : 0,
            CoshTopayBooking: formData.CoshTopayBooking ? 1 : 0,
            Smartbooking: formData.Smartbooking ? 1 : 0,
            AutoMail: formData.AutoMail ? 1 : 0,
            BulkImportData: formData.BulkImportData ? 1 : 0,
            VendorBillEntry: formData.VendorBillEntry ? 1 : 0,
            PendingManifest: formData.PendingManifest ? 1 : 0,
            OutgoingManifest: formData.OutgoingManifest ? 1 : 0,
            ViewManifest: formData.ViewManifest ? 1 : 0,
            BuilkimportManifest: formData.BuilkimportManifest ? 1 : 0,
            ScanbyDocketNo: formData.ScanbyDocketNo ? 1 : 0,
            InscanProcessView: formData.InscanProcessView ? 1 : 0,
            DeliveryBooking: formData.DeliveryBooking ? 1 : 0,
            DrsView: formData.DrsView ? 1 : 0,
            Drsimport: formData.Drsimport ? 1 : 0,
            Statusactivity: formData.Statusactivity ? 1 : 0,
            StatusactivityimportBulk: formData.StatusactivityimportBulk ? 1 : 0,
            StatusactivityTracking: formData.StatusactivityTracking ? 1 : 0,
            DeliveryEntry: formData.DeliveryEntry ? 1 : 0,
            ReturnEntry: formData.ReturnEntry ? 1 : 0,
            BulkUploadExcel: formData.BulkUploadExcel ? 1 : 0,
            DocketPrint1: formData.DocketPrint1 ? 1 : 0,
            Docketprint2: formData.Docketprint2 ? 1 : 0,
            Docketprint3: formData.Docketprint3 ? 1 : 0,
            Docketprint4: formData.Docketprint4 ? 1 : 0,
            LebelPrintin: formData.LebelPrintin ? 1 : 0,
            StickerPrinting: formData.StickerPrinting ? 1 : 0,
            InternationalBooking: formData.InternationalBooking ? 1 : 0,
            ComplaintRegister: formData.ComplaintRegister ? 1 : 0,
            ViewComplaintStatus: formData.ViewComplaintStatus ? 1 : 0,
            ComplaintQuery: formData.ComplaintQuery ? 1 : 0,
            PendingInvoice: formData.PendingInvoice ? 1 : 0,
            GenerateInvoice: formData.GenerateInvoice ? 1 : 0,
            ViewInvoice: formData.ViewInvoice ? 1 : 0,
            InvoiceSummary: formData.InvoiceSummary ? 1 : 0,
            Docket_Print: formData.Docket_Print ? 1 : 0,
            PerformanceInvoice: formData.PerformanceInvoice ? 1 : 0,
            ViewPerformanceInvoice: formData.ViewPerformanceInvoice ? 1 : 0,
            PaymentReceivedEntry: formData.PaymentReceivedEntry ? 1 : 0,
            PayOutStanding: formData.PayOutStanding ? 1 : 0,
            CreditBooking: formData.CreditBooking ? 1 : 0,
            CreditNoteView: formData.CreditNoteView ? 1 : 0,
            MISReport: formData.MISReport ? 1 : 0,
            VendorMISReport: formData.VendorMISReport ? 1 : 0,
            BookingModeReport: formData.BookingModeReport ? 1 : 0,
            BookingDetail: formData.BookingDetail ? 1 : 0,
            TotalChargesReport: formData.TotalChargesReport ? 1 : 0,
            ModeWiseReport: formData.ModeWiseReport ? 1 : 0,
            InvoiceLedgerReport: formData.InvoiceLedgerReport ? 1 : 0,
            ChecklistReport: formData.ChecklistReport ? 1 : 0,
        };


        try {
            const response = await putApi('/Master/UpdateOperationManagement', requestBody, 'PUT');
            if (response.status === 1) {
                ResetAll(e);
                Swal.fire('Saved!', response.message || 'Your changes have been Updated.', 'success');
                await fechUserData();
            }
        } catch (error) {
            console.error('Unable to add Admin:', error);
        }
    }
    return (
        <>
            <Header />
            <Sidebar1 />

            <div className="main-body" id="main-body">
                <div className="container1">
                    <form action="" onSubmit={handlesave} style={{ background: "white", whiteSpace: "nowrap" }}>
                        <div className="fields2">
                            <div className="input-field1">
                                <label htmlFor="">User Name</label>
                                <input type="text" placeholder='UserName' value={formData.UserName}
                                    onChange={(e) => setFormData({ ...formData, UserName: e.target.value })} />
                            </div>

                            <div className="input-field1">
                                <label htmlFor="">Password</label>
                                <div style={{ position: "relative" }}>
                                    <input type={eye ? "password" : "text"} placeholder='Password' value={formData.Password}
                                        onChange={(e) => setFormData({ ...formData, Password: e.target.value })} />
                                    <div style={{
                                        opacity: eyeDis ? 0 : 1, // fade instead of display: none
                                        visibility: eyeDis ? "hidden" : "visible", //
                                        position: "absolute",
                                        right: "10px",
                                        bottom: "5px",
                                        fontSize: "20px",
                                        cursor: "pointer",
                                        transition: "opacity 0.3s ease, visibility 0.3s ease"
                                    }} onClick={togglePass}>

                                        {eye ? <ImEye /> : <ImEyeBlocked />}
                                    </div>
                                </div>
                            </div>

                            <div className="input-field1">
                                <label htmlFor="">Employee Name</label>
                                <Select
                                    options={getEmployee.map(emp => ({
                                        value: emp.Employee_Code,   // adjust keys from your API
                                        label: emp.Employee_Name
                                    }))}
                                    value={
                                        formData.Employee_Code
                                            ? { value: formData.Employee_Code, label: getEmployee.find(c => c.Employee_Code === formData.Employee_Code)?.Employee_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            Employee_Code: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Employee"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                    menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                                    styles={{
                                        placeholder: (base) => ({
                                            ...base,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }),
                                        menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                                    }}
                                />

                            </div>

                            <div className="production-header container-fluid py-2 mx-3 my-3">
                                <div className="production-radio row g-2">
                                    {/* Operation */}
                                    <div className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex align-items-center">
                                        <input
                                            type="radio"
                                            id="operation"
                                            name="section"
                                            value="Operation"
                                            checked={selectedOption === "Operation"}
                                            onChange={() => handleRadioChange("Operation")}
                                            className="me-2"
                                        />
                                        <label htmlFor="operation" className="mb-0">Operation</label>
                                    </div>

                                    {/* Customer Complaint */}
                                    <div className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex align-items-center">
                                        <input
                                            type="radio"
                                            id="crm"
                                            name="section"
                                            value="CRM"
                                            checked={selectedOption === "CRM"}
                                            onChange={() => handleRadioChange("CRM")}
                                            className="me-2"
                                        />
                                        <label htmlFor="crm" className="mb-0">Complaint</label>
                                    </div>

                                    {/* Billings */}
                                    <div className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex align-items-center">
                                        <input
                                            type="radio"
                                            id="billings"
                                            name="section"
                                            value="Billings"
                                            checked={selectedOption === "Billings"}
                                            onChange={() => handleRadioChange("Billings")}
                                            className="me-2"
                                        />
                                        <label htmlFor="billings" className="mb-0">Billings</label>
                                    </div>

                                    {/* Payments */}
                                    <div className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex align-items-center">
                                        <input
                                            type="radio"
                                            id="payments"
                                            name="section"
                                            value="Payments"
                                            checked={selectedOption === "Payments"}
                                            onChange={() => handleRadioChange("Payments")}
                                            className="me-2"
                                        />
                                        <label htmlFor="payments" className="mb-0">Payments</label>
                                    </div>

                                    {/* Reports */}
                                    <div className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex align-items-center">
                                        <input
                                            type="radio"
                                            id="reports"
                                            name="section"
                                            value="Reports"
                                            checked={selectedOption === "Reports"}
                                            onChange={() => handleRadioChange("Reports")}
                                            className="me-2"
                                        />
                                        <label htmlFor="reports" className="mb-0">Reports</label>
                                    </div>
                                </div>
                            </div>

                            {selectedOption === "Operation" && (
                                <div className="container-fluid mt-3" style={{ whiteSpace: "nowrap" }}>
                                    <div className="row g-3">
                                        {/* Operation Panel */}
                                        <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                            <div className="card border-secondary h-100">
                                                <div className="card-header fw-bold" style={{
                                                    backgroundColor: "#13bfaeff",
                                                }}>Operation</div>
                                                <div className="card-body">
                                                    {[
                                                        { label: "Docket Booking", value: "Booking" },
                                                        { label: "Manifest", value: "Manifest" },
                                                        { label: "Scan Process Hub", value: "Parcel Scan Data" },
                                                        { label: "Run Sheet Entry", value: "Run Sheet Entry" },
                                                        { label: "Status Activity Entry", value: "Status Activity Entry" },
                                                        { label: "POD Record Update", value: "POD Record Update" },
                                                        { label: "Docket Print", value: "Docket Print" },
                                                        { label: "International Booking", value: "International Booking" },
                                                    ].map((item, index) => (
                                                        <div className="form-check mb-2" key={index}>
                                                            <input
                                                                className="form-check-input"
                                                                style={{ border: "1px solid black" }}
                                                                type="checkbox"
                                                                id={`op-${item.value}`}
                                                                checked={selectedOperation.includes(item.value)}
                                                                onChange={() => handleCheckboxChange(item.value)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`op-${item.value}`}>
                                                                {item.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Booking */}
                                        {selectedOperation.includes("Booking") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div className="card-header fw-bold" style={{ backgroundColor: "#13bfaeff" }}>Docket Booking</div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "DocketBooking", label: "Docket Booking" },
                                                            { name: "DocketPrint", label: "Docket Print" },
                                                            { name: "CoshTopayBooking", label: "Docket Expenses" },
                                                            { name: "AutoMail", label: "Auto Mail" },
                                                            { name: "Smartbooking", label: "Smart Booking" },
                                                            { name: "BulkImportData", label: "Bulk Booking" },
                                                            { name: "VendorBillEntry", label: "Vendor Bill Entry" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`booking-${i}`}
                                                                />
                                                                <label className="form-check-label" htmlFor={`booking-${i}`}>
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Manifest */}
                                        {selectedOperation.includes("Manifest") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div className="card-header fw-bold" style={{ backgroundColor: "#13bfaeff" }}>Manifest</div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "PendingManifest", label: "Pending Manifest" },
                                                            { name: "OutgoingManifest", label: "Outgoing Manifest" },
                                                            { name: "ViewManifest", label: "View Manifest" },
                                                            { name: "BuilkimportManifest", label: "Bulk Import Manifest" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`booking-${i}`}
                                                                />
                                                                <label className="form-check-label" htmlFor={`booking-${i}`}>
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Parcel Scan Data */}
                                        {selectedOperation.includes("Parcel Scan Data") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div className="card-header fw-bold" style={{ backgroundColor: "#13bfaeff" }}>Scan Process Hub</div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "ScanbyDocketNo", label: "Scan by Docket No" },
                                                            { name: "InscanProcessView", label: "Inscan Process View" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`booking-${i}`}
                                                                />
                                                                <label className="form-check-label" htmlFor={`booking-${i}`}>
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Run Sheet Entry */}
                                        {selectedOperation.includes("Run Sheet Entry") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div className="card-header fw-bold" style={{ backgroundColor: "#13bfaeff" }}>Run Sheet Entry</div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "DeliveryPending", label: "Delivery Pending" },
                                                            { name: "DeliveryBooking", label: "Delivery Entry" },
                                                            { name: "DrsView", label: "View DRS" },
                                                            { name: "Drsimport", label: "Import DRS" },

                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`booking-${i}`}
                                                                />
                                                                <label className="form-check-label" htmlFor={`booking-${i}`}>
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Status Activity Entry */}
                                        {selectedOperation.includes("Status Activity Entry") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div className="card-header fw-bold" style={{ backgroundColor: "#13bfaeff" }}>Status Activity Entry</div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "Statusactivity", label: "Activity Entry" },
                                                            { name: "StatusactivityimportBulk", label: "Activity Import Bulk" },
                                                            { name: "StatusactivityTracking", label: "Activity Tracking" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`booking-${i}`}
                                                                />
                                                                <label className="form-check-label" htmlFor={`booking-${i}`}>
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* POD Record Update */}
                                        {selectedOperation.includes("POD Record Update") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div className="card-header fw-bold" style={{ backgroundColor: "#13bfaeff" }}>POD Record Update</div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "DeliveryEntry", label: "Delivered" },
                                                            { name: "ReturnEntry", label: "Return Booking" },
                                                            { name: "BulkUploadExcel", label: "Bulk Upload (Excel)" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`pod-${i}`}
                                                                />
                                                                <label className="form-check-label" htmlFor={`pod-${i}`}>
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Docket Print */}
                                        {selectedOperation.includes("Docket Print") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div className="card-header fw-bold" style={{ backgroundColor: "#13bfaeff" }}>Docket Print</div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "DocketPrint1", label: "Docket Print" },
                                                            { name: "Docketprint2", label: "Docket Print2" },
                                                            { name: "Docketprint3", label: "Docket Print3" },
                                                            { name: "Docketprint4", label: "Docket Print4" },
                                                            { name: "LebelPrintin", label: "Label Printing" },
                                                            { name: "StickerPrinting", label: "Sticker Printing" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`docket-${i}`}
                                                                />
                                                                <label className="form-check-label" htmlFor={`docket-${i}`}>
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* International Booking */}
                                        {selectedOperation.includes("International Booking") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div className="card-header fw-bold" style={{ backgroundColor: "#13bfaeff" }}>Scan Process Hub</div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "InternationalBooking", label: "International Booking" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`booking-${i}`}
                                                                />
                                                                <label className="form-check-label" htmlFor={`booking-${i}`}>
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}


                            {selectedOption === "CRM" && (
                                <div className="container-fluid mt-3">
                                    <div className="row g-3">
                                        {/* Customer Complaint Main Panel */}
                                        <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                            <div className="card border-secondary h-100">
                                                <div
                                                    className="card-header fw-bold"
                                                    style={{ backgroundColor: "#13bfaeff" }}
                                                >
                                                    Customer Complaint
                                                </div>
                                                <div className="card-body">
                                                    {[
                                                        { label: "Customer Queries", value: "Customer Queries" },
                                                    ].map((item, index) => (
                                                        <div className="form-check mb-2" key={index}>
                                                            <input
                                                                className="form-check-input"
                                                                style={{ border: "1px solid black" }}
                                                                type="checkbox"
                                                                id={`crm-${item.value}`}
                                                                checked={selectedOperation.includes(item.value)}
                                                                onChange={() => handleCheckboxChange(item.value)}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`crm-${item.value}`}
                                                            >
                                                                {item.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Customer Queries Section */}
                                        {selectedOperation.includes("Customer Queries") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div className="card-header fw-bold"
                                                        style={{ backgroundColor: "#13bfaeff" }}>
                                                        Customer Queries
                                                    </div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "ComplaintRegister", label: "Complaint" },
                                                            { name: "ViewComplaintStatus", label: "View Complaint Status" },
                                                            { name: "ComplaintQuery", label: "Query" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`customer-${i}`}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`customer-${i}`}
                                                                >
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}



                            {selectedOption === "Reports" && (
                                <div className="container-fluid mt-3">
                                    <div className="row g-3">
                                        {/* Reports Main Panel */}
                                        <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                            <div className="card border-secondary h-100">
                                                <div
                                                    className="card-header fw-bold"
                                                    style={{ backgroundColor: "#13bfaeff" }}
                                                >
                                                    Reports
                                                </div>
                                                <div className="card-body">
                                                    {[
                                                        { label: "Booking MIS Report", value: "Status Report" },
                                                        { label: "Booking Detail Report", value: "Statement Wise Report" },
                                                        { label: "Invoice Ledger Report", value: "Sales Register Report" },
                                                    ].map((item, index) => (
                                                        <div className="form-check mb-2" key={index}>
                                                            <input
                                                                className="form-check-input"
                                                                style={{ border: "1px solid black" }}
                                                                type="checkbox"
                                                                id={`report-${item.value}`}
                                                                checked={selectedOperation.includes(item.value)}
                                                                onChange={() => handleCheckboxChange(item.value)}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`report-${item.value}`}
                                                            >
                                                                {item.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Booking MIS Report */}
                                        {selectedOperation.includes("Status Report") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div
                                                        className="card-header fw-bold"
                                                        style={{ backgroundColor: "#13bfaeff" }}
                                                    >
                                                        Booking MIS Report
                                                    </div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "MISReport", label: "MIS Report" },
                                                            { name: "VendorMISReport", label: "Vendor MIS Report" },
                                                            { name: "BookingModeReport", label: "Booking Mode Report" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`customer-${i}`}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`customer-${i}`}
                                                                >
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Booking Detail Report */}
                                        {selectedOperation.includes("Statement Wise Report") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div
                                                        className="card-header fw-bold"
                                                        style={{ backgroundColor: "#13bfaeff" }}
                                                    >
                                                        Booking Detail Report
                                                    </div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "BookingDetail", label: "Booking Detail" },
                                                            { name: "TotalChargesReport", label: "Total Charges Report" },
                                                            { name: "ModeWiseReport", label: "Mode Wise Report" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`detail-${i}`}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`detail-${i}`}
                                                                >
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Invoice Ledger Report */}
                                        {selectedOperation.includes("Sales Register Report") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div
                                                        className="card-header fw-bold"
                                                        style={{ backgroundColor: "#13bfaeff" }}
                                                    >
                                                        Invoice Ledger Report
                                                    </div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "InvoiceLedgerReport", label: "Invoice Ledger Report" },
                                                            { name: "ChecklistReport", label: "Checklist Report" },
                                                            { name: "UnbuildReport", label: "Unbuild Report" },
                                                            { name: "BillViewReport", label: "Bill View Report" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`customer-${i}`}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`customer-${i}`}
                                                                >
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}


                            {/* Billings Section */}
                            {selectedOption === "Billings" && (
                                <div className="container-fluid mt-3">
                                    <div className="row g-3">
                                        {/* Billings Main Panel */}
                                        <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                            <div className="card border-secondary h-100">
                                                <div
                                                    className="card-header fw-bold"
                                                    style={{ backgroundColor: "#13bfaeff" }}
                                                >
                                                    Billings
                                                </div>
                                                <div className="card-body">
                                                    <div className="form-check mb-2">
                                                        <input
                                                            className="form-check-input"
                                                            style={{ border: "1px solid black" }}
                                                            type="checkbox"
                                                            id="billing-invoice"
                                                            value="Invoice Generate"
                                                            checked={selectedOperation.includes("Invoice Generate")}
                                                            onChange={() => handleCheckboxChange("Invoice Generate")}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="billing-invoice"
                                                        >
                                                            Invoice Generate
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Invoice Generate Section */}
                                        {selectedOperation.includes("Invoice Generate") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div
                                                        className="card-header fw-bold"
                                                        style={{ backgroundColor: "#13bfaeff" }}
                                                    >
                                                        Invoice Generate
                                                    </div>
                                                    <div className="card-body">
                                                        {[
                                                            { name: "PendingInvoice", label: "Pending Invoice" },
                                                            { name: "GenerateInvoice", label: "Generate Invoice" },
                                                            { name: "ViewInvoice", label: "View Invoice" },
                                                            { name: "InvoiceSummary", label: "Invoice Summary" },
                                                            { name: "Docket_Print", label: "Docket Print" },
                                                            { name: "PerformanceInvoice", label: "Performance Invoice" },
                                                            { name: "ViewPerformanceInvoice", label: "View Performance Invoice" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`customer-${i}`}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`customer-${i}`}
                                                                >
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Payments Section */}
                            {selectedOption === "Payments" && (
                                <div className="container-fluid mt-3">
                                    <div className="row g-3">
                                        {/* Payments Main Panel */}
                                        <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                            <div className="card border-secondary h-100">
                                                <div
                                                    className="card-header fw-bold"
                                                    style={{ backgroundColor: "#13bfaeff" }}
                                                >
                                                    Payments
                                                </div>
                                                <div className="card-body">
                                                    <div className="form-check mb-2">
                                                        <input
                                                            className="form-check-input"
                                                            style={{ border: "1px solid black" }}
                                                            type="checkbox"
                                                            id="payments-laiser"
                                                            value="Laiser"
                                                            checked={selectedOperation.includes("Laiser")}
                                                            onChange={() => handleCheckboxChange("Laiser")}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="payments-laiser"
                                                        >
                                                            Laiser
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Laiser Section */}
                                        {selectedOperation.includes("Laiser") && (
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                <div className="card border-secondary h-100">
                                                    <div
                                                        className="card-header fw-bold"
                                                        style={{ backgroundColor: "#13bfaeff" }}
                                                    >
                                                        Laiser
                                                    </div>
                                                    <div className="card-body">
                                                        {[
                                                            { label: "Payment Received Entry", name: "PaymentReceivedEntry" },
                                                            { label: "Pay Out Standing", name: "PayOutStanding" },
                                                            { label: "Credit Note", name: "CreditNoteView" },
                                                            { label: "Credit Booking", name: "CreditBooking" },
                                                        ].map((item, i) => (
                                                            <div className="form-check mb-2" key={i}>
                                                                <input
                                                                    className="form-check-input"
                                                                    style={{ border: "1px solid black" }}
                                                                    type="checkbox"
                                                                    name={item.name}
                                                                    checked={formData[item.name]}
                                                                    onChange={handleCheckboxselected}
                                                                    id={`customer-${i}`}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`customer-${i}`}
                                                                >
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}


                            <div style={{ width: "100%" }}>
                                <div className="bottom-buttons">
                                    <button className='ok-btn' onClick={handlesave}>Submit</button>
                                    <button className='ok-btn' onClick={handleUpdate}>Update</button>
                                    <button className='ok-btn' onClick={ResetAll}>Reset</button>
                                </div>
                            </div>
                            <div className='table-container'>
                                <table className='table table-bordered table-sm'>
                                    <thead className='table-info body-bordered table-sm'>
                                        <tr>
                                            <th scope="col">Actions</th>
                                            <th scope="col">ID</th>
                                            <th scope="col">Branch</th>
                                            <th scope="col">User Name</th>
                                            <th scope="col">Password</th>
                                            <th scope="col">Employee Name</th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-body'>
                                        {
                                            getData.map((data, index) => (
                                                < tr key={index} style={{ fontSize: "12px", position: "relative" }}>
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
                                                                    left: "120px",
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
                                                                    setOpenRow(null);
                                                                    setFormData({
                                                                        ID:data?.ID,
                                                                        UserName: data?.UserName || "",
                                                                        Employee_Code: data?.Employee_Code || "",
                                                                        Password: data?.Password || "",
                                                                        City_Code: data?.City_Code || JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
                                                                        UserType: data?.UserType || "User",
                                                                        DocketBooking: !!data?.DocketBooking,
                                                                        DocketPrint: !!data?.DocketPrint,
                                                                        CoshTopayBooking: !!data?.CoshTopayBooking,
                                                                        Smartbooking: !!data?.Smartbooking,
                                                                        AutoMail: !!data?.AutoMail,
                                                                        BulkImportData: !!data?.BulkImportData,
                                                                        VendorBillEntry: !!data?.VendorBillEntry,
                                                                        PendingManifest: !!data?.PendingManifest,
                                                                        OutgoingManifest: !!data?.OutgoingManifest,
                                                                        ViewManifest: !!data?.ViewManifest,
                                                                        BuilkimportManifest: !!data?.BuilkimportManifest,
                                                                        ScanbyDocketNo: !!data?.ScanbyDocketNo,
                                                                        InscanProcessView: !!data?.InscanProcessView,
                                                                        DeliveryPending: !!data?.DeliveryPending,
                                                                        DeliveryBooking: !!data?.DeliveryBooking,
                                                                        DrsView: !!data?.DrsView,
                                                                        Drsimport: !!data?.Drsimport,
                                                                        Statusactivity: !!data?.Statusactivity,
                                                                        StatusactivityimportBulk: !!data?.StatusactivityimportBulk,
                                                                        StatusactivityTracking: !!data?.StatusactivityTracking,
                                                                        DeliveryEntry: !!data?.DeliveryEntry,
                                                                        ReturnEntry: !!data?.ReturnEntry,
                                                                        BulkUploadExcel: !!data?.BulkUploadExcel,
                                                                        DocketPrint1: !!data?.DocketPrint1,
                                                                        Docketprint2: !!data?.Docketprint2,
                                                                        Docketprint3: !!data?.Docketprint3,
                                                                        Docketprint4: !!data?.Docketprint4,
                                                                        LebelPrintin: !!data?.LebelPrintin,
                                                                        StickerPrinting: !!data?.StickerPrinting,
                                                                        InternationalBooking: !!data?.InternationalBooking,
                                                                        ComplaintRegister: !!data?.ComplaintRegister,
                                                                        ViewComplaintStatus: !!data?.ViewComplaintStatus,
                                                                        ComplaintQuery: !!data?.ComplaintQuery,
                                                                        PendingInvoice: !!data?.PendingInvoice,
                                                                        GenerateInvoice: !!data?.GenerateInvoice,
                                                                        ViewInvoice: !!data?.ViewInvoice,
                                                                        InvoiceSummary: !!data?.InvoiceSummary,
                                                                        Docket_Print: !!data?.Docket_Print,
                                                                        PerformanceInvoice: !!data?.PerformanceInvoice,
                                                                        ViewPerformanceInvoice: !!data?.ViewPerformanceInvoice,
                                                                        PaymentReceivedEntry: !!data?.PaymentReceivedEntry,
                                                                        PayOutStanding: !!data?.PayOutStanding,
                                                                        CreditBooking: !!data?.CreditBooking,
                                                                        CreditNoteView: !!data?.CreditNoteView,
                                                                        MISReport: !!data?.MISReport,
                                                                        VendorMISReport: !!data?.VendorMISReport,
                                                                        BookingModeReport: !!data?.BookingModeReport,
                                                                        BookingDetail: !!data?.BookingDetail,
                                                                        TotalChargesReport: !!data?.TotalChargesReport,
                                                                        ModeWiseReport: !!data?.ModeWiseReport,
                                                                        InvoiceLedgerReport: !!data?.InvoiceLedgerReport,
                                                                        ChecklistReport: !!data?.ChecklistReport,
                                                                        UnbuildReport: !!data?.UnbuildReport,
                                                                        BillViewReport: !!data?.BillViewReport,
                                                                    });

                                                                    // ✅ Step 2: Derive `operations` based on which flags are true
                                                                    const operations = [];

                                                                    if (
                                                                        data?.DocketBooking === 1 ||
                                                                        data?.DocketPrint ===1 ||
                                                                        data?.CoshTopayBooking === 1 ||
                                                                        data?.Smartbooking === 1 ||
                                                                        data?.AutoMail === 1 ||
                                                                        data?.BulkImportData === 1
                                                                    ) {
                                                                        operations.push("Booking");
                                                                    }

                                                                    if (
                                                                        data?.PendingManifest === 1 ||
                                                                        data?.OutgoingManifest === 1 ||
                                                                        data?.ViewManifest === 1 ||
                                                                        data?.BuilkimportManifest === 1
                                                                    ) {
                                                                        operations.push("Manifest");
                                                                    }

                                                                    if (
                                                                        data?.ScanbyDocketNo === 1 ||
                                                                        data?.InscanProcessView === 1
                                                                    ) {
                                                                        operations.push("Parcel Scan Data");
                                                                    }

                                                                    if (data?.DrsView === 1 || 
                                                                        data?.Drsimport === 1 ||
                                                                        data?.DeliveryPending===1 ||
                                                                        data?.DeliveryBooking===1) {
                                                                        operations.push("Run Sheet Entry");
                                                                    }

                                                                    if (
                                                                        data?.Statusactivity === 1 ||
                                                                        data?.StatusactivityimportBulk === 1 ||
                                                                        data?.StatusactivityTracking === 1
                                                                    ) {
                                                                        operations.push("Status Activity Entry");
                                                                    }

                                                                    if (
                                                                        data?.DeliveryEntry === 1 ||
                                                                        data?.ReturnEntry === 1 ||
                                                                        data?.BulkUploadExcel === 1
                                                                    ) {
                                                                        operations.push("POD Record Update");
                                                                    }

                                                                    if (
                                                                        data?.DocketPrint1 === 1 ||
                                                                        data?.Docketprint2 === 1 ||
                                                                        data?.Docketprint3 === 1 ||
                                                                        data?.Docketprint4 === 1 ||
                                                                        data?.LebelPrintin === 1 ||
                                                                        data?.StickerPrinting === 1
                                                                    ) {
                                                                        operations.push("Docket Print");
                                                                    }

                                                                    if (
                                                                        data?.InternationalBooking === 1
                                                                    ) {
                                                                        operations.push("International Booking");
                                                                    }

                                                                    if (
                                                                        data?.ComplaintRegister === 1 ||
                                                                        data?.ViewComplaintStatus === 1 ||
                                                                        data?.ComplaintQuery === 1
                                                                    ) {
                                                                        operations.push("Customer Queries");
                                                                    }

                                                                    if (
                                                                        data?.PendingInvoice === 1 ||
                                                                        data?.GenerateInvoice === 1 ||
                                                                        data?.ViewInvoice === 1 ||
                                                                        data?.InvoiceSummary === 1 ||
                                                                        data?.Docket_Print === 1 ||
                                                                        data?.PerformanceInvoice === 1 ||
                                                                        data?.ViewPerformanceInvoice === 1
                                                                    ) {
                                                                        operations.push("Invoice Generate");
                                                                    }

                                                                    if  (data?.PaymentReceivedEntry === 1 ||
                                                                        data?.PayOutStanding===1 ||
                                                                        data?.CreditBooking===1 ||
                                                                        data?.CreditNoteView===1 ) {
                                                                        operations.push("Laiser");
                                                                    }

                                                                    if (data?.MISReport === 1 ||
                                                                        data?.VendorMISReport === 1 ||
                                                                        data?.BookingModeReport===1
                                                                    ) {
                                                                        operations.push("Status Report");
                                                                    }

                                                                    if (
                                                                        data?.TotalChargesReport === 1 ||
                                                                        data?.ModeWiseReport === 1 ||
                                                                        data?.BookingDetail === 1
                                                                    ) {
                                                                        operations.push("Statement Wise Report");
                                                                    }

                                                                    if (data?.InvoiceLedgerReport === 1 ||
                                                                        data?.ChecklistReport === 1 ||
                                                                        data?.UnbuildReport === 1 ||
                                                                        data?.BillViewReport === 1 ) {
                                                                        operations.push("Sales Register Report");
                                                                    }

                                                                    console.log("✅ Operations from API:", operations);
                                                                    setSelectedOperation(operations);
                                                                    setSelectedOption("Operation");

                                                                }
                                                                }>
                                                                    <i className='bi bi-pen'></i>
                                                                </button>
                                                                <button onClick={() => {
                                                                    setOpenRow(null);
                                                                    handleDelete(data?.ID);
                                                                }} className='edit-btn'><i className='bi bi-trash'></i></button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{data?.ID}</td>
                                                    <td>{data?.City_Name}</td>
                                                    <td>{data?.UserName}</td>
                                                    <td>{data?.Password}</td>
                                                    <td>{data?.Employee_Name}</td>

                                                </tr>))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </form>
                </div >
                <Footer />
            </div >

        </>
    )
}

export default UserAdmin;
