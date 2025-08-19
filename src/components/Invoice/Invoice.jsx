import React, { useState } from 'react'
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import Footer from '../../Components-2/Footer';
import GenerateInvoice from './GenerateInvoice';
import ViewInvoice from './ViewInvoice';
import PerformanceBill from './PerformanceBill';



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
                    <input type="radio" name="slider" id="zone" checked={activeTab === 'zone'}
                        onChange={handleChange} />

                    <input type="radio" name="slider" id="multiple" checked={activeTab === 'multiple'}
                        onChange={handleChange} />

                    <input type="radio" name="slider" id="state" checked={activeTab === 'state'}
                        onChange={handleChange} />

                    <input type="radio" name="slider" id="country" checked={activeTab === 'country'}
                        onChange={handleChange} />

                    <nav>
                        <label htmlFor="zone" className="zone">Generate Invoice</label>
                        <label htmlFor="multiple" className="multiple">View Invoice</label>
                        <label htmlFor="state" className="state">Pending Invoice</label>
                        <label htmlFor="country" className="country">Performance Invoice</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className={`content content-1 ${activeTab === 'zone' ? 'active' : ''}`}>
                            <GenerateInvoice />
                        </div>

                        <div className={`content content-2 ${activeTab === 'multiple' ? 'active' : ''}`}>
                            <ViewInvoice />
                        </div>

                        <div className={`content content-3 ${activeTab === 'state' ? 'active' : ''}`}>
                            <ViewInvoice />
                        </div>

                        <div className={`content content-4 ${activeTab === 'country' ? 'active' : ''}`}>
                            <PerformanceBill />
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Invoice