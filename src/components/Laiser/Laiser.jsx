import React, { useState } from "react";
import Header from "../../Components-2/Header/Header";
import Sidebar1 from "../../Components-2/Sidebar1";
import Footer from "../../Components-2/Footer";
import OrderEntry from "./OrderEntry";
import PaymentEntry from "./PaymentEntry";
import ProductionEntry from "./ProductionEntry";
import PaymentReceived from "./PaymentReceived";
import { useLocation } from "react-router-dom";
import CreditPrint from "./CreditPrint";

function Laiser() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location?.state?.tab || "paymentMode");

  // ✅ Define all tabs in one array for easy management
  const tabs = [
    { id: "paymentMode", label: "Payment Mode", component: <PaymentReceived /> },
    { id: "ledgers", label: "Ledgers", component: <PaymentEntry /> },
    { id: "creditNote", label: "Credit Note", component: <ProductionEntry /> },
  ];

  return (
    <>
      <Header />
      <Sidebar1 />
      <div className="main-body" id="main-body">
        <div className="container">
          {/* ✅ Tab Navigation */}
          <nav style={{}}>
            {tabs.map((tab) => (
              <label
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </label>
            ))}

            {/* ✅ Animated Slider */}
            <div
              className="slider"
              style={{
                left: `${tabs.findIndex((t) => t.id === activeTab) * (100 / tabs.length)}%`,
                width: `${100 / tabs.length}%`,
              }}
            />
          </nav>

          {/* ✅ Tab Content Section */}
          <section>
            {tabs.find((t) => t.id === activeTab)?.component}
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Laiser;
