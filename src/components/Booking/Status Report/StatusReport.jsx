import React, { useState } from 'react'
import Footer from '../../../Components-2/Footer';
import Complaint from '../Customer Query/Complaint';
import Header from '../../../Components-2/Header/Header';
import Sidebar1 from '../../../Components-2/Sidebar1';
import CustomerWiseReport from './CustomerWiseReport';
import VendorWiseReport from './VendorWiseReport';

function StatusReport() {

    const [activeTab, setActiveTab] = useState('delivered');

    const handleChange = (event) => {
        setActiveTab(event.target.id);
    };


    return (
        <>
            <Header />
            <Sidebar1 />

            <div className="main-body" id="main-body">
                <div className="container-6">
                    <input type="radio" name="slider" id="delivered" checked={activeTab === 'delivered'}
                        onChange={handleChange} />

                    <input type="radio" name="slider" id="undelivered" checked={activeTab === 'undelivered'}
                        onChange={handleChange} />

                    <input type="radio" name="slider" id="upload" checked={activeTab === 'upload'}
                        onChange={handleChange} />

                    <nav>
                        <label htmlFor="delivered" className="delivered">Customer Wise Report</label>
                        <label htmlFor="undelivered" className="undelivered">Vendor Wise Report</label>
                        <label htmlFor="upload" className="upload">Vehicle Wise Report</label>


                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className={`content content-1 ${activeTab === 'delivered' ? 'active' : ''}`}>
                            <CustomerWiseReport />
                        </div>

                        <div className={`content content-2 ${activeTab === 'undelivered' ? 'active' : ''}`}>
                            <VendorWiseReport />
                        </div>

                        <div className={`content content-3 ${activeTab === 'upload' ? 'active' : ''}`}>
                            <Complaint />
                        </div>

                    </section>
                </div>
                <Footer />
            </div>


        </>
    )
}

export default StatusReport;