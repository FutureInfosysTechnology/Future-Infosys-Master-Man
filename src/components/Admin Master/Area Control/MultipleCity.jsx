import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getApi, postApi } from "./Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


function MultipleCity() {
    const [openRow, setOpenRow] = useState(null);
    const [multipleCity, setmultipleCity] = useState([]);
    const [getMode, setGetMode] = useState([]);                       // To Get Mode Data
    const [getCity, setGetCity] = useState([]);                       // To Get City Data
    const [getZone, setGetZone] = useState([]);                       // To Get Zone Data
    const [getState, setGetState] = useState([]);                     // To Get State Data
    const [getVendor, setGetVendor] = useState([]);                   // To Get Vendor Data
    const [getCountry, setGetCountry] = useState([]);                 // To Get Country Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addCity, setAddCity] = useState({
        VendorCode: '',
        ModeCode: '',
        ZoneCode: '',
        CountryCode: '',
        StateCode: '',
        CityCode: '',
        ProductType: '',

    })

    const fetchMultipleCityData = async () => {
        try {
            const response = await getApi('/Master/getMultipleCity');
            setmultipleCity(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMultipleCityData();
    }, []);

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
        fetchData('/Master/getCountry', setGetCountry);
        fetchData('/Master/GetState', setGetState);
        fetchData('/Master/getdomestic', setGetCity);
        fetchData('/Master/getVendor', setGetVendor);
        fetchData('/Master/getMode', setGetMode);
        fetchData('/Master/getZone', setGetZone);
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            VendorCode: addCity.VendorCode,
            ModeCode: addCity.ModeCode,
            ZoneCode: addCity.ZoneCode,
            CountryCode: addCity.CountryCode,
            StateCode: addCity.StateCode,
            CityCode: addCity.CityCode,
            ProductType: addCity.ProductType
        }

        try {
            const response = await postApi('/Master/UpdateMultipleCity', requestBody, 'POST');
            if (response.status === 1) {
                setmultipleCity(multipleCity.map((city) => city.City_Code === addCity.CityCode ? response.Data : city));
                setAddCity({
                    VendorCode: '',
                    ModeCode: '',
                    ZoneCode: '',
                    CountryCode: '',
                    StateCode: '',
                    CityCode: '',
                    ProductType: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchMultipleCityData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the Multiple city.', 'error');
            }
        } catch (error) {
            console.error("Failed to update Multiple City:", error);
            Swal.fire('Error', 'Failed to update Multiple city data', 'error');
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await postApi(`/Master/AddMultiplaCity?VendorCode=${addCity.VendorCode}
                &ModeCode=${addCity.ModeCode}
                &ZoneCode=${addCity.ZoneCode}
                &CountryCode=${addCity.CountryCode}
                &StateCode=${addCity.StateCode}
                &CityCode=${addCity.CityCode}
                &ProductType=${addCity.ProductType}`);
            if (response.status === 1) {
                setAddCity({
                    VendorCode: '',
                    ModeCode: '',
                    ZoneCode: '',
                    CountryCode: '',
                    StateCode: '',
                    CityCode: '',
                    ProductType: ''
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to Save Branch Data', 'error');
        }
    };


    const handleDelete = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Deleted!', 'Your zone has been deleted.', 'success');
            }
        });
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(multipleCity);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'multipleCity');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'multipleCity.xlsx');
    };

    const handleExportzonePDF = () => {
        const pdfData = multipleCity.map(({ id, vendor, mode, name, country, state, city }) =>
            [id, vendor, mode, name, country, state, city]);
        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text('Multiple City Data', 14, 20);

        const headers = [['Sr.No', 'Vendor Name', 'Mode', 'Name', 'Country', 'State', 'City']];

        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 30,
            theme: 'grid'
        });
        pdf.save('multipleCity.pdf');
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = multipleCity.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(multipleCity.length / rowsPerPage);

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <div className="body">
            <div className="container1">
                <div className="addNew">
                    <div>
                        <button className='add-btn' onClick={() => {
                            setModalIsOpen(true); setIsEditMode(false);
                            setAddCity({
                                VendorCode: '', ModeCode: '', ZoneCode: '', CountryCode: '',
                                StateCode: '', CityCode: '', ProductType: '',
                            })
                        }}>
                            <i className="bi bi-plus-lg"></i>
                            <span>ADD NEW</span>
                        </button>

                        <div className="dropdown">
                            <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                            <div className="dropdown-content">
                                <button onClick={handleExportExcel}>Export to Excel</button>
                                <button onClick={handleExportzonePDF}>Export to PDF</button>
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
                                <th scope="col">Mode name</th>
                                <th scope="col">Zone Name</th>
                                <th scope="col">Country Name</th>
                                <th scope="col">State Name</th>
                                <th scope="col">City Name</th>
                                <th scope="col">Vendor Name</th>

                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            {currentRows.map((multiple, index) => (
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
                                                    left: "90px",
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
                                                    setAddCity({
                                                        ModeCode: multiple.Mode_Code,
                                                        ZoneCode: multiple.Zone_Code,
                                                        CountryCode: multiple.Country_Code,
                                                        StateCode: multiple.State_Code,
                                                        CityCode: multiple.City_Code,
                                                        ProductType: multiple.ProductType,
                                                        VendorCode: multiple.Vendor_Code
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button onClick={() => {
                                                    setOpenRow(null);
                                                     handleDelete(index);
                                                }} className='edit-btn'><i className='bi bi-trash'></i></button>
                                            </div>
                                        )}
                                    </td>

                                    <td>{index + 1}</td>
                                    <td>{multiple.Mode_Name}</td>
                                    <td>{multiple.Zone_Name}</td>
                                    <td>{multiple.Country_Name}</td>
                                    <td>{multiple.State_Name}</td>
                                    <td>{multiple.City_Name}</td>
                                    <td>{multiple.Vendor_Name}</td>

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
                    className="custom-modal-volumetric" contentLabel="Modal">
                    <div className="custom-modal-content">
                        <div className="header-tittle">
                            <header>Multiple City Master</header>
                        </div>

                        <div className='container2'>
                            <form onSubmit={handleSave}>
                                <div className="fields2">
                                    <div className="input-field1">
                                        <label htmlFor="">City Name</label>
                                        <select value={addCity.CityCode}
                                            onChange={(e) => setAddCity({ ...addCity, CityCode: e.target.value })}
                                            required aria-readonly={isEditMode}>
                                            <option value="" disabled>Select City Name</option>
                                            {getCity.map((city, index) => (
                                                <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Zone Name</label>
                                        <select value={addCity.ZoneCode}
                                            onChange={(e) => setAddCity({ ...addCity, ZoneCode: e.target.value })} required>
                                            <option value="" disabled>Select Zone</option>
                                            {getZone.map((zone, index) => (
                                                <option value={zone.Zone_Code} key={index}>{zone.Zone_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label className="label">Mode Name</label>
                                        <select value={addCity.ModeCode}
                                            onChange={(e) => setAddCity({ ...addCity, ModeCode: e.target.value })} required>
                                            <option value="" disabled>Select Mode</option>
                                            {getMode.map((mode, index) => (
                                                <option value={mode.Mode_Code} key={index}>{mode.Mode_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">State Name</label>
                                        <select value={addCity.StateCode}
                                            onChange={(e) => setAddCity({ ...addCity, StateCode: e.target.value })} required>
                                            <option value="" disabled>Select State</option>
                                            {getState.map((state, index) => (
                                                <option value={state.State_Code} key={index}>{state.State_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Vendor Name</label>
                                        <select value={addCity.VendorCode}
                                            onChange={(e) => setAddCity({ ...addCity, VendorCode: e.target.value })} required>
                                            <option value="" disabled>Select Vendor</option>
                                            {getVendor.map((vendor, index) => (
                                                <option value={vendor.Vendor_Code} key={index}>{vendor.Vendor_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Country Name</label>
                                        <select value={addCity.CountryCode}
                                            onChange={(e) => setAddCity({ ...addCity, CountryCode: e.target.value })} required>
                                            <option value="" disabled>Select Country</option>
                                            {getCountry.map((country, index) => (
                                                <option value={country.Country_Code} key={index}>{country.Country_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Product Type</label>
                                        <select value={addCity.ProductType}
                                            onChange={(e) => setAddCity({ ...addCity, ProductType: e.target.value })} required>
                                            <option value="" disabled>Product Type</option>
                                            <option value="International">International</option>
                                            <option value="Domestic">Domestic</option>
                                        </select>
                                    </div>

                                </div>
                                <div className='bottom-buttons'>
                                    {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                    {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                    <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </Modal >

            </div>
        </div>
    )
}


export default MultipleCity;