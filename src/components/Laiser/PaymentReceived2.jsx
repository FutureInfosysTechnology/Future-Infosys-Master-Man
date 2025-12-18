import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { getApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
function PaymentReceived2() {
    const extrectArray = (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.Data)) return response.Data;
        return [];
    }
    const [getCustomer, setGetCustomer] = useState([]);
    const [getBranch, setGetBranch] = useState([]);
    const [getBankName, setGetBankName] = useState([]);
    const [data, setData] = useState([]);
    const today = new Date();
    const [formData, setFormData] = useState({
        billDate: today,
        customer: "",
        branch: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
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
   

    
    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            console.log("API Response for", endpoint, response);  // 👀 Check here
            setData(extrectArray(response));
        } catch (err) {
            console.error('Fetch Error:', err);}
            
        
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

    // ✅ Validation
    if (!formData.branch) {
        return Swal.fire("Warning", "Branch Code is Required", "warning");
    }

    if (!formData.customer) {
        return Swal.fire("Warning", "Customer Code is Required", "warning");
    }

    try {
        const queryParams = new URLSearchParams({
            Branch_Code: formData.branch,
            Customer_Code: formData.customer,
            InvoiceNo: formData.billNo || ""
        }).toString();

        const response = await getApi(
            `/getBillDetailsByBranchCustomer?${queryParams}`
        );

        // ✅ Backend uses `success`
        if (!response.success) {
            throw new Error(response.message || "Failed to fetch bill details");
        }

        Swal.fire(
            "Success",
            response.message || "Bill details fetched successfully",
            "success"
        );

        // ✅ Data from recordset
        setData(response.data);

    } catch (error) {
        console.error("Fetch error:", error);

        Swal.fire({
            title: "Error!",
            text: error.message || "Failed to fetch bill details",
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
        "Bill No": row.InvoiceNo,
        "Bill Date": row.InvoiceDate,
        "Branch Name": row.Branch_Name,
        "Customer Name": row.Customer_Name,
        "Total Amount": row.TotalAmount,
        "Payment Received": row.PaymentReceived,
        "TDS": row.TDS,
        "Outstanding Amount": row.OustandingAmount,
        "Pay Received Date": row.PayReceivedDate,
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

    saveAs(file, "Payment_Received.xlsx");
};


     const handleExportPDF = () => {
      if (!currentRows || currentRows.length === 0) {
         Swal.fire("Warning","No data to export","warning");
         return;
       }
     
       const pdf = new jsPDF("l", "mm", "a4");
       const pageWidth = pdf.internal.pageSize.getWidth();
     
       // Title
       pdf.setFontSize(14);
       pdf.text("Payment Ledger", pageWidth / 2, 15, { align: "center" });
     
       const columns = [
         "Bill No",
         "Bill Date",
         "Branch Name",
         "Customer Name",
         "Total Amount",
         "Payment Received",
         "TDS",
         "Outstanding Amount",
         "Pay Received Date",
         "Bank Name",
         "Transaction No",
         "Receiver Name",
         "Payment Type",
         "Remark"
       ];
     
       const body = currentRows.map(row => ([
         row.InvoiceNo || "",
         row.InvoiceDate || "",
         row.Branch_Name || "",
         row.Customer_Name || "",
         row.TotalAmount || 0,
         row.PaymentReceived || 0,
         row.TDS || 0,
         row.OustandingAmount || 0,
         row.PayReceivedDate,
         getBankName.find(b => b.Bank_Code === row.Bank_Code)?.Bank_Name || "",
         row.Transation_No || "",
         row.Receiver_Name || "",
         row.Payment_Type || "",
         row.Remark || ""
       ]));
     
       autoTable(pdf, {
         head: [columns],
         body,
         startY: 22,
         margin: { left: 10, right: 10 },
         tableWidth: "auto",   // ✅ auto-fit all columns
         styles: {
           fontSize: 7,        // 🔴 key for fitting all columns
           cellPadding: 1,
           overflow: "linebreak",
           valign: "middle"
         },
         headStyles: {
           fillColor: [52, 73, 94],
           textColor: 255,
           halign: "center",
           fontSize: 7
         },
         bodyStyles: {
           halign: "left"
         },
         didDrawPage: () => {
           pdf.setFontSize(8);
           pdf.text(
             `Page ${pdf.internal.getNumberOfPages()}`,
             pageWidth - 20,
             pdf.internal.pageSize.getHeight() - 10
           );
         }
       });
     
       pdf.save("Payment_Received.pdf");
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
                                        <td>{row.Branch_Name}</td>
                                        <td>{row.Customer_Name}</td>
                                        <td>{row.TotalAmount}</td>
                                        <td>{row.PaymentReceived}</td>
                                        <td>{row.TDS}</td>
                                        <td>{row.OustandingAmount}</td>
                                        <td>{row.PayReceivedDate}</td>
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


                    


                </div>
            </div>
        </>
    );
};

export default PaymentReceived2;