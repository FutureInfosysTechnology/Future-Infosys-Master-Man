import React from 'react'
import Footer from '../../Components-2/Footer';
import Sidebar1 from '../../Components-2/Sidebar1';
import Header from '../../Components-2/Header/Header';
import barcode from '../../Assets/Images/barcode-svgrepo-com.png';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';

function DocketBill() {
    const location = useLocation();
    const navigate = useNavigate();
    const invNo = location?.state?.invoiceNo || "";
    const fromPath = location?.state?.from || "/";
    const handleDownloadPDF = async () => {
        const element = document.querySelector("#pdf");
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 4 }); // high resolution
        const imgData = canvas.toDataURL("image/jpeg", 0.8); // compress to JPEG, quality = 0.8

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

        pdf.save(`Invoice_${invNo}.pdf`);
    };
    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
<div className="container-2" style={{ borderRadius: "0px", height: "40px", border: "none", backgroundColor: "red" }}>

                        <div className="container-2" style={{ borderRadius: "0px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px", alignItems: "center" }}>
                            <button
                                onClick={handleDownloadPDF}
                                style={{ padding: "5px 5px", borderRadius: "6px", background: "green", color: "white", border: "none", cursor: "pointer" }}
                            >
                                Download
                            </button>
                            <button
                                onClick={() => window.print()}
                                style={{ padding: "5px 10px", borderRadius: "6px", background: "red", color: "white", border: "none", cursor: "pointer" }}
                            >
                                Print
                            </button>
                            <button
                                onClick={() => navigate(fromPath, { state: { tab: "viewmanifest" } })}
                                style={{ padding: "5px 10px", borderRadius: "6px", background: "gray", color: "white", border: "none", cursor: "pointer" }}
                            >
                                Exit
                            </button>
                        </div>
                    </div>
                <div className="container " id='pdf' style={{ alignItems: "center", paddingTop:"0px",margin:"0px"}}>
                    <div style={{ textAlign: "center", fontSize: "22px" }}>
                        <b>DOCKET BILL</b>
                    </div>
                    <div className="container p-0" style={{ border: "1px solid black", padding: "0px",display: "flex", flexDirection: "row" }}>
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
                            <div style={{ height: "40px", textAlign: "center", fontSize: "18px", paddingTop: "5px", border: "1px solid black", borderBottom: "transparent" }}>
                                <b>DOCKET BILL NO</b>
                            </div>
                            <div style={{ height: "40px", textAlign: "center", fontSize: "18px", border: "1px solid black", borderTop: "transparent" }}>
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
                            <div style={{ height: "80px", border: "1px solid black", padding: "5px", paddingLeft: "20px", paddingRight: "20px" ,width: "100%"}}>
                                <img src={barcode} alt="" style={{ height: "70px", width: "100%" }} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", height: "50px" ,width: "100%"}}>
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

                            <div style={{ height: "120px", border: "1px solid black", paddingTop: "20%" }}>
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