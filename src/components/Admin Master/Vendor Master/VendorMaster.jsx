import React, { useState, Suspense } from "react";
import './vendormaster.css';
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";

const VendorName = React.lazy(() => import('./VendorName'));
const VendorRate = React.lazy(() => import('./VendorRate'));
const VendorFuel = React.lazy(() => import('./VendorFuel'));
const VendorGst = React.lazy(() => import('./VendorGst'));


function VendorMaster() {

    const [activeTab, setActiveTab] = useState('zone');

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
                        <label htmlFor="zone" className="zone">Vendor Name</label>
                        <label htmlFor="multiple" className="multiple">Vendor Rate</label>
                        <label htmlFor="state" className="state">Vendor Charges</label>
                        <label htmlFor="country" className="country">Vendor Gst Master</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'zone' && <VendorName />}
                            {activeTab === 'multiple' && <VendorRate />}
                            {activeTab === 'state' && <VendorFuel />}
                            {activeTab === 'country' && <VendorGst />}
                        </Suspense>
                    </section>
                </div>
                <Footer />
            </div>

        </>
    )
}

export default VendorMaster;