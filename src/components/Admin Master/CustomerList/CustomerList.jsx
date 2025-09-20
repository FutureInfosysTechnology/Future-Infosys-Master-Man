import React, { useState, Suspense } from "react";
import './customerlist.css';
import './list.css';
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";

const CustomerName = React.lazy(() => import("./CustomerName"));
const ReceiverName = React.lazy(() => import("./ReceiverName"));
const ShipperName = React.lazy(() => import("./ShipperName"));
const CustomerRate = React.lazy(() => import("./CustomerRate"));
const CustomerVolumetric = React.lazy(() => import("./CustomerVolumetric"));

function CustomerList() {
    const [activeTab, setActiveTab] = useState('zone');
    const tabs = ['zone', 'multiple', 'shipper', 'state', 'country'];

    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="container">
                    {/* Navigation Labels */}
                    <nav className="nav">
                        <label onClick={() => setActiveTab('zone')}>Customer Name</label>
                        <label onClick={() => setActiveTab('multiple')}>Receiver Name</label>
                        <label onClick={() => setActiveTab('shipper')}>Shipper Name</label>
                        <label onClick={() => setActiveTab('state')}>Customer Rate</label>
                        <label onClick={() => setActiveTab('country')}>Customer Volumetric</label>

                        {/* Slider */}
                        <div
                            className="slider"
                            style={{ left: `${tabs.indexOf(activeTab) * 19}%` }}
                        ></div>
                    </nav>

                    {/* Tab Content */}
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'zone' && <CustomerName />}
                            {activeTab === 'multiple' && <ReceiverName />}
                            {activeTab === 'shipper' && <ShipperName />}
                            {activeTab === 'state' && <CustomerRate />}
                            {activeTab === 'country' && <CustomerVolumetric />}
                        </Suspense>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default CustomerList;
