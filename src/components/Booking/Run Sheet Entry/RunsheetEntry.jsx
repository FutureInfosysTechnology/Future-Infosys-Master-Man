import React , {useState} from "react";
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import PendingDrs from "./PendingDrs";
import CreateDrs from "./CreateDrs";
import ViewDrs from "./ViewDrs";
import ImportDrs from "./ImportDrs";



function RunsheetEntry() {

    const [activeTab, setActiveTab] = useState('zone'); // Default to 'zone'

    const handleChange = (event) => {
        setActiveTab(event.target.id);
    };


    return (
        <>

        <Header/>
        <Sidebar1/>

            <div className="main-body" id="main-body">


                <div className="container">
                    <input type="radio" name="slider" id="zone" checked={activeTab === 'zone'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="multiple" checked={activeTab === 'multiple'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="state" checked={activeTab === 'state'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="country" checked={activeTab === 'country'}
                        onChange={handleChange}/>

                    <nav>
                        <label htmlFor="zone" className="zone">Delivery Pending</label>
                        <label htmlFor="multiple" className="multiple">Delivery Entry</label>
                        <label htmlFor="state" className="state">View DRS</label>
                        <label htmlFor="country" className="country">Import DRS</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className={`content content-1 ${activeTab === 'zone' ? 'active' : ''}`}>
                            <PendingDrs />
                        </div>

                        <div className={`content content-2 ${activeTab === 'multiple' ? 'active' : ''}`}>
                            <CreateDrs />
                        </div>

                        <div className={`content content-3 ${activeTab === 'state' ? 'active' : ''}`}>
                            <ViewDrs />
                        </div>

                        <div className={`content content-4 ${activeTab === 'country' ? 'active' : ''}`}>
                            <ImportDrs />
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default RunsheetEntry;