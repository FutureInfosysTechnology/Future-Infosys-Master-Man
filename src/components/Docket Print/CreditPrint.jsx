import React, { useRef, useState, useEffect } from 'react';
import logoimg from '../../Assets/Images/AceLogo.jpeg';
import { useLocation, useNavigate } from 'react-router-dom';
import 'jspdf-autotable';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import { toWords } from "number-to-words";
import bgImage from '../../Assets/Images/future.png';

function CreditPrint() {

    const location = useLocation();
    const navigate = useNavigate();
    const CreditNote_ID = location?.state?.CreditNote_ID || "";
    const fromPath = location?.state?.from || "/";
    const tab = location?.state?.tab || "view";
    const [getBranch, setGetBranch] = useState([]);
    const [invoiceData, setGetInvoiceData] = useState({});
    const [getItem, setGetItem] = useState([]);
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
    const pageRef = useRef();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi(`/Smart/GetCreditNoteByID?CreditNote_ID=${CreditNote_ID}`);
                setGetInvoiceData(response.data);
            } catch (err) {
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
                setIsDataLoaded(true);
                // generatePDF();
            }
        };

        fetchData();
    }, []);
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
    const [totalQty, setTotalQty] = useState(0);
    useEffect(() => {
        if (Array.isArray(getItem)) {
            let total = getItem.reduce((sum, item) => sum + (item.QTY || 0), 0);
            setTotalQty(total);
        }
    }, [getItem]); // 

    const generatePDF = async () => {
        if (!pageRef.current) return;

        // 1️⃣ Capture screenshot
        const canvas = await html2canvas(pageRef.current, {
            scale: 10, // reduce scale slightly (2 → 1.5)
            useCORS: true,
            logging: false,
        });

        // 2️⃣ Convert to compressed JPEG (not PNG)
        const imgData = canvas.toDataURL("image/jpeg", 0.6); // quality: 0.6–0.8 recommended

        // 3️⃣ Create A4 PDF
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // 4️⃣ Add compressed image
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

        // 5️⃣ Save
        pdf.save(`CreditNote_${CreditNote_ID}.pdf`);
    };


    // if (loading) return <p>Loading...</p>;

    return (
        <>
            <style>
                {`
 @media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }

  #pdf {
    position: absolute;
    top: 0;
    left: 0;
    width: 210mm !important;   /* exact A4 width */
    min-height: 297mm !important;
    margin-top:10px!important;
    overflow: hidden !important;
    background: white !important;
    box-sizing: border-box !important;
  }

  table {
    width: 100% !important;
    border-collapse: collapse !important;
    border-spacing: 0 !important;
    table-layout: fixed !important;   /* ✅ Fix uneven border spacing */
  }

  th, td {
    border: 1px solid black !important;
    padding: 4px !important;
    font-size: 10px !important;
  }

  /* ✅ Force the outermost table border to match edges perfectly */
  #pdf table {
    border-left: 2px solid black !important;
    border-right: 2px solid black !important;
    border-top: 2px solid black !important;
    border-bottom: 2px solid black !important;
  }

  #pdf th:last-child,
  #pdf td:last-child {
    border-right: 2px solid black !important; /* fixes thin right border */
  }

  @page {
    size: A4;
    margin: 10mm;
  }

  button, .header, .sidebar {
    display: none !important;
  }
}

`}
            </style>


            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">

                <div className="container-2" style={{ borderRadius: "0px", width: "793px", height: "40px", border: "none" }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "793px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px", alignItems: "center" }}>
                        <button
                            onClick={generatePDF}
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

                <div className="container-2" ref={pageRef} id="pdf" style={{
                    borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px"
                    , paddingBottom: "20px", width: "793px", direction: "flex", fontFamily: '"Times New Roman", Times, serif',
                    flexDirection: "column", gap: "5px", fontSize: "10px", fontWeight: "bold", border: "none"
                }}>

                    <div className="container-2" style={{ borderRadius: "0px", border: "none", width: "750px", display: "flex", flexDirection: "column" }}>
                        < div id="printable-section" className="container-3" style={{ padding: "0px", border: "none" }}>
                            <div
                                className="px-0 py-0"
                                style={{
                                    border: "2px solid black",
                                    position: "relative",
                                    paddingTop: "10px"
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "-10px",           // moves text into the border gap
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "white",    // hides border behind text
                                        padding: "0 10px",
                                        fontSize: "20px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Credit Note
                                </div>

                                <div className="div1" style={{ display: "flex", flexDirection: "row", borderBottom: "2px solid black", }}>
                                    <div style={{ width: "50%", borderRight: "2px solid black", display: "flex", gap: "7px" }}>
                                        <div style={{ width: "30%", height: "100%", padding: "10px", paddingTop: "10px", paddingBottom: "10px" }}>
                                            <img src={getBranch?.Branch_Logo || logoimg} alt="" style={{ height: "100%", width: "100%", borderRadius: "50%" }} />
                                        </div>
                                        <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
                                            <div style={{ fontWeight: "bolder", fontSize: "18px", marginTop: "12px" }}>{getBranch.Company_Name}</div>
                                            <div >{getBranch.Branch_Add1},{getBranch.Branch_PIN}</div>
                                            <div style={{ width: "100%", display: "flex" }}>
                                                <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
                                                    <div style={{ fontSize: "12px" }}>GST No:</div>
                                                    <div>{getBranch.GSTNo}</div>
                                                </div>
                                                <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
                                                    <div style={{ fontSize: "12px" }}>Mobile No:</div>
                                                    <div>(+91) {getBranch.MobileNo}</div>
                                                </div>
                                                {/* <div style={{width:"30%",display:"flex",flexDirection:"column"}}> */}
                                                {/* <div style={{fontWeight:"bolder"}}>Email:</div> */}
                                                {/* <div>{getBranch.Email}</div> */}
                                                {/* </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ width: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ display: "flex", width: "80%", height: "40%", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
                                            <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <div style={{ fontSize: "12px", fontWeight: "bolder" }}>Invoice No:</div>
                                                <div>{invoiceData?.Note_No}</div>
                                            </div>
                                            <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <div style={{ fontSize: "12px", fontWeight: "bolder" }}>Note Date:</div>
                                                <div>{invoiceData.Note_Date}</div>
                                            </div>
                                            <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <div style={{ fontSize: "12px", fontWeight: "bolder" }}>Dockte No:</div>
                                                <div>{invoiceData?.Docket_No}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="div2" style={{ display: "flex", flexDirection: "row", borderBottom: "2px solid black", }}>
                                    <div style={{ width: "100%", display: "flex", paddingBottom: "5px", flexDirection: "column", paddingLeft: "8px", paddingTop: "5px", gap: "2px" }}>
                                        <div style={{ fontSize: "12px" }}>CUSTOMER TO</div>
                                        <div style={{ fontSize: "13px", fontWeight: "bolder" }}>{invoiceData?.Customer_Name}</div>
                                        <div style={{ display: "flex", gap: "2px" }}>
                                            <div style={{ width: "6%" }}> Address:</div>
                                            <div style={{ width: "90%" }}>{invoiceData?.Customer_Add1},{invoiceData?.Customer_Add2},
                                                {invoiceData?.Customer_Add3}, {invoiceData?.State_Name}, {invoiceData?.Pin_Code}</div>
                                        </div>
                                        <div style={{ display: "flex", gap: "15px" }}>
                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <div style={{ fontWeight: "bolder" }}>GST No:</div>
                                                <div>{invoiceData?.Gst_No} </div>
                                            </div>
                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <div style={{ fontWeight: "bolder" }}> State Name:</div>
                                                <div>{invoiceData?.State_Name}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "15px" }}>
                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <div style={{ fontWeight: "bolder" }}> Mobile No:</div>
                                                <div> (+91) {invoiceData.Customer_Mob}  </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="div3" style={{
                                    height: "30px",
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "row",
                                    borderBottom: "2px solid black",
                                    backgroundColor: "rgba(255, 192, 203, 0.1)"

                                }}>
                                    <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>S.NO</div>
                                    <div style={{ width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>ITEMS</div>
                                    <div style={{ width: "35%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Remark</div>
                                    <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center" }}>AMOUNT</div>
                                </div>
                                <div style={{ position: "relative", height: "500px" }}>
                                    {/* Background Layer */}
                                    <div
                                        style={{
                                            backgroundImage: `url(${bgImage})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                            opacity: 0.3, // 👈 background faint
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: "50px",
                                            bottom: 0,
                                            zIndex: 0,

                                        }}
                                    />
                                    <div
                                        style={{
                                            position: "relative",
                                            zIndex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                        }}
                                    >
                                        <div className="div4" style={{
                                            height: "500px",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "row",
                                            borderBottom: "2px solid black",
                                        }}>
                                            {/* S.NO */}
                                            <div style={{ width: "10%", display: "flex", flexDirection: "column", borderRight: "2px solid black", gap: "5px", paddingTop: "5px" }}>
                                                1
                                            </div>

                                            {/* ITEMS */}
                                            <div style={{ width: "40%", display: "flex", flexDirection: "column", borderRight: "2px solid black", gap: "5px", paddingTop: "5px", textAlign: "start", paddingLeft: "10px" }}>
                                                {invoiceData?.Particulars}
                                            </div>

                                            {/* HSN */}
                                            <div style={{ width: "35%", display: "flex", flexDirection: "column", borderRight: "2px solid black", gap: "5px", paddingTop: "5px" }}>
                                                {invoiceData?.Remark}
                                            </div>


                                            {/* AMOUNT */}
                                            <div style={{ width: "15%", display: "flex", flexDirection: "column", gap: "5px", paddingTop: "5px" }}>
                                                {invoiceData?.Amount}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="div8" style={{ height: "30px", textAlign: "center", display: "flex", flexDirection: "row", backgroundColor: "rgba(255, 192, 203, 0.1)" }}>

                                    <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                    <div style={{ width: "40%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>TOTAL</div>
                                    <div style={{ width: "35%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                    <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center" }}>{invoiceData?.Amount}</div>
                                </div>
                            </div>

                            <div className="third px-0 py-0 mt-2" style={{ border: "2px solid black" }}>
                                <div style={{ display: "flex", flexDirection: "column", padding: "5px", borderBottom: "2px solid black" }}>
                                    <div style={{ fontWeight: "bolder", fontSize: "13px" }}> Total Amount (in words)
                                    </div>
                                    <div> {invoiceData?.Amount ? numberToIndianCurrency(Number(invoiceData?.Amount)) : ""}</div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div style={{ display: "flex", flexDirection: "column", fontSize: "11px", width: "50%", padding: "5px", borderRight: "2px solid black" }}>
                                        <div style={{ fontWeight: "bolder", fontSize: "13px" }}> Bank Details</div>
                                        <div style={{ display: "flex" }}><div style={{ width: "30%" }}>Name:</div><div>{getBranch.Company_Name}</div></div>
                                        <div style={{ display: "flex" }}><div style={{ width: "30%" }}>IFSC Code:</div><div>{getBranch.IFSC_Code}</div></div>
                                        <div style={{ display: "flex" }}><div style={{ width: "30%" }}>Account No:</div><div>{getBranch.AccountNo}</div></div>
                                        <div style={{ display: "flex" }}><div style={{ width: "30%" }}> Bank:</div><div>{getBranch.Bank_Name}</div></div>
                                    </div>
                                    <div style={{ display: "flex", width: "50%", flexDirection: "column", justifyContent: "space-around", alignItems: "center", paddingBottom: "5px" }}>
                                        <div style={{ fontWeight: "bolder", fontSize: "13px" }}>Authorised Signatory For
                                        </div>
                                        <div style={{ fontWeight: "bolder", fontSize: "13px" }}>{getBranch?.Company_Name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </div>
            </div >
        </>
    );
}

export default CreditPrint;