import React, { useRef, useState, useEffect } from 'react';
import logoimg from '../../Assets/Images/AceLogo.jpeg';
import { useLocation, useNavigate } from 'react-router-dom';
import 'jspdf-autotable';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';


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

                console.log("Invoice Response:", response.data);

            } catch (error) {
                console.error("Invoice Fetch Error:", error);
                setInvoiceData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoiceData();
    }, [invNo]);

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
.table-container2 {
  width: 100% !important;
}

.tablediv {
  width: 100% !important; 
  padding:0         /* parent also full width */
}

.tablediv table {
  width: auto !important;          /* force table full width */
  border-collapse: collapse !important;
  table-layout: auto !important;
}
  .tablediv .table {
  width: auto% !important;   /* force full width */
  table-layout: auto !important;
}


.table-container2 th,
.table-container2 td {
  text-align: center;
  vertical-align: middle;
  border: 1px solid black !important;
  font-size: 10px;                   /* shrink text size */
}

    .th {
        background-color: rgba(36, 98, 113, 1) !important;
        color: white !important;
    }
 
`}
            </style>

            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">

                <div className="container-2" style={{ borderRadius: "0px", width: "1065px", height: "40px", border: "none" }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "1065px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px", alignItems: "center" }}>
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
                    borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "1065px", direction: "flex",
                    flexDirection: "column", gap: "5px"
                }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "1022px", display: "flex", flexDirection: "column" }}>

                        < div id="printable-section" className="container-3" style={{ padding: "0px" }}>
                            <div className="container-3" style={{ border: "5px double black" }}>

                                <div style={{ height: "130px", display: "flex", flexDirection: "row", border: "none", paddingBottom: "5px", marginBottom: "5px" }}>
                                    <div style={{ width: "40%" }}>
                                        <img src={getBranch.Branch_Logo} alt="" style={{ height: "120px" }} />
                                    </div>
                                    <div style={{ width: "80%", display: "flex", flexDirection: "column" }}>
                                        <div style={{ textAlign: "center", height: "40%" }}>
                                            <p><b style={{ fontSize: "24px" }}>{getBranch.Company_Name}</b></p>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", width: "100%", fontSize: "10px", textAlign: "start" }}>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", width: "12%" }}>Address :</div><div style={{ width: "100%", textAlign: "start" }}>{getBranch.Branch_Add1},{getBranch.Branch_PIN}</div></div>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", width: "12%" }}>Mob :</div>    <div style={{ width: "100%", textAlign: "start" }}>{getBranch.MobileNo}</div></div>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", width: "12%" }}>Email :</div>  <div style={{ width: "100%", textAlign: "start" }}>{getBranch.Email}</div></div>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", width: "12%" }}>GST No :</div> <div style={{ width: "100%", textAlign: "start" }}>{getBranch.GSTNo}</div></div>
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
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>
                                        <div>
                                            <label htmlFor=""><b>CLIENT MOBILE NO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>PIN CODE :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>
                                        <div>
                                            <label htmlFor=""><b>GST NO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "50%", padding: "10px", paddingTop: "20px" }}>
                                        <div>
                                            <label htmlFor=""><b>INVOICE NO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>INVOICE DATE :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>INVOICE FROM :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>INVOICE TO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>INVOICE MODE :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{ }</label>
                                        </div>

                                    </div>
                                </div>

                                <div className="table-container2 w-100" style={{ borderBottom: "1px solid black",width: "100%",}}>
                                    <div className="tablediv w-100" style={{  width: "100%",}}>
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
                                                    <th>Pickup/Hamali</th>
                                                    <th>Delivery</th>
                                                    <th>FOV</th>
                                                    <th>Fuel</th>
                                                    <th>ODA / Airline</th>
                                                    <th>Insurance</th>
                                                    <th>Packing</th>
                                                    <th>Other</th>
                                                    <th>Freight Amount</th>
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
                                                        ))): (
                                                    <tr>
                                                        <td colSpan="16" style={{ textAlign: "center" }}>No data available</td>
                                                    </tr>
                                                )}
                                            </tbody>

                                        </table>
                                    </div>

                                    <div className='page' style={{ backgroundColor: "green" }}>
                                        <div>
                                            <label htmlFor="">Total QTY :</label>
                                            <label htmlFor="" style={{ width: "40px", marginLeft: "5px" }}>{ }</label>
                                        </div>

                                        <div>
                                            <label htmlFor="">Total Wt :</label>
                                            <label htmlFor="" style={{ width: "40px", marginLeft: "5px" }}>{ }</label>
                                        </div>
                                    </div>
                                </div>

                                <div className='page' style={{ marginTop: "20px" }}>
                                    <p>Received by :</p><span style={{ height: "1px", width: "150px", color: "black", border: "1px solid black", marginTop: "20px" }}></span>
                                </div>

                                <div className='page' style={{ justifyContent: "space-between" }}>
                                    <div className='page' style={{ marginTop: "20px" }}>
                                        <p>Prepared by :</p>
                                        <p style={{ textAlign: "start", paddingLeft: "5px" }}><b style={{ fontSize: "12px", marginRight: "10px" }}>{getBranch.Company_Name}</b></p>
                                    </div>
                                    <div className='page' style={{ marginTop: "20px" }}>
                                        <p>Checked by :</p>
                                        <span style={{ height: "1px", width: "150px", color: "black", border: "1px solid black", marginTop: "20px" }}></span>
                                    </div>

                                    <div className='page' style={{ marginTop: "20px" }}>
                                        <p>Signature With Stamp :</p><span style={{ height: "1px", width: "150px", color: "black", border: "1px solid black", marginTop: "20px" }}></span>
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