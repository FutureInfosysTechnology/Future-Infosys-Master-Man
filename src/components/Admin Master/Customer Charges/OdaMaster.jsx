import React, { useState, useEffect } from "react";
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { deleteApi, getApi, postApi } from "../Area Control/Zonemaster/ServicesApi";



function OdaMaster() {

    const [getODA, setGetODA] = useState([]);
    const [openRow, setOpenRow] = useState(null);
    const [getCustomer, setGetCustomer] = useState([]);         // To Get Customer Data
    const [getCity, setGetCity] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formdata, setFormdata] = useState({
        Customer_Code: "",
        Product_Code: "",
        Method: "",
        Amount: "",
        ConnectingHub: ""
    });
    const [submittedData, setSubmittedData] = useState([]);
    const [tableRowData, setTableRowData] = useState({
        Rd_Number: "",
        Amount_1: "",
        Amount_2: "",
        Amount_3: "",
        Amount_4: ""
    })


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = getODA.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(getODA.length / rowsPerPage);

    const fetchODAData = async () => {
        try {
            const response = await getApi('/Master/getODAData');
            setGetODA(Array.isArray(response.data) ? response.data : []);
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

    const fetchCityData = async () => {
        try {
            const response = await getApi('/Master/getdomestic');
            setGetCity(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchModeData = async () => {
        try {
            const response = await getApi('/Master/getMode');
            setGetMode(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchODAData();
        fetchCustomerData();
        fetchCityData();
        fetchModeData();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTableRowData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddRow = (e) => {
        e.preventDefault();

        if (!tableRowData.Amount_1) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in the empty fields.',
                confirmButtonText: 'OK',
            });
            return;
        }

        setSubmittedData((prev) => [...prev, tableRowData]);
        setTableRowData({
            Rd_Number: "",
            Amount_1: "",
            Amount_2: "",
            Amount_3: ""
        });
    };

    const handlesave = async (e) => {
        e.preventDefault();

        const requestBody = {
            Customer_Code: formdata.Customer_Code,
            Product_Code: formdata.Product_Code,
            Method: formdata.Method,
            Amount: formdata.Amount,
            ConnectingHub: "Hub001",
            ODADetailJson: submittedData.map((data) => ({
                Rd_Number: data.Rd_Number,
                Amount_1: data.Amount_1,
                Amount_2: data.Amount_2,
                Amount_3: data.Amount_3,
                Amount_4: data.Amount_4
            }))
        }

        try {
            const response = await postApi('/Master/addODAData', requestBody, 'POST');
            if (response.status === 1) {
                setGetODA([...getODA, response.data]);
                setFormdata({
                    Customer_Code: "",
                    Product_Code: "",
                    Method: "",
                    Amount: "",
                    ConnectingHub: ""
                });
                setTableRowData({ Rd_Number: "", Amount_1: "", Amount_2: "", Amount_3: "", Amount_4: "" })
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchODAData();
            }
        } catch (error) {
            console.error('Unable to save Customer ODA Data:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            Customer_Code: formdata.Customer_Code,
            Product_Code: formdata.Product_Code,
            Method: formdata.Method,
            Amount: formdata.Amount,
            ConnectingHub: "DEL",
            ODADetailJson: submittedData.map((data) => ({
                Rd_Number: data.Rd_Number,
                Amount_1: data.Amount_1,
                Amount_2: data.Amount_2,
                Amount_3: data.Amount_3
            }))
        }

        try {
            const response = await postApi('/Master/updateodaMaster', requestBody, 'POST');
            if (response.status === 1) {
                setGetODA(getODA.map((oda) => oda.Customer_Code === formdata.Customer_Code ? response.data : oda));
                setFormdata({
                    Customer_Code: "",
                    Product_Code: "",
                    Method: "",
                    Amount: "",
                    ConnectingHub: ""
                });
                setTableRowData({
                    Rd_Number: "",
                    Amount_1: "",
                    Amount_2: "",
                    Amount_3: "",
                    Amount_4: ""
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchODAData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the ODA Master.', 'error');
            }
        } catch (error) {
            console.error("Unable to update ODA Master:", error);
        }
    }

    const handledelete = async (Club_No) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this ODA?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteApi(`/Master/DeleteODAData?clubNo=${Club_No}`);
                Swal.fire('Deleted!', 'The zone has been deleted.', 'success');
                await fetchODAData();
            } catch (error) {
                console.error('Unable to delete ODA:', error);
            }
        }
    }

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getODA);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Zones');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'zones.xlsx');
    };

    const handleExportPDF = () => {
        const input = document.getElementById('table-to-pdf');

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190; // Set width of the image
            const pageHeight = pdf.internal.pageSize.height; // Get the height of the PDF page
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate the height of the image
            let heightLeft = imgHeight;
            let position = 10;  /****Set the margin top of pdf */

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('zones.pdf');
        });
    };

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);



    return (
        <div className="body">
            <div className="container1">
                <div className="addNew">
                    <div>
                        <button className='add-btn' onClick={() => { setModalIsOpen(true); setIsEditMode(false); }}>
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
                        <input className="add-input" type="text" placeholder="search" />
                        <button type="submit" title="search">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>

                <div className='table-container'>
                    <table className='table table-bordered table-sm' style={{whiteSpace:"nowrap"}}>
                        <thead className='table-sm'>
                            <tr>
                                <th scope="col">Actions</th>
                                <th scope="col">Sr.No</th>
                                <th scope="col">Customer Name</th>
                                <th scope="col">Club No</th>
                                <th scope="col">Mode</th>
                                <th scope="col">Method</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Product_Code</th>
                                <th scope="col">ConnectingHub</th>
                                
                            </tr>
                        </thead>
                        <tbody className='table-body'>

                            {currentRows.map((oda, index) => (
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
                                                    left: "90px",
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
                                                setFormdata({
                                                    Customer_Code: oda.Customer_Code,
                                                    Product_Code: oda.Product_Code,
                                                    Method: oda.Method,
                                                    Amount: oda.Amount,
                                                    ConnectingHub: oda.ConnectingHub
                                                });
                                                setSubmittedData(oda.ODADetailJson || []);
                                                setModalIsOpen(true);
                                            }}>
                                                <i className='bi bi-pen'></i>
                                            </button>
                                            <button className='edit-btn' onClick={() =>{
                                                 setOpenRow(null);
                                                 handledelete(oda.Club_No);
                                                 }}>
                                                <i className='bi bi-trash'></i>
                                            </button>
                                            </div>
                                        )}
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{oda.Customer_Name}</td>
                                    <td>{oda.Club_No}</td>
                                    <td>{oda.Mode_Name}</td>
                                    <td>{oda.Method}</td>
                                    <td>{oda.Amount}</td>
                                    <td>{oda.Product_Code}</td>
                                    <td>{oda.ConnectingHub}</td>
                                   
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

                <Modal id="modal" overlayClassName="custom-overlay" isOpen={modalIsOpen}
                    style={{
                        content: {
                            top: '55%',
                            left: '55%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            height: '386px',
                            width: '50%',
                            padding: "0px",
                            borderRadius: '10px',
                        },
                    }}>
                    <div>
                        <div className="header-tittle">
                            <header>ODA Master Entry</header>
                        </div>

                        <div className='container2'>
                            <form onSubmit={handlesave}>

                                <div className="fields2">
                                    <div className="input-field1">
                                        <label htmlFor="">Customer Name</label>
                                        <select required value={formdata.Customer_Code}
                                            onChange={(e) => setFormdata({ ...formdata, Customer_Code: e.target.value })}>
                                            <option value="" disabled >Customer Name</option>
                                            {getCustomer.map((cust, index) => (
                                                <option value={cust.Customer_Code} key={index}>{cust.Customer_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Mode</label>
                                        <select>
                                            <option value="" disabled >Select Mode</option>
                                            {getMode.map((mode, index) => (
                                                <option value={mode.Mode_Code} key={index}>{mode.Mode_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Rate Per Kg</label>
                                        <input type="tel" placeholder="Rate/Kg" value={formdata.Amount}
                                            onChange={(e) => setFormdata({ ...formdata, Amount: e.target.value })} />
                                    </div>

                                    {/* <div className="input-field1">
                                        <label htmlFor="">Club Number</label>
                                        <input type="tel" placeholder="Club Number" value={formdata.Club_No}
                                            onChange={(e) => setFormdata({ ...formdata, Club_No: e.target.value })} required />
                                    </div> */}

                                    <div className="input-field1">
                                        <label htmlFor="">Product Name</label>
                                        <input type="text" placeholder="Product Name" value={formdata.Product_Code}
                                            onChange={(e) => setFormdata({ ...formdata, Product_Code: e.target.value })} required />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Method</label>
                                        <select value={formdata.Method} required
                                            onChange={(e) => setFormdata({ ...formdata, Method: e.target.value })}>
                                            <option value="" disabled >Select Method</option>
                                            <option value="Online">Online</option>
                                            <option value="Offline">Offline</option>
                                        </select>
                                    </div>

                                    {/* <div className="input-field1">
                                        <label htmlFor="">Connecting Hub</label>
                                        <select required value={formdata.ConnectingHub}
                                            onChange={(e) => setFormdata({ ...formdata, ConnectingHub: e.target.value })}>
                                            <option value="" disabled >Connecting Hub</option>
                                            {getCity.map((city, index) => (
                                                <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">RD Number</label>
                                        <input type="tel" placeholder="RD Number" value={formdata.Rd_Number}
                                            onChange={(e) => setFormdata({ ...formdata, Rd_Number: e.target.value })} required />
                                    </div> */}

                                    {/* <div className="input-field1">
                                        <label htmlFor="" style={{ marginTop: "18px" }}></label>
                                        <button className="ok-btn" style={{ height: "100%" }}
                                            onClick={(e) => { e.preventDefault(); setModalIsOpen1(true); }}>Distance Master<i className="bi bi-arrow-down"></i></button>
                                    </div> */}
                                </div>

                                <div className='bottom-buttons'>
                                    {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                    {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                    <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                </div>
                            </form>

                            <div className='table-container1' style={{ padding: "10px" }}>
                                <table className='table table-bordered table-sm'>
                                    <thead className=''>
                                        <tr>
                                            <th scope="col">RD Number</th>
                                            <th scope="col">KMs / KGs</th>
                                            <th scope="col">1-20</th>
                                            <th scope="col">21-100</th>
                                            <th scope="col">101-300</th>
                                            <th>Save</th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-body'>
                                        <tr>
                                            <td>
                                                <input type="tel" placeholder="RD Number" value={tableRowData.Rd_Number}
                                                    onChange={handleChange} name="Rd_Number" />
                                            </td>
                                            <td>
                                                <input type="text" placeholder="KMs/KGs" value={tableRowData.Amount_1}
                                                    onChange={handleChange} name="Amount_1" />
                                            </td>
                                            <td>
                                                <input type="text" placeholder="1-20" value={tableRowData.Amount_2}
                                                    onChange={handleChange} name="Amount_2" />
                                            </td>
                                            <td>
                                                <input type="text" placeholder="21-100" value={tableRowData.Amount_3}
                                                    onChange={handleChange} name="Amount_3" />
                                            </td>
                                            <td>
                                                <input type="text" placeholder="101-300" value={tableRowData.Amount_4}
                                                    onChange={handleChange} name="Amount_4" />
                                            </td>
                                            <td>
                                                <button className="ok-btn" style={{ padding: "2px", fontSize: "20px" }}
                                                    onClick={handleAddRow}>
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className='table-container1' style={{ padding: "10px" }}>
                                <table className='table table-bordered table-sm'>
                                    <thead className=''>
                                        <tr>
                                            <th>Sr No</th>
                                            <th scope="col" style={{ width: "100px" }}>KMs / KGs</th>
                                            <th scope="col" style={{ width: "100px" }}>1-20</th>
                                            <th scope="col" style={{ width: "100px" }}>21-100</th>
                                            <th scope="col" style={{ width: "100px" }}>101-300</th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-body'>
                                        {submittedData.map((data, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{data.Amount}</td>
                                                <td>100</td>
                                                <td>500</td>
                                                <td>1000</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination">
                                <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                    {'<'}
                                </button>
                                <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                                <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                    {'>'}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal >

                <Modal id="modal" overlayClassName="custom-overlay" isOpen={modalIsOpen1}
                    style={{
                        content: {
                            top: '50%',
                            left: '55%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            height: '410px',
                            width: '520px',
                            padding: "0px",
                            borderRadius: '10px',
                        },
                    }}>
                    <div>
                        <div className="header-tittle">
                            <header>Distance Master Entry</header>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div className='table-container1' style={{ margin: "10px" }}>
                                <table className='table table-bordered table-sm'>
                                    <thead className='table-info body-bordered table-sm'>
                                        <tr>
                                            <th scope="col">Sr.No</th>
                                            <th scope="col">From</th>
                                            <th scope="col">To</th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-body'>

                                        {currentRows.map((zone, index) => (
                                            <tr key={zone.id}>
                                                <td>{zone.id}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className='table-container1' style={{ margin: "10px" }}>
                                <table className='table table-bordered table-sm'>
                                    <thead className='table-info body-bordered table-sm'>
                                        <tr>
                                            <th scope="col">Sr.No</th>
                                            <th scope="col">From</th>
                                            <th scope="col" style={{ width: "100px" }}>To</th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-body'>

                                        {currentRows.map((zone, index) => (
                                            <tr key={zone.id}>
                                                <td>{zone.id}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pagination">
                            <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                {'<'}
                            </button>
                            <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                            <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                {'>'}
                            </button>
                        </div>

                        <div className='bottom-buttons'>
                            <button type='submit' className='ok-btn'>Submit</button>
                            <button onClick={() => setModalIsOpen1(false)} className='ok-btn'>close</button>
                        </div>
                    </div>
                </Modal >
            </div>
        </div>
    )
}

export default OdaMaster;