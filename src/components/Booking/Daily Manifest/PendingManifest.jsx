import React, { useState, useEffect } from "react";
import '../../Tabs/tabs.css';
import { getApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";


function PendingManifest() {

    const [getManifest, setGetManifest] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


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

    return (
        <>

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

                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                            <label htmlFor="" style={{ marginTop: "8px" }}>From Date </label>
                            <input type="date" style={{ width: "120px", marginLeft: "10px" }}
                                value={fromDate}
                                onChange={handleFromDateChange} />
                        </div>

                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                            <label htmlFor="" style={{ marginTop: "8px" }}>To Date </label>
                            <input type="date" style={{ width: "120px", marginLeft: "10px" }}
                                value={toDate}
                                onChange={handleToDateChange} />
                        </div>

                        <div className="search-input">
                            <input className="add-input1" type="text" placeholder="search"
                                value={searchQuery} onChange={handleSearchChange} style={{ marginLeft: "0%" }} />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className='table-container'>
                        <table className='table table-bordered table-sm'>
                            <thead className='table-sm'>
                                <tr>
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

        </>
    );
};


export default PendingManifest;