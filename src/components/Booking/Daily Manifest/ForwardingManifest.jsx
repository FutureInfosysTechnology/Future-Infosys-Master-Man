import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import Select from 'react-select';
import 'react-toggle/style.css';
function ForwardingManifest() {
    const [getVendor, setGetVendor] = useState([]);
    const [getCity, setGetCity] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        maniDate: new Date(),
        fromDest: '',
        toDest: '',
        mode: '',
        vendorCode: '',
    });
    const handleDateChange = (date, key) => {
        setFormData({ ...formData, [key]: date })
    }
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
        fetchData('/Master/getMode', setGetMode);
        fetchData('/Master/getVendor', setGetVendor);
        fetchData('/Master/getdomestic', setGetCity);
    }, []);

    return (
        <>
            <div className="body">
                <div className="container1">
                    <div className="production-header">
                        <div className="production-radio">
                            <div className="order-no">
                                <input type="radio" name="supplier" id="supplier" />
                                <label htmlFor="order">Manifest</label>
                            </div>

                            <div className="order-no">
                                <input type="radio" name="supplier" id="supplier" />
                                <label htmlFor="">Forwarding</label>
                            </div>
                        </div>
                    </div>

                    <form action="">
                        <div className="fields2">
                            <div className="input-field3">
                                <label htmlFor="">Manifest Date</label>
                                <DatePicker
                                    selected={formData.maniDate}
                                    onChange={(date) => handleDateChange(date, "maniDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
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
                                <label htmlFor="">From Location</label>
                                <Select
                                    options={getCity.map(city => ({
                                        value: city.City_Code,   // adjust keys from your API
                                        label: city.City_Name
                                    }))}
                                    value={
                                        formData.fromDest
                                            ? { value: formData.fromDest, label: getCity.find(c => c.City_Code === formData.fromDest)?.City_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) => {
                                        console.log(selectedOption);
                                        setFormData({
                                            ...formData,
                                            fromDest: selectedOption ? selectedOption.value : ""
                                        })
                                    }}
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
                                    placeholder="Select Location"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Destination</label>
                                <Select
                                    options={getCity.map(city => ({
                                        value: city.City_Code,   // adjust keys from your API
                                        label: city.City_Name
                                    }))}
                                    value={
                                        formData.toDest
                                            ? { value: formData.toDest, label: getCity.find(c => c.City_Code === formData.toDest)?.City_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            toDest: selectedOption ? selectedOption.value : ""
                                        })}
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
                                    placeholder="Select Destination"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Vendor Name</label>
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
                                    placeholder="Vendor Name"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Vendor Docket No</label>
                                <input type="tel" placeholder="Vendor Docket No" />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Import</label>
                                <input type="file" placeholder="choose file" style={{ paddingTop: "5px" }} />
                            </div>

                            <div className="bottom-buttons" style={{ marginTop: "18px" }}>
                                <button className="generate-btn" style={{ fontSize: "12px" }}>Download Sample</button>
                                <button className="generate-btn">Error Log</button>
                            </div>
                        </div>


                    </form>
                </div>
            </div>
        </>
    );
};

export default ForwardingManifest;