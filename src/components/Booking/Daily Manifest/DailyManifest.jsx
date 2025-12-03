import React, { useState, useEffect } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";

import PendingManifest from "./PendingManifest";
import CreateManifest from "./CreateManifest";
import ViewManifest from "./ViewManifest";
import ForwardingManifest from "./ForwardingManifest";
import { useLocation } from "react-router-dom";

function DailyManifest() {
    const location = useLocation();

    // Get permissions
    const permissions = JSON.parse(localStorage.getItem("Login")) || {};
    const has = (key) => permissions[key] === 1;
    const [activeTab, setActiveTab] = useState(location?.state?.tab || null);

    const tabs = [
        {
            id: "pendingmanifest",
            label: "Pending Manifest",
            component: <PendingManifest />,
            show: has("PendingManifest"),
        },
        {
            id: "createmanifest",
            label: "Outgoing Manifest",
            component: <CreateManifest />,
            show: has("OutgoingManifest"),
        },
        {
            id: "viewmanifest",
            label: "View Manifest",
            component: <ViewManifest />,
            show: has("ViewManifest"),
        },
        {
            id: "forwardingmanifest",
            label: "Bulk Import Manifest",
            component: <ForwardingManifest />,
            show: has("BuilkimportManifest"),
        },
    ];

    // Filter visible tabs
    const visibleTabs = tabs.filter((t) => t.show);

    // Auto-select the first visible tab
      useEffect(() => {
        if (activeTab === null && visibleTabs.length > 0) {
          setActiveTab(visibleTabs[0].id);
        }
      }, [visibleTabs, activeTab]);

    return (
        <>
            <Header />
            <Sidebar1 />

            <div className="main-body" id="main-body">
                <div className="container">

                    {/* TAB HEADERS */}
                    <nav>
                        {visibleTabs.map((tab) => (
                            <label
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                
                            >
                                {tab.label}
                            </label>
                        ))}

                        {/* SLIDER */}
                        {activeTab && visibleTabs.length > 0 &&(
                            <div
                                className="slider"
                                style={{
                                    left: `${visibleTabs.findIndex((t) => t.id === activeTab) * (100 / visibleTabs.length)}%`,
                                    width: `${100 / visibleTabs.length}%`,
                                }}
                            />
                        )}
                    </nav>

                    {/* CONTENT */}
                    <section>
                        {visibleTabs.find((t) => t.id === activeTab)?.component}
                    </section>

                </div>
                <Footer />
            </div>
        </>
    );
}

export default DailyManifest;
