import React, { useState, useEffect, useContext } from "react";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import Swal from "sweetalert2";
import { getApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import { refeshPend } from "../../../App";



function PendingDrs() {
    const {ref}=useContext(refeshPend)
    const [getData, setGetData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getApi(`/Runsheet/getPendingRunsheet?sessionLocationCode=${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}&pageNumber=${currentPage}&pageSize=${rowsPerPage}`);
                const currentPageData = Array.isArray(response.data) ? response.data : [];
                setGetData(currentPageData);

                const allDataResponse = await getApi(`/Runsheet/getPendingRunsheet?sessionLocationCode=${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}&pageNumber=1&pageSize=10000`);
                const allData = Array.isArray(allDataResponse.data) ? allDataResponse.data : [];
                setTotalRecords(allData.length);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, rowsPerPage,ref]);


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


    /**************** function to export table data in excel and pdf ************/
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getData');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getData.xlsx');
    };

    const handleExportPDF = () => {
        const input = document.getElementById('table-to-pdf');

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 10;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('getData.pdf');
        });
    };


    return (
        <>

            <div className="body">
                <div className="container1">

                    <div className="addNew">

                        <div className="dropdown">
                            <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                            <div className="dropdown-content">
                                <button onClick={handleExportExcel}>Export to Excel</button>
                                <button onClick={handleExportPDF}>Export to PDF</button>
                            </div>
                        </div>

                        <div className="search-input">
                            <input className="add-input" type="text" placeholder="search"
                                value={searchQuery} onChange={handleSearchChange} />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className='table-container'>
                        <table className='table table-bordered table-sm'>
                            <thead className='table-info body-bordered table-sm'>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Docket.No</th>
                                    <th scope="col">Booking.Date</th>
                                    <th scope="col">Manifest.No</th>
                                    <th scope="col">Manifest.Date</th>
                                    <th scope="col">Customer.Name</th>
                                    <th scope="col">Consignee.Name</th>
                                    <th scope="col">Mobile.No</th>
                                    <th scope="col">Pin.Code</th>
                                    <th scope="col">From</th>
                                    <th scope="col">To</th>
                                    <th scope="col">Qty</th>
                                    <th scope="col">Act.Weight</th>
                                    <th scope="col">Total.Amount</th>
                                    <th scope="col">Mode</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Customer.Type</th>
                                    <th scope="col">Inscan.Date</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {filteredgetData.map((runsheet, index) => (
                                    <tr key={index} style={{whiteSpace:"nowrap"}}>
                                        <td>{index + 1}</td>
                                        <td>{runsheet.DocketNo}</td>
                                        <td>{runsheet.Bookdate}</td>
                                        <td>{runsheet.manifestNo}</td>
                                        <td>{runsheet.ManifestDate}</td>
                                        <td>{runsheet.customerName}</td>
                                        <td>{runsheet.consigneeName}</td>
                                        <td>{runsheet.Consignee_Mob}</td>
                                        <td>{runsheet.consigneePin}</td>
                                        <td>{runsheet.OriginName}</td>
                                        <td>{runsheet.DestinationName}</td>
                                        <td>{runsheet.Qty}</td>
                                        <td>{runsheet.ActualWt}</td>
                                        <td>{runsheet.totalAmt}</td>
                                        <td>{runsheet.modeType}</td>
                                        <td>{runsheet.Status}</td>
                                        <td>{runsheet.customerType}</td>
                                        <td>{runsheet.Inscan_Dt}</td>
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

export default PendingDrs;