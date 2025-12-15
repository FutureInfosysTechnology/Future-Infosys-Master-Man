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

function LabelPrintingPdf2() {
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
                scale: 6,
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

        pdf.save("LabelPrint2.pdf");
    };


    return (
        <>
            <style>
                {`
@media print {

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
  }

  .download {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
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
                                    <div className="docket" key={index} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                        {
                                            Array.from({ length: docket.Qty }, (_, i) => (
                                                <div className='download'>
                                                    <div className="container" style={{ border: "1px solid black", padding: "0px", width: "450px", display: "flex", flexDirection: "column" }}>
                                                        <div style={{ display: "flex", width: "100%", padding: "10px", justifyContent: "center" }}>
                                                            <img src={getBranch?.Branch_Logo} style={{ width: "70%", height: "120px" }} />
                                                        </div>
                                                        <div style={{ display: "flex", width: "100%", padding: "10px", justifyContent: "space-between", color: "gray" }}>
                                                            <div style={{ fontSize: "20px", color: "black", fontWeight: "bold" }}>Deliver To</div>
                                                            <div>{getBranch?.Website}</div>
                                                            <div>1668</div>
                                                        </div>
                                                        <div style={{ display: "flex", width: "100%", padding: "10px", justifyContent: "space-between", color: "gray" }}>
                                                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", fontSize: "12px", gap: "20px" }}>
                                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                                    <div>MEGHNA ARORA</div>
                                                                    <div>12328B 82 AVENUE</div>
                                                                </div>
                                                                <div>SURRREY - BC - V3W 3E7</div>
                                                            </div>
                                                            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid black", width: "30%", alignItems: "end" }}>
                                                                <div style={{ fontSize: "20px", color: "black", fontWeight: "bold" }}>Canada</div>
                                                                <div style={{ color: "black" }}>{docket?.BookDate}</div>
                                                            </div>
                                                        </div>
                                                        <div style={{ borderBottom: "1px solid black", borderTop: "1px solid black", display: "flex", width: "100%" }}>

                                                            <div
                                                                className="p-2 pb-0"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    justifyContent: "space-between",
                                                                    gap: "10px",
                                                                    width: "50%",
                                                                    borderRight: "1px solid black",
                                                                    lineHeight: "1.1", // 🔹 reduce line spacing

                                                                }}
                                                            >
                                                                <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", gap: "15px" }}>
                                                                    <div style={{ border: "3px dashed black" }}></div>
                                                                    <div style={{ fontWeight: "bold" }}>PUROLATOR YVR</div>
                                                                    <div style={{ border: "3px dashed black" }}></div>

                                                                </div>
                                                                <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>TRACKING NUMBER</div>
                                                                    <BarCode
                                                                        value={docket?.DocketNo}
                                                                        format='CODE128'
                                                                        background='#fff'
                                                                        lineColor='#000'
                                                                        width={1.5}
                                                                        height={60}
                                                                        displayValue={true}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="p-2 pb-1"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    gap: "10px",
                                                                    width: "50%",
                                                                    lineHeight: "1.1", // 🔹 reduce line spacing

                                                                }}
                                                            >
                                                                <div style={{ display: "flex", justifyContent: "center", fontWeight: "bold", fontSize: "30px" }}>{i + 1} of {docket?.Qty}</div>
                                                                <div style={{ display: "flex", justifyContent: "center", fontWeight: "bold", flexDirection: "column", alignItems: "center", fontSize: "15px" }}>
                                                                    <div>9.26 KG</div>
                                                                    <div style={{ marginTop: "10px" }}>44 X 30 X 36 CM = </div>
                                                                    <div>9.50 KG</div>
                                                                </div>
                                                                <div style={{ fontSize: "12px" }}> <span style={{ fontWeight: "bold" }}>Content :</span> iohfhd sdhdh jopfjjof kihvhhgf khkvjdjh kjhkdvkjhdf jkdvfvfhd
                                                                    iohfhd sdhdh jopfjjof kihvhhgf khkvjdjh kjhkdvkjhdf jkdvfvfhd</div>

                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", width: "100%" }}>

                                                            <div
                                                                className="p-2 pb-1"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    justifyContent: "space-between",
                                                                    gap: "10px",
                                                                    width: "50%",
                                                                    borderRight: "1px solid black",
                                                                    lineHeight: "1.1", // 🔹 reduce line spacing

                                                                }}
                                                            >
                                                                <div style={{ width: "100%", display: "flex", flexDirection: "column", fontSize: "10px" }}>

                                                                    <div style={{ fontWeight: "bold", fontSize: "20px" }}>Shipper :-</div>
                                                                    <div style={{ marginTop: "10px" }}>{docket?.Shipper_Name}</div>
                                                                    <div >{docket?.ShipperAdd},{docket?.ShipperAdd2},{docket?.ShipperAdd3}</div>
                                                                    <div>{docket?.Shippercity} - {docket?.Shipper_State_Name}</div>


                                                                </div>
                                                            </div>
                                                            <div
                                                                className="p-2"
                                                                style={{

                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    width: "50%",
                                                                    padding: "20px",
                                                                    minHeight: "160px",
                                                                    lineHeight: "1.1", // 🔹 reduce line spacing

                                                                }}
                                                            >
                                                                <div style={{
                                                                    width: "100%",
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    fontSize: "10px",
                                                                    alignItems: "center",
                                                                    padding: "10px",
                                                                    transform: "rotate(90deg)",   // ROTATION HERE
                                                                    transformOrigin: "center"     // keeps it centered
                                                                }}>
                                                                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>PARCEL NUMBER</div>

                                                                    <div
                                                                        style={{
                                                                            width: "180px",      // 🔒 fixed width
                                                                            height: "70px",      // 🔒 fixed height
                                                                            overflow: "hidden",  // 🔒 prevent expansion
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                        }}
                                                                    >
                                                                        <BarCode
                                                                            value={docket?.vendorAwbno || ""}
                                                                            format="CODE128"
                                                                            width={1}          // 🔽 thinner bars for long numbers
                                                                            height={60}          // 🔒 fixed height
                                                                            displayValue={false} // 🔥 remove text (saves space)
                                                                            background="#fff"
                                                                            lineColor="#000"
                                                                        />
                                                                    </div>

                                                                </div>

                                                            </div>

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

export default LabelPrintingPdf2;