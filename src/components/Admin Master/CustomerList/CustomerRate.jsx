import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { deleteApi, getApi, postApi } from "../Area Control/Zonemaster/ServicesApi";


function CustomerRate() {

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
        Vendor_Code: "",
        Flag: "",
        Mode_Code: "",
        Zone_Code: "",
        State_Code: "",
        Destination_Code: "",
        Method: "",
        Slab: "",
        Active_Date: "",
        Closing_Date: "",
        RatePer: "",
        Amount: "",
        Weight: "",
        ConnectingHub: ""
    });
    const [submittedData, setSubmittedData] = useState([]);
    const [tableRowData, setTableRowData] = useState({
        On_Addition: "",
        Lower_Wt: "",
        Upper_Wt: "",
        Rate: "",
        Rate_Flag: ""
    })


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
            const response = await getApi('/Master/getCustomer');
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

        setSubmittedData((prev) => [...prev, tableRowData]);
        setTableRowData({
            On_Addition: "",
            Lower_Wt: "",
            Upper_Wt: "",
            Rate: ""
        });
    };

    const handlesave = async (e) => {
        e.preventDefault();

        const requestBody = {
            Client_Code: formdata.Client_Code,
            Vendor_Code: formdata.Vendor_Code,
            Flag: formdata.Flag,
            Mode_Code: formdata.Mode_Code,
            Zone_Code: formdata.Zone_Code,
            State_Code: formdata.State_Code,
            Destination_Code: formdata.Destination_Code,
            Method: formdata.Method,
            Slab: formdata.Slab,
            Active_Date: formdata.Active_Date,
            Closing_Date: formdata.Closing_Date,
            RatePer: formdata.RatePer,
            Amount: formdata.Amount,
            Weight: formdata.Weight,
            ConnectingHub: "HUB01",
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
                    Vendor_Code: "",
                    Flag: "",
                    Mode_Code: "",
                    Zone_Code: "",
                    State_Code: "",
                    Destination_Code: "",
                    Method: "",
                    Slab: "",
                    Active_Date: "",
                    Closing_Date: "",
                    RatePer: "",
                    Amount: "",
                    Weight: "",
                    ConnectingHub: ""
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

        const requestBody = {
            Client_Code: formdata.Client_Code,
            Vendor_Code: formdata.Vendor_Code,
            Flag: formdata.Flag,
            Mode_Code: formdata.Mode_Code,
            Zone_Code: formdata.Zone_Code,
            State_Code: formdata.State_Code,
            Destination_Code: formdata.Destination_Code,
            Method: formdata.Method,
            Slab: formdata.Slab,
            Active_Date: formdata.Active_Date,
            Closing_Date: formdata.Closing_Date,
            RatePer: formdata.RatePer,
            Amount: formdata.Amount,
            Weight: formdata.Weight,
            ConnectingHub: "HUB01",
            RateDetails: submittedData.map((data) => ({
                On_Addition: data.On_Addition,
                Lower_Wt: data.Lower_Wt,
                Upper_Wt: data.Upper_Wt,
                Rate: data.Rate,
                Rate_Flag: data.Rate_Flag
            }))
        }

        try {
            const response = await postApi('/Master/updateRateMaster', requestBody, 'POST');
            if (response.status === 1) {
                setGetCustRate(getCustRate.map((cust) => cust.Client_Code === formdata.Client_Code ? response.data : cust));
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
                    Active_Date: "",
                    Closing_Date: "",
                    RatePer: "",
                    Amount: "",
                    Weight: "",
                    ConnectingHub: ""
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

            <div className="body">
                <div className="container1">
                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => { setModalIsOpen(true); setIsEditMode(false); }}>
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
                        <table className='table table-bordered table-sm'>
                            <thead className='table-sm'>
                                <tr>
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
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>
                                {currentRows.map((rate, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{rate.Customer_Name}</td>
                                        <td>{rate.Mode_Name}</td>
                                        <td>{rate.Zone_Name}</td>
                                        <td>{rate.Origin_Name}</td>
                                        <td>{rate.Destination_Name}</td>
                                        <td>{rate.State_Name}</td>
                                        <td>{rate.Method}</td>
                                        <td>{rate.Slab}</td>
                                        <td>{rate.RatePer}</td>
                                        <td>{rate.Amount}</td>
                                        <td>{rate.Weight}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
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
                                                <button className='edit-btn' onClick={() => handledelete(rate.Club_No)}>
                                                    <i className='bi bi-trash'></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
                        <div className="pagination">
                            <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                {'<'}
                            </button>
                            <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                            <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                {'>'}
                            </button>
                        </div>

                        <div className="rows-per-page" style={{ display: "flex", flexDirection: "row", color: "black", marginLeft: "10px" }}>
                            <label htmlFor="rowsPerPage" style={{ marginTop: "16px", marginRight: "10px" }}>Rows per page:</label>
                            <select
                                id="rowsPerPage"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                style={{ height: "40px", width: "60px", marginTop: "10px" }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Customer Rate Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handlesave}>

                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Customer Name</label>
                                            <select required value={formdata.Client_Code}
                                                onChange={(e) => setFormdata({ ...formdata, Client_Code: e.target.value })}>
                                                <option value="" disabled >Select Customer Name</option>
                                                {getCustomer.map((cust, index) => (
                                                    <option value={cust.Customer_Code} key={index}>{cust.Customer_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Vendor Name</label>
                                            <select value={formdata.Vendor_Code}
                                                onChange={(e) => setFormdata({ ...formdata, Vendor_Code: e.target.value })}>
                                                <option value="" disabled>Vendor Name</option>
                                                {getVendor.map((vendor, index) => (
                                                    <option value={vendor.Vendor_Code} key={index}>{vendor.Vendor_Name}</option>
                                                ))}
                                            </select>
                                        </div>


                                        <div className="input-field3">
                                            <label htmlFor="">Mode</label>
                                            <select value={formdata.Mode_Code}
                                                onChange={(e) => setFormdata({ ...formdata, Mode_Code: e.target.value })} required>
                                                <option value="" disabled>Select Mode</option>
                                                {getMode.map((mode, index) => (
                                                    <option value={mode.Mode_Code} key={index}>{mode.Mode_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Zone Name</label>
                                            <select value={formdata.Zone_Code}
                                                onChange={(e) => setFormdata({ ...formdata, Zone_Code: e.target.value })} required>
                                                <option value="" disabled >Select Zone Name</option>
                                                {getZone.map((zone, index) => (
                                                    <option value={zone.Zone_Code} key={index}>{zone.Zone_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">State Name</label>
                                            <select value={formdata.State_Code}
                                                onChange={(e) => setFormdata({ ...formdata, State_Code: e.target.value })} required>
                                                <option value="" disabled >Select State Name</option>
                                                {getState.map((state, index) => (
                                                    <option value={state.State_Code} key={index}>{state.State_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Destination</label>
                                            <select value={formdata.Destination_Code}
                                                onChange={(e) => setFormdata({ ...formdata, Destination_Code: e.target.value })} required>
                                                <option value="" disabled >Select Destination</option>
                                                {getCity.map((city, index) => (
                                                    <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Method</label>
                                            <select value={formdata.Method}
                                                onChange={(e) => setFormdata({ ...formdata, Method: e.target.value })}>
                                                <option value="" disabled>Select Method</option>
                                                <option value="Express">Express</option>
                                                <option value="Domestic">Domestic</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Slab</label>
                                            <select value={formdata.Slab}
                                                onChange={(e) => setFormdata({ ...formdata, Slab: e.target.value })}>
                                                <option value="" disabled>Select Slab</option>
                                                <option value="5 Kg">5 Kg</option>
                                                <option value="10 Kg">10 Kg</option>
                                                <option value="20 Kg">20 Kg</option>
                                                <option value="50 Kg">50 Kg</option>
                                                <option value="100 Kg">100 Kg</option>
                                                <option value="200 Kg">200 Kg</option>
                                                <option value="500 Kg">500 Kg</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Active Date</label>
                                            <input type="date" value={formdata.Active_Date}
                                                onChange={(e) => setFormdata({ ...formdata, Active_Date: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Closing Date</label>
                                            <input type="date" value={formdata.Closing_Date}
                                                onChange={(e) => setFormdata({ ...formdata, Closing_Date: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Rate/Kg</label>
                                            <input type="tel" placeholder="Rate/Kg" value={formdata.RatePer}
                                                onChange={(e) => setFormdata({ ...formdata, RatePer: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Flag</label>
                                            <select value={formdata.Flag}
                                                onChange={(e) => setFormdata({ ...formdata, Flag: e.target.value })}>
                                                <option value="" disabled>Select Flag</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Rate Mode</label>
                                            <select value="">
                                                <option value="" disabled>Select Rate Mode</option>
                                                <option value="Addition">Addition</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Increase Rate %</label>
                                            <input type="tel" placeholder="Increase Rate %" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Min Weight</label>
                                            <input type="tel" placeholder="Min Weight" value={formdata.Weight}
                                                onChange={(e) => setFormdata({ ...formdata, Weight: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Min Amount</label>
                                            <input type="tel" placeholder="Amount" value={formdata.Amount}
                                                onChange={(e) => setFormdata({ ...formdata, Amount: e.target.value })} />
                                        </div>

                                        <div className='bottom-buttons' style={{ marginTop: "18px", marginLeft: "25px" }}>
                                            {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                            {isEditMode && (<button type='button' onClick={handleupdate} className='ok-btn'>Update</button>)}
                                            <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                        </div>

                                    </div>
                                </form>

                                <div className="table-container1">
                                    <table className="table table-bordered table-sm">
                                        <thead>
                                            <tr>
                                                <th>Rate_Mode</th>
                                                <th>Document Rate</th>
                                                <th>Min Weight</th>
                                                <th>Max Weight</th>
                                                <th>Rate</th>
                                                <th>Rate Flag</th>
                                                <th>Save</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <select value="">
                                                        <option value="" disabled>Rate Mode</option>
                                                        <option value="Document Rate">Document Rate</option>
                                                        <option value="Box Rate">Box Rate</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="text" placeholder="Document Rate" value={tableRowData.On_Addition}
                                                        name="On_Addition" onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <input type="text" placeholder="Min Weight" value={tableRowData.Lower_Wt}
                                                        name="Lower_Wt" onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <input type="text" placeholder="Max Weight" value={tableRowData.Upper_Wt}
                                                        name="Upper_Wt" onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <input type="text" placeholder="Rate" value={tableRowData.Rate}
                                                        name="Rate" onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <select value={tableRowData.Rate_Flag}
                                                        onChange={handleChange} name="Rate_Flag">
                                                        <option value="" disabled>Select Rate Flag</option>
                                                        <option value="Active">Active</option>
                                                        <option value="Inactive">Inactive</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button className="ok-btn" style={{ padding: "2px", fontSize: "20px" }}
                                                        onClick={handleAddRow}>
                                                        <i className="bi bi-plus"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="table-container1">
                                    <table className="table table-bordered table-sm">
                                        <thead>
                                            <tr>
                                                <th>Sr No</th>
                                                <th>Addition</th>
                                                <th>Min Weight</th>
                                                <th>Max Weight</th>
                                                <th>Rate</th>
                                                <th>Rate Flag</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submittedData.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.On_Addition}</td>
                                                    <td>{data.Lower_Wt}</td>
                                                    <td>{data.Upper_Wt}</td>
                                                    <td>{data.Rate}</td>
                                                    <td>{data.Rate_Flag}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Modal >
                </div>
            </div>

        </>
    );
};

export default CustomerRate;