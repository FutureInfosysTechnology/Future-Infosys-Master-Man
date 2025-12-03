import React, { useState, Suspense, useEffect } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";

const VehicleEntry = React.lazy(() => import("./VehicleEntry"));
const TransportEntry = React.lazy(() => import("./TransportEntry"));
const DriverEntry = React.lazy(() => import("./DriverEntry"));
const FlightEntry = React.lazy(() => import("./FlightEntry"));
const TrainEntry = React.lazy(() => import("./TrainEntry"));
const ProductEntry = React.lazy(() => import("./ProductEntry"));

function VehicleMaster() {
  // Load permissions
  const permissions = JSON.parse(localStorage.getItem("Login")) || {};
  const has = (key) => permissions[key] === 1;

  // Define all tabs
  const allTabs = [
    {
      id: "vehicle",
      label: "Vehicle Details",
      component: <VehicleEntry />,
      show: has("VehicleDetails"), // ❗ change to actual permission
    },
    {
      id: "transport",
      label: "Transport Details",
      component: <TransportEntry />,
      show: has("TransportDetails"),
    },
    {
      id: "driver",
      label: "Driver Details",
      component: <DriverEntry />,
      show: has("DriverDetails"),
    },
    {
      id: "flight",
      label: "Flight Details",
      component: <FlightEntry />,
      show: 1, // ❗ change to actual permission
    },
    {
      id: "train",
      label: "Train Details",
      component: <TrainEntry />,
      show: 1, // ❗ change to actual permission
    },
    {
      id: "product",
      label: "Product Details",
      component: <ProductEntry />,
      show: 1, // ❗ change to actual permission
    },
  ];

  // visible tabs only
  const visibleTabs = allTabs.filter((t) => t.show);

  const [activeTab, setActiveTab] = useState(null);

  // Auto-select first visible tab
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

          {/* Tab content */}
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

export default VehicleMaster;
