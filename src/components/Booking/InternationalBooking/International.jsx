import React, { useState } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";
import InternationalBooking from "./InternationalBooking"
import { useLocation } from "react-router-dom";
import InternationalManifest from "./InternationalManifest";
import CustRateUpload from "./CustRateUpload";
import VenRateUpload from "./VenRateUpload";

function DailyBooking() {
  const location = useLocation();

  // 👇 API permissions (Coming from previous page)
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};

  // Helper: show only if API value = 1
  const has = (key) => permissions[key] === 1;

  const [activeTab, setActiveTab] = useState(location?.state?.tab || null);

  // ===================== TABS LIST WITH PERMISSIONS =====================
  const tabs = [
    { id: "Booking", label: "Intl Booking", component: <InternationalBooking/>, show: has("InternationalBooking") },
    { id: "Manifest", label: "Intl Manifest", component: <InternationalManifest />, show:1 },
    { id: "CRate", label: "Customer Rate Upload", component: <CustRateUpload />, show: 1 },
    { id: "CVRate", label: "Vendor Rate Upload", component: <VenRateUpload />, show: 1 },
    { id: "Status", label: "Intl Status Upload", component: <InternationalBooking />, show: 1},
    { id: "Print", label: "Intl Manifest Print", component: <InternationalBooking />, show: 1 },
   
  ];

  // Filter only visible tabs
  const visibleTabs = tabs.filter((t) => t.show);

  // If no default activeTab, set first visible tab
  if (!activeTab && visibleTabs.length > 0) {
    setActiveTab(visibleTabs[0].id);
  }

  return (
    <>
      <Header />
      <Sidebar1 />
      <div className="main-body" id="main-body">
        <div className="container">

          {/* ===================== NAVIGATION ===================== */}
          <nav>
            {visibleTabs.map((tab) => (
              <label
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                
              >
                {tab.label}
              </label>
            ))}

            {/* ===================== SLIDER ===================== */}
            <div
              className="slider"
              style={{
                left: `${visibleTabs.findIndex((t) => t.id === activeTab) * (100 / visibleTabs.length)}%`,
                width: `${100 / visibleTabs.length}%`,
              }}
            />
          </nav>

          {/* ===================== TAB CONTENT ===================== */}
          <section>
            {visibleTabs.find((t) => t.id === activeTab)?.component}
          </section>

        </div>
        <Footer />
      </div>
    </>
  );
}

export default DailyBooking;
