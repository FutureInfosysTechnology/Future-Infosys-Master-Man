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

function Invoice() {

    const [activeTab, setActiveTab] = useState('zone');

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
                            <label onClick={() => setActiveTab("zone")}>Generate Invoice</label>
                            <label onClick={() => setActiveTab("multiple")}>View Invoice</label>
                            <label onClick={() => setActiveTab("state")}>Pending Invoice</label>
                            <label onClick={() => setActiveTab("country")}>Performance Invoice</label>
                            <label onClick={() => setActiveTab("view")}>View Performance Invoice</label>

                            <div
                                className="slider"
                                style={{ left: `${["zone", "multiple", "state", "country", "view"].indexOf(activeTab) * 20}%` ,width: "20%",}}
                            />
                        </nav>
                    <section>
                        {activeTab === 'zone' && <GenerateInvoice />}
                        {activeTab === 'multiple' && <ViewInvoice />}
                        {activeTab === 'state' && <PendingInvoice />}
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