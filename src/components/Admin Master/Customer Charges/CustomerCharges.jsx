import React, { useState, Suspense, useEffect } from "react";
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";

const ReceiverName = React.lazy(() => import('../CustomerList/ReceiverName'));
const ShipperName = React.lazy(() => import('../CustomerList/ShipperName'));
const ProductWiseGst = React.lazy(() => import('../CustomerList/ProductWiseGst'));

function CustomerCharges() {

    // Load permissions
    const permissions = JSON.parse(localStorage.getItem("Login")) || {};
    const has = (key) => permissions[key] === 1;

    // Define all tabs
    const allTabs = [
        { id: "zone", label: "Consignee Name", component: <ReceiverName />, show: has("ConsineeName") },
        { id: "multiple", label: "Shipper Name", component: <ShipperName />, show: has("ShipperName") },
        { id: "country", label: "GST Charges", component: <ProductWiseGst />, show: has("ModeWiseGst") },
    ];

    // Only allowed tabs
    const visibleTabs = allTabs.filter(t => t.show);

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

                    {/* Hidden radio inputs for CSS compatibility */}
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

                    {/* Navigation */}
                    <nav className="nav">
                        {visibleTabs.map(tab => (
                            <label key={tab.id} htmlFor={tab.id}>
                                {tab.label}
                            </label>
                        ))}

                        {/* Slider movement */}
                        {activeTab && (
                            <div
                                className="slider"
                                style={{
                                    width: `${100 / visibleTabs.length}%`,
                                    left:
                                        `${
                                            visibleTabs.findIndex(t => t.id === activeTab)
                                            * (100 / visibleTabs.length)
                                        }%`
                                }}
                            ></div>
                        )}
                    </nav>

                    {/* Content */}
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {visibleTabs.find(t => t.id === activeTab)?.component}
                        </Suspense>
                    </section>

                </div>
                <Footer />
            </div>
        </>
    );
}

export default CustomerCharges;
