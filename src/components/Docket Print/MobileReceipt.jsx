import React, { useState, useEffect } from 'react';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import barcode from '../../Assets/Images/barcode-svgrepo-com.png';
import logo from '../../Assets/Images/AceLogo.jpeg';
import 'jspdf-autotable';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
import BarCode from "react-barcode";
import { toWords } from "number-to-words";

function MobileReceipt() {
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
    useEffect(() => {
        const totalCharges =
            (Number(data[0]?.Rate) || 0) +
            (Number(data[0]?.FuelCharges) || 0) +
            (Number(data[0]?.GreenChrgs) || 0) +
            (Number(data[0]?.DocketChrgs) || 0) +
            (Number(data[0]?.HamaliChrgs) || 0) +
            (Number(data[0]?.OtherCharges) || 0);
        setTotal(totalCharges);
    }, [data]);
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
    const cellsStyle = {
        borderStyle: "solid", borderWidth: "2px 0 2px 2px", borderColor: "black",
        textAlign: "start",
        whiteSpace: "nowrap",
        fontSize: "10px",
        paddingLeft: "10px",
        paddingRight:"10px",
    }
    const tableStyle = {
        borderCollapse: "collapse",
        height:"120px",
    }

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
                scale:4,
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

  @page {
    size: A4 portrait;
    margin: 0; /* removes browser default margins */
    padding: 0;
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
                        <div className="container-2 py-1" style={{ borderRadius: "0px", width: "840px", gap: "5px", border: "none" }}>
                            <div className="container-2" style={{ borderRadius: "0px", width: "840px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px" }}>
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
                        <div className="container-2" id='pdf' style={{ borderRadius: "0px", paddingLeft: "20px", fontFamily: '"Times New Roman", Times, serif', paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "840px", direction: "flex", flexDirection: "column", gap: "5px" }}>
                            {
                                data.map((docket, index) =>
                                (
                                    <div className="docket" key={index}>
                                        <div className="container-2" style={{ borderRadius: "0px", width: "800px", display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                                            <div className='div1' style={{ width: "100%", height: "150px", border: "2px solid black", display: "flex", color: "black" }}>
                                                <div className='logo' style={{ width: "24%", height: "100%", padding: "5px" }}> <img src={getBranch.Branch_Logo} alt="" style={{ width: "100%", height: "100%" }} /></div>
                                                <div className='heading' style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column", alignItems: "start", paddingLeft: "5px" }}>
                                                    <div style={{ fontSize: "15px", fontWeight: "bolder" }}>{getBranch?.Company_Name}</div>
                                                    <div style={{ lineHeight: "1.2", marginTop: "5px", fontSize: "10px", paddingRight: "10px" }}>{getBranch?.Branch_Add1},{getBranch.Branch_PIN}</div>
                                                    <div style={{ fontSize: "12px" }}><b>GST No :</b> {getBranch?.GSTNo}</div>
                                                    <div style={{ fontSize: "12px" }}><b>Mobile No :</b> (+91) {getBranch?.MobileNo}</div>
                                                    <div style={{ fontSize: "12px" }}><b>Email :</b> {getBranch?.Email}</div>
                                                </div>
                                                <div className='booking' style={{ width: "26%", display: "flex", justifyContent: "end" ,alignItems:"center"}}>
                                                    <table style={tableStyle}>
                                                        <tbody >
                                                            <tr>
                                                                <td style={cellsStyle}>Payment Type:</td>
                                                                <td style={cellsStyle}>{docket?.T_Flag}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={cellsStyle}>Vendor Name:</td>
                                                                <td style={cellsStyle}>{docket?.Vendor_Name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={cellsStyle}>Vendor Awb No:</td>
                                                                <td style={cellsStyle}>{docket?.vendorAwbno}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={cellsStyle}>Origin:</td>
                                                                <td style={cellsStyle}>{docket?.Origin_Name}</td>
                                                            </tr>
                                                           
                                                             <tr>
                                                                <td style={cellsStyle}>Destination:</td>
                                                                <td style={cellsStyle}>{docket?.Destination_Name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={cellsStyle}>Booking Date:</td>
                                                                <td style={cellsStyle}>{docket?.BookDate}</td>
                                                            </tr>
                                                            
                                                            <tr>
                                                                <td style={cellsStyle}>Booking Branch:</td>
                                                                <td style={cellsStyle}>{docket?.Branch_Name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={cellsStyle}>Booking Mode:</td>
                                                                <td style={cellsStyle}>
                                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                                        <label htmlFor="" style={{ display: docket?.Mode_Name === "RAIL" ? "flex" : "none", alignItems: "center" }}><input type="checkbox" checked={docket?.Mode_Name === "RAIL"} /><span>RAIL</span></label>
                                                                        <label htmlFor="" style={{ display: docket?.Mode_Name === "Air" ? "flex" : "none", alignItems: "center" }}><input type="checkbox" checked={docket?.Mode_Name === "Air"} /><span>AIR</span></label>
                                                                        <label htmlFor="" style={{ display: docket?.Mode_Name === "SURFACE" ? "flex" : "none", alignItems: "center" }}><input type="checkbox" checked={docket?.Mode_Name === "SURFACE"} /><span>SURFACE</span></label>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className='div2' style={{ width: "100%", fontSize: "10px", height: "20px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                                <div style={{ width: "50%", fontWeight: "bold", borderRight: "2px solid black", paddingLeft: "5px", paddingTop: "2px" }}>CLIENT NAME : <span>{docket?.Customer_Name}</span></div>
                                                <div style={{ width: "50%", fontWeight: "bold", paddingLeft: "5px", paddingTop: "2px" }}>CONSIGNEE NAME: <span>{docket?.Consignee_Name}</span></div>
                                            </div>
                                            <div className='div3' style={{ width: "100%", fontSize: "10px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                                <div className='consignor px-2' style={{ width: "50%", borderRight: "2px solid black", display: "flex", flexDirection: "column", gap: "3px", paddingTop: "2px" }}>
                                                    { docket?.Shipper_Name && <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Shipper Name : </div> <span>{docket?.Shipper_Name}</span></div>}
                                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Address : </div><span>{docket?.Customer_Add1},{docket?.Customer_Add2},{docket?.Customer_Add3},{docket?.Pin_Code}</span></div>
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Mob No : </div><span>(+91) {docket?.Shipper_Name ? docket?.ShipperPhone : docket?.Customer_Mob}</span></div>
                                                        <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Email : </div><span>{docket?.Shipper_Name ? docket?.ShipperEmail : docket?.Email_Id}</span></div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>City : </div><span>{docket?.Shipper_Name ? docket?.ShipperCity  :docket?.City}</span></div>
                                                        <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>State : </div><span>{docket?.Shipper_Name ? docket?.Shipper_State_Name :docket?.Customer_State_Name}</span></div>
                                                    </div>

                                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>GST NO : </div><span>{docket?.Shipper_Name ? docket?.ShipperGST  :docket?.Gst_No}</span></div>

                                                </div>
                                                <div className='consignee px-2' style={{ width: "50%", display: "flex", flexDirection: "column", gap: "3px", paddingTop: "2px" }}>

                                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Address : </div><span>{docket?.Consignee_Add1},{docket?.Consignee_Add2},{docket?.Consignee_Pin}</span></div>
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Mob No : </div><span>(+91) {docket?.Consignee_Mob}</span></div>
                                                        <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Email : </div><span>{docket?.Consignee_Email}</span></div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>City : </div><span>{docket?.City}</span></div>
                                                        <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>State : </div><span>{docket?.Consignee_State_Name}</span></div>
                                                    </div>

                                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>GST NO : </div><span> {docket?.Consignee_GST}</span></div>

                                                </div>
                                            </div>
                                            <div className='div4' style={{ width: "100%", height: "190px", fontSize: "10px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                                <div className='charges' style={{ width: "26.80%", borderRight: "2px solid black", display: "flex", flexDirection: 'column' }}>
                                                    <div style={{ display: "flex", height: "", textAlign: "center" }}>
                                                        <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>AWT.</div>
                                                        <div style={{ width: "25%", borderRight: "2px solid black", paddingTop: "2px" }}>{docket?.ActualWt}</div>
                                                        <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>CHGWT.</div>
                                                        <div style={{ width: "25%", paddingTop: "2px" }}>{docket?.ChargedWt}</div>
                                                    </div>
                                                    <div style={{ display: "flex", height: "", borderTop: "2px solid black" }}>
                                                        <div style={{ width: "50%", borderRight: "2px solid black", paddingTop: "2px", paddingLeft: "5px" }}>NO OF PACKAGES</div>
                                                        <div style={{ width: "50%", paddingTop: "2px", paddingLeft: "10px" }}>{docket?.Qty}</div>
                                                    </div>
                                                    <div style={{ display: "flex", height: "", borderTop: "2px solid black" }}>
                                                        <div style={{ width: "50%", borderRight: "2px solid black", paddingTop: "2px", paddingLeft: "5px" }}> TYPE OF PACKAGES</div>
                                                        <div style={{ width: "50%", paddingTop: "2px", paddingLeft: "10px" }}></div>
                                                    </div>
                                                    <div style={{ display: "flex", height: "", borderTop: "2px solid black" }}>
                                                        <div style={{ width: "50%", borderRight: "2px solid black", paddingTop: "2px", paddingLeft: "5px" }}> SAID TO CONTAIN</div>
                                                        <div style={{ width: "50%", paddingTop: "2px", paddingLeft: "10px" }}></div>
                                                    </div>
                                                    <div style={{ display: "flex", height: "", borderTop: "2px solid black" }}>
                                                        <div style={{ width: "50%", borderRight: "2px solid black", paddingTop: "2px", paddingLeft: "5px" }}> INVOICE VALUE(Rs..)</div>
                                                        <div style={{ width: "50%", paddingTop: "2px", paddingLeft: "10px" }}>{docket?.InvValue}</div>
                                                    </div>
                                                    <div style={{ display: "flex", height: "", borderTop: "2px solid black" }}>
                                                        <div style={{ width: "50%", borderRight: "2px solid black", paddingTop: "2px", paddingLeft: "5px" }}>  OWNER'S RISK</div>
                                                        <div style={{ width: "50%", paddingTop: "2px", paddingLeft: "10px" }}> OWNER'S RISK</div>
                                                    </div>
                                                    <div style={{ display: "flex", height: "", borderTop: "2px solid black" }}>
                                                        <div style={{ width: "40%", borderRight: "2px solid black", fontWeight: "bold", paddingTop: "2px", paddingLeft: "5px", whiteSpace: "wrap" }}>   Document Enclose</div>
                                                        <div style={{ width: "35%", borderRight: "2px solid black", fontWeight: "bold", paddingTop: "2px", paddingLeft: "5px", whiteSpace: "wrap" }}>  ModVat Copy</div>
                                                        <div style={{ width: "35%", paddingTop: "2px", fontWeight: "bold", paddingLeft: "5px" }}> Way Bill</div>
                                                    </div>
                                                    <div style={{ display: "flex", height: "40px", borderTop: "2px solid black" }}>
                                                        <div style={{ width: "40%", borderRight: "2px solid black", paddingTop: "2px", paddingLeft: "5px", whiteSpace: "wrap" }}>  </div>
                                                        <div style={{ width: "35%", borderRight: "2px solid black", paddingTop: "2px", paddingLeft: "5px", whiteSpace: "wrap" }}>  </div>
                                                        <div style={{ width: "35%", paddingTop: "2px", paddingLeft: "5px" }}> </div>
                                                    </div>
                                                    <div style={{ display: "flex", height: "", borderTop: "2px solid black", gap: "5px" }}>
                                                        <div style={{ paddingLeft: "5px" }}> Invoice No. :</div>
                                                        <span>{docket?.InvoiceNo}</span>
                                                    </div>

                                                </div>
                                                <div className='amount' style={{ width: "45%", display: "flex" }}>
                                                    <div className='total1' style={{ width: "55%", borderRight: "2px solid black" }}>
                                                        <div style={{ display: "flex", fontWeight: "bold", height: "9%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "2px", textAlign: "center" }}>L</span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "2px", textAlign: "center" }}>B</span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "2px", textAlign: "center" }}>H</span>
                                                            <span style={{ borderRight: "2px solid black", width: "20%", paddingTop: "2px", textAlign: "center" }}>CFT</span>
                                                            <span style={{ borderRight: "2px solid black", width: "20%", paddingTop: "2px", textAlign: "center" }}>PACK</span>
                                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}>TOTAL</span>
                                                        </div>
                                                        <div style={{ display: "flex", fontWeight: "bold", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "2px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "68%", paddingTop: "2px", textAlign: "center" }}>INCHES / CM</span>
                                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}></span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{docket?.VolumetriceData?.[0]?.Length || ""}</span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{docket?.VolumetriceData?.[0]?.Width || ""}</span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{docket?.VolumetriceData?.[0]?.Height || ""}</span>
                                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}>{docket?.VolumetriceData?.[0]?.Length + docket?.VolumetriceData?.[0]?.Width + docket?.VolumetriceData?.[0]?.Height || ""}</span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{docket?.VolumetriceData?.[1]?.Length || ""}</span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{docket?.VolumetriceData?.[1]?.Width || ""}</span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{docket?.VolumetriceData?.[1]?.Height || ""}</span>
                                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}>{docket?.VolumetriceData?.[1]?.Length + docket?.VolumetriceData?.[1]?.Width + docket?.VolumetriceData?.[1]?.Height || ""}</span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{docket?.VolumetriceData?.[2]?.Length || ""}</span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{docket?.VolumetriceData?.[2]?.Width || ""}</span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{docket?.VolumetriceData?.[2]?.Height || ""}</span>
                                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}>{docket?.VolumetriceData?.[2]?.Length + docket?.VolumetriceData?.[2]?.Width + docket?.VolumetriceData?.[2]?.Height || ""}</span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}></span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}></span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}></span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}></span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "11%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}></span>
                                                        </div>
                                                    </div>
                                                    <div className='total2' style={{ width: "50%", borderRight: "2px solid black" }}>
                                                        <div style={{ display: "flex", height: "19%" }}>
                                                            <span style={{ borderRight: "2px solid black", fontWeight: "bold", width: "70%", paddingLeft: "5px", whiteSpace: "wrap", fontSize: "12px" }}>DETAILS FREIGHT</span>
                                                            <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
                                                                <span style={{ textAlign: "center", fontWeight: "bold", paddingTop: "2px", }}>AMOUNT</span>
                                                                <span style={{ textAlign: "center", paddingTop: "2px", }}>{docket?.Rate}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "70%", paddingLeft: "5px" }}> FUEL CHARGES</span>
                                                            <span style={{ width: "40%", textAlign: "center" }}>{docket?.FuelCharges}</span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "70%", paddingLeft: "5px" }}> DKT CHARGES </span>
                                                            <span style={{ width: "40%", textAlign: "center" }}>{docket?.DocketChrgs}</span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "70%", paddingLeft: "5px" }}> FOV CHARGES</span>
                                                            <span style={{ width: "40%", textAlign: "center" }}>{docket?.GreenChrgs}</span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "70%", paddingLeft: "5px" }}> DELIVERY CHARGES</span>
                                                            <span style={{ width: "40%", textAlign: "center" }}>{docket?.HamaliChrgs}</span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "70%", paddingLeft: "5px" }}> OTHER CHARGES</span>
                                                            <span style={{ width: "40%", textAlign: "center" }}>{docket?.OtherCharges}</span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "70%", paddingLeft: "5px" }}> TOTAL</span>
                                                            <span style={{ width: "40%", textAlign: "center" }}>{total}</span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "70%", paddingLeft: "5px" }}> GST</span>
                                                            <span style={{ width: "40%", textAlign: "center" }}>{docket?.CGSTAMT}</span>
                                                        </div>
                                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "11%" }}>
                                                            <span style={{ borderRight: "2px solid black", width: "70%", paddingLeft: "5px" }}>  GRAND TOTAL</span>
                                                            <span style={{ width: "40%", textAlign: "center" }}>{total + docket?.CGSTAMT}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='payment' style={{ width: "30%" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                                                        <div style={{ fontWeight: "bold", }}>  DOCKET NO : </div>
                                                        <div style={{}}>
                                                            <BarCode
                                                                value={docket?.DocketNo}
                                                                format='CODE128'
                                                                background='#fff'
                                                                lineColor='#000'
                                                                width={2}
                                                                height={50}
                                                                displayValue={true}
                                                            /> </div>
                                                    </div>
                                                    <div className='px-2' style={{ height: "60%", borderTop: "2px solid black", fontWeight: "bold", fontSize: "9px" }} >
                                                        <div>TERM & CONDITION</div>
                                                        <div>.THIS IS AN NON NEGOTIABLE WAYBILL</div>
                                                        <div>.STANDARD CONDITION OF CARRIAGE ARE GIVEN ON THE REVERSE OF THE CONSIGNOR'S COPY</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='div5' style={{ width: "100%", height: "155px", fontSize: "10px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                                <div style={{ width: "26.80%", borderRight: "2px solid black" }}>
                                                    <div style={{ display: "flex", height: "11%", borderBottom: "2px solid black", gap: "5px" }}>
                                                        <div style={{ paddingLeft: "5px" }}> Invoice Date. :</div>
                                                        <span>{docket?.InvDate}</span>
                                                    </div>
                                                    <div style={{ display: "flex", height: "11%", borderBottom: "2px solid black", gap: "5px" }}>
                                                        <div style={{ paddingLeft: "5px" }}> EWAY BILL NOs. :</div>
                                                        <span>{docket?.EwayBill}</span>
                                                    </div>
                                                    <div style={{ paddingLeft: "7px", fontWeight: "bold", borderBottom: "2px solid black", height: "11%" }}>COD/DOD AUTHORISED DETAILS</div>
                                                    <div style={{ paddingLeft: "7px", borderBottom: "2px solid black", height: "30%" }}> COD/DOD AMOUNT (Rs..)</div>
                                                    <div style={{ paddingLeft: "7px", height: "40%" ,display:"flex",gap:"10px",justifyContent:"center",alignItems:"center"}}>
                                                        <div>User Booking : </div>
                                                        <div>{docket?.UserName}</div>
                                                        </div>

                                                </div>
                                                <div style={{ width: "30%", borderRight: "2px solid black" }}>
                                                    <div style={{ paddingLeft: "5px", fontWeight: "bold", borderBottom: "2px solid black", height: "11%" }}>CONSIGNOR/ CONSIGNEE COPY / A/C COPY</div>
                                                    <div style={{ paddingLeft: "5px", fontWeight: "bold", borderBottom: "2px solid black", height: "11%" }}> SPECIAL INSTRUCTIONS</div>
                                                    <div style={{ paddingLeft: "5px", height: "54%" }}> Received above shipment in order and in good
                                                        conditon. I/We hereby agree to pay all charges
                                                        including octroi & taxes as applicabl
                                                    </div>
                                                    <div style={{ fontWeight: "bold", textAlign: "center", fontSize: "9px" }} className='p-3'> Signature Receiver with Rubber Stamp & Date</div>
                                                </div >
                                                <div style={{ fontWeight: "bold", width: "44%", }}>
                                                    <div style={{ borderBottom: "2px solid black", paddingLeft: "5px", display: "flex", gap: "5px" }}>
                                                        <span>Rs</span><div>
                                                            {numberToIndianCurrency(Number(docket?.CGSTAMT + total))}
                                                        </div>

                                                    </div>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderBottom: "2px solid black", paddingLeft: "5px" }}>
                                                        <div>
                                                            NAME :
                                                        </div>
                                                        <div> CONSIGNOR'S SIGNATURE</div>
                                                    </div>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingLeft: "5px" }}>
                                                        <div> RECEIVED BY FUTURE INFOSYS TECHNOLOGIES PRIVATE LIMITED</div>
                                                        <div>
                                                            NAME   ....................................................
                                                        </div>
                                                        <div>DATE  .........................TIME....................</div>
                                                        <div style={{ textAlign: "end", paddingRight: "5px" }}> ACCOUNT COPY</div>
                                                    </div>
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

export default MobileReceipt;