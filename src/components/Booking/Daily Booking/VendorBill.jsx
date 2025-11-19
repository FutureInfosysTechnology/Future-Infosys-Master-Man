import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from "sweetalert2";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import DatePicker from 'react-datepicker';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { getApi, postApi, putApi, deleteApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import { useLocation, useNavigate } from 'react-router-dom';

function VendorBill() {
    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0]; // "2025-11-17"
    };
    const convertToYMD = (dateStr) => {
        if (!dateStr) return "";
        const [day, month, year] = dateStr.split("/");
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    const navigate=useNavigate();
    const location=useLocation();
    const [data, setData] = useState([]);
    const [openRow, setOpenRow] = useState(null);
    const [getVendor, setGetVendor] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [quary, setQuary] = useState("");
    const [getCustomerdata, setgetCustomerdata] = useState([]);
    const [getCity, setGetCity] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalData, setModalData] = useState({ code: '', name: '' });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        vendorId:"",
        vendorCode: "",
        custCode: "",
        orgCode: "",
        destCode: "",
        modeCode: "",
        vendorAwbNo: "",
        billNo: "",
        billDate: getTodayDate(),
        billFrom: getTodayDate(),
        billTo: getTodayDate(),
        amount: 0,
        fuelChrgs: 0,
        otherChrgs: 0,
        gst: 0,
        totalAmt: 0,
    });
    const fetchData = async (endpoint, setData) => {


        try {
            const response = await getApi(endpoint);
            // Check if the response contains data, then update the corresponding state
            if (response && response.Data) {
                setData(Array.isArray(response.Data) ? response.Data : []);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error(`Error fetching data from ${endpoint}:`, err);
        }
    };
    useEffect(() => {

        fetchData('/Master/getVendor', setGetVendor);
        fetchData('/Master/getCustomerdata', setgetCustomerdata);
        fetchData('/Master/getdomestic', setGetCity);
        fetchData('/Master/getMode', setGetMode);
        fetchVendorBill();


    }, []);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    useEffect(() => {
        const q = quary.toLowerCase();

        const filteredRows = currentRows.filter((row) =>
            row.BillNo?.toLowerCase().includes(q) ||
            row.Customer_Name?.toLowerCase().includes(q) ||
            row.Origin_Name?.toLowerCase().includes(q) ||
            row.Destination_Name?.toLowerCase().includes(q)
        );

        setFilterData(filteredRows);
    }, [quary, currentRows, data, currentPage]);;


    const fetchVendorBill = async () => {
        try {
            const res = await getApi("/getVendorBills");

            if (res.status === 1) {
                setData(res.data);   // store grouped bill list
            } else {
                Swal.fire("Error", "No vendor bills found", "error");
            }

        } catch (err) {
            console.log("Fetch Vendor Bill Error:", err);
            Swal.fire("Error", err.message, "error");
        }
    };


    const handleDelete = (vendorId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This bill will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await deleteApi(`/deleteVendorBill?VendorID=${vendorId}`);

                    if (res.status === 1) {
                        // remove row from UI
                        setData(prev => prev.filter(item => item.VendorID !== vendorId));
                        await fetchVendorBill();

                        Swal.fire("Deleted!", "Vendor Bill Deleted Successfully", "success");
                    }
                } catch (err) {
                    Swal.fire("Error", err.message, "error");
                }
            }
        });
    };


    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.vendorCode) {
            Swal.fire("Warning", "Vendor Name is required", "warning");
        }
        try {
            const payload = {
                BillNo: formData.billNo,
                BillDate: formData.billDate,
                BillFrom: formData.billFrom,
                BillTo: formData.billTo,
                VendorAWBNo: formData.vendorAwbNo,
                Amount: formData.amount,
                FuelCharges: formData.fuelChrgs,
                OtherCharges: formData.otherChrgs,
                GST: formData.gst,
                TotalAmount: formData.totalAmt,

                Customer_Code: formData.custCode,
                Vendor_Code: formData.vendorCode,
                Origin_Code: formData.orgCode,
                Destination_Code: formData.destCode,
                Mode_Code: formData.modeCode
            };

            const res = await postApi("/addVendorBill", payload);

            if (res.status === 1) {
                Swal.fire("Success", "Vendor Bill Added Successfully!", "success");
                await fetchVendorBill();
                setFormData({
                    vendorCode: "",
                    custCode: "",
                    orgCode: "",
                    destCode: "",
                    modeCode: "",
                    vendorAwbNo: "",
                    billNo: "",
                    billDate: getTodayDate(),
                    billFrom: getTodayDate(),
                    billTo: getTodayDate(),
                    amount: 0,
                    fuelChrgs: 0,
                    otherChrgs: 0,
                    gst: 0,
                    totalAmt: 0,
                });
                setModalIsOpen(false);
            }

        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!formData.vendorId) {
            Swal.fire("Warning", "Vendor ID is required", "warning");
        }
        try {
            const payload = {
                VendorID:formData.vendorId,
                BillNo: formData.billNo,
                BillDate: formData.billDate,
                BillFrom: formData.billFrom,
                BillTo: formData.billTo,
                VendorAWBNo: formData.vendorAwbNo,
                Amount: formData.amount,
                FuelCharges: formData.fuelChrgs,
                OtherCharges: formData.otherChrgs,
                GST: formData.gst,
                TotalAmount: formData.totalAmt,

                Customer_Code: formData.custCode,
                Vendor_Code: formData.vendorCode,
                Origin_Code: formData.orgCode,
                Destination_Code: formData.destCode,
                Mode_Code: formData.modeCode
            };

            const res = await putApi("/UpdateVendorBillMaster", payload);

            if (res.status === 1) {
                Swal.fire("Success", "Vendor Bill Updated Successfully!", "success");
                await fetchVendorBill();
                setFormData({
                    vendorId:"",
                    vendorCode: "",
                    custCode: "",
                    orgCode: "",
                    destCode: "",
                    modeCode: "",
                    vendorAwbNo: "",
                    billNo: "",
                    billDate: getTodayDate(),
                    billFrom: getTodayDate(),
                    billTo: getTodayDate(),
                    amount: 0,
                    fuelChrgs: 0,
                    otherChrgs: 0,
                    gst: 0,
                    totalAmt: 0,
                });
                setModalIsOpen(false);
            }

        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };
    


    /**************** function to export table data in excel and pdf ************/
    const handleExportExcel = () => {

        const exportData = currentRows.map((row) => ({
            VendorID: row.VendorID,
            BillNo: row.BillNo,
            BillDate: row.BillDate,
            BillFrom: row.BillFrom,
            BillTo: row.BillTo,
            Customer_Name: row.Customer_Name,
            Vendor_Name: row.Vendor_Name?.trim(),
            Origin: row.Origin_Name,
            Destination: row.Destination_Name,
            Mode: row.Mode_Code,
            Amount: row.Amount,
            FuelCharges: row.FuelCharges,
            OtherCharges: row.OtherCharges,
            GST: row.GST,
            TotalAmount: row.TotalAmount,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'VendorBills');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });

        saveAs(file, 'VendorBills.xlsx');
    };
    const handleOpenVendorBillPrint = (invNo) => {
      navigate("/vendorbill",{state:{invoiceNo:invNo,from:location.pathname,tab:"vendorcharge"}})
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

    // Handle changing page
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    return (

        <>

            <div className='body'>
                <div className="container1">
                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => {
                                setModalIsOpen(true);
                                setFormData({
                                    vendorCode: "",
                                    custCode: "",
                                    orgCode: "",
                                    destCode: "",
                                    modeCode: "",
                                    vendorAwbNo: "",
                                    billNo: "",
                                    billDate: getTodayDate(),
                                    billFrom: getTodayDate(),
                                    billTo: getTodayDate(),
                                    amount: 0,
                                    fuelChrgs: 0,
                                    otherChrgs: 0,
                                    gst: 0,
                                    totalAmt: 0,
                                });
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
                            <input
                                className="add-input"
                                type="text"
                                placeholder="Search..."
                                value={quary}
                                onChange={(e) => setQuary(e.target.value)}
                            />

                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className='table-container'>
                        <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                            <thead>
                                <tr>
                                    <th>Actions</th>
                                    <th>Vendor ID</th>
                                    <th>Bill No</th>
                                    <th>Bill Date</th>
                                    <th>Bill From</th>
                                    <th>Bill To</th>
                                    <th>Customer Name</th>
                                    <th>Vendor Name</th>
                                    <th>Origin</th>
                                    <th>Destination</th>
                                    <th>Mode</th>
                                    <th>Amount</th>
                                    <th>Fuel Charges</th>
                                    <th>Other Charges</th>
                                    <th>GST</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>

                            <tbody className='table-body'>
                                {filterData.map((row, index) => (
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
                                                    <button className='edit-btn' onClick={() => handleOpenVendorBillPrint("001")}>
                                                            <i className='bi bi-file-earmark-pdf-fill' style={{ fontSize: "18px" }}></i>
                                                        </button>
                                                    <button className='edit-btn' onClick={() => {
                                                        setIsEditMode(true);
                                                        setOpenRow(null);
                                                        setFormData({
                                                            vendorId:row.VendorID,
                                                            vendorCode: row.Vendor_Code,
                                                            custCode: row.Customer_Code,
                                                            orgCode: row.Origin_Code,
                                                            destCode: row.Destination_Code,
                                                            modeCode: row.Mode_Code,
                                                            vendorAwbNo: row.VendorAWBNo,
                                                            billNo: row.BillNo,

                                                            billDate: convertToYMD(row.BillDate),
                                                            billFrom: convertToYMD(row.BillFrom),
                                                            billTo: convertToYMD(row.BillTo),

                                                            amount: row.Amount,
                                                            fuelChrgs: row.FuelCharges,
                                                            otherChrgs: row.OtherCharges,
                                                            gst: row.GST,
                                                            totalAmt: row.TotalAmount,
                                                        });

                                                        setModalIsOpen(true);
                                                    }}>
                                                        <i className='bi bi-pen'></i>
                                                    </button>
                                                    <button onClick={() => {
                                                        handleDelete(row.VendorID);
                                                        setOpenRow(null);
                                                    }}
                                                        className='edit-btn'>
                                                        <i className='bi bi-trash'></i></button>
                                                </div>
                                            )}
                                        </td>



                                        {/* Sr No */}
                                        <td>{row.VendorID}</td>

                                        {/* Bill Data */}
                                        <td>{row.BillNo}</td>
                                        <td>{row.BillDate}</td>
                                        <td>{row.BillFrom}</td>
                                        <td>{row.BillTo}</td>

                                        {/* Customer */}
                                        <td>{row.Customer_Name}</td>

                                        {/* Vendor */}
                                        <td>{row.Vendor_Name?.trim()}</td>

                                        {/* Origin / Destination */}
                                        <td>{row.Origin_Name}</td>
                                        <td>{row.Destination_Name}</td>

                                        {/* Mode */}
                                        <td>{row.Mode_Code}</td>

                                        {/* Amount Details */}
                                        <td>{row.Amount}</td>
                                        <td>{row.FuelCharges}</td>
                                        <td>{row.OtherCharges}</td>
                                        <td>{row.GST}</td>
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


                    <Modal
                        overlayClassName="custom-overlay"
                        isOpen={modalIsOpen}
                        className="custom-modal"
                        style={{
                            content: {
                                width: "90%",
                                top: "50%",
                                left: "50%",
                                whiteSpace: "nowrap",
                            },
                        }}
                        contentLabel="Modal"
                    >
                        <div className='custom-modal-content'>
                            <div className="header-tittle">
                                <header>Vendor Bill Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={(e) => { handleSave(e); }}>

                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Vendor Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getVendor.map(v => ({ value: v.Vendor_Code, label: v.Vendor_Name }))}
                                                value={
                                                    formData.vendorCode
                                                        ? { value: formData.vendorCode, label: getVendor.find(opt => opt.Vendor_Code === formData.vendorCode)?.Vendor_Name || "" }
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        vendorCode: selectedOption.value,
                                                    }));
                                                }}
                                                placeholder="Select Vendor Name"
                                                isSearchable
                                                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll area
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps it above other UI
                                                }}
                                            />
                                        </div>
                                        <div className="input-field1">
                                            <label htmlFor="">Customer Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getCustomerdata.map(c => ({ value: c.Customer_Code, label: c.Customer_Name }))}
                                                value={
                                                    formData.custCode
                                                        ? { value: formData.custCode, label: getCustomerdata.find(opt => opt.Customer_Code === formData.custCode)?.Customer_Name || "" }
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        custCode: selectedOption.value,
                                                    }));
                                                }}
                                                placeholder="Select Vendor Name"
                                                isSearchable
                                                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll area
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps it above other UI
                                                }}
                                            />
                                        </div>
                                        <div className="input-field1">
                                            <label>Mode</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getMode.map(m => ({
                                                    value: m.Mode_Code,
                                                    label: m.Mode_Name
                                                }))}
                                                value={
                                                    formData.modeCode
                                                        ? {
                                                            value: formData.modeCode,
                                                            label: getMode.find(x => x.Mode_Code === formData.modeCode)?.Mode_Name || ""
                                                        }
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        modeCode: selectedOption.value,
                                                    }));
                                                }}
                                                placeholder="Select Mode"
                                                isSearchable
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label>Origin</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getCity.map(city => ({
                                                    value: city.City_Code,
                                                    label: city.City_Name
                                                }))}
                                                value={
                                                    formData.orgCode
                                                        ? {
                                                            value: formData.orgCode,
                                                            label: getCity.find(x => x.City_Code === formData.orgCode)?.City_Name || ""
                                                        }
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        orgCode: selectedOption.value,
                                                    }));
                                                }}
                                                placeholder="Select Origin"
                                                isSearchable
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                        </div>
                                        <div className="input-field1">
                                            <label>Destination</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getCity.map(city => ({
                                                    value: city.City_Code,
                                                    label: city.City_Name
                                                }))}
                                                value={
                                                    formData.destCode
                                                        ? {
                                                            value: formData.destCode,
                                                            label: getCity.find(x => x.City_Code === formData.destCode)?.City_Name || ""
                                                        }
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        destCode: selectedOption.value,
                                                    }));
                                                }}
                                                placeholder="Select Destination"
                                                isSearchable
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                        </div>


                                        {/* 🟩 Bill No */}
                                        <div className="input-field1">
                                            <label>Bill No</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Bill No"
                                                value={formData.billNo}
                                                onChange={(e) => setFormData(prev => ({ ...prev, billNo: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 Bill Date */}
                                        <div className="input-field1">
                                            <label>Bill Date</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={formData.billDate}
                                                onChange={(date) => handleDateChange(date, "billDate")}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        {/* 🟩 Bill From */}
                                        <div className="input-field1">
                                            <label>Bill From</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={formData.billFrom}
                                                onChange={(date) => handleDateChange(date, "billFrom")}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        {/* 🟩 Bill To */}
                                        <div className="input-field1">
                                            <label>Bill To</label>
                                            <DatePicker
                                                portalId="root-portal"
                                                selected={formData.billTo}
                                                onChange={(date) => handleDateChange(date, "billTo")}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                            />
                                        </div>


                                        {/* 🟩 Vendor AWB No */}
                                        <div className="input-field1">
                                            <label>Vendor AWB No</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Vendor AWB No"
                                                value={formData.vendorAwbNo}
                                                onChange={(e) => setFormData(prev => ({ ...prev, vendorAwbNo: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 Amount */}
                                        <div className="input-field1">
                                            <label>Amount</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter Amount"
                                                value={formData.amount}
                                                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 Fuel Charges */}
                                        <div className="input-field1">
                                            <label>Fuel Charges</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter Fuel Charges"
                                                value={formData.fuelChrgs}
                                                onChange={(e) => setFormData(prev => ({ ...prev, fuelChrgs: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 Other Charges */}
                                        <div className="input-field1">
                                            <label>Other Charges</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter Other Charges"
                                                value={formData.otherChrgs}
                                                onChange={(e) => setFormData(prev => ({ ...prev, otherChrgs: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 GST */}
                                        <div className="input-field1">
                                            <label>GST</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter GST"
                                                value={formData.gst}
                                                onChange={(e) => setFormData(prev => ({ ...prev, gst: e.target.value }))}
                                            />
                                        </div>

                                        {/* 🟩 Total Amount */}
                                        <div className="input-field1">
                                            <label>Total Amount</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter Total Amount"
                                                value={formData.totalAmt}
                                                onChange={(e) => setFormData(prev => ({ ...prev, totalAmt: e.target.value }))}
                                            />
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

                </div >
            </div>

        </>
    );
};

export default VendorBill;