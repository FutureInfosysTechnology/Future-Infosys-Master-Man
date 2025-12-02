import React, { useState, Suspense, useEffect } from "react";
import '../../Tabs/tabs.css';
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";

const DomesticCity = React.lazy(() => import("./DomesticCity"));
const InternationalCity = React.lazy(() => import("./InternationalCity"));
const PinCode = React.lazy(() => import("./PinCode"));

function CityMaster() {

    const permissions = JSON.parse(localStorage.getItem("Login")) || {};
    const has = (key) => permissions[key] === 1;

    const tabs = [
        { id: "delivered", label: "International City", component: <InternationalCity />, show: has("InterNationalCity") },
        { id: "undelivered", label: "Domestic City", component: <DomesticCity />, show: has("DomesticCity") },
        { id: "upload", label: "Pin Code", component: <PinCode />, show: has("PincodeList") }
    ];

    const visibleTabs = tabs.filter(t => t.show);

    const [activeTab, setActiveTab] = useState(null);

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
                <div className="container-6">

                    <nav>
                        {visibleTabs.map((tab) => (
                            <label
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </label>
                        ))}

                        {activeTab && (
                            <div
                                className="slider"
                                style={{
                                    width: `${100 / visibleTabs.length}%`,
                                    left: `${visibleTabs.findIndex(t => t.id === activeTab) * (100 / visibleTabs.length)}%`
                                }}
                            />
                        )}
                    </nav>

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

export default CityMaster;
