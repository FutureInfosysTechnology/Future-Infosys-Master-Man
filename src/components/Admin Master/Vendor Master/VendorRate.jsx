import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getApi } from "../Area Control/Zonemaster/ServicesApi";


function VendorRate() {

    const [getVendor, setGetVendor] = useState([]);                        // To Get Vendor Data
    const [getCity, setGetCity] = useState([]);                            // To Get City Data
    const [getMode, setGetMode] = useState([]);                            // To Get Mode Data
    const [getZone, setGetZone] = useState([]);                            // To Get Zone Data
    const [getCountry, setGetCountry] = useState([]);                      // To Get Country Data
    const [getState, setGetState] = useState([]);                          // To Get State Data
    const [selectedCustName, setSelectedCustName] = useState('');
    const [selectedCustCode, setSelectedCustCode] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zones, setZones] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);


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

    useEffect(() => {
        fetchVendorData();
        fetchCityData();
        fetchModeData();
        fetchZoneData();
        fetchCountryData();
        fetchStateData();
    }, []);


    const handleCustNameChange = (e) => {
        const custName = e.target.value;
        setSelectedCustName(custName);

        const selectedCust = getVendor.find((cust) => cust.Vendor_Name === custName);
        if (selectedCust) {
            setSelectedCustCode(selectedCust.Vendor_Code);
        }
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = zones.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(zones.length / rowsPerPage);




    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(zones);
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


    return (
        <>

            <div className="body">
                <div className="container1">
                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => { setModalIsOpen(true) }}>
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
                                    <th scope="col">Addition</th>
                                    <th scope="col">Minimum Weight</th>
                                    <th scope="col">Full Name</th>
                                    <th scope="col">Rate</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>
                                {currentRows.map((zone, index) => (
                                    <tr key={zone.id}>
                                        <td>{zone.id}</td>
                                        <td>{zone.code}</td>
                                        <td>{zone.min}</td>
                                        <td>{zone.max}</td>
                                        <td>{zone.rate}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <button className='edit-btn'><i className='bi bi-pen'></i></button>
                                                <button className='edit-btn'><i className='bi bi-trash'></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="row" style={{whiteSpace:"nowrap" }}>
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
                            <label htmlFor="rowsPerPage"  className="me-2">Rows per page: </label>
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
                        style={{
                            content: {
                                top: '55%',
                                left: '55%',
                                right: 'auto',
                                bottom: 'auto',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                height: '484px',
                                width: '65%',
                                borderRadius: '10px',
                                padding: "0px"
                            },
                        }}>
                        <div>

                            <div className="header-tittle">
                                <header>Vendor Rate Master</header>
                            </div>

                            <div className='container2'>
                                <form>
                                    <div className="fields2">

                                        <div className="input-field3">
                                            <label htmlFor="">Code </label>
                                            <input
                                                type="text"
                                                placeholder="Enter Code/ Generate Code"
                                                value={selectedCustCode} readOnly
                                                maxLength="3" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Vendor Name</label>
                                            <select value={selectedCustName} onChange={handleCustNameChange} required>
                                                <option disabled value="">Select Vendor Name</option>
                                                {getVendor.map((vendor, index) => (
                                                    <option value={vendor.Vendor_Name} key={index}>{vendor.Vendor_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Location</label>
                                            <select value="" required>
                                                <option disabled value="">Select Location</option>
                                                {getCity.map((city, index) => (
                                                    <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Mode</label>
                                            <select value="" required>
                                                <option disabled value="">Select Mode</option>
                                                {getMode.map((mode, index) => (
                                                    <option value={mode.Mode_Code} key={index}>{mode.Mode_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Product Name</label>
                                            <select >
                                                <option disabled value="">Select Product Name</option>
                                                <option>Blue Dart Apex</option>
                                                <option>Blue Dart Surface</option>
                                                <option>Domestic</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Zone Name</label>
                                            <select value="" required>
                                                <option disabled value="">Select Zone Name</option>
                                                {getZone.map((zone, index) => (
                                                    <option value={zone.Zone_Code} key={index}>{zone.Zone_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Country Name</label>
                                            <select value="" required>
                                                <option disabled value="">Select Country</option>
                                                {getCountry.map((country, index) => (
                                                    <option value={country.Country_Code} key={index}>{country.Country_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">State Name</label>
                                            <select required value="">
                                                <option disabled value="">Select State Name</option>
                                                {getState.map((state, index) => (
                                                    <option value={state.State_Code} key={index}>{state.State_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                onClick={(e) => { e.preventDefault(); setModalIsOpen1(true); }}>
                                                <i className="bi bi-buildings"></i>
                                            </button>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Destination</label>
                                            <input type="text" placeholder="Enter Destination" required />
                                        </div>
                                        <div className='bottom-buttons' style={{ marginTop: "18px", marginLeft: "25px" }}>
                                            <button type='submit' className='ok-btn'>Submit</button>
                                            <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                        </div>

                                    </div>

                                </form>

                                <div className="table-container1" style={{ maxHeight: "180px" }}>
                                    <table className='table table-bordered' style={{ height: "70px" }}>
                                        <thead className='table-info body-bordered'>
                                            <tr>
                                                <th>Rate Mode</th>
                                                <th>Increase Rate %</th>
                                                <th>Minimum Weight</th>
                                                <th>Minimum Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            <tr>
                                                <td>
                                                    <select value="">
                                                        <option disabled value="">Select Rate Mode</option>
                                                    </select>
                                                </td>
                                                <td><input type="tel" placeholder="Enter Increase Rate %" /></td>
                                                <td><input type="tel" placeholder="Enter Minimum Weight" /></td>
                                                <td><input type="tel" placeholder="Enter Minimum Amount" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className='table-container1'>
                                    <table className='table table-bordered table-sm'>
                                        <thead className='table-info body-bordered table-sm'>
                                            <tr>
                                                <th scope="col">Sr.No</th>
                                                <th scope="col">Addition</th>
                                                <th scope="col">Minimum Weight</th>
                                                <th scope="col">Maximum Weight</th>
                                                <th scope="col">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-body'>

                                            {currentRows.map((_, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td><input type="tel" /></td>
                                                    <td><input type="tel" /></td>
                                                    <td><input type="tel" /></td>
                                                    <td><input type="tel" /></td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen1}
                        style={{
                            content: {
                                top: '54%',
                                left: '55%',
                                right: 'auto',
                                bottom: 'auto',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                height: '255px',
                                width: '25%',
                                backgroundColor: "#c8cdd1",
                                borderRadius: "10px",
                                padding: "0px"
                            },
                        }}>
                        <div>

                            <div className='container2'>
                                <form>
                                    <div className="fields2">

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox" style={{ width: "20px", height: "20px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "18px" }}>
                                                Mumbai</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox" style={{ width: "20px", height: "20px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "18px" }}>
                                                Navi Mumbai</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox" style={{ width: "20px", height: "20px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "18px" }}>
                                                Pune</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox" style={{ width: "20px", height: "20px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "18px" }}>
                                                Thane</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox" style={{ width: "20px", height: "20px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "18px" }}>
                                                Andheri</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox" style={{ width: "20px", height: "20px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "18px" }}>
                                                Vasai</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox" style={{ width: "20px", height: "20px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "18px" }}>
                                                Bandra</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox" style={{ width: "20px", height: "20px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "18px" }}>
                                                Vashi</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox" style={{ width: "20px", height: "20px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "18px" }}>
                                                Panvel</label>
                                        </div>

                                        <div className='bottom-buttons' style={{ marginLeft: "25px", marginTop: "18px" }}>
                                            <button type='submit' className='ok-btn'>Submit</button>
                                            <button onClick={(e) => { e.preventDefault(); setModalIsOpen1(false) }} className='ok-btn'>close</button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >

                </div>
            </div>

        </>
    );
};

export default VendorRate;