import React, { useState, Suspense } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";

const ProductWiseFuel = React.lazy(() => import('../CustomerList/ProductWiseFuel'));
const ProductWiseGst = React.lazy(() => import('../CustomerList/ProductWiseGst'));
const UpdateCustomerRate = React.lazy(() => import('./UpdateCustomerRate'));
const OdaMaster = React.lazy(() => import('./OdaMaster'));

function CustomerCharges() {

    const [activeTab, setActiveTab] = useState('zone'); // Default to 'zone'

    const handleChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">


                <div className="container">
                    <input type="radio" name="slider" id="zone" checked={activeTab === 'zone'}
                        onChange={() => handleChange('zone')} />

                    <input type="radio" name="slider" id="multiple" checked={activeTab === 'multiple'}
                        onChange={() => handleChange('multiple')} />

                    <input type="radio" name="slider" id="state" checked={activeTab === 'state'}
                        onChange={() => handleChange('state')} />

                    <input type="radio" name="slider" id="country" checked={activeTab === 'country'}
                        onChange={() => handleChange('country')} />

                    <nav>
                        <label htmlFor="zone" className="zone">Customer Charges</label>
                        <label htmlFor="multiple" className="multiple">Customer ODA</label>
                        <label htmlFor="state" className="state">Update Customer Rate</label>
                        <label htmlFor="country" className="country">GST Charges</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'zone' && <ProductWiseFuel />}
                            {activeTab === 'multiple' && <OdaMaster />}
                            {activeTab === 'state' && <UpdateCustomerRate />}
                            {activeTab === 'country' && <ProductWiseGst />}
                        </Suspense>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default CustomerCharges;