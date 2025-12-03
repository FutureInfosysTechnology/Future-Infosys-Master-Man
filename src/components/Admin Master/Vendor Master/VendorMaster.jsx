import React, { useState, Suspense, useEffect } from "react";
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";

const VendorName = React.lazy(() => import("./VendorName"));
const VendorRate = React.lazy(() => import("./VendorRate"));
const VendorFuel = React.lazy(() => import("./VendorFuel"));
const VendorGst = React.lazy(() => import("./VendorGst"));

function VendorMaster() {
  // Load permissions
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Define all tabs with permissions
  const allTabs = [
    {
      id: "zone",
      label: "Vendor Name",
      component: <VendorName />,
      show: has("VendorName"),
    },
    {
      id: "multiple",
      label: "Vendor Rate",
      component: <VendorRate />,
      show: has("VendorRate"),
    },
    {
      id: "state",
      label: "Vendor Charges",
      component: <VendorFuel />,
      show: has("VendorFeul"), // permission key in your JSON
    },
    {
      id: "country",
      label: "Vendor Gst Master",
      component: <VendorGst />,
      show: has("VendorGstMaster"),
    },
  ];

  // Visible tabs only
  const visibleTabs = allTabs.filter((t) => t.show);

  const [activeTab, setActiveTab] = useState(null);

  // Auto-select first allowed tab
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

          {/* Content */}
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

export default VendorMaster;
