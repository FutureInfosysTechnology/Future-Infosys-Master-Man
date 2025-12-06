import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { getApi, putApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";




function ActivityUpload() {
    const today = new Date();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [getBranch, setGetBranch] = useState([]);
   // Format current time as "HH:MM" for input[type="time"]
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const [addCust, setAddCust] = useState({
        date: today,
        time: formatTime(today),
        exp: '',
        location: '',
        AwbNo: ''
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];
        if (!addCust.date) errors.push("Progress Date is required");
        if (!addCust.time) errors.push("Progress Time is required");

        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: errors.map(err => `<div>${err}</div>`).join(''),
            });
            return;
        }
        const payload = {
            FromDate: addCust.fromDate.toISOString().split("T")[0],
            ToDate: addCust.toDate.toISOString().split("T")[0],
            Customer_Code: addCust.custCode,
        }
        try {
            const response = await putApi(`Master/updateAllRateCharges`, payload);
            if (response.data.length > 0) {
                console.log(response);
                console.log(response.data);
                setData(response.data);
                Swal.fire("Success", response.message || "Credit Note records are fetched", "success");
            }
            else {
                Swal.fire("Warning", `No Record Found`, "warning");
                setData([]);
            }
        }
        catch (error) {
            console.error("API Error:", error);
        }
        finally {
        }
    }

    const ymdToDmy = (dateStr) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    };



    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const response = await getApi(`/Master/getBranch?Branch_Code=${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}`);
                if (response.status === 1) {
                    console.log(response.Data);
                    setGetBranch(response.Data);
                }
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchBranch();
    }, [])








    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);




    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    const handleChange = (field, value) => {
        setAddCust(prev => ({ ...prev, [field]: value }));
    };





    return (
        <>
            <div className="body">
                <div className="container1">

                    <form onSubmit={handleSubmit} style={{ background: " #f2f4f3" }}>


                        <div className="fields2">
                            <div className="input-field1">
                                <label>Progress Date</label>
                                <DatePicker
                                    required
                                    portalId="root-portal"
                                    selected={addCust.date}
                                    onChange={(date) => handleChange("date", date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field1">
                                <label>Progress Time</label>
                                <input
                                    type="time"
                                    value={addCust.time}
                                    onChange={(e) => handleChange("time", e.target.value)}
                                />

                            </div>

                            <div className="input-field3">
                                <label>Exception</label>
                                <input
                                    type="text"
                                    placeholder="Enter Exception"
                                    value={addCust.exp}
                                    onChange={(e) => handleChange("exp", e.target.value)}
                                />
                            </div>

                            <div className="input-field3">
                                <label>Location</label>
                                <Select
                                    options={getBranch.map(branch => ({
                                        value: branch.Branch_Code,   // adjust keys from your API
                                        label: branch.Branch_Name
                                    }))}
                                    value={
                                        addCust.location
                                            ? {
                                                value: addCust.location,
                                                label: getBranch.find(c => c.Branch_Code === addCust.location)?.Branch_Name
                                            }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        handleChange("location", selectedOption ? selectedOption.value : "")
                                    }
                                    placeholder="Select Branch"
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
                                <label>AwbNo</label>
                                <input
                                    type="text"
                                    placeholder="Enter AwbNo"
                                    value={addCust.AwbNo}
                                    onChange={(e) => handleChange("AwbNo", e.target.value)}
                                />
                            </div>

                            <div className='bottom-buttons' style={{ marginTop: "22px", marginLeft: "12px" }}>
                                <button type='submit' className='ok-btn'>Submit</button>
                                <button
                                    type="button"
                                    onClick={() => setAddCust({
                                        date: today,
                                        time: formatTime(today),
                                        exp: '',
                                        location: '',
                                        AwbNo: ''
                                    })}
                                    className="ok-btn"
                                >
                                    Close
                                </button>

                            </div>
                        </div>

                    </form>


                    <div className='table-container'>
                        <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                            <thead>
                                <tr>

                                    <th>Sr.No</th>
                                    <th>Docket No</th>
                                    <th>Book Date</th>
                                    <th>Customer Code</th>
                                    <th>Customer Name</th>
                                    <th>T_Flag</th>
                                    <th>Dox/Spx</th>
                                    <th>Actual Wt</th>
                                    <th>Volumetric Wt</th>
                                    <th>Charged Wt</th>
                                    <th>Rate</th>
                                    <th>Fuel %</th>
                                    <th>Fuel Charges</th>
                                    <th>FOV Charges</th>
                                    <th>Docket Charges</th>
                                    <th>Delivery Charges</th>
                                    <th>Packing Charges</th>
                                    <th>Green Charges</th>
                                    <th>Hamali Charges</th>
                                    <th>Other Charges</th>
                                    <th>Insurance Charges</th>
                                    <th>CGST %</th>
                                    <th>CGST Amt</th>
                                    <th>SGST %</th>
                                    <th>SGST Amt</th>
                                    <th>IGST %</th>
                                    <th>IGST Amt</th>
                                    <th>Total Amt</th>
                                    <th>Origin</th>
                                    <th>Destination</th>
                                    <th>Mode</th>
                                    <th>Origin Zone</th>
                                    <th>Dest Zone</th>
                                    <th>Branch</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {currentRows.map((cust, index) => (
                                    <tr key={index} style={{ fontSize: "12px", position: "relative" }}>



                                        {/* SR.NO */}
                                        <td>{index + 1}</td>

                                        {/* MANUAL COLUMNS */}
                                        <td>{cust.DocketNo}</td>
                                        <td>{ymdToDmy(cust.BookDate)}</td>
                                        <td>{cust.Customer_Code}</td>
                                        <td>{cust.Customer_Name}</td>
                                        <td>{cust.T_Flag}</td>
                                        <td>{cust.DoxSpx}</td>
                                        <td>{cust.ActualWt}</td>
                                        <td>{cust.VolumetricWt}</td>
                                        <td>{cust.ChargedWt}</td>
                                        <td>{cust.Rate}</td>
                                        <td>{cust.FuelPer}</td>
                                        <td>{cust.FuelCharges}</td>
                                        <td>{cust.Fov_Chrgs}</td>
                                        <td>{cust.DocketChrgs}</td>
                                        <td>{cust.DeliveryChrgs}</td>
                                        <td>{cust.PackingChrgs}</td>
                                        <td>{cust.GreenChrgs}</td>
                                        <td>{cust.HamaliChrgs}</td>
                                        <td>{cust.OtherCharges}</td>
                                        <td>{cust.InsuranceChrgs}</td>
                                        <td>{cust.CGSTPer}</td>
                                        <td>{cust.CGSTAMT}</td>
                                        <td>{cust.SGSTPer}</td>
                                        <td>{cust.SGSTAMT}</td>
                                        <td>{cust.IGSTPer}</td>
                                        <td>{cust.IGSTAMT}</td>
                                        <td>{cust.TotalAmt}</td>
                                        <td>{cust.Origin_Name}</td>
                                        <td>{cust.Destination_Name}</td>
                                        <td>{cust.Mode_Name}</td>
                                        <td>{cust.Origin_Zone_Name}</td>
                                        <td>{cust.Dest_Zone_Name}</td>
                                        <td>{cust.Branch_Name}</td>

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




                </div>
            </div>

        </>
    )
}

export default ActivityUpload;