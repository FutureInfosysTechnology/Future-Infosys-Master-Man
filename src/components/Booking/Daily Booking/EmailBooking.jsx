import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Select from 'react-select'; // 🔹 You forgot this
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
// import './EmailBooking.css'; // Optional: for your custom styles

function EmailBooking() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [formData, setFormData] = useState({
    fromdt: firstDayOfMonth,
    todt: today,
    CustomerName: ""
  });

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
      value: cust.Customer_Name,
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
      const response = await getApi(`/Booking/AutoMailsend?CustomerName=${encodeURIComponent(CustomerName)}&fromdt=${fromdt}&todt=${todt}`);
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

  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = EmailData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(EmailData.length / rowsPerPage);

  const handleCheckboxChange = (docketNo) => {
    setSelectedDockets((prev) =>
      prev.includes(docketNo) ? prev.filter((item) => item !== docketNo) : [...prev, docketNo]
    );
  };

  const handleSelectAll = () => {
    setSelectedDockets(
      selectedDockets.length === currentRows.length ? [] : currentRows.map((item) => item.DocketNo)
    );
  };

  const handleSendEmailWithAttachment = async (fileType) => {
    const fromDate = formatDate(formData.fromdt);
    const toDate = formatDate(formData.todt);
    const customerName = formData.CustomerName;

    if (!customerName || !fromDate || !toDate) {
      Swal.fire('Error', 'Please fill all fields.', 'error');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3200/Master/sendBookingExcelEmail?CustomerName=${encodeURIComponent(customerName)}&fromdt=${fromDate}&todt=${toDate}&recipientEmail=futureinfosyso@gmail.com&fileType=${fileType}`
      );

      const result = await response.json();
      if (result.status === 1) {
        Swal.fire('Success', result.message, 'success');
      } else {
        Swal.fire('Error', result.message, 'error');
      }
    } catch (error) {
      console.error('Email send failed:', error);
      Swal.fire('Error', 'Server error occurred.', 'error');
    }
  };

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  return (
    <div className="card shadow-sm p-3 mb-4 bg-white rounded">
      <form onSubmit={handlesave}>
        <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
          {/* 🔍 react-select Searchable Dropdown */}
          <div style={{ minWidth: "260px" }}>
           
             <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>Client Name</h6>
          
            <Select
              options={allOptions}
              value={formData.CustomerName ? { label: formData.CustomerName, value: formData.CustomerName } : null}
              onChange={handleSearchChange}
              placeholder="Search Customer..."
              isClearable
              noOptionsMessage={() => "Customer not found"}
              styles={{
                control: (base) => ({ ...base, minHeight: "32px", fontSize: "0.85rem" }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          <div>
            {/* <label className="form-label mb-0" style={{ fontSize: "0.85rem" }}></label> */}
             <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>From Date</h6>
             <DatePicker
              selected={formData.fromdt}
              onChange={(date) => handleDateChange(date, "fromdt")}
              dateFormat="dd/MM/yyyy"
              className="form-control form-control-sm"
            />
          </div>

          <div>
            <h6 className="form-label mb-0" style={{ fontSize: "0.85rem" }}>To Date</h6>
            <DatePicker
              selected={formData.todt}
              onChange={(date) => handleDateChange(date, "todt")}
              dateFormat="dd/MM/yyyy"
              className="form-control form-control-sm"
            />
          </div>

          <div className="d-flex gap-2 align-items-end ms-auto mt-2">
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
            <button type="button" className="btn btn-success btn-sm" onClick={() => handleSendEmailWithAttachment("excel")}>Excel</button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleSendEmailWithAttachment("pdf")}>PDF</button>
          </div>
        </div>
      </form>

      {/* 📋 Table */}
      <div className='table-container'>
        <table className='table table-bordered table-sm'>
          <thead className='green-header'>
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
          <tbody>
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
      <div className="pagination mt-2">
        <button className="ok-btn" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>{'<'}</button>
        <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
        <button className="ok-btn" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>{'>'}</button>
      </div>
    </div>
  );
}

export default EmailBooking;
