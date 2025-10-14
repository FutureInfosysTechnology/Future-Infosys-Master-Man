import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { deleteApi, getApi, postApi, putApi } from "../Area Control/Zonemaster/ServicesApi";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select, { components } from 'react-select';
import 'react-toggle/style.css';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


function CustomerRate() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const flagOptions = [
        { value: "RatePerKg", label: "RatePerKg" },
        { value: "DocumentRate", label: "DocumentRate" },
        { value: "Box", label: "Box" },
    ];

    const [openRow, setOpenRow] = useState(null);
    const [getCustRate, setGetCustRate] = useState([]);
    const [getCustomer, setGetCustomer] = useState([]);       // To Get Customer Data
    const [getCity, setGetCity] = useState([]);               // To Get City Data
    const [getMode, setGetMode] = useState([]);               // To Get Mode Data
    const [getZone, setGetZone] = useState([]);               // To Get Zone Data
    const [getCountry, setGetCountry] = useState([]);         // To Get Country Data
    const [getState, setGetState] = useState([]);             // To Get State Data
    const [getVendor, setGetVendor] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formdata, setFormdata] = useState({
        Client_Code: "",
        Mode_Code: "",
        Zone_Code: "",
        State_Code: "",
        Destination_Code: "",
        Origin_Code: "",
        Active_Date: firstDayOfMonth,
        Closing_Date: today,
        Amount: "",
        Weight: "",
    });
    console.log(formdata);
    const [editIndex, setEditIndex] = useState(null);
    const [submittedData, setSubmittedData] = useState([]);
    const [tableRowData, setTableRowData] = useState({
        On_Addition: "",
        Lower_Wt: "",
        Upper_Wt: "",
        Rate: "",
        Rate_Flag: ""
    })

    const handleDateChange = (date, field) => {
        setFormdata({ ...formdata, [field]: date });
    };
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = getCustRate.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(getCustRate.length / rowsPerPage);

    const fetchCustomerRateData = async () => {
        try {
            const response = await getApi('/Master/GetRateMaster');
            setGetCustRate(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
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

    const fetchCityData = async () => {
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

    const fetchModeData = async () => {
        try {
            const response = await getApi('/Master/getMode');
            setGetMode(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchZoneData = async () => {
        try {
            const response = await getApi('/Master/getZone');
            setGetZone(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCountryData = async () => {
        try {
            const response = await getApi('/Master/getCountry');
            setGetCountry(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStateData = async () => {
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

    const fetchVendorData = async () => {
        try {
            const response = await getApi('/Master/getVendor');
            setGetVendor(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomerRateData();
        fetchCustomerData();
        fetchCityData();
        fetchModeData();
        fetchZoneData();
        fetchCountryData();
        fetchStateData();
        fetchVendorData();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTableRowData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddRow = (e) => {
        e.preventDefault();

        if (!tableRowData.Rate) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in the empty fields.',
                confirmButtonText: 'OK',
            });
            return;
        }
        if (editIndex !== null) {
            // update existing row
            const updated = [...submittedData];
            updated[editIndex] = tableRowData;
            setSubmittedData(updated);
            setEditIndex(null);
        } else {
            setSubmittedData((prev) => [...prev, tableRowData]);
        }
        setTableRowData({
            On_Addition: "",
            Lower_Wt: "",
            Upper_Wt: "",
            Rate: ""
        });
    };

    const handlesave = async (e) => {
        e.preventDefault();
        if (!formdata.Client_Code || !formdata.Mode_Code || !formdata.Vendor_Code) {
            return Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in the empty fields.',
                confirmButtonText: 'OK',
            });
        }
        const requestBody = {
            Client_Code: formdata.Client_Code.toString(),
            Mode_Code: formdata.Mode_Code,
            Zone_Code: formdata.Zone_Code,
            State_Code: formdata.State_Code,
            Destination_Code: formdata.Destination_Code,
            Active_Date: formdata.Active_Date,
            Closing_Date: formdata.Closing_Date,
            Amount: formdata.Amount,
            Weight: formdata.Weight,
            RateDetails: submittedData.map((data) => ({
                On_Addition: data.On_Addition,
                Lower_Wt: data.Lower_Wt,
                Upper_Wt: data.Upper_Wt,
                Rate: data.Rate,
                Rate_Flag: data.Rate_Flag
            }))
        }

        try {
            const response = await postApi('/Master/addRateData', requestBody, 'POST')
            if (response.status === 1) {
                setGetCustRate([...getCustRate, response.data]);
                setFormdata({
                    Client_Code: "",
                    Mode_Code: "",
                    Zone_Code: "",
                    State_Code: "",
                    Destination_Code: "",
                    Origin_Code: "",
                    Active_Date: firstDayOfMonth,
                    Closing_Date: today,
                    Amount: "",
                    Weight: "",
                });
                setTableRowData({
                    On_Addition: "",
                    Lower_Wt: "",
                    Upper_Wt: "",
                    Rate: "",
                    Rate_Flag: ""
                })
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCustomerRateData();
            }
        } catch (error) {
            console.error('Unable to save Customer Rate:', error);
        }
    };

    const handleupdate = async (e) => {
        e.preventDefault();
        if (!formdata.Client_Code || !formdata.Mode_Code || !formdata.Vendor_Code) {
            return Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in the empty fields.',
                confirmButtonText: 'OK',
            });
        }
        const requestBody = {
            Client_Code: formdata.Client_Code.toString(),
            Mode_Code: formdata.Mode_Code,
            Zone_Code: formdata.Zone_Code,
            State_Code: formdata.State_Code,
            Destination_Code: formdata.Destination_Code,
            Active_Date: formdata.Active_Date,
            Closing_Date: formdata.Closing_Date,
            Amount: formdata.Amount,
            Weight: formdata.Weight,
            RateDetails: submittedData.map((data) => ({
                On_Addition: data.On_Addition,
                Lower_Wt: data.Lower_Wt,
                Upper_Wt: data.Upper_Wt,
                Rate: data.Rate,
                Rate_Flag: data.Rate_Flag
            }))
        }

        try {
            const response = await putApi('/Master/updateRateMaster', requestBody, 'POST');
            if (response.status === 1) {
                setGetCustRate(getCustRate.map((cust) => cust.Client_Code === formdata.Client_Code ? response.data : cust));
                setFormdata({
                    Client_Code: "",
                    Mode_Code: "",
                    Zone_Code: "",
                    State_Code: "",
                    Destination_Code: "",
                    Origin_Code: "",
                    Active_Date: firstDayOfMonth,
                    Closing_Date: today,
                    Amount: "",
                    Weight: "",
                });
                setTableRowData({
                    On_Addition: "",
                    Lower_Wt: "",
                    Upper_Wt: "",
                    Rate: "",
                    Rate_Flag: ""
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCustomerRateData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the Customer Rate.', 'error');
            }
        } catch (error) {
            console.error('Unable to update Customer Rate:', error);
        }
    }

    const handledelete = async (Club_No) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this Rate?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });
        if (confirmDelete.isConfirmed) {
            try {
                await deleteApi(`/Master/DeleteRateMaster?clubNo=${Club_No}`);
                Swal.fire('Deleted!', 'Customer Rate has been deleted.', 'success');
                await fetchCustomerRateData();
            } catch (error) {
                console.error('Unable to delete Customer Rate:', error);
            }
        }
    }


    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getCustRate);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Zones');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'zones.xlsx');
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

            pdf.save('zones.pdf');
        });
    };


    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    // const emptyRows = Array(5).fill({ code: '', min: '', max: '', rate: '' });


    return (
        <>
            <style>{`
  @media only screen and (max-width: 767px) {
      .min {
        width: 100% !important; /* full width for mobile */
         margin-right: 5px;
      }
    }

    @media only screen and (min-width: 768px) {
      .min {
        width: 215px !important; /* fixed for tablet & desktop */
      }
    }

     @media only screen and (min-width: 1024px) {
      .min {
        width: 122px !important; /* fixed for tablet & desktop */
      }
    }
`}</style>

            <div className="body">
                <div className="container1">
                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => {
                                setModalIsOpen(true); setIsEditMode(false);
                                setFormdata({
                                    Client_Code: "",
                                    Vendor_Code: "",
                                    Flag: "",
                                    Mode_Code: "",
                                    Zone_Code: "",
                                    State_Code: "",
                                    Destination_Code: "",
                                    Method: "",
                                    Slab: "",
                                    Active_Date: firstDayOfMonth,
                                    Closing_Date: today,
                                    RatePer: "",
                                    Amount: "",
                                    Weight: "",
                                    ConnectingHub: ""
                                })
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
                            <input className="add-input" type="text" placeholder="search" />
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
                                    <th scope="col">Customer_Name</th>
                                    <th scope="col">Mode_Name</th>
                                    <th scope="col">Zone_Name</th>
                                    <th scope="col">Origin_Name</th>
                                    <th scope="col">Destination_Name</th>
                                    <th scope="col">State_Name</th>
                                    <th scope="col">Method</th>
                                    <th scope="col">Slab</th>
                                    <th scope="col">Rate/Kg</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Weight</th>

                                </tr>
                            </thead>
                            <tbody className='table-body'>
                                {currentRows.map((rate, index) => (
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
                                                        setFormdata({
                                                            Client_Code: rate.Customer_Name,
                                                            Mode_Code: rate.Mode_Name,
                                                            Zone_Code: rate.Zone_Name,
                                                            State_Code: rate.State_Name,
                                                            Destination_Code: rate.Destination_Name,
                                                            Method: rate.Method,
                                                            Slab: rate.Slab,
                                                            Active_Date: rate.Active_Date,
                                                            Closing_Date: rate.Closing_Date,
                                                            RatePer: rate.RatePer,
                                                            Weight: rate.Weight,
                                                            Amount: rate.Amount
                                                        });
                                                        setSubmittedData(rate.RateDetails || [])
                                                        setModalIsOpen(true);
                                                    }}>
                                                        <i className='bi bi-pen'></i>
                                                    </button>
                                                    <button className='edit-btn' onClick={() => {
                                                        handledelete(rate.Club_No);
                                                        setOpenRow(null);
                                                    }}>
                                                        <i className='bi bi-trash'></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        <td>{index + 1}</td>
                                        <td>{rate?.Customer_Name}</td>
                                        <td>{rate?.Mode_Name}</td>
                                        <td>{rate?.Zone_Name}</td>
                                        <td>{rate?.Origin_Name}</td>
                                        <td>{rate?.Destination_Name}</td>
                                        <td>{rate?.State_Name}</td>
                                        <td>{rate?.Method}</td>
                                        <td>{rate?.Slab}</td>
                                        <td>{rate?.RatePer}</td>
                                        <td>{rate?.Amount}</td>
                                        <td>{rate?.Weight}</td>

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
                        className="custom-modal" contentLabel="Modal"
                        style={{
                            content: {
                                width: '90%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap"
                            },
                        }}>
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Customer Rate Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handlesave}>
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Customer Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getCustomer.map(cust => ({
                                                    value: cust.Customer_Code,   // adjust keys from your API
                                                    label: cust.Customer_Name
                                                }))}
                                                value={
                                                    formdata.Client_Code
                                                        ? { value: formdata.Client_Code, label: getCustomer.find(cust => cust.Customer_Code === formdata.Client_Code)?.Customer_Name || "" }
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormdata({
                                                        ...formdata,
                                                        Client_Code: selectedOption ? selectedOption.value : ""
                                                    })
                                                }}
                                                placeholder="Select Customer"
                                                isSearchable
                                                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll area
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps it above other UI
                                                }}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Origin</label>
                                            <Select
                                                options={getCity.map(city => ({
                                                    value: city.City_Code,   // adjust keys from your API
                                                    label: city.City_Name
                                                }))}
                                                value={
                                                    formdata.Origin_Code
                                                        ? { value: formdata.Origin_Code, label: getCity.find(c => c.City_Code === formdata.Origin_Code)?.City_Name || "" }
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    console.log(selectedOption);
                                                    setFormdata({
                                                        ...formdata,
                                                        Origin_Code: selectedOption ? selectedOption.value : ""
                                                    })
                                                }
                                                }
                                                placeholder="Select Origin"
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
                                        <div className="input-field1">
                                            <label htmlFor="">Mode</label>
                                            <Select
                                                options={getMode.map(mode => ({
                                                    value: mode.Mode_Code,
                                                    label: mode.Mode_Name
                                                }))}
                                                value={
                                                    formdata.Mode_Code && Array.isArray(formdata.Mode_Code)
                                                        ? formdata.Mode_Code.map(code => ({
                                                            value: code,
                                                            label: getMode.find(c => c.Mode_Code === code)?.Mode_Name || ""
                                                        }))
                                                        : []
                                                }
                                                onChange={(selectedOptions) =>
                                                    setFormdata({
                                                        ...formdata,
                                                        Mode_Code: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                                    })
                                                }
                                                placeholder="Select Mode"
                                                isSearchable
                                                isMulti
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                components={{
                                                    Option: (props) => (
                                                        <components.Option {...props}>
                                                            <input
                                                                type="checkbox"
                                                                checked={props.isSelected}
                                                                onChange={() => null}
                                                                style={{ marginRight: "8px", verticalAlign: "middle" }}
                                                            />
                                                            <label style={{ verticalAlign: "middle" }}>{props.label}</label>
                                                        </components.Option>
                                                    ),
                                                }}
                                                classNamePrefix="blue-selectbooking"
                                                className="blue-selectbooking"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        minHeight: "38px",
                                                        display: "flex",
                                                        alignItems: "center", // ✅ Center vertically
                                                    }),
                                                    valueContainer: (base) => ({
                                                        ...base,
                                                        flexWrap: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: "100%",
                                                        alignItems: "center", // ✅ Center text vertically
                                                    }),
                                                    multiValue: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "100px",
                                                    }),
                                                    multiValueLabel: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "80px",
                                                    }),
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Zone Name</label>
                                            <Select
                                                options={getZone.map(zone => ({
                                                    value: zone.Zone_Code,
                                                    label: zone.Zone_Name
                                                }))}
                                                value={
                                                    formdata.Zone_Code && Array.isArray(formdata.Zone_Code)
                                                        ? formdata.Zone_Code.map(code => ({
                                                            value: code,
                                                            label: getZone.find(c => c.Zone_Code === code)?.Zone_Name || ""
                                                        }))
                                                        : []
                                                }
                                                onChange={(selectedOptions) =>
                                                    setFormdata({
                                                        ...formdata,
                                                        Zone_Code: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                                    })
                                                }
                                                placeholder="Select Zone"
                                                isSearchable
                                                isMulti
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                components={{
                                                    Option: (props) => (
                                                        <components.Option {...props}>
                                                            <input
                                                                type="checkbox"
                                                                checked={props.isSelected}
                                                                onChange={() => null}
                                                                style={{ marginRight: "8px", verticalAlign: "middle" }}
                                                            />
                                                            <label style={{ verticalAlign: "middle" }}>{props.label}</label>
                                                        </components.Option>
                                                    ),
                                                }}
                                                classNamePrefix="blue-selectbooking"
                                                className="blue-selectbooking"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        minHeight: "38px",
                                                        display: "flex",
                                                        alignItems: "center", // ✅ Center vertically
                                                    }),
                                                    valueContainer: (base) => ({
                                                        ...base,
                                                        flexWrap: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: "100%",
                                                        alignItems: "center", // ✅ Center text vertically
                                                    }),
                                                    multiValue: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "100px",
                                                    }),
                                                    multiValueLabel: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "80px",
                                                    }),
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                        </div>


                                        <div className="input-field1">
                                            <label htmlFor="">State Name</label>
                                            <Select
                                                options={getState.map(state => ({
                                                    value: state.State_Code,
                                                    label: state.State_Name
                                                }))}
                                                value={
                                                    formdata.State_Code && Array.isArray(formdata.State_Code)
                                                        ? formdata.State_Code.map(code => ({
                                                            value: code,
                                                            label: getState.find(c => c.State_Code === code)?.State_Name || ""
                                                        }))
                                                        : []
                                                }
                                                onChange={(selectedOptions) =>
                                                    setFormdata({
                                                        ...formdata,
                                                        State_Code: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                                    })
                                                }
                                                placeholder="Select State"
                                                isSearchable
                                                isMulti
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                components={{
                                                    Option: (props) => (
                                                        <components.Option {...props}>
                                                            <input
                                                                type="checkbox"
                                                                checked={props.isSelected}
                                                                onChange={() => null}
                                                                style={{ marginRight: "8px", verticalAlign: "middle" }}
                                                            />
                                                            <label style={{ verticalAlign: "middle" }}>{props.label}</label>
                                                        </components.Option>
                                                    ),
                                                }}
                                                classNamePrefix="blue-selectbooking"
                                                className="blue-selectbooking"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        minHeight: "38px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        borderRadius: "6px",
                                                    }),
                                                    valueContainer: (base) => ({
                                                        ...base,
                                                        flexWrap: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: "100%",
                                                        alignItems: "center",
                                                    }),
                                                    multiValue: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "100px",
                                                    }),
                                                    multiValueLabel: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "80px",
                                                    }),
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Destination</label>
                                            <Select
                                                options={getCity.map(city => ({
                                                    value: city.City_Code,
                                                    label: city.City_Name
                                                }))}
                                                value={
                                                    formdata.Destination_Code && Array.isArray(formdata.Destination_Code)
                                                        ? formdata.Destination_Code.map(code => ({
                                                            value: code,
                                                            label: getCity.find(c => c.City_Code === code)?.City_Name || ""
                                                        }))
                                                        : []
                                                }
                                                onChange={(selectedOptions) =>
                                                    setFormdata({
                                                        ...formdata,
                                                        Destination_Code: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                                    })
                                                }
                                                placeholder="Select Destination"
                                                isSearchable
                                                isMulti
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                components={{
                                                    Option: (props) => (
                                                        <components.Option {...props}>
                                                            <input
                                                                type="checkbox"
                                                                checked={props.isSelected}
                                                                onChange={() => null} // handled internally by react-select
                                                                style={{ marginRight: "8px", verticalAlign: "middle" }}
                                                            />
                                                            <label style={{ verticalAlign: "middle" }}>{props.label}</label>
                                                        </components.Option>
                                                    ),
                                                }}
                                                classNamePrefix="blue-selectbooking"
                                                className="blue-selectbooking"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        minHeight: "38px",
                                                        display: "flex",
                                                        alignItems: "center", // ✅ Center vertically
                                                    }),
                                                    valueContainer: (base) => ({
                                                        ...base,
                                                        flexWrap: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: "100%",
                                                        alignItems: "center", // ✅ Center tags vertically
                                                    }),
                                                    multiValue: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "100px",
                                                    }),
                                                    multiValueLabel: (base) => ({
                                                        ...base,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "80px",
                                                    }),
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                        </div>

                                        <div className="input-field1" >
                                            <label htmlFor="">Active Date</label>
                                            <DatePicker
                                                required
                                                portalId="root-portal"
                                                selected={formdata.Active_Date}
                                                onChange={(date) => handleDateChange("Active_Date", date)}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Closing Date</label>

                                            <DatePicker
                                                required
                                                portalId="root-portal"
                                                selected={formdata.Closing_Date}
                                                onChange={(date) => handleDateChange("Closing_Date", date)}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="input-field3 min"  >
                                            <label htmlFor="">Min Weight</label>
                                            <input type="tel" placeholder="Min Weight" value={formdata.Weight}
                                                onChange={(e) => setFormdata({ ...formdata, Weight: e.target.value })} />
                                        </div>

                                        <div className="input-field3 min"
                                        >
                                            <label htmlFor="">Min Amount</label>
                                            <input type="tel" placeholder="Amount" value={formdata.Amount}
                                                onChange={(e) => setFormdata({ ...formdata, Amount: e.target.value })} />
                                        </div>
                                        <div className='bottom-buttons' style={{ marginTop: "22px", marginLeft: "10px" }}>
                                            {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                            {isEditMode && (<button type='button' onClick={handleupdate} className='ok-btn'>Update</button>)}
                                            <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                            <div className='container2' style={{ width: "100%" }}>
                                <div className="table-container1" style={{ width: "100%" }}>
                                    <table className="table table-bordered table-sm" style={{ width: "97%", whiteSpace: "nowrap" }}>
                                        <thead>
                                            <tr>
                                                <th>Rate Type</th>
                                                <th>Document Rate</th>
                                                <th>Min Weight</th>
                                                <th>Max Weight</th>
                                                <th>Rate</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Select
                                                        options={flagOptions}
                                                        value={flagOptions.find((opt) => opt.value === tableRowData.Rate_Flag) || null}
                                                        onChange={(selectedOption) =>
                                                            setTableRowData({ ...tableRowData, Rate_Flag: selectedOption?.value || "" })
                                                        }
                                                        placeholder="Select Flag"
                                                        isSearchable
                                                        classNamePrefix="blue-selectbooking"
                                                        className="blue-selectbooking"
                                                        menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                                                        styles={{
                                                            placeholder: (base) => ({
                                                                ...base,
                                                                whiteSpace: "nowrap",
                                                                textAlign: "center",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                width: "100px",
                                                                marginLeft: "5px",
                                                                fontWeight: "normal", // ✅ make placeholder not bold
                                                                color: "#999" // optional: softer color for placeholder
                                                            }),
                                                            input: (base) => ({
                                                                ...base,
                                                                textAlign: "center",
                                                                width: "100px",
                                                                paddingLeft: "10px",
                                                                fontWeight: "normal", // ✅ ensure typed text also not bold
                                                            }),
                                                            singleValue: (base) => ({
                                                                ...base,
                                                                textAlign: "center",
                                                                fontWeight: "normal", // ✅ make selected value not bold
                                                            }),
                                                            menuPortal: (base) => ({
                                                                ...base,
                                                                zIndex: 9999
                                                            })
                                                        }}

                                                    />
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control" placeholder="Document Rate" value={tableRowData.On_Addition}
                                                        name="On_Addition" onChange={handleChange} style={{ textAlign: "center" }} />
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control" placeholder="Min Weight" value={tableRowData.Lower_Wt}
                                                        name="Lower_Wt" onChange={handleChange} style={{ textAlign: "center" }} />
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control" placeholder="Max Weight" value={tableRowData.Upper_Wt}
                                                        name="Upper_Wt" onChange={handleChange} style={{ textAlign: "center" }} />
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control" placeholder="Rate" value={tableRowData.Rate}
                                                        name="Rate" onChange={handleChange} style={{ textAlign: "center" }} />
                                                </td>

                                                <td style={{display:"flex",justifyContent:"center"}}>
                                                    <button className="ok-btn" style={{ padding: "2px", fontSize: "30px", width: "40px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                        onClick={handleAddRow}>
                                                        <i className="bi bi-plus" ></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            {submittedData.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{data.Rate_Flag}</td>
                                                    <td>{data.On_Addition}</td>
                                                    <td>{data.Lower_Wt}</td>
                                                    <td>{data.Upper_Wt}</td>
                                                    <td>{data.Rate}</td>
                                                    <td>
                                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                            <button className='edit-btn'
                                                                onClick={() => {
                                                                    setTableRowData({
                                                                        On_Addition:data.On_Addition,
                                                                        Lower_Wt:data.Lower_Wt,
                                                                        Upper_Wt:data.Upper_Wt,
                                                                        Rate:data.Rate,
                                                                        Rate_Flag: data.Rate_Flag,
                                                                    })
                                                                    setEditIndex(index);
                                                                }}>
                                                                <i className='bi bi-pen'></i>
                                                            </button>
                                                            <button onClick={() => {
                                                                setSubmittedData(submittedData.filter((_, ind) => ind !== index));
                                                                setEditIndex(null);
                                                                setTableRowData({
                                                                    On_Addition: "",
                                                                    Lower_Wt: "",
                                                                    Upper_Wt: "",
                                                                    Rate: "",
                                                                    Rate_Flag: ""
                                                                })
                                                            }}
                                                                className='edit-btn'><i className='bi bi-trash'></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </Modal >
                </div >
            </div >

        </>
    );
};

export default CustomerRate;