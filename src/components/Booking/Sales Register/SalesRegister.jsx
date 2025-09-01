import React, { useState } from 'react';
import Footer from '../../../Components-2/Footer';
import StatementWiseReport from '../Statement/StatementWiseReport';
import Sidebar1 from '../../../Components-2/Sidebar1';
import Header from '../../../Components-2/Header/Header';
import SalesRegisterWiseReport from './SalesRegisterWiseReport';
import ChecklistReport from './ChecklistReport';

function SalesRegister() {

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
                        <label htmlFor="zone" className="zone">Invoice Ledger Report</label>
                        <label htmlFor="multiple" className="multiple">Checklist Report</label>
                        <label htmlFor="state" className="state">Unbuild Report</label>
                        <label htmlFor="country" className="country">Bill View Report</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className={`content content-1 ${activeTab === 'zone' ? 'active' : ''}`}>
                            <SalesRegisterWiseReport />
                        </div>

                        <div className={`content content-2 ${activeTab === 'multiple' ? 'active' : ''}`}>
                            <ChecklistReport />
                        </div>

                        <div className={`content content-3 ${activeTab === 'state' ? 'active' : ''}`}>
                            <StatementWiseReport />
                        </div>

                        <div className={`content content-4 ${activeTab === 'country' ? 'active' : ''}`}>
                            <StatementWiseReport />
                        </div>
                    </section>
                </div>
                <Footer />
            </div>

        </>
    )
}

export default SalesRegister;