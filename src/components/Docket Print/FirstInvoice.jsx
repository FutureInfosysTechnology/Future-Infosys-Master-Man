import React, { useRef, useState, useEffect } from 'react';
import logoimg from '../../Assets/Images/AceLogo.jpeg';
import { useLocation, useNavigate } from 'react-router-dom';
import 'jspdf-autotable';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import "./firstinvoice.css"


function FirstInvoice() {

    const location = useLocation();
    const navigate = useNavigate();
    const invNo = location?.state?.invoiceNo || "";
    const fromPath = location?.state?.from || "/";
    const [getBranch, setGetBranch] = useState([]);
    const [invoiceData, setInvoiceData] = useState([]);
    console.log(location.state);
    const [loading, setLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
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
        fetchData();
    }, [])
    useEffect(() => {
        const fetchInvoiceData = async () => {
            const loginData = JSON.parse(localStorage.getItem("Login"));
            try {
                const response = await getApi(`/Smart/InvoicePrintPdf?InvoiceNos=${invNo}`);

                console.log("Raw Response:", response);

                if (response.status === 1) {
                    setInvoiceData(response?.Data || []);
                    console.log("Data:", response.Data);
                    // 👈 match backend key
                } else {
                    setInvoiceData([]);
                }

                console.log("Invoice Response:", response.Data);

            } catch (error) {
                console.error("Invoice Fetch Error:", error);
                setInvoiceData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoiceData();
    }, [invNo]);

    useEffect(()=>
    {
        console.log("useEffect",invoiceData);
    },[invoiceData]);
    const handleDownloadPDF = async () => {
        const element = document.querySelector("#pdf");
        if (!element) return;

        if (!element) return;

        const canvas = await html2canvas(element, { scale: 4 });
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Create PDF with dynamic height = content height
        const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`Runsheet_${"invoice"}.pdf`);
    };

    return (
        <>
            <style>
                {`@media print {
    body * {
        visibility: hidden;
    }

    #pdf, #pdf * {
        visibility: visible;
    }

    #pdf {
        position: absolute;
        left: 0;
        top: 0;
        width: auto !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box;
        
    }

    table {
        width: auto !important;  /* Let table auto-expand */
        table-layout: auto;      /* Use auto layout */
        border-collapse: collapse;
        font-size: 10px !important;
    }

    th, td {
        white-space: nowrap !important;
        border: 1px solid black !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .th {
        background-color: rgba(36, 98, 113, 1) !important;
        color: white !important;
    }

    button {
        display: none !important;
    }

    .container-2, .container-3 {
        width: auto !important;
    }
}
`}
            </style>

            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">

                <div className="container-2" style={{ borderRadius: "0px", width: "1184px", height: "40px", border: "none" }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "1184px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px", alignItems: "center" }}>
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
                            onClick={() => navigate(fromPath, { state: { tab: "state" } })}
                            style={{ padding: "5px 10px", borderRadius: "6px", background: "gray", color: "white", border: "none", cursor: "pointer" }}
                        >
                            Exit
                        </button>
                    </div>
                </div>

                <div className="container-2" id="pdf" style={{
                    borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "1184px", direction: "flex",
                    flexDirection: "column", gap: "5px"
                }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "1142px", display: "flex", flexDirection: "column" }}>

                        < div id="printable-section" className="container-3" style={{ padding: "0px",minHeight:"500px" }}>
                            <div className="container-3" style={{ border: "5px double black", minHeight:"500px"}}>

                                <div style={{ height: "130px", display: "flex", flexDirection: "row", border: "none", paddingBottom: "5px", marginBottom: "5px" }}>
                                    <div style={{ width: "40%" }}>
                                        <img src={invoiceData[0]?.Branch_Logo} alt="" style={{ height: "120px" }} />
                                    </div>
                                    <div style={{ width: "80%", display: "flex", flexDirection: "column" }}>
                                        <div style={{ textAlign: "center", height: "40%" }}>
                                            <p><b style={{ fontSize: "24px" }}>{invoiceData[0]?.Company_Name}</b></p>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", width: "100%", fontSize: "10px", textAlign: "start" }}>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", width: "12%" }}>Address :</div><div style={{ width: "100%", textAlign: "start" }}>{invoiceData[0]?.Branch_Add1},{invoiceData[0]?.Branch_PIN}</div></div>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", width: "12%" }}>Mob :</div>    <div style={{ width: "100%", textAlign: "start" }}>{invoiceData[0]?.MobileNo}</div></div>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", width: "12%" }}>Email :</div>  <div style={{ width: "100%", textAlign: "start" }}>{getBranch?.Email}</div></div>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", width: "12%" }}>GST No :</div> <div style={{ width: "100%", textAlign: "start" }}>{invoiceData[0]?.BranchGSTNo}</div></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", fontSize: "10px", border: "1px solid black", marginBottom: "5px", marginTop: "" }}>
                                    <div style={{ display: "flex", flexDirection: "column", width: "50%", borderRight: "1px solid black", padding: "10px" }}>
                                        <div style={{ fontWeight: "bold" }}>TO,</div>
                                        <div>
                                            <label htmlFor=""><b>CLIENT NAME :</b></label>
                                            <span style={{ marginLeft: "10px" }}>{ }</span>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>ADDRESS :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.Customer_Add1},{invoiceData[0]?.Customer_Add2},{invoiceData[0]?.Customer_Add3}</label>
                                        </div>
                                        <div>
                                            <label htmlFor=""><b>CLIENT MOBILE NO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.Customer_Mob}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>PIN CODE :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.Pin_Code}</label>
                                        </div>
                                        <div>
                                            <label htmlFor=""><b>GST NO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.Gst_No}</label>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "50%", padding: "10px", paddingTop: "20px" }}>
                                        <div>
                                            <label htmlFor=""><b>INVOICE NO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.BillNo}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>INVOICE DATE :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ invoiceData[0]?.BillDate}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>INVOICE FROM :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>INVOICE TO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>

                                    </div>
                                </div>

                                <div className="table-container2 w-100" style={{width: "100%", }}>
                                    <div className="tablediv w-100" style={{ width: "100%", }}>
                                        <table
                                            className="table table-bordered table-sm"
                                            style={{ width: "100%", border: "1px solid black" }}
                                        >
                                            <thead className='thead'>
                                                <tr>
                                                    <th>Sr.No</th>
                                                    <th>C.Note</th>
                                                    <th>Date</th>
                                                    <th>Origin</th>
                                                    <th>Destination</th>
                                                    <th>Mode</th>
                                                    <th>Pieces</th>
                                                    <th>Weight</th>
                                                    <th>Rate</th>
                                                    <th>Dkt.Chrgs</th>
                                                    <th>Pickup.Chrgs</th>
                                                    <th>Delivery.Chrgs</th>
                                                    <th>FOV.Chrgs</th>
                                                    <th>Fuel.Chrgs</th>
                                                    <th>Airline.Chrgs</th>
                                                    <th>Insurance.Chrgs</th>
                                                    <th>Packing.Chrgs</th>
                                                    <th>Other.Chrgs</th>
                                                    <th>Freight.Amount</th>
                                                </tr>
                                            </thead>

                                            <tbody className='tbody'>
                                                {invoiceData.length > 0 ? (
                                                    invoiceData.map((invoice, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{invoice.DocketNo}</td>
                                                            <td>{invoice.BillDate}</td>
                                                            <td>{invoice.fromDest}</td>
                                                            <td>{invoice.toDest}</td>
                                                            <td>{invoice.ModeName}</td>
                                                            <td>{invoice.pcs}</td>
                                                            <td>{invoice.actualWt}</td>
                                                            <td>{invoice.Rate}</td>
                                                            <td>{invoice.DocketChrgs}</td>
                                                            <td>{invoice.HamaliChrgs}</td>
                                                            <td>{invoice.DeliveryChrgs}</td>
                                                            <td>{invoice.Fov_Chrgs}</td>
                                                            <td>{invoice.FuelCharges}</td>
                                                            <td>{invoice.ODA_Chrgs}</td>
                                                            <td>{invoice.InsuranceChrgs}</td>
                                                            <td>{invoice.PackingChrgs}</td>
                                                            <td>{invoice.OtherCharges}</td>
                                                            <td>{invoice.TotalAmount}</td>
                                                        </tr>
                                                    ))) : (
                                                    <tr>
                                                        <td colSpan="16" style={{ textAlign: "center" }}>No data available</td>
                                                    </tr>
                                                )}
                                            </tbody>

                                        </table>
                                    </div>
                                </div>

                                 <div style={{width:"100%",display:"flex",border:"1px solid black",marginTop:"10px",justifyContent:"space-between",fontSize:"12px"}}>
                                    <div style={{display:"flex",justifyContent:"end",alignItems:"start",flexDirection:"column",gap:"10px",fontWeight:"bold",margin:"20px"}}>
                                        <div> Tax Payable on Revers charge (Yes/No)</div>
                                        <div> Seventy-One Thousand One Hundred Fifty-Eight Only</div>
                                    </div>
                                    <div style={{display:"flex",width:"20%",justifyContent:"start",alignItems:"start",flexDirection:"column",fontWeight:"bold"}}>
                                        <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px"}}>
                                            <div>Freight Amount</div>
                                            <div>10000</div>
                                        </div>
                                        <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px"}}>
                                            <div>Docket Charges</div>
                                            <div>0.00</div>
                                        </div>
                                        <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px"}}>
                                            <div>Pickup Charges</div>
                                            <div>0.00</div>
                                        </div>
                                         <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px"}}>
                                            <div>Delivery Charges</div>
                                            <div>0.00</div>
                                        </div>
                                         <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px"}}>
                                            <div>FOV Charges</div>
                                            <div>0.00</div>
                                        </div>
                                         <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px"}}>
                                            <div>Feul Surcharge</div>
                                            <div>0.00</div>
                                        </div>
                                        <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px",borderBottom:"1px solid black"}}>
                                            <div>Airline F. Charges</div>
                                            <div>0.00</div>
                                        </div>
                                        <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px"}}>
                                            <div> Sub Totat</div>
                                            <div>60303.00</div>
                                        </div>
                                         <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px"}}>
                                            <div>IGST@ of 18%</div>
                                            <div>0.00</div>
                                        </div>
                                         <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px"}}>
                                            <div>CGST@ of 9%</div>
                                            <div>5427.27</div>
                                        </div>
                                         <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px",borderBottom:"1px solid black"}}>
                                            <div>SGST@ of %9</div>
                                            <div>5427.27</div>
                                        </div>
                                        <div style={{display:"flex",width:"100%",justifyContent:"space-between",paddingRight:"5px",gap:"20px",borderBottom:"1px solid black"}}>
                                            <div>Gross Total </div>
                                            <div> 71158</div>
                                        </div>

                                    </div>
                                 </div>
                            </div>
                        </div >
                    </div>
                </div>


            </div >
        </>
    );
}

export default FirstInvoice;