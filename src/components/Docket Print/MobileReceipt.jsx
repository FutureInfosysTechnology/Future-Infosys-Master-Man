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


function MobileReceipt() {
    const [getBranch, setGetBranch] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const res = location?.state?.data || {};
    const f = res?.from || "DKT0036859";
    const t = res?.to || "DKT0037950";
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi(`/Booking/DocketReceipt?FromDocket=${f}&ToDocket=${t}`);
                if (response.status === 1) {
                    console.log(response.Data);
                    setData(response.Data);
                }
            }
            catch (error) {
                console.error("API Error:", error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [f, t])
    const from = data[0];
    const to=data[1];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi("/Master/getBranch");
                if (response.status === 1) {
                    console.log(response.Data);
                    setGetBranch(response.Data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])
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
        paddingLeft: "2px"
    }
    const tableStyle = {
        borderCollapse: "collapse"
    }

    // inside your MobileReceipt component
    const handleDownloadPDF = () => {
  const input = document.getElementById("pdf");
  if (!input) return;

  html2canvas(input, {
    scale: 2,
    useCORS: true,
    scrollY: 0,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210; // A4 width
    const pageHeight = 297; // A4 height
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 👇 Always stretch/shrink to fit one page
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pageHeight);

    pdf.save("receipt.pdf");
  });
};

    const BranchData = getBranch.length > 0 ? getBranch[1] : {};
    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="container">
                    <div className="container-2" id='pdf' style={{ borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "840px", direction: "flex", flexDirection: "column", gap: "5px" }}>

                        <div className="container-2" style={{ borderRadius: "0px", width: "800px", display: "flex", flexDirection: "column" }}>
                            <div className='div1' style={{ width: "100%", height: "90px", border: "2px solid black", display: "flex" }}>
                                <div className='logo' style={{ width: "24%", height: "100%" }}></div>
                                <div className='heading' style={{ width: "38%", height: "100%", display: "flex", flexDirection: "column", gap: "5px", alignItems: "start", marginTop: "5px" }}>
                                    <div style={{ fontSize: "14px", fontWeight: "bolder" }}>{BranchData?.Company_Name}</div>
                                    <div style={{ lineHeight: "1.2", fontSize: "10px", paddingRight: "10px" }}>{BranchData?.Branch_Add1}</div>
                                </div>
                                <div className='booking' style={{ width: "38%", height: "100%", display: "flex", flexDirection: "column" }}>
                                    <div style={{ paddingLeft: "5px", fontWeight: "bold", fontSize: "12px" }}>GST No: {BranchData?.GSTNo}</div>
                                    <table style={tableStyle}>
                                        <tbody >
                                            <tr>
                                                <td style={cellsStyle}>Booking Date:</td>
                                                <td style={cellsStyle}>{from?.BookDate}</td>
                                            </tr>
                                            <tr>
                                                <td style={cellsStyle}>Booking Branch:</td>
                                                <td style={cellsStyle}>{from?.Branch_Name}</td>
                                            </tr>
                                            <tr>
                                                <td style={cellsStyle}>Booking Mode:</td>
                                                <td style={cellsStyle}>
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                                                        <label htmlFor="" style={{ display: "flex", alignItems: "center" }}><input type="checkbox" checked={from?.Mode_Name === "RAIL"} /><span>RAIL</span></label>
                                                        <label htmlFor="" style={{ display: "flex", alignItems: "center" }}><input type="checkbox" checked={from?.Mode_Name === "AIR"} /><span>AIR</span></label>
                                                        <label htmlFor="" style={{ display: "flex", alignItems: "center" }}><input type="checkbox" checked={from?.Mode_Name === "SURFACE"} /><span>SURFACE</span></label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='div2' style={{ width: "100%", fontSize: "10px", height: "20px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                <div style={{ width: "30%", fontWeight: "bold", borderRight: "2px solid black", paddingLeft: "5px", paddingTop: "2px" }}>CONSIGNOR :</div>
                                <div style={{ width: "30%", fontWeight: "bold", borderRight: "2px solid black", paddingLeft: "5px", paddingTop: "2px" }}>CONSIGNEE:</div>
                                <div style={{ width: "40%", display: "flex", textAlign: "center" }}>
                                    <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>ORIGIN</div>
                                    <div style={{ width: "25%", borderRight: "2px solid black", paddingTop: "2px" }}>{from?.Origin_Name}</div>
                                    <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>DESTINATION</div>
                                    <div style={{ width: "25%", paddingTop: "2px" }}>{from?.Destination_Name}</div>
                                </div>
                            </div>
                            <div className='div3' style={{ width: "100%", fontSize: "10px", minHeight: "130px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                <div className='consignor px-2' style={{ width: "30%", borderRight: "2px solid black", display: "flex", flexDirection: "column", gap: "7px", paddingTop: "2px" }}>
                                    <div style={{ fontWeight: "bold" }}>{from?.Customer_Name}</div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Address : </div><span>{from?.Customer_Add1}</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Mob No : </div><span>{from?.Customer_Mob}</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Pin Code : </div><span>{from?.Pin_Code}</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>GST NO : </div><span>{from?.Gst_No}</span></div>
                                </div>
                                <div className='consignee px-2' style={{ width: "30%", borderRight: "2px solid black", display: "flex", flexDirection: "column", gap: "7px", paddingTop: "2px" }}>
                                    <div style={{ fontWeight: "bold" }}> {from?.Consignee_Name}</div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Address : </div><span>AGILENT TECHNOLOGIES INTERNATIONAL
                                        PVT LTDPLOT NO. CP 11 , SECTOR- 8 , IMT
                                        MANESAR ,</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Mob No : </div><span>{from?.Consignee_Mob}</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Pin Code : </div><span> {from?.Consignee_Pin}</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>GST NO : </div><span> {from?.Consignee_GST}</span></div>
                                </div>
                                <div className='docket px-2' style={{ width: "40%", display: "flex", flexDirection: "column", gap: "3px", paddingTop: "2px" }}>
                                    <div style={{ fontWeight: "bold", height: "10%" }}>  DOCKET No : </div>
                                    <div style={{ display: "flex", flexDirection: "column", height: "90%" }}>
                                        <div style={{ display: "flex", height: "100%", flexDirection: "column", alignItems: "center", gap: "0px" }}>
                                            <img src={barcode} alt="barcode" style={{ height: "70%", width: "150px" }} />
                                            <b style={{ fontSize: "20px" }}>{from?.DocketNo}</b> </div>
                                    </div>
                                </div>
                            </div>
                            <div className='div4' style={{ width: "100%", height: "190px", fontSize: "10px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                <div className='charges' style={{ width: "26.80%", borderRight: "2px solid black", display: "flex", flexDirection: 'column' }}>
                                    <div style={{ display: "flex", height: "", textAlign: "center" }}>
                                        <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>AWT.</div>
                                        <div style={{ width: "25%", borderRight: "2px solid black", paddingTop: "2px" }}>{from?.ActualWt}</div>
                                        <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>CHGWT.</div>
                                        <div style={{ width: "25%", paddingTop: "2px" }}>{from?.ChargedWt}</div>
                                    </div>
                                    <div style={{ display: "flex", height: "", borderTop: "2px solid black" }}>
                                        <div style={{ width: "50%", borderRight: "2px solid black", paddingTop: "2px", paddingLeft: "5px" }}>NO OF PACKAGES</div>
                                        <div style={{ width: "50%", paddingTop: "2px", paddingLeft: "10px" }}>{from?.Qty}</div>
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
                                        <div style={{ width: "50%", paddingTop: "2px", paddingLeft: "10px" }}>{from?.InvValue}</div>
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
                                        <span>{from?.InvoiceNo}</span>
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
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{from?.VolumetriceData?.[0]?.Length || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{from?.VolumetriceData?.[0]?.Width || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{from?.VolumetriceData?.[0]?.Height || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}>{from?.VolumetriceData?.[0]?.Length+from?.VolumetriceData?.[0]?.Width+from?.VolumetriceData?.[0]?.Height|| ""}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{from?.VolumetriceData?.[1]?.Length || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{from?.VolumetriceData?.[1]?.Width || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{from?.VolumetriceData?.[1]?.Height || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}>{from?.VolumetriceData?.[1]?.Length+from?.VolumetriceData?.[1]?.Width+from?.VolumetriceData?.[1]?.Height|| ""}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{from?.VolumetriceData?.[2]?.Length || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{from?.VolumetriceData?.[2]?.Width || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{from?.VolumetriceData?.[2]?.Height || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}>{from?.VolumetriceData?.[2]?.Length+from?.VolumetriceData?.[2]?.Width+from?.VolumetriceData?.[2]?.Height|| ""}</span>
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
                                    <div className='total2' style={{ width: "45%", borderRight: "2px solid black" }}>
                                        <div style={{ display: "flex", height: "19%" }}>
                                            <span style={{ borderRight: "2px solid black", fontWeight: "bold", width: "60%", textAlign: "center", whiteSpace: "wrap", fontSize: "12px" }}>DETAILS FREIGHT</span>
                                            <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
                                                <span style={{ textAlign: "center", fontWeight: "bold", paddingTop: "2px", }}>AMOUNT</span>
                                                <span style={{ textAlign: "center", paddingTop: "2px", }}>{from?.Rate}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> FUEL CHARGES</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{from?.FuelCharges}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> DKT CHARGES </span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{from?.DocketChrgs}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> DOV CHARGES</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{from?.FuelCharges}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> DELIVERY CHARGES</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{from?.HamaliChrgs}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> OTHER CHARGES</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{from?.OtherCharges}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> TOTAL</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{from?.TotalAmt}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> GST</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>0.00</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "11%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}>  GRAND TOTAL</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>0.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='payment' style={{ width: "29%" }}>
                                    <div style={{ height: "39%" }}>
                                        <div style={{ fontWeight: "bold", textAlign: "center" }}>BOOKING TYPE</div>
                                        <div style={{ display: "flex", gap: "22px", paddingLeft: "25px" }}>
                                            <div style={{ display: "flex", flexDirection: "column", width: "45px", height: "45px" }}>
                                                <span>To Pay</span>
                                                <span>Paid</span>
                                                <span>TBB</span>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", width: "40px", height: "45px", border: "2px solid black" }}>
                                                <span style={{ height: "35%", borderBottom: "2px solid black", textAlign: "center" }}>{from?.T_Flag}</span>
                                                <span style={{ height: "35%", borderBottom: "2px solid black", textAlign: "center" }}>{from?.T_Flag}</span>
                                                <span style={{ textAlign: "center" }}>{from?.T_Flag}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='px-2' style={{ height: "60%", borderTop: "2px solid black", fontWeight: "bold", fontSize: "9px" }} >
                                        <div>TERM & CONDITION</div>
                                        <div>.THIS IS AN NON NEGOTIABLE WAYBILL</div>
                                        <div>.STANDARD CONDITION OF CARRIAGE ARE GIVEN ON THE REVERSE OF THE CONSIGNOR'S COPY</div>
                                        <div>.LIABILITY LIMITED TO RS. 1000/- ONLY</div>
                                        <div>.WE CARRY UNDER THE CARRIER'S ACT </div>
                                    </div>
                                </div>
                            </div>
                            <div className='div5' style={{ width: "100%", height: "155px", fontSize: "10px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                <div style={{ width: "26.80%", borderRight: "2px solid black" }}>
                                    <div style={{ display: "flex", height: "11%", borderBottom: "2px solid black", gap: "5px" }}>
                                        <div style={{ paddingLeft: "5px" }}> Invoice Date. :</div>
                                        <span>{from?.InvDate}</span>
                                    </div>
                                    <div style={{ display: "flex", height: "11%", borderBottom: "2px solid black", gap: "5px" }}>
                                        <div style={{ paddingLeft: "5px" }}> EWAY BILL NOs. :</div>
                                        <span>{from?.BillNo}</span>
                                    </div>
                                    <div style={{ paddingLeft: "7px", fontWeight: "bold", borderBottom: "2px solid black", height: "11%" }}>COD/DOD AUTHORISED DETAILS</div>
                                    <div style={{ paddingLeft: "7px", borderBottom: "2px solid black", height: "30%" }}> COD/DOD AMOUNT (Rs..)</div>
                                    <div style={{ paddingLeft: "7px", height: "40%" }}>  AMOUNT IN WORDS</div>

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
                                <div style={{ fontWeight: "bold", width: "44%" }}>
                                    <div style={{ borderBottom: "2px solid black", paddingLeft: "5px" }}>RS ..............................................................................................
                                        ....................................................................................................
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
                        <div className="container-2" style={{ borderRadius: "0px", width: "800px", display: "flex", flexDirection: "column" }}>
                            <div className='div1' style={{ width: "100%", height: "90px", border: "2px solid black", display: "flex" }}>
                                <div className='logo' style={{ width: "24%", height: "100%" }}></div>
                                <div className='heading' style={{ width: "38%", height: "100%", display: "flex", flexDirection: "column", gap: "5px", alignItems: "start", marginTop: "5px" }}>
                                    <div style={{ fontSize: "14px", fontWeight: "bolder" }}>{BranchData?.Company_Name}</div>
                                    <div style={{ lineHeight: "1.2", fontSize: "10px", paddingRight: "10px" }}>{BranchData?.Branch_Add1}</div>
                                </div>
                                <div className='booking' style={{ width: "38%", height: "100%", display: "flex", flexDirection: "column" }}>
                                    <div style={{ paddingLeft: "5px", fontWeight: "bold", fontSize: "12px" }}>GST No: {BranchData?.GSTNo}</div>
                                    <table style={tableStyle}>
                                        <tbody >
                                            <tr>
                                                <td style={cellsStyle}>Booking Date:</td>
                                                <td style={cellsStyle}>{to?.BookDate}</td>
                                            </tr>
                                            <tr>
                                                <td style={cellsStyle}>Booking Branch:</td>
                                                <td style={cellsStyle}>{to?.Branch_Name}</td>
                                            </tr>
                                            <tr>
                                                <td style={cellsStyle}>Booking Mode:</td>
                                                <td style={cellsStyle}>
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                                                        <label htmlFor="" style={{ display: "flex", alignItems: "center" }}><input type="checkbox" checked={to?.Mode_Name === "RAIL"} /><span>RAIL</span></label>
                                                        <label htmlFor="" style={{ display: "flex", alignItems: "center" }}><input type="checkbox" checked={to?.Mode_Name === "AIR"} /><span>AIR</span></label>
                                                        <label htmlFor="" style={{ display: "flex", alignItems: "center" }}><input type="checkbox" checked={to?.Mode_Name === "SURFACE"} /><span>SURFACE</span></label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='div2' style={{ width: "100%", fontSize: "10px", height: "20px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                <div style={{ width: "30%", fontWeight: "bold", borderRight: "2px solid black", paddingLeft: "5px", paddingTop: "2px" }}>CONSIGNOR :</div>
                                <div style={{ width: "30%", fontWeight: "bold", borderRight: "2px solid black", paddingLeft: "5px", paddingTop: "2px" }}>CONSIGNEE:</div>
                                <div style={{ width: "40%", display: "flex", textAlign: "center" }}>
                                    <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>ORIGIN</div>
                                    <div style={{ width: "25%", borderRight: "2px solid black", paddingTop: "2px" }}>{to?.Origin_Name}</div>
                                    <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>DESTINATION</div>
                                    <div style={{ width: "25%", paddingTop: "2px" }}>{to?.Destination_Name}</div>
                                </div>
                            </div>
                            <div className='div3' style={{ width: "100%", fontSize: "10px", minHeight: "130px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                <div className='consignor px-2' style={{ width: "30%", borderRight: "2px solid black", display: "flex", flexDirection: "column", gap: "7px", paddingTop: "2px" }}>
                                    <div style={{ fontWeight: "bold" }}>{to?.Customer_Name}</div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Address : </div><span>{to?.Customer_Add1}</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Mob No : </div><span>{to?.Customer_Mob}</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Pin Code : </div><span>{to?.Pin_Code}</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>GST NO : </div><span>{to?.Gst_No}</span></div>
                                </div>
                                <div className='consignee px-2' style={{ width: "30%", borderRight: "2px solid black", display: "flex", flexDirection: "column", gap: "7px", paddingTop: "2px" }}>
                                    <div style={{ fontWeight: "bold" }}> {to?.Consignee_Name}</div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Address : </div><span>AGILENT TECHNOLOGIES INTERNATIONAL
                                        PVT LTDPLOT NO. CP 11 , SECTOR- 8 , IMT
                                        MANESAR ,</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Mob No : </div><span>{to?.Consignee_Mob}</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>Pin Code : </div><span> {to?.Consignee_Pin}</span></div>
                                    <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold" }}>GST NO : </div><span> {to?.Consignee_GST}</span></div>
                                </div>
                                <div className='docket px-2' style={{ width: "40%", display: "flex", flexDirection: "column", gap: "3px", paddingTop: "2px" }}>
                                    <div style={{ fontWeight: "bold", height: "10%" }}>  DOCKET No : </div>
                                    <div style={{ display: "flex", flexDirection: "column", height: "90%" }}>
                                        <div style={{ display: "flex", height: "100%", flexDirection: "column", alignItems: "center", gap: "0px" }}>
                                            <img src={barcode} alt="barcode" style={{ height: "70%", width: "150px" }} />
                                            <b style={{ fontSize: "20px" }}>{to?.DocketNo}</b> </div>
                                    </div>
                                </div>
                            </div>
                            <div className='div4' style={{ width: "100%", height: "190px", fontSize: "10px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                <div className='charges' style={{ width: "26.80%", borderRight: "2px solid black", display: "flex", flexDirection: 'column' }}>
                                    <div style={{ display: "flex", height: "", textAlign: "center" }}>
                                        <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>AWT.</div>
                                        <div style={{ width: "25%", borderRight: "2px solid black", paddingTop: "2px" }}>{to?.ActualWt}</div>
                                        <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>CHGWT.</div>
                                        <div style={{ width: "25%", paddingTop: "2px" }}>{to?.ChargedWt}</div>
                                    </div>
                                    <div style={{ display: "flex", height: "", borderTop: "2px solid black" }}>
                                        <div style={{ width: "50%", borderRight: "2px solid black", paddingTop: "2px", paddingLeft: "5px" }}>NO OF PACKAGES</div>
                                        <div style={{ width: "50%", paddingTop: "2px", paddingLeft: "10px" }}>{to?.Qty}</div>
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
                                        <div style={{ width: "50%", paddingTop: "2px", paddingLeft: "10px" }}>{to?.InvValue}</div>
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
                                        <span>{to?.InvoiceNo}</span>
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
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{to?.VolumetriceData?.[0]?.Length || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{to?.VolumetriceData?.[0]?.Width || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{to?.VolumetriceData?.[0]?.Height || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}>{to?.VolumetriceData?.[0]?.Length+to?.VolumetriceData?.[0]?.Width+to?.VolumetriceData?.[0]?.Height|| ""}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{to?.VolumetriceData?.[1]?.Length || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{to?.VolumetriceData?.[1]?.Width || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{to?.VolumetriceData?.[1]?.Height || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}>{to?.VolumetriceData?.[1]?.Length+to?.VolumetriceData?.[1]?.Width+to?.VolumetriceData?.[1]?.Height|| ""}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{to?.VolumetriceData?.[2]?.Length || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{to?.VolumetriceData?.[2]?.Width || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "14%", paddingTop: "1px", textAlign: "center" }}>{to?.VolumetriceData?.[2]?.Height || ""}</span>
                                            <span style={{ borderRight: "2px solid black", width: "40%", paddingTop: "1px", textAlign: "center" }}></span>
                                            <span style={{ width: "20%", paddingTop: "2px", textAlign: "center" }}>{to?.VolumetriceData?.[2]?.Length+to?.VolumetriceData?.[2]?.Width+to?.VolumetriceData?.[2]?.Height|| ""}</span>
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
                                    <div className='total2' style={{ width: "45%", borderRight: "2px solid black" }}>
                                        <div style={{ display: "flex", height: "19%" }}>
                                            <span style={{ borderRight: "2px solid black", fontWeight: "bold", width: "60%", textAlign: "center", whiteSpace: "wrap", fontSize: "12px" }}>DETAILS FREIGHT</span>
                                            <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
                                                <span style={{ textAlign: "center", fontWeight: "bold", paddingTop: "2px", }}>AMOUNT</span>
                                                <span style={{ textAlign: "center", paddingTop: "2px", }}>{to?.Rate}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> FUEL CHARGES</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{to?.FuelCharges}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> DKT CHARGES </span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{to?.DocketChrgs}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> DOV CHARGES</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{to?.FuelCharges}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> DELIVERY CHARGES</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{to?.HamaliChrgs}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> OTHER CHARGES</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{to?.OtherCharges}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> TOTAL</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>{to?.TotalAmt}</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "10%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}> GST</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>0.00</span>
                                        </div>
                                        <div style={{ display: "flex", borderTop: "2px solid black", height: "11%" }}>
                                            <span style={{ borderRight: "2px solid black", width: "60%", paddingLeft: "5px" }}>  GRAND TOTAL</span>
                                            <span style={{ width: "40%", paddingLeft: "5px" }}>0.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='payment' style={{ width: "29%" }}>
                                    <div style={{ height: "39%" }}>
                                        <div style={{ fontWeight: "bold", textAlign: "center" }}>BOOKING TYPE</div>
                                        <div style={{ display: "flex", gap: "22px", paddingLeft: "25px" }}>
                                            <div style={{ display: "flex", flexDirection: "column", width: "45px", height: "45px" }}>
                                                <span>To Pay</span>
                                                <span>Paid</span>
                                                <span>TBB</span>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", width: "40px", height: "45px", border: "2px solid black" }}>
                                                <span style={{ height: "35%", borderBottom: "2px solid black", textAlign: "center" }}>{to?.T_Flag}</span>
                                                <span style={{ height: "35%", borderBottom: "2px solid black", textAlign: "center" }}>{to?.T_Flag}</span>
                                                <span style={{ textAlign: "center" }}>{to?.T_Flag}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='px-2' style={{ height: "60%", borderTop: "2px solid black", fontWeight: "bold", fontSize: "9px" }} >
                                        <div>TERM & CONDITION</div>
                                        <div>.THIS IS AN NON NEGOTIABLE WAYBILL</div>
                                        <div>.STANDARD CONDITION OF CARRIAGE ARE GIVEN ON THE REVERSE OF THE CONSIGNOR'S COPY</div>
                                        <div>.LIABILITY LIMITED TO RS. 1000/- ONLY</div>
                                        <div>.WE CARRY UNDER THE CARRIER'S ACT </div>
                                    </div>
                                </div>
                            </div>
                            <div className='div5' style={{ width: "100%", height: "155px", fontSize: "10px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                <div style={{ width: "26.80%", borderRight: "2px solid black" }}>
                                    <div style={{ display: "flex", height: "11%", borderBottom: "2px solid black", gap: "5px" }}>
                                        <div style={{ paddingLeft: "5px" }}> Invoice Date. :</div>
                                        <span>{to?.InvDate}</span>
                                    </div>
                                    <div style={{ display: "flex", height: "11%", borderBottom: "2px solid black", gap: "5px" }}>
                                        <div style={{ paddingLeft: "5px" }}> EWAY BILL NOs. :</div>
                                        <span>{to?.BillNo}</span>
                                    </div>
                                    <div style={{ paddingLeft: "7px", fontWeight: "bold", borderBottom: "2px solid black", height: "11%" }}>COD/DOD AUTHORISED DETAILS</div>
                                    <div style={{ paddingLeft: "7px", borderBottom: "2px solid black", height: "30%" }}> COD/DOD AMOUNT (Rs..)</div>
                                    <div style={{ paddingLeft: "7px", height: "40%" }}>  AMOUNT IN WORDS</div>

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
                                <div style={{ fontWeight: "bold", width: "44%" }}>
                                    <div style={{ borderBottom: "2px solid black", paddingLeft: "5px" }}>RS ..............................................................................................
                                        ....................................................................................................
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
                    
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", margin: "10px 20px" }}>
                        <button
                            onClick={handleDownloadPDF}
                            style={{ padding: "8px 16px", borderRadius: "6px", background: "green", color: "white", border: "none", cursor: "pointer" }}
                        >
                            Download PDF
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            style={{ padding: "8px 16px", borderRadius: "6px", background: "gray", color: "white", border: "none", cursor: "pointer" }}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileReceipt;