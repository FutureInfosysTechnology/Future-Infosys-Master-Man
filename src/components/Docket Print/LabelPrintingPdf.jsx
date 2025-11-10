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

        pdf.save("LabelPrint.pdf");
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

  .docket, .docket * {
    visibility: visible;
  }

  .docket {
    position: absolute;
    top: 0;
    width: auto !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    overflow: hidden;
  }
  .download {
    margin-top: 20px;
    margin-left: 80px;
    padding: 0;
    page-break-after: always;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background: red;
  }

  @page {
    size: A4 portrait;
    margin: 0 !important; /* removes browser default margins */
    padding: 0 !important;
    
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
                                        {
                                            Array.from({ length: docket.Qty }, (_, i) => (
                                                <div className='download'>
                                                    <div className="container" style={{ border: "2px solid black", padding: "0px", width: "300px", display: "flex", flexDirection: "column" }}>
                                                        <div style={{
                                                            borderBottom: "2px solid black", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"
                                                            , fontWeight: "bolder", fontSize: "30px"
                                                        }}
                                                        >Box/Pcs - {i+1} of {docket.Qty}</div>
                                                        <div style={{ borderBottom: "2px solid black", display: "flex", width: "100%" }}>
                                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "50%", borderRight: "2px solid black", padding: "5px" }}>
                                                                <img src={getBranch?.Branch_Logo} width={200} height={60} />
                                                            </div>
                                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "50%", fontWeight: "bolder", fontSize: "20px", padding: "10px" }}>
                                                                {getBranch?.Company_Name}</div>
                                                        </div>
                                                        <div style={{ borderBottom: "2px solid black", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                            <BarCode
                                                                value={docket?.DocketNo}
                                                                format='CODE128'
                                                                background='#fff'
                                                                lineColor='#000'
                                                                width={2}
                                                                height={60}
                                                                displayValue={true}
                                                            />
                                                        </div>
                                                        <div style={{ borderBottom: "2px solid black", display: "flex", width: "100%" }}>
                                                           
                                                            <div
                                                            className="px-1"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    width: "50%",
                                                                    borderRight: "2px solid black", 
                                                                    lineHeight: "1.1", // 🔹 reduce line spacing
                                                                }}
                                                            >
                                                                <div style={{fontWeight: "bold", fontSize: "18px", marginBottom: "2px" }}>Awb No:</div> {/* 🔹 small margin */}
                                                                <div style={{fontWeight: "bolder", fontSize: "28px", marginTop: "0px" }}>{docket?.vendorAwbno}</div>
                                                            </div>
                                                             <div
                                                             className="px-1"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    width: "50%",
                                                                    lineHeight: "1.1", // 🔹 reduce line spacing
                                                                }}
                                                            >
                                                                <div style={{fontWeight: "bold", fontSize: "18px", marginBottom: "2px" }}>BookDate:</div> {/* 🔹 small margin */}
                                                                <div style={{fontWeight: "bolder", fontSize: "28px", marginTop: "0px" }}>{docket?.BookDate}</div>
                                                            </div>
                                                        </div>
                                                        <div style={{ borderBottom: "2px solid black", display: "flex", width: "100%" }}>
                                                           
                                                            <div
                                                            className="px-1"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    width: "50%",
                                                                    borderRight: "2px solid black",
                                                                    lineHeight: "1.1", // 🔹 reduce line spacing
                                                                }}
                                                            >
                                                                <div style={{fontWeight: "bold", fontSize: "18px", marginBottom: "2px" }}>Origin:</div> {/* 🔹 small margin */}
                                                                <div style={{fontWeight: "bolder", fontSize: "28px", marginTop: "0px" }}>{docket?.Origin_Name}</div>
                                                            </div>
                                                             <div
                                                             className="px-1"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    width: "50%",
                                                                    fontWeight: "bolder",
                                                                    lineHeight: "1.1", // 🔹 reduce line spacing
                                                                }}
                                                            >
                                                                <div style={{fontWeight: "bold", fontSize: "18px", marginBottom: "2px" }}>Destination:</div> {/* 🔹 small margin */}
                                                                <div style={{fontWeight: "bolder", fontSize: "28px", marginTop: "0px" }}>{docket?.Destination_Name}</div>
                                                            </div>
                                                        </div>
                                                        <div style={{ borderBottom: "2px solid black", display: "flex", width: "100%" }}>
                                                           
                                                            <div
                                                            className="px-1"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    width: "50%",
                                                                    borderRight: "2px solid black",
                                                                    lineHeight: "1.1", // 🔹 reduce line spacing
                                                                }}
                                                            >
                                                                <div style={{ fontWeight: "bold",fontSize: "18px", marginBottom: "2px" }}>Pcs:</div> {/* 🔹 small margin */}
                                                                <div style={{fontWeight: "bolder", fontSize: "28px", marginTop: "0px" }}>{docket?.Qty}</div>
                                                            </div>
                                                             <div
                                                               className="px-1"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    width: "50%",
                                                                    fontWeight: "bolder",
                                                                    lineHeight: "1.1", // 🔹 reduce line spacing
                                                                }}
                                                            >
                                                                <div style={{fontWeight: "bold", fontSize: "18px", marginBottom: "2px" }}>Mode Name:</div> {/* 🔹 small margin */}
                                                                <div style={{ fontWeight: "bolder",fontSize: "28px", marginTop: "0px" }}>{docket?.Mode_Name}</div>
                                                            </div>
                                                        </div>
                                                        <div  className="p-1" style={{fontWeight: "bold",lineHeight: "1.1",textAlign:"center",fontSize:"15px"}}>
                                                            {getBranch?.Branch_Add1},{getBranch?.Branch_Add2},{getBranch?.Branch_Name},
                                                            {getBranch?.Branch_PIN},(+91) {getBranch?.MobileNo}
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

export default LabelPrintingPdf;