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



function PaymentEntry() {
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
    const [data, setData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        billDate: today,
        customer: "",
        branch: "",
        billNo: "",

    });
    const convertToDate = (ddmmyyyy) => {
        if (!ddmmyyyy) return null;
        const [day, month, year] = ddmmyyyy.split("/");
        return new Date(`${year}-${month}-${day}`);
    };

    const ymdToDmy = (dateStr) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    };
    const [addPayment, setAddPayment] = useState({
        Customer_Code: "",
        Branch_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
        Bank_Code: "",
        Transation_No: "",
        Payment_Type: "",
        PayReceivedDate: new Date(),
        billDate: new Date(),
        billAmount: 0,
        TDS: 0,
        PaymentReceived: 0,
        OutstandingAmount: 0,
        AdjustAmount: 0,
        Remark: "",
        InvoiceNo: ""
    })

    useEffect(() => {
        setAddPayment(prev => ({
            ...prev,
            OutstandingAmount:
                (Number(prev.billAmount) || 0) -
                (Number(prev.PaymentReceived) || 0) -
                (Number(prev.TDS) || 0) -
                (Number(prev.AdjustAmount) || 0)
        }));
    }, [
        addPayment.billAmount,
        addPayment.PaymentReceived,
        addPayment.TDS,
        addPayment.AdjustAmount
    ]);

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
        console.log(formData);
    }, [formData])

    useEffect(() => {
        fetchData('/Master/getCustomerdata', setGetCustomer);
        fetchData('/Master/GetAllBranchData', setGetBranch);
        fetchData('/Master/Getbank', setGetBankName);
    }, []);
    const handleFormChange = (value, key) => {
        setFormData({ ...formData, [key]: value })
    }
    const [currentPage, setCurrentPage] = useState(1);
    const [openRow, setOpenRow] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(data.length / rowsPerPage);

    const handleSave = async (e) => {
        e.preventDefault();

        try {

            const response = await getApi(`/GetPaymentReceived?Branch_Code=${formData.branch}&Customer_Code=${formData.customer}&InvoiceNo=${formData.billNo}&InvoiceDate=${formData.billDate}&AllCustomerData=1&page=${currentPage}&limit=${rowsPerPage}`);
            console.log(response);

            Swal.fire("Success", "Payment Received Added Successfully", "success");
            setData(response.PaymentOutstanding);
            setFormData({
                billDate: today,
                customer: "",
                branch: "",
                billNo: "",
            });



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
        "Bill No": row.BillNo,
        "Bill Date": row.InvoiceDate,
        "Branch Name": getBranch.find(b => b.Branch_Code === row.Branch_Code)?.Branch_Name,
        "Customer Name": row.Customer_Name,
        "GST No": row.Gst_No,
        "Booking Type": row.Booking_Type,
        "Total Amount": row.TotalAmount,
        "Payment Received": row.PaymentReceived,
        "TDS": row.TDS,
        "Outstanding Amount": row.OutstandingAmount,
        "Pay Received Date": ymdToDmy(row.PayReceivedDate),
        "Bank Name": getBankName.find(b => b.Bank_Code === row.Bank_Code)?.Bank_Name,
        "Transaction No": row.Transation_No,
        "Receiver Name": row.Receiver_Name,
        "Payment Type": row.Payment_Type,
        "Remark": row.Remark
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentData");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    const file = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(file, "Ledger.xlsx");
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
                <div className="container1" onSubmit={handleSave}>

                    <form action="" style={{ margin: "0px", background: " #f2f4f3" }}>

                        <div className="fields2">
                            <div className="input-field3">
                                <label htmlFor="">Branch Name</label>
                                <Select
                                    options={getBranch.map(b => ({
                                        value: b.Branch_Code,   // adjust keys from your API
                                        label: b.Branch_Name
                                    }))}
                                    value={
                                        formData.branch
                                            ? {
                                                value: formData.branch,
                                                label: getBranch.find(c => c.Branch_Code === formData.branch)?.Branch_Name || ""
                                            }
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

                            <div className="input-field1">
                                <label htmlFor="">Customer Name</label>
                                <Select
                                    options={getCustomer.map(cust => ({
                                        value: cust.Customer_Code,   // adjust keys from your API
                                        label: cust.Customer_Name
                                    }))}
                                    value={
                                        formData.customer
                                            ? {
                                                value: formData.customer,
                                                label: getCustomer.find(c => c.Customer_Code === formData.customer)?.Customer_Name
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



                            <div className="input-field3">
                                <label htmlFor="">Bill No</label>
                                <input type="text" placeholder="Enter Bill no"
                                    value={formData.billNo} onChange={(e) => setFormData({ ...formData, billNo: e.target.value })} />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Bill Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.billDate}
                                    onChange={(date) => handleFormChange(date, "billDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>


                            <div className="bottom-buttons" style={{ marginTop: "22px", marginLeft: "10px", width: "80px" }}>
                                <button className="ok-btn">Submit</button>
                            </div>

                        </div>
                    </form>

                    <div className="addNew">
                        <div>
                           

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
                                    <th>Bill No</th>
                                    <th>Bill Date</th>
                                    <th>Branch Name</th>
                                    <th>Customer Name</th>
                                    <th>GST No</th>
                                    <th>Booking Type</th>

                                    <th>Total Amount</th>
                                    <th>Payment Received</th>
                                    <th>TDS</th>
                                    <th>Outstanding Amount</th>
                                    <th>Pay Received Date</th>
                                    <th>Bank Name</th>
                                    <th>Transaction No</th>
                                    <th>Receiver Name</th>
                                    <th>Payment Type</th>
                                    <th>Remark</th>


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
                                                        setModalIsOpen(true);
                                                        setAddPayment((prev) => ({
                                                            ...prev,
                                                            Customer_Code: row.Customer_Code,
                                                            Branch_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
                                                            Bank_Code: "",
                                                            Transation_No: "",
                                                            Payment_Type: "",
                                                            PayReceivedDate: new Date(),
                                                            billDate: convertToDate(row.InvoiceDate),
                                                            billAmount: row.TotalAmount,
                                                            TDS: 0,
                                                            PaymentReceived: 0,
                                                            OutstandingAmount: 0,
                                                            AdjustAmount: 0,
                                                            Remark: "",
                                                            InvoiceNo: row.InvoiceNo
                                                        }));

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
                                        <td>{row.InvoiceNo}</td>
                                        <td>{row.InvoiceDate}</td>
                                        <td>{getBranch.find(f => f.Branch_Code === row.Branch_Code)?.Branch_Name}</td>
                                        <td>{row.Customer_Name}</td>
                                        <td>{row.Gst_No}</td>
                                        <td>{row.Booking_Type}</td>
                                        <td>{row.TotalAmount}</td>
                                        <td>{row.PaymentReceived}</td>
                                        <td>{row.TDS}</td>
                                        <td>{row.OutstandingAmount}</td>
                                        <td>{ymdToDmy(row.PayReceivedDate)}</td>
                                        <td>{getBankName.find(f => f.Bank_Code === row.Bank_Code)?.Bank_Name}</td>
                                        <td>{row.Transation_No}</td>
                                        <td>{row.Receiver_Name}</td>
                                        <td>{row.Payment_Type}</td>
                                        <td>{row.Remark}</td>

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
                                <form onSubmit={(e)=>e.preventDefault()}>
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
                                            <label htmlFor="">Bill No</label>
                                            <input type="tel" placeholder="Enter Bill No" value={addPayment.InvoiceNo} readOnly
                                                onChange={(e) => setAddPayment({ ...addPayment, InvoiceNo: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Bill Date</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={addPayment.billDate}
                                                onChange={(date) => setAddPayment({ ...addPayment, billDate: date })}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Bill Amount</label>
                                            <input type="tel" placeholder="Enter Bill Amount" readOnly value={addPayment.billAmount}
                                                onChange={(e) => setAddPayment({ ...addPayment, billAmount: e.target.value })} />
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
                                            <label htmlFor="">NEFT No</label>
                                            <input type="tel" placeholder="Enter NEFT No" value={addPayment.Transation_No}
                                                onChange={(e) => setAddPayment({ ...addPayment, Transation_No: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Amount</label>
                                            <input type="tel" placeholder="Enter Amount" value={addPayment.PaymentReceived}
                                                onChange={(e) => setAddPayment({ ...addPayment, PaymentReceived: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">TDS</label>
                                            <input type="tel" placeholder="Enter TDS" value={addPayment.TDS}
                                                onChange={(e) => setAddPayment({ ...addPayment, TDS: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Date</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={addPayment.PayReceivedDate}
                                                onChange={(date) => setAddPayment({ ...addPayment, PayReceivedDate: date })}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Adjust Amt</label>
                                            <input type="tel" placeholder="Enter Outstanding Amount" value={addPayment.AdjustAmount}
                                                onChange={(e) => setAddPayment({ ...addPayment, AdjustAmount: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">OutSt Amt</label>
                                            <input type="tel" placeholder="Enter Outstanding Amount" value={addPayment.OutstandingAmount}
                                                onChange={(e) => setAddPayment({ ...addPayment, OutstandingAmount: e.target.value })} />
                                        </div>


                                        <div className="input-field3">
                                            <label htmlFor="">Narration</label>
                                            <input type="tel" placeholder="Enter Narration" value={addPayment.Remark}
                                                onChange={(e) => setAddPayment({ ...addPayment, Remark: e.target.value })} />
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

export default PaymentEntry;