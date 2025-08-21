import React, { useState, useEffect } from "react";
import { getApi, deleteApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import Swal from 'sweetalert2';


function ScanbyManifest() {

    const [getData, setGetData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchData = async () => {
        try {
            const response = await getApi(`/Inscan/viewInscanData?SessionLocationCode=DEL&pageNumber=${currentPage}&pageSize=${rowsPerPage}`);
            const currentPageData = Array.isArray(response.data) ? response.data : [];
            setGetData(currentPageData);
            console.log(getData);

            const allDataResponse = await getApi(`/Inscan/viewInscanData?SessionLocationCode=DEL&pageNumber=1&pageSize=10000`);
            const allData = Array.isArray(allDataResponse.data) ? allDataResponse.data : [];
            setTotalRecords(allData.length);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            console.log('error')
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, rowsPerPage]);

    const handleDelete = async (DocketNo) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this Inscan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteApi(`/Inscan/deleteInscan?DocketNo=${DocketNo}&SessionLocationCode=DEL`);
                setGetData(getData.filter((inscan) => inscan.DocketNo !== DocketNo));
                Swal.fire('Deleted!', 'The Inscan has been deleted.', 'success');
                await fetchData();
            } catch (err) {
                console.error('Delete Error:', err);
                Swal.fire('Error', 'Failed to delete Inscan', 'error');
            }
        }
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    return (
        <>

            <div className="container1">

                <div className="table-container">
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th scope="col">Sr No.</th>
                                <th scope="col">Docket.No</th>
                                <th scope="col">Booking.Date</th>
                                <th scope="col">Customer.Name</th>
                                <th scope="col">Receiver.Name</th>
                                <th scope="col">From.City</th>
                                <th scope="col">To.City</th>
                                <th scope="col">Manifest.No</th>
                                <th scope="col">Manifest.Date</th>
                                <th scope="col">QTY</th>
                                <th scope="col">Inscan.Status</th>
                                <th scope="col">Inscan.Remark</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {getData.map((inscan, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{inscan.DocketNo}</td>
                                    <td>{inscan.Bookdate}</td>
                                    <td>{inscan.Customer_Name}</td>
                                    <td>{inscan.ConsigneeName}</td>
                                    <td>{inscan.FromDest}</td>
                                    <td>{inscan.ToDest}</td>
                                    <td>{inscan.ManifestNo}</td>
                                    <td>{inscan.ManifestDt}</td>
                                    <td>{inscan.qty}</td>
                                    <td>{inscan.InscanStatus}</td>
                                    <td>{inscan.InscanRemark}</td>
                                    <td>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                            <button className="edit-btn" onClick={() => handleDelete(inscan.DocketNo)}>
                                                <i className='bi bi-trash' style={{ fontSize: "24px" }}></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
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

        </>
    );
};

export default ScanbyManifest;