import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select, { components } from 'react-select';
import { getApi, putApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


function UpdateCustomerRate() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [data, setData] = useState([]);
    const [openRow, setOpenRow] = useState(null);
    const [getCust, setGetCust] = useState([]);                    // to get customer charges data
    const [getCustName, setGetCustName] = useState([]);            // To Get Customer Name Data
    const [getMode, setGetMode] = useState([]);                    // To Get Mode Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addCust, setAddCust] = useState({
        custCode: '',
        fromDate: firstDayOfMonth,
        toDate: today,
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];
        // if (!formData.DocketNo) errors.push("DocketNo is required");
        if (!addCust.custCode) errors.push("Customer Name is required");
        if (!addCust.fromDate) errors.push("From Date is required");
        if (!addCust.toDate) errors.push("To Date is required");
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

    const fetchCustChargesData = async () => {
        try {
            const response = await getApi('/Master/GetcustomerCharges');
            setGetCust(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    const ymdToDmy = (dateStr) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    };

    const fetchCustomerData = async () => {
        try {
            const response = await getApi('/Master/getCustomerData');
            setGetCustName(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        fetchCustomerData();
        fetchCustChargesData();
    }, [])







    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);




    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;



    return (
        <>
            <div className="body">
                <div className="container1">

                    <form onSubmit={handleSubmit} style={{ background: " #f2f4f3" }}>


                        <div className="fields2">
                            <div className="input-field1">
                                <label htmlFor="">Customer Name</label>
                                <Select
                                    className="blue-selectbooking"
                                    classNamePrefix="blue-selectbooking"
                                    options={getCustName.map(cust => ({
                                        value: cust.Customer_Code,   // adjust keys from your API
                                        label: cust.Customer_Name
                                    }))}
                                    value={
                                        addCust.custCode
                                            ? { value: addCust.custCode, label: getCustName.find(cust => cust.Customer_Code === addCust.custCode)?.Customer_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) => {
                                        setAddCust({
                                            ...addCust,
                                            custCode: selectedOption ? selectedOption.value : ""
                                        })
                                    }}
                                    placeholder="Select Customer"
                                    isSearchable
                                    menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll area
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps it above other UI
                                    }}
                                />
                            </div>


                            <div className="input-field3">
                                <label htmlFor="">From</label>
                                <DatePicker
                                    required
                                    portalId="root-portal"
                                    selected={addCust.fromDate}
                                    onChange={(date) => setAddCust({ ...addCust, fromDate: date })}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">To Date</label>
                                <DatePicker
                                    required
                                    portalId="root-portal"
                                    selected={addCust.toDate}
                                    onChange={(date) => setAddCust({ ...addCust, toDate: date })}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className='bottom-buttons' style={{ marginTop: "22px", marginLeft: "12px" }}>
                                {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                {isEditMode && (<button type='button' className='ok-btn'>Update</button>)}
                                <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                            </div>
                        </div>

                    </form>


                    <div className='table-container'>
                        <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                            <thead>
                                <tr>
                                    <th>Actions</th>
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

                                        {/* ACTIONS */}
                                        <td>
                                            <PiDotsThreeOutlineVerticalFill
                                                style={{ fontSize: "20px", cursor: "pointer" }}
                                                onClick={() => setOpenRow(openRow === index ? null : index)}
                                            />

                                            {openRow === index && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "6px",
                                                        position: "absolute",
                                                        left: "60px",
                                                        top: "-2px",
                                                        background: "white",
                                                        borderRadius: "6px",
                                                        padding: "5px",
                                                        zIndex: 9999
                                                    }}
                                                >
                                                    <button className="edit-btn">
                                                        <i className="bi bi-pen"></i>
                                                    </button>

                                                    <button className="edit-btn">
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>

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

export default UpdateCustomerRate;