import React, { useState, Suspense } from "react";
import Footer from "../../../Components-2/Footer";
import '../../Booking/POD Update/PodEntry';
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";


const BranchName = React.lazy(() => import("./BranchName"));
const BankName = React.lazy(() => import("./BankName"));
const EmployeeName = React.lazy(() => import("./EmployeeName"));
const ModeMaster = React.lazy(() => import("./ModeMaster"));

function BranchMaster() {

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
                        <label htmlFor="zone" className="zone">Branch Name</label>
                        <label htmlFor="multiple" className="multiple">Mode Master</label>
                        <label htmlFor="state" className="state">Bank Name</label>
                        <label htmlFor="country" className="country">Delivery Boy's Name</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'zone' && <BranchName />}
                            {activeTab === 'multiple' && <ModeMaster />}
                            {activeTab === 'state' && <BankName />}
                            {activeTab === 'country' && <EmployeeName />}
                        </Suspense>
                    </section>
                </div>
                <Footer />
            </div>

        </>
    )
}

export default BranchMaster;