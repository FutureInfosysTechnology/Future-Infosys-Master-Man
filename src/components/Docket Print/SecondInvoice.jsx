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
import { toWords } from "number-to-words";


function SecondInvoice() {
    function toTitleCase(str) {
        return str
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
    function formatDateToDDMMYYYY(dateStr) {
        const date = new Date(dateStr);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    const location = useLocation();
    const navigate = useNavigate();
    const invNo = location?.state?.invoiceNo || "";
    const fromPath = location?.state?.from || "/";
    const termArr = location?.state?.termArr || [];
    const [getBranch, setGetBranch] = useState([]);
    const [invoiceData, setInvoiceData] = useState([]);
    console.log(location.state);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        console.log("useEffect", invoiceData);
    }, [invoiceData]);
   const handleDownloadPDF = async () => {
    const element = document.querySelector("#pdf");
    if (!element) return;

    // Capture the HTML as a high-resolution canvas
    const canvas = await html2canvas(element, {
        scale: 8, // higher = clearer
        useCORS: true,
        scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // If content is taller than one page, add more pages
    while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    pdf.save(`Invoice_${invNo}.pdf`);
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
        left: 0;
        top: 0;
        width: auto !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box;
    }

    table {
        width: 100% !important;  /* Let table auto-expand */
        border-collapse: collapse;
        font-size: 10px !important;
    }

    th, td {
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
        height:auto !important;
    }
}
`}
            </style>



            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">

                <div className="container-2" style={{ borderRadius: "0px", width: "840px", height: "40px", border: "none" }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "840px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px", alignItems: "center" }}>
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
                            onClick={() => navigate(fromPath, { state: { tab: "multiple" } })}
                            style={{ padding: "5px 10px", borderRadius: "6px", background: "gray", color: "white", border: "none", cursor: "pointer" }}
                        >
                            Exit
                        </button>
                    </div>
                </div>

                <div className="container-2" id="pdf" style={{
                    borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px",
                    width: "840px", direction: "flex",
                    flexDirection: "column", gap: "5px", fontFamily: '"Times New Roman", Times, serif',
                }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "800px", display: "flex", flexDirection: "column" }}>

                        < div id="printable-section" className="container-3" style={{ padding: "0px", minHeight: "500px" }}>
                            <div className="container-3" style={{ border: "5px double black", minHeight: "500px" }}>

                                <div style={{ height: "130px", display: "flex", flexDirection: "row", border: "none", paddingBottom: "5px", gap: "50px" }}>
                                    <div style={{ width: "25%" }}>
                                        <img src={invoiceData[0]?.Branch_Logo} alt="" style={{ height: "120px", width: "100%" }} />
                                    </div>
                                    <div style={{ width: "75%", display: "flex", flexDirection: "column" }}>
                                        <div style={{ textAlign: "start", height: "40%" }}>
                                            <p><b style={{ fontSize: "24px", fontWeight: "bold" }}>{invoiceData[0]?.Company_Name}</b></p>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", width: "100%", fontSize: "12px", textAlign: "start" }}>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>Address :</div><div style={{ textAlign: "start" }}>{invoiceData[0]?.Branch_Add1},{invoiceData[0]?.Branch_PIN}</div></div>
                                            <div style={{ display: "flex", whiteSpace: "nowrap", gap: "20px" }}>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>Mob :</div>    <div style={{ width: "100%", textAlign: "start" }}>(+91) {invoiceData[0]?.MobileNo}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>Email :</div>  <div style={{ width: "100%", textAlign: "start" }}>{invoiceData[0]?.Email}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>GST No :</div> <div style={{ width: "100%", textAlign: "start" }}>{invoiceData[0]?.BranchGSTNo}</div></div>
                                            </div>
                                            <div style={{ display: "flex", whiteSpace: "nowrap", gap: "20px" }}>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>City :</div>    <div style={{ width: "100%", textAlign: "start" }}>{invoiceData[0]?.Branch_Name[0]}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>State :</div>  <div style={{ width: "100%", textAlign: "start" }}>{invoiceData[0]?.State_Name}</div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", fontSize: "12px", border: "1px solid black", marginBottom: "5px", padding: "10px" }}>
                                    <div style={{ display: "flex", width: "50%", justifyContent: "start" }}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label htmlFor=""><b>CLIENT NAME</b></label>
                                            <label htmlFor=""><b>ADDRESS</b></label>
                                            <label htmlFor=""><b>CLIENT MOBILE NO </b></label>
                                            <label htmlFor=""><b>PIN CODE</b></label>
                                            <label htmlFor=""><b>GST NO</b></label>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
                                            <label htmlFor=""><b>:</b></label>
                                            <label htmlFor=""><b>:</b></label>
                                            <label htmlFor=""><b>:</b></label>
                                            <label htmlFor=""><b>:</b></label>
                                            <label htmlFor=""><b>:</b></label>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.customerName}</label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.Customer_Add1},{invoiceData[0]?.Customer_Add2},{invoiceData[0]?.Customer_Add3}</label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.Customer_Mob}</label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.Pin_Code}</label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.Gst_No}</label>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", width: "50%", justifyContent: "end", alignItems: "center", marginRight: "50px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", }}>
                                            <label htmlFor=""><b>INVOICE NO</b></label>
                                            <label htmlFor=""><b>INVOICE DATE</b></label>
                                            <label htmlFor=""><b>INVOICE FROM</b></label>
                                            <label htmlFor=""><b>INVOICE TO</b></label>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
                                            <label htmlFor=""><b>:</b></label>
                                            <label htmlFor=""><b>:</b></label>
                                            <label htmlFor=""><b>:</b></label>
                                            <label htmlFor=""><b>:</b></label>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.BillNo}</label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.BillDate[0]}</label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{formatDateToDDMMYYYY(invoiceData[0]?.billfrom)}</label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{formatDateToDDMMYYYY(invoiceData[0]?.BillTo)}</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="table-container2" style={{ borderBottom: "1px solid black" }}>
                                    <table className='table table-bordered table-sm' style={{ border: "1px solid black" }}>
                                        <thead className='thead'>
                                            <tr className='tr'>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Sr No</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Date</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Docket No</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Destination</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Boxes</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Qty</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Freight</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Fuel</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Delivery</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Handle</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Green</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Docket</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Other</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Amount</th>
                                            </tr>
                                        </thead>

                                        <tbody className='tbody'>

                                        </tbody>
                                    </table>

                                </div>
                                <div className='page' style={{ marginTop: "20px" }}>
                                    <p>Received by :</p><span style={{ height: "1px", width: "150px", color: "black", border: "1px solid black", marginTop: "20px" }}></span>
                                </div>

                                <div className='page' style={{ justifyContent: "space-between" }}>
                                    <div className='page' style={{ marginTop: "20px" }}>
                                        <p>Prepared by :</p>
                                        <p style={{ textAlign: "start", paddingLeft: "5px" }}><b style={{ fontSize: "12px", marginRight: "10px" }}>{ }</b></p>
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

export default SecondInvoice;