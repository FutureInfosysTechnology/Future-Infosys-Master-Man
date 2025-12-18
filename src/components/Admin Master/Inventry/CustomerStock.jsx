import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import Modal from 'react-modal';
import Select from "react-select";
import Swal from "sweetalert2";
import { deleteApi, getApi, postApi } from "../Area Control/Zonemaster/ServicesApi";

function CustomerStock() {
    const [openRow, setOpenRow] = useState(null);
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
        stockDate: new Date(),
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
            const response = await getApi('/Master/getCustomerData');
            setGetCustomer(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranchData = async () => {
        try {
            const response = await getApi('/Master/getAllBranchData');
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
        (cust?.Customer_Name && cust?.Customer_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cust?.City_Name && cust?.City_Name.toLowerCase().includes(searchQuery.toLowerCase()))
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
                    stockDate: new Date(),
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
                    stockDate: new Date(),
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
    
 if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


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
                    <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                        <thead className='table-sm'>
                            <tr>
                                <th scope="col">Actions</th>
                                <th scope="col">Sr.No</th>
                                <th scope="col">Customer_Name</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">From_Docket_No</th>
                                <th scope="col">To_Docket_No</th>
                                <th scope="col">City_Name</th>
                                <th scope="col">Stock_Date</th>

                            </tr>
                        </thead>
                        <tbody className='table-body'>

                            {currentRows.map((cust, index) => (
                                <tr key={index} style={{ fontSize: "12px", position: "relative" }}>
                                    <td>
                                        <PiDotsThreeOutlineVerticalFill
                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                            onClick={() => setOpenRow(openRow === index ? null : index)}
                                        />
                                        {openRow === index && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    flexDirection: "row",
                                                    position: "absolute",
                                                    alignItems: "center",
                                                    left: "100px",
                                                    top: "0px",
                                                    borderRadius: "10px",
                                                    backgroundColor: "white",
                                                    zIndex: "999999",
                                                    height: "30px",
                                                    width: "50px",
                                                    padding: "10px",
                                                }}
                                            >

                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setOpenRow(null);
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
                                                <button className='edit-btn' onClick={() => {
                                                    setOpenRow(null);
                                                    handleDeleteCustStock(cust.Customer_Code);
                                                }}>
                                                    <i className='bi bi-trash'></i></button>
                                            </div>
                                        )}
                                    </td>

                                    <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                    <td>{cust.Customer_Name}</td>
                                    <td>{cust.Qty}</td>
                                    <td>{cust.FromDocketNo}</td>
                                    <td>{cust.ToDocketNo}</td>
                                    <td>{cust.City_Name}</td>
                                    <td>{cust.Stock_Date}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="row" style={{ whiteSpace: "nowrap" }}>
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
                        <label htmlFor="rowsPerPage" className="me-2">Rows per page: </label>
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
                    className="custom-modal-volumetric" contentLabel="Modal" style={{
                        content: {
                            width: '90%',
                            top: '50%',             // Center vertically
                            left: '50%',
                            whiteSpace: "nowrap"
                        },
                    }}>
                    <div className="custom-modal-content">
                        <div className="header-tittle">
                            <header>Customer Stock Master</header>
                        </div>
                        <div className='container2'>
                            <form onSubmit={handleSaveCustStockEntry}>
                                <div className="fields2">
                                    <div className="input-field1">
                                        <label htmlFor="">Customer Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getCustomer.map(cust => ({
                                                value: cust.Customer_Code,
                                                label: cust.Customer_Name,
                                            }))}
                                            value={
                                                addCustStock.custCode
                                                    ? {
                                                        value: addCustStock.custCode,
                                                        label:
                                                            getCustomer.find(c => c.Customer_Code === addCustStock.custCode)
                                                                ?.Customer_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={selected =>
                                                setAddCustStock({
                                                    ...addCustStock,
                                                    custCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Customer Name"
                                            isSearchable={true}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                            }}
                                            isDisabled={isEditMode}
                                        />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Branch Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getBranch.map(branch => ({
                                                value: branch.Branch_Code,
                                                label: branch.Branch_Name,
                                            }))}
                                            value={
                                                addCustStock.cityCode
                                                    ? {
                                                        value: addCustStock.cityCode,
                                                        label:
                                                            getBranch.find(b => b.Branch_Code === addCustStock.cityCode)
                                                                ?.Branch_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={selected =>
                                                setAddCustStock({
                                                    ...addCustStock,
                                                    cityCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select City Name"
                                            isSearchable={true}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                            }}
                                        />
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
                                        <DatePicker
                                            portalId="root-portal"
                                            selected={addCustStock.stockDate}
                                            onChange={(date) =>
                                                setAddCustStock({
                                                    ...addCustStock,
                                                    stockDate: date,
                                                })
                                            }
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control form-control-sm"
                                            required
                                        />

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