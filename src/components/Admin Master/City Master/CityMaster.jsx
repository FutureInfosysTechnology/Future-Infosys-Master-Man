import React, { useState, Suspense } from "react";
import '../../Tabs/tabs.css';
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";


const DomesticCity = React.lazy(() => import("./DomesticCity"));
const InternationalCity = React.lazy(() => import("./InternationalCity"));
const PinCode = React.lazy(() => import("./PinCode"));

function CityMaster() {

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
                        <label htmlFor="delivered" className="delivered">International City</label>
                        <label htmlFor="undelivered" className="undelivered">Domestic City</label>
                        <label htmlFor="upload" className="upload">Pin Code</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'delivered' && <InternationalCity />}
                            {activeTab === 'undelivered' && <DomesticCity />}
                            {activeTab === 'upload' && <PinCode />}
                        </Suspense>
                    </section>
                </div>
                <Footer />
            </div>



        </>
    );
};

export default CityMaster;