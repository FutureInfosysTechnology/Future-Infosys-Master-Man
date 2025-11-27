import React, { useState, Suspense } from "react";
import '../Tabs/tabs.css';
import Footer from "../../Components-2/Footer";
import Header from "../../Components-2/Header/Header";
import Sidebar1 from "../../Components-2/Sidebar1";


const ZoneMaster = React.lazy(() => import("../Admin Master/Area Control/Zonemaster/Zonemaster"));
const Statemast = React.lazy(() => import("../Admin Master/Area Control/StateMast/Statemast"));
const Countrylist = React.lazy(() => import("../Admin Master/Area Control/CountryMast/Countrylist"));
const MultipleCity = React.lazy(() => import("../Admin Master/Area Control/MultipleCity"));


function Tabs() {


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
                        <label htmlFor="zone" className="zone">City Control</label>
                        <label htmlFor="multiple" className="multiple">International Zone</label>
                        <label htmlFor="state" className="state">State Master</label>
                        <label htmlFor="country" className="country">Country Master</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'zone' && <ZoneMaster />}
                            {activeTab === 'multiple' && <MultipleCity />}
                            {activeTab === 'state' && <Statemast />}
                            {activeTab === 'country' && <Countrylist />}
                        </Suspense>
                    </section>
                </div>
                <Footer />
            </div>

        </>

    );
};

export default Tabs;