import React, { useState, useEffect } from "react";
import { getApi, deleteApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'react-toggle/style.css';

function ViewManifest() {


    //  const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const formatDate = (date) => date ? date.toISOString().split("T")[0] : null;
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [getCity, setGetCity] = useState([]);
    const [getManifestData, setGetManifestData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState({ manifestNo: "", docketNo: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        manifestNo: '',
        manifestDest: '',
        fromDate: firstDayOfMonth,
        toDate: today,
    });
    const extractArray = (res) => {
        if (Array.isArray(res?.Data)) return res.Data;
        if (Array.isArray(res?.data)) return res.data;
        return [];
    };
    const handleDateChange = (date, field) => {
        setFormValues({ ...formValues, [field]: date });
    };
    const fetchData = async (endpoint, params) => {
        try {
            const response = await getApi(endpoint, { params });
            console.log(response.data);
            const manifestData = extractArray(response.data);

            if (manifestData.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Data Found',
                    text: 'No data available for the selected date range.',
                    showConfirmButton: true,
                });
            }
            setGetManifestData(manifestData);
        } catch (err) {
            console.error('Fetch Manifest Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const params = {
            sessionLocationCode: 'MUM',
            manifestNo: formValues.manifestNo,
            manifestDest: formValues.manifestDest,
            fromDate: formValues.fromDate,
            toDate: formValues.toDate,
            pageNumber: currentPage,
            pageSize: 10
        };
        fetchData('/Manifest/viewManifestData', params);
    };
       const fetchDataC = async (endpoint) => {
            try {
                const response = await getApi(endpoint);
                setGetCity(extractArray(response));
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
    
        useEffect(() => {
                fetchDataC('/Master/getdomestic');
            }, []);


    const rowsPerPage = 10;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = getManifestData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(getManifestData.length / rowsPerPage);
    console.log(currentPage);
    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);


    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const { manifestNo, docketNo } = deleteInput;

            if (!manifestNo) {
                Swal.fire({ icon: "warning", text: "Please enter Manifest No" });
                return;
            }

            if (manifestNo && !docketNo) {
                await deleteApi(
                    `/Manifest/deleteManifest?inputName=deleteByManifestNo&sessionLocationCode=MUM&manifestNo=${manifestNo}`
                );
                Swal.fire({ icon: "success", text: "Manifest deleted!" });
            } else if (manifestNo && docketNo) {
                await deleteApi(
                    `/Manifest/deleteManifest?inputName=deleteByDocket&sessionLocationCode=MUM&manifestNo=${manifestNo}&DocketNo=${docketNo}`
                );
                Swal.fire({ icon: "success", text: "Docket deleted from Manifest!" });
            }

            setShowModal(false);

            fetchData("/Manifest/viewManifestData", {
                sessionLocationCode: "MUM",
                manifestNo: formValues.manifestNo,
                manifestDest: formValues.manifestDest,
                fromDate: formValues.fromDate,
                toDate: formValues.toDate,
                pageNumber: currentPage,
                pageSize: 10,
            });
        } catch (err) {
            console.error("Delete Error:", err);
            Swal.fire({ icon: "error", text: "Failed to delete data!" });
        }
    };
    const handleDeleteInputChange = (e) => {
        const { name, value } = e.target;
        setDeleteInput({ ...deleteInput, [name]: value });
    };

    const handleOpenDeleteModal = () => {
        setDeleteInput({ manifestNo: "", docketNo: "" });
        setShowModal(true);
    };

    const handleOpenManifestPrint = (manifestData) => {
        const manifestNo = manifestData.manifestNo;
        const sumQty = manifestData.sumQty;
        const sumActualWt = manifestData.sumActualWt;
        const url = `/manifest?manifestNo=${encodeURIComponent(manifestNo)}&sumQty=${encodeURIComponent(sumQty)}&sumActualWt=${encodeURIComponent(sumActualWt)}`;

        const newWindow = window.open(
            url,
            '_blank', 'width=900,height=600,fullscreen=yes'
        );

        if (newWindow) {
            newWindow.focus();
        }
    };
    return (
        <>
            <div className="body">
                <div className="container1">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="fields2">
                            <div className="input-field3">
                                <label htmlFor="">Manifest No</label>
                                <input type="tel" placeholder="Manifest No" value={formValues.manifestNo}
                                    onChange={handleInputChange} name="manifestNo" />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Destination</label>
                                <Select
                                    options={getCity.map(city => ({
                                        value: city.City_Code,   // adjust keys from your API
                                        label: city.City_Name
                                    }))}
                                    value={
                                        formValues.manifestDest
                                            ? { value: formValues.manifestDest, label: getCity.find(c => c.City_Code === formValues.manifestDest)?.City_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormValues({
                                            ...formValues,
                                            manifestDest: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Destination"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                     menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                                                }}
                                />
                            </div>


                            <div className="input-field3">
                                <label htmlFor="">From</label>
                                <DatePicker
                                    selected={formValues.fromDate}
                                    onChange={(date) => handleDateChange(date, "fromDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">To</label>
                                <DatePicker
                                    selected={formValues.toDate}
                                    onChange={(date) => handleDateChange(date, "toDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="bottom-buttons" style={{ marginTop: "18px" }}>
                                <button className="ok-btn" style={{ height: "35px" }} type="submit">Submit</button>
                            </div>
                        </div>

                    </form>

                    <div className="addNew" style={{ justifyContent: "end", paddingRight: "10px" }}>
                        <div className="search-input">
                            <input className="add-input" type="text" placeholder="search" />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (<div className="loader"></div>) : (
                        <div className='table-container'>
                            <table className='table table-bordered table-sm'>
                                <thead className='table-sm'>
                                    <tr>
                                        <th scope="col">Sr.No</th>
                                        <th scope="col">Vendor.Name</th>
                                        <th scope="col">Manifest.No</th>
                                        <th scope="col">Customer.Name</th>
                                        <th scope="col">Receiver.Name</th>
                                        <th scope="col">Manifest.Date</th>
                                        <th scope="col">From</th>
                                        <th scope="col">To</th>
                                        <th scope="col">Dkt.Count</th>
                                        <th scope="col">Mode</th>
                                        <th scope="col">Qty</th>
                                        <th scope="col">Weight</th>
                                        <th scope="col">Vehicle.No</th>
                                        <th scope="col">Driver.Name</th>
                                        <th scope="col">Driver.Mobile</th>
                                        <th scope="col">Remark</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {currentRows.map((manifest, index) => (
                                        <tr key={index} style={{ fontSize: "12px" }}>
                                            <td>{index + 1}</td>
                                            <td>{manifest.vendorName}</td>
                                            <td>{manifest.manifestNo}</td>
                                            <td>{manifest.vendorName}</td>
                                            <td>{manifest.vendorName}</td>
                                            <td style={{ width: "100px" }}>{manifest.manifestDt}</td>
                                            <td>{manifest.fromDest}</td>
                                            <td>{manifest.toDest}</td>
                                            <td>{manifest.shipment}</td>
                                            <td>{manifest.mode}</td>
                                            <td>{manifest.sumQty}</td>
                                            <td>{manifest.sumActualWt}</td>
                                            <td>{manifest.vehicleNo}</td>
                                            <td>{manifest.driverName}</td>
                                            <td>{manifest.driverMobile}</td>
                                            <td>{manifest.Remark}</td>
                                            <td>
                                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                    <button className='edit-btn' onClick={() => handleOpenManifestPrint(manifest)}>
                                                        <i className='bi bi-file-earmark-pdf-fill' style={{ fontSize: "24px" }}></i>
                                                    </button>
                                                    <button className="edit-btn" onClick={handleOpenDeleteModal}>
                                                        <i className='bi bi-trash' style={{ fontSize: "24px" }}></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>)}

                    <div className="pagination">
                        <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            {'<'}
                        </button>
                        <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                        <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            {'>'}
                        </button>
                    </div>


                    <Modal overlayClassName="custom-overlay" isOpen={showModal}
                        className="custom-modal-gst" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle" style={{ display: "flex", flexDirection: "row" }}>
                                <header style={{ width: "95%", textAlign: "center" }}>Delete Manifest Data</header>
                                <button className="ok-btn" style={{ width: "40px", height: "100%", backgroundColor: "red" }}
                                    onClick={() => setShowModal(false)}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className='container2' style={{ padding: "20px" }}>

                                <form action="" style={{ backgroundColor: "white" }}>
                                    <div className="fields2">
                                        <div className="input-field">
                                            <label>Manifest No:</label>
                                            <input
                                                type="text"
                                                name="manifestNo"
                                                value={deleteInput.manifestNo}
                                                onChange={handleDeleteInputChange}
                                                placeholder="Enter Manifest No"
                                            />
                                        </div>

                                        <div className="input-field">
                                            <label>Docket No:</label>
                                            <input
                                                type="text"
                                                name="docketNo"
                                                value={deleteInput.docketNo}
                                                onChange={handleDeleteInputChange}
                                                placeholder="Enter Docket No"
                                            />
                                        </div>
                                    </div>

                                    <div className="bottom-buttons">
                                        <button className="ok-btn" type="button" onClick={handleDelete}>Delete</button>
                                        <button className="ok-btn" type="button" onClick={() => setShowModal(false)}>Cancel</button>
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

export default ViewManifest;