import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Select from 'react-select'; // 🔹 You forgot this
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
// import './EmailBooking.css'; // Optional: for your custom styles
import { FaPaperPlane, FaFileExcel, FaFilePdf } from "react-icons/fa";

function EmailBooking() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [formData, setFormData] = useState({
    fromdt: firstDayOfMonth,
    todt: today,
    CustomerName: "ALL CLIENT DATA"
  });
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [EmailData, setEmailData] = useState([]);
  const [getCustomer, setGetCustomer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDockets, setSelectedDockets] = useState([]);

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await getApi('/Master/getCustomerdata');
        if (response?.status === 1 && Array.isArray(response.Data)) {
          setGetCustomer(response.Data);
        }
      } catch (err) {
        console.error('Error loading customer data:', err);
      }
    };
    fetchCustomerData();
  }, []);

  const allOptions = [
    { label: "ALL CLIENT DATA", value: "ALL CLIENT DATA" },
    ...getCustomer.map((cust) => ({
      label: cust.Customer_Name,
      value: cust.Customer_Code,
    })),
  ];

  const handleSearchChange = (selectedOption) => {
    setFormData({ ...formData, CustomerName: selectedOption ? selectedOption.value : "" });
  };

  const handlesave = async (e) => {
    e.preventDefault();
    const fromdt = formatDate(formData.fromdt);
    const todt = formatDate(formData.todt);
    const { CustomerName } = formData;

    if (!fromdt || !todt) {
      Swal.fire('Error', 'Both From Date and To Date are required.', 'error');
      return;
    }

    try {
      const response = await getApi(`/Booking/AutoMailsend?CustomerName=${encodeURIComponent(allOptions.find(c=>c.value===CustomerName)?.label)}&fromdt=${fromdt}&todt=${todt}`);
      if (response.status === 1) {
        setEmailData(response.Data);
        setSelectedDockets([]);
        Swal.fire('Saved!', response.message || 'Data has been fetched.', 'success');
      } else {
        setEmailData([]);
        Swal.fire('No Data', response.message || 'No records found.', 'info');
      }
    } catch (error) {
      console.error("API Error:", error);
      setEmailData([]);
      Swal.fire('Error', 'No Booking Available..', 'error');
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = EmailData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(EmailData.length / rowsPerPage);

  const handleCheckboxChange = (docketNo) => {
    setSelectedDockets((prev) =>
      prev.includes(docketNo) ? prev.filter((item) => item !== docketNo) : [...prev, docketNo]
    );
  };
  useEffect(() => {
    console.log(formData);
  }, [formData])
  const exportSelectedToPDF = () => {
    if (selectedDockets.length === 0) {
      Swal.fire("Error", "Please select at least one docket", "error");
      return;
    }

    const selectedData = EmailData.filter((row) =>
      selectedDockets.includes(row.DocketNo)
    );

    const doc = new jsPDF();

    const headers = [
      [
        "DocketNo",
        "Book Date",
        "Customer",
        "Consignee",
        "Origin",
        "Destination",
        "Mode",
        "Qty",
        "Weight",
      ],
    ];

    const body = selectedData.map((item) => [
      item.DocketNo,
      item.BookDate ? new Date(item.BookDate).toLocaleDateString("en-GB") : "",
      item.Customer_Name,
      item.Consignee_Name,
      item.Origin_Name,
      item.Destination_Name,
      item.Mode_Name,
      item.Qty,
      item.ActualWt,
    ]);

    doc.text("Selected Booking Data", 14, 10);
    doc.autoTable({
      head: headers,
      body,
      startY: 20,
    });

    doc.save("SelectedDockets.pdf");
  };

  const exportSelectedToExcel = () => {
    if (selectedDockets.length === 0) {
      Swal.fire("Error", "Please select at least one docket to export", "error");
      return;
    }
    // Filter only selected rows
    const selectedData = EmailData.filter((row) =>
      selectedDockets.includes(row.DocketNo)
    );

    // Format the BookDate properly
    const formattedData = selectedData.map((row) => ({
      ...row,
      BookDate: row.BookDate ? new Date(row.BookDate).toLocaleDateString("en-GB") : "",
    }));

    // Create Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Data");

    // Write to file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `SelectedDockets_${new Date().toISOString().slice(0, 10)}.xlsx`);

  };

  const sendMail = async () => {
    try {
      if (!formData || !getCustomer) {
        Swal.fire("Warning", "Required data not loaded. Please try again.", "warning");
        return;
      }

      if (!formData.CustomerName) {
        Swal.fire("Warning", "Please select a Customer to send mail.", "warning");
        return;
      }
      if (!selectedDockets?.length) {
        Swal.fire("Warning", "Please select at least one docket to export", "warning");
        return;
      }

      if(!getCustomer.find(cust=>cust.Customer_Code===formData.CustomerName)?.Email)
      {
        Swal.fire("Warning", "this customer has not provided email check in master", "warning");
        return; 
      }

      // Filter only selected rows
      const selectedData = EmailData.filter((row) =>
        selectedDockets.includes(row.DocketNo)
      );

      // Format the BookDate properly
      const formattedData = selectedData.map((row) => ({
        ...row,
        BookDate: row.BookDate ? new Date(row.BookDate).toLocaleDateString("en-GB") : "",
      }));

      // Create Excel workbook
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Data");

      // Write to file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const file = new Blob([excelBuffer], { type: "application/octet-stream" });
      console.log("Selected rows:", formattedData.length);
      const fileName = `Booking_${new Date().toISOString().slice(0, 10)}.xlsx`;
      const formDataToSend = new FormData();
      formDataToSend.append("file", file,fileName);
      formDataToSend.append("customerCode", formData?.CustomerName || "764");
      formDataToSend.append(
        "locationCode",
        JSON.parse(localStorage.getItem("Login"))?.BranchP_Code || "MUM"
      );
      formDataToSend.append("subject", "Docket Excel File");
      formDataToSend.append("message", "You can download excel file.");

      console.log("📦 Sending mail with data:", Object.fromEntries(formDataToSend.entries()));

      const response = await postApi("/Smart/AutoMailSend", formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.success) {
        Swal.fire("✅ Success", `Email sent successfully to ${response?.to}`, "success");
        setSelectedDockets([]);
      } else {
        Swal.fire("❌ Error", response?.error || "Email sending failed", "error");
      }
    } catch (error) {
      console.error("Email send failed:", error);
      Swal.fire("Error", "Failed to send email. Please check your network or server.", "error");
    }
  };



  const handleSelectAll = () => {
    setSelectedDockets(
      selectedDockets.length === currentRows.length ? [] : currentRows.map((item) => item.DocketNo)
    );
  };


  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  return (
    <div className="card shadow-sm p-3 mb-4 bg-white rounded">
      <form onSubmit={handlesave}>
        <div className="row g-3 mb-3">
          {/* 🔍 react-select Searchable Dropdown */}
          <div className="scol-12 col-md-3">

            <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>Customer_Name</h6>

            <Select
              className="blue-selectbooking"
              classNamePrefix="blue-selectbooking"
              options={allOptions}
              value={formData.CustomerName ? { label: allOptions.find(c=>c.value===formData.CustomerName)?.label || "", value: formData.CustomerName } : null}
              onChange={handleSearchChange}
              placeholder="Search Customer..."
              isClearable
              noOptionsMessage={() => "Customer not found"}
              menuPortalTarget={document.body}
              styles={{
                control: (base) => ({ ...base, minHeight: "32px", fontSize: "0.85rem" }),
                menu: (base) => ({ ...base, zIndex: 9999 })
              }}
            />
          </div>

          <div className="col-12 col-md-2">
            {/* <label className="form-label mb-0" style={{ fontSize: "0.85rem" }}></label> */}
            <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>From Date</h6>
            <DatePicker
              portalId="root-portal"
              selected={formData.fromdt}
              onChange={(date) => handleDateChange(date, "fromdt")}
              dateFormat="dd/MM/yyyy"
              className="form-control form-control-sm"
            />
          </div>

          <div className="col-12 col-md-2">
            <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>To Date</h6>
            <DatePicker
              portalId="root-portal"
              selected={formData.todt}
              onChange={(date) => handleDateChange(date, "todt")}
              dateFormat="dd/MM/yyyy"
              className="form-control form-control-sm"
            />
          </div>
          <div className="col-12 col-md-5 mt-4 pt-1 gap-2 d-flex align-items-center justify-content-center justify-content-md-end flex-wrap">
            <button
              type="submit"
              className="btn btn-primary btn-sm d-flex align-items-center gap-1 rounded-pill shadow-sm"
            >
              <FaPaperPlane size={10} /><span style={{ marginRight: "2px" }}>Submit</span>
            </button>

            {/* Email Button */}
            <button
              type="button"
              className="btn btn-info btn-sm d-flex align-items-center gap-1 rounded-pill shadow-sm"
              // 🔹 send excel by default
              onClick={sendMail}
            >
              <MdEmail size={10} /><span style={{ marginRight: "2px" }}>Mail</span>
            </button>

            {/* Excel Button */}
            <button
              type="button"
              className="btn btn-success btn-sm d-flex align-items-center gap-1 rounded-pill shadow-sm"
              onClick={exportSelectedToExcel}
            >
              <FaFileExcel size={10} /><span style={{ marginRight: "2px" }}>Excel</span>
            </button>

            {/* PDF Button */}
            <button
              type="button"
              className="btn btn-danger btn-sm d-flex align-items-center gap-1 rounded-pill shadow-sm"
              onClick={exportSelectedToPDF}
            >
              <FaFilePdf size={10} /><span style={{ marginRight: "2px" }}>PDF</span>
            </button>
          </div>


        </div>
      </form>

      {/* 📋 Table */}
      <div className='table-responsive' style={{ maxHeight: "400px", overflowY: "auto" }}>
        <table className='table table-bordered table-sm text-nowrap'>
          <thead className='green-header' style={{ position: "sticky", top: 0, zIndex: 2 }}>
            <tr>
              <th><input type="checkbox" onChange={handleSelectAll} checked={currentRows.length > 0 && selectedDockets.length === currentRows.length} /></th>
              <th>Sr.No</th>
              <th>DocketNo</th>
              <th>Book_Date</th>
              <th>Customer</th>
              <th>Consignee</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Mode</th>
              <th>Vendor</th>
              <th>Vendor_Docket</th>
              <th>Flag</th>
              <th>Qty</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Delivery_Date</th>
              <th>Delivery_Time</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody style={{fontWeight:"normal",fontSize:"8px"}}>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="18" className="text-center text-danger">No Data Found</td>
              </tr>
            ) : (
              currentRows.map((item, index) => (
                <tr key={index}>
                  <td><input type="checkbox" checked={selectedDockets.includes(item.DocketNo)} onChange={() => handleCheckboxChange(item.DocketNo)} /></td>
                  <td>{indexOfFirstRow + index + 1}</td>
                  <td>{item.DocketNo}</td>
                  <td>{item.BookDate ? new Date(item.BookDate).toLocaleDateString('en-GB') : ''}</td>
                  <td>{item.Customer_Name}</td>
                  <td>{item.Consignee_Name}</td>
                  <td>{item.Origin_Name}</td>
                  <td>{item.Destination_Name}</td>
                  <td>{item.Mode_Name}</td>
                  <td>{item.Vendor_Name}</td>
                  <td>{item.vendorAwbno}</td>
                  <td>{item.T_Flag}</td>
                  <td>{item.Qty}</td>
                  <td>{item.ActualWt}</td>
                  <td>{item.Status}</td>
                  <td>{item.DelvDT}</td>
                  <td>{item.DelvTime}</td>
                  <td>{item.Remark}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 mt-2">
        {/* Rows per page dropdown */}
        <div className="d-flex align-items-center gap-2">
          <label className="mb-0">Rows per page:</label>
          <select
            className="form-select form-select-sm"
            style={{ width: "80px" }}
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1); // reset to first page
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={EmailData.length}>All</option>
          </select>
        </div>

        {/* Pagination */}
        <div className="d-flex align-items-center gap-2">
          <button
            className="ok-btn"
            style={{ width: "30px" }}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <span style={{ color: "#333", padding: "5px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="ok-btn"
            style={{ width: "30px" }}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailBooking;
