import React, { useState } from 'react'
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import Footer from '../../Components-2/Footer';
import GenerateInvoice from './GenerateInvoice';
import ViewInvoice from './ViewInvoice';
import PerformanceBill from './PerformanceBill';
import PendingInvoice from './PendingInvoice';
import "./permonce.css"
import ViewPerforma from './ViewPerforma';
import { useLocation } from 'react-router-dom';

function Invoice() {
    const location=useLocation();
    const [activeTab, setActiveTab] = useState(location?.state?.tab ||'state');

    const handleChange = (event) => {
        setActiveTab(event.target.id);
    };


    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">

                    <div className="container">
                        <nav>
                            <label onClick={() => setActiveTab("state")}>Pending Invoice</label>
                            <label onClick={() => setActiveTab("zone")}>Generate Invoice</label>
                            <label onClick={() => setActiveTab("multiple")}>View Invoice</label>
                            <label onClick={() => setActiveTab("country")}>Performance Invoice</label>
                            <label onClick={() => setActiveTab("view")}>View Performance Invoice</label>

                            <div
                                className="slider"
                                style={{ left: `${[ "state","zone", "multiple", "country", "view"].indexOf(activeTab) * 20}%` ,width: "20%",}}
                            />
                        </nav>
                    <section>
                        {activeTab === 'state' && <PendingInvoice />}
                        {activeTab === 'zone' && <GenerateInvoice />}
                        {activeTab === 'multiple' && <ViewInvoice />}
                        {activeTab === 'country' && <PerformanceBill />}
                        {activeTab === 'view' && <ViewPerforma />}

                    </section>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Invoice