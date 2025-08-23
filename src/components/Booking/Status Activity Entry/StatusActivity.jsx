import React, { useState } from "react";
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import ManualEntry from "./ManualEntry";
import NewPodEntry from './NewPodEntry'
import ExcelImport from "./ExcelImport"
import ExcelImportBulk from "../Daily Booking/ExcelImportBulk";




function StatusActivity() {

    const [activeTab, setActiveTab] = useState('delivered'); // Default to 'zone'

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
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="undelivered" checked={activeTab === 'undelivered'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="upload" checked={activeTab === 'upload'}
                        onChange={handleChange}/>

                    <nav>
                        <label htmlFor="delivered" className="delivered">Activity Entry</label>
                        <label htmlFor="undelivered" className="undelivered">Activity Import Bulk</label>
                        <label htmlFor="upload" className="upload">Activity Tracking</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className={`content content-1 ${activeTab === 'delivered' ? 'active' : ''}`}>
                            <NewPodEntry />
                        </div>

                        <div className={`content content-2 ${activeTab === 'undelivered' ? 'active' : ''}`}>
                            <ExcelImportBulk/>
                        </div>

                        <div className={`content content-3 ${activeTab === 'upload' ? 'active' : ''}`}>
                            <ExcelImport/>
                        </div>
                    </section>
                </div>
                <Footer />
            </div>

        </>
    );
};

export default StatusActivity;