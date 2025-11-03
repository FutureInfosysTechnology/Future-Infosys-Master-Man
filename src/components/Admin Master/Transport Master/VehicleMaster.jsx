import React, { useState, Suspense } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";

const VehicleEntry = React.lazy(() => import('./VehicleEntry'));
const TransportEntry = React.lazy(() => import('./TransportEntry'));
const DriverEntry = React.lazy(() => import('./DriverEntry'));


function VehicleMaster() {

    const [activeTab, setActiveTab] = useState('delivered');

    const handleChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>

            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="container-6">
                    <input type="radio" name="slider" id="delivered" checked={activeTab === 'delivered'}
                        onChange={() => handleChange('delivered')} />

                    <input type="radio" name="slider" id="undelivered" checked={activeTab === 'undelivered'}
                        onChange={() => handleChange('undelivered')} />

                    <input type="radio" name="slider" id="upload" checked={activeTab === 'upload'}
                        onChange={() => handleChange('upload')} />

                    <nav>
                        <label htmlFor="delivered" className="delivered">Vehicle Details</label>
                        <label htmlFor="undelivered" className="undelivered">Transport Details</label>
                        <label htmlFor="upload" className="upload">Driver Details</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'delivered' && <VehicleEntry />}
                            {activeTab === 'undelivered' && <TransportEntry />}
                            {activeTab === 'upload' && <DriverEntry />}
                        </Suspense>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default VehicleMaster;