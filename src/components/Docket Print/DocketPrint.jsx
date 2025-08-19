import React , {useState} from "react";
import BranchName from "../Admin Master/BranchMaster/BranchName";
import Footer from "../../Components-2/Footer";
import Sidebar1 from "../../Components-2/Sidebar1";
import Header from "../../Components-2/Header/Header";
import DockerPrint1 from "./DockerPrint1";
import DocketPrint2 from "./DocketPrint2";
import DocketPrint3 from "./DocketPrint3";
import BulkImport from "../Booking/Daily Manifest/BulkImport";
import LabelPrinting from "./LabelPrinting";



function DocketPrint() {

    const [activeTab, setActiveTab] = useState('vendor'); // Default to 'zone'

    const handleChange = (event) => {
        setActiveTab(event.target.id);
    };

    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">


                <div className="container-vendor">
                    <input type="radio" name="slider" id="vendor" checked={activeTab === 'vendor'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="vendorrate" checked={activeTab === 'vendorrate'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="vendorfuel" checked={activeTab === 'vendorfuel'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="vendorgst" checked={activeTab === 'vendorgst'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="vendorcharge" checked={activeTab === 'vendorcharge'}
                        onChange={handleChange}/>

                    <nav>
                        <label htmlFor="vendor" className="vendor">Docket Print 1</label>
                        <label htmlFor="vendorrate" className="vendorrate">Docket Print 2</label>
                        <label htmlFor="vendorfuel" className="vendorfuel">Docket Print 3</label>
                        <label htmlFor="vendorgst" className="vendorgst">Label Printing</label>
                        <label htmlFor="vendorcharge" className="vendorcharge">Sticker Printing</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className={`content content-1 ${activeTab === 'vendor' ? 'active' : ''}`}>
                            <DockerPrint1 />
                        </div>

                        <div className={`content content-2 ${activeTab === 'vendorrate' ? 'active' : ''}`}>
                            <DocketPrint2 />
                        </div>

                        <div className={`content content-3 ${activeTab === 'vendorfuel' ? 'active' : ''}`}>
                            <DocketPrint3 />
                        </div>

                        <div className={`content content-4 ${activeTab === 'vendorgst' ? 'active' : ''}`}>
                            <LabelPrinting />
                        </div>

                        <div className={`content content-5 ${activeTab === 'vendorcharge' ? 'active' : ''}`}>
                            <BulkImport />
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default DocketPrint;