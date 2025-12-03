import React, { useState, Suspense, useEffect } from "react";
import Footer from "../../Components-2/Footer";
import Header from "../../Components-2/Header/Header";
import Sidebar1 from "../../Components-2/Sidebar1";

const ZoneMaster = React.lazy(() => import("../Admin Master/Area Control/Zonemaster/Zonemaster"));
const Statemast = React.lazy(() => import("../Admin Master/Area Control/StateMast/Statemast"));
const Countrylist = React.lazy(() => import("../Admin Master/Area Control/CountryMast/Countrylist"));
const MultipleCity = React.lazy(() => import("../Admin Master/Area Control/MultipleCity"));

function Tabs() {
  // Load permission object
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Define tab config
  const allTabs = [
    {
      id: "zone",
      label: "City Control",
      component: <ZoneMaster />,
      show: has("CityControl"),     // <-- change key as per your API
    },
    {
      id: "multiple",
      label: "International Zone",
      component: <MultipleCity />,
      show: has("MultipleZone"),
    },
    {
      id: "state",
      label: "State Master",
      component: <Statemast />,
      show: has("StateMaster"),
    },
    {
      id: "country",
      label: "Country Master",
      component: <Countrylist />,
      show: has("CountryMaster"),
    },
  ];

  // Only tabs that are allowed
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

          {/* Tab Content */}
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

export default Tabs;
