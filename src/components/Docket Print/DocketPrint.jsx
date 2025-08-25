import React , {useState} from "react";
import BranchName from "../Admin Master/BranchMaster/BranchName";
import Footer from "../../Components-2/Footer";
import Sidebar1 from "../../Components-2/Sidebar1";
import Header from "../../Components-2/Header/Header";
import DockerPrint1 from "./DockerPrint1";
import DocketPrint2 from "./DocketPrint2";
import DocketPrint3 from "./DocketPrint3";
import DocketPrint4 from "./DocketPrint4";
import BulkImport from "../Booking/Daily Manifest/BulkImport";
import LabelPrinting from "./LabelPrinting";
import "./DocketPrint.css"


function DocketPrint() {

    const [activeTab, setActiveTab] = useState('print1'); // Default to 'zone'

    const handleChange = (event) => {
        setActiveTab(event.target.id);
    };

    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">


                <div className="container-vendor">
                    <input type="radio" name="slider" id="print1" checked={activeTab === 'print1'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="print2" checked={activeTab === 'print2'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="print3" checked={activeTab === 'print3'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="print4" checked={activeTab === 'print4'}
                        onChange={handleChange}/>

                    <input type="radio" name="slider" id="label" checked={activeTab === 'label'}
                        onChange={handleChange}/>
                    <input type="radio" name="slider" id="sticker" checked={activeTab === 'sticker'}
                        onChange={handleChange}/>

                    <nav>
                        <label htmlFor="print1" className="print1">Docket Print 1</label>
                        <label htmlFor="print2" className="print2">Docket Print 2</label>
                        <label htmlFor="print3" className="print3">Docket Print 3</label>
                        <label htmlFor="print4" className="print4">Docket Print 4</label>
                        <label htmlFor="label" className="label">Label Printing</label>
                        <label htmlFor="sticker" className="sticker">Sticker Printing</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className={`content content-1 ${activeTab === 'print1' ? 'active' : ''}`}>
                            <DockerPrint1 />
                        </div>

                        <div className={`content content-2 ${activeTab === 'print2' ? 'active' : ''}`}>
                            <DocketPrint2 />
                        </div>

                        <div className={`content content-3 ${activeTab === 'print3' ? 'active' : ''}`}>
                            <DocketPrint3 />
                        </div>

                        <div className={`content content-4 ${activeTab === 'print4' ? 'active' : ''}`}>
                            <DocketPrint4 />
                        </div>

                        <div className={`content content-5 ${activeTab === 'label' ? 'active' : ''}`}>
                            <LabelPrinting />
                        </div>

                        <div className={`content content-6 ${activeTab === 'sticker' ? 'active' : ''}`}>
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