import React, { useState, useEffect, useContext } from "react";
import "../../Tabs/tabs.css";
import { getApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { refeshPend } from "../../../App";

function PendingManifest() {
    const {ref} =useContext(refeshPend)
    const [getManifest, setGetManifest] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [formDate, setFormDate] = useState({
        fromDate: firstDayOfMonth,
        toDate: today,
    });

    const handleDateChange = (date, field) => {
        setFormDate({ ...formDate, [field]: date });
        setCurrentPage(1);
    };
    const fetchData = async () => {
    setLoading(true);
    try {
        // Current page data
        const response = await getApi(`/Manifest/getPendingManifest?${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}&pageNumber=${currentPage}&pageSize=${rowsPerPage}`);
        const currentPageData = response?.Data || [];  // <-- remove extra .Data
        setGetManifest(currentPageData);

        // Total records for pagination
        const allDataResponse = await getApi(`/Manifest/getPendingManifest?branchCode=${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}&pageNumber=1&pageSize=10000`);
        const allData = allDataResponse?.Data || [];   // <-- remove extra .Data
        setTotalRecords(allData.length);

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
};
  useEffect(() => {
        fetchData();
    }, [currentPage, rowsPerPage,ref]);
    const refreshPendingData = async () => {
    await fetchData(); // your existing fetch function
};
    const filteredgetManifestData = getManifest.filter((manifest) => {
        const isDocketNoMatch =
            manifest?.DocketNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            manifest?.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            manifest?.fromDest?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            manifest?.toDest?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            manifest?.BookDate?.toLowerCase().includes(searchQuery.toLowerCase());
            
        let manifestDate = null;
        if (manifest?.BookDate) {
            const [day, month, year] = manifest.BookDate.split("/");
            manifestDate = new Date(year, month - 1, day);
        }

        const from = formDate.fromDate ? new Date(formDate.fromDate.setHours(0, 0, 0, 0)) : null;
        const to = formDate.toDate ? new Date(formDate.toDate.setHours(23, 59, 59, 999)) : null;

        const isDateInRange =
            (!from || (manifestDate && manifestDate >= from)) &&
            (!to || (manifestDate && manifestDate <= to));

        return isDocketNoMatch && isDateInRange;
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(totalRecords / rowsPerPage));

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="body">
            <div className="container1">
                <div className="addNew" style={{ margin: "0px" }}>
                    <div className="dropdown">
                        <button className="dropbtn">
                            <i className="bi bi-file-earmark-arrow-down"></i> Export
                        </button>
                        <div className="dropdown-content">
                            <button>Export to Excel</button>
                            <button>Export to PDF</button>
                        </div>
                    </div>

                    <div className="input-field" style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                        <label style={{ marginTop: "8px", textAlign: "end" }}>From Date</label>
                        <DatePicker
                        portalId="root-portal"   
                            selected={formDate.fromDate}
                            onChange={(date) => handleDateChange(date, "fromDate")}
                            dateFormat="dd/MM/yyyy"
                            className="form-control form-control-sm"
                            style={{ width: "120px", marginLeft: "10px" }}
                        />
                    </div>

                    <div className="input-field" style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                        <label style={{ marginTop: "8px", textAlign: "end" }}>To Date</label>
                        <DatePicker
                        portalId="root-portal"   
                            selected={formDate.toDate}
                            onChange={(date) => handleDateChange(date, "toDate")}
                            dateFormat="dd/MM/yyyy"
                            className="form-control form-control-sm"
                             style={{ width: "120px", marginLeft: "10px" }}
                        />
                    </div>

                    <div className="search-input">
                        <input
                            className="add-input1"
                            type="text"
                            placeholder="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{ marginLeft: "0%" }}
                        />
                        <button type="submit" title="search">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table table-bordered table-sm">
                        <thead className="table-sm">
                            <tr>
                                <th>Sr.No</th>
                                <th>Docket.No</th>
                                <th>Date</th>
                                <th>Client Name</th>
                                <th>Receiver</th>
                                <th>From City</th>
                                <th>To City</th>
                                <th>Qty</th>
                                <th>Weight</th>
                                <th>Invoice.No</th>
                                <th>Invoice.Value</th>
                                <th>E-Way.Bill.No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredgetManifestData.map((manifest, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{manifest.DocketNo}</td>
                                    <td>{manifest.BookDate}</td>
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
                        <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>{"<"}</button>
                        <span style={{ color: "#333", padding: "5px" }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>{">"}</button>
                    </div>

                    <div className="rows-per-page" style={{ display: "flex", flexDirection: "row", color: "black", marginLeft: "10px" }}>
                        <label style={{ marginTop: "16px", marginRight: "10px" }}>Rows per page:</label>
                        <select style={{ height: "40px", width: "60px", marginTop: "10px" }} value={rowsPerPage} onChange={handleRowsPerPageChange}>
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
    );
}

export default PendingManifest;
