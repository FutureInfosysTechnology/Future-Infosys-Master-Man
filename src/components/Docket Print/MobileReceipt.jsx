import React from 'react'
import Footer from '../../Components-2/Footer';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import logoimg from '../../Assets/Images/AceLogo.jpeg';
import barcode from '../../Assets/Images/barcode-svgrepo-com.png';

function MobileReceipt() {
    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="container" style={{ alignItems: "center", padding: "10px" }}>
                    <div className="container" style={{ border: "1px solid black", width: "45%", padding: "0px" }}>

                        <div style={{ height: "100px", display: "flex", flexDirection: "row" }}>
                            <div style={{ width: "45%", border: "1px solid black" }}>
                                <img src={logoimg} alt="" style={{ height: "100%", width: "100%" }} />
                            </div>
                            <div style={{ width: "55%", border: "1px solid black", alignItems: "center" }}>
                                <div style={{ textAlign: "center" }}>
                                    <p><b style={{ fontSize: "24px" }}>Aventure Cargo Express</b></p>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: "170px", border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <img src={barcode} alt="" style={{ height: "130px", width: "50%" }} />
                            <b style={{ fontSize: "18px" }}>1000000001</b>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", height: "50px" }}>
                            <div style={{ width: "50%", border: "1px solid black", paddingLeft: "5px" }}>
                                <label htmlFor=""><b>Docket No :</b></label>
                                <input type="text" style={{ border: "transparent", width: "50%", height: "50%", marginLeft: "5px" }} />
                            </div>
                            <div style={{ width: "50%", border: "1px solid black", paddingLeft: "5px" }}>
                                <label htmlFor=""><b>Date :</b></label>
                                <input type="text" style={{ border: "transparent", width: "50%", marginLeft: "5px" }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", height: "50px" }}>
                            <div style={{ width: "50%", border: "1px solid black", paddingLeft: "5px" }}>
                                <label htmlFor=""><b>From :</b></label>
                                <input type="text" style={{ border: "transparent", width: "50%", marginLeft: "5px" }} />
                            </div>
                            <div style={{ width: "50%", border: "1px solid black", paddingLeft: "5px" }}>
                                <label htmlFor=""><b>To :</b></label>
                                <input type="text" style={{ border: "transparent", width: "50%", marginLeft: "5px" }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", height: "30px" }}>
                            <div style={{ width: "50%", border: "1px solid black", paddingLeft: "5px" }}>
                                <label htmlFor=""><b>QTY :</b></label>
                                <input type="text" style={{ border: "transparent", width: "50%", marginLeft: "5px" }} />
                            </div>
                            <div style={{ width: "50%", border: "1px solid black", paddingLeft: "5px" }}>
                                <label htmlFor=""><b>Weight :</b></label>
                                <input type="text" style={{ border: "transparent", width: "50%", marginLeft: "5px" }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", height: "230px" }}>
                            <div style={{ width: "50%", border: "1px solid black", paddingLeft: "5px", display: "flex", flexDirection: "column" }}>
                                <div>
                                    <label htmlFor=""><b>Cust/ Shipper :</b></label>
                                    <input type="text" style={{ border: "transparent", width: "100%", marginLeft: "5px", margin:"0px" }} />
                                </div>

                                <div>
                                    <label htmlFor=""><b>Address :</b></label>
                                    <input type="text" style={{ border: "transparent",height:"100%", width: "100%", marginLeft: "5px", margin:"0px" }} />
                                </div>
                            </div>
                            <div style={{ width: "50%", border: "1px solid black", paddingLeft: "5px", display: "flex", flexDirection: "column" }}>
                                <div>
                                    <label htmlFor=""><b>Receiver :</b></label>
                                    <input type="text" style={{ border: "transparent", width: "100%", margin:"0px", marginLeft: "5px" }} />
                                </div>

                                <div>
                                    <label htmlFor=""><b>Receiver Address :</b></label>
                                    <input type="text" style={{ border: "transparent",height:"100%", width: "100%", marginLeft: "5px", margin:"0px" }} />
                                </div>
                            </div>
                        </div>

                        <div style={{height:"15px", fontSize:"10px"}}>
                            <p><b>Gala 7A, Warehouse 6, BGR Logistic Park, Opposite to Dara's Dhaba Bhiwandi</b></p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default MobileReceipt;