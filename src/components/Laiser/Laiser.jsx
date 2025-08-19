import React , {useState} from "react";
import Header from "../../Components-2/Header/Header";
import Sidebar1 from "../../Components-2/Sidebar1";
import Footer from "../../Components-2/Footer";
import OrderEntry from "./OrderEntry";
import PaymentEntry from "./PaymentEntry";
import ProductionEntry from "./ProductionEntry";
import PaymentReceived from "./PaymentReceived";



function Laiser() {

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
                        <label htmlFor="delivered" className="delivered">Payment Received Entry</label>
                        <label htmlFor="undelivered" className="undelivered">Pay Out Standing</label>
                        <label htmlFor="upload" className="upload">Credit Note</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className={`content content-1 ${activeTab === 'delivered' ? 'active' : ''}`}>
                            <PaymentReceived/>
                        </div>

                        <div className={`content content-2 ${activeTab === 'undelivered' ? 'active' : ''}`}>
                            <PaymentEntry/>
                        </div>

                        <div className={`content content-3 ${activeTab === 'upload' ? 'active' : ''}`}>
                            <ProductionEntry/>
                        </div>
                    </section>
                </div>
                <Footer />
            </div>

        </>
    );
};

export default Laiser;