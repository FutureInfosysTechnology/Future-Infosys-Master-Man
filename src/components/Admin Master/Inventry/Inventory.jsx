import React, { useState, Suspense, useEffect } from "react";

import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";

const StockEntry = React.lazy(() => import("./StockEntry"));
const EmployeeStock = React.lazy(() => import("./EmployeeStock"));
const BranchStock = React.lazy(() => import("./BranchStock"));
const CustomerStock = React.lazy(() => import("./CustomerStock"));

function Inventory() {
  // Load user permissions
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Tab definitions
  const allTabs = [
    {
      id: "zone",
      label: "Stock Details",
      component: <StockEntry />,
      show: has("StockDetails"),
    },
    {
      id: "multiple",
      label: "Branch Stock Details",
      component: <BranchStock />,
      show: has("StockIssueBranchWise"),
    },
    {
      id: "state",
      label: "Customer Stock Details",
      component: <CustomerStock />,
      show: has("StockIssueCustomerWise"),
    },
    {
      id: "country",
      label: "Employee Stock Details",
      component: <EmployeeStock />,
      show: has("StockIssueEmployeeWise"),
    },
  ];

  // Visible tabs only
  const visibleTabs = allTabs.filter((t) => t.show);

  const [activeTab, setActiveTab] = useState(null);

  // Auto-select first visible tab
  useEffect(() => {
    if (!activeTab && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs]);

  return (
    <>
      <Header />
      <Sidebar1 />

      <div className="main-body" id="main-body">
        <div className="container">

          {/* Tabs */}
          <nav className="nav">
            {visibleTabs.map((tab) => (
              <label
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                
              >
                {tab.label}
              </label>
            ))}

            {/* Slider */}
            {activeTab && (
              <div
                className="slider"
                style={{
                  width: `${100 / visibleTabs.length}%`,
                  left: `${
                    visibleTabs.findIndex((t) => t.id === activeTab) *
                    (100 / visibleTabs.length)
                  }%`,
                }}
              ></div>
            )}
          </nav>

          {/* Tab Content */}
          <section>
            <Suspense fallback={<div>Loading...</div>}>
              {visibleTabs.find((t) => t.id === activeTab)?.component}
            </Suspense>
          </section>

        </div>
        <Footer />
      </div>
    </>
  );
}

export default Inventory;
