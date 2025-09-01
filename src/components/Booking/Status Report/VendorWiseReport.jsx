import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Select from 'react-select'; // 🔹 You forgot this
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import { FaPaperPlane, FaFileExcel, FaFilePdf } from "react-icons/fa";

function VendorWiseReport() {
    const [getVendor, setGetVendor] = useState([]);
    const [getBranch, setGetBranch] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const getStatus = [{ value: "ALL STATUS DATA", label: "ALL STATUS DATA" },
    { value: "Intransit", label: "Intransit" },
    { value: "OutForDelivery", label: "OutForDelivery" },
    { value: "Delivered", label: "Delivered" },
    { value: "RTO", label: "RTO" },
    { value: "Shipment Booked", label: "Shipment Booked" },
    ];
    const branchOptions = [
        { value: "ALL BRANCH DATA", label: "ALL BRANCH DATA" }, // default option
        ...getBranch.map(city => ({
            value: city.Branch_Code,   // adjust keys from your API
            label: city.Branch_Name,
        }))
    ];

    const allOptions = [
        { label: "ALL VENDOR TYPE", value: "ALL VENDOR TYPE" },
        ...getVendor.map(vendor => ({
            value: vendor.Vendor_Code,   // adjust keys from your API
            label: vendor.Vendor_Name
        }))
    ];
    const [formData, setFormData] = useState({
        fromdt: firstDayOfMonth,
        todt: today,
        vendorCode: "",
        status: "",
        branch: "",
    });

    const [EmailData, setEmailData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const [selectedDockets, setSelectedDockets] = useState([]);

    const formatDate = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
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
        fetchData('/Master/getVendor', setGetVendor);
        fetchData('/Master/getBranch', setGetBranch);
    }, []);

    const handleSearchChange = (selectedOption) => {
        setFormData({ ...formData, CustomerName: selectedOption ? selectedOption.value : "" });
    };

    const handlesave = async (e) => {
        e.preventDefault();
        const fromdt = formatDate(formData.fromdt);
        const todt = formatDate(formData.todt);
        const vendorCode = formData.vendorCode || "ALL VENDOR TYPE";
        const status = formData.status || "ALL STATUS DATA";
        const branch = formData.branch || "ALL BRANCH DATA";

        if (!fromdt || !todt) {
            Swal.fire('Error', 'Both From Date and To Date are required.', 'error');
            return;
        }
        try {
            const response = await getApi(`Booking/VendorDeliveryReport?Vendor_Name=${encodeURIComponent(vendorCode)}&Status=${encodeURIComponent(status)}&fromdt=${encodeURIComponent(fromdt)}&todt=${encodeURIComponent(todt)}&branchCode=${encodeURIComponent(branch)}&pageNumber=${encodeURIComponent(currentPage)}&pageSize=${encodeURIComponent(rowsPerPage)}&BookingType=ALL BOOKING TYPE`);
            if (response.status === 1) {
                setEmailData(response.Data);
                setSelectedDockets([]);
                Swal.fire('Saved!', 'Data has been fetched.', 'success');
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("API Error:", error);
            setEmailData([]);
            Swal.fire('No Data', 'No records found.', 'info');
        }
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = EmailData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(EmailData.length / rowsPerPage);

    const handleCheckboxChange = (docketNo) => {
        setSelectedDockets((prev) =>
            prev.includes(docketNo) ? prev.filter((item) => item !== docketNo) : [...prev, docketNo]
        );
    };
    const exportSelectedToPDF = () => {
        if (selectedDockets.length === 0) {
            Swal.fire("Error", "Please select at least one docket", "error");
            return;
        }

        const selectedData = EmailData.filter((row) =>
            selectedDockets.includes(row.DocketNo)
        );

        const doc = new jsPDF();

        const headers = [
            [
                "DocketNo",
                "Book Date",
                "Customer",
                "Consignee",
                "Origin",
                "Destination",
                "Mode",
                "Qty",
                "Weight",
            ],
        ];

        const body = selectedData.map((item) => [
            item.DocketNo,
            item.BookDate ? new Date(item.BookDate).toLocaleDateString("en-GB") : "",
            item.Customer_Name,
            item.Consignee_Name,
            item.Origin_Name,
            item.Destination_Name,
            item.Mode_Name,
            item.Qty,
            item.ActualWt,
        ]);

        doc.text("Selected Booking Data", 14, 10);
        doc.autoTable({
            head: headers,
            body,
            startY: 20,
        });

        doc.save("SelectedDockets.pdf");
    };
    const exportSelectedToExcel = () => {
        if (currentRows.length === 0) {
            Swal.fire("Error", "No data available on this page to export", "error");
            return;
        }
        const formattedData = currentRows.map(row => ({
            ...row,
            BookDate: row.BookDate ? new Date(row.BookDate).toLocaleDateString("en-GB") : "",
        }));
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CurrentPageData");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, `CurrentPageData_Page${currentPage}.xlsx`);
    };

    const handleSendEmailWithAttachment = async (fileType) => {
        const fromDate = formatDate(formData.fromdt);
        const toDate = formatDate(formData.todt);
        const vendorCode = formData.vendorCode;

        if (!vendorCode || !fromDate || !toDate) {
            Swal.fire('Error', 'Please fill all fields.', 'error');
            return;
        }

        try {
            const response = await getApi(`/Master/sendBookingExcelEmail?CustomerName=${encodeURIComponent(vendorCode)}&fromdt=${fromDate}&todt=${toDate}&recipientEmail=futureinfosyso@gmail.com&fileType=${fileType}`);

            const result = await response.json();
            if (result.status === 1) {
                Swal.fire('Success', result.message, 'success');
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Email send failed:', error);
            Swal.fire('Error', 'Server error occurred.', 'error');
        }
    };

    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };

    return (
        <div className="card shadow-sm p-3 mb-4 bg-white rounded">
            <form onSubmit={handlesave}>
                <div className="row g-3 mb-3">
                    {/* Branch */}
                    <div className="col-12 col-md-4">
                        <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>Branch</h6>
                        <Select
                            required
                            options={branchOptions}
                            value={formData.branch ? branchOptions.find(c => c.value === formData.branch) : null}
                            onChange={(selectedOption) =>
                                setFormData({ ...formData, branch: selectedOption ? selectedOption.value : "" })
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
                    <div className="col-12 col-md-4">
                        <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>Vendor Name</h6>
                        <Select
                            required
                            options={allOptions}
                            value={
                                formData.vendorCode
                                    ? allOptions.find(c => c.value === formData.vendorCode)
                                    : null
                            }
                            onChange={(selectedOption) =>
                                setFormData({
                                    ...formData,
                                    vendorCode: selectedOption ? selectedOption.value : ""
                                })
                            }
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
                            placeholder="Vendor Name"
                            isSearchable
                            classNamePrefix="blue-selectbooking"
                            className="blue-selectbooking"
                        />
                    </div>

                    {/* Status */}
                    <div className="col-12 col-md-4">
                        <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>Status</h6>
                        <Select
                            className="blue-selectbooking"
                            classNamePrefix="blue-selectbooking"
                            options={getStatus}
                            value={formData.status ? getStatus.find((item) => item.value === formData.status) : null}
                            onChange={(selected) => setFormData({ ...formData, status: selected ? selected.value : "" })}
                            placeholder="Search Status..."
                            isSearchable
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
                </div>

                {/* 🔹 Second Row: Dates + Buttons */}
                <div className="row g-3 mb-3 align-items-end">
                    {/* From Date */}
                    <div className="col-12 col-md-3">
                        <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>From Date</h6>
                        <DatePicker
                            selected={formData.fromdt}
                            onChange={(date) => handleDateChange(date, "fromdt")}
                            dateFormat="dd/MM/yyyy"
                            className="form-control form-control-sm"
                            portalId="root-portal"
                        />
                    </div>

                    {/* To Date */}
                    <div className="col-12 col-md-3">
                        <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>To Date</h6>
                        <DatePicker
                            selected={formData.todt}
                            onChange={(date) => handleDateChange(date, "todt")}
                            dateFormat="dd/MM/yyyy"
                            className="form-control form-control-sm"
                            portalId="root-portal"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end flex-wrap">

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill shadow-sm"
                        >
                            <FaPaperPlane size={16} /><span style={{marginRight:"2px"}}>Submit</span>
                        </button>

                        {/* Email Button */}
                        <button
                            type="button"
                            className="btn btn-info btn-sm d-flex align-items-center gap-2 rounded-pill shadow-sm"
                            onClick={() => handleSendEmailWithAttachment("excel")} // 🔹 send excel by default
                        >
                            <MdEmail size={16} /><span style={{marginRight:"2px"}}>Mail</span>
                        </button>

                        {/* Excel Button */}
                        <button
                            type="button"
                            className="btn btn-success btn-sm d-flex align-items-center gap-2 rounded-pill shadow-sm"
                            onClick={exportSelectedToExcel}
                        >
                            <FaFileExcel size={16} /><span style={{marginRight:"2px"}}>Excel</span>
                        </button>

                        {/* PDF Button */}
                        <button
                            type="button"
                            className="btn btn-danger btn-sm d-flex align-items-center gap-2 rounded-pill shadow-sm"
                            onClick={exportSelectedToPDF}
                        >
                            <FaFilePdf size={16} /><span style={{marginRight:"2px"}}>PDF</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* 📋 Table */}
            <div className='table-responsive' style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className='table table-bordered table-sm text-nowrap'>
                    <thead className='green-header' style={{ position: "sticky", top: 0, zIndex: 2 }}>
                        <tr>
                            <th>Sr.No</th>
                            <th>DocketNo</th>
                            <th>Book_Date</th>
                            <th>Customer</th>
                            <th>Consignee</th>
                            <th>Origin</th>
                            <th>Destination</th>
                            <th>Mode</th>
                            <th>Vendor</th>
                            <th>Vendor_Docket</th>
                            <th>Flag</th>
                            <th>Qty</th>
                            <th>Weight</th>
                            <th>Status</th>
                            <th>Delivery_Date</th>
                            <th>Delivery_Time</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.length === 0 ? (
                            <tr>
                                <td colSpan="18" className="text-center text-danger">No Data Found</td>
                            </tr>
                        ) : (
                            currentRows.map((item, index) => (
                                <tr key={index}>
                                    <td>{indexOfFirstRow + index + 1}</td>
                                    <td>{item.DocketNo}</td>
                                    <td>{item.BookDate ? new Date(item.BookDate).toLocaleDateString('en-GB') : ''}</td>
                                    <td >{item.Customer_Name}</td>
                                    <td>{item.Consignee_Name}</td>
                                    <td>{item.Origin_Name}</td>
                                    <td>{item.Destination_Name}</td>
                                    <td>{item.Mode_Name}</td>
                                    <td>{item.Vendor_Name}</td>
                                    <td>{item.vendorAwbno}</td>
                                    <td>{item.T_Flag}</td>
                                    <td>{item.Qty}</td>
                                    <td>{item.ActualWt}</td>
                                    <td>{item.Status}</td>
                                    <td>{item.DelvDT}</td>
                                    <td>{item.DelvTime}</td>
                                    <td>{item.Remark}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 mt-2">
                {/* Rows per page dropdown */}
                <div className="d-flex align-items-center gap-2">
                    <label className="mb-0">Rows per page:</label>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: "80px" }}
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1); // reset to first page
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={EmailData.length}>All</option>
                    </select>
                </div>

                {/* Pagination */}
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="ok-btn"
                        style={{ width: "30px" }}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        {"<"}
                    </button>
                    <span style={{ color: "#333", padding: "5px" }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="ok-btn"
                        style={{ width: "30px" }}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        {">"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VendorWiseReport;
