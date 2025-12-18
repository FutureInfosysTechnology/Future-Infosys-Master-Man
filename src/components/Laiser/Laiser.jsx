import { useState, useEffect } from "react";
import Header from "../../Components-2/Header/Header";
import Sidebar1 from "../../Components-2/Sidebar1";
import Footer from "../../Components-2/Footer";
import PaymentEntry from "./PaymentEntry";
import ProductionEntry from "./ProductionEntry";
import PaymentReceived from "./PaymentReceived";
import CreditPrint from "./CreditPrint";
import { useLocation } from "react-router-dom";
import PaymentReceived2 from "./PaymentReceived2";

function Laiser() {
  const location = useLocation();

  // Get permissions from localStorage
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Define tabs with permissions
  const tabs = [
    { id: "paymentMode", label: "Payment Mode", component: <PaymentReceived />, permission: has("PaymentReceivedEntry") },
    { id: "ledgers", label: "Ledgers", component: <PaymentEntry />, permission: has("PayOutStanding") },
    { id: "paymentReceived", label: "Payment Received", component: <PaymentReceived2  />, permission: 1 },
    { id: "creditNote", label: "Credit Note", component: <ProductionEntry />, permission: has("CreditBooking") },
    { id: "creditPrint", label: "Credit Note Print", component: <CreditPrint />, permission: has("CreditNoteView") },
  ];

  // Filter tabs based on user permissions
  const visibleTabs = tabs.filter(tab => tab.permission);

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
        <div className="container">
          {/* Tab Navigation */}
          <nav>
            {visibleTabs.map(tab => (
              <label key={tab.id} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </label>
            ))}

            {/* Slider */}
            <div
              className="slider"
              style={{
                left: `${visibleTabs.findIndex(t => t.id === activeTab) * (100 / visibleTabs.length)}%`,
                width: `${100 / visibleTabs.length}%`,
              }}
            />
          </nav>

          {/* Tab Content */}
          <section>
            {visibleTabs.find(t => t.id === activeTab)?.component}
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Laiser;
