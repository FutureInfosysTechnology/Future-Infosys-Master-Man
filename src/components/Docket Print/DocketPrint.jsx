import React, { useState, useEffect } from "react";
import Footer from "../../Components-2/Footer";
import Sidebar1 from "../../Components-2/Sidebar1";
import Header from "../../Components-2/Header/Header";

import DockerPrint1 from "./DockerPrint1";
import DocketPrint2 from "./DocketPrint2";
import DocketPrint3 from "./DocketPrint3";
import DocketPrint4 from "./DocketPrint4";
import LabelPrinting from "./LabelPrinting";
import BoxSticker from "./BoxSticker";

import "./DocketPrint.css";
import { useLocation } from "react-router-dom";

function DocketPrint() {
  const location = useLocation();

  // Get permissions
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Define all tabs with permissions
  const tabs = [
    { id: "print1", label: "Docket Print 1", component: <DockerPrint1 />, permission: "DocketPrint1" },
    { id: "print2", label: "Docket Print 2", component: <DocketPrint2 />, permission: "Docketprint2" },
    { id: "print3", label: "Docket Print 3", component: <DocketPrint3 />, permission: "Docketprint3" },
    { id: "print4", label: "Docket Print 4", component: <DocketPrint4 />, permission: "Docketprint4" },
    { id: "label", label: "Label Printing", component: <LabelPrinting />, permission: "LebelPrintin" },
    { id: "sticker", label: "Sticker Printing", component: <BoxSticker />, permission: "StickerPrinting" },
  ];

  // Filter tabs based on permissions
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
        <div className="container-vendor">

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

            {/* Slider */}
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

export default DocketPrint;
