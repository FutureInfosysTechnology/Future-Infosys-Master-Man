import React, { useState, useEffect } from 'react';
import { getApi } from '../../Admin Master/Area Control/Zonemaster/ServicesApi';
import Select from 'react-select'; // 🔹 You forgot this
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
function StatementWiseReport() {

    const [getCity, setGetCity] = useState([]);
    const [getCustomer, setGetCustomer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
      const branchOptions = [
    { value: "All CITY DATA", label: "All CITY DATA" }, // default option
    ...getCity.map(city => ({
      value: city.City_Code,   // adjust keys from your API
      label: city.City_Name,
    }))
  ];
  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };
  const allOptions = [
    { label: "ALL CLIENT DATA", value: "ALL CLIENT DATA" },
    ...getCustomer.map((cust) => ({
      label: cust.Customer_Name,
      value: cust.Customer_Name,
    })),
  ];
  const getbooking = [{ value: "ALL BOOKING DATA", label: "ALL BOOKING DATA" },
  { value: "Pending", label: "Pending" },
  { value: "Resolved", label: "Resolved" },
  ]
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        fromdt: firstDayOfMonth,
        todt: today,
        CustomerName: "",
        booking: "",
        branch: "",
    });
    const handleSearchChange = (selectedOption) => {
    setFormData({ ...formData, CustomerName: selectedOption ? selectedOption.value : "" });
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
       fetchData('/Master/getCustomerdata', setGetCustomer)
       fetchData('/Master/getdomestic', setGetCity);
     }, []);


    return (
        <>

            <div className="body">
                <div className="container1" style={{ padding: "20px" }}>

                    <div className="addNew">
                        <div style={{ marginLeft: "10px" }}>
                            <div className="dropdown">
                                <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                                <div className="dropdown-content">
                                    <button>Export to Excel</button>
                                    <button>Export to PDF</button>
                                </div>
                            </div>
                        </div>

                        <div className="search-input">
                            <input className="add-input" type="text" placeholder="search" />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <form>
                        <div className="row g-3 mb-3">
                            <div className="col-12 col-md-4">
                                <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>Customer Name</h6>
                                <Select
                                    required
                                    className="blue-selectbooking"
                                    classNamePrefix="blue-selectbooking"
                                    options={allOptions}
                                    value={formData.CustomerName ? { label: formData.CustomerName, value: formData.CustomerName } : null}
                                    onChange={handleSearchChange}
                                    placeholder="Search Customer..."
                                    isClearable
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

                            <div className="col-12 col-md-4">
                                <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>Booking Type</h6>
                                <Select
                                    required
                                    options={getbooking}
                                    value={
                                        formData.booking
                                            ? allOptions.find(c => c.value === formData.booking)
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            booking: selectedOption ? selectedOption.value : ""
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
                                    placeholder="Booking type"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>Destination</h6>
                                <Select
                                    required
                                    options={branchOptions}
                                    value={formData.branch ? branchOptions.find(c => c.value === formData.branch) : null}
                                    onChange={(selectedOption) =>
                                        setFormData({ ...formData, branch: selectedOption ? selectedOption.value : "" })
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

                        </div>

                        {/* 🔹 Second Row: Dates + Buttons */}
                        <div className="row g-3 mb-3 align-items-end">
                            {/* From Date */}
                            <div className="col-12 col-md-3">
                                <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>From Date</h6>
                                <DatePicker
                                    selected={formData.fromdt}
                                    onChange={(date) => handleDateChange(date, "fromdt")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                    portalId="root-portal"
                                />
                            </div>

                            {/* To Date */}
                            <div className="col-12 col-md-3">
                                <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>To Date</h6>
                                <DatePicker
                                    selected={formData.todt}
                                    onChange={(date) => handleDateChange(date, "todt")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                    portalId="root-portal"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end">
                                <button className='ok-btn'>Submit</button>
                                <button className='ok-btn' style={{ width: "110px" }}>Setup Report</button>
                            </div>
                        </div>
                    </form>

                    <div className="table-container">
                        <table className='table table-bordered table-sm'>
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Customer Type</th>
                                    <th>Destination</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div >
            </div >

        </>
    )
}

export default StatementWiseReport;