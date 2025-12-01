import React, { useState, useEffect } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";

import ScanbyAirway from "./ScanbyAirway";
import ScanbyManifest from "./ScanbyManifest";
import ScanbyDRSNo from "./ScanbyDRSNo";

function Inscan() {
  // Get permissions from localStorage
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Tabs definition with permission checks
  const tabs = [
    { id: "airway", label: "Scan by Docket No", component: <ScanbyAirway />, show: has("ScanbyDocketNo") },
    { id: "manifest", label: "Inscan Process View", component: <ScanbyManifest />, show: has("InscanProcessView") },
    { id: "drs", label: "Inscan by DRS No", component: <ScanbyDRSNo />, show: has("ScanbynDrsNo") },
  ];

  // Only show tabs the user has access to
  const visibleTabs = tabs.filter((t) => t.show);

  const [activeTab, setActiveTab] = useState(null);

  // Auto-select the first visible tab
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
        <div className="container-transport">

          {/* Tab Headers */}
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
                  left: `${visibleTabs.findIndex((t) => t.id === activeTab) * (100 / visibleTabs.length)}%`,
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

export default Inscan;
