import React, { useEffect, useState } from "react";
import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";

import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'react-toggle/style.css';


function ImportDrs() {
    const today = new Date();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [getVendor, setGetVendor] = useState([]);
    const [formData, setFormData] = useState({
        toDate: today,
    });
    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            setData(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchData('/Master/getVendor', setGetVendor);
    }, []);
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    return (
        <>

            <div className="container1">
                <form action="">
                    <div className="fields2">
                        <div className="input-field3">
                            <label htmlFor="">Date</label>
                            <DatePicker
                                selected={formData.toDate}
                                onChange={(date) => handleDateChange(date, "toDate")}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                            />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Delivery Agent</label>
                            <Select
                                options={getVendor.map(vendor => ({
                                    value: vendor.Vendor_Code,   // adjust keys from your API
                                    label: vendor.Vendor_Name
                                }))}
                                value={
                                    formData.vendorCode
                                        ? { value: formData.vendorCode, label: getVendor.find(c => c.Vendor_Code === formData.vendorCode)?.Vendor_Name || "" }
                                        : null
                                }
                                onChange={(selectedOption) =>
                                    setFormData({
                                        ...formData,
                                        vendorCode: selectedOption ? selectedOption.value : ""
                                    })
                                }
                                placeholder="Select Delivary Agent"
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
                            <label htmlFor="">Mobile No</label>
                            <input type="tel" maxLength="10" id="mobile"
                                name="mobile" pattern="[0-9]{10}" placeholder="Enter Mobile no" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Vehicle No</label>
                            <input type="text" placeholder="Enter Vehicle No" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Area</label>
                            <input type="text" placeholder="Enter Area" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Import</label>
                            <input style={{ paddingTop: "6px" }} type="file" placeholder="Select a file" />
                        </div>

                        <div className="input-field3" style={{width:"80px",marginTop:"8px"}}>
                            <button type="submit" className="generate-btn ok-btn" style={{fontSize:"15px",width:"100%"}}>Upload</button>
                        </div>

                       <div style={{ display: "flex", flexDirection: "row", marginTop: "18px" ,marginLeft:"15px",justifyContent:"center",alignItems:"center",gap:"18px",width:"150px"}}>
                                <button type="submit" className="ok-btn" style={{ width: "60%"}}>Download</button>
                                <button type="button" className="ok-btn" style={{ width: "40%"}}>Error</button>
                            </div>
                    </div>


                </form>
            </div>
        </>
    );
};

export default ImportDrs;