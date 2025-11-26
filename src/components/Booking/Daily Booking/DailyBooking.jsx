import React, { useState } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";
import UpdateCustomerRate from "../../Admin Master/Customer Charges/UpdateCustomerRate"
import EmailBooking from "./EmailBooking";
import BulkImport from "../Daily Manifest/BulkImport";
import DailyExpenses from "./DailyExpenses";
import Booking from "./Booking";
import ShortEntry from "./ShortEntry";
import "./DailyBooking.css"
import ExcelImportBulk from "./ExcelImportBulk"; // ✅ Added import
import BookingPrint from "./BookingPrint";
import { useLocation } from "react-router-dom";
function DailyBooking() {
  const location=useLocation();
  const [activeTab, setActiveTab] = useState(location?.state?.tab || "vendor");

  const handleChange = (event) => {
    setActiveTab(event.target.id);
    console.log(activeTab);
  };

  return (
    <>
      <Header />
      <Sidebar1 />
      <div className="main-body" id="main-body">
        <div className="container-vendor">
          {/* Radio buttons */}
          <input
            type="radio" name="slider"
            id="vendor"
            checked={activeTab === "vendor"}
            onChange={handleChange}
          />
           <input
            type="radio"
            name="slider"
            id="print"
            checked={activeTab === "print"}
            onChange={handleChange}
          />
          <input
            type="radio"
            name="slider"
            id="vendorrate"
            checked={activeTab === "vendorrate"}
            onChange={handleChange}
          />
          <input
            type="radio"
            name="slider"
            id="vendorfuel"
            checked={activeTab === "vendorfuel"}
            onChange={handleChange}
          />
          <input
            type="radio"
            name="slider"
            id="entry"
            checked={activeTab === "entry"}
            onChange={handleChange}
          />
          {/*<input
            type="radio"
            name="slider"
            id="vendorgst"
            checked={activeTab === "vendorgst"}
            onChange={handleChange}
          />*/}
          <input
            type="radio"
            name="slider"
            id="excelimport"
            checked={activeTab === "excelimport"}
            onChange={handleChange}
          />
          <input
            type="radio"
            name="slider"
            id="vendorcharge"
            checked={activeTab === "vendorcharge"}
            onChange={handleChange}
          />

          {/* Navigation */}
          <nav>
            <label htmlFor="vendor" className="vendor">
              Docket Booking
            </label>
            <label htmlFor="print" className="print">
              Docket Print
            </label>
            <label htmlFor="vendorrate" className="vendorrate">
              Cash To Pay Received
            </label>
            <label htmlFor="vendorfuel" className="vendorfuel">
              Auto Mail
            </label>
            <label htmlFor="entry" className="entry">
              Smart Booking
            </label>
            {/*<label htmlFor="vendorgst" className="vendorgst">
              Bulk Import Data
            </label>*/}
            <label htmlFor="excelimport" className="excelimport">
              Bulk Booking
            </label>
            <label htmlFor="vendorcharge" className="vendorcharge">
              Rate Update
            </label>
            <div className="slider"></div>
          </nav>

          {/* Sections */}
          <section>
            {activeTab === "vendor" && <Booking />}
            {activeTab === "print" && <BookingPrint />}
            {activeTab === "vendorrate" && <DailyExpenses />}
            {activeTab === "vendorfuel" && <EmailBooking />}
            {activeTab === "entry" && <ShortEntry />}
            {activeTab === "excelimport" && <ExcelImportBulk />}
            {activeTab === "vendorcharge" && <UpdateCustomerRate/>}
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default DailyBooking;
