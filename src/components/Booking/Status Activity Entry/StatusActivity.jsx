import React, { useState, useEffect } from "react";
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";

import ManualEntry from "./ManualEntry";
import NewPodEntry from './NewPodEntry';
import ExcelImport from "./ExcelImport";
import ExcelImportBulk from "../Daily Booking/ExcelImportBulk";

function StatusActivity() {
  // Get user permissions
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Define tabs with permission keys
  const tabs = [
    { id: "delivered", label: "Activity Entry", component: <NewPodEntry />, permission: "Statusactivity" },
    { id: "undelivered", label: "Activity Import Bulk", component: <ExcelImportBulk />, permission: "StatusactivityimportBulk" },
    { id: "upload", label: "Activity Tracking", component: <ExcelImport />, permission: "StatusactivityTracking" },
  ];

  // Only show tabs the user has permission for
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

            {/* Slider */}
            <div className="slider"
              style={{
                width: `${100 / visibleTabs.length}%`,
                left: `${visibleTabs.findIndex(t => t.id === activeTab) * (100 / visibleTabs.length)}%`
              }}
            ></div>
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

export default StatusActivity;
