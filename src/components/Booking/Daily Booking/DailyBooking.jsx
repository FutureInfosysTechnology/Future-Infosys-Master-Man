import React, { useState } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";
import VendorBill from "./VendorBill";
import EmailBooking from "./EmailBooking";
import BulkImport from "../Daily Manifest/BulkImport";
import DailyExpenses from "./DailyExpenses";
import Booking from "./Booking";
import ShortEntry from "./ShortEntry";
import ExcelImportBulk from "./ExcelImportBulk"; // ✅ Added import

function DailyBooking() {
  const [activeTab, setActiveTab] = useState("vendor");

  const handleChange = (event) => {
    setActiveTab(event.target.id);
  };

  return (
    <>
      <Header />
      <Sidebar1 />
      <div className="main-body" id="main-body">
        <div className="container-vendor">
          {/* Radio buttons */}
          <input
            type="radio"
            name="slider"
            id="vendor"
            checked={activeTab === "vendor"}
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
          <input
            type="radio"
            name="slider"
            id="vendorgst"
            checked={activeTab === "vendorgst"}
            onChange={handleChange}
          />
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
            <label htmlFor="vendorrate" className="vendorrate">
              Docket Expenses
            </label>
            <label htmlFor="vendorfuel" className="vendorfuel">
              Auto Mail
            </label>
            <label htmlFor="entry" className="entry">
              Short Entry
            </label>
            {/*<label htmlFor="vendorgst" className="vendorgst">
              Bulk Import Data
            </label>*/}
            <label htmlFor="excelimport" className="excelimport">
              Excel Import Bulk
            </label>
            <label htmlFor="vendorcharge" className="vendorcharge">
              Vendor Bill Entry
            </label>
            <div className="slider"></div>
          </nav>

          {/* Sections */}
          <section>
            <div
              className={`content content-1 ${
                activeTab === "vendor" ? "active" : ""
              }`}
            >
              <Booking />
            </div>

            <div
              className={`content content-2 ${
                activeTab === "vendorrate" ? "active" : ""
              }`}
            >
              <DailyExpenses />
            </div>

            <div
              className={`content content-3 ${
                activeTab === "vendorfuel" ? "active" : ""
              }`}
            >
              <EmailBooking />
            </div>

            <div
              className={`content content-4 ${
                activeTab === "entry" ? "active" : ""
              }`}
            >
              <ShortEntry />
            </div>

             <div
               className={`content content-5 ${
                 activeTab === "excelimport" ? "active" : ""
               }`}
             >
               <ExcelImportBulk />
             </div>

{/* 
            <div
              className={`content content-4 ${
                activeTab === "vendorgst" ? "active" : ""
              }`}
            >
              <BulkImport />
            </div> */}

            <div
              className={`content content-5 ${
                activeTab === "vendorcharge" ? "active" : ""
              }`}
            >
              <VendorBill />
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default DailyBooking;
