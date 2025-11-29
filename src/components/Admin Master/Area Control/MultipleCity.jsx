import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import { getApi, postApi, putApi, deleteApi } from "./Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import Select from "react-select"


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
    const [searchQuery, setSearchQuery] = useState('');
    const [addCity, setAddCity] = useState({
        ID: '',
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
            const response = await getApi('/Master/GetAllInternatioanlzone');
            setmultipleCity(Array.isArray(response.data) ? response.data : []);
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
            ID: addCity.ID,
            VendorCode: addCity.VendorCode,
            ModeCode: addCity.ModeCode,
            ZoneCode: addCity.ZoneCode,
            CountryCode: addCity.CountryCode,
            StateCode: addCity.StateCode,
            CityCode: addCity.CityCode,
            ProductType: addCity.ProductType
        }

        try {
            const response = await putApi('/Master/UpdateInternatioanlzone', requestBody);
            if (response.status === 1) {
                setAddCity({
                    ID: '',
                    VendorCode: '',
                    ModeCode: '',
                    ZoneCode: '',
                    CountryCode: '',
                    StateCode: '',
                    CityCode: '',
                    ProductType: '',
                });
                Swal.fire('Updated!', response.message || 'Zone has been updated.', 'success');
                setModalIsOpen(false);
                await fetchMultipleCityData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the zone.', 'error');
            }
        } catch (error) {
            console.error("Failed to update Multiple City:", error);
            Swal.fire('Error', 'Failed to update zone data', 'error');
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            VendorCode: addCity.VendorCode,
            ModeCode: addCity.ModeCode,
            ZoneCode: addCity.ZoneCode,
            CountryCode: addCity.CountryCode,
            StateCode: addCity.StateCode,
            CityCode: addCity.CityCode,
            ProductType: addCity.ProductType
        }

        try {
            const response = await postApi(`/Master/AddInternatioanlzone`, payload);
            if (response.status === 1) {
                setAddCity({
                    ID: '',
                    VendorCode: '',
                    ModeCode: '',
                    ZoneCode: '',
                    CountryCode: '',
                    StateCode: '',
                    CityCode: '',
                    ProductType: '',
                });
                Swal.fire('Saved!', response.message || 'Zone has been saved.', 'success');
                setModalIsOpen(false);
                await fetchMultipleCityData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to save zone.', 'error');

            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to Save zone Data', 'error');
        }
    };


    const handleDelete = async (ID) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const response = await deleteApi(
                        `/Master/DeleteInternatioanlzone?ID=${ID}`
                    );

                    if (response.status === 1) {
                        Swal.fire('Deleted!', 'Zone deleted successfully.', 'success');
                        setmultipleCity(multipleCity.filter(c => c.ID !== ID));

                    }
                    else if (response.data.status === 0) {
                        Swal.fire('Not Found', 'Record not found.', 'warning');
                    }
                    else {
                        Swal.fire('Error', 'Something went wrong.', 'error');
                    }

                } catch (error) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        });
    };
    const handleSearchChange = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };

    const handleExportExcel = () => {

        // Create custom export rows in same order as table
        const exportData = currentRows.map((row, index) => ({
            "Mode Name": row.Mode_Name,
            "Zone Name": row.Zone_Name,
            "Country Name": row.Country_Name,
            "State Name": row.State_Name,
            "City Name": row.City_Name,
            "Vendor Name": row.Vendor_Name,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'International Zone');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const file = new Blob(
            [excelBuffer],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }
        );

        saveAs(file, 'internationalZone.xlsx');
    };


    const handleExportzonePDF = () => {
        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text('International Zone Data', 14, 20);

        const headers = [['index', 'Vendor Name', 'Mode', 'Zone', 'Country', 'State', 'City']];

        // Prepare table rows exactly like your table columns
        const pdfData = currentRows.map((item, index) => [
            index + 1,           // Sr.No
            item.Vendor_Name,
            item.Mode_Name,
            item.Zone_Name,
            item.Country_Name,
            item.State_Name,
            item.City_Name,
        ]);

        autoTable(pdf,
            {
                head: headers,
                body: pdfData,
                startY: 30,
                theme: 'grid'
            });

        pdf.save('internationalZone.pdf');
    };


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = multipleCity.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(multipleCity.length / rowsPerPage);
    const filteredRows = currentRows.filter((d) => {
        const q = searchQuery.toLowerCase();

        return (
            (d.Mode_Name || "").toLowerCase().includes(q) ||
            (d.Zone_Name || "").toLowerCase().includes(q) ||
            (d.Country_Name || "").toLowerCase().includes(q) ||
            (d.State_Name || "").toLowerCase().includes(q) ||
            (d.City_Name || "").toLowerCase().includes(q) ||
            (d.Vendor_Name || "").toLowerCase().includes(q)
        );
    });


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
                                ID: '',
                                VendorCode: '',
                                ModeCode: '',
                                ZoneCode: '',
                                CountryCode: '',
                                StateCode: '',
                                CityCode: '',
                                ProductType: '',
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
                        <input className="add-input" type="text" placeholder="search"
                            value={searchQuery} onChange={handleSearchChange} />
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
                            {filteredRows.map((multiple, index) => (
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
                                                        ID: multiple.ID,
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
                                                    handleDelete(multiple.ID);
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
                                <div className="fields2" style={{whiteSpace:"nowrap"}}>

                                    {/* City Name */}
                                    <div className="input-field1">
                                        <label>City Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getCity.map(city => ({
                                                value: city.City_Code,
                                                label: city.City_Name,
                                            }))}
                                            value={
                                                addCity.CityCode
                                                    ? {
                                                        value: addCity.CityCode,
                                                        label: getCity.find(c => c.City_Code === addCity.CityCode)?.City_Name,
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    CityCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select City Name"
                                            isSearchable={true}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    {/* Zone Name */}
                                    <div className="input-field1">
                                        <label>Zone Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getZone.map(zone => ({
                                                value: zone.Zone_Code,
                                                label: zone.Zone_Name,
                                            }))}
                                            value={
                                                addCity.ZoneCode
                                                    ? {
                                                        value: addCity.ZoneCode,
                                                        label: getZone.find(z => z.Zone_Code === addCity.ZoneCode)?.Zone_Name,
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    ZoneCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Zone"
                                            isSearchable={true}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    {/* Mode Name */}
                                    <div className="input-field1">
                                        <label>Mode Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getMode.map(mode => ({
                                                value: mode.Mode_Code,
                                                label: mode.Mode_Name,
                                            }))}
                                            value={
                                                addCity.ModeCode
                                                    ? {
                                                        value: addCity.ModeCode,
                                                        label: getMode.find(m => m.Mode_Code === addCity.ModeCode)?.Mode_Name,
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    ModeCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Mode"
                                            isSearchable={true}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    {/* State Name */}
                                    <div className="input-field1">
                                        <label>State Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getState.map(state => ({
                                                value: state.State_Code,
                                                label: state.State_Name,
                                            }))}
                                            value={
                                                addCity.StateCode
                                                    ? {
                                                        value: addCity.StateCode,
                                                        label: getState.find(s => s.State_Code === addCity.StateCode)?.State_Name,
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    StateCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select State"
                                            isSearchable={true}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    {/* Vendor Name */}
                                    <div className="input-field1">
                                        <label>Vendor Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getVendor.map(vendor => ({
                                                value: vendor.Vendor_Code,
                                                label: vendor.Vendor_Name,
                                            }))}
                                            value={
                                                addCity.VendorCode
                                                    ? {
                                                        value: addCity.VendorCode,
                                                        label: getVendor.find(v => v.Vendor_Code === addCity.VendorCode)?.Vendor_Name,
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    VendorCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Vendor"
                                            isSearchable={true}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    {/* Country Name */}
                                    <div className="input-field1">
                                        <label>Country Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getCountry.map(country => ({
                                                value: country.Country_Code,
                                                label: country.Country_Name,
                                            }))}
                                            value={
                                                addCity.CountryCode
                                                    ? {
                                                        value: addCity.CountryCode,
                                                        label: getCountry.find(c => c.Country_Code === addCity.CountryCode)?.Country_Name,
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    CountryCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Country"
                                            isSearchable={true}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    {/* Product Type */}
                                    <div className="input-field1">
                                        <label>Product Type</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={[
                                                { value: "International", label: "International" },
                                                { value: "Domestic", label: "Domestic" },
                                            ]}
                                            value={
                                                addCity.ProductType
                                                    ? {
                                                        value: addCity.ProductType,
                                                        label: addCity.ProductType,
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    ProductType: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Product Type"
                                            isSearchable={true}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
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