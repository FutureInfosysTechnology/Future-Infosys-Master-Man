import React, { useState, useEffect } from 'react';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';

import logo from '../../Assets/Images/AceLogo.jpeg';
import 'jspdf-autotable';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
import BarCode from "react-barcode";
import { toWords } from "number-to-words";

function VendorBoxLabel() {
    const [getBranch, setGetBranch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);
    console.log(location.state);
    const fromPath = location?.state?.path || "/";
    const tab = location?.state?.tab;
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi(`/Master/getBranch?Branch_Code=${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}`);
                if (response.status === 1) {
                    console.log(response.Data);
                    setGetBranch(response.Data[0]);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        setData(location?.state?.data || []);
        fetchData();
    }, [])
    function numberToIndianCurrency(num) {
        if (!num || isNaN(num)) return "";

        const [rupees, paise] = num.toFixed(2).split(".");

        let result = toWords(Number(rupees))
            .replace(/\b\w/g, (txt) => txt.toUpperCase()) + " Rupees";

        if (Number(paise) > 0) {
            result += " and " + toWords(Number(paise))
                .replace(/\b\w/g, (txt) => txt.toUpperCase()) + " Paise";
        }

        return result + " Only";
    }
    const formateDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date)) return ""; // invalid date
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };
    const handleDownloadPDF = async () => {
        // Select all container elements (each label)
        const containerElements = document.querySelectorAll(".download");

        if (containerElements.length === 0) return;

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
        const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

        for (let i = 0; i < containerElements.length; i++) {
            const element = containerElements[i];

            // Capture one container as a high-quality image
            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
                scrollY: -window.scrollY,
                windowWidth: document.documentElement.scrollWidth,
            });

            const imgData = canvas.toDataURL("image/jpeg", 0.95);

            // Convert px to mm
            const pxToMm = (px) => (px * 25.4) / 96;
            const imgWidthMm = pxToMm(canvas.width);
            const imgHeightMm = pxToMm(canvas.height);
            const imgRatio = imgWidthMm / imgHeightMm;

            // Fit to A4 page with small margins
            let renderWidth = pdfWidth - 10; // 5mm margin each side
            let renderHeight = renderWidth / imgRatio;

            if (renderHeight > pdfHeight - 10) {
                renderHeight = pdfHeight - 10;
                renderWidth = renderHeight * imgRatio;
            }

            const xOffset = (pdfWidth - renderWidth) / 2;
            const yOffset = (pdfHeight - renderHeight) / 2;

            pdf.addImage(imgData, "JPEG", xOffset, yOffset, renderWidth, renderHeight);

            // Add new page except after the last one
            if (i < containerElements.length - 1) pdf.addPage();
        }

        pdf.save("Receipts.pdf");
    };


    return (
        <>
            <style>
                {`
@media print {
  /* Hide everything except docket container */
  body * {
    visibility: hidden;
  }

  #pdf, #pdf * {
    visibility: visible;
  }

  #pdf {
    position: absolute;
    top: 0;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }

  .download {
    width: 100% !important;
    page-break-after: always;
    margin: 0 !important;
  }

  @page:first {
    size: A4 portrait;
    margin: 0in; /* removes browser default margins */
  }  
}
`}
            </style>



            <Header />
            <Sidebar1 />
            {loading && <div style={{ fontSize: "30px", color: "black" }}>Loading...</div>}
            {data?.length > 0 && (
                <div className="main-body" id="main-body">
                    <div className="container py-0">
                        <div className="container-2 py-1" style={{ borderRadius: "0px", width: "883px", gap: "5px", border: "none" }}>
                            <div className="container-2" style={{ borderRadius: "0px", width: "883px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px" }}>
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
                                    onClick={() => navigate(fromPath, { state: { tab: tab } })}
                                    style={{ padding: "5px 10px", borderRadius: "6px", background: "gray", color: "white", border: "none", cursor: "pointer" }}
                                >
                                    Exit
                                </button>
                            </div>
                        </div>
                        <div className="container-2" id='pdf' style={{ borderRadius: "0px", paddingLeft: "20px", fontFamily: '"Times New Roman", Times, serif', paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "883px", direction: "flex", flexDirection: "column", gap: "5px" }}>
                            {
                                data.map((docket, index) =>
                                (
                                    <div className="docket" key={index} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {
                                            Array.from({ length: docket.Qty }, (_, i) => (
                                                <div className='download' style={{width:"840px"}} >
                                                    <div className="container" style={{border: "1px solid black", padding: "0px",width:"840px" }}>
                                                        <div style={{ display: "flex", flexDirection: "row", fontSize: "14px",width:"100%"}}>
                                                            <div style={{ width: "80%", display: "flex", flexDirection: "column" }}>
                                                                <div style={{ display: "flex",flexDirection: "column", border: "1px solid silver", alignItems: "center" }}>
                                                                    <label htmlFor="">DOCKET NUMBER </label>
                                                                    <BarCode
                                                                        value={docket?.DocketNo}
                                                                        format='CODE128'
                                                                        background='#fff'
                                                                        lineColor='#000'
                                                                        width={2}
                                                                        height={48}
                                                                        displayValue={true}
                                                                    />
                                                                </div>

                                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                                    <div style={{ display: "flex", flexDirection: "row", width: "50%", textAlign: "center" }}>

                                                                        <div style={{ width: "85%", display: "flex", flexDirection: "column", textAlign: "start" }}>
                                                                            <b style={{ border: "1px solid silver", paddingLeft: "5px" }}>CUSTOMER NAME</b>
                                                                            <label style={{ border: "1px solid silver", paddingLeft: "5px" }} htmlFor="">{docket?.Customer_Name}</label>
                                                                        </div>
                                                                        <div style={{ width: "15%", display: "flex", flexDirection: "column" }}>
                                                                            <b style={{ border: "1px solid silver" }}>QTY</b>
                                                                            <label style={{ border: "1px solid silver" }} htmlFor="">{docket?.Qty}</label>
                                                                        </div>

                                                                    </div>

                                                                    <div style={{ display: "flex", flexDirection: "row", width: "50%", textAlign: "center" }}>

                                                                        <div style={{ width: "25%", display: "flex", flexDirection: "column" }}>
                                                                            <b style={{ border: "1px solid silver" }}>ORIGIN</b>
                                                                            <label style={{ border: "1px solid silver" }} htmlFor="">{docket?.Origin_Name}</label>
                                                                        </div>
                                                                        <div style={{ width: "35%", display: "flex", flexDirection: "column" }}>
                                                                            <b style={{ border: "1px solid silver" }}>DESTINATION</b>
                                                                            <label style={{ border: "1px solid silver" }}>{docket?.Destination_Name}</label>
                                                                        </div>


                                                                        <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
                                                                            <b style={{ border: "1px solid silver" }}>SERVICE</b>
                                                                            <label style={{ border: "1px solid silver" }} htmlFor="">OM_SELF_DELHI</label>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", }}>SENDER'S COMPANY</b>
                                                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", }} htmlFor="">{docket?.Shipper_Name}</label>
                                                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", }}>SENDER'S NAME</b>
                                                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", }} htmlFor="">{docket?.Shipper_Name}</label>
                                                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", }}>ADDRESS</b>
                                                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", }} htmlFor="">{docket?.ShipperAdd},{docket?.ShipperAdd2},{docket?.ShipperAdd3}</label>
                                                                        <div style={{ display: "flex", flexDirection: "row", textAlign: "center" }}>
                                                                            <div style={{ width: "50%", border: "1px solid silver", display: "flex", flexDirection: "column" }}>
                                                                                <b>PIN CODE :</b> <label htmlFor=""> {docket?.ShippePin}</label>
                                                                            </div>

                                                                            <div style={{ width: "50%", border: "1px solid silver", display: "flex", flexDirection: "column" }}>
                                                                                <b>MOBILE NO :</b> <label htmlFor="">(+91) {docket?.ShipperPhone}</label>
                                                                            </div>
                                                                        </div>
                                                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }} htmlFor="">{docket?.Shippercity},{docket?.Shipper_State_Name},</label>
                                                                        <div style={{ display: "flex", flexDirection: "row", textAlign: "center" }}>

                                                                            <div style={{ display: "flex", flexDirection: "column", border: "1px solid silver", width: "60%" }}>
                                                                                <b>DESCRIPTION OF GOODS</b>
                                                                                <label htmlFor="">CLOTH COVER</label>
                                                                            </div>
                                                                            <div style={{ display: "flex", flexDirection: "column", width: "40%", border: "1px solid silver" }}>
                                                                                <b >INTERNATIONAL</b>
                                                                                <label htmlFor="">NON-DOX</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", }}>RECIPIENT'S COMPANY</b>
                                                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", }} htmlFor="">{docket?.Consignee_Name}</label>
                                                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", }}>RECIPIENT'S NAME</b>
                                                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", }} htmlFor="">{docket?.Consignee_Name}</label>
                                                                        <b style={{ paddingLeft: "5px", border: "1px solid silver", }}>ADDRESS</b>
                                                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", }} htmlFor="">{docket?.Consignee_Add1},{docket?.Consignee_Add2}</label>

                                                                        <div style={{ display: "flex", flexDirection: "row", textAlign: "center" }}>
                                                                            <div style={{ width: "50%", border: "1px solid silver", display: "flex", flexDirection: "column" }}>
                                                                                <b>PIN CODE :</b> <label htmlFor="">{docket?.Consignee_Pin}</label>
                                                                            </div>

                                                                            <div style={{ width: "50%", border: "1px solid silver", display: "flex", flexDirection: "column" }}>
                                                                                <b>MOBILE NO :</b> <label htmlFor="">(+91) {docket?.Consignee_Mob}</label>
                                                                            </div>
                                                                        </div>

                                                                        <label style={{ paddingLeft: "5px", border: "1px solid silver", height: "30px" }} htmlFor="">{docket?.Consignee_City}, {docket?.Consignee_State_Name},{docket?.Consignee_Country}</label>

                                                                        <div style={{ display: "flex", flexDirection: "row", textAlign: "center" }}>

                                                                            <div style={{ display: "flex", flexDirection: "column", width: "50%", border: "1px solid silver" }}>
                                                                                <b style={{}}>BOOKING DATE</b>
                                                                                <label style={{}} htmlFor="">{docket?.BookDate}</label>
                                                                            </div>

                                                                            <div style={{ display: "flex", flexDirection: "column", width: "50%", border: "1px solid silver" }}>
                                                                                <b style={{}}>INSURANCE</b>
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
                                                                        <label htmlFor="">{docket?.BookDate}</label>
                                                                    </div>

                                                                    <div style={{ display: "flex", flexDirection: "column", width: "40%", border: "1px solid silver", paddingLeft: "5px", alignItems: "center" }}>
                                                                        <label htmlFor="" style={{ marginTop: "10px", fontSize: "18px" }}>PARCEL NUMBER</label>
                                                                        <BarCode
                                                                            value={docket?.vendorAwbno}
                                                                            format='CODE128'
                                                                            background='#fff'
                                                                            lineColor='#000'
                                                                            width={2}
                                                                            height={70}
                                                                            displayValue={true}
                                                                        />
                                                                    </div>

                                                                    <div style={{ display: "flex", flexDirection: "column", width: "30%", border: "1px solid silver", paddingLeft: "5px" }}>
                                                                        <b>Received in good condition</b>
                                                                        <b style={{ marginTop: "20px", marginBottom: "20px" }}>NAME</b>
                                                                        <b>SIGN</b>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div style={{ width: "20%", textAlign: "center", display: "flex", flexDirection: "column" }}>
                                                                <div style={{ height: "112.50px", border: "1px solid silver", paddingTop: "10%", fontSize: "30px" }}>
                                                                    <b>{i + 1}/{docket?.Qty}</b>
                                                                </div>

                                                                <b style={{ border: "1px solid silver", height: "30px" }}>Box Weight</b>
                                                                <b style={{ border: "1px solid silver", height: "30px" }}>{docket?.ActualWt}</b>
                                                                <b style={{ border: "1px solid silver", height: "30px" }}>DIMS IN CM</b>
                                                                <b style={{ border: "1px solid silver", height: "30px" }}>{docket?.VolumetricWt}*{docket?.ActualWt}*{docket?.ChargedWt}</b>
                                                                <b style={{ border: "1px solid silver", height: "20px" }}>BOX VOL WT</b>
                                                                <b style={{ border: "1px solid silver", height: "20px" }}>{docket?.VolumetricWt}</b>
                                                                <b style={{ border: "1px solid silver", height: "20px" }}>ACTUAL WEIGHT</b>
                                                                <b style={{ border: "1px solid silver", height: "20px" }}>{docket?.ActualWt}</b>
                                                                <b style={{ border: "1px solid silver", height: "20px" }}>CHARGEABLE WT.</b>
                                                                <b style={{ border: "1px solid silver", height: "20px" }}>{docket?.ChargedWt}</b>
                                                                <b style={{ border: "1px solid silver", height: "30px" }}>PAYMENT METHOD</b>
                                                                <b style={{ border: "1px solid silver", height: "30px" }}>{docket?.T_Flag}</b>
                                                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>FREIGHT : {docket?.Rate} </b>
                                                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>OTHER : {docket?.OtherCharges}</b>
                                                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>CGST @ : {docket?.CGSTPer}</b>
                                                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>SGST @ : {docket?.SGSTPer}</b>
                                                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>IGST @ : {docket?.IGSTPer}</b>
                                                                <b style={{ border: "1px solid silver", height: "30px", textAlign: "start", paddingLeft: "5px" }}>TOTAL : {docket?.TotalAmt}</b>
                                                                <b style={{ border: "1px solid silver", height: "61px", textAlign: "start", paddingLeft: "5px" }}>REF NO.: 93163819 :</b>
                                                            </div>
                                                        </div>
                                                        <div style={{fontSize: "8px", display: "flex", flexDirection: "column", border: "1px solid black", paddingLeft: "5px" }}>
                                                            <b>TERMS & CONDITIONS :</b>
                                                            <b>1. NO CLAIMS WOULD BE ENTERTAINED FOR ANY DAMAGE DURING TRANSIT & DELAY IN DELIVERY DUE TO ANY REASON</b>
                                                            <b>2. MAXIMUM CLAIMS FOR LOSS OF PARCEL WOULD BE USD 50 UPTO 10 KGS & USD 100 ABOVE 10 KGS OR THE DECLARED VALUE WHICHEVER IS LOWER. </b>
                                                            <b>3. THIS AWB IS FOR THE ACCOUNT HOLDER AND IT IS NOT TRANSFERABLE.THIS RECEIPT DOES NOT IMPLY WE HAVE PHYSICALLY RECEIVED THE PARCEL IN OUR HUB</b>
                                                            <b>*** SUBJECT TO MUMBAI JURISDICTION***</b>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }


                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )
            }
        </>
    )
}

export default VendorBoxLabel;