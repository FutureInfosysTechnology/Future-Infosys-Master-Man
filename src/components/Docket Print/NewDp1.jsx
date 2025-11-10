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

function NewDP1() {
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

        pdf.save("NewDp.pdf");
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
                                        <div className="container-2" style={{ borderRadius: "0px", width: "800px", border: "none", display: "flex", fontSize: "12px", flexDirection: "column", marginBottom: "10px" }}>
                                            <div className='div1' style={{ width: "100%", height: "80px", border: "2px solid black", display: "flex", color: "black" }}>
                                                <div className='logo' style={{ width: "35%", height: "100%", fontSize: "10px", padding: "5px", display: "flex", flexDirection: "column", gap: "5px", borderRight: "2px solid black" }}>
                                                    <img src={getBranch.Branch_Logo} alt="" style={{ width: "100%", height: "75%" }} />
                                                    <div style={{ display: "flex", height: "20%", width: "100%", justifyContent: "space-around" }}>
                                                        <div><b>GST No :</b> {getBranch?.GSTNo}</div>
                                                        <div><b>Website :</b> {getBranch?.Website}</div>
                                                    </div>
                                                </div>
                                                <div className='heading' style={{ width: "66%", height: "100%", display: "flex", flexDirection: "column" }}>
                                                    <div style={{ height: "60%", borderBottom: "2px solid black", display: "flex", flexDirection: "column" }}>
                                                        <div style={{ height: "50%", borderBottom: "2px solid black", display: "flex", fontWeight: "bold" }}>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                Origin
                                                            </div>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                Destination
                                                            </div>
                                                            <div style={{ width: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                BKD Date
                                                            </div>
                                                        </div>
                                                        <div style={{ height: "50%", display: "flex" }}>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                {docket?.Destination_Name}
                                                            </div>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                {docket?.Destination_Name}
                                                            </div>
                                                            <div style={{ width: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                {docket?.BookDate}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ height: "40%", display: "flex" }}>
                                                        <div style={{ height: "100%", width: "60%", borderRight: "2px solid black", display: "flex", alignItems: "center", paddingLeft: "10px" }}>
                                                            <div><b>Crossing :</b> {docket?.Vendor_Name}</div>
                                                        </div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", alignItems: "center", paddingLeft: "10px" }}>
                                                            <div><b>Crs No :</b> {docket?.vendorAwbno} </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='div2' style={{ width: "100%", border: "2px solid black", borderTop: "none", display: "flex", color: "black" }}>
                                                <div className='Consignor' style={{ width: "50%", height: "100%", padding: "5px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "2px solid black" }}>
                                                    <div><b>Consignor :</b> {docket?.Customer_Name}</div>
                                                    <div><b>Adress :</b> {docket?.Customer_Add1},{docket?.Customer_Add2},{docket?.Customer_Add3},{docket?.Pin_Code},{docket?.Customer_State_Name}</div>
                                                </div>
                                                <div className='Consignee' style={{ width: "50%", height: "100%", padding: "5px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                    <div><b>Consignee :</b> {docket?.Consignee_Name}</div>
                                                    <div><b>Adress :</b> {docket?.Consignee_Add1},{docket?.Consignee_Add2},{docket?.Consignee_Pin},{docket?.Consignee_State_Name}</div>
                                                </div>
                                            </div>
                                            <div className='div3' style={{ width: "100%", border: "2px solid black", borderTop: "none", display: "flex", color: "black" }}>
                                                <div className='barcode' style={{ width: "75%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "2px solid black" }}>
                                                    <div style={{ height: "55%", width: "100%", borderBottom: "2px solid black", display: "flex" }}>
                                                        <div style={{ width: "45%", borderRight: "2px solid black" }}>
                                                            <div style={{ width: "100%", height: "15%", borderBottom: "2px solid black", fontWeight: "bold", display: "flex" }}>
                                                                <div style={{ width: "20%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>PKGS</div>
                                                                <div style={{ width: "25%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>Packing</div>
                                                                <div style={{ width: "55%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>Value LXBXH</div>
                                                            </div>
                                                            <div style={{ width: "100%", height: "30%", borderBottom: "2px solid black", display: "flex" }}>
                                                                <div style={{ width: "20%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>{docket?.Qty}</div>
                                                                <div style={{ width: "25%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>description</div>
                                                                <div style={{ width: "55%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>
                                                                    <div style={{ height: "100%", width: "33%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>10</div>
                                                                    <div style={{ height: "100%", width: "33%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>20</div>
                                                                    <div style={{ height: "100%", width: "33%", display: "flex", justifyContent: "center", alignItems: "center" }}>30</div>
                                                                </div>
                                                            </div>
                                                            <div style={{ width: "100%", height: "15%", borderBottom: "2px solid black", display: "flex" }}>
                                                                <div style={{ width: "30%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>Actual Wt</div>
                                                                <div style={{ width: "20%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>{docket?.ActualWt}</div>
                                                                <div style={{ width: "30%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>Charged Wt</div>
                                                                <div style={{ width: "20%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>{docket?.ChargedWt}</div>
                                                            </div>
                                                            <div style={{ width: "100%", height: "40%", display: "flex", padding: "5px" }}>
                                                                <b>Declared value as : </b>
                                                                {docket?.InvValue}
                                                            </div>
                                                        </div>
                                                        <div style={{ width: "55%", height: "100%" }}>
                                                            <div style={{ width: "100%", height: "15%", borderBottom: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>Consignment Number</div>
                                                            <div style={{ display: "flex", justifyContent: "center", borderBottom: "2px solid black", }}>  <BarCode
                                                                value={docket?.vendorAwbno}
                                                                format='CODE128'
                                                                background='#fff'
                                                                lineColor='#000'
                                                                width={3}
                                                                height={30}
                                                                displayValue={true}
                                                            /></div>

                                                            <div style={{ width: "100%", height: "75%", padding: "5px" }}> iousogshiohgoih kldkflhflkhd
                                                                iodsvofihdgihgdiof nlbdfjdlbjldfj
                                                                kivlidhfdfhbofhidon npofpjfopjdof
                                                                nvdlihoigshoifdbf
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ height: "46%", width: "100%", display: "flex" }}>
                                                        <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "5px" }}>
                                                            <div style={{}}><b>Invoice No :</b>{docket?.InvoiceNo}</div>
                                                            <div style={{ fontWeight: "bold", fontSize: "15px" }}>Uninnsured Shipment</div>
                                                        </div>
                                                        <div style={{ width: "50%", borderRight: "2px solid black", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "5px" }}>
                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                <b>CONSIGNEE SIGNATURE & RUBBER STAMP</b>
                                                                <div style={{ display: "flex", width: "100%" }}>
                                                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                                                        <b>Name</b>
                                                                        <div>Arbaz</div>
                                                                    </div>
                                                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                                                        <b>Date</b>
                                                                        <div>01/02/2025</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div >Received in good order and conditional ....A.M./P.M.</div>
                                                        </div>
                                                        <div style={{ width: "20%", fontWeight: "bold" }}>
                                                            <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "40%", textAlign: "center" }}>
                                                                For {getBranch?.Company_Name}
                                                            </div>
                                                            <div style={{ width: "100%", height: "60%", textAlign: "center" }}>Authorised Signature</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='Chrgs' style={{ width: "25%" }}>
                                                    <div style={{ width: "100%", height: "9%", display: "flex", borderBottom: "2px solid black", fontWeight: "bold" }}>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>PAID</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>T_Flag</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Freight</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.Rate}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.T_Flag}</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Fuel</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.FuelCharges}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Fov</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.FuelCharges}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Docket</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.DocketChrgs}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Hamali</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.HamaliChrgs}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>CGST</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.CGSTPer}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.CGSTAMT}</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>SGST</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.SGSTPer}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.SGSTAMT}</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "12%", display: "flex" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Total</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.TotalAmt}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='div4' style={{ width: "100%", height: "20px", border: "2px solid black", borderTop: "none", display: "flex", color: "black", display: "flex", justifyContent: "center", gap: "10px" }}>
                                                <div>{getBranch?.Branch_Add1},{getBranch?.Branch_Add2},{getBranch?.Branch_PIN}</div>
                                                <div><b>Mob:</b> (+91) {getBranch?.MobileNo}</div>
                                                <div><b>Email :</b> {getBranch?.Email}</div>
                                            </div>
                                        </div>
                                        <div className="container-2" style={{ borderRadius: "0px", width: "800px", border: "none", display: "flex", fontSize: "12px", flexDirection: "column", marginBottom: "10px" }}>
                                            <div className='div1' style={{ width: "100%", height: "80px", border: "2px solid black", display: "flex", color: "black" }}>
                                                <div className='logo' style={{ width: "35%", height: "100%", fontSize: "10px", padding: "5px", display: "flex", flexDirection: "column", gap: "5px", borderRight: "2px solid black" }}>
                                                    <img src={getBranch.Branch_Logo} alt="" style={{ width: "100%", height: "75%" }} />
                                                    <div style={{ display: "flex", height: "20%", width: "100%", justifyContent: "space-around" }}>
                                                        <div><b>GST No :</b> {getBranch?.GSTNo}</div>
                                                        <div><b>Website :</b> {getBranch?.Website}</div>
                                                    </div>
                                                </div>
                                                <div className='heading' style={{ width: "66%", height: "100%", display: "flex", flexDirection: "column" }}>
                                                    <div style={{ height: "60%", borderBottom: "2px solid black", display: "flex", flexDirection: "column" }}>
                                                        <div style={{ height: "50%", borderBottom: "2px solid black", display: "flex", fontWeight: "bold" }}>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                Origin
                                                            </div>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                Destination
                                                            </div>
                                                            <div style={{ width: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                BKD Date
                                                            </div>
                                                        </div>
                                                        <div style={{ height: "50%", display: "flex" }}>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                {docket?.Destination_Name}
                                                            </div>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                {docket?.Destination_Name}
                                                            </div>
                                                            <div style={{ width: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                {docket?.BookDate}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ height: "40%", display: "flex" }}>
                                                        <div style={{ height: "100%", width: "60%", borderRight: "2px solid black", display: "flex", alignItems: "center", paddingLeft: "10px" }}>
                                                            <div><b>Crossing :</b> {docket?.Vendor_Name}</div>
                                                        </div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", alignItems: "center", paddingLeft: "10px" }}>
                                                            <div><b>Crs No :</b> {docket?.vendorAwbno} </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='div2' style={{ width: "100%", border: "2px solid black", borderTop: "none", display: "flex", color: "black" }}>
                                                <div className='Consignor' style={{ width: "50%", height: "100%", padding: "5px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "2px solid black" }}>
                                                    <div><b>Consignor :</b> {docket?.Customer_Name}</div>
                                                    <div><b>Adress :</b> {docket?.Customer_Add1},{docket?.Customer_Add2},{docket?.Customer_Add3},{docket?.Pin_Code},{docket?.Customer_State_Name}</div>
                                                </div>
                                                <div className='Consignee' style={{ width: "50%", height: "100%", padding: "5px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                    <div><b>Consignee :</b> {docket?.Consignee_Name}</div>
                                                    <div><b>Adress :</b> {docket?.Consignee_Add1},{docket?.Consignee_Add2},{docket?.Consignee_Pin},{docket?.Consignee_State_Name}</div>
                                                </div>
                                            </div>
                                            <div className='div3' style={{ width: "100%", border: "2px solid black", borderTop: "none", display: "flex", color: "black" }}>
                                                <div className='barcode' style={{ width: "75%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "2px solid black" }}>
                                                    <div style={{ height: "55%", width: "100%", borderBottom: "2px solid black", display: "flex" }}>
                                                        <div style={{ width: "45%", borderRight: "2px solid black" }}>
                                                            <div style={{ width: "100%", height: "15%", borderBottom: "2px solid black", fontWeight: "bold", display: "flex" }}>
                                                                <div style={{ width: "20%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>PKGS</div>
                                                                <div style={{ width: "25%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>Packing</div>
                                                                <div style={{ width: "55%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>Value LXBXH</div>
                                                            </div>
                                                            <div style={{ width: "100%", height: "30%", borderBottom: "2px solid black", display: "flex" }}>
                                                                <div style={{ width: "20%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>{docket?.Qty}</div>
                                                                <div style={{ width: "25%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>description</div>
                                                                <div style={{ width: "55%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>
                                                                    <div style={{ height: "100%", width: "33%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>10</div>
                                                                    <div style={{ height: "100%", width: "33%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>20</div>
                                                                    <div style={{ height: "100%", width: "33%", display: "flex", justifyContent: "center", alignItems: "center" }}>30</div>
                                                                </div>
                                                            </div>
                                                            <div style={{ width: "100%", height: "15%", borderBottom: "2px solid black", display: "flex" }}>
                                                                <div style={{ width: "30%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>Actual Wt</div>
                                                                <div style={{ width: "20%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>{docket?.ActualWt}</div>
                                                                <div style={{ width: "30%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>Charged Wt</div>
                                                                <div style={{ width: "20%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>{docket?.ChargedWt}</div>
                                                            </div>
                                                            <div style={{ width: "100%", height: "40%", display: "flex", padding: "5px" }}>
                                                                <b>Declared value as : </b>
                                                                {docket?.InvValue}
                                                            </div>
                                                        </div>
                                                        <div style={{ width: "55%", height: "100%" }}>
                                                            <div style={{ width: "100%", height: "15%", borderBottom: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>Consignment Number</div>
                                                            <div style={{ display: "flex", justifyContent: "center", borderBottom: "2px solid black", }}>  <BarCode
                                                                value={docket?.vendorAwbno}
                                                                format='CODE128'
                                                                background='#fff'
                                                                lineColor='#000'
                                                                width={3}
                                                                height={30}
                                                                displayValue={true}
                                                            /></div>

                                                            <div style={{ width: "100%", height: "75%", padding: "5px" }}> iousogshiohgoih kldkflhflkhd
                                                                iodsvofihdgihgdiof nlbdfjdlbjldfj
                                                                kivlidhfdfhbofhidon npofpjfopjdof
                                                                nvdlihoigshoifdbf
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ height: "46%", width: "100%", display: "flex" }}>
                                                        <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "5px" }}>
                                                            <div style={{}}><b>Invoice No :</b>{docket?.InvoiceNo}</div>
                                                            <div style={{ fontWeight: "bold", fontSize: "15px" }}>Uninnsured Shipment</div>
                                                        </div>
                                                        <div style={{ width: "50%", borderRight: "2px solid black", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "5px" }}>
                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                <b>CONSIGNEE SIGNATURE & RUBBER STAMP</b>
                                                                <div style={{ display: "flex", width: "100%" }}>
                                                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                                                        <b>Name</b>
                                                                        <div>Arbaz</div>
                                                                    </div>
                                                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                                                        <b>Date</b>
                                                                        <div>01/02/2025</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div >Received in good order and conditional ....A.M./P.M.</div>
                                                        </div>
                                                        <div style={{ width: "20%", fontWeight: "bold" }}>
                                                            <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "40%", textAlign: "center" }}>
                                                                For {getBranch?.Company_Name}
                                                            </div>
                                                            <div style={{ width: "100%", height: "60%", textAlign: "center" }}>Authorised Signature</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='Chrgs' style={{ width: "25%" }}>
                                                    <div style={{ width: "100%", height: "9%", display: "flex", borderBottom: "2px solid black", fontWeight: "bold" }}>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>PAID</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>T_Flag</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Freight</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.Rate}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.T_Flag}</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Fuel</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.FuelCharges}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Fov</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.FuelCharges}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Docket</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.DocketChrgs}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Hamali</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.HamaliChrgs}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>CGST</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.CGSTPer}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.CGSTAMT}</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>SGST</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.SGSTPer}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.SGSTAMT}</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "12%", display: "flex" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Total</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.TotalAmt}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='div4' style={{ width: "100%", height: "20px", border: "2px solid black", borderTop: "none", display: "flex", color: "black", display: "flex", justifyContent: "center", gap: "10px" }}>
                                                <div>{getBranch?.Branch_Add1},{getBranch?.Branch_Add2},{getBranch?.Branch_PIN}</div>
                                                <div><b>Mob:</b> (+91) {getBranch?.MobileNo}</div>
                                                <div><b>Email :</b> {getBranch?.Email}</div>
                                            </div>
                                        </div>
                                        <div className="container-2" style={{ borderRadius: "0px", width: "800px", border: "none", display: "flex", fontSize: "12px", flexDirection: "column", marginBottom: "10px" }}>
                                            <div className='div1' style={{ width: "100%", height: "80px", border: "2px solid black", display: "flex", color: "black" }}>
                                                <div className='logo' style={{ width: "35%", height: "100%", fontSize: "10px", padding: "5px", display: "flex", flexDirection: "column", gap: "5px", borderRight: "2px solid black" }}>
                                                    <img src={getBranch.Branch_Logo} alt="" style={{ width: "100%", height: "75%" }} />
                                                    <div style={{ display: "flex", height: "20%", width: "100%", justifyContent: "space-around" }}>
                                                        <div><b>GST No :</b> {getBranch?.GSTNo}</div>
                                                        <div><b>Website :</b> {getBranch?.Website}</div>
                                                    </div>
                                                </div>
                                                <div className='heading' style={{ width: "66%", height: "100%", display: "flex", flexDirection: "column" }}>
                                                    <div style={{ height: "60%", borderBottom: "2px solid black", display: "flex", flexDirection: "column" }}>
                                                        <div style={{ height: "50%", borderBottom: "2px solid black", display: "flex", fontWeight: "bold" }}>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                Origin
                                                            </div>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                Destination
                                                            </div>
                                                            <div style={{ width: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                BKD Date
                                                            </div>
                                                        </div>
                                                        <div style={{ height: "50%", display: "flex" }}>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                {docket?.Destination_Name}
                                                            </div>
                                                            <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                {docket?.Destination_Name}
                                                            </div>
                                                            <div style={{ width: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                {docket?.BookDate}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ height: "40%", display: "flex" }}>
                                                        <div style={{ height: "100%", width: "60%", borderRight: "2px solid black", display: "flex", alignItems: "center", paddingLeft: "10px" }}>
                                                            <div><b>Crossing :</b> {docket?.Vendor_Name}</div>
                                                        </div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", alignItems: "center", paddingLeft: "10px" }}>
                                                            <div><b>Crs No :</b> {docket?.vendorAwbno} </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='div2' style={{ width: "100%", border: "2px solid black", borderTop: "none", display: "flex", color: "black" }}>
                                                <div className='Consignor' style={{ width: "50%", height: "100%", padding: "5px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "2px solid black" }}>
                                                    <div><b>Consignor :</b> {docket?.Customer_Name}</div>
                                                    <div><b>Adress :</b> {docket?.Customer_Add1},{docket?.Customer_Add2},{docket?.Customer_Add3},{docket?.Pin_Code},{docket?.Customer_State_Name}</div>
                                                </div>
                                                <div className='Consignee' style={{ width: "50%", height: "100%", padding: "5px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                    <div><b>Consignee :</b> {docket?.Consignee_Name}</div>
                                                    <div><b>Adress :</b> {docket?.Consignee_Add1},{docket?.Consignee_Add2},{docket?.Consignee_Pin},{docket?.Consignee_State_Name}</div>
                                                </div>
                                            </div>
                                            <div className='div3' style={{ width: "100%", border: "2px solid black", borderTop: "none", display: "flex", color: "black" }}>
                                                <div className='barcode' style={{ width: "75%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "2px solid black" }}>
                                                    <div style={{ height: "55%", width: "100%", borderBottom: "2px solid black", display: "flex" }}>
                                                        <div style={{ width: "45%", borderRight: "2px solid black" }}>
                                                            <div style={{ width: "100%", height: "15%", borderBottom: "2px solid black", fontWeight: "bold", display: "flex" }}>
                                                                <div style={{ width: "20%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>PKGS</div>
                                                                <div style={{ width: "25%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>Packing</div>
                                                                <div style={{ width: "55%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>Value LXBXH</div>
                                                            </div>
                                                            <div style={{ width: "100%", height: "30%", borderBottom: "2px solid black", display: "flex" }}>
                                                                <div style={{ width: "20%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>{docket?.Qty}</div>
                                                                <div style={{ width: "25%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>description</div>
                                                                <div style={{ width: "55%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>
                                                                    <div style={{ height: "100%", width: "33%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>10</div>
                                                                    <div style={{ height: "100%", width: "33%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>20</div>
                                                                    <div style={{ height: "100%", width: "33%", display: "flex", justifyContent: "center", alignItems: "center" }}>30</div>
                                                                </div>
                                                            </div>
                                                            <div style={{ width: "100%", height: "15%", borderBottom: "2px solid black", display: "flex" }}>
                                                                <div style={{ width: "30%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>Actual Wt</div>
                                                                <div style={{ width: "20%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", }}>{docket?.ActualWt}</div>
                                                                <div style={{ width: "30%", height: "100%", borderRight: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>Charged Wt</div>
                                                                <div style={{ width: "20%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>{docket?.ChargedWt}</div>
                                                            </div>
                                                            <div style={{ width: "100%", height: "40%", display: "flex", padding: "5px" }}>
                                                                <b>Declared value as : </b>
                                                                {docket?.InvValue}
                                                            </div>
                                                        </div>
                                                        <div style={{ width: "55%", height: "100%" }}>
                                                            <div style={{ width: "100%", height: "15%", borderBottom: "2px solid black", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>Consignment Number</div>
                                                            <div style={{ display: "flex", justifyContent: "center", borderBottom: "2px solid black", }}>  <BarCode
                                                                value={docket?.vendorAwbno}
                                                                format='CODE128'
                                                                background='#fff'
                                                                lineColor='#000'
                                                                width={3}
                                                                height={30}
                                                                displayValue={true}
                                                            /></div>

                                                            <div style={{ width: "100%", height: "75%", padding: "5px" }}> iousogshiohgoih kldkflhflkhd
                                                                iodsvofihdgihgdiof nlbdfjdlbjldfj
                                                                kivlidhfdfhbofhidon npofpjfopjdof
                                                                nvdlihoigshoifdbf
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ height: "46%", width: "100%", display: "flex" }}>
                                                        <div style={{ width: "30%", borderRight: "2px solid black", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "5px" }}>
                                                            <div style={{}}><b>Invoice No :</b>{docket?.InvoiceNo}</div>
                                                            <div style={{ fontWeight: "bold", fontSize: "15px" }}>Uninnsured Shipment</div>
                                                        </div>
                                                        <div style={{ width: "50%", borderRight: "2px solid black", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "5px" }}>
                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                <b>CONSIGNEE SIGNATURE & RUBBER STAMP</b>
                                                                <div style={{ display: "flex", width: "100%" }}>
                                                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                                                        <b>Name</b>
                                                                        <div>Arbaz</div>
                                                                    </div>
                                                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                                                        <b>Date</b>
                                                                        <div>01/02/2025</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div >Received in good order and conditional ....A.M./P.M.</div>
                                                        </div>
                                                        <div style={{ width: "20%", fontWeight: "bold" }}>
                                                            <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "40%", textAlign: "center" }}>
                                                                For {getBranch?.Company_Name}
                                                            </div>
                                                            <div style={{ width: "100%", height: "60%", textAlign: "center" }}>Authorised Signature</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='Chrgs' style={{ width: "25%" }}>
                                                    <div style={{ width: "100%", height: "9%", display: "flex", borderBottom: "2px solid black", fontWeight: "bold" }}>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>PAID</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>T_Flag</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Freight</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.Rate}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.T_Flag}</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Fuel</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.FuelCharges}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Fov</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.FuelCharges}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Docket</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.DocketChrgs}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Hamali</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.HamaliChrgs}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>CGST</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.CGSTPer}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.CGSTAMT}</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "11.47%", display: "flex", borderBottom: "2px solid black" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>SGST</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.SGSTPer}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.SGSTAMT}</div>
                                                    </div>
                                                    <div style={{ width: "100%", height: "12%", display: "flex" }}>
                                                        <div style={{ height: "100%", width: "30%", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Total</div>
                                                        <div style={{ height: "100%", width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{docket?.TotalAmt}</div>
                                                        <div style={{ height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='div4' style={{ width: "100%", height: "20px", border: "2px solid black", borderTop: "none", display: "flex", color: "black", display: "flex", justifyContent: "center", gap: "10px" }}>
                                                <div>{getBranch?.Branch_Add1},{getBranch?.Branch_Add2},{getBranch?.Branch_PIN}</div>
                                                <div><b>Mob:</b> (+91) {getBranch?.MobileNo}</div>
                                                <div><b>Email :</b> {getBranch?.Email}</div>
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

export default NewDP1;