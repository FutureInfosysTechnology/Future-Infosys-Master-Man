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


function FirstInvoice() {
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
    const [getBranch, setGetBranch] = useState([]);
    const [invoiceData, setInvoiceData] = useState([]);
    console.log(location.state);
    const [loading, setLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isFovChecked, setIsFovChecked] = useState(false);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [isDocketChecked, setIsDocketChecked] = useState(false);
    const [isDeliveryChecked, setIsDeliveryChecked] = useState(false);
    const [isPackingChecked, setIsPackingChecked] = useState(false);
    const [isGreenChecked, setIsGreenChecked] = useState(false);
    const [isHamaliChecked, setIsHamaliChecked] = useState(false);
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [isInsuranceChecked, setIsInsuranceChecked] = useState(false);
    const [isODAChecked, setIsODAChecked] = useState(false);
    const [isFuelChecked, setIsFuelChecked] = useState(false);
    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("toggelChargs"));
        if (savedState) {
            setIsAllChecked(savedState.isAllChecked || false);
            setIsFovChecked(savedState.isFovChecked || false);
            setIsDocketChecked(savedState.isDocketChecked || false);
            setIsDeliveryChecked(savedState.isDeliveryChecked || false);
            setIsPackingChecked(savedState.isPackingChecked || false);
            setIsGreenChecked(savedState.isGreenChecked || false);
            setIsHamaliChecked(savedState.isHamaliChecked || false);
            setIsOtherChecked(savedState.isOtherChecked || false);
            setIsInsuranceChecked(savedState.isInsuranceChecked || false);
            setIsODAChecked(savedState.isODAChecked || false);
            setIsFuelChecked(savedState.isFuelChecked || false);
        }
    }, []);
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

    const canvas = await html2canvas(element, { scale: 4 }); // high resolution
    const imgData = canvas.toDataURL("image/jpeg", 0.8); // compress to JPEG, quality = 0.8

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

    pdf.save(`Invoice_${invNo}.pdf`);
};

    const docketTotal = isDocketChecked ? invoiceData.reduce((sum, inv) => sum + Number(inv.DocketChrgs || 0), 0) : 0;
    const hamaliTotal = isHamaliChecked ? invoiceData.reduce((sum, inv) => sum + Number(inv.HamaliChrgs || 0), 0) : 0;
    const deliveryTotal = isDeliveryChecked ? invoiceData.reduce((sum, inv) => sum + Number(inv.DeliveryChrgs || 0), 0) : 0;
    const fovTotal = isFovChecked ? invoiceData.reduce((sum, inv) => sum + Number(inv.Fov_Chrgs || 0), 0) : 0;
    const fuelTotal = isFuelChecked ? invoiceData.reduce((sum, inv) => sum + Number(inv.FuelCharges || 0), 0) : 0;
    const odaTotal = isODAChecked ? invoiceData.reduce((sum, inv) => sum + Number(inv.ODA_Chrgs || 0), 0) : 0;
    const insuranceTotal = isInsuranceChecked ? invoiceData.reduce((sum, inv) => sum + Number(inv.InsuranceChrgs || 0), 0) : 0;
    const packingTotal = isPackingChecked ? invoiceData.reduce((sum, inv) => sum + Number(inv.PackingChrgs || 0), 0) : 0;
    const otherTotal = isOtherChecked ? invoiceData.reduce((sum, inv) => sum + Number(inv.OtherCharges || 0), 0) : 0;

    const freightTotal = invoiceData.reduce((sum, inv) => sum + Number(inv.TotalAmount || 0), 0);

    const subTotal = docketTotal + hamaliTotal + deliveryTotal + fovTotal + fuelTotal + odaTotal + insuranceTotal + packingTotal + otherTotal + freightTotal;
    const igst = subTotal * 0.18; // 18%
    const cgst = subTotal * 0.09; // 9%
    const sgst = subTotal * 0.09; // 9%
    const grossTotal = subTotal + igst + cgst + sgst;
    const headerCellStyle = {
        border: "1px solid black",
        padding: "4px",
        textAlign: "center",
        fontWeight: "bold"
    };

    const cellStyle = {
        border: "1px solid black",
        padding: "4px",
        textAlign: "center",
        fontWeight: "bold"
    };

    const rowStyle = {
        border: "1px solid black"
    };

    return (
        <>
      <style>
{`
  @media print {
    @page {
      size: A4 portrait;
      margin: 0; /* remove printer default margin */
    }

    body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

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
      margin: 0 auto !important;
      width: 932px !important;
      padding: 0 !important;
      border:  !important;
      background: white !important;
    }

    .container-3 {
      border: 1px solid black !important;
      width: 100% !important;
      height: 1130px !important;
      box-sizing: border-box !important;
    }
       .logo img {
    display: block;
    background: transparent !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }

  .logo {
    background: transparent !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }

  }
`}
</style>



            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">

                <div className="container-2" style={{ borderRadius: "0px", width: "992px", height: "40px", border: "none" }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "992px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px", alignItems: "center" }}>
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
                    borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px",
                    width: "992px", direction: "flex",
                    flexDirection: "column", gap: "5px"
                }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "950px", display: "flex", flexDirection: "column" }}>

                        < div id="printable-section" className="container-3" style={{ padding: "0px", minHeight: "500px" }}>
                            <div className="container-3" style={{ border: "5px double black", minHeight: "500px" }}>

                                <div style={{ height: "130px", display: "flex", flexDirection: "row", border: "none", paddingBottom: "5px",gap:"50px"}}>
                                    <div style={{ width: "25%" }}>
                                        <img src={invoiceData[0]?.Branch_Logo} alt="" style={{ height: "120px" ,width: "100%"}} />
                                    </div>
                                    <div style={{ width: "75%", display: "flex", flexDirection: "column" }}>
                                        <div style={{ textAlign: "center", height: "40%" }}>
                                            <p><b style={{ fontSize: "24px",fontWeight:"bold"}}>{invoiceData[0]?.Company_Name}</b></p>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", width: "100%", fontSize: "12px", textAlign: "start" }}>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", width: "12%" }}>Address :</div><div style={{ width: "100%", textAlign: "start" }}>{invoiceData[0]?.Branch_Add1},{invoiceData[0]?.Branch_PIN}</div></div>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", width: "12%" }}>Mob :</div>    <div style={{ width: "100%", textAlign: "start" }}>(+91) {invoiceData[0]?.MobileNo}</div></div>
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
                                            <span style={{ marginLeft: "10px" }}>{invoiceData[0]?.customerName}</span>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>ADDRESS :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.Customer_Add1},{invoiceData[0]?.Customer_Add2},{invoiceData[0]?.Customer_Add3}</label>
                                        </div>
                                        <div>
                                            <label htmlFor=""><b>CLIENT MOBILE NO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>(+91) {invoiceData[0]?.Customer_Mob}</label>
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
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{invoiceData[0]?.BillDate[0]}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>INVOICE FROM :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{formatDateToDDMMYYYY(invoiceData[0]?.billfrom)}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>INVOICE TO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{formatDateToDDMMYYYY(invoiceData[0]?.BillTo)}</label>
                                        </div>

                                    </div>
                                </div>

                                <div className="table-container2 w-100" style={{ width: "100%" }}>
                                    <div className="tablediv w-100" style={{ width: "100%" }}>
                                        <table className=''
                                            style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                                border: "1px solid black",
                                                fontSize: "12px"
                                            }}
                                        >
                                            <thead style={{ backgroundColor: "rgba(36, 98, 113, 1)", color: "white" }}>
                                                <tr>
                                                    <th style={headerCellStyle}>Sr.No</th>
                                                    <th style={headerCellStyle}>Docket No</th>
                                                    <th style={headerCellStyle}>Date</th>
                                                    <th style={headerCellStyle}>Origin</th>
                                                    <th style={headerCellStyle}>Destination</th>
                                                    <th style={headerCellStyle}>Mode</th>
                                                    <th style={headerCellStyle}>Pieces</th>
                                                    <th style={headerCellStyle}>Weight</th>
                                                    <th style={headerCellStyle}>Rate</th>

                                                    {isDocketChecked && <th style={headerCellStyle}>Dkt Chrgs</th>}
                                                    {isHamaliChecked && <th style={headerCellStyle}>Pickup Chrgs</th>}
                                                    {isDeliveryChecked && <th style={headerCellStyle}>Delivery Chrgs</th>}
                                                    {isFovChecked && <th style={headerCellStyle}>FOV Chrgs</th>}
                                                    {isFuelChecked && <th style={headerCellStyle}>Fuel Chrgs</th>}
                                                    {isODAChecked && <th style={headerCellStyle}>Airline Chrgs</th>}
                                                    {isInsuranceChecked && <th style={headerCellStyle}>Insurance Chrgs</th>}
                                                    {isPackingChecked && <th style={headerCellStyle}>Packing Chrgs</th>}
                                                    {isOtherChecked && <th style={headerCellStyle}>Other Chrgs</th>}

                                                    <th style={headerCellStyle}>Freight Amount</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {invoiceData.length > 0 ? (
                                                    invoiceData.map((invoice, index) => (
                                                        <tr key={index} style={rowStyle}>
                                                            <td style={cellStyle}>{index + 1}</td>
                                                            <td style={cellStyle}>{invoice.DocketNo}</td>
                                                            <td style={cellStyle}>{invoice.BillDate[0]}</td>
                                                            <td style={cellStyle}>{invoice.fromDest}</td>
                                                            <td style={cellStyle}>{invoice.toDest}</td>
                                                            <td style={cellStyle}>{invoice.ModeName}</td>
                                                            <td style={cellStyle}>{invoice.pcs}</td>
                                                            <td style={cellStyle}>{invoice.actualWt}</td>
                                                            <td style={cellStyle}>{invoice.Rate}</td>

                                                            {isDocketChecked && <td style={cellStyle}>{invoice.DocketChrgs}</td>}
                                                            {isHamaliChecked && <td style={cellStyle}>{invoice.HamaliChrgs}</td>}
                                                            {isDeliveryChecked && <td style={cellStyle}>{invoice.DeliveryChrgs}</td>}
                                                            {isFovChecked && <td style={cellStyle}>{invoice.Fov_Chrgs}</td>}
                                                            {isFuelChecked && <td style={cellStyle}>{invoice.FuelCharges}</td>}
                                                            {isODAChecked && <td style={cellStyle}>{invoice.ODA_Chrgs}</td>}
                                                            {isInsuranceChecked && <td style={cellStyle}>{invoice.InsuranceChrgs}</td>}
                                                            {isPackingChecked && <td style={cellStyle}>{invoice.PackingChrgs}</td>}
                                                            {isOtherChecked && <td style={cellStyle}>{invoice.OtherCharges}</td>}

                                                            <td style={cellStyle}>{invoice.TotalAmount}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>

                                <div style={{ width: "100%", display: "flex", border: "1px solid black", marginTop: "10px", justifyContent: "space-between", fontSize: "12px" }}>
                                    <div style={{ display: "flex", justifyContent: "end", alignItems: "start", flexDirection: "column", gap: "10px", fontWeight: "bold", margin: "20px" }}>
                                        <div> Tax Payable on Revers charge (Yes/No)</div>
                                        <div> {toTitleCase(toWords(Number(grossTotal.toFixed(2))))}</div>
                                    </div>
                                    <div style={{ display: "flex", width: "20%", justifyContent: "start", alignItems: "start", flexDirection: "column", fontWeight: "bold" }}>
                                        {isDocketChecked && (
                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>Docket Charges</div>
                                                <div>{docketTotal.toFixed(2)}</div>
                                            </div>
                                        )}

                                        {isHamaliChecked && (
                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>Pickup Charges</div>
                                                <div>{hamaliTotal.toFixed(2)}</div>
                                            </div>
                                        )}

                                        {isDeliveryChecked && (
                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>Delivery Charges</div>
                                                <div>{deliveryTotal.toFixed(2)}</div>
                                            </div>
                                        )}

                                        {isFovChecked && (
                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>FOV Charges</div>
                                                <div>{fovTotal.toFixed(2)}</div>
                                            </div>
                                        )}

                                        {isFuelChecked && (
                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>Fuel Surcharge</div>
                                                <div>{fuelTotal.toFixed(2)}</div>
                                            </div>
                                        )}

                                        {isODAChecked && (
                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>Airline F. Charges</div>
                                                <div>{odaTotal.toFixed(2)}</div>
                                            </div>
                                        )}

                                        {isInsuranceChecked && (
                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>Insurance Charges</div>
                                                <div>{insuranceTotal.toFixed(2)}</div>
                                            </div>
                                        )}

                                        {isPackingChecked && (
                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>Packing Charges</div>
                                                <div>{packingTotal.toFixed(2)}</div>
                                            </div>
                                        )}

                                        {isOtherChecked && (
                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>Other Charges</div>
                                                <div>{otherTotal.toFixed(2)}</div>
                                            </div>
                                        )}

                                        <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px", borderBottom: "1px solid black" }}>
                                            <div>Freight Amount</div>
                                            <div>{freightTotal.toFixed(2)}</div>
                                        </div>

                                        <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px", borderBottom: "1px solid black" }}>
                                            <div>Sub Total</div>
                                            <div>{subTotal.toFixed(2)}</div>
                                        </div>

                                        <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                            <div>IGST@ of 18%</div>
                                            <div>{igst.toFixed(2)}</div>
                                        </div>

                                        <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                            <div>CGST@ of 9%</div>
                                            <div>{cgst.toFixed(2)}</div>
                                        </div>

                                        <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px", borderBottom: "1px solid black" }}>
                                            <div>SGST@ of 9%</div>
                                            <div>{sgst.toFixed(2)}</div>
                                        </div>

                                        <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                            <div>Gross Total</div>
                                            <div>{grossTotal.toFixed(2)}</div>
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