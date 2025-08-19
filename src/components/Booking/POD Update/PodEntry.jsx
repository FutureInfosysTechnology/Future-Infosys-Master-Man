import React, { useState } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";
import './podentry.css';
import Undelivered from "./Undelivered";
import BulkUpdate from "./BulkUpdate";
import Delivered from "./Delivered";



function PodEntry() {

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
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="undelivered" checked={activeTab === 'undelivered'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="upload" checked={activeTab === 'upload'}
                        onChange={handleChange}/>

                    <nav>
                        <label htmlFor="delivered" className="delivered">Delivered</label>
                        <label htmlFor="undelivered" className="undelivered">UnDelivered</label>
                        <label htmlFor="upload" className="upload">Bulk Upload (Excel) </label>


                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className={`content content-1 ${activeTab === 'delivered' ? 'active' : ''}`}>
                            <Delivered />
                        </div>

                        <div className={`content content-2 ${activeTab === 'undelivered' ? 'active' : ''}`}>
                            <Undelivered />
                        </div>

                        <div className={`content content-3 ${activeTab === 'upload' ? 'active' : ''}`}>
                            <BulkUpdate />
                        </div>

                    </section>
                </div>
                <Footer />
            </div>


        </>
    )
}

export default PodEntry;