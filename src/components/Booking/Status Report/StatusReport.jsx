import React, { useState, useEffect } from "react";
import Footer from "../../../Components-2/Footer";
import Complaint from "../Customer Query/Complaint";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import CustomerWiseReport from "./CustomerWiseReport";
import VendorWiseReport from "./VendorWiseReport";

function StatusReport() {
  // Get permissions from localStorage
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1 || permissions[key] === true;

  // Tabs with permissions
  const tabs = [
    {
      id: "mis",
      label: "MIS Report",
      component: <CustomerWiseReport />,
      show: has("MISReport"),
    },
    {
      id: "vendor",
      label: "Vendor MIS Report",
      component: <VendorWiseReport />,
      show: has("VendorMISReport"),
    },
    {
      id: "booking",
      label: "Booking Mode Report",
      component: <Complaint />,
      show: has("BookingModeReport"),
    },
  ];

  // filter visible tabs
  const visibleTabs = tabs.filter((t) => t.show);

  const [activeTab, setActiveTab] = useState(null);

  // Auto set first tab
  useEffect(() => {
    if (activeTab === null && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  return (
    <>
      <Header />
      <Sidebar1 />

      <div className="main-body" id="main-body">
        <div className="container-6">

          {/* Tab Navigation */}
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

            {/* Slider */}
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

export default StatusReport;
