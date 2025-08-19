import React, { useState, Suspense } from "react";
import './customerlist.css';
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";


const CustomerName = React.lazy(() => import("./CustomerName"));
const ReceiverName = React.lazy(() => import("./ReceiverName"));
const CustomerRate = React.lazy(() => import("./CustomerRate"));
const CustomerVolumetric = React.lazy(() => import("./CustomerVolumetric"));

function CustomerList() {

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
                        <label htmlFor="zone" className="zone">Customer Name</label>
                        <label htmlFor="multiple" className="multiple">Receiver Name</label>
                        <label htmlFor="state" className="state">Customer Rate</label>
                        <label htmlFor="country" className="country">Customer Volumetric</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'zone' && <CustomerName />}
                            {activeTab === 'multiple' && <ReceiverName />}
                            {activeTab === 'state' && <CustomerRate />}
                            {activeTab === 'country' && <CustomerVolumetric />}
                        </Suspense>
                    </section>
                </div>
                <Footer />
            </div>


        </>
    )
}

export default CustomerList;