import React, { useState, useEffect } from "react";
import { getApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
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
    const [getCity, setGetCity] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        branch: "",
        type: "",
        customerType: "",
        fromDate: firstDayOfMonth,
        toDate: today,
        invoiceDate: today,
        billingType: "",
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
        fetchData('/Master/getCustomerdata', setGetCustomer);
        fetchData('/Master/getdomestic', setGetCity);
        fetchData('/Master/getMode', setGetMode);
    }, []);


    return (
        <>
            <div className="body">
                <div className="container1">
                    <form action="">
                        <div className="fields2">

                            <div className="input-field3">
                                <label htmlFor="">Branch Name</label>
                                <Select
                                    options={getCity.map(city => ({
                                        value: city.City_Code,   // adjust keys from your API
                                        label: city.City_Name
                                    }))}
                                    value={
                                        formData.branch
                                            ? {
                                                value: formData.branch,
                                                label: getCity.find(c => c.City_Code === formData.branch)?.City_Name
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
                                <label htmlFor="">Type</label>
                                <select value={formData.type} onChange={(e) => handleFormChange(e.target.value, "type")}>
                                    <option value="" disabled>Select Type</option>
                                    <option value="Client Wise">Client Wise</option>
                                    <option value="Shipper Wise">Shipper Wise</option>
                                    <option value="Receiver Wise">Receiver Wise</option>
                                    <option value="Alarm No Wise">Alarm No Wise</option>
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
                            <div className="input-field3 flex-fill" style={{ flex: "1 1 300px", minWidth: "240px", maxWidth: "100%" }}>
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
                                <label htmlFor="">Billing Type</label>
                                <select value={formData.billingType} onChange={(e) => handleFormChange(e.target.value, "billingType")}>
                                    <option value="" disabled>Billing Type</option>
                                    <option value="Client">Client</option>
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

                            <div className="bottom-buttons input-field3" style={{}}>
                                <button className="ok-btn">Submit</button>
                            </div>
                        </div>
                    </form>
                </div >
            </div >
        </>
    );
};

export default GenerateInvoice;