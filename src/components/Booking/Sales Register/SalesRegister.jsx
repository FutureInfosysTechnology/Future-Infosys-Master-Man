import React, { useState, useEffect } from "react";
import Footer from "../../../Components-2/Footer";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Header from "../../../Components-2/Header/Header";

import SalesRegisterWiseReport from "./SalesRegisterWiseReport";
import ChecklistReport from "./ChecklistReport";
import StatementWiseReport from "../Statement/StatementWiseReport";

function SalesRegister() {
  // Get permissions
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1 || permissions[key] === true;

  // Define all tabs with permission rules
  const tabs = [
    {
      id: "invoiceLedger",
      label: "Invoice Ledger Report",
      component: <SalesRegisterWiseReport />,
      show: has("InvoiceLedgerReport"),
    },
    {
      id: "checklist",
      label: "Checklist Report",
      component: <ChecklistReport />,
      show: has("ChecklistReport"),
    },
    {
      id: "unbuild",
      label: "Unbuild Report",
      component: <StatementWiseReport />,
      show: has("UnbuildReport"),
    },
    {
      id: "billView",
      label: "Bill View Report",
      component: <StatementWiseReport />,
      show: has("BillViewReport"),
    },
  ];

  // Filter visible tabs
  const visibleTabs = tabs.filter((t) => t.show);

  const [activeTab, setActiveTab] = useState(null);

  // Auto-select first allowed tab
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
        <div className="container">

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

          {/* Active Tab Content */}
          <section>
            {visibleTabs.find((t) => t.id === activeTab)?.component}
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default SalesRegister;
