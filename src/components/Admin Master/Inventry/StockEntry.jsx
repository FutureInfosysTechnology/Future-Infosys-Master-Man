import React, { useState, useEffect } from "react";
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";


function StockEntry() {

    const [getStockEntry, setGetStockEntry] = useState([]);                 // To Get Stock Entry Data
    const [getBranch, setGetBranch] = useState([]);                         // To Get Branch Data
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addStock, setAddStock] = useState({
        cityCode: "",
        qty: "",
        fromDocketNo: "",
        toDocketNo: "",
        stockDate: ""
    })


    const filteredgetStock = getStockEntry.filter((stock) =>
        (stock && stock.City_Name && stock.City_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetStock.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetStock.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };



    const fetchStockEntryData = async () => {
        try {
            const response = await getApi('/Master/Stockentry');
            setGetStockEntry(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        }
        finally {
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
        fetchStockEntryData();
        fetchBranchData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            City_Code: addStock.cityCode,
            Qty: addStock.qty,
            FromDocketNo: addStock.fromDocketNo.trim(),
            ToDocketNo: addStock.toDocketNo.trim(),
            Stock_Date: addStock.stockDate
        }

        try {
            const response = await postApi('/Master/UpdateStockEntry', requestBody, 'POST');
            if (response.status === 1) {
                setGetStockEntry(getStockEntry.map((stock) => stock.City_Code === addStock.cityCode ? response.Data : stock));
                setAddStock({
                    cityCode: '',
                    qty: '',
                    fromDocketNo: '',
                    toDocketNo: '',
                    stockDate: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchStockEntryData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the stock entry.', 'error');
            }
        } catch (error) {
            console.error("Failed to update stock entry:", error);
            Swal.fire('Error', 'Failed to update stock entry data', 'error');
        }
    }


    const handleSaveStockEntry = async (e) => {
        e.preventDefault();

        try {
            const response = await postApi(`/Master/addStockDetails?City_Code=${addStock.cityCode}
                &Qty=${addStock.qty}
                &FromDocketNo=${addStock.fromDocketNo}
                &ToDocketNo=${addStock.toDocketNo}
                &Stock_Date=${addStock.stockDate}`);
            if (response.status === 1) {
                setAddStock({
                    cityCode: "",
                    qty: "",
                    fromDocketNo: "",
                    toDocketNo: "",
                    stockDate: ""
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchStockEntryData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Stock Entry data', 'error');
        }
    };


    const handleDeleteStock = async (Customer_Code) => {
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
                await deleteApi(`/Master/DeletStockDetails?CityCode=${Customer_Code}`);
                setGetStockEntry(getStockEntry.filter((stock) => stock.CityCode !== Customer_Code));
                Swal.fire('Deleted!', 'Stock Entry has been deleted.', 'success');
                await fetchStockEntryData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Stock Entry', 'error');
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getStockEntry);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getStockEntry');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'Stock Entry.xlsx');
    };

    const handleExportPDF = () => {
        const pdfData = getStockEntry.map(({ id, Qty, FromDocketNo, ToDocketNo, Stock_Date, City_Name }) => [id, Qty, FromDocketNo, ToDocketNo, Stock_Date, City_Name]);
        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text('Stock Entry Data', 14, 20);
        const headers = [['Sr.No', 'Quantity', 'From Docket No', 'To Docket No', 'Stock Date', 'City Name']];
        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 30,
            theme: 'grid'
        });
        pdf.save('Stock Entry.pdf');
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
                                setAddStock({ cityCode: "", qty: "", fromDocketNo: "", toDocketNo: "", stockDate: "" })
                            }}>
                                <i className="bi bi-plus-lg"></i>
                                <span>ADD NEW</span>
                            </button>

                            <div className="dropdown">
                                <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                                <div className="dropdown-content">
                                    <button onClick={handleExportExcel}>Export to Excel</button>
                                    <button onClick={handleExportPDF}>Export to PDF</button>
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
                                    <th scope="col">City Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">From Docket No</th>
                                    <th scope="col">To Docket No</th>
                                    <th scope="col">Stock Date</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((stock, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{stock.City_Name}</td>
                                        <td>{stock.Qty}</td>
                                        <td>{stock.FromDocketNo}</td>
                                        <td>{stock.ToDocketNo}</td>
                                        <td>{stock.Stock_Date}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setAddStock({
                                                        cityCode: stock.City_Code,
                                                        qty: stock.Qty,
                                                        fromDocketNo: stock.FromDocketNo,
                                                        toDocketNo: stock.ToDocketNo,
                                                        stockDate: stock.Stock_Date
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button className='edit-btn' onClick={() => handleDeleteStock(stock.City_Code)}>
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
                        className="custom-modal-stock" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Stock Entry Master</header>
                            </div>
                            <div className='container2'>
                                <form onSubmit={handleSaveStockEntry}>
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Branch Name</label>
                                            <select value={addStock.cityCode}
                                                onChange={(e) => setAddStock({ ...addStock, cityCode: e.target.value })}
                                                required aria-readonly={isEditMode}>
                                                <option disabled value="">Select branch</option>
                                                {getBranch.map((branch, index) => (
                                                    <option value={branch.Branch_Code} key={index}>{branch.Branch_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">No. of C. Note</label>
                                            <input type="text" value={addStock.qty}
                                                onChange={(e) => setAddStock({ ...addStock, qty: e.target.value })}
                                                placeholder="Enter C.Note" required />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">From Airway Bill No</label>
                                            <input type="text" value={addStock.fromDocketNo}
                                                onChange={(e) => setAddStock({ ...addStock, fromDocketNo: e.target.value })}
                                                placeholder="Enter From" required />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">To Airway Bill No</label>
                                            <input type="text" value={addStock.toDocketNo}
                                                onChange={(e) => setAddStock({ ...addStock, toDocketNo: e.target.value })}
                                                placeholder="Enter To" required />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Stock Date</label>
                                            <input type="date" value={addStock.stockDate}
                                                onChange={(e) => setAddStock({ ...addStock, stockDate: e.target.value })}
                                                required />
                                        </div>

                                    </div>

                                    <div className='bottom-buttons'>
                                        {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                        {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >
                </div>
            </div>
        </>
    )
}


export default StockEntry;