import React, { useState, useEffect, useContext } from "react";
import '../../Admin Master/Transport Master/modemaster.css';
import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import Swal from "sweetalert2";
import Select from 'react-select';
import 'react-toggle/style.css';
import { refeshPend } from "../../../App";


function ScanbyAirway() {

    const [getData, setGetData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedDocketNos, setSelectedDocketNos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const {hubFun}=useContext(refeshPend);
    const statusOptions = [
        { value: "Arrived", label: "Arrived" },
        // (maybe you meant "Return"?)
    ];
    const [formData, setFormData] = useState({
        DocketNo: [],
        Inscan_Status: "",
        Inscan_Remark: ""
    })



    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getApi(`/Inscan/pendingInscan?SessionLocationCode=DEL&pageNumber=${currentPage}&pageSize=${rowsPerPage}`);
            const currentPageData = Array.isArray(response.data) ? response.data : [];
            setGetData(currentPageData);

            const allDataResponse = await getApi(`/Inscan/pendingInscan?SessionLocationCode=DEL&pageNumber=1&pageSize=10000`);
            const allData = Array.isArray(allDataResponse.data) ? allDataResponse.data : [];
            setTotalRecords(allData.length);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, rowsPerPage]);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
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

    const handleRowSelect = (index, docketNo) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
            setSelectedDocketNos(selectedDocketNos.filter(docket => docket !== docketNo));
        } else {
            setSelectedRows([...selectedRows, index]);
            setSelectedDocketNos([...selectedDocketNos, docketNo]);
        }
    };

    const filteredInscan = getData.filter((Inscan) =>
        (Inscan && Inscan.DocketNo && Inscan.DocketNo?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
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
            DocketNo: selectedDocketNos,
            SessionLocationCode: "DEL",
            Inscan_Status: formData.Inscan_Status,
            Inscan_Remark: formData.Inscan_Remark
        };

        try {
            const response = await postApi('/Inscan/generateInscan', requestPayload);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Data has been successfully generated!',
                timer: 2000,
                showConfirmButton: false,
            });
            setFormData({
                Inscan_Status: "",
                Inscan_Remark: "",
            });
            setSelectedRows([]);
            setSelectedDocketNos([]);
            await fetchData();
            hubFun();
        } catch (error) {
            console.error("Error submitting Inscan: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while generating data. Please try again.',
            });
        }
    };

    return (
        <>

            <div className="container1" style={{ padding: "0px" }}>

                <form action="" style={{ padding: "0px", margin: "0px" }} onSubmit={handleSubmit}>
                    <div className="fields2">
                        <div className="input-field3">
                            <label>Status</label>
                            <Select
                                options={statusOptions}
                                value={statusOptions.find(opt => opt.value === formData.Inscan_Status) || null}
                                onChange={(selectedOption) =>
                                    setFormData({
                                        ...formData,
                                        Inscan_Status:selectedOption?selectedOption.value:""
                                    })
                                }
                                placeholder="Select Status"
                                required
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
                            <label>Remark</label>
                            <input type="text" placeholder="Enter Remark" value={formData.Inscan_Remark}
                                onChange={(e) => setFormData({ ...formData, Inscan_Remark: e.target.value })} required />
                        </div>

                        <div className="input-field3" style={{ width: "120px" }}>
                            <label>Docket No</label>
                            <input style={{ width: "120px" }} type="tel" placeholder="Enter Docket No"
                                value={selectedDocketNos.join(", ")}
                                readOnly />
                        </div>

                        <div className="bottom-buttons" style={{ marginTop: "18px", marginLeft: "25px" }}>
                            <button className="ok-btn" type="submit">Submit</button>
                            <button className="ok-btn" style={{ width: "110px" }}>Cancel</button>
                        </div>
                    </div>
                </form>

                <div className="addNew" style={{ justifyContent: "end", paddingRight: "10px" }}>
                    <div className="search-input">
                        <input className="add-input" type="text" placeholder="search"
                            value={searchQuery} onChange={handleSearchChange} />
                        <button type="submit" title="search">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>

                <div className='table-container' style={{ padding: "10px" }}>
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
                                <th scope="col">Manifest.No</th>
                                <th scope="col">Manifest.Date</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            {filteredInscan.map((manifest, index) => (
                                <tr key={index}>
                                    <td scope="col">
                                        <input type="checkbox" style={{ height: "15px", width: "15px" }} checked={selectedRows.includes(index)}
                                            onChange={() => handleRowSelect(index, manifest.DocketNo)} />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{manifest.DocketNo}</td>
                                    <td style={{ width: "100px" }}>{manifest.Bookdate}</td>
                                    <td>{manifest.Customer_Name}</td>
                                    <td>{manifest.ConsigneeName}</td>
                                    <td>{manifest.FromDest}</td>
                                    <td>{manifest.ToDest}</td>
                                    <td>{manifest.qty}</td>
                                    <td>{manifest.actualwT}</td>
                                    <td>{manifest.ManifestNo}</td>
                                    <td>{manifest.manifestDt}</td>
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


export default ScanbyAirway;