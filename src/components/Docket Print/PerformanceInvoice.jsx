import React from 'react'
import Sidebar1 from '../../Components-2/Sidebar1';
import Header from '../../Components-2/Header/Header';
import Footer from '../../Components-2/Footer';

function PerformanceInvoice() {
    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="container">
                    <div className="container" style={{ border: "1px solid black", padding: "0px" }}>
                        <div style={{ display: "flex", flexDirection: "row", height: "40px" }}>
                            <div style={{ width: "80%", border: "1px solid black", textAlign: "center", paddingTop: "5px", fontSize: "18px" }}>
                                <b>PERFORMANCE INVOICE</b>
                            </div>

                            <div style={{ border: "1px solid black", width: "20%", textAlign: "end", paddingTop: "5px", paddingRight: "10px" }}>
                                <label htmlFor="">INVOICE NO :</label>
                                <label htmlFor="" style={{ fontSize: "12px", marginLeft: "5px" }}><b>9834</b></label>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", height: "150px", fontSize: "14px" }}>
                            <div style={{ width: "50%", border: "1px solid black", display: "flex", flexDirection: "column", paddingLeft: "5px" }}>
                                <b><u>SHIPPER :</u></b>
                                <b>RAMESH KUMAR</b>
                                <p style={{ margin: "0px" }}>171 RRAMJI FADIYU</p>
                                <p style={{ margin: "0px" }}>VASANAPURA</p>
                                <p style={{ margin: "0px" }}>VADODARA (391770) GUJARAT, INDIA</p>
                                <b>AADHAR NO : 1234 5678 1234</b>
                            </div>

                            <div style={{ width: "50%", border: "1px solid black", display: "flex", flexDirection: "column", paddingLeft: "5px" }}>
                                <b><u>RECEIVER :</u></b>
                                <b>SURESH KUMAR</b>
                                <p style={{ margin: "0px" }}>480 A - KATHERING ROAD</p>
                                <p style={{ margin: "0px" }}>LONDON</p>
                                <p style={{ margin: "0px" }}>LONDON, UK - E78DP</p>
                                <b>MOBILE NO : +447 (44) 84-97-197</b>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", height: "90px", fontSize: "14px" }}>
                            <div style={{ width: "50%", border: "1px solid black", display: "flex", flexDirection: "column", paddingLeft: "5px" }}>
                                <label htmlFor="">DATE OF INVOICE : <b>11-01-2025</b></label>
                                <label htmlFor="">DOCKET NO : <b>123456</b></label>
                                <label htmlFor="">COUNTRY OF ORIGIN : <b>INDIA</b></label>
                                <label htmlFor="">FINAL DESTINATION : <b>UNITED KINGDOM</b></label>
                            </div>

                            <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
                                <div style={{ height: "50%", border: "1px solid black", textAlign: "center" }}>
                                    <b>UNSOLICITATED GIFT FOR PEROSNAL USE ONLY NOT FOR
                                        SALE</b>
                                </div>

                                <div style={{ height: "50%", border: "1px solid black", display: "flex", flexDirection: "column", paddingLeft: "5px" }}>
                                    <label htmlFor="">NO OF BOX : <b>1 BOX</b></label>
                                    <label htmlFor="">TOTAL WEIGHT : <b>12.9 KG</b></label>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", height: "600px", fontSize: "14px" }}>
                            <div style={{ width: "50%", border: "1px solid black", display: "flex", flexDirection: "column" }}>
                                <div style={{ height: "40px", textAlign: "center", border: "1px solid black", paddingTop: "5px" }}>
                                    <b>DESCRIPTION OF GOODS</b>
                                </div>
                                <label style={{ paddingLeft: "5px" }} htmlFor=""><b>BOX NO : 1[ A.Wt. 12.900 KG ] [ 35x35x53 CM ]</b></label>
                                <label style={{ paddingLeft: "5px" }} htmlFor="">SNACKS</label>
                                <label style={{ paddingLeft: "5px" }} htmlFor="">SPICES</label>
                                <label style={{ paddingLeft: "5px" }} htmlFor="">BISCUIT</label>
                                <label style={{ paddingLeft: "5px" }} htmlFor="">KHAKHARA WITH CONTAINER </label>
                                <label style={{ paddingLeft: "5px" }} htmlFor="">SNACKS WITH CONTAINER </label>
                            </div>

                            <div style={{ width: "10%", border: "1px solid black", display: "flex", flexDirection: "column", textAlign: "center" }}>
                                <div style={{ height: "40px", border: "1px solid black", paddingTop: "5px" }}>
                                    <b>HSN CODE</b>
                                </div>
                                <label style={{ marginTop: "20px" }} htmlFor="">21069099</label>
                                <label htmlFor="">09103090</label>
                                <label htmlFor="">19053100</label>
                                <label htmlFor="">21069099</label>
                                <label htmlFor="">21039040</label>
                            </div>

                            <div style={{ width: "10%", border: "1px solid black", display: "flex", flexDirection: "column", textAlign: "center" }}>
                                <div style={{ height: "40px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "13px" }}>
                                    <b>QTY</b>
                                    <b>(PCS/PKT)</b>
                                </div>
                                <label style={{ marginTop: "20px" }} htmlFor="">24</label>
                                <label htmlFor="">8</label>
                                <label htmlFor="">4</label>
                                <label htmlFor="">1</label>
                                <label htmlFor="">1</label>
                            </div>

                            <div style={{ width: "15%", border: "1px solid black", display: "flex", flexDirection: "column", textAlign: "end" }}>
                                <div style={{ height: "40px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "13px", paddingRight: "5px" }}>
                                    <b>UNIT VALUE</b>
                                    <b>INR</b>
                                </div>
                                <label style={{ marginTop: "20px", paddingRight: "10px" }} htmlFor="">100.00</label>
                                <label style={{ paddingRight: "10px" }} htmlFor="">100.00</label>
                                <label style={{ paddingRight: "10px" }} htmlFor="">250.00</label>
                                <label style={{ paddingRight: "10px" }} htmlFor="">150.00</label>
                                <label style={{ paddingRight: "10px" }} htmlFor="">100.00</label>
                            </div>

                            <div style={{ width: "15%", border: "1px solid black", display: "flex", flexDirection: "column", textAlign: "end" }}>
                                <div style={{ height: "40px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "13px", paddingRight: "5px" }}>
                                    <b>TOTAL</b>
                                    <b>INR</b>
                                </div>
                                <label style={{ marginTop: "20px", paddingRight: "10px" }} htmlFor="">2400.00</label>
                                <label style={{ paddingRight: "10px" }} htmlFor="">800.00</label>
                                <label style={{ paddingRight: "10px" }} htmlFor="">100.00</label>
                                <label style={{ paddingRight: "10px" }} htmlFor="">150.00</label>
                                <label style={{ paddingRight: "10px" }} htmlFor="">100.00</label>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", height: "30px" }}>
                            <div style={{ width: "70%", border: "1px solid black", fontSize: "12px", paddingTop: "5px", paddingLeft: "5px" }}>
                                <p style={{ margin: "0px" }}>INR THREE THOUSAND SIX HUNDRED ONLY</p>
                            </div>

                            <div style={{ width: "15%", border: "1px solid black", textAlign: "end", paddingRight: "10px" }}>
                                <b>TOTAL(INR)</b>
                            </div>

                            <div style={{ width: "15%", border: "1px solid black", textAlign: "end", paddingRight: "10px" }}>
                                <b>4500.00</b>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", height: "60px", fontSize: "14px" }}>
                            <div style={{ width: "70%", border: "1px solid black", paddingLeft: "5px" }}>
                                <p style={{ margin: "0px" }}>WE HERE BY CONFIRM THAT THE PARCEL DOES NOT INVOLVE ANY COMMERCIAL TRANSACTION. THE VALUE IS DECLARED FOR CUSTOMS PURPOSE ONLY.</p>
                            </div>

                            <div style={{ width: "30%", border: "1px solid black", textAlign: "end", paddingRight: "10px" }}>
                                <p style={{ marginBottom: "15px" }}>For, <b>RAMESH KUMAR</b></p>
                                <b>PREPAID BY</b>
                            </div>
                        </div>

                        <div style={{ textAlign: "center", padding: "5px", fontSize: "12px", height: "30px" }}>
                            <label htmlFor="">THIS IS A COMPUTER GENERATED INVOICE</label>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default PerformanceInvoice;