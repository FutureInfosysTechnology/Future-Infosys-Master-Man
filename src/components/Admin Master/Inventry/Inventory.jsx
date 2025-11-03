import React, { useState, Suspense } from "react";
import Footer from "../../../Components-2/Footer";
import '../../Tabs/tabs.css';
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";


const StockEntry = React.lazy(() => import('./StockEntry'));
const EmployeeStock = React.lazy(() => import('./EmployeeStock'));
const BranchStock = React.lazy(() => import('./BranchStock'));
const CustomerStock = React.lazy(() => import('./CustomerStock'));

function Inventory() {

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
                        <label htmlFor="zone" className="zone">Stock Details</label>
                        <label htmlFor="multiple" className="multiple">Branch Stock Details</label>
                        <label htmlFor="state" className="state">Customer Stock Details</label>
                        <label htmlFor="country" className="country">Employee Stock Details</label>
                        <div className="slider"></div>
                    </nav>
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'zone' && <StockEntry />}
                            {activeTab === 'multiple' && <BranchStock />}
                            {activeTab === 'state' && <CustomerStock />}
                            {activeTab === 'country' && <EmployeeStock />}
                        </Suspense>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Inventory;