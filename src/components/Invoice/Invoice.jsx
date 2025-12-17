import { useEffect, useState } from 'react';
import Footer from '../../Components-2/Footer';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';

import DocketInvoicePrint from './DocketInvoicePrint';
import GenerateInvoice from './GenerateInvoice';
import InvoiceSum from './InvoiceSum';
import PendingInvoice from './PendingInvoice';
import PerformanceBill from './PerformanceBill';
import ViewInvoice from './ViewInvoice';
import ViewPerforma from './ViewPerforma';

import { useLocation } from 'react-router-dom';

function Invoice() {
  const location = useLocation();

  // Get user permissions
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Define tabs with permissions
  const tabs = [
    { id: 'pending', label: 'Pending Invoice', component: <PendingInvoice />, permission: 'PendingInvoice' },
    { id: 'generate', label: 'Generate Invoice', component: <GenerateInvoice />, permission: 'GenerateInvoice' },
    { id: 'viewInvoice', label: 'View Invoice', component: <ViewInvoice />, permission: 'ViewInvoice' },
    { id: 'summary', label: 'Invoice Summary', component: <InvoiceSum />, permission: 'InvoiceSummary' },
    { id: 'print', label: 'Docket Print', component: <DocketInvoicePrint />, permission: 'Docket_Print' },
    { id: 'performance', label: 'Performance Invoice', component: <PerformanceBill />, permission: 'PerformanceInvoice' },
    { id: 'viewPerformance', label: 'View Performance Invoice', component: <ViewPerforma />, permission: 'ViewPerformanceInvoice' },
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
        <div className="container">
          {/* Navigation Tabs */}
          <nav style={{ height: "28px" }}>
            {visibleTabs.map(tab => (
              <label
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
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

          {/* Dynamic Tab Content */}
          <section>
            {visibleTabs.find(t => t.id === activeTab)?.component}
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Invoice;
