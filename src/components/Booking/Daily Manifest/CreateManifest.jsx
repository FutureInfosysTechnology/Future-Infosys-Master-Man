import React, { useEffect, useState } from "react";
import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import Modal from 'react-modal';
import Swal from "sweetalert2";



function CreateManifest() {

    const [getTransport, setGetTransport] = useState([]);
    const [getVehicle, setGetVehicle] = useState([]);
    const [getDriver, setGetDriver] = useState([]);
    const [getVendor, setGetVendor] = useState([]);
    const [getCity, setGetCity] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [getManifest, setGetManifest] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDocketNos, setSelectedDocketNos] = useState([]);
    const [selectedManifestRows, setSelectedManifestRows] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [formData, setFormData] = useState({
        fromDest: '',
        toDest: '',
        mode: '',
        transportType: '',
        vehicleType: '',
        vehicleNo: '',
        driverName: '',
        driverMobile: '',
        vendorCode: '',
        vendorMobile: '',
        remark: '',
        bookingWeight: '',
        manifestWeight: '',
        docketNo: []
    });


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getApi(`/Manifest/getPendingManifest?branchCode=MUM&pageNumber=${currentPage}&pageSize=${rowsPerPage}`);
                const currentPageData = Array.isArray(response.data) ? response.data : [];
                setGetManifest(currentPageData);

                const allDataResponse = await getApi(`/Manifest/getPendingManifest?branchCode=MUM&pageNumber=1&pageSize=10000`);
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

    const convertDateFormat = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
    };

    const filteredgetManifestData = getManifest.filter((manifest) => {

        const isDocketNoMatch =
            (manifest?.DocketNo?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (manifest?.customerName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (manifest?.fromDest?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (manifest?.toDest?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (manifest?.bookDate?.toLowerCase().includes(searchQuery.toLowerCase()));

        const manifestDate = new Date(convertDateFormat(manifest.bookDate));
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const isDateInRange = (!from || manifestDate >= from) && (!to || manifestDate <= to);

        return isDocketNoMatch && isDateInRange;
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
        setCurrentPage(1);
    };

    const handleToDateChange = (e) => {
        setToDate(e.target.value);
        setCurrentPage(1);
    };


    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
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
        fetchData('/Master/getMode', setGetMode);
        fetchData('/Master/getVendor', setGetVendor);
        fetchData('/Master/getdomestic', setGetCity);
        fetchData('/Master/getGetdriver', setGetDriver);
        fetchData('/Master/VehicleMaster', setGetVehicle);
        fetchData('/Master/gettransport', setGetTransport);
    }, []);


    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedRows(getManifest.map((_, index) => index));
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelect = (index, docketNo) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
            setSelectedDocketNos(selectedDocketNos.filter(docket => docket !== docketNo));
            setSelectedManifestRows(selectedManifestRows.filter(row => row.DocketNo !== docketNo));
        } else {
            setSelectedRows([...selectedRows, index]);
            setSelectedDocketNos([...selectedDocketNos, docketNo]);
            setSelectedManifestRows([
                ...selectedManifestRows,
                getManifest.find(manifest => manifest.DocketNo === docketNo)
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
            docketNo: selectedDocketNos,
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

        const requestPayload = {
            DocketNo: formData.docketNo,
            fromDest: formData.fromDest,
            toDest: formData.toDest,
            Mode: formData.mode,
            Remark: formData.remark,
            transporterType: formData.transportType,
            Vehicletype: formData.vehicleType,
            VehicleNo: formData.vehicleNo,
            VendorCode: formData.vendorCode,
            driverName: formData.driverName,
            driverMobile: formData.driverMobile,
            DispatchFlag: "0",
        };

        try {
            const response = await postApi('/Manifest/generateManifest', requestPayload);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Data has been successfully generated!',
                timer: 2000,
                showConfirmButton: true,
            });
            setFormData({
                fromDest: '',
                toDest: '',
                mode: '',
                transportType: '',
                vehicleType: '',
                vehicleNo: '',
                driverName: '',
                driverMobile: '',
                vendorCode: '',
                vendorMobile: '',
                remark: '',
                bookingWeight: '',
                manifestWeight: '',
                docketNo: []
            });
            setSelectedManifestRows([]);
            setSelectedRows([]);
        } catch (error) {
            console.error("Error submitting manifest: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while generating data. Please try again.',
            });
        }
    };



    return (
        <>
            <div className="body">
                <div className="container1" style={{ padding: "0px" }}>

                    <form onSubmit={handleSubmit}>
                        <div className="fields2">
                            <div className="input-field3" >
                                <label htmlFor="">From City</label>
                                <select name="fromDest" value={formData.fromDest}
                                    onChange={handleFormChange} required>
                                    <option value="" disabled>Select City</option>
                                    {getCity.map((city, index) => (
                                        <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">To City</label>
                                <select name="toDest" value={formData.toDest}
                                    onChange={handleFormChange} required>
                                    <option value="" disabled>Select City</option>
                                    {getCity.map((city, index) => (
                                        <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Mode</label>
                                <select name="mode" value={formData.mode}
                                    onChange={handleFormChange} required>
                                    <option value="" disabled>Select Mode</option>
                                    {getMode.map((mode, index) => (
                                        <option value={mode.Mode_Code} key={index}>{mode.Mode_Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Transport Type</label>
                                <select name="transportType" value={formData.transportType}
                                    onChange={handleFormChange}>
                                    <option value="" disabled>Transport Type</option>
                                    {getTransport.map((transport, index) => (
                                        <option value={transport.Transport_Code} key={index}>{transport.Transport_Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Vehicle Type</label>
                                <select name="vehicleType" value={formData.vehicleType}
                                    onChange={handleFormChange}>
                                    <option value="" disabled>Vehicle Type</option>
                                    {getVehicle.map((vehicle, index) => (
                                        <option value={vehicle.vehicle_model} key={index}>{vehicle.vehicle_model}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Vehicle Number</label>
                                <select name="vehicleNo" value={formData.vehicleNo}
                                    onChange={handleFormChange}>
                                    <option value="" disabled>Vehicle Number</option>
                                    {getVehicle.map((vehicle, index) => (
                                        <option value={vehicle.vehicle_number} key={index}>{vehicle.vehicle_number}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Driver Name</label>
                                <select name="driverName" value={formData.driverName}
                                    onChange={handleFormChange}>
                                    <option value="" disabled>Driver Name</option>
                                    {getDriver.map((driver, index) => (
                                        <option value={driver.Driver_Code} key={index}>{driver.Driver_Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Driver Number</label>
                                <input type="tel" placeholder="Driver Number" maxLength={10} 
                                    value={formData.driverMobile} onChange={(e) => setFormData({ ...formData, driverMobile: e.target.value })} />
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Vendor Name</label>
                                <select name="vendorCode" value={formData.vendorCode}
                                    onChange={handleFormChange}>
                                    <option value="" disabled>Vendor Name</option>
                                    {getVendor.map((vendor, index) => (
                                        <option value={vendor.Vendor_Code} key={index}>{vendor.Vendor_Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Vendor Number</label>
                                <input type="text" placeholder="Vendor Number" maxLength={10}
                                    value={formData.vendorMobile} onChange={(e) => setFormData({ ...formData, vendorMobile: e.target.value })} />
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Remark</label>
                                <input type="text" placeholder="Remark" value={formData.remark}
                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })} />
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Booking Weight</label>
                                <input type="text" placeholder="Booking Weight" name="bookingWeight"
                                    value={formData.bookingWeight} onChange={handleFormChange} />
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Manifest Weight</label>
                                <input type="text" placeholder="Manifest Weight" value={formData.manifestWeight}
                                    onChange={(e) => setFormData({ ...formData, manifestWeight: e.target.value })} />
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Bulk Docket Manifest</label>
                                <button type="button" className="ok-btn" style={{ height: "35px", width: "100%", fontSize:"14px" }} 
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

                    <div className="table-container" style={{ padding: "10px" }}>
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>Sr No.</th>
                                    <th scope="col">Docket.No</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Customer.Name</th>
                                    <th scope="col">Receiver</th>
                                    <th scope="col">Origin</th>
                                    <th scope="col">Destination</th>
                                    <th scope="col">QTY</th>
                                    <th scope="col">Weight</th>
                                    <th scope="col">Invoice.No</th>
                                    <th scope="col">Invoice.Value</th>
                                    <th scope="col">E-Way.Bill.No</th>
                                </tr>
                            </thead>

                            <tbody>
                                {selectedManifestRows.map((docket, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{docket.DocketNo}</td>
                                        <td style={{ width: "100px" }}>{docket.bookDate}</td>
                                        <td>{docket.customerName}</td>
                                        <td>{docket.consigneeName}</td>
                                        <td>{docket.fromDest}</td>
                                        <td>{docket.toDest}</td>
                                        <td>{docket.pcs}</td>
                                        <td>{docket.actualWt}</td>
                                        <td>{docket.invoiceNo}</td>
                                        <td>{docket.invoiceValue}</td>
                                        <td>{docket.eWayBillNo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

                                    <div className="input-field" style={{display:"flex", flexDirection:"row", marginLeft:"20px", marginTop:"10px"}}>
                                        <label htmlFor="" style={{marginTop:"10px"}}>From Date :</label>
                                        <input type="date" style={{ width: "120px", marginLeft: "10px" }}
                                            value={fromDate}
                                            onChange={handleFromDateChange} />
                                    </div>

                                    <div className="input-field" style={{display:"flex", flexDirection:"row", marginTop:"10px", marginLeft:"20px"}}>
                                        <label htmlFor="" style={{marginTop:"10px"}}>To Date :</label>
                                        <input type="date" style={{ width: "120px", marginLeft: "10px" }}
                                            value={toDate}
                                            onChange={handleToDateChange} />
                                    </div>

                                    <div className="bottom-buttons" style={{ marginTop: "0px", marginLeft: "255px" }}>
                                        <button style={{ marginTop: "0px" }} className="ok-btn" onClick={handleDocketNoSelect}>Submit</button>
                                    </div>
                                </div>
                                <div className='table-container'>
                                    <table className='table table-bordered table-sm'>
                                        <thead className='table-sm'>
                                            <tr>
                                                <th scope="col">
                                                    <input type="checkbox" style={{ height: "15px", width: "15px" }} checked={selectAll}
                                                        onChange={handleSelectAll} />
                                                </th>
                                                <th scope="col">Sr.No</th>
                                                <th scope="col">Docket.No</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Customer.Name</th>
                                                <th scope="col">Receiver</th>
                                                <th scope="col">Origin</th>
                                                <th scope="col">Destination</th>
                                                <th scope="col">QTY</th>
                                                <th scope="col">Weight</th>
                                                <th scope="col">Invoice.No</th>
                                                <th scope="col">Invoice.Value</th>
                                                <th scope="col">E-Way.Bill.No</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-body'>
                                            {filteredgetManifestData.map((manifest, index) => (
                                                <tr key={index}>
                                                    <td scope="col">
                                                        <input type="checkbox" style={{ height: "15px", width: "15px" }} checked={selectedRows.includes(index)}
                                                            onChange={() => handleRowSelect(index, manifest.DocketNo)} />
                                                    </td>
                                                    <td>{index + 1}</td>
                                                    <td>{manifest.DocketNo}</td>
                                                    <td style={{ width: "100px" }}>{manifest.bookDate}</td>
                                                    <td>{manifest.customerName}</td>
                                                    <td>{manifest.consigneeName}</td>
                                                    <td>{manifest.fromDest}</td>
                                                    <td>{manifest.toDest}</td>
                                                    <td>{manifest.pcs}</td>
                                                    <td>{manifest.actualWt}</td>
                                                    <td>{manifest.invoiceNo}</td>
                                                    <td>{manifest.invoiceValue}</td>
                                                    <td>{manifest.eWayBillNo}</td>
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
            </div>
        </>
    );
};


export default CreateManifest;