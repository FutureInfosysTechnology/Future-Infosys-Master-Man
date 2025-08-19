import React, {useState} from 'react'
import Footer from '../../../Components-2/Footer';
import Delivered from '../POD Update/Delivered';
import Sidebar1 from '../../../Components-2/Sidebar1';
import Header from '../../../Components-2/Header/Header';
import Complaint from './Complaint';
import ViewQuery from './ViewQuery';

function CustomerQuery() {

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
                        onChange={handleChange} />

                    <input type="radio" name="slider" id="undelivered" checked={activeTab === 'undelivered'}
                        onChange={handleChange} />

                    <input type="radio" name="slider" id="upload" checked={activeTab === 'upload'}
                        onChange={handleChange} />

                    <nav>
                        <label htmlFor="delivered" className="delivered">Complaint</label>
                        <label htmlFor="undelivered" className="undelivered">View Complaint Status</label>
                        <label htmlFor="upload" className="upload">Querry</label>


                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className={`content content-1 ${activeTab === 'delivered' ? 'active' : ''}`}>
                            <Complaint />
                        </div>

                        <div className={`content content-2 ${activeTab === 'undelivered' ? 'active' : ''}`}>
                            <ViewQuery />
                        </div>

                        <div className={`content content-3 ${activeTab === 'upload' ? 'active' : ''}`}>
                            <Delivered />
                        </div>

                    </section>
                </div>
                <Footer />
            </div>


        </>
    )
}

export default CustomerQuery;