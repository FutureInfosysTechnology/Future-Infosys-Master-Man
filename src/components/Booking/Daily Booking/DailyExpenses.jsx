import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getApi, postApi, putApi, deleteApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import Select from "react-select"
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function DailyExpenses() {

    const [data, setData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterData, setFilterData] = useState([]);
    const [getBankName, setGetBankName] = useState([]);
    const [quary, setQuary] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        docketNo: "",
        Customer_Code: "",
        consignor: "",
        Consignee_Code: "",
        vendor: "",
        product: "",
        origin: "",
        destination: "",
        manifestNumber: "",
        manifestDate: new Date(),
        qty: "",
        chargedWeight: "",
        receivedAmount: "",
        balanceAmount: "",
        totalAmount: "",
        receiverName: "",
        receivedAmount2: "",
        receivedDate: new Date(),
        remark: "",
        BookMode: "",
        bankCode: "",
        tsd: "",
    });




    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            setData(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);

        }
    };
    const fetchCashToPayData = async () => {
        try {
            const res = await getApi("/GetCashToPayGP_All");

            if (res.status === 1) {
                setData(res.data);   // your API returns data array
            } else {
                Swal.fire("Error", "No records found", "error");
            }

        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchData('/Master/Getbank', setGetBankName);
        };
        fetchCashToPayData();
        fetchInitialData();
    }, []);

    /**************** function to get docket data ************/
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!formData.docketNo) {
            return Swal.fire("Warning", "Enter Docket No", "warning");
        }

        try {
            const res = await getApi(`/GetCashToPay?DocketNo=${formData.docketNo}`);
            console.log(res);

            if (res.status === 1) {
                const data = res.data;

                setFormData((prev) => ({
                    ...prev,
                    Customer_Code: data.Customer_Name,
                    Consignee_Code: data.Consignee_Name,
                    product: data.Mode_Name,
                    origin: data.Origin_name,
                    destination: data.Destination_Name,
                    qty: data.Qty,
                    chargedWeight: data.ChargedWt,
                    totalAmount: data.Rate,
                    manifestNumber: data.ManifestNo,
                    manifestDate: data.ManifestDate,
                    BookMode: data.T_Flag,
                }));
            } else {
                Swal.fire("Not Found", "Invalid Docket No", "error");
            }

        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };


    /**************** function to edit table row ************/




    /**************** function to delete table row ************/
    const handleDelete = async (id) => {
        try {
            const confirmDelete = await Swal.fire({
                title: "Are you sure?",
                text: "This record will be permanently deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel"
            });

            if (!confirmDelete.isConfirmed) return;

            const res = await deleteApi(`/DeleteCashToPayGP?ID=${id}`);

            if (res.status === 1) {
                Swal.fire("Deleted!", res.message, "success");

                // Remove from UI
                setData((prev) => prev.filter((item) => item.ID !== id));

            } else {
                Swal.fire("Error", res.message, "error");
            }

        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };



    /**************** function to edit and save table row ************/
    const handleSave = async () => {
        try {
            // Basic validation
            if (!formData.docketNo) {
                return Swal.fire("Warning", "Enter Docket No", "warning");
            }
            if (!formData.receiverName) {
                return Swal.fire("Warning", "Enter Receiver Name", "warning");
            }
            if (!formData.receivedAmount) {
                return Swal.fire("Warning", "Enter Received Amount", "warning");
            }

            const payload = {
                DocketNo: formData.docketNo,
                ReceiverName: formData.receiverName,
                Bank_Code: formData.bankCode,
                Booking_type: formData.BookMode,         // <-- From API "Mode_Name"
                ReceivedAmount: formData.receivedAmount,
                BalanceAmount: formData.balanceAmount,
                TotalAmount: formData.totalAmount,
                ExpenseDate: formData.receivedDate,      // <-- date from form
                Remark: formData.remark
            };

            console.log("Sending payload:", payload);

            const res = await postApi("/AddCashToPayGP", payload);

            if (res.status === 1) {
                Swal.fire("Success", "Cash To Pay Saved Successfully", "success");
                await fetchCashToPayData();
                // setData([...prev,res?.data]);

                // Reset form
                setFormData({
                    docketNo: "",
                    Customer_Code: "",
                    consignor: "",
                    Consignee_Code: "",
                    vendor: "",
                    product: "",
                    origin: "",
                    destination: "",
                    manifestNumber: "",
                    manifestDate: new Date(),
                    qty: "",
                    chargedWeight: "",
                    receivedAmount: "",
                    balanceAmount: "",
                    totalAmount: "",
                    receiverName: "",
                    receivedDate: new Date(),
                    remark: "",
                    BookMode: "",
                    bankCode: "",
                    tsd: "",
                });

            } else {
                Swal.fire("Error", res.message, "error");
            }

        } catch (error) {
            console.log("Save Error:", error);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    useEffect(() => {
        const filteredRows = currentRows.filter((row) => {
            const q = quary.toLowerCase();

            return (
                row.Destination_Name?.toLowerCase().includes(q) ||
                row.DocketNo?.toLowerCase().includes(q) ||
                row.Booking_type?.toLowerCase().includes(q)
            );
        });

        setFilterData(filteredRows);
    }, [quary, currentRows, data, currentPage]);

    /**************** function to export table data in excel and pdf ************/
    const handleExportExcel = () => {

        const exportData = currentRows.map(row => ({
            "Docket No": row.DocketNo,
            "Customer Name": row.Vendor_Name?.trim(),
            "Consignee Name": row.ReceiverName,
            "Credit Type": row.Booking_type,
            "Origin": row.Origin_Name,
            "Destination": row.Destination_Name,
            "Receiver Name": row.ReceiverName,
            "Received Date": row.ExpDate,
            "Received Amount": row.ReceivedAmount,
            "Balance Amount": row.BalanceAmount,
            "Total Amount": row.TotalAmount,
            "Bank Name": getBankName.find(b => b.Bank_Code === row.Bank_Code)?.Bank_Name || "",
            "Remark": row.Remark
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredData");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
        });

        saveAs(file, "CashToPayReceived.xlsx");
    };



    const handleExportPDF = () => {
        const pdfData = data.map(({ id, mode, name }) => [id, mode, name]);

        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text('Zone Data', 14, 20);
        const headers = [['Sr.No', 'Mode Name', 'State Name']];

        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 30,
            theme: 'grid'
        });

        pdf.save('multipleCity.pdf');
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

            <div className="body">
                <div className="container1">
                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => { setModalIsOpen(true) }}>
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
                                    <th>Sr.No</th>
                                    <th>Docket No</th>
                                    <th>Customer Name</th>       {/* Vendor or Consignor? */}
                                    <th>Consignee Name</th>
                                    <th>Credit Type</th>
                                    <th>Origin</th>
                                    <th>Destination</th>
                                    <th>Receiver Name</th>
                                    <th>Received Date</th>
                                    <th>Received Amount</th>
                                    <th>Balance Amount</th>
                                    <th>Total Amount</th>
                                    <th>Bank Name</th>
                                    <th>Remark</th>
                                </tr>
                            </thead>

                            <tbody className='table-body'>
                                {filterData.map((row, index) => (
                                    <tr key={row.ID}>
                                        <td>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <button className='edit-btn' onClick={() => handleDelete(row.ID)}>
                                                    <i className='bi bi-trash'></i>
                                                </button>
                                            </div>
                                        </td>

                                        <td>{index + 1}</td>

                                        <td>{row.DocketNo}</td>

                                        {/* Customer Name → Vendor_Name */}
                                        <td>{row.Vendor_Name?.trim()}</td>

                                        {/* Consignee Name → No field available (use ReceiverName or create new field) */}
                                        <td>{row.ReceiverName}</td>

                                        {/* Credit Type */}
                                        <td>{row.Booking_type}</td>

                                        {/* Origin */}
                                        <td>{row.Origin_Name}</td>

                                        {/* Destination */}
                                        <td>{row.Destination_Name}</td>

                                        {/* Receiver Name */}
                                        <td>{row.ReceiverName}</td>

                                        {/* Received Date */}
                                        <td>{row.ExpDate}</td>

                                        {/* Received Amount */}
                                        <td>{row.ReceivedAmount}</td>

                                        {/* Balance Amount */}
                                        <td>{row.BalanceAmount}</td>

                                        {/* Total Amount */}
                                        <td>{row.TotalAmount}</td>

                                        {/* Bank Name */}
                                        <td>{getBankName.find(b => b.Bank_Code === row.Bank_Code)?.Bank_Name || ""}</td>

                                        {/* Remark */}
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
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Cash To Pay Received</header>
                            </div>

                            <div className="container2">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSave();
                                    }}
                                >
                                    <div className="form first">
                                        <div className="details personal">
                                            <div className="fields2">

                                                {/* Docket No */}
                                                <div className="input-field3">
                                                    <label>Docket No</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Docket No"
                                                        value={formData.docketNo}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, docketNo: e.target.value })
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" || e.key === "Tab") {
                                                                handleSearch(e);
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                {/* Customer Name */}
                                                <div className="input-field3">
                                                    <label>Customer Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Customer Name"
                                                        value={formData.Customer_Code}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, Customer_Code: e.target.value })
                                                        }
                                                        readOnly
                                                    />
                                                </div>

                                                {/* Booking Mode */}
                                                <div className="input-field3">
                                                    <label>Booking Mode</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Booking Mode"
                                                        value={formData.BookMode}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, BookMode: e.target.value })
                                                        }
                                                        readOnly
                                                    />
                                                </div>

                                                {/* Consignee */}
                                                <div className="input-field3">
                                                    <label>Consignee Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Consignee Name"
                                                        value={formData.Consignee_Code}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, Consignee_Code: e.target.value })
                                                        }
                                                        readOnly
                                                    />
                                                </div>

                                                {/* Vendor */}
                                                <div className="input-field3">
                                                    <label>Vendor</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Vendor Name"
                                                        value={formData.Vendor_Code}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, Vendor_Code: e.target.value })
                                                        }
                                                        readOnly
                                                    />
                                                </div>

                                                {/* Product */}
                                                <div className="
                                                input-field3">
                                                    <label>Mode Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Mode Name"
                                                        value={formData.product}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, product: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Origin */}
                                                <div className="input-field3">
                                                    <label>Origin</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Origin"
                                                        value={formData.origin}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, origin: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Destination */}
                                                <div className="input-field3">
                                                    <label>Destination</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Destination"
                                                        value={formData.destination}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, destination: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Manifest Number */}
                                                <div className="input-field3">
                                                    <label>Manifest Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Manifest Number"
                                                        value={formData.manifestNumber}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, manifestNumber: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Manifest Date */}
                                                <div className="input-field3">
                                                    <label>Manifest Date</label>
                                                    <DatePicker
                                                        portalId="root-portal"
                                                        selected={formData.manifestDate}
                                                        onChange={(date) =>
                                                            setFormData({ ...formData, manifestDate: date })
                                                        }
                                                        dateFormat="dd/MM/yyyy"
                                                        className="form-control form-control-sm"
                                                    />
                                                </div>

                                                {/* Qty */}
                                                <div className="input-field3">
                                                    <label>Qty</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Qty"
                                                        value={formData.qty}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, qty: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Charged Wt */}
                                                <div className="input-field3">
                                                    <label>Charged Wt</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Weight"
                                                        value={formData.chargedWeight}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, chargedWeight: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Total Amount */}
                                                <div className="input-field3">
                                                    <label>Total Amount</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Total Amount"
                                                        value={formData.totalAmount}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, totalAmount: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Divider */}
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        borderBottom: "2px solid white",
                                                        marginTop: "5px",
                                                    }}
                                                ></div>

                                                {/* Receiver Name */}
                                                <div className="input-field3">
                                                    <label>Receiver Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Receiver Name"
                                                        value={formData.receiverName}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, receiverName: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Received Amount */}
                                                <div className="input-field3">
                                                    <label>Received Amount</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Received Amount"
                                                        value={formData.receivedAmount}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, receivedAmount: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Received Date */}
                                                <div className="input-field3">
                                                    <label>Received Date</label>
                                                    <DatePicker
                                                        portalId="root-portal"
                                                        selected={formData.receivedDate}
                                                        onChange={(date) =>
                                                            setFormData({ ...formData, receivedDate: date })
                                                        }
                                                        dateFormat="dd/MM/yyyy"
                                                        className="form-control form-control-sm"
                                                    />
                                                </div>

                                                {/* Balance Amount */}
                                                <div className="input-field3">
                                                    <label>Balance Amount</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Balance Amount"
                                                        value={formData.balanceAmount}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, balanceAmount: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Remark */}
                                                <div className="input-field3">
                                                    <label>Remark</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Remark"
                                                        value={formData.remark}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, remark: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {/* Bank Name */}
                                                <div className="input-field3">
                                                    <label>Bank Name</label>
                                                    <Select
                                                        className="blue-selectbooking"
                                                        classNamePrefix="blue-selectbooking"
                                                        options={getBankName.map((bank) => ({
                                                            value: bank.Bank_Code,
                                                            label: bank.Bank_Name,
                                                        }))}
                                                        value={
                                                            formData.bankCode
                                                                ? {
                                                                    value: formData.bankCode,
                                                                    label:
                                                                        getBankName.find((b) => b.Bank_Code === formData.bankCode)
                                                                            ?.Bank_Name || "",
                                                                }
                                                                : null
                                                        }
                                                        onChange={(selected) =>
                                                            setFormData({
                                                                ...formData,
                                                                bankCode: selected ? selected.value : "",
                                                            })
                                                        }
                                                        placeholder="Select Bank Name"
                                                        isSearchable
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                    />
                                                </div>

                                                <div className="input-field3">
                                                    <label htmlFor="">TDS</label>
                                                    <select value={formData.tds} onChange={(e) => setFormData({ ...formData, tds: e.target.value })}>
                                                        <option value="" disabled>Select Booking Mode</option>
                                                        <option value="Cash">Cash</option>
                                                        <option value="Credit">Credit</option>
                                                        <option value="To-pay">To-pay</option>
                                                        <option value="Google Pay">Google Pay</option>
                                                        <option value="RTGS">RTGS</option>
                                                        <option value="NEFT">NEFT</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bottom-buttons">
                                            <button type="submit" className="ok-btn">Submit</button>
                                            <button
                                                onClick={() => setModalIsOpen(false)}
                                                className="ok-btn"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal>



                </div>
            </div>
        </>
    );
};

export default DailyExpenses;