import React, { Suspense, useEffect, useState } from "react";
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import "./branch.css";

const BranchName = React.lazy(() => import("./BranchName"));
const BankName = React.lazy(() => import("./BankName"));
const EmployeeName = React.lazy(() => import("./EmployeeName"));
const ModeMaster = React.lazy(() => import("./ModeMaster"));

function BranchMaster() {

  // Load permissions
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Tab definitions
  const allTabs = [
    { id: "zone", label: "Branch Name", component: <BranchName />, show: has("BranchName") },
    { id: "multiple", label: "Mode Master", component: <ModeMaster />, show: has("Mode_Master") },
    { id: "state", label: "Bank Name", component: <BankName />, show: has("BankName") },
    { id: "country", label: "Delivery Boy's Name", component: <EmployeeName />, show: has("DeliveryMaster") },
  ];

  // Visible tabs only
  const visibleTabs = allTabs.filter(t => t.show);

  const [activeTab, setActiveTab] = useState(null);

  // Auto-select the first allowed tab
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

          {/* Radio inputs (hidden but required for your CSS) */}
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

          {/* Nav Labels */}
          <nav>
            {visibleTabs.map((tab, index) => (
              <label key={tab.id} htmlFor={tab.id}>
                {tab.label}
              </label>
            ))}

            {/* Slider */}
            {activeTab && (
              <div
                className="slider"
                style={{
                  width: `${100 / visibleTabs.length}%`,
                  left:
                    `${
                      visibleTabs.findIndex((t) => t.id === activeTab) *
                      (100 / visibleTabs.length)
                    }%`,
                }}
              ></div>
            )}
          </nav>

          {/* Content */}
          <section>
            <Suspense fallback={<div>Loading...</div>}>
              {visibleTabs.find(t => t.id === activeTab)?.component}
            </Suspense>
          </section>

        </div>
        <Footer />
      </div>
    </>
  );
}

export default BranchMaster;
