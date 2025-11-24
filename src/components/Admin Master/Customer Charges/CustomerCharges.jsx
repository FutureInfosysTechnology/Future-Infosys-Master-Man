import React, { useState, Suspense } from "react";
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";

const ReceiverName = React.lazy(() => import('../CustomerList/ReceiverName'));
const ProductWiseGst = React.lazy(() => import('../CustomerList/ProductWiseGst'));
const ShipperName = React.lazy(() => import('../CustomerList/ShipperName'));

function CustomerCharges() {

    const [activeTab, setActiveTab] = useState('zone');

    // Order of tabs for slider movement
    const tabs = ['zone', 'multiple', 'country'];

    return (
        <>
            <Header />
            <Sidebar1 />

            <div className="main-body" id="main-body">
                <div className="container">

                    {/* Navigation */}
                    <nav className="nav">
                        <label onClick={() => setActiveTab('zone')}>Consignee Name</label>
                        <label onClick={() => setActiveTab('multiple')}>Shipper Name</label>
                        <label onClick={() => setActiveTab('country')}>GST Charges</label>

                        {/* Slider */}
                        <div
                            className="slider"
                            style={{
                                left: `${tabs.indexOf(activeTab) * (100 / tabs.length)}%`,
                                width: `${100 / tabs.length}%`
                            }}
                        ></div>
                    </nav>

                    {/* Tab Content */}
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'zone' && <ReceiverName />}
                            {activeTab === 'multiple' && <ShipperName />}
                            {activeTab === 'country' && <ProductWiseGst />}
                        </Suspense>
                    </section>

                </div>
                <Footer />
            </div>
        </>
    );
}

export default CustomerCharges;
