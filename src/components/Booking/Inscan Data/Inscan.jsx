import React, { useState } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";
import ScanbyAirway from "./ScanbyAirway";
import ScanbyManifest from "./ScanbyManifest";



function Inscan() {

    const [activeTab, setActiveTab] = useState('mode'); // Default to 'zone'

    const handleChange = (event) => {
        setActiveTab(event.target.id);
    };

    return (
        <>

            <Header />
            <Sidebar1 />

            <div className="main-body" id="main-body">
                <div className="container-transport">
                    <input type="radio" name="slider" id="mode" checked={activeTab === 'mode'}
                        onChange={handleChange}/>
                    <input type="radio" name="slider" id="product" checked={activeTab === 'product'}
                        onChange={handleChange}/>

                    <nav>
                        <label htmlFor="mode" className="mode">Scan by Docket no</label>
                        <label htmlFor="product" className="product">Inscan Process View</label>

                        <div className="slider"></div>
                    </nav>
                    <section >
                        <div className={`content content-1 ${activeTab === 'mode' ? 'active' : ''}`}>
                            <ScanbyAirway />
                        </div>

                        <div className={`content content-2 ${activeTab === 'product' ? 'active' : ''}`}>
                            <ScanbyManifest />
                        </div>
                    </section>
                </div>
                <Footer />
            </div>

        </>
    );
};

export default Inscan;