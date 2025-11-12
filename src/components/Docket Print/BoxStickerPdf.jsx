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
import barcode from '../../Assets/Images/barcode-svgrepo-com.png';

function LabelPrintingPdf() {
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
        const docketElements = document.querySelectorAll(".docket");
        if (docketElements.length === 0) return;

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm (A4 width)
        const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm (A4 height)

        for (let i = 0; i < docketElements.length; i++) {
            const element = docketElements[i];

            // Capture element as high-res image
            const canvas = await html2canvas(element, {
                scale: 4,
                useCORS: true,
                backgroundColor: "#ffffff",
                scrollY: -window.scrollY,
                windowWidth: document.documentElement.scrollWidth,
            });

            const imgData = canvas.toDataURL("image/jpeg", 0.95);

            // Convert canvas dimensions (pixels) to mm
            const pxToMm = (px) => (px * 25.4) / 96; // 96dpi ≈ 1 inch
            const imgWidthMm = pxToMm(canvas.width);
            const imgHeightMm = pxToMm(canvas.height);
            const imgRatio = imgWidthMm / imgHeightMm;

            // 🟩 Smaller left/right padding for more width
            const leftRightPadding = 2; // mm (previously 5mm)
            const topPadding = 10;      // mm

            // 🟩 Compute image render size and position
            let renderWidth = pdfWidth - leftRightPadding * 2;
            let renderHeight = renderWidth / imgRatio;
            let xOffset = leftRightPadding;
            let yOffset = (pdfHeight - renderHeight) / 2 + topPadding;

            // Prevent overflow if content too tall
            if (yOffset + renderHeight > pdfHeight) {
                yOffset = topPadding;
                renderHeight = pdfHeight - topPadding * 2;
                renderWidth = renderHeight * imgRatio;
                xOffset = (pdfWidth - renderWidth) / 2;
            }

            // 🟩 Add image with minimal padding (nearly full width)
            pdf.addImage(imgData, "JPEG", xOffset, yOffset, renderWidth, renderHeight);

            if (i < docketElements.length - 1) pdf.addPage();
        }

        pdf.save("BoxSticker.pdf");
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
    width: auto !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    overflow: hidden;
  }

  .docket {
    margin: 0;
    padding: 0;
    page-break-after: always;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background: white;
  }

  @page:first {
    size: A4 portrait;
    margin: 0; /* removes browser default margins */
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
                        <div className="container-2 py-1" style={{ borderRadius: "0px", width: "500px", gap: "5px", border: "none" }}>
                            <div className="container-2" style={{ borderRadius: "0px", width: "500px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px" }}>
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
                        <div className="container-2" id='pdf' style={{ borderRadius: "0px", paddingLeft: "20px", fontFamily: '"Times New Roman", Times, serif', paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "500px", direction: "flex", flexDirection: "column", gap: "5px" }}>
                            {
                                data.map((docket, index) =>
                                (
                                    <div className="docket" key={index} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div className="container" style={{ border: "2px solid black", padding: "0px", width: "350px" }}>
                                            <div className='py-2 pb-4' style={{ width: "100%", border: "1px solid black", display: "flex", flexDirection: "row" }}>
                                                <div style={{ display: "flex", flexDirection: "column", paddingLeft: "10px", paddingTop: "5px", width: "50%", lineHeight: "1.3" }}>
                                                    <b style={{ fontSize: "14px" }}>UK EXPRESS</b>
                                                    <b style={{ fontSize: "12px", marginTop: "10px", marginBottom: "10px" }}>SHIPPER / SENDER</b>
                                                    <b style={{ fontSize: "10px" }}>SURESH KUMAR</b>
                                                    <div style={{ fontSize: "10px" }}>171 RAMJI FADIYU</div>
                                                    <div style={{ fontSize: "10px" }}>VASANAPURA</div>
                                                    <div style={{ fontSize: "10px" }}>VADODARA, GUJARAT, 391770</div>
                                                    <div style={{ fontSize: "10px" }}>INDIA</div>
                                                </div>

                                                <div style={{ display: "flex", flexDirection: "column", paddingRight: "10px", paddingTop: "5px", width: "50%", alignItems: "end", lineHeight: "1.1" }}>
                                                    <b style={{ fontSize: "12px" }}>MUMBAI</b>
                                                    <label htmlFor="" style={{ fontSize: "10px" }}>SHIP DATE : <b>11-01-2025</b></label>
                                                    <label htmlFor="" style={{ fontSize: "10px", marginBottom: "10px" }}>TOTAL WEIGHT : <b>12,900 KG</b></label>
                                                    <div style={{ fontSize: "10px", backgroundColor: "black", color: "white", marginBottom: "10px" }}>WPX</div>
                                                    <b style={{ fontSize: "22px" }}>1/1</b>
                                                </div>
                                            </div>

                                            <div style={{ border: "1px solid black", width: "100%", alignItems: "center", display: "flex", flexDirection: "column" }}>
                                                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                                    <BarCode
                                                        value={docket?.DocketNo}
                                                        format='CODE128'
                                                        background='#fff'
                                                        lineColor='#000'
                                                        width={2}
                                                        height={40}
                                                        displayValue={true}
                                                    />
                                                </div>
                                            </div>

                                            <div className='py-2 pb-5' style={{ width: "100%", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "15px", paddingLeft: "10px", paddingTop: "10px",lineHeight:"1.1" }}>
                                                <b style={{ fontSize: "12px" ,marginBottom:"10px"}}>RECEIVER</b>
                                                <b>RAMESH KUMAR</b>
                                                <b>480 A - KATHERING ROAD</b>
                                                <b>LONDON</b>
                                                <b>UK</b>
                                                <b>E78DP</b>
                                                <b>UNITED KINGDOM</b>
                                                <b>PH : 447448497197</b>
                                            </div>

                                            <div className='p-2' style={{ border: "1px solid black", width: "100%", alignItems: "center", display: "flex", flexDirection: "column" }}>
                                                <img src={barcode} alt="" style={{ height: "60px", width: "200px" }} />
                                                <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", paddingLeft: "10px", paddingRight: "10px" }}>
                                                    <label htmlFor="" style={{ textAlign: "start" }}>SHIPPER REF</label>
                                                    <label htmlFor="">BILL TO SENDER</label>
                                                </div>
                                                <div style={{ textAlign: "end", width: "100%", paddingRight: "10px" }}>
                                                    <b>SUB</b>
                                                </div>
                                            </div>

                                        </div>
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

export default LabelPrintingPdf;