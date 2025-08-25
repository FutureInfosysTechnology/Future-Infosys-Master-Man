import React, { useEffect, useState } from "react";
import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'react-toggle/style.css';

function ExcelImport() {
    const today = new Date();
    const time = String(today.getHours()).padStart(2, "0") + ":" + String(today.getMinutes()).padStart(2, "0");;


    const [getCity, setGetCity] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        toDate: today,
        time: time,
        fromDest: '',
        toDest: '',
    });
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
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
        fetchData('/Master/getdomestic', setGetCity);

    }, []);
    return (
        <>
            <div className="container1">

                <form action="">
                    <div className="fields2">
                        <div className="input-field3">
                            <label htmlFor="">Date</label>
                            <DatePicker
                            portalId="root-portal" 
                                selected={formData.toDate}
                                onChange={(date) => handleDateChange(date, "toDate")}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                            />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">AWB No</label>
                            <input type="tel" placeholder="Enter Awb No" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Time</label>
                            <input type="time" value={formData.time} onChange={(e)=>{setFormData({...formData,time:e.target.value})}}/>
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">From</label>
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
                                    }
                                    }
                                    placeholder="Select City"
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
                            <label htmlFor="">To</label>
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
                                        })
                                    }
                                    placeholder="Select City"
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
                            <label htmlFor="">Remark</label>
                            <input type="text" placeholder="Enter Remark" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">File</label>
                            <input style={{ paddingTop: "7px" }} type="file" placeholder="" />
                        </div>
                    </div>

                    <div className="bottom-buttons">
                        <button type="submit" className="ok-btn">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ExcelImport;