import React, { useState, Suspense, useEffect } from "react";
import "./list.css";
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";

const CustomerName = React.lazy(() => import("./CustomerName"));
const ProductWiseFuel = React.lazy(() => import("./ProductWiseFuel"));
const OdaMaster = React.lazy(() => import("../Customer Charges/OdaMaster"));
const CustomerRate = React.lazy(() => import("./CustomerRate"));
const CustomerVolumetric = React.lazy(() => import("./CustomerVolumetric"));

function CustomerList() {
  // 🔹 Load permissions
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // 🔹 Define tabs dynamically
  const allTabs = [
    { id: "zone", label: "Customer Name", component: <CustomerName />, show: has("CustomerName") },
    { id: "state", label: "Customer Rate", component: <CustomerRate />, show: has("CustomerRate") },
    { id: "multiple", label: "Customer Charges", component: <ProductWiseFuel />, show: has("CustomerCharges") },
    { id: "shipper", label: "Customer ODA", component: <OdaMaster />, show: has("CustomerOda") },
    { id: "country", label: "Customer Volumetric", component: <CustomerVolumetric />, show: has("CustomerVolumetric") }
  ];

  // 🔹 Only visible tabs
  const visibleTabs = allTabs.filter(t => t.show);

  const [activeTab, setActiveTab] = useState(null);

  // 🔹 Auto-select first visible tab
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

          {/* Navigation */}
          <nav className="nav">
            {visibleTabs.map((tab, index) => (
              <label key={tab.id} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </label>
            ))}

            {/* Slider */}
            {activeTab && (
              <div
                className="slider"
                style={{
                  width: `${100 / visibleTabs.length}%`,
                  left: `${visibleTabs.findIndex(t => t.id === activeTab) * (100 / visibleTabs.length)}%`
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

export default CustomerList;
