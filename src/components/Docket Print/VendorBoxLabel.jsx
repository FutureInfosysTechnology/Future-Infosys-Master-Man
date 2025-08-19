import React from 'react'
import Footer from '../../Components-2/Footer';
import Sidebar1 from '../../Components-2/Sidebar1';
import Header from '../../Components-2/Header/Header';
import barcode from '../../Assets/Images/barcode-svgrepo-com.png';

function VendorBoxLabel() {
    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="container">
                    <div className="container" style={{ border: "1px solid black", padding: "0px" }}>
                        <div style={{ display: "flex", flexDirection: "row", fontSize: "14px" }}>
                            <div style={{ width: "80%", display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", flexDirection: "column", border: "1px solid silver", alignItems: "center", height: "90px" }}>
                                    <label htmlFor="">DOCKET NUMBER <b>A1139473</b></label>
                                    <img src={barcode} alt="" style={{ height: "60px", width: "200px" }} />
                                </div>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ display: "flex", flexDirection: "row", width: "50%", textAlign: "center" }}>
                                        <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
                                            <b style={{ border: "1px solid silver" }}>ACCOUNT NUMBER</b>
                                            <label style={{ border: "1px solid silver" }} htmlFor="">S026</label>
                                        </div>

                                        <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
                                            <b style={{ border: "1px solid silver" }}>CUSTOMER</b>
                                            <label style={{ border: "1px solid silver" }} htmlFor="">FUTURE INFOSYS</label>
                                        </div>

                                        <div style={{ width: "20%", display: "flex", flexDirection: "column" }}>
                                            <b style={{ border: "1px solid silver" }}>ORIGIN</b>
                                            <label style={{ border: "1px solid silver" }} htmlFor="">INDIA</label>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "row", width: "50%", textAlign: "center" }}>
                                        <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
                                            <b style={{ border: "1px solid silver" }}>DESTINATION</b>
                                            <b style={{ border: "1px solid silver" }}>UNITED KINGDOM</b>
                                        </div>

                                        <div style={{ width: "20%", display: "flex", flexDirection: "column" }}>
                                            <b style={{ border: "1px solid silver" }}>QTY</b>
                                            <label style={{ border: "1px solid silver" }} htmlFor="">1</label>
                                        </div>

                                        <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
                                            <b style={{ border: "1px solid silver" }}>SERVICE</b>
                                            <label style={{ border: "1px solid silver" }} htmlFor="">OM_SELF_DELHI</label>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }}>SENDER'S COMPANY</b>
                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }} htmlFor="">SURESH KUMAR</label>
                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }}>SENDER'S NAME</b>
                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }} htmlFor="">SURESH KUMAR</label>
                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }}>ADDRESS</b>
                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", height: "50px" }} htmlFor="">25/3/182 SHASHTRI NAGAR, WESTERN EXPRESS HIGWAY,
                                            VILE PARLE EAST
                                        </label>
                                        <div style={{ display: "flex", flexDirection: "row", textAlign: "center" }}>
                                            <div style={{ width: "50%", border: "1px solid silver", height: "30px" }}>
                                                <b>PIN CODE :</b> <label htmlFor="">400099</label>
                                            </div>

                                            <div style={{ width: "50%", border: "1px solid silver", height: "30px" }}>
                                                <b>MOBILE NO :</b> <label htmlFor="">9898989898</label>
                                            </div>
                                        </div>
                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }} htmlFor="">MUMBAI, MAHARASHTRA, INDIA</label>
                                        <div style={{ display: "flex", flexDirection: "column", height: "60px", border: "1px solid silver", paddingLeft: "5px" }}>
                                            <b>DESCRIPTION OF GOODS</b>
                                            <label htmlFor="" style={{ marginTop: "7px" }}>CLOTH COVER</label>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }}>RECIPIENT'S COMPANY</b>
                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }} htmlFor="">RAMESH KUMAR</label>
                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }}>RECIPIENT'S NAME</b>
                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }} htmlFor="">RAMESH KUMAR</label>
                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }}>ADDRESS</b>
                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", height: "50px" }} htmlFor="">9 ELMSTEAD ROAD, SALZBURG</label>

                                        <div style={{ display: "flex", flexDirection: "row", textAlign: "center" }}>
                                            <div style={{ width: "50%", border: "1px solid silver", height: "30px" }}>
                                                <b>PIN CODE :</b> <label htmlFor="">400099</label>
                                            </div>

                                            <div style={{ width: "50%", border: "1px solid silver", height: "30px" }}>
                                                <b>MOBILE NO :</b> <label htmlFor="">9898989898</label>
                                            </div>
                                        </div>

                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }} htmlFor="">LONDON, UK, UNITED KINGDOM</label>

                                        <div style={{ display: "flex", flexDirection: "row", height: "60px", textAlign: "center" }}>
                                            <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
                                                <b style={{ border: "1px solid silver", height: "30px" }}>INTERNATIONAL</b>
                                                <label style={{ border: "1px solid silver", height: "30px" }} htmlFor="">NON-DOX</label>
                                            </div>

                                            <div style={{ display: "flex", flexDirection: "column", width: "35%", border: "1px solid silver" }}>
                                                <b style={{ height: "30px" }}>BOOKING DATE</b>
                                                <label style={{ height: "30px" }} htmlFor="">13/01/2025</label>
                                            </div>

                                            <div style={{ display: "flex", flexDirection: "column", width: "35%", border: "1px solid silver" }}>
                                                <b style={{ height: "30px" }}>INSURANCE</b>
                                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                    <input type="checkbox" />
                                                    <label htmlFor="YES" style={{ marginLeft: "3px" }}>YES</label>
                                                    <input type="checkbox" style={{ marginLeft: "10px" }} />
                                                    <label htmlFor="NO" style={{ marginLeft: "3px" }}>NO</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ display: "flex", flexDirection: "column", width: "30%", border: "1px solid silver", paddingLeft: "5px" }}>
                                        <b>SHIPPER AGREEMENT</b>
                                        <label htmlFor="">Shipper agrees to OM International
                                            Courier Cargo Ser.... standard terms
                                            and conditions of carriage.</label>
                                        <b style={{ marginTop: "5px", marginBottom: "5px" }}>SHIPPER'S SIGNATURE</b>
                                        <b>BOOKING DATE</b>
                                        <label htmlFor="">13/01/2025</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "40%", border: "1px solid silver", paddingLeft: "5px", alignItems: "center" }}>
                                        <label htmlFor="" style={{ marginTop: "10px", fontSize: "18px" }}>PARCEL NUMBER</label>
                                        <img src={barcode} alt="" style={{ height: "60px", width: "200px", marginTop: "10px" }} />
                                        <b style={{ fontSize: "24px" }}>A113947301</b>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "30%", border: "1px solid silver", paddingLeft: "5px" }}>
                                        <b>Received in good condition</b>
                                        <b style={{ marginTop: "20px", marginBottom: "20px" }}>NAME</b>
                                        <b>SIGN</b>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: "20%", textAlign: "center", display: "flex", flexDirection: "column" }}>
                                <div style={{ height: "90px", border: "1px solid silver", paddingTop: "10%", fontSize: "30px" }}>
                                    <b>1/1</b>
                                </div>

                                <b style={{ border: "1px solid silver" }}>Box Weight</b>
                                <b style={{ border: "1px solid silver" }}>17.40</b>
                                <b style={{ border: "1px solid silver", height: "30px" }}>DIMS IN CM</b>
                                <b style={{ border: "1px solid silver", height: "30px" }}>59*34*41</b>
                                <b style={{ border: "1px solid silver", height: "30px" }}>BOX VOL WT</b>
                                <b style={{ border: "1px solid silver", height: "30px" }}>16.45</b>
                                <b style={{ border: "1px solid silver", height: "20px" }}>ACTUAL WEIGHT</b>
                                <b style={{ border: "1px solid silver", height: "20px" }}>17.40</b>
                                <b style={{ border: "1px solid silver", height: "20px" }}>CHARGEABLE WT.</b>
                                <b style={{ border: "1px solid silver", height: "20px" }}>18.00</b>
                                <b style={{ border: "1px solid silver", height: "30px" }}>PAYMENT METHOD</b>
                                <b style={{ border: "1px solid silver", height: "30px" }}>CREDIT</b>
                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>FREIGHT :</b>
                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>OTHER :</b>
                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>CGST @ :</b>
                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>SGST @ :</b>
                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>IGST @ :</b>
                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>TOTAL :</b>
                                <b style={{ border: "1px solid silver", height: "39px", textAlign: "start", paddingLeft: "5px" }}>REF NO.: 93163819 :</b>
                            </div>
                        </div>

                        <div style={{ height: "70px", fontSize: "8px", display: "flex", flexDirection: "column", border: "1px solid black", paddingLeft: "5px" }}>
                            <b>TERMS & CONDITIONS :</b>
                            <b>1. NO CLAIMS WOULD BE ENTERTAINED FOR ANY DAMAGE DURING TRANSIT & DELAY IN DELIVERY DUE TO ANY REASON</b>
                            <b>2. MAXIMUM CLAIMS FOR LOSS OF PARCEL WOULD BE USD 50 UPTO 10 KGS & USD 100 ABOVE 10 KGS OR THE DECLARED VALUE WHICHEVER IS LOWER. </b>
                            <b>3. THIS AWB IS FOR THE ACCOUNT HOLDER AND IT IS NOT TRANSFERABLE.THIS RECEIPT DOES NOT IMPLY WE HAVE PHYSICALLY RECEIVED THE PARCEL IN OUR HUB</b>
                            <b>*** SUBJECT TO MUMBAI JURISDICTION***</b>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default VendorBoxLabel;