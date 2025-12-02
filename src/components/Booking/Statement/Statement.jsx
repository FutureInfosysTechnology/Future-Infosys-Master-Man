import React, { useState, useEffect } from "react";
import Footer from "../../../Components-2/Footer";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Header from "../../../Components-2/Header/Header";

import StatementWiseReport from "./StatementWiseReport";
import ChecklistWiseReport from "./ChecklistWiseReport";
import ModeWiseReport from "./ModeWiseReport";

function Statement() {
  // Get permissions from localStorage
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1 || permissions[key] === true;

  // Tabs with permission checks
  const tabs = [
    {
      id: "bookingDetail",
      label: "Booking Detail",
      component: <StatementWiseReport />,
      show: has("BookingDetail"),
    },
    {
      id: "charges",
      label: "Total Charges Report",
      component: <ChecklistWiseReport />,
      show: has("TotalChargesReport"),
    },
    {
      id: "modeWise",
      label: "Mode Wise Report",
      component: <ModeWiseReport />,
      show: has("ModeWiseReport"),
    },
  ];

  // Visible tabs based on permission
  const visibleTabs = tabs.filter((t) => t.show);

  const [activeTab, setActiveTab] = useState(null);

  // Auto select first allowed tab
  useEffect(() => {
    if (activeTab === null && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [activeTab, visibleTabs]);

  return (
    <>
      <Header />
      <Sidebar1 />

      <div className="main-body" id="main-body">
        <div className="container-6">

          {/* Navigation Tabs */}
          <nav>
            {visibleTabs.map((tab) => (
              <label
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? "active-tab" : ""}
              >
                {tab.label}
              </label>
            ))}

            {/* Dynamic slider */}
            {activeTab && visibleTabs.length > 0 && (
              <div
                className="slider"
                style={{
                  left: `${
                    visibleTabs.findIndex((t) => t.id === activeTab) *
                    (100 / visibleTabs.length)
                  }%`,
                  width: `${100 / visibleTabs.length}%`,
                }}
              />
            )}
          </nav>

          {/* Tab Content */}
          <section>
            {visibleTabs.find((t) => t.id === activeTab)?.component}
          </section>

        </div>
        <Footer />
      </div>
    </>
  );
}

export default Statement;
