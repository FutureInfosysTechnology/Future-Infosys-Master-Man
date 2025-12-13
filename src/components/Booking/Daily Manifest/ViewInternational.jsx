    import React, { useState, useEffect } from "react";
    import { getApi, deleteApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
    import Modal from 'react-modal';
    import Swal from "sweetalert2";
    import DatePicker from 'react-datepicker';
    import "react-datepicker/dist/react-datepicker.css";
    import Select from 'react-select';
    import 'react-toggle/style.css';
    import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
    import {useLocation, useNavigate} from "react-router-dom"

    function ViewInternational() {
        const navigate=useNavigate()
        const location=useLocation();
        //  const [rowsPerPage, setRowsPerPage] = useState(10);
        const [totalRecords, setTotalRecords] = useState(0);
        const [loading, setLoading] = useState(true);
        const [openRow, setOpenRow] = useState(null);
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

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormValues({
                ...formValues,
                [name]: value
            });
        };
        const fetchData = async (endpoint, params) => {
            try {
                const response = await getApi(endpoint, { params });
                console.log(response.data);
                const manifestData = extractArray(response);

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
                pageSize: rowsPerPage
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
                    sessionLocationCode:JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
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
        navigate("/intmanifestpdf",{state:{data:manifestData,from: location.pathname}});
        };
        return (
            <>
                <div className="body">
                    <div className="container1">
                        <form action="" onSubmit={handleSubmit} style={{background:" #f2f4f3"}}>
                            <div className="fields2" >
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
                                    <label htmlFor="">From</label>
                                    <DatePicker
                                        portalId="root-portal"
                                        selected={formValues.fromDate}
                                        onChange={(date) => handleDateChange(date, "fromDate")}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control form-control-sm"
                                    />
                                </div>

                                <div className="input-field3">
                                    <label htmlFor="">To</label>
                                    <DatePicker
                                        portalId="root-portal"
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
                                <table className='table table-bordered table-sm' style={{whiteSpace:"nowrap"}}>
                                    <thead>
                                        <tr>
                                            <th>Actions</th>
                                            <th>Sr.No</th>
                                            <th>Manifest.No</th>
                                            <th>Manifest.Date</th>
                                            <th>Customer.Name</th>
                                            <th>Consignee.Name</th>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Vendor.Name</th>
                                            <th>Dkt.Count</th>
                                            <th>Mode</th>
                                            <th>Qty</th>
                                            <th>Weight</th>
                                            <th>Vehicle.No</th>
                                            <th>Driver.Name</th>
                                            <th>Driver.Mobile</th>
                                            <th>Remark</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {getManifestData.map((manifest, index) => (
                                            <tr key={index} style={{ fontSize: "12px", position: "relative" }}>
                                                <td>
                                                    <PiDotsThreeOutlineVerticalFill
                                                        style={{ fontSize: "20px", cursor: "pointer" }}
                                                        onClick={() =>
                                                            setOpenRow(openRow === index ? null : index) // toggle only this row
                                                        }
                                                    />

                                                    {openRow === index && (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                flexDirection:"row",
                                                                position: "absolute",
                                                                alignItems:"center",
                                                                left: "50px",
                                                                top: "0px",
                                                                borderRadius:"10px",
                                                                backgroundColor:"white",
                                                                zIndex:"9999",
                                                                height:"30px",
                                                                width:"50px",
                                                                padding:"10px"
                                                            }}
                                                        >
                                                            <button
                                                                className="edit-btn"
                                                                style={{marginLeft:"10px",backgroundColor:"transparent"}}
                                                                onClick={() => handleOpenManifestPrint(manifest)}
                                                            >
                                                                <i
                                                                    className="bi bi-file-earmark-pdf-fill"
                                                                    style={{ fontSize: "18px" }}
                                                                ></i>
                                                            </button>
                                                            <button 
                                                            className="edit-btn"
                                                            style={{backgroundColor:"transparent"}}
                                                            onClick={handleOpenDeleteModal}
                                                            >
                                                                <i className="bi bi-trash" style={{ fontSize: "18px" }}></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td>{index + 1}</td>
                                                <td>{manifest.manifestNo}</td>
                                                <td>{manifest.manifestDt}</td>
                                                <td>{manifest.Client_Name}</td>
                                                <td>{manifest.Consignee_Name}</td>
                                                <td>{manifest.fromDest}</td>
                                                <td>{manifest.toDest}</td>
                                                <td>{manifest.vendorName}</td>
                                                <td>{manifest.shipment}</td>
                                                <td>{manifest.Mode_Name}</td>
                                                <td>{manifest.sumQty}</td>
                                                <td>{manifest.sumActualWt}</td>
                                                <td>{manifest.vehicleNo}</td>
                                                <td>{manifest.driverName}</td>
                                                <td>{manifest.driverMobile}</td>
                                                <td>{manifest.Remark}</td>
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

    export default ViewInternational;