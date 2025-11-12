import React, { useState } from 'react';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import Footer from '../../Components-2/Footer';
import GenerateInvoice from './GenerateInvoice';
import ViewInvoice from './ViewInvoice';
import PerformanceBill from './PerformanceBill';
import PendingInvoice from './PendingInvoice';
import ViewPerforma from './ViewPerforma';
import InvoiceSum from './InvoiceSum';
import DocketInvoicePrint from './DocketInvoicePrint';
import { useLocation } from 'react-router-dom';

function Invoice() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location?.state?.tab || 'pending');

  // ✅ Define all tabs dynamically
  const tabs = [
    { id: 'pending', label: 'Pending Invoice', component: <PendingInvoice /> },
    { id: 'generate', label: 'Generate Invoice', component: <GenerateInvoice /> },
    { id: 'viewInvoice', label: 'View Invoice', component: <ViewInvoice /> },
    { id: 'summary', label: 'Invoice Summary', component: <InvoiceSum /> },
    { id: 'print', label: 'Docket Print', component: <DocketInvoicePrint /> },
    { id: 'performance', label: 'Performance Invoice', component: <PerformanceBill /> },
    { id: 'viewPerformance', label: 'View Performance Invoice', component: <ViewPerforma /> },
  ];

  return (
    <>
      <Header />
      <Sidebar1 />
      <div className="main-body" id="main-body">
        <div className="container">
          {/* ✅ Navigation Tabs */}
          <nav style={{ height: "28px" }}>
            {tabs.map(tab => (
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
                left: `${tabs.findIndex(t => t.id === activeTab) * (100 / tabs.length)}%`,
                width: `${100 / tabs.length}%`,
              }}
            />
          </nav>

          {/* ✅ Dynamic Section Rendering */}
          <section>
            {tabs.find(t => t.id === activeTab)?.component}
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Invoice;
