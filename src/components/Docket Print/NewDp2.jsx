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

function NewDP2() {
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
        paddingRight: "10px",
    }
    const tableStyle = {
        borderCollapse: "collapse",
        height: "120px",
    }

    const handleDownloadPDF = async () => {
  const docketElements = document.querySelectorAll(".docket");
  if (docketElements.length === 0) return;

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

  for (let i = 0; i < docketElements.length; i++) {
    const element = docketElements[i];

    // ✅ Capture full element (including off-screen parts)
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight + 200, // buffer to ensure full capture
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    // Convert canvas size (px → mm)
    const pxToMm = (px) => (px * 25.4) / 96;
    const imgWidthMm = pxToMm(canvas.width);
    const imgHeightMm = pxToMm(canvas.height);
    const imgRatio = imgWidthMm / imgHeightMm;

    // 🟩 Fit docket to A4 width or height (whichever is limiting)
    let renderWidth, renderHeight;
    if (imgWidthMm > imgHeightMm) {
      // Landscape-like docket
      renderWidth = pdfWidth - 10; // 5mm margin on each side
      renderHeight = renderWidth / imgRatio;
    } else {
      // Portrait-like docket
      renderHeight = pdfHeight - 20; // top-bottom margin
      renderWidth = renderHeight * imgRatio;
      if (renderWidth > pdfWidth - 10) {
        renderWidth = pdfWidth - 10;
        renderHeight = renderWidth / imgRatio;
      }
    }

    // Center docket on page
    const xOffset = (pdfWidth - renderWidth) / 2;
    const yOffset = (pdfHeight - renderHeight) / 2;

    // 🖼️ Draw image perfectly centered
    pdf.addImage(imgData, "JPEG", xOffset, yOffset, renderWidth, renderHeight);

    // Add a new page for next docket
    if (i < docketElements.length - 1) pdf.addPage();
  }

  pdf.save("NewDp2.pdf");
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
                        <div className="container-2 py-1" style={{ borderRadius: "0px", width: "1040px", gap: "5px", border: "none" }}>
                            <div className="container-2" style={{ borderRadius: "0px", width: "1040px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px" }}>
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
                        <div className="container-2" id='pdf' style={{ borderRadius: "0px", paddingLeft: "20px", fontFamily: '"Times New Roman", Times, serif', paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "1040px", direction: "flex", flexDirection: "column", gap: "5px" }}>
                            {
                                data.map((docket, index) =>
                                (
                                    <div className="docket" key={index}>
                                        <div className="container-2" style={{ borderRadius: "0px", width: "995px", border: "none", display: "flex", fontSize: "12px", flexDirection: "column",marginBottom:"50px" }}>
                                            <div className='div1' style={{ width: "100%", height: "80px", display: "flex", color: "black", gap: "10px" }}>
                                                <div className='logo' style={{
                                                    width: "15%", display: "flex",

                                                }}>
                                                    <img src={getBranch.Branch_Logo} alt="" style={{ width: "100%", height: "100%" }} />
                                                </div>
                                                <div className='heading' style={{ width: "85%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", fontWeight: "bolder", fontSize: "25px" }}>
                                                        {getBranch?.Company_Name}
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "start", lineHeight: "1.1" }}>
                                                            <div>{getBranch?.Branch_Add1}</div>
                                                            <div>{getBranch?.Branch_Add2}</div>
                                                            <div>{getBranch?.State_Name}-{getBranch?.Branch_PIN}</div>

                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "end", lineHeight: "1.1" }}>
                                                            <div>(+91) {getBranch?.MobileNo}</div>
                                                            <div>{getBranch?.Email}</div>
                                                            <div>{getBranch?.GSTNo}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='div2' style={{ width: "100%", height: "60px", display: "flex", color: "black", marginTop: "2px", gap: "3px" }}>
                                                <div className='box1' style={{ width: "45%", height: "100%", padding: "0px", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px" }}>
                                                    <div style={{ textAlign: "center" }}><b>Notice</b></div>
                                                    <div className='px-1' style={{ display: "flex", justifyContent: "center", lineHeight: "1" }}> Without	the	consignee's	written	permission	this	consignment	will	not	be	diverted,	re
                                                        routed,	or	rebooked	and	it	should	be	delivered	at	the	destination.	Lorry	Receipt	will	be
                                                        delivered	to	the	only	consignee.</div>
                                                </div>
                                                <div className='box2' style={{ width: "20%", height: "100%", padding: "5px", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", justifyContent: "center", lineHeight: "1" }}>
                                                    <div style={{ textDecoration: "under" }}><b>AT	OWNER'S	RISK</b></div>
                                                    <div>GST No: <b>27CSLPS2533K1Z8</b></div>
                                                    <div>PAN No: <b>CSLPS2533K</b></div>

                                                </div>
                                                <div className='box3 p-1' style={{ width: "35%", padding: "0px", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", lineHeight: "1", justifyContent: "center" }}>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>LR	Date: <b>31-10-2025</b></div>
                                                        <div>LR	No: <b>38</b></div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>LTruck/Vehicle	No : <b>BY	RAIL</b></div>
                                                        <div>Transport	Mode: <b>By	Rail</b></div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>From: <b>Mumbai</b></div>
                                                        <div>To: <b>Delhi</b></div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>Delivery	Type: <b>Door</b></div>
                                                        <div>Payment	Status: <b>Paid</b></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='div3' style={{ fontSize: "10px", width: "100%", height: "60px", display: "flex", color: "black", marginTop: "2px", gap: "3px" }}>
                                                <div className='box1 ' style={{ width: "35%", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", lineHeight: "1.1", justifyContent: "center" }}>
                                                    <div style={{ display: "flex" }}>
                                                        Consignor: <b style={{ paddingLeft: "2px" }}>{docket?.Customer_Name}</b>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>GST No : <b>{docket?.Gst_No}</b></div>
                                                        <div>Mobile No: <b>(+91) {docket?.Customer_Mob}</b></div>
                                                    </div>
                                                    <div style={{ display: "flex" }}>
                                                        Adress: <b style={{ paddingLeft: "2px" }}>{docket?.Customer_Add1},{docket?.Customer_Add2},{docket?.Customer_Add3},{docket?.Customer_State_Name}-{docket?.Pin_Code}</b>
                                                    </div>

                                                </div>
                                                <div className='box2 ' style={{ width: "35%", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", lineHeight: "1.1", justifyContent: "center" }}>
                                                    <div style={{ display: "flex" }}>
                                                        Consignee: <b style={{ paddingLeft: "2px" }}>{docket?.Consignee_Name}</b>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>GST No : <b>{docket?.Consignee_GST}</b></div>
                                                        <div>Mobile No: <b>(+91) {docket?.Consignee_Mob}</b></div>
                                                    </div>
                                                    <div style={{ display: "flex" }}>
                                                        Adress: <b style={{ paddingLeft: "2px" }}>{docket?.Consignee_Add1},{docket?.Consignee_Add2},{docket?.Consignee_State_Name}-{docket?.Consignee_Pin}</b>
                                                    </div>
                                                </div>
                                                <div className='box3 px-5' style={{ width: "30%", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", lineHeight: "1", fontSize: "14px", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                                    Insurance	details	is	not
                                                    available	or	not	insured
                                                </div>
                                            </div>
                                            <div className='div4' style={{ fontSize: "10px", width: "100%", display: "flex", color: "black", marginTop: "2px", gap: "3px" }}>
                                                <div className='box1 p-0' style={{ width: "70%", border: "1px solid silver", borderRadius: "5px", lineHeight: "1.1" }}>
                                                    <div className="haed" style={{
                                                        textAlign: "center",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        borderBottom: "1px solid silver",
                                                        fontWeight: "bold",
                                                        marginTop: "5px",
                                                    }}>
                                                        <div style={{ width: "5%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}>S.NO</div>
                                                        <div style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}> Product / Material</div>
                                                        <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}>Packaging Type (LxBxH)</div>
                                                        <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}>HSN	Code</div>
                                                        <div style={{ width: "9%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}> Articles Packages</div>
                                                        <div style={{ width: "8%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}> Actual Weight</div>
                                                        <div style={{ width: "8%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}> Charge Weight</div>
                                                        <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}> Freight	Rate</div>
                                                    </div>
                                                    <div className="bodyTable" style={{
                                                        textAlign: "center",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        borderBottom: "1px solid silver",
                                                        minHeight: "230px",
                                                    }}>
                                                        <div style={{ width: "5%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}>1</div>
                                                        <div style={{ width: "30%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}> Proper Roll</div>
                                                        <div style={{ width: "15%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}>Roll</div>
                                                        <div style={{ width: "15%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}>HDT123</div>
                                                        <div style={{ width: "9%", display: "flex", gap: "5px", flexDirection: "column", brderRight: "1px solid silver", paddingTop: "8px" }}> 1</div>
                                                        <div style={{ width: "8%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}> 10</div>
                                                        <div style={{ width: "8%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}> 20</div>
                                                        <div style={{ width: "10%", display: "flex", gap: "5px", flexDirection: "column", paddingTop: "8px" }}> 35000</div>
                                                    </div>
                                                    <div className="total" style={{
                                                        textAlign: "center",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        borderBottom: "1px solid silver",
                                                        height: "30px",

                                                    }}>
                                                        <div style={{ width: "5%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}>S.NO</div>
                                                        <div style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver", fontWeight: "bold" }}> WEIGHT	GUARANTEE: 60kg</div>
                                                        <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}></div>
                                                        <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}></div>
                                                        <div style={{ width: "9%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver", fontWeight: "bold" }}> Total: 1</div>
                                                        <div style={{ width: "8%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver", fontWeight: "bold" }}>Total: 60kg</div>
                                                        <div style={{ width: "8%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver", fontWeight: "bold" }}> Total: 60kg</div>
                                                        <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}> </div>
                                                    </div>
                                                    <div className="end" style={{
                                                        textAlign: "center",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        height: "50px",
                                                        fontSize: "13px",
                                                        marginBottom: "5px"

                                                    }}>
                                                        <div style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}></div>
                                                        <div style={{ width: "50%", display: "flex", alignItems: "center", borderRight: "1px solid silver", fontWeight: "bold", paddingLeft: "2px" }}> Other Remarks :</div>

                                                    </div>

                                                </div>
                                                <div className='box2 p-0' style={{ width: "30%", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "2px", lineHeight: "1.1" }}>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}>Total	Basic	Freight</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>3500</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Packing	&	Unpacking	Charge</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Pickup	Charges	&	Door	Delivery	Charges</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}>  Service	Charge</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Loading	Charges	&	Unloading	Charge</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Cash	On	Delivery(COD)	&	Delivery	On	Date(DOD)</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Other	Charges</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Subtotal</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>3600</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}>  GST	TAX	(SGST	0.0%)</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}>  GST	TAX	(CGST	0.0%)</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Total	Freight</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>3600</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}>  Advance	Paid</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Remaining	Payable	Amount</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>3600</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold", alignItems: "end", paddingLeft: "2px" }}>
                                                        GST	Payable	by:	Consignee
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold", alignItems: "end", paddingLeft: "2px" }}>
                                                        Remaining	Amount	to	be	paid	by:	Consignor
                                                    </div>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "35px", alignItems: "center", marginTop: "10px" }}>
                                                        <div> For	SHREE	RADHE	LOGISTICS	SOLUTIONS</div>
                                                        <div> Authorized	Signatory</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='div5' style={{ fontSize: "10px", width: "100%", height: "40px", display: "flex", color: "black", marginTop: "2px", gap: "3px" }}>
                                                <div className='box1 ' style={{ width: "35%", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", lineHeight: "1.1", justifyContent: "center" }}>
                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        Bank	Name: <b style={{ paddingLeft: "2px" }}>UNION	BANK	OF	INDIA	</b>
                                                    </div>

                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        Bank	A/C	No: <b style={{ paddingLeft: "2px" }}>043021010000105	</b>
                                                    </div>

                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        IFSC: <b style={{ paddingLeft: "2px" }}>	UBIN0904309</b>
                                                    </div>

                                                </div>
                                                <div className='box2 px-5' style={{display:"flex",alignItems:"center",justifyContent:"center", width: "35%", border: "1px solid silver", borderRadius: "5px", lineHeight: "1.1", textAlign:"center",fontSize: "14px" }}>
                                                    Total	amount	of	goods	is	11500
                                                    This	is	computer	generated	LR/	Bilty.
                                                </div>
                                                <div className='box3 px-5' style={{ width: "30%", display: "flex", flexDirection: "column",gap:"2px", border: "1px solid silver", borderRadius: "5px", lineHeight: "1",  justifyContent: "center",}}>
                                                   <div style={{ display: "flex", justifyContent: "center" ,fontWeight:"bold"}}>
                                                         Schedule	of	demurrage	charges	
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "center" ,whiteSpace:"nowrap"}}>
                                                        Demurrage	charges	applicable	from	reporting	time	after:	 <b style={{ paddingLeft: "2px" }}>1 hour</b>
                                                    </div>

                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        Applicable	Charge: <b style={{ paddingLeft: "2px" }}>₹	0	Per	Hour	</b>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                         <div className="container-2" style={{ borderRadius: "0px", width: "995px", border: "none", display: "flex", fontSize: "12px", flexDirection: "column",marginBottom:"50px" }}>
                                            <div className='div1' style={{ width: "100%", height: "80px", display: "flex", color: "black", gap: "10px" }}>
                                                <div className='logo' style={{
                                                    width: "15%", display: "flex",

                                                }}>
                                                    <img src={getBranch.Branch_Logo} alt="" style={{ width: "100%", height: "100%" }} />
                                                </div>
                                                <div className='heading' style={{ width: "85%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", fontWeight: "bolder", fontSize: "25px" }}>
                                                        {getBranch?.Company_Name}
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "start", lineHeight: "1.1" }}>
                                                            <div>{getBranch?.Branch_Add1}</div>
                                                            <div>{getBranch?.Branch_Add2}</div>
                                                            <div>{getBranch?.State_Name}-{getBranch?.Branch_PIN}</div>

                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "end", lineHeight: "1.1" }}>
                                                            <div>(+91) {getBranch?.MobileNo}</div>
                                                            <div>{getBranch?.Email}</div>
                                                            <div>{getBranch?.GSTNo}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='div2' style={{ width: "100%", height: "60px", display: "flex", color: "black", marginTop: "2px", gap: "3px" }}>
                                                <div className='box1' style={{ width: "45%", height: "100%", padding: "0px", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px" }}>
                                                    <div style={{ textAlign: "center" }}><b>Notice</b></div>
                                                    <div className='px-1' style={{ display: "flex", justifyContent: "center", lineHeight: "1" }}> Without	the	consignee's	written	permission	this	consignment	will	not	be	diverted,	re
                                                        routed,	or	rebooked	and	it	should	be	delivered	at	the	destination.	Lorry	Receipt	will	be
                                                        delivered	to	the	only	consignee.</div>
                                                </div>
                                                <div className='box2' style={{ width: "20%", height: "100%", padding: "5px", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", justifyContent: "center", lineHeight: "1" }}>
                                                    <div style={{ textDecoration: "under" }}><b>AT	OWNER'S	RISK</b></div>
                                                    <div>GST No: <b>27CSLPS2533K1Z8</b></div>
                                                    <div>PAN No: <b>CSLPS2533K</b></div>

                                                </div>
                                                <div className='box3 p-1' style={{ width: "35%", padding: "0px", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", lineHeight: "1", justifyContent: "center" }}>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>LR	Date: <b>31-10-2025</b></div>
                                                        <div>LR	No: <b>38</b></div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>LTruck/Vehicle	No : <b>BY	RAIL</b></div>
                                                        <div>Transport	Mode: <b>By	Rail</b></div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>From: <b>Mumbai</b></div>
                                                        <div>To: <b>Delhi</b></div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>Delivery	Type: <b>Door</b></div>
                                                        <div>Payment	Status: <b>Paid</b></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='div3' style={{ fontSize: "10px", width: "100%", height: "60px", display: "flex", color: "black", marginTop: "2px", gap: "3px" }}>
                                                <div className='box1 ' style={{ width: "35%", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", lineHeight: "1.1", justifyContent: "center" }}>
                                                    <div style={{ display: "flex" }}>
                                                        Consignor: <b style={{ paddingLeft: "2px" }}>{docket?.Customer_Name}</b>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>GST No : <b>{docket?.Gst_No}</b></div>
                                                        <div>Mobile No: <b>(+91) {docket?.Customer_Mob}</b></div>
                                                    </div>
                                                    <div style={{ display: "flex" }}>
                                                        Adress: <b style={{ paddingLeft: "2px" }}>{docket?.Customer_Add1},{docket?.Customer_Add2},{docket?.Customer_Add3},{docket?.Customer_State_Name}-{docket?.Pin_Code}</b>
                                                    </div>

                                                </div>
                                                <div className='box2 ' style={{ width: "35%", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", lineHeight: "1.1", justifyContent: "center" }}>
                                                    <div style={{ display: "flex" }}>
                                                        Consignee: <b style={{ paddingLeft: "2px" }}>{docket?.Consignee_Name}</b>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "20px" }}>
                                                        <div>GST No : <b>{docket?.Consignee_GST}</b></div>
                                                        <div>Mobile No: <b>(+91) {docket?.Consignee_Mob}</b></div>
                                                    </div>
                                                    <div style={{ display: "flex" }}>
                                                        Adress: <b style={{ paddingLeft: "2px" }}>{docket?.Consignee_Add1},{docket?.Consignee_Add2},{docket?.Consignee_State_Name}-{docket?.Consignee_Pin}</b>
                                                    </div>
                                                </div>
                                                <div className='box3 px-5' style={{ width: "30%", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", lineHeight: "1", fontSize: "14px", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                                    Insurance	details	is	not
                                                    available	or	not	insured
                                                </div>
                                            </div>
                                            <div className='div4' style={{ fontSize: "10px", width: "100%", display: "flex", color: "black", marginTop: "2px", gap: "3px" }}>
                                                <div className='box1 p-0' style={{ width: "70%", border: "1px solid silver", borderRadius: "5px", lineHeight: "1.1" }}>
                                                    <div className="haed" style={{
                                                        textAlign: "center",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        borderBottom: "1px solid silver",
                                                        fontWeight: "bold",
                                                        marginTop: "5px",
                                                    }}>
                                                        <div style={{ width: "5%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}>S.NO</div>
                                                        <div style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}> Product / Material</div>
                                                        <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}>Packaging Type (LxBxH)</div>
                                                        <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}>HSN	Code</div>
                                                        <div style={{ width: "9%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}> Articles Packages</div>
                                                        <div style={{ width: "8%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}> Actual Weight</div>
                                                        <div style={{ width: "8%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}> Charge Weight</div>
                                                        <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}> Freight	Rate</div>
                                                    </div>
                                                    <div className="bodyTable" style={{
                                                        textAlign: "center",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        borderBottom: "1px solid silver",
                                                        minHeight: "230px",
                                                    }}>
                                                        <div style={{ width: "5%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}>1</div>
                                                        <div style={{ width: "30%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}> Proper Roll</div>
                                                        <div style={{ width: "15%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}>Roll</div>
                                                        <div style={{ width: "15%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}>HDT123</div>
                                                        <div style={{ width: "9%", display: "flex", gap: "5px", flexDirection: "column", brderRight: "1px solid silver", paddingTop: "8px" }}> 1</div>
                                                        <div style={{ width: "8%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}> 10</div>
                                                        <div style={{ width: "8%", display: "flex", gap: "5px", flexDirection: "column", borderRight: "1px solid silver", paddingTop: "8px" }}> 20</div>
                                                        <div style={{ width: "10%", display: "flex", gap: "5px", flexDirection: "column", paddingTop: "8px" }}> 35000</div>
                                                    </div>
                                                    <div className="total" style={{
                                                        textAlign: "center",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        borderBottom: "1px solid silver",
                                                        height: "30px",

                                                    }}>
                                                        <div style={{ width: "5%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}>S.NO</div>
                                                        <div style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver", fontWeight: "bold" }}> WEIGHT	GUARANTEE: 60kg</div>
                                                        <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}></div>
                                                        <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}></div>
                                                        <div style={{ width: "9%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver", fontWeight: "bold" }}> Total: 1</div>
                                                        <div style={{ width: "8%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver", fontWeight: "bold" }}>Total: 60kg</div>
                                                        <div style={{ width: "8%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver", fontWeight: "bold" }}> Total: 60kg</div>
                                                        <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}> </div>
                                                    </div>
                                                    <div className="end" style={{
                                                        textAlign: "center",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        height: "50px",
                                                        fontSize: "13px",
                                                        marginBottom: "5px"

                                                    }}>
                                                        <div style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid silver" }}></div>
                                                        <div style={{ width: "50%", display: "flex", alignItems: "center", borderRight: "1px solid silver", fontWeight: "bold", paddingLeft: "2px" }}> Other Remarks :</div>

                                                    </div>

                                                </div>
                                                <div className='box2 p-0' style={{ width: "30%", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "2px", lineHeight: "1.1" }}>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}>Total	Basic	Freight</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>3500</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Packing	&	Unpacking	Charge</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Pickup	Charges	&	Door	Delivery	Charges</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}>  Service	Charge</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Loading	Charges	&	Unloading	Charge</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Cash	On	Delivery(COD)	&	Delivery	On	Date(DOD)</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Other	Charges</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Subtotal</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>3600</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}>  GST	TAX	(SGST	0.0%)</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}>  GST	TAX	(CGST	0.0%)</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Total	Freight</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>3600</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}>  Advance	Paid</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>0</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold" }}>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "80%", borderRight: "1px solid silver", paddingRight: "2px", alignItems: "end" }}> Remaining	Payable	Amount</div>
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%", paddingRight: "5px", alignItems: "end" }}>3600</div>
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold", alignItems: "end", paddingLeft: "2px" }}>
                                                        GST	Payable	by:	Consignee
                                                    </div>
                                                    <div style={{ display: "flex", borderBottom: "1px solid silver", height: "17px", fontWeight: "bold", alignItems: "end", paddingLeft: "2px" }}>
                                                        Remaining	Amount	to	be	paid	by:	Consignor
                                                    </div>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "35px", alignItems: "center", marginTop: "10px" }}>
                                                        <div> For	SHREE	RADHE	LOGISTICS	SOLUTIONS</div>
                                                        <div> Authorized	Signatory</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='div5' style={{ fontSize: "10px", width: "100%", height: "40px", display: "flex", color: "black", marginTop: "2px", gap: "3px" }}>
                                                <div className='box1 ' style={{ width: "35%", display: "flex", flexDirection: "column", border: "1px solid silver", borderRadius: "5px", lineHeight: "1.1", justifyContent: "center" }}>
                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        Bank	Name: <b style={{ paddingLeft: "2px" }}>UNION	BANK	OF	INDIA	</b>
                                                    </div>

                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        Bank	A/C	No: <b style={{ paddingLeft: "2px" }}>043021010000105	</b>
                                                    </div>

                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        IFSC: <b style={{ paddingLeft: "2px" }}>	UBIN0904309</b>
                                                    </div>

                                                </div>
                                                <div className='box2 px-5' style={{display:"flex",alignItems:"center",justifyContent:"center", width: "35%", border: "1px solid silver", borderRadius: "5px", lineHeight: "1.1", textAlign:"center",fontSize: "14px" }}>
                                                    Total	amount	of	goods	is	11500
                                                    This	is	computer	generated	LR/	Bilty.
                                                </div>
                                                <div className='box3 px-5' style={{ width: "30%", display: "flex", flexDirection: "column",gap:"2px", border: "1px solid silver", borderRadius: "5px", lineHeight: "1",  justifyContent: "center",}}>
                                                   <div style={{ display: "flex", justifyContent: "center" ,fontWeight:"bold"}}>
                                                         Schedule	of	demurrage	charges	
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "center" ,whiteSpace:"nowrap"}}>
                                                        Demurrage	charges	applicable	from	reporting	time	after:	 <b style={{ paddingLeft: "2px" }}>1 hour</b>
                                                    </div>

                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        Applicable	Charge: <b style={{ paddingLeft: "2px" }}>₹	0	Per	Hour	</b>
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

export default NewDP2;