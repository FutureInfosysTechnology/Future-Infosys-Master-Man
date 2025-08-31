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
function ChecklistWiseReport() {

    const [getCustomer, setGetCustomer] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
    const getAllMode = [
        { value: "ALL MODE DATA", label: "ALL MODE DATA" },
        ...getMode.map((mode) => ({
            value: mode.Mode_Code, label: mode.Mode_Name
        }))
    ];
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = EmailData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(EmailData.length / rowsPerPage);
    const [getBranch, setGetBranch] = useState([]);
    const branchOptions = [
        { value: "All BRANCH DATA", label: "All BRANCH DATA" }, // default option
        ...getBranch.map(city => ({
            value: city.Branch_Code,   // adjust keys from your API
            label: city.Branch_Name,
        }))
    ];
    const allOptions = [
        { label: "ALL CLIENT DATA", value: "ALL CLIENT DATA" },
        ...getCustomer.map((cust) => ({
            label: cust.Customer_Name,
            value: cust.Customer_Name,
        })),
    ];
    const getbooking = [{ value: "ALL BOOKING TYPE", label: "ALL BOOKING TYPE" },
    { value: "Pending", label: "Pending" },
    { value: "Resolved", label: "Resolved" },
    ]
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        fromdt: firstDayOfMonth,
        todt: today,
        CustomerName: "",
        booking: "",
        branch: "",
    });
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    const handleSearchChange = (selectedOption) => {
        setFormData({ ...formData, CustomerName: selectedOption ? selectedOption.value : "" });
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
        fetchData('/Master/getBranch', setGetBranch);
        fetchData('/Master/getCustomerData', setGetCustomer);
    }, []);
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
    const handlesave = async (e) => {
        e.preventDefault();
        const fromdt = formatDate(formData.fromdt);
        const todt = formatDate(formData.todt);
        const CustomerName = formData.CustomerName || "ALL CLIENT DATA";
        const branch = formData.branch || "ALL BRANCH DATA";
        const booking = formData.booking || "ALL BOOKING TYPE"

        if (!fromdt || !todt) {
            Swal.fire('Error', 'Both From Date and To Date are required.', 'error');
            return;
        }

        try {
            const response = await getApi(`/Booking/TotalChargesReport?CustomerName=${encodeURIComponent(CustomerName)}&Status=ALL%20STATUS%20DATA&fromdt=${encodeURIComponent(fromdt)}&todt=${encodeURIComponent(todt)}&branchCode=${encodeURIComponent(branch)}&pageNumber=${encodeURIComponent(currentPage)}&pageSize=${encodeURIComponent(rowsPerPage)}&BookingType=${encodeURIComponent(booking)}&Vendor_Name=ALL%20VENDOR%20DATA`);
            console.log(response);
            if (response.status === 1) {
                setEmailData(response.Data);
                setSelectedDockets([]);
                setCurrentPage(1);
                Swal.fire('Saved!', 'Data has been fetched.', 'success');
            } 
        } catch (error) {
            console.error("API Error:", error);
            setEmailData([]);
            Swal.fire('No Data','No records found.', 'info');
        }
    };


    return (
        <>

            <div className="card shadow-sm p-3 mb-4 bg-white rounded">
                <form onSubmit={handlesave}>
                    <div className="row g-3 mb-3">
                        <div className="col-12 col-md-4">
                            <h6 className="form-label mb-0" style={{ fontSize: "0.85rem", color: "#212529" }}>Select Branch</h6>
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
                            <h6 className="form-label mb-0" style={{ fontSize: "0.85rem", color: "#212529" }}>Customer Name</h6>
                            <Select
                                required
                                className="blue-selectbooking"
                                classNamePrefix="blue-selectbooking"
                                options={allOptions}
                                value={formData.CustomerName ? { label: formData.CustomerName, value: formData.CustomerName } : null}
                                onChange={handleSearchChange}
                                placeholder="Search Customer..."
                                isClearable
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
                            <h6 className="form-label mb-0" style={{ fontSize: "0.85rem", color: "#212529" }}>Booking Type</h6>
                            <Select
                                required
                                options={getbooking}
                                value={
                                    formData.booking
                                        ? getbooking.find(c => c.value === formData.booking)
                                        : null
                                }
                                onChange={(selectedOption) =>
                                    setFormData({
                                        ...formData,
                                        booking: selectedOption ? selectedOption.value : ""
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
                                placeholder="Booking type"
                                isSearchable
                                classNamePrefix="blue-selectbooking"
                                className="blue-selectbooking"
                            />
                        </div>

                    </div>

                    {/* 🔹 Second Row: Dates + Buttons */}
                    <div className="row g-3 mb-3 align-items-end">
                        {/* From Date */}
                        <div className="col-12 col-md-3">
                            <h6 className="form-label mb-0" style={{ fontSize: "0.85rem", color: "#212529" }}>From Date</h6>
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
                            <h6 className="form-label mb-0" style={{ fontSize: "0.85rem", color: "#212529" }}>To Date</h6>
                            <DatePicker
                                selected={formData.todt}
                                onChange={(date) => handleDateChange(date, "todt")}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                                portalId="root-portal"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end">
                            <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                            <button type="button" className="btn btn-danger btn-sm"><MdEmail /></button>
                            <button type="button" className="btn btn-success btn-sm" onClick={exportSelectedToExcel}>Excel</button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={exportSelectedToPDF}>PDF</button>
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
                                <th>BookDate</th>
                                <th>Customer_Name</th>
                                <th>Consignee_Name</th>
                                <th>Consignee_Pin</th>
                                <th>Consignee_Mob</th>
                                <th>Consignee_GST</th>
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Mode</th>
                                <th>Vendor</th>
                                <th>Vendor_Awbno</th>
                                <th>Flag</th>
                                <th>Qty</th>
                                <th>ActualWt</th>
                                <th>VolumetricWt</th>
                                <th>ChargedWt</th>
                                <th>RatePerkg</th>
                                <th>Rate</th>
                                <th>FuelPer</th>
                                <th>FuelCharges</th>
                                <th>DocketChrgs</th>
                                <th>ODA_Chrgs</th>
                                <th>PackingChrgs</th>
                                <th>GreenChrgs</th>
                                <th>HamaliChrgs</th>
                                <th>OtherCharges</th>
                                <th>InsuranceChrgs</th>
                                <th>IGSTPer</th>
                                <th>IGSTAMT</th>
                                <th>CGSTPer</th>
                                <th>CGSTAMT</th>
                                <th>SGSTPer</th>
                                <th>SGSTAMT</th>
                                <th>TotalAmt</th>
                                <th>Remark</th>
                                <th>BillNo</th>
                                <th>Billing_Period</th>
                                <th>Status</th>
                                <th>DelvDT</th>
                                <th>Stamp</th>
                                <th>Shipper_Name</th>
                                <th>ShipperPhone</th>
                                <th>InvoiceNo</th>
                                <th>InvValue</th>
                                <th>EwayBill</th>
                                <th>InvDate</th>
                                <th>UserName</th>
                                <th>Branch</th>
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
                                        <td>{item.Customer_Name}</td>
                                        <td>{item.Consignee_Name}</td>
                                        <td>{item.Consignee_Pin}</td>
                                        <td>{item.Consignee_Mob}</td>
                                        <td>{item.Consignee_GST}</td>
                                        <td>{item.Origin_Name}</td>
                                        <td>{item.Destination_Name}</td>
                                        <td>{item.Mode_Name}</td>
                                        <td>{item.Vendor_Name}</td>
                                        <td>{item.vendorAwbno}</td>
                                        <td>{item.T_Flag}</td>
                                        <td>{item.Qty}</td>
                                        <td>{item.ActualWt}</td>
                                        <td>{item.VolumetricWt}</td>
                                        <td>{item.ChargedWt}</td>
                                        <td>{item.RatePerkg}</td>
                                        <td>{item.Rate}</td>
                                        <td>{item.FuelPer}</td>
                                        <td>{item.FuelCharges}</td>
                                        <td>{item.DocketChrgs}</td>
                                        <td>{item.ODA_Chrgs}</td>
                                        <td>{item.PackingChrgs}</td>
                                        <td>{item.GreenChrgs}</td>
                                        <td>{item.HamaliChrgs}</td>
                                        <td>{item.OtherCharges}</td>
                                        <td>{item.InsuranceChrgs}</td>
                                        <td>{item.IGSTPer}</td>
                                        <td>{item.IGSTAMT}</td>
                                        <td>{item.CGSTPer}</td>
                                        <td>{item.CGSTAMT}</td>
                                        <td>{item.SGSTPer}</td>
                                        <td>{item.SGSTAMT}</td>
                                        <td>{item.TotalAmt}</td>
                                        <td>{item.Remark}</td>
                                        <td>{item.BillNo}</td>
                                        <td>{item.Billing_Period}</td>
                                        <td>{item.Status}</td>
                                        <td>{item.DelvDT}</td>
                                        <td>{item.Stamp}</td>
                                        <td>{item.Shipper_Name}</td>
                                        <td>{item.ShipperPhone}</td>
                                        <td>{item.InvoiceNo}</td>
                                        <td>{item.InvValue}</td>
                                        <td>{item.EwayBill}</td>
                                        <td>{item.InvDate}</td>
                                        <td>{item.UserName}</td>
                                        <td>{item.Branch_Name}</td>

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
            </div >
        </>
    )
}

export default ChecklistWiseReport;