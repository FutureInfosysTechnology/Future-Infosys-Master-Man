import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import Swal from "sweetalert2";


function CreateDrs() {

    const [getData, setGetData] = useState([]);
    const [empData, setEmpData] = useState([]);
    const [getCity, setGetCity] = useState([]);
    const [vehicleData, setVehicleData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedManifestRows, setSelectedManifestRows] = useState([]);
    const [selectedDocketNos, setSelectedDocketNos] = useState([]);
    const [formData, setFormData] = useState({
        DocketNo: "",
        vehicleNo: "",
        empName: "",
        cityName: "",
        mobileNo: ""
    })

    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            setData(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData('/Master/VehicleMaster', setVehicleData);
        fetchData('/Master/GetEmployee', setEmpData);
        fetchData('/Master/getdomestic', setGetCity);
    }, [])


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getApi(`/Runsheet/getPendingRunsheet?sessionLocationCode=DEL&pageNumber=${currentPage}&pageSize=${rowsPerPage}`);
                const currentPageData = Array.isArray(response.data) ? response.data : [];
                setGetData(currentPageData);

                const allDataResponse = await getApi(`/Runsheet/getPendingRunsheet?sessionLocationCode=DEL&pageNumber=1&pageSize=10000`);
                const allData = Array.isArray(allDataResponse.data) ? allDataResponse.data : [];
                setTotalRecords(allData.length);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, rowsPerPage]);


    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const filteredgetData = getData.filter((runsheet) =>
        (runsheet && runsheet.DocketNo && runsheet.DocketNo.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (runsheet && runsheet.customerName && runsheet.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || '')

    );

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedRows(getData.map((_, index) => index));
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelect = (index, DocketNo) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
            setSelectedDocketNos(selectedDocketNos.filter(docket => docket !== DocketNo));
            setSelectedManifestRows(selectedManifestRows.filter(row => row.DocketNo !== DocketNo));
        } else {
            setSelectedRows([...selectedRows, index]);
            setSelectedDocketNos([...selectedDocketNos, DocketNo]);
            setSelectedManifestRows([
                ...selectedManifestRows,
                getData.find(runsheet => runsheet.DocketNo === DocketNo)
            ]);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDocketNoSelect = () => {
        setFormData((prevData) => ({
            ...prevData,
            DocketNo: selectedDocketNos,
        }));
        setModalIsOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedDocketNos.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select at least one Docket No before submitting the form.',
            });
            return;
        }

        const payload = {
            sessionLocationCode: "DEL",
            VehicleNo: formData.vehicleNo,
            employeeCode: formData.empName,
            Area: formData.cityName,
            EmployeeMobile: formData.mobileNo,
            DocketNo: formData.DocketNo
        };

        try {
            const response = await postApi('Runsheet/generateRunsheet', payload);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Data has been successfully generated!',
                timer: 2000,
                showConfirmButton: true,
            });

            setFormData({
                vehicleNo: "",
                empName: "",
                cityName: "",
                mobileNo: "",
                DocketNo: []
            });
            setSelectedManifestRows([]);
            setSelectedRows([]);
        } catch (error) {
            console.error("error submitting DRS:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while generating data. Please try again.',
            });
        }
    }

    return (
        <>
            <div className="container1">

                <form onSubmit={handleSubmit}>
                    <div className="fields2">
                        <div className="input-field3" >
                            <label htmlFor="">Vehicle No</label>
                            <select name="vehicleNo" value={formData.vehicleNo}
                                onChange={handleFormChange} required>
                                <option value="" disabled>Vehicle No</option>
                                {vehicleData.map((vehicle, index) => (
                                    <option value={vehicle.vehicle_number} key={index}>{vehicle.vehicle_number}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-field3" >
                            <label htmlFor="">Employee Name</label>
                            <select name="empName" value={formData.empName}
                                onChange={handleFormChange} required>
                                <option value="" disabled>Select Employee</option>
                                {empData.map((emp, index) => (
                                    <option value={emp.Employee_Code} key={index}>{emp.Employee_Name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-field3" >
                            <label htmlFor="">City</label>
                            <select name="cityName" value={formData.cityName}
                                onChange={handleFormChange} required>
                                <option value="" disabled>Select City</option>
                                {getCity.map((city, index) => (
                                    <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-field3" >
                            <label htmlFor="">Mobile No</label>
                            <input type="tel" maxLength={10} placeholder="Mobile No"
                                value={formData.mobileNo}
                                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })} />
                        </div>

                        <div className="input-field3" >
                            <label htmlFor="">Bulk Docket Manifest</label>
                            <button type="button" className="ok-btn" style={{ height: "35px", width: "100%", fontSize: "14px" }}
                                onClick={() => { setModalIsOpen(true) }}>Bulk Docket Manifest</button>
                        </div>

                        <div className="input-field3" >
                            <label htmlFor=""></label>
                            <div style={{ display: "flex", flexDirection: "row", marginTop: "18px" }}>
                                <button type="submit" className="ok-btn" style={{ height: "35px", width: "50%", marginRight: "5px" }}>Generate</button>
                                <button type="button" className="ok-btn" style={{ width: "45%", marginLeft: "5px" }}>Reset</button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className='table-container'>
                    <table className='table table-bordered table-sm'>
                        <thead className='table-sm'>
                            <tr>
                                <th scope="col">Sr.No</th>
                                <th scope="col">Docket.No</th>
                                <th scope="col">Booking.Date</th>
                                <th scope="col">Manifest.No</th>
                                <th scope="col">Customer.Name</th>
                                <th scope="col">Receiver.Name</th>
                                <th scope="col">From</th>
                                <th scope="col">To</th>
                                <th scope="col">Qty</th>
                                <th scope="col">Act.Weight</th>
                                <th scope="col">Total.Amount</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            {selectedManifestRows.map((runsheet, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{runsheet.DocketNo}</td>
                                    <td>{runsheet.bookDate}</td>
                                    <td>{runsheet.manifestNo}</td>
                                    <td>{runsheet.customerName}</td>
                                    <td>{runsheet.consigneeName}</td>
                                    <td>{runsheet.OriginName}</td>
                                    <td>{runsheet.DestinationName}</td>
                                    <td>{runsheet.Qty}</td>
                                    <td>{runsheet.ActualWt}</td>
                                    <td>{runsheet.totalAmt}</td>
                                    <td>{runsheet.Status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: "flex", flexDirection: "row" }}>
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
                            style={{ height: "40px", width: "60px", marginTop: "10px" }}
                            id="rowsPerPage"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={200}>200</option>
                            <option value={500}>500</option>
                        </select>
                    </div>
                </div>

                <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                    className="custom-modal-createmanifest" contentLabel="Modal">
                    <div className="custom-modal-content">
                        <div className="header-tittle" style={{ display: "flex", flexDirection: "row" }}>
                            <header style={{ width: "95%", textAlign: "center" }}>Pending Manifest Data</header>
                            <button className="ok-btn" style={{ width: "5%", height: "100%", backgroundColor: "red" }}
                                onClick={() => setModalIsOpen(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className='container2' style={{ borderRadius: "0px", padding: "20px" }}>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div className="search-input">
                                    <input className="add-input" type="text" placeholder="search"
                                        value={searchQuery} onChange={handleSearchChange} />
                                    <button type="submit" title="search">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>

                                <div className="bottom-buttons" style={{ marginTop: "0px", marginLeft: "255px" }}>
                                    <button style={{ marginTop: "0px" }} className="ok-btn"
                                        onClick={handleDocketNoSelect} >Submit</button>
                                </div>
                            </div>
                            <div className='table-container'>
                                <table className='table table-bordered table-sm'>
                                    <thead className='table-sm'>
                                        <tr>
                                            <th scope="col">
                                                <input type="checkbox" style={{ height: "15px", width: "15px" }}
                                                    checked={selectAll} onChange={handleSelectAll} />
                                            </th>
                                            <th scope="col">Sr.No</th>
                                            <th scope="col">Docket.No</th>
                                            <th scope="col">Booking.Date</th>
                                            <th scope="col">Manifest.No</th>
                                            <th scope="col">Customer.Name</th>
                                            <th scope="col">Receiver.Name</th>
                                            <th scope="col">From</th>
                                            <th scope="col">To</th>
                                            <th scope="col">Qty</th>
                                            <th scope="col">Act.Weight</th>
                                            <th scope="col">Total.Amount</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-body'>
                                        {filteredgetData.map((runsheet, index) => (
                                            <tr key={index}>
                                                <td scope="col">
                                                    <input type="checkbox" style={{ height: "15px", width: "15px" }}
                                                        checked={selectedRows.includes(index)}
                                                        onChange={() => handleRowSelect(index, runsheet.DocketNo)} />
                                                </td>
                                                <td>{index + 1}</td>
                                                <td>{runsheet.DocketNo}</td>
                                                <td>{runsheet.bookDate}</td>
                                                <td>{runsheet.manifestNo}</td>
                                                <td>{runsheet.customerName}</td>
                                                <td>{runsheet.consigneeName}</td>
                                                <td>{runsheet.OriginName}</td>
                                                <td>{runsheet.DestinationName}</td>
                                                <td>{runsheet.Qty}</td>
                                                <td>{runsheet.ActualWt}</td>
                                                <td>{runsheet.totalAmt}</td>
                                                <td>{runsheet.Status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: "flex", flexDirection: "row" }}>
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
                                        style={{ height: "40px", width: "60px", marginTop: "10px" }}
                                        id="rowsPerPage"
                                        value={rowsPerPage}
                                        onChange={handleRowsPerPageChange}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={200}>200</option>
                                        <option value={500}>500</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal >
            </div>

        </>
    );
};

export default CreateDrs;