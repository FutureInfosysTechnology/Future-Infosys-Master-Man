import React, { useState, useEffect } from 'react'
import Footer from '../../Components-2/Footer';
import Sidebar1 from '../../Components-2/Sidebar1';
import Header from '../../Components-2/Header/Header';
import { postApi, getApi, putApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import Swal from 'sweetalert2';


function UserAdmin() {

    const [getEmployee, setGetEmployee] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedOperation, setSelectedOperation] = useState("");
    const [formData, setFormData] = useState({
        UserName: "",
        Employee_Code: "",
        Password: "",
        DailyBooking: false,
        DailyExpenses: false,
        automail: false,
        ShortEntry: false,
        BulkImportData: false,
        VendorBillEntry: false,
        BuildManifest: false,
        ForwardingManifest: false,
        BuilkimportManifest: false,
        Inscan: false,
        Runsheet: false,
        DrsImport: false,
        Statusactivity: false,
        BulkuplaodStatus: false,
        Podentry: false,
        BuilkdataDelivered: false,
        Custquery: false,
        Docketprint: false,
        Docketprint2: false,
        Docketprint3: false,
        LebelPrintin: false,
        StickerPrinting: false,
        Invoice: false,
        ParfarmaInvoice: false,
        Laiser: false,
        CreditNote: false,
        StatusReport: false,
        Statement: false,
        Checklist: false,
        ModeWise: false,
        SalesRegister: false,
    });
    useEffect(() => {
        console.log(formData);
    }, [formData])
    const fetchEmpData = async () => {
        try {
            const response = await getApi('/Master/GetEmployee');
            setGetEmployee(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
        }
    };
    useEffect(() => {
        fetchEmpData();
    }, []);


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
    const ResetAll=(e)=>
    {
        e.preventDefault();
         setFormData({
                    UserName: "",
                    Employee_Code: "",
                    Password: "",
                    DailyBooking: false,
                    DailyExpenses: false,
                    automail: false,
                    ShortEntry: false,
                    BulkImportData: false,
                    VendorBillEntry: false,
                    BuildManifest: false,
                    ForwardingManifest: false,
                    BuilkimportManifest: false,
                    Inscan: false,
                    Runsheet: false,
                    DrsImport: false,
                    Statusactivity: false,
                    BulkuplaodStatus: false,
                    Podentry: false,
                    BuilkdataDelivered: false,
                    Custquery: false,
                    Docketprint: false,
                    Docketprint2: false,
                    Docketprint3: false,
                    LebelPrintin: false,
                    StickerPrinting: false,
                    Invoice: false,
                    ParfarmaInvoice: false,
                    Laiser: false,
                    CreditNote: false,
                    StatusReport: false,
                    Statement: false,
                    Checklist: false,
                    ModeWise: false,
                    SalesRegister: false,
                });
                setSelectedOperation('');
                setSelectedOption('');
    }
    const handlesave = async (e) => {
        e.preventDefault();

        const requestBody = {
            UserName: formData.UserName,
            Employee_Code: formData.Employee_Code,
            Password: formData.Password,
            City_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
            UserType: "User",

            DailyBooking: formData.DailyBooking ? 1 : 0,
            DailyExpenses: formData.DailyExpenses ? 1 : 0,
            ShortEntry: formData.ShortEntry ? 1 : 0,
            BulkImportData: formData.BulkImportData ? 1 : 0,
            VendorBillEntry: formData.VendorBillEntry ? 1 : 0,
            AutoMail: formData.automail ? 1 : 0,
            BuildManifest: selectedOperation.includes("Manifest") ? 1 : 0,
            ForwardingManifest: formData.ForwardingManifest ? 1 : 0,
            BuilkimportManifest: formData.BuilkimportManifest ? 1 : 0,
            Inscan: selectedOperation.includes("Parcel Scan Data") ? 1 : 0,
            Runsheet: selectedOperation.includes("Run Sheet Entry") ? 1 : 0,
            DrsImport: formData.DrsImport ? 1 : 0,
            Statusactivity: selectedOperation.includes("Status Activity Entry") ? 1 : 0,
            BulkuplaodStatus: formData.BulkuplaodStatus ? 1 : 0,
            Podentry: formData.Podentry ? 1 : 0,
            BuilkdataDelivered: formData.BuilkdataDelivered ? 1 : 0,
            Custquery: selectedOperation.includes("Customer Queries") ? 1 : 0,
            Docketprint: formData.Docketprint ? 1 : 0,
            Docketprint2: formData.Docketprint2 ? 1 : 0,
            Docketprint3: formData.Docketprint3 ? 1 : 0,
            LebelPrintin: formData.LebelPrintin ? 1 : 0,
            StickerPrinting: formData.StickerPrinting ? 1 : 0,
            Invoice: selectedOperation.includes("Invoice Generate") ? 1 : 0,
            ParfarmaInvoice: formData.ParfarmaInvoice ? 1 : 0,
            Laiser: selectedOperation.includes("Laiser") ? 1 : 0,
            CreditNote: formData.CreditNote ? 1 : 0,
            StatusReport: selectedOperation.includes("Status Report") ? 1 : 0,
            Statement: formData.Statement ? 1 : 0,
            Checklist: formData.Checklist ? 1 : 0,
            ModeWise: formData.ModeWise ? 1 : 0,
            SalesRegister: selectedOperation.includes("Sales Register Report") ? 1 : 0,
            BranchAdmin: 0,
            CustomerComplain: selectedOperation.includes("Customer Queries") ? 1 : 0,
        };


        try {
            const response = await postApi('/Master/addOperationManagement', requestBody, 'POST');
            if (response.status === 1) {
                ResetAll();
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
            }
        } catch (error) {
            console.error('Unable to add Admin:', error);
        }
    }
    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            UserName: formData.UserName,
            Employee_Code: formData.Employee_Code,
            Password: formData.Password,
            City_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
            UserType: "User",

            DailyBooking: formData.DailyBooking ? 1 : 0,
            DailyExpenses: formData.DailyExpenses ? 1 : 0,
            ShortEntry: formData.ShortEntry ? 1 : 0,
            BulkImportData: formData.BulkImportData ? 1 : 0,
            VendorBillEntry: formData.VendorBillEntry ? 1 : 0,
            AutoMail: formData.automail ? 1 : 0,
            BuildManifest: selectedOperation.includes("Manifest") ? 1 : 0,
            ForwardingManifest: formData.ForwardingManifest ? 1 : 0,
            BuilkimportManifest: formData.BuilkimportManifest ? 1 : 0,
            Inscan: selectedOperation.includes("Parcel Scan Data") ? 1 : 0,
            Runsheet: selectedOperation.includes("Run Sheet Entry") ? 1 : 0,
            DrsImport: formData.DrsImport ? 1 : 0,
            Statusactivity: selectedOperation.includes("Status Activity Entry") ? 1 : 0,
            BulkuplaodStatus: formData.BulkuplaodStatus ? 1 : 0,
            Podentry: formData.Podentry ? 1 : 0,
            BuilkdataDelivered: formData.BuilkdataDelivered ? 1 : 0,
            Custquery: selectedOperation.includes("Customer Queries") ? 1 : 0,
            Docketprint: formData.Docketprint ? 1 : 0,
            Docketprint2: formData.Docketprint2 ? 1 : 0,
            Docketprint3: formData.Docketprint3 ? 1 : 0,
            LebelPrintin: formData.LebelPrintin ? 1 : 0,
            StickerPrinting: formData.StickerPrinting ? 1 : 0,
            Invoice: selectedOperation.includes("Invoice Generate") ? 1 : 0,
            ParfarmaInvoice: formData.ParfarmaInvoice ? 1 : 0,
            Laiser: selectedOperation.includes("Laiser") ? 1 : 0,
            CreditNote: formData.CreditNote ? 1 : 0,
            StatusReport: selectedOperation.includes("Status Report") ? 1 : 0,
            Statement: formData.Statement ? 1 : 0,
            Checklist: formData.Checklist ? 1 : 0,
            ModeWise: formData.ModeWise ? 1 : 0,
            SalesRegister: selectedOperation.includes("Sales Register Report") ? 1 : 0,
            BranchAdmin: 0,
            CustomerComplain: selectedOperation.includes("Customer Queries") ? 1 : 0,
        };


        try {
            const response = await putApi('UpdateOperationManagement', requestBody, 'PUT');
            if (response.status === 1) {
                ResetAll();
                Swal.fire('Saved!', response.message || 'Your changes have been Updated.', 'success');
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
                <div className="container">
                    <form action="" className="order-form" onSubmit={handlesave}>
                        <div className="order-fields">
                            <div className="order-input">
                                <label htmlFor="">User Name</label>
                                <input type="text" placeholder='UserName' value={formData.UserName}
                                    onChange={(e) => setFormData({ ...formData, UserName: e.target.value })} />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Password</label>
                                <input type="password" placeholder='Password' value={formData.Password}
                                    onChange={(e) => setFormData({ ...formData, Password: e.target.value })} />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Employee Name</label>
                                <select value={formData.Employee_Code}
                                    onChange={(e) => setFormData({ ...formData, Employee_Code: e.target.value })}>
                                    <option value="" disabled>Select Employee</option>
                                    {getEmployee.map((emp, index) => (
                                        <option value={emp.Employee_Code} key={index}>{emp.Employee_Name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='production-header'>
                            <div className="production-radio">

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <input type="radio" id='operation' name='section' value="Operation"
                                        checked={selectedOption === "Operation"}
                                        onChange={() => handleRadioChange("Operation")} />
                                    <label htmlFor="operation">Operation</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <input type="radio" id="crm" name="section" value="CRM"
                                        checked={selectedOption === "CRM"}
                                        onChange={() => handleRadioChange("CRM")} />
                                    <label htmlFor="crm">Customer Complaint</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <input type="radio" id="billings" name="section" value="Billings"
                                        checked={selectedOption === "Billings"}
                                        onChange={() => handleRadioChange("Billings")} />
                                    <label htmlFor="billings">Billings</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <input type="radio" id="payments" name="section" value="Payments"
                                        checked={selectedOption === "Payments"}
                                        onChange={() => handleRadioChange("Payments")} />
                                    <label htmlFor="payments">Payments</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", marginRight: "20px" }}>
                                    <input type="radio" id="reports" name="section" value="Reports"
                                        checked={selectedOption === "Reports"}
                                        onChange={() => handleRadioChange("Reports")} />
                                    <label htmlFor="reports">Reports</label>
                                </div>
                            </div>
                        </div>



                        {selectedOption === "Operation" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px", flexWrap: "wrap" }}>
                                <div style={{ width: "200px", border: "1px solid silver", borderRadius: "5px", marginBottom: "10px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="">Operation</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Booking" checked={selectedOperation.includes("Booking")}
                                                onChange={() => handleCheckboxChange("Booking")} />
                                            <label htmlFor="booking" style={{ marginLeft: "10px" }}>Booking</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Manifest" checked={selectedOperation.includes("Manifest")}
                                                onChange={() => handleCheckboxChange("Manifest")} />
                                            <label htmlFor="manifest" style={{ marginLeft: "10px" }}>Manifest</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Parcel Scan Data" checked={selectedOperation.includes("Parcel Scan Data")}
                                                onChange={() => handleCheckboxChange("Parcel Scan Data")} />
                                            <label htmlFor="dispatch" style={{ marginLeft: "10px" }}>Parcel Scan Data</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Run Sheet Entry" checked={selectedOperation.includes("Run Sheet Entry")}
                                                onChange={() => handleCheckboxChange("Run Sheet Entry")} />
                                            <label htmlFor="trip-sheet" style={{ marginLeft: "10px" }}>Run Sheet Entry</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Status Activity Entry" checked={selectedOperation.includes("Status Activity Entry")}
                                                onChange={() => handleCheckboxChange("Status Activity Entry")} />
                                            <label htmlFor="inscan" style={{ marginLeft: "10px" }}>Status Activity Entry</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="POD Record Update" checked={selectedOperation.includes("POD Record Update")}
                                                onChange={() => handleCheckboxChange("POD Record Update")} />
                                            <label htmlFor="pod-update" style={{ marginLeft: "10px" }}>POD Record Update</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Docket Print" checked={selectedOperation.includes("Docket Print")}
                                                onChange={() => handleCheckboxChange("Docket Print")} />
                                            <label htmlFor="pod" style={{ marginLeft: "10px" }}>Docket Print</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Booking") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "260px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Booking</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.DailyBooking} name='DailyBooking'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Daily Booking</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.DailyExpenses} name='DailyExpenses'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Daily Expenses</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.automail} name='automail'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Auto Mail</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.ShortEntry} name='ShortEntry'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Short Entry</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.BulkImportData} name='BulkImportData'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Bulk Import Data</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.VendorBillEntry} name='VendorBillEntry'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vendor Bill Entry</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Manifest") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "230px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Manifest</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Pending Manifest</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.BuildManifest} name='BuildManifest'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Create Manifest</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>View Manifest</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.ForwardingManifest} name='ForwardingManifest'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Forwarding Manifest</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.BuilkimportManifest} name='BuilkimportManifest'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Bulk Import Manifest</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Parcel Scan Data") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "120px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Parcel Scan Data</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Scan By AirwayBill No</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Scan By Manifest No</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Run Sheet Entry") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Run Sheet Entry</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Pending DRS</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.Runsheet} name='Runsheet'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Create DRS</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>View DRS</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.DrsImport} name='DrsImport'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Import DRS</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Status Activity Entry") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "150px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Status Activity Entry</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Activity Entry</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Excel Import</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Activity Tracking</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("POD Record Update") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "150px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">POD Record Update</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.BuilkdataDelivered} name='BuilkdataDelivered'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Delivered</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.Podentry} name='Podentry'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>UnDelivered</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.BulkuplaodStatus} name='BulkuplaodStatus'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Bulk Upload(Excel)</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Docket Print") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "200px", height: "215px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Docket Print</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.Docketprint} name='Docketprint'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Docket Print</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.Docketprint2} name='Docketprint2'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Docket Print2</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.Docketprint3} name='Docketprint3'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Docket Print3</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.LebelPrintin} name='LebelPrintin'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Lebel Printing</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.StickerPrinting} name='StickerPrinting'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Sticker Printing</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedOption === "CRM" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px" }}>
                                <div style={{ width: "220px", border: "1px solid silver", borderRadius: "5px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="">Customer Complaint</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Customer Queries" checked={selectedOperation.includes("Customer Queries")}
                                                onChange={() => handleCheckboxChange("Customer Queries")} />
                                            <label htmlFor="booking" style={{ marginLeft: "10px" }}>Customer Queries</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Customer Queries") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "160px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Customer Queries</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Complaint</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>View Complaint Status</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Querry</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedOption === "Reports" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px" }}>
                                <div style={{ width: "220px", border: "1px solid silver", borderRadius: "5px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="">Reports</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Status Report" checked={selectedOperation.includes("Status Report")}
                                                onChange={() => handleCheckboxChange("Status Report")} />
                                            <label htmlFor="booking" style={{ marginLeft: "10px" }}>Status Report</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Statement Wise Report" checked={selectedOperation.includes("Statement Wise Report")}
                                                onChange={() => handleCheckboxChange("Statement Wise Report")} />
                                            <label htmlFor="manifest" style={{ marginLeft: "10px" }}>Statement Wise Report</label>
                                        </div>

                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Sales Register Report" checked={selectedOperation.includes("Sales Register Report")}
                                                onChange={() => handleCheckboxChange("Sales Register Report")} />
                                            <label htmlFor="dispatch" style={{ marginLeft: "10px" }}>Sales Register Report</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Status Report") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "160px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Status Report</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Customer Wise Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vendor Wise Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Vehicle Wise Report</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Statement Wise Report") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "160px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Statement Wise Report</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.Statement} name='Statement'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Statement Wise Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.Checklist} name='Checklist'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Checklist Wise Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.ModeWise} name='ModeWise'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Mode Wise Report</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOperation.includes("Sales Register Report") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Sales Register Report</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Sales Register Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Checklist Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Unbuild Report</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Bill View Report</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedOption === "Billings" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px" }}>
                                <div style={{ width: "220px", border: "1px solid silver", borderRadius: "5px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="">Billings</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Invoice Generate" checked={selectedOperation.includes("Invoice Generate")}
                                                onChange={() => handleCheckboxChange("Invoice Generate")} />
                                            <label htmlFor="booking" style={{ marginLeft: "10px" }}>Invoice Generate</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Invoice Generate") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "180px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Invoice Generate</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Generate Invoice</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.Invoice} name='Invoice'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>View Invoice</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Pending Invoice</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.ParfarmaInvoice} name='ParfarmaInvoice'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Performance Invoice</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedOption === "Payments" && (
                            <div style={{ display: "flex", flexDirection: "row", paddingTop: "20px" }}>
                                <div style={{ width: "220px", border: "1px solid silver", borderRadius: "5px" }}>
                                    <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                        <label htmlFor="">Payments</label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "5px" }}>
                                            <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                value="Laiser" checked={selectedOperation.includes("Laiser")}
                                                onChange={() => handleCheckboxChange("Laiser")} />
                                            <label htmlFor="booking" style={{ marginLeft: "10px" }}>Laiser</label>
                                        </div>
                                    </div>

                                </div>

                                {selectedOperation.includes("Laiser") && (
                                    <div style={{ marginLeft: "20px", border: "1px solid silver", borderRadius: "5px", width: "220px", height: "160px" }}>
                                        <div className='header-tittle' style={{ borderRadius: "5px" }}>
                                            <label htmlFor="">Laiser</label>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.Laiser} name='Laiser'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Payment Received Entry</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Pay Out Standing</label>
                                            </div>

                                            <div style={{ margin: "5px" }}>
                                                <input type="checkbox" style={{ marginLeft: "10px", transform: "scale(1.2)" }}
                                                    checked={formData.CreditNote} name='CreditNote'
                                                    onChange={handleCheckboxselected} />
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>Credit Note</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ width: "100%" }}>
                            <div className="bottom-buttons">
                                <button className='ok-btn' onClick={handlesave}>Submit</button>
                                <button className='ok-btn' onClick={handleUpdate}>Update</button>
                                <button className='ok-btn' onClick={ResetAll}>Reset</button>
                            </div>
                        </div>
                    </form>
                </div>
                <Footer />
            </div>

        </>
    )
}

export default UserAdmin;