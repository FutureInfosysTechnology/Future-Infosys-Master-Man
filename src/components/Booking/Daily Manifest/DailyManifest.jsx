import React, { useState } from "react";
import '../../Admin Master/Vendor Master/vendormaster.css';
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";
import PendingManifest from "./PendingManifest";
import CreateManifest from "./CreateManifest";
import ViewManifest from "./ViewManifest";
import ForwardingManifest from "./ForwardingManifest";
import SendEmail from "./SendEmail";
import { useLocation } from "react-router-dom";
import "./glow.css"



function DailyManifest() {
const location=useLocation();
   const [activeTab, setActiveTab] = useState(location?.state?.tab || "pendingmanifest");
    const handleChange = (event) => {
        setActiveTab(event.target.id);
    };

    return (
        <>

        <Header/>
        <Sidebar1/>

            <div className="main-body" id="main-body">
                <div className="container-vendor" >
                    <input type="radio" name="slider" id="pendingmanifest" checked={activeTab === 'pendingmanifest'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="createmanifest" checked={activeTab === 'createmanifest'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="viewmanifest" checked={activeTab === 'viewmanifest'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="forwardingmanifest" checked={activeTab === 'forwardingmanifest'}
                        onChange={handleChange}/>

                    {/* <input type="radio" name="slider" id="importmanifest" checked={activeTab === 'importmanifest'}
                        onChange={handleChange}/> */}

                    <nav>
                        <label htmlFor="pendingmanifest" className="pendingmanifest">Pending Manifest</label>
                        <label htmlFor="createmanifest" className="createmanifest">Outgoing Manifest</label>
                        <label htmlFor="viewmanifest" className="viewmanifest">View Manifest</label>
                        <label htmlFor="forwardingmanifest" className="forwardingmanifest">Bulk Import Manifest</label>
                        {/* <label htmlFor="importmanifest" className="importmanifest">Bulk Import Manifest</label> */}

                        <div className="slider"></div>
                    </nav>
                    <section>
                        {activeTab === 'pendingmanifest' && <PendingManifest />}
                        {activeTab === 'createmanifest' && <CreateManifest />}
                        {activeTab === 'viewmanifest' && <ViewManifest /> }
                        {activeTab === 'forwardingmanifest' && <ForwardingManifest />}

                        {/* <div className={`content content-5 ${activeTab === 'importmanifest' ? 'active' : ''}`}>
                            <SendEmail />
                        </div> */}
                    </section>
                </div>
                <Footer />
            </div>

        </>
    );
};

export default DailyManifest;