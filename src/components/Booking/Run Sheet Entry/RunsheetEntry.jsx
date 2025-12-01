import React, { useState, useEffect } from "react";
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import PendingDrs from "./PendingDrs";
import CreateDrs from "./CreateDrs";
import ViewDrs from "./ViewDrs";
import ImportDrs from "./ImportDrs";
import { useLocation } from "react-router-dom";

function RunsheetEntry() {
  const location = useLocation();

  // Get user permissions
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Define all tabs with permission keys
  const tabs = [
    { id: "zone", label: "Delivery Pending", component: <PendingDrs />, permission: "DeliveryPending" },
    { id: "multiple", label: "Delivery Entry", component: <CreateDrs />, permission: "DeliveryBooking" },
    { id: "state", label: "View DRS", component: <ViewDrs />, permission: "DrsView" },
    { id: "country", label: "Import DRS", component: <ImportDrs />, permission: "Drsimport" },
  ];

  // Only show tabs user has permission for
  const visibleTabs = tabs.filter(tab => has(tab.permission));

  const [activeTab, setActiveTab] = useState(location?.state?.tab || visibleTabs[0]?.id || null);

  useEffect(() => {
    if (!activeTab && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  return (
    <>
      <Header />
      <Sidebar1 />

      <div className="main-body" id="main-body">
        <div className="container">

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

export default RunsheetEntry;
