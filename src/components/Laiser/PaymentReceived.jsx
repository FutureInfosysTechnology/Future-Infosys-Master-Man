import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { getApi, postApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";



function PaymentReceived() {
    const extrectArray = (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.Data)) return response.Data;
        return [];
    }
    const [getCustomer, setGetCustomer] = useState([]);
    const [getBranch, setGetBranch] = useState([]);
    const [getBankName, setGetBankName] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zones, setZones] = useState([]);
    const [isEditMode, setIsEditMode] = useState(null);
    const [modalData, setModalData] = useState({ code: '', name: '' });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        fromDate: firstDayOfMonth,
        toDate: today,
        customer: "",
        branch: "",
        billNo: "",

    });
    const [addPayment, setAddPayment] = useState({
        Customer_Code: "",
        Branch_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
        Bank_Code: "",
        Transation_No: "",
        Receiver_Name: "",
        Payment_Type: "",
        PayReceivedDate: new Date(),
        TDS: "",
        PaymentReceived: "",
        OutstandingAmount: "",
        Remark: "",
        InvoiceNo: ""
    })
    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            console.log("API Response for", endpoint, response);  // 👀 Check here
            setData(extrectArray(response));
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData('/Master/getCustomerdata', setGetCustomer);
        fetchData('/Master/GetAllBranchData', setGetBranch);
        fetchData('/Master/Getbank', setGetBankName);
    }, []);
    const handleFormChange = (value, key) => {
        setFormData({ ...formData, [key]: value })
    }
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = zones.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(zones.length / rowsPerPage);

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                Customer_Code: addPayment.Customer_Code,
                Branch_Code: addPayment.Branch_Code,
                Bank_Code: addPayment.Bank_Code,
                Transation_No: addPayment.Transation_No,
                Receiver_Name: addPayment.Receiver_Name,
                Payment_Type: addPayment.Payment_Type,
                PayReceivedDate: addPayment.PayReceivedDate,
                TDS: addPayment.TDS,
                PaymentReceived: addPayment.PaymentReceived,
                OutstandingAmount: addPayment.OutstandingAmount,
                Remark: addPayment.Remark,
                InvoiceNo: addPayment.InvoiceNo,
            };

            const response = await postApi(`/addPaymentReceived`, payload);

            if (response?.success) {
                Swal.fire("Success", "Payment Received Added Successfully", "success");


                // Reset form
                setAddPayment({
                    Customer_Code: "",
                    Branch_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
                    Bank_Code: "",
                    Transation_No: "",
                    Receiver_Name: "",
                    Payment_Type: "",
                    PayReceivedDate: new Date(),
                    TDS: "",
                    PaymentReceived: "",
                    OutstandingAmount: "",
                    Remark: "",
                    InvoiceNo: ""
                });
            }

        } catch (error) {
            console.error("Payment save error:", error);

            Swal.fire({
                title: "Error!",
                text: "Failed to save payment",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    };


    const handleDelete = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedZones = zones.filter((_, i) => i !== index);
                setZones(updatedZones);
                Swal.fire(
                    'Deleted!',
                    'Your zone has been deleted.',
                    'success'
                );
            }
        });
    };




    /**************** function to export table data in excel and pdf ************/
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(zones);
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

            pdf.save('zones.pdf');
        });
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    return (
        <>
            <div className="body">
                <div className="container1">

                    <form action="" style={{ margin: "0px", background: " #f2f4f3" }}>

                        <div className="fields2">
                            <div className="input-field">
                                <label htmlFor="">Customer Name</label>
                                <Select
                                    options={getCustomer.map(cust => ({
                                        value: cust.Customer_Code,   // adjust keys from your API
                                        label: cust.Customer_Name
                                    }))}
                                    value={
                                        formData.customer
                                            ? { value:formData.customer,
                                            label:getCustomer.find(c => c.Customer_Code === formData.customer)?.Customer_Name
                                        }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            customer: selectedOption ? selectedOption.value : ""
                                        })
                                    }
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
                                    placeholder="Select Customer"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                />

                            </div>

                            <div className="input-field1">
                                <label htmlFor="">Branch Name</label>
                                <Select
                                    options={getBranch.map(b => ({
                                        value: b.Branch_Code,   // adjust keys from your API
                                        label: b.Branch_Name
                                    }))}
                                    value={
                                        formData.branch
                                            ? getBranch.find(c => c.Branch_Code === formData.branch)
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            branch: selectedOption ? selectedOption.value : ""
                                        })
                                    }
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
                                    placeholder="Select Branch"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                />

                            </div>

                            <div className="input-field3">
                                <label htmlFor="">From Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.fromDate}
                                    onChange={(date) => handleFormChange(date, "fromDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">To Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.toDate}
                                    onChange={(date) => handleFormChange(date, "toDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Bill No</label>
                                <input type="text" placeholder="Enter Bill no"
                                    value={formData.billNo} onChange={(e) => setFormData({ ...formData, billNo: e.target.value })} />
                            </div>
                            <div className="bottom-buttons input-field3" style={{ marginTop: "22px" }}>
                                <button className="ok-btn">Submit</button>
                            </div>

                        </div>
                    </form>

                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => {
                                setModalIsOpen(true); setIsEditMode(false);

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
                            <input className="add-input"
                                type="text" placeholder="search" />
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
                                    <th scope="col">Bill No</th>
                                    <th scope="col">Customer Name</th>
                                    <th scope="col">Credit Type</th>
                                    <th scope="col">Billing Date</th>
                                    <th scope="col">Bill Amount</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((zone, index) => (
                                    <tr key={zone.id}>
                                        <td>{zone.id}</td>
                                        <td>{zone.code}</td>
                                        <td>{zone.name}</td>
                                        <td>{zone.name}</td>
                                        <td>{zone.name}</td>
                                        <td>{zone.name}</td>
                                        <td>
                                            <button className='add-btn' style={{ width: "50px", marginRight: "5px" }} onClick={() => { setModalIsOpen(true); setModalData({ code: '', name: '' }) }}>
                                                <i className="bi bi-plus-lg"></i>
                                            </button>
                                            <button className='edit-btn'>
                                                <i className='bi bi-pen'></i></button>
                                            <button onClick={() => handleDelete(index)} className='edit-btn'>
                                                <i className='bi bi-trash'></i></button>
                                        </td>
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


                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-branchName" contentLabel="Modal"
                        style={{
                            content: {
                                width: '90%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap",
                                height: "auto"
                            },
                        }}>
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Payment Received Entry</header>
                            </div>
                            <div className='container2'>
                                <form onSubmit={handleSave}>
                                    <div className="fields2">



                                        <div className="input-field3">
                                            <label htmlFor="">Customer Name</label>
                                            <Select
                                                options={getCustomer.map(cust => ({
                                                    value: cust.Customer_Code,   // adjust keys from your API
                                                    label: cust.Customer_Name
                                                }))}
                                                value={
                                                    addPayment.Customer_Code
                                                        ? {
                                                            value:addPayment.Customer_Code,
                                                            label:getCustomer.find(c => c.Customer_Code === addPayment.Customer_Code)?.Customer_Name || ""
                                                        }
                                                        : null
                                                }
                                                onChange={(selectedOption) =>
                                                    setAddPayment({
                                                        ...addPayment,
                                                        Customer_Code: selectedOption ? selectedOption.value : ""
                                                    })
                                                }
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
                                                placeholder="Select Customer"
                                                isSearchable
                                                classNamePrefix="blue-selectbooking"
                                                className="blue-selectbooking"
                                            />

                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Bank Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getBankName.map((bank) => ({
                                                    value: bank.Bank_Code,
                                                    label: bank.Bank_Name,
                                                }))}
                                                value={
                                                    addPayment.Bank_Code
                                                        ? {
                                                            value: addPayment.Bank_Code,
                                                            label: getBankName.find(bank => bank.Bank_Code === addPayment.Bank_Code)?.Bank_Name || "",
                                                        }
                                                        : null
                                                }
                                                onChange={(selected) =>
                                                    setAddPayment({
                                                        ...addPayment,
                                                        Bank_Code: selected ? selected.value : "",
                                                    })
                                                }
                                                placeholder="Select Bank Name"
                                                isSearchable={true}
                                                menuPortalTarget={document.body} // ✅ Keeps dropdown above other UI
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />

                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Transation No</label>
                                            <input type="tel" placeholder="Enter Transation No" value={addPayment.Transation_No}
                                                onChange={(e) => setAddPayment({ ...addPayment, Transation_No: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Receiver Name</label>
                                            <input type="tel" placeholder="Enter Receiver Name" value={addPayment.Receiver_Name}
                                                onChange={(e) => setAddPayment({ ...addPayment, Receiver_Name: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Payment Type</label>
                                            <input type="tel" placeholder="Enter Payment Type" value={addPayment.Payment_Type}
                                                onChange={(e) => setAddPayment({ ...addPayment, Payment_Type: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Payment Received Date</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={addPayment.PayReceivedDate}
                                                onChange={(date) => setAddPayment({ ...addPayment, PayReceivedDate: date })}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">TDS</label>
                                            <input type="tel" placeholder="Enter TDS" value={addPayment.TDS}
                                                onChange={(e) => setAddPayment({ ...addPayment, TDS: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Payment Received</label>
                                            <input type="tel" placeholder="Enter Payment Received" value={addPayment.PaymentReceived}
                                                onChange={(e) => setAddPayment({ ...addPayment, PaymentReceived: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Outstanding Amount</label>
                                            <input type="tel" placeholder="Enter Outstanding Amount" value={addPayment.OutstandingAmount}
                                                onChange={(e) => setAddPayment({ ...addPayment, OutstandingAmount: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Remark</label>
                                            <input type="tel" placeholder="Enter Remark" value={addPayment.Remark}
                                                onChange={(e) => setAddPayment({ ...addPayment, Remark: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Invoice No</label>
                                            <input type="tel" placeholder="Enter Invoice No" value={addPayment.InvoiceNo}
                                                onChange={(e) => setAddPayment({ ...addPayment, InvoiceNo: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className='bottom-buttons' style={{ marginTop: "18px", marginLeft: "25px" }}>
                                        <button type='submit'   className='ok-btn' >Submit</button>
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </Modal >

                </div>
            </div>
        </>
    );
};

export default PaymentReceived;