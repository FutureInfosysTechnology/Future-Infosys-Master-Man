import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";



function BranchStock() {

    const [getBranchStock, setGetBranchStock] = useState([]);                    // To Get Branch Stock Data
    const [getBranch, setGetBranch] = useState([]);                              // To Get Branch Name Data
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addBranchStock, setAddBranchStock] = useState({
        cityCode: "",
        qty: "",
        fromDocketNo: "",
        toDocketNo: "",
        stockDate: ""
    })

    const filteredgetBranch = getBranchStock.filter((branch) =>
        (branch && branch.City_Name && branch.City_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetBranch.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetBranch.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };



    const fetchBranchStockData = async () => {
        try {
            const response = await getApi('/Master/GetBranchStock');
            setGetBranchStock(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranchData = async () => {
        try {
            const response = await getApi('/Master/getBranch');
            setGetBranch(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranchStockData();
        fetchBranchData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            City_Code: addBranchStock.cityCode,
            Qty: addBranchStock.qty,
            FromDocketNo: addBranchStock.fromDocketNo,
            ToDocketNo: addBranchStock.toDocketNo,
            Stock_Date: addBranchStock.stockDate
        }

        try {
            const response = await postApi('/Master/UpdateBranchStock', requestBody, 'POST');
            if (response.status === 1) {
                setGetBranchStock(getBranchStock.map((branch) => branch.City_Code === addBranchStock.cityCode ? response.Data : branch));
                setAddBranchStock({
                    cityCode: '',
                    qty: '',
                    fromDocketNo: '',
                    toDocketNo: '',
                    stockDate: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchBranchStockData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the Branch Stock.', 'error');
            }
        } catch (error) {
            console.error('Error updating branch stock:', error);
            Swal.fire('Error', 'Failed to update branch stock data', 'error');
        }
    }

    const handleSaveBranchStock = async (e) => {
        e.preventDefault();

        try {
            const response = await postApi(`/Master/addBranchStockIssue?City_Code=${addBranchStock.cityCode}
                &Qty=${addBranchStock.qty}
                &FromDocketNo=${addBranchStock.fromDocketNo}
                &ToDocketNo=${addBranchStock.toDocketNo}
                &Stock_Date=${addBranchStock.stockDate}`);
            if (response.status === 1) {
                setAddBranchStock({
                    cityCode: "",
                    qty: "",
                    fromDocketNo: "",
                    toDocketNo: "",
                    stockDate: ""
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchBranchStockData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Branch Stock Entry data', 'error');
        }
    };

    const handleDeleteBranchStock = async (Branch_Code) => {
        try {
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (confirmation.isConfirmed) {
                await deleteApi(`/Master/DeleteBranchstockissue?CityCode=${Branch_Code}`);
                setGetBranchStock(getBranchStock.filter((branch) => branch.CityCode !== Branch_Code));
                Swal.fire('Deleted!', 'Branch Stock has been deleted.', 'success');
                await fetchBranchStockData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Branch Stock', 'error');
        }
    };

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    return (
        <>

            <div className="body">
                <div className="container1">
                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => {
                                setModalIsOpen(true); setIsEditMode(false);
                                setAddBranchStock({ cityCode: "", qty: "", fromDocketNo: "", toDocketNo: "", stockDate: "" })
                            }}>
                                <i className="bi bi-plus-lg"></i>
                                <span>ADD NEW</span>
                            </button>

                            <div className="dropdown">
                                <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                                <div className="dropdown-content">
                                    <button >Export to Excel</button>
                                    <button >Export to PDF</button>
                                </div>
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
                            <thead className='table-sm'>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Branch_Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">From_Docket_No</th>
                                    <th scope="col">To_Docket_No</th>
                                    <th scope="col">Stock_Date</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((branch, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                        <td>{branch.City_Name}</td>
                                        <td>{branch.Qty}</td>
                                        <td>{branch.FromDocketNo}</td>
                                        <td>{branch.ToDocketNo}</td>
                                        <td>{branch.Stock_Date}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setAddBranchStock({
                                                        cityCode: branch.City_Code,
                                                        qty: branch.Qty,
                                                        fromDocketNo: branch.FromDocketNo,
                                                        toDocketNo: branch.ToDocketNo,
                                                        stockDate: branch.Stock_Date
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button className='edit-btn' onClick={() => handleDeleteBranchStock(branch.Branch_Code)}>
                                                    <i className='bi bi-trash'></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                  <div className="row" style={{whiteSpace:"nowrap" }}>
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
                            <label htmlFor="rowsPerPage"  className="me-2">Rows per page: </label>
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


                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-volumetric" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Branch Stock Master</header>
                            </div>
                            <div className='container2'>
                                <form onSubmit={handleSaveBranchStock}>
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Branch Name</label>
                                            <select value={addBranchStock.cityCode}
                                                onChange={(e) => setAddBranchStock({ ...addBranchStock, cityCode: e.target.value })}
                                                required aria-readonly={isEditMode}>
                                                <option value="" disabled >Select Branch Name</option>
                                                {getBranch.map((branch, index) => (
                                                    <option value={branch.Branch_Code} key={index}>{branch.Branch_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Quantity</label>
                                            <input type="text" placeholder="Quantity"
                                                value={addBranchStock.qty}
                                                onChange={(e) => setAddBranchStock({ ...addBranchStock, qty: e.target.value })} required />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">From Docket No</label>
                                            <input type="tel" placeholder="Enter From Docket No" required
                                                value={addBranchStock.fromDocketNo}
                                                onChange={(e) => setAddBranchStock({ ...addBranchStock, fromDocketNo: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">To Docket No</label>
                                            <input type="tel" placeholder="Enter To Docket No" required
                                                value={addBranchStock.toDocketNo}
                                                onChange={(e) => setAddBranchStock({ ...addBranchStock, toDocketNo: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Stock Date</label>
                                            <input type="date" value={addBranchStock.stockDate}
                                                onChange={(e) => setAddBranchStock({ ...addBranchStock, stockDate: e.target.value })} required />
                                        </div>

                                        <div className="bottom-buttons" style={{ marginTop: "18px", marginLeft: "25px" }}>
                                            {!isEditMode && (<button className="ok-btn" type="submit">Submit</button>)}
                                            {isEditMode && (<button className="ok-btn" type="button" onClick={handleUpdate}>Update</button>)}
                                            <button className="ok-btn" onClick={() => setModalIsOpen(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </form>

                                <div className="table-container1" style={{ margin: "10px" }}>
                                    <table className="table" style={{ height: "100px" }} >
                                        <thead>
                                            <tr>
                                                <th>From Awb No</th>
                                                <th>To Awb No</th>
                                            </tr>
                                        </thead>

                                        <tbody className="table-body">
                                            <tr>
                                                <td><input type="tel" /></td>
                                                <td><input type="tel" /></td>
                                            </tr>
                                            <tr>
                                                <td><input type="tel" /></td>
                                                <td><input type="tel" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Modal >
                </div>
            </div>

        </>
    );
};

export default BranchStock;