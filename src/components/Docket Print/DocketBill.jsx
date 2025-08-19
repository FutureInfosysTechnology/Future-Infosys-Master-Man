import React from 'react'
import Footer from '../../Components-2/Footer';
import Sidebar1 from '../../Components-2/Sidebar1';
import Header from '../../Components-2/Header/Header';
import barcode from '../../Assets/Images/barcode-svgrepo-com.png';

function DocketBill() {
    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="container" style={{ alignItems: "center" }}>
                    <div style={{ textAlign: "center", fontSize: "22px" }}>
                        <b>DOCKET BILL</b>
                    </div>
                    <div className="container" style={{ border: "1px solid black", padding: "0px", display: "flex", flexDirection: "row" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "40%", fontSize: "14px" }}>
                            <div style={{ display: "flex", flexDirection: "row", textAlign: "center", height: "40px" }}>
                                <div style={{ width: "40%", border: "1px solid black", paddingTop: "5px" }}>
                                    <b>SERVICE</b>
                                </div>
                                <div style={{ width: "20%", border: "1px solid black", paddingTop: "5px" }}>
                                    <b>ORIGIN</b>
                                </div>
                                <div style={{ width: "40%", border: "1px solid black", paddingTop: "5px" }}>
                                    <b>DESTINATION</b>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "row", textAlign: "center", height: "40px" }}>
                                <div style={{ width: "40%", border: "1px solid black", paddingTop: "5px" }}>
                                    <label>UK EXPRESS - MUMBAI</label>
                                </div>
                                <div style={{ width: "20%", border: "1px solid black", paddingTop: "5px" }}>
                                    <label>INDIA</label>
                                </div>
                                <div style={{ width: "40%", border: "1px solid black", paddingTop: "5px" }}>
                                    <label>United Kingdom</label>
                                </div>
                            </div>

                            <div style={{ height: "50px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <b>SHIPPER</b>
                                <label htmlFor="">SURESH KUMAR</label>
                            </div>

                            <div style={{ height: "50px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <b>ATTN:NAME/DEPT</b>
                                <label htmlFor=""></label>
                            </div>

                            <div style={{ height: "50px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <b>ADDRESS</b>
                                <label htmlFor="">171 RAMJI FADIYU VASANAPURA</label>
                            </div>

                            <div style={{ height: "50px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <label htmlFor="">VADODARA</label>
                                <label htmlFor="">GUJARAT</label>
                            </div>

                            <div style={{ height: "50px", display: "flex", flexDirection: "row", fontSize: "14px" }}>
                                <div style={{ display: "flex", flexDirection: "column", width: "65%", border: "1px solid black", paddingLeft: "5px", paddingTop: "5px", }}>
                                    <label htmlFor="">ZIP CODE</label>
                                    <label htmlFor="">391770</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", width: "35%", border: "1px solid black", paddingLeft: "5px", paddingTop: "5px", }}>
                                    <label htmlFor="">TEL NO.</label>
                                    <label htmlFor="">+91 8989898989</label>
                                </div>
                            </div>

                            <div style={{ height: "50px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <b>DESCRIPTION AND VALUE OF GOODS :</b>
                                <label htmlFor="">AS PER ATTACHED INVOICE</label>
                            </div>

                            <div style={{ height: "70px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <label htmlFor="" style={{ fontSize: "10px" }}>The Shipper has read,understood and agree's to the standard terms
                                    and conditions of carriage</label>
                                <label htmlFor="" style={{ marginTop: "10px" }}>SHIPPER'S SIGN</label>
                            </div>

                            <div style={{ height: "50px", display: "flex", flexDirection: "row", fontSize: "14px" }}>
                                <div style={{ display: "flex", flexDirection: "column", width: "40%", border: "1px solid black", paddingLeft: "5px", paddingTop: "5px", }}>
                                    <label htmlFor="">RECEIVED BY EXBOX</label>
                                    <label htmlFor="">DATE: 16-04-2024</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", width: "60%", border: "1px solid black", paddingLeft: "5px", paddingTop: "5px", }}>
                                    <label htmlFor="">REFERENCE NO.</label>
                                </div>
                            </div>
                        </div>


                        <div style={{ display: "flex", flexDirection: "column", width: "40%" }}>
                            <div style={{ height: "40px", textAlign: "center", fontSize: "18px", paddingTop: "5px", border:"1px solid black", borderBottom:"transparent" }}>
                                <b>DOCKET BILL NO</b>
                            </div>
                            <div style={{ height: "40px", textAlign: "center", fontSize: "18px", border:"1px solid black", borderTop:"transparent" }}>
                                <b>729834</b>
                            </div>

                            <div style={{ height: "50px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <b>RECEIVER</b>
                                <label htmlFor="">RAMESH KUMAR</label>
                            </div>

                            <div style={{ height: "50px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <b>ATTN:NAME/DEPT</b>
                                <label htmlFor=""></label>
                            </div>

                            <div style={{ height: "50px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <b>ADDRESS</b>
                                <label htmlFor="">480 A - KATHERING ROAD LONDON</label>
                            </div>

                            <div style={{ height: "50px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <label htmlFor="">LONDON</label>
                                <label htmlFor="">UK</label>
                            </div>

                            <div style={{ height: "50px", display: "flex", flexDirection: "row", fontSize: "14px" }}>
                                <div style={{ display: "flex", flexDirection: "column", width: "65%", border: "1px solid black", paddingLeft: "5px", paddingTop: "5px", }}>
                                    <label htmlFor="">ZIP CODE</label>
                                    <label htmlFor="">E78DP</label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", width: "35%", border: "1px solid black", paddingLeft: "5px", paddingTop: "5px", }}>
                                    <label htmlFor="">TEL NO.</label>
                                    <label htmlFor="">+447 (44) 84-97-197</label>
                                </div>
                            </div>

                            <div style={{ height: "50px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <label htmlFor="">ACCOUNT: SUB</label>
                                <b>SUBHODH</b>
                            </div>

                            <div style={{ height: "70px", paddingLeft: "5px", paddingTop: "5px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "14px" }}>
                                <label htmlFor="" style={{ fontSize: "10px" }}>RECEIVED IN GOOD ORDER AND CONDITION</label>
                                <label htmlFor="" style={{ marginTop: "10px" }}>RECEVER'S SIGN</label>
                            </div>

                            <div style={{ height: "50px", display: "flex", flexDirection: "row", fontSize: "14px" }}>
                                <div style={{ display: "flex", flexDirection: "column", width: "50%", border: "1px solid black", paddingLeft: "5px", paddingTop: "5px", }}>
                                    <label htmlFor="">MANIFEST COPY </label>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", width: "50%", border: "1px solid black", paddingLeft: "5px", paddingTop: "5px", }}>
                                    <label htmlFor="">DATE & TIME</label>
                                </div>
                            </div>
                        </div>


                        <div style={{ display: "flex", flexDirection: "column", width: "20%", textAlign: "center", fontSize: "14px" }}>
                            <div style={{ height: "80px", border: "1px solid black", padding: "5px", paddingLeft: "20px", paddingRight: "20px" }}>
                                <img src={barcode} alt="" style={{ height: "70px", width: "100%" }} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", height: "50px" }}>
                                <div style={{ height: "50%", border: "1px solid black" }}>
                                    <b>NO OF BOX</b>
                                </div>
                                <div style={{ height: "50%", border: "1px solid black" }}>
                                    <label htmlFor="">1</label>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", height: "50px" }}>
                                <div style={{ height: "50%", border: "1px solid black" }}>
                                    <b>TYPE</b>
                                </div>
                                <div style={{ height: "50%", border: "1px solid black" }}>
                                    <label htmlFor="">NON DOC</label>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", height: "50px" }}>
                                <div style={{ height: "50%", border: "1px solid black" }}>
                                    <b>CHARGEABLE WEIGHT</b>
                                </div>
                                <div style={{ height: "50%", border: "1px solid black" }}>
                                    <label htmlFor="">13.000 KG</label>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", height: "50px" }}>
                                <div style={{ height: "50%", border: "1px solid black" }}>
                                    <b>ACTUAL WEIGHT</b>
                                </div>
                                <div style={{ height: "50%", border: "1px solid black" }}>
                                    <label htmlFor="">12.9 KG</label>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", height: "50px" }}>
                                <div style={{ height: "50%", border: "1px solid black" }}>
                                    <b>VOLUMETRIC WEIGHT</b>
                                </div>
                                <div style={{ height: "50%", border: "1px solid black" }}>
                                    <label htmlFor="">12.985 KG</label>
                                </div>
                            </div>

                            <div style={{ height: "50px", border: "1px solid black" }}>
                                <b>BOX DIMENTIONS</b>
                            </div>

                            <div style={{ height: "120px", border: "1px solid black", paddingTop:"20%" }}>
                                <label htmlFor="">35 x 35 x 53 ( 12.985 KG )</label>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default DocketBill;