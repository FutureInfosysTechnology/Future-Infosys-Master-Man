import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from 'react-modal';
import { postApi, getApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";


function CustomerStock() {

    const [getCustStock, setGetCustStock] = useState([]);                   // To Get Customer Stock Data
    const [getBranch, setGetBranch] = useState([]);                         // To Get Branch Data
    const [getCustomer, setGetCustomer] = useState([]);                     // To Get Customer Data
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addCustStock, setAddCustStock] = useState({
        custCode: "",
        cityCode: "",
        qty: "",
        fromDocketNo: "",
        toDocketNo: "",
        stockDate: ""
    })



    const fetchCustomerStockData = async () => {
        try {
            const response = await getApi('/Master/GetcustomerStock');
            setGetCustStock(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerData = async () => {
        try {
            const response = await getApi('/Master/getCustomer');
            setGetCustomer(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
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
        fetchCustomerStockData();
        fetchCustomerData();
        fetchBranchData();
    }, []);


    const filteredgetCustomer = getCustStock.filter((cust) =>
        (cust && cust.Customer_Name && cust.Customer_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (cust && cust.City_Name && cust.City_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetCustomer.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetCustomer.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            Client_Code: addCustStock.custCode,
            City_Code: addCustStock.cityCode,
            Qty: addCustStock.qty,
            FromDocketNo: addCustStock.fromDocketNo,
            ToDocketNo: addCustStock.toDocketNo,
            Stock_Date: addCustStock.stockDate
        }

        try {
            const response = await postApi('/Master/UpdateCustomerStock', requestBody, 'POST');
            if (response.status === 1) {
                setGetCustStock(getCustStock.map((cust) => cust.Customer_Code === addCustStock.custCode ? response.Data : cust));
                setAddCustStock({
                    custCode: '',
                    qty: '',
                    fromDocketNo: '',
                    toDocketNo: '',
                    cityCode: '',
                    stockDate: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCustomerStockData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the customer stock.', 'error');
            }
        } catch (error) {
            console.error("Failed to update Customer Stock:", error);
            Swal.fire('Error', 'Failed to update customer stock data', 'error');
        }
    }

    const handleSaveCustStockEntry = async (e) => {
        e.preventDefault();

        try {
            const response = await postApi(`/Master/addClientStockIssue?Client_Code=${addCustStock.custCode}
                &City_Code=${addCustStock.cityCode}
                &Qty=${addCustStock.qty}
                &FromDocketNo=${addCustStock.fromDocketNo}
                &ToDocketNo=${addCustStock.toDocketNo}
                &Stock_Date=${addCustStock.stockDate}`);
            if (response.status === 1) {
                setAddCustStock({
                    custCode: "",
                    cityCode: "",
                    qty: "",
                    fromDocketNo: "",
                    toDocketNo: "",
                    stockDate: ""
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCustomerStockData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Customer Stock Entry data', 'error');
        }
    };


    const handleDeleteCustStock = async (Customer_Code) => {
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
                await deleteApi(`/Master/DeleteClientstockissue?ClientCode=${Customer_Code}`);
                setGetCustStock(getCustStock.filter((cust) => cust.ClientCode !== Customer_Code));
                Swal.fire('Deleted!', 'Customer Stock has been deleted.', 'success');
                await fetchCustomerStockData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Customer Stock', 'error');
        }
    };

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);



    return (
        <div className="body">
            <div className="container1">
                <div className="addNew">
                    <div>
                        <button className='add-btn' onClick={() => {
                            setModalIsOpen(true); setIsEditMode(false);
                            setAddCustStock({ custCode: "", cityCode: "", qty: "", fromDocketNo: "", toDocketNo: "", stockDate: "" })
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
                                <th scope="col">Customer_Name</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">From_Docket_No</th>
                                <th scope="col">To_Docket_No</th>
                                <th scope="col">City_Name</th>
                                <th scope="col">Stock_Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>

                            {currentRows.map((cust, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                    <td>{cust.Customer_Name}</td>
                                    <td>{cust.Qty}</td>
                                    <td>{cust.FromDocketNo}</td>
                                    <td>{cust.ToDocketNo}</td>
                                    <td>{cust.City_Name}</td>
                                    <td>{cust.Stock_Date}</td>
                                    <td>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                            <button className='edit-btn' onClick={() => {
                                                setIsEditMode(true);
                                                setAddCustStock({
                                                    custCode: cust.Customer_Name,
                                                    qty: cust.Qty,
                                                    fromDocketNo: cust.FromDocketNo,
                                                    toDocketNo: cust.ToDocketNo,
                                                    cityCode: cust.City_Code,
                                                    stockDate: cust.Stock_Date
                                                });
                                                setModalIsOpen(true);
                                            }}>
                                                <i className='bi bi-pen'></i>
                                            </button>
                                            <button className='edit-btn' onClick={() => handleDeleteCustStock(cust.Customer_Code)}>
                                                <i className='bi bi-trash'></i></button>
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
                            id="rowsPerPage"
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            style={{ height: "40px", width: "60px", marginTop: "10px" }}
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
                            <header>Customer Stock Master</header>
                        </div>
                        <div className='container2'>
                            <form onSubmit={handleSaveCustStockEntry}>
                                <div className="fields2">
                                    <div className="input-field1">
                                        <label htmlFor="">Customer Name</label>
                                        <select value={addCustStock.custCode}
                                            onChange={(e) => setAddCustStock({ ...addCustStock, custCode: e.target.value })}
                                            aria-readonly={isEditMode}>
                                            <option value="" disabled>Select Customer Name</option>
                                            {getCustomer.map((cust, index) => (
                                                <option value={cust.Customer_Code} key={index}>{cust.Customer_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Branch Name</label>
                                        <select value={addCustStock.cityCode}
                                            onChange={(e) => setAddCustStock({ ...addCustStock, cityCode: e.target.value })} required>
                                            <option disabled value="">Select City Name</option>
                                            {getBranch.map((branch, index) => (
                                                <option value={branch.Branch_Code} key={index}>{branch.Branch_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Quantity</label>
                                        <input type="text" placeholder="Quantity"
                                            value={addCustStock.qty}
                                            onChange={(e) => setAddCustStock({ ...addCustStock, qty: e.target.value })} required />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">From Docket No</label>
                                        <input type="tel" placeholder="Enter From Docket No"
                                            value={addCustStock.fromDocketNo}
                                            onChange={(e) => setAddCustStock({ ...addCustStock, fromDocketNo: e.target.value })} required />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">To Docket No</label>
                                        <input type="tel" placeholder="Enter To Docket No"
                                            value={addCustStock.toDocketNo}
                                            onChange={(e) => setAddCustStock({ ...addCustStock, toDocketNo: e.target.value })} required />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Stock Date</label>
                                        <input type="date" value={addCustStock.stockDate}
                                            onChange={(e) => setAddCustStock({ ...addCustStock, stockDate: e.target.value })} required />
                                    </div>

                                    <div className="bottom-buttons" style={{ marginLeft: "25px" }}>
                                        {!isEditMode && (<button className="ok-btn" type="submit">Submit</button>)}
                                        {isEditMode && (<button className="ok-btn" type="button" onClick={handleUpdate}>Update</button>)}
                                        <button className="ok-btn" onClick={() => setModalIsOpen(false)}>Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal >
            </div>
        </div>
    )
}

export default CustomerStock;