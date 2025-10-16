import React, { useEffect, useState } from "react";


import { getApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
function ProductionEntry() {
     const extrectArray = (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.Data)) return response.Data;
        return [];
    }
    const [formData, setFormData] = useState({
        date: new Date(),
        customer: "",
        noteNo: "",
        parti: "",
        remark: "",
        amount: 0,

    })
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [getCustomer, setGetCustomer] = useState([]);
    const handleReset = () => {
        setFormData({
            date: new Date(),
            customer: "",
            noteNo: "",
            parti: "",
            remark: "",
            amount: 0,

        })
    };
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
    }, []);
    const handleFormChange = (e) => {
        const { name, value } = e.target; // get field name and value
        setFormData({
            ...formData,
            [name]: value, // update only the changed field
        });
    }
    return (
        <>
            <div className="body">
                <div className="container1">
                    <form action="" style={{ margin: "0px", padding: "0px" }}>
                        <div className="fields2">
                            <div className="input-field3">
                                <label htmlFor="">Note No</label>
                                <input type="text" placeholder="Enter note no" name="noteNo"
                                    value={formData.noteNo} onChange={handleFormChange} />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.date}
                                    onChange={(date) => setFormData({ ...formData, date: date })}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field">
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
                                <label htmlFor="">Particulars</label>
                                <input type="text" placeholder="Enter particulars" name="parti"
                                    value={formData.parti} onChange={handleFormChange} />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Remark</label>
                                <input type="text" placeholder="Enter remark" name="remark"
                                    value={formData.remark} onChange={handleFormChange} />
                            </div>
                            <div className="input-field3">
                                <label htmlFor="">Amount</label>
                                <input type="text" placeholder="Enter amount" name="amount"
                                    value={formData.amount} onChange={handleFormChange} />
                            </div>
                        </div>
                    </form>

                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                        <div className="bottom-buttons" >
                            <button className="ok-btn">Save</button>
                        </div>
                        <div className="bottom-buttons">
                            <button className="ok-btn">Update</button>
                        </div>
                        <div className="bottom-buttons">
                            <button className="ok-btn">Delete</button>
                        </div>
                        <div className="bottom-buttons">
                            <button className="ok-btn" onClick={handleReset}>Cancle</button>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                            <thead className="table-head">
                                <tr>
                                    <th>SR No</th>
                                    <th>Product Name</th>
                                    <th>HSN Code</th>
                                    <th>Currency</th>
                                    <th>Rate</th>
                                    <th>Quantity</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>

                    </div>

                </div>

            </div>

        </>
    );
};

export default ProductionEntry;