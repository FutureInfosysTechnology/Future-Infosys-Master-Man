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
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
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
    const [data, setData] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const today = new Date();
    const [addPayment, setAddPayment] = useState({
        Customer_Code: "",
        Branch_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
        Bank_Code: "",
        Transation_No: "",
        Receiver_Name: "",
        Payment_Type: "",
        PayReceivedDate: new Date(),
        TDS: 0,
        PaymentReceived: 0,
        OutstandingAmount: 0,
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
        } 
    };

    const fetchPaymentData = async () => {
        try {
            const response = await getApi("/getPaymentOutstandingData");
            console.log("API Response for", response);  // 👀 Check here
            setData(extrectArray(response));
        } catch (err) {
            console.error('Fetch Error:', err);
        } finally {
        }
    };
    useEffect(() => {
        fetchData('/Master/getCustomerdata', setGetCustomer);
        fetchData('/Master/GetAllBranchData', setGetBranch);
        fetchData('/Master/Getbank', setGetBankName);
        fetchPaymentData();
    }, []);
    const [currentPage, setCurrentPage] = useState(1);
    const [openRow, setOpenRow] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const ymdToDmy = (dateStr) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    };




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
                setModalIsOpen(false);
                await fetchPaymentData();

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
                const updatedZones = data.filter((_, i) => i !== index);
                setData(updatedZones);
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

    const excelData = currentRows.map((row) => ({
        "Customer Name": row.Customer_Name,
        "GST No": row.Gst_No,
        "Booking Type": row.Booking_Type,
        "Branch Name": getBranch.find(f => f.Branch_Code === row.Branch_Code)?.Branch_Name,
        "Bank Name": getBankName.find(f => f.Bank_Code === row.Bank_Code)?.Bank_Name,
        "Transaction No": row.Transation_No,
        "Receiver Name": row.Receiver_Name,
        "Payment Type": row.Payment_Type,
        "Pay Received Date": ymdToDmy(row.PayReceivedDate),
        "TDS": row.TDS,
        "Payment Received": row.PaymentReceived,
        "Outstanding Amount": row.OutstandingAmount,
        "Remark": row.Remark,
        "Total Amount": row.TotalAmount
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentData");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });

    const file = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    });

    saveAs(file, "PaymentMode.xlsx");
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

                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => {
                                setModalIsOpen(true);

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
                        <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                            <thead className='table-info body-bordered table-sm'>
                                <tr>
                                    <th>Actions</th>
                                    <th>Sr.No</th>
                                    <th>Customer Name</th>
                                    <th>GST No</th>
                                    <th>Booking Type</th>
                                    <th>Branch Name</th>
                                    <th>Bank Name</th>
                                    <th>Transaction No</th>
                                    <th>Receiver Name</th>
                                    <th>Payment Type</th>
                                    <th>Pay Received Date</th>
                                    <th>TDS</th>
                                    <th>Payment Received</th>
                                    <th>Outstanding Amount</th>
                                    <th>Remark</th>
                                    <th>Total Amount</th>

                                </tr>
                            </thead>

                            <tbody>
                                {currentRows.map((row, index) => (
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
                                                        left: "60px",
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
                                                        setOpenRow(null);
                                                    }}><i className='bi bi-pen'></i></button>
                                                    <button className='edit-btn' onClick={() => {
                                                        setOpenRow(null);
                                                        handleDelete(row.BillNo)
                                                    }}>
                                                        <i className='bi bi-trash'></i>
                                                    </button>
                                                </div>

                                            )}
                                        </td>
                                        <td>{index + 1}</td>
                                        <td>{row.Customer_Name}</td>
                                        <td>{row.Gst_No}</td>
                                        <td>{row.Booking_Type}</td>
                                        <td>{getBranch.find(f => f.Branch_Code === row.Branch_Code)?.Branch_Name}</td>
                                        <td>{getBankName.find(f => f.Bank_Code === row.Bank_Code)?.Bank_Name}</td>
                                        <td>{row.Transation_No}</td>
                                        <td>{row.Receiver_Name}</td>
                                        <td>{row.Payment_Type}</td>
                                        <td>{ymdToDmy(row.PayReceivedDate)}</td>
                                        <td>{row.TDS}</td>
                                        <td>{row.PaymentReceived}</td>
                                        <td>{row.OutstandingAmount}</td>
                                        <td>{row.Remark}</td>
                                        <td>{row.TotalAmount}</td>

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
                                                            value: addPayment.Customer_Code,
                                                            label: getCustomer.find(c => c.Customer_Code === addPayment.Customer_Code)?.Customer_Name || ""
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
                                            <label htmlFor="">Payment Type</label>
                                            <select value={addPayment.Payment_Type} onChange={(e) => setAddPayment({ ...addPayment, Payment_Type: e.target.value })}>
                                                <option value="" disabled>Select Payment Type</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Credit">Credit</option>
                                                <option value="To-pay">To-pay</option>
                                                <option value="Google Pay">Google Pay</option>
                                                <option value="RTGS">RTGS</option>
                                                <option value="NEFT">NEFT</option>
                                            </select>
                                        </div>

                                         <div className="input-field3">
                                            <label htmlFor="">Transation / Check No</label>
                                            <input type="tel" placeholder="Enter Transation No" value={addPayment.Transation_No}
                                                onChange={(e) => setAddPayment({ ...addPayment, Transation_No: e.target.value })} />
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
                                            <label htmlFor="">TDS</label>
                                            <input type="tel" placeholder="Enter TDS" value={addPayment.TDS}
                                                onChange={(e) => setAddPayment({ ...addPayment, TDS: e.target.value })} />
                                        </div>

                                        

                                        <div className="input-field3">
                                            <label htmlFor="">Remark</label>
                                            <input type="tel" placeholder="Enter Remark" value={addPayment.Remark}
                                                onChange={(e) => setAddPayment({ ...addPayment, Remark: e.target.value })} />
                                        </div>


                                        <div className="input-field3">
                                            <label htmlFor="">Receiver Name</label>
                                            <input type="tel" placeholder="Enter Receiver Name" value={addPayment.Receiver_Name}
                                                onChange={(e) => setAddPayment({ ...addPayment, Receiver_Name: e.target.value })} />
                                        </div>

                                      

                                        

                                        

                                        <div className="input-field3">
                                            <label htmlFor="">Invoice No</label>
                                            <input type="tel" placeholder="Enter Invoice No" value={addPayment.InvoiceNo}
                                                onChange={(e) => setAddPayment({ ...addPayment, InvoiceNo: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className='bottom-buttons' style={{ marginTop: "18px", marginLeft: "25px" }}>
                                        <button type='submit' className='ok-btn' >Submit</button>
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