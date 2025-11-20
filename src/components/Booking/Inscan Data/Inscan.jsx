import React, { useState } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";
import ScanbyAirway from "./ScanbyAirway";
import ScanbyManifest from "./ScanbyManifest";
import ScanbyDRSNo from "./ScanbyDRSNo";

function Inscan() {
  const [activeTab, setActiveTab] = useState("airway");

  // All tabs defined here
  const tabs = [
    { id: "airway", label: "Scan by Docket No", component: <ScanbyAirway /> },
    { id: "manifest", label: "Inscan Process View", component: <ScanbyManifest /> },
    { id: "drs", label: "Inscan by DRS No", component: <ScanbyDRSNo /> },
  ];

  return (
    <>
      <Header />
      <Sidebar1 />

      <div className="main-body" id="main-body">
        <div className="container-transport">

          {/* Navigation Tabs */}
          <nav>
            {tabs.map((tab) => (
              <label
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? "active-tab" : ""}
              >
                {tab.label}
              </label>
            ))}

            {/* Slider */}
            <div
              className="slider"
              style={{
                left: `${tabs.findIndex((t) => t.id === activeTab) * (100 / tabs.length)}%`,
                width: `${100 / tabs.length}%`,
              }}
            />
          </nav>

          {/* Content Section */}
          <section>
            {tabs.find((t) => t.id === activeTab)?.component}
          </section>

        </div>

        <Footer />
      </div>
    </>
  );
}

export default Inscan;
