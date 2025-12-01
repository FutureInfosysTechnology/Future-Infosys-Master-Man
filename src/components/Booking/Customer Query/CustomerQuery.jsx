import React, { useState, useEffect } from 'react';
import Footer from '../../../Components-2/Footer';
import Sidebar1 from '../../../Components-2/Sidebar1';
import Header from '../../../Components-2/Header/Header';

import Complaint from './Complaint';
import ViewQuery from './ViewQuery';
import Delivered from '../POD Update/Delivered';

function CustomerQuery() {
  // Get permissions from localStorage
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Define tabs with permissions
  const tabs = [
    { id: 'delivered', label: 'Complaint', component: <Complaint />, permission: 'ComplaintRegister' },
    { id: 'undelivered', label: 'View Complaint Status', component: <ViewQuery />, permission: 'ViewComplaintStatus' },
    { id: 'upload', label: 'Query', component: <Delivered />, permission: 'ComplaintQuery' }, // Adjust permission if needed
  ];

  // Filter tabs based on permissions
  const visibleTabs = tabs.filter(tab => has(tab.permission));

  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || null);

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
        <div className="container-6">

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

export default CustomerQuery;
