import React, { useState, useEffect } from "react";
import { getApi, postApi, putApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
function GenerateInvoice() {
    const extrectArray = (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.Data)) return response.Data;
        return [];
    }
    const onToggle = () => setToggleActive(!toggleActive);
    const handleFormChange = (value, key) => {
        setFormData({ ...formData, [key]: value })
    }
    const [toggleActive, setToggleActive] = useState(false);
    const [getCustomer, setGetCustomer] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [getBranch, setGetBranch] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        branch: "",
        BookMode: "Monthly",
        customerType: "",
        fromDate: firstDayOfMonth,
        toDate: today,
        invoiceDate: today,
        BillParty: "Client-wise Bill",
        customer: "",
        mode: "",
        invoiceNo: ""
    });
    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            console.log("API Response for", endpoint, response);  // 👀 Check here
            setData(extrectArray(response));
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const response = await getApi(`/Master/getBranch?Branch_Code=${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}`);
                if (response.status === 1) {
                    console.log(response.Data);
                    setGetBranch(response.Data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchData('/Master/getCustomerdata', setGetCustomer);
        fetchData('/Master/getMode', setGetMode);
        fetchBranch();
    }, []);
    const handlePreview = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ActionType: "Preview",                 // always preview here
                Branch_Code: formData.branch || null,  // from formData
                BillingCycle: formData.BookMode || null,
                FromDate: formData.fromDate || null,
                ToDate: formData.toDate || null,
                InvoiceDate: formData.invoiceDate || null,
                CustomerType: formData.customerType || null,
                GroupValue: String(formData.customer) || null,
                Mode_Code: formData.mode || null,
            };
            console.log(payload);
            const response = await putApi("/Smart/InvoiceGenerate",
                payload
            );
            console.log(response);
            if (response.status === 1) {
                setPreviewData(response.previewData);
                Swal.fire("Preview Ready", response.message, "success");
            } else {
                Swal.fire("Failed", response.message, "warning");
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };
    const handleGenerate = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ActionType: "Generate",                 // always preview here
                Branch_Code: formData.branch || null,  // from formData
                BillingCycle: formData.BookMode || null,
                FromDate: formData.fromDate?.toISOString().split("T")[0] || null,
                ToDate: formData.toDate?.toISOString().split("T")[0] || null,
                InvoiceDate: formData.invoiceDate?.toISOString().split("T")[0] || null,
                CustomerType: formData.customerType || null,
                GroupValue: String(formData.customer) || null,
                Mode_Code: formData.mode || null,
            };
            console.log(payload);
            const response = await putApi("/Smart/InvoiceGenerate",
                payload
            );
            console.log(response);
            if (response.status === 1) {
                Swal.fire("Generated", response.message, "success");
            } else {
                Swal.fire("Failed", response.message, "warning");
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };


    return (
        <>
            <div className="body">
                <div className="container1">
                    <form action="" style={{ margin: "0px", padding: "0px" }}>
                        <div className="fields2">

                            <div className="input-field3">
                                <label htmlFor="">Branch Name</label>
                                <Select
                                    options={getBranch.map(branch => ({
                                        value: branch.Branch_Code,   // adjust keys from your API
                                        label: branch.Branch_Name
                                    }))}
                                    value={
                                        formData.branch
                                            ? {
                                                value: formData.branch,
                                                label: getBranch.find(c => c.Branch_Code === formData.branch)?.Branch_Name
                                            }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            branch: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Branch"
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

                            <div className="input-field3">
                                <label>Billing Type</label>
                                <select value={formData.BillParty} onChange={(e) => setFormData({ ...formData, BillParty: e.target.value })}>
                                    <option value="" disabled>Select Billing Type</option>
                                    <option value="Client-wise Bill">Client-wise Bill</option>
                                    <option value="Shipper-wise Bill">Shipper-wise Bill</option>
                                    <option value="Vendor-wise Bill">Vendor-wise Bill</option>
                                    <option value="Product-wise Bill">Product-wise Bill</option>
                                    <option value="Consignee-wise Bill">Consignee-wise Bill</option>

                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Customer Type</label>
                                <select value={formData.customerType} onChange={(e) => handleFormChange(e.target.value, "customerType")}>
                                    <option value="" disabled>Select Customer</option>
                                    <option value="All">All</option>
                                    <option value="Single">Single</option>
                                </select>
                            </div>
                            <div className="input-field3" style={{
                                flex: 1,
                                minWidth: "240px", // ✅ keep a good size on desktop
                                width: "100%",
                                marginRight:"1.5rem"// ✅ default full width
                            }}>
                                <label htmlFor="">Customer</label>
                                <Select
                                    options={getCustomer.map(cust => ({
                                        value: cust.Customer_Code,   // adjust keys from your API
                                        label: cust.Customer_Name
                                    }))}
                                    value={
                                        formData.customer
                                            ? {
                                                value: formData.customer,
                                                label: getCustomer.find(c => c.Customer_Code === formData.customer)?.Customer_Name
                                            }
                                            : null
                                    }

                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            customer: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                                    styles={{
                                        container: (base) => ({
                                            ...base,
                                            width: "100%", // ✅ full width always
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }),
                                        menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                                    }}
                                    placeholder="Select Customer"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                />

                            </div>

                            <div className="input-field3">
                                <label htmlFor="">From Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.fromDate}
                                    onChange={(date) => handleFormChange(date, "fromDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">To Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.toDate}
                                    onChange={(date) => handleFormChange(date, "toDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Invoice Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.invoiceDate}
                                    onChange={(date) => handleFormChange(date, "invoiceDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Booking Mode</label>
                                <select value={formData.BookMode} onChange={(e) => setFormData({ ...formData, BookMode: e.target.value })}>
                                    <option value="" disabled>Select Booking Mode</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Half Yearly">Half Yearly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>



                            <div className="input-field3">
                                <label htmlFor="">Mode</label>
                                <Select
                                    options={getMode.map(mode => ({
                                        value: mode.Mode_Code,   // adjust keys from your API
                                        label: mode.Mode_Name
                                    }))}
                                    value={
                                        formData.mode
                                            ? { value: formData.mode, label: getMode.find(c => c.Mode_Code === formData.mode)?.Mode_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            mode: selectedOption ? selectedOption.value : ""
                                        })
                                    }
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
                                    placeholder="Select Mode"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                />

                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Invoice No</label>
                                <input type="text"
                                    placeholder={toggleActive ? "Invoice No" : ""}
                                    disabled={!toggleActive}
                                    value={formData.invoiceNo} onChange={(e) => handleFormChange(e.target.value, "invoiceNo")} />
                            </div>
                            <div className="toggle-button">
                                <Toggle
                                    onClick={onToggle}
                                    on={<h2>ON</h2>}
                                    off={<h2>OFF</h2>}
                                    offstyle="danger"
                                    active={toggleActive}
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="" style={{ marginTop: "18px" }}></label>
                                <button className="ok-btn" style={{ height: "35px", width: "50px" }}><i className="bi bi-layout-text-sidebar"></i></button>
                            </div>

                            <div className="input-field3 px-0" style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "0px", marginTop: "18px" }}>
                                <div className="bottom-buttons" style={{}}>
                                    <button className="ok-btn m-0" onClick={handleGenerate}>Generate</button>
                                </div>
                                <div className="bottom-buttons" style={{}}>
                                    <button className="ok-btn m-0" onClick={handlePreview}>Preview</button>
                                </div>
                            </div>

                        </div>
                    </form>
                    {previewData.length > 0 && (<div className="table-container" style={{ margin: "0px" }}>
                        <table className="table table-bordered table-sm" style={{ whiteSpace: "nowrap" }}>
                            <thead className="table-info table-sm">
                                <tr>
                                    <th>Customer Code</th>
                                    <th>Customer Name</th>
                                    <th>Book Date</th>
                                    <th>Branch Name</th>
                                    <th>Mode Name</th>
                                    <th>Bill No</th>
                                    <th>Bill Generate</th>
                                    <th>Docket No</th>
                                    <th>Qty</th>
                                    <th>Actual Wt</th>
                                    <th>Charged Wt</th>
                                    <th>Rate Per Kg</th>
                                    <th>Rate</th>
                                    <th>Docket Chrgs</th>
                                    <th>IGST %</th>
                                    <th>IGST Amt</th>
                                    <th>CGST %</th>
                                    <th>CGST Amt</th>
                                    <th>SGST %</th>
                                    <th>SGST Amt</th>
                                    <th>City Name</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {previewData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>{row.Customer_Code}</td>
                                        <td>{row.Customer_Name}</td>
                                        <td>{row.BookDate}</td>
                                        <td>{row.Branch_Name}</td>
                                        <td>{row.Mode_Name}</td>
                                        <td>{row.BillNo}</td>
                                        <td>{row.BillGenerate ? "Yes" : "No"}</td>
                                        <td>{row.DocketNo}</td>
                                        <td>{row.Qty}</td>
                                        <td>{row.ActualWt}</td>
                                        <td>{row.ChargedWt}</td>
                                        <td>{row.RatePerkg}</td>
                                        <td>{row.Rate}</td>
                                        <td>{row.DocketChrgs}</td>
                                        <td>{row.IGSTPer}</td>
                                        <td>{row.IGSTAMT}</td>
                                        <td>{row.CGSTPer}</td>
                                        <td>{row.CGSTAMT}</td>
                                        <td>{row.SGSTPer}</td>
                                        <td>{row.SGSTAMT}</td>
                                        <td>{row.City_Name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>)}

                </div >
            </div >
        </>
    );
};

export default GenerateInvoice;