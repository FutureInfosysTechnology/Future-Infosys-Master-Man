import React, { useState, useEffect } from "react";
import '../../Tabs/tabs.css';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import Select from "react-select";
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


function PinCode() {

    const [openRow, setOpenRow] = useState(null);
    const [getPinCode, setGetPinCode] = useState([]);      // To Get Pin Code Data
    const [zones, setZones] = useState([]);                // To Get Zone Data
    const [getCity, setGetCity] = useState([]);            //To Get City Data
    const [getState, setGetState] = useState([]);          //To Get State Data
    const [getVendor, setGetVendor] = useState([]);        // To Get Vendor Data
    const [getCountry, setGetCountry] = useState([]);      //To Get Country Data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addData, setAddData] = useState({
        pinCode: '',
        areaName: '',
        cityCode: '',
        zoneCode: '',
        stateCode: '',
        vendorCode: '',
        pickUp: '',
        odaOpa: '',
        cod: '',
        km: '',
        service: ''
    })


    const filteredgetPinCode = getPinCode.filter((pin) =>
        (pin && pin.Pincode && pin.Pincode.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pin && pin.Area_Name && pin.Area_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pin && pin.City_Name && pin.City_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pin && pin.ODA_OPA && pin.ODA_OPA.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pin && pin.Serviceable && pin.Serviceable.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pin && pin.Zone_Name && pin.Zone_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pin && pin.State_Name && pin.State_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pin && pin.Vendor_Name && pin.Vendor_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pin && pin.Country_Name && pin.Country_Name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetPinCode.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetPinCode.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };



    const fetchPinCodeData = async () => {
        try {
            const response = await getApi('/Master/Getpincode');
            setGetPinCode(Array.isArray(response.Data) ? response.Data : []);
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
            setZones(Array.isArray(response.Data) ? response.Data : []);
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
        fetchPinCodeData();
        fetchZoneData();
        fetchCityData();
        fetchStateData();
        fetchCountryData();
        fetchVendorData();
    }, []);



    const handleSavePinCode = async (e) => {
        e.preventDefault();
        const errors = [];

        if (!addData.pinCode) errors.push("Pin Code is required");
        if (!addData.areaName) errors.push("Area  is required");
        if (!addData.stateCode) errors.push("State is required");
        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: errors.map(err => `<div>${err}</div>`).join(''),
            });
            return;
        }
        const requestBody = {
            pincode: addData.pinCode,
            AreaName: addData.areaName,
            cityCode: addData.cityCode,
            zoneCode: addData.zoneCode,
            stateCode: addData.stateCode,
            vendorCode: addData.vendorCode,
            pickupDelivery: addData.pickUp,
            odaOpa: addData.odaOpa,
            cod: addData.cod,
            km: addData.km,
            serviceable: addData.service
        }

        try {
            const response = await postApi('/Master/addPincode', requestBody, 'POST');
            if (response.status === 1) {
                setGetPinCode([...getPinCode, response.Data]);
                setAddData({
                    pinCode: '',
                    areaName: '',
                    cityCode: '',
                    zoneCode: '',
                    stateCode: '',
                    vendorCode: '',
                    pickUp: '',
                    odaOpa: '',
                    cod: '',
                    km: '',
                    service: ''
                })
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchPinCodeData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Pin Code data', 'error');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            Pincode: addData.pinCode || "",
            AreaName: addData.areaName || "",
            CityCode: addData.cityCode || "",
            ZoneCode: addData.zoneCode || "",
            StateCode: addData.stateCode || "",
            VendorCode: addData.vendorCode || "",
            PickupDelivery: addData.pickUp || "",
            ODAOPA: addData.odaOpa || "",
            COD: addData.cod || "",
            KM: addData.km || "",
            Serviceable: addData.service || ""
        }

        try {
            const response = await postApi('/Master/UpdatePinCode', requestBody, 'POST');
            if (response.status === 1) {
                setGetPinCode(getPinCode.map((pincode) => pincode.Pincode === addData.pinCode ? response.Data : pincode));
                setAddData({
                    pinCode: '',
                    areaName: '',
                    cityCode: '',
                    zoneCode: '',
                    stateCode: '',
                    vendorCode: '',
                    pickUp: '',
                    odaOpa: '',
                    cod: '',
                    km: '',
                    service: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchPinCodeData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the Pin Code.', 'error');
            }
        } catch (error) {
            console.error("Failed to update Pin Code:", error);
            Swal.fire('Error', 'Failed to update Pin Code data', 'error');
        }
    };

    const handleDeletePinCode = async (Pincode) => {
        try {
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (confirmation.isConfirmed) {
                await deleteApi(`/Master/DeletePincode?Pincode=${Pincode}`);
                setGetPinCode(getPinCode.filter((pin) => pin.Pincode !== Pincode));
                Swal.fire('Deleted!', 'Pin Code has been deleted.', 'success');
                await fetchPinCodeData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Pin Code', 'error');
        }
    };



    /**************** function to export table data in excel and pdf ************/
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getPinCode);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getPinCode');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getPinCode.xlsx');
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
            pdf.save('getPinCode.pdf');
        });
    };


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
                            setAddData({
                                pinCode: '', areaName: '', cityCode: '', zoneCode: '', stateCode: '',
                                vendorCode: '', pickUp: '', odaOpa: '', cod: '', km: '', service: ''
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
                                <th scope="col">Pin_Code</th>
                                <th scope="col">Area_Name</th>
                                <th scope="col">City Name</th>
                                <th scope="col">ODA/OPA</th>
                                <th scope="col">Servicable</th>
                                <th scope="col">Zone Name</th>
                                <th scope="col">State Name</th>
                                <th scope="col">Vendor Name</th>
                                <th scope="col">Country Name</th>

                            </tr>
                        </thead>
                        <tbody className='table-body'>

                            {currentRows.map((pin, index) => (
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
                                                setAddData({
                                                    pinCode: pin.Pincode,
                                                    areaName: pin.Area_Name,
                                                    cityCode: pin.City_Code,
                                                    odaOpa: pin.ODA_OPA,
                                                    service: pin.Serviceable,
                                                    zoneCode: pin.Zone_Code,
                                                    stateCode: pin.State_Code,
                                                    vendorCode: pin.Vendor_Code,
                                                    km: pin.KM
                                                });
                                                setModalIsOpen(true);
                                            }}>
                                                <i className='bi bi-pen'></i>
                                            </button>
                                            <button className='edit-btn' onClick={() => handleDeletePinCode(pin.Pincode)}><i className='bi bi-trash'></i></button>
                                            </div>
                                        )}
                                    </td>

                                    <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                    <td>{pin.Pincode}</td>
                                    <td>{pin.Area_Name}</td>
                                    <td>{pin.City_Name}</td>
                                    <td>{pin.ODA_OPA}</td>
                                    <td>{pin.Serviceable}</td>
                                    <td>{pin.Zone_Name}</td>
                                    <td>{pin.State_Name}</td>
                                    <td>{pin.Vendor_Name}</td>
                                    <td>{pin.Country_Name}</td>

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
                            <header>Pin Code Master</header>
                        </div>

                        <div className='container2'>
                            <form onSubmit={handleSavePinCode}>

                                <div className="fields2">
                                    <div className="input-field1">
                                        <label htmlFor="">Pin Code</label>
                                        <input type="tel" id="pincode" name="pincode" maxLength="6"
                                            placeholder="Pin Code"
                                            value={addData.pinCode}
                                            onChange={(e) => setAddData({ ...addData, pinCode: e.target.value })}
                                            readOnly={isEditMode} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Area Name</label>
                                        <input type="text" placeholder="Area Name" value={addData.areaName}
                                            onChange={(e) => setAddData({ ...addData, areaName: e.target.value })} />
                                    </div>
                                    <div className="input-field1">
                                        <label>City Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getCity.map((city) => ({
                                                value: city.City_Code,
                                                label: city.City_Name,
                                            }))}
                                            value={
                                                addData.cityCode
                                                    ? {
                                                        value: addData.cityCode,
                                                        label:
                                                            getCity.find((c) => c.City_Code === addData.cityCode)
                                                                ?.City_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    cityCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select City"
                                            isSearchable
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    <div className="input-field1">
                                        <label>Zone Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={zones.map((zone) => ({
                                                value: zone.Zone_Code,
                                                label: zone.Zone_Name,
                                            }))}
                                            value={
                                                addData.zoneCode
                                                    ? {
                                                        value: addData.zoneCode,
                                                        label:
                                                            zones.find((z) => z.Zone_Code === addData.zoneCode)
                                                                ?.Zone_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    zoneCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Zone Code"
                                            isSearchable
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    <div className="input-field1">
                                        <label>State Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getState.map((state) => ({
                                                value: state.State_Code,
                                                label: state.State_Name,
                                            }))}
                                            value={
                                                addData.stateCode
                                                    ? {
                                                        value: addData.stateCode,
                                                        label:
                                                            getState.find((s) => s.State_Code === addData.stateCode)
                                                                ?.State_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    stateCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select State"
                                            isSearchable
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    <div className="input-field1">
                                        <label>Vendor Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getVendor.map((vendor) => ({
                                                value: vendor.Vendor_Code,
                                                label: vendor.Vendor_Name,
                                            }))}
                                            value={
                                                addData.vendorCode
                                                    ? {
                                                        value: addData.vendorCode,
                                                        label:
                                                            getVendor.find(
                                                                (v) => v.Vendor_Code === addData.vendorCode
                                                            )?.Vendor_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    vendorCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Vendor Name"
                                            isSearchable
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>


                                    <div className="input-field1">
                                        <label htmlFor="">Kilometers</label>
                                        <input type="text" placeholder="Km" value={addData.km}
                                            onChange={(e) => setAddData({ ...addData, km: e.target.value })} />
                                    </div>

                                    <div className="input-field1">
                                        <label>Service/ODA</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={[
                                                { value: "Yes", label: "Yes" },
                                                { value: "No", label: "No" },
                                            ]}
                                            value={
                                                addData.service
                                                    ? { value: addData.service, label: addData.service }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    service: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Services"
                                            isSearchable={false}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    <div className="input-field1">
                                        <label>ODA/OPA</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={[
                                                { value: "ODA", label: "ODA" },
                                                { value: "OPA", label: "OPA" },
                                            ]}
                                            value={
                                                addData.odaOpa
                                                    ? { value: addData.odaOpa, label: addData.odaOpa }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    odaOpa: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select ODA/OPA"
                                            isSearchable={false}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    <div className="input-field1">
                                        <label>COD</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={[
                                                { value: "Yes", label: "Yes" },
                                                { value: "No", label: "No" },
                                            ]}
                                            value={
                                                addData.cod
                                                    ? { value: addData.cod, label: addData.cod }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    cod: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select COD"
                                            isSearchable={false}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    <div className="input-field1">
                                        <label>Pickup/Delivery</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={[
                                                { value: "Yes", label: "Yes" },
                                                { value: "No", label: "No" },
                                            ]}
                                            value={
                                                addData.pickUp
                                                    ? { value: addData.pickUp, label: addData.pickUp }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    pickUp: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Pickup/Delivery"
                                            isSearchable={false}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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

export default PinCode;