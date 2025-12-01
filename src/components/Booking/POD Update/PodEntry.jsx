import React, { useState, useEffect } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";
import './podentry.css';
import Undelivered from "./Undelivered";
import BulkUpdate from "./BulkUpdate";
import Delivered from "./Delivered";

function PodEntry() {
  // Get permissions from localStorage
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Define tabs with permission keys
  const tabs = [
    { id: "delivered", label: "Delivered", component: <Delivered />, permission: "DeliveryEntry" },
    { id: "undelivered", label: "Return Booking", component: <Undelivered />, permission: "ReturnEntry" },
    { id: "upload", label: "Bulk Upload (Excel)", component: <BulkUpdate />, permission: "BulkUploadExcel" },
  ];

  // Only show tabs with permission
  const visibleTabs = tabs.filter(tab => has(tab.permission));

  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || null);

  useEffect(() => {
    // Set first visible tab if none is active
    if (!activeTab && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  return (
    <>
      <Header />
      <Sidebar1 />

      <div className="main-body" id="main-body">
        <div className="container-6">

          {/* Tab radios */}
          {visibleTabs.map(tab => (
            <input
              key={tab.id}
              type="radio"
              name="slider"
              id={tab.id}
              checked={activeTab === tab.id}
              onChange={() => setActiveTab(tab.id)}
            />
          ))}

          {/* Tab labels */}
          <nav>
            {visibleTabs.map(tab => (
              <label key={tab.id} htmlFor={tab.id} className={tab.id}>
                {tab.label}
              </label>
            ))}

            <div
              className="slider"
              style={{
                left: `${visibleTabs.findIndex((t) => t.id === activeTab) * (100 / visibleTabs.length)}%`,
                width: `${100 / visibleTabs.length}%`,
              }}
            />
          </nav>

          {/* Tab content */}
          <section>
            {visibleTabs.map(tab => (
              <div
                key={tab.id}
                className={`content content-${tab.id} ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.component}
              </div>
            ))}
          </section>

        </div>
        <Footer />
      </div>
    </>
  );
}

export default PodEntry;
