import React, { useRef, useState, useEffect } from 'react';
import logoimg from '../../Assets/Images/AceLogo.jpeg';
import { useLocation, useNavigate } from 'react-router-dom';
import 'jspdf-autotable';
import { getApi, postApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import "./firstinvoice.css"
import Swal from "sweetalert2";
import { toWords } from "number-to-words";
import { TbMailShare } from "react-icons/tb";


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
    const termArr = location?.state?.termArr || [];
    const tab = location?.state?.tab;
    const [getBranch, setGetBranch] = useState([]);
    const [invoiceData, setInvoiceData] = useState([]);
    console.log(location.state);
    const [loading, setLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isFovChecked, setIsFovChecked] = useState(false);
    const [isConsigChecked, setIsConsigChecked] = useState(false);
    const [isDocketChecked, setIsDocketChecked] = useState(false);
    const [isDeliveryChecked, setIsDeliveryChecked] = useState(false);
    const [isPackingChecked, setIsPackingChecked] = useState(false);
    const [isGreenChecked, setIsGreenChecked] = useState(false);
    const [isHamaliChecked, setIsHamaliChecked] = useState(false);
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [isInsuranceChecked, setIsInsuranceChecked] = useState(false);
    const [isODAChecked, setIsODAChecked] = useState(false);
    const [isFuelChecked, setIsFuelChecked] = useState(false);
    const [isCharedChecked, setIsCharedChecked] = useState(false);
    const [isVolChecked, setIsVolChecked] = useState(false);
    const [isActualChecked, setIsActualChecked] = useState(false);
    const [isRateChecked, setIsRateChecked] = useState(false);
    const [isTermChecked, setIsTermChecked] = useState(false);
    const [getCustomer, setGetCustomer] = useState([]);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await getApi('/Master/getCustomerdata');
                if (response?.status === 1 && Array.isArray(response.Data)) {
                    setGetCustomer(response.Data);
                }
            } catch (err) {
                console.error('Error loading customer data:', err);
            }
        };
        fetchCustomerData();
    }, []);
    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("toggelChargs"));
        if (savedState) {
            setIsConsigChecked(savedState.isConsigChecked || false)
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
            setIsRateChecked(savedState.isRateChecked || false);
            setIsActualChecked(savedState.isActualChecked || false);
            setIsVolChecked(savedState.isVolChecked || false);
            setIsCharedChecked(savedState.isCharedChecked || false);
            setIsTermChecked(savedState.isTermChecked || false);

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

    const sendMail = async () => {
        try {
            if (!invoiceData[0]?.CustomerName) {
                Swal.fire("Warning", "Customer is required.", "warning");
                return;
            }

            const customerEmail = getCustomer.find(
                c => c.Customer_Name === invoiceData[0]?.CustomerName
            )?.Email;

            if (!customerEmail) {
                Swal.fire("Warning", "This customer has not provided email. Check in master.", "warning");
                return;
            }

            // 1️⃣ Capture HTML as image (high resolution)
            const element = document.querySelector("#pdf");
            if (!element) {
                Swal.fire("Error", "PDF element not found!", "error");
                return;
            }

            const canvas = await html2canvas(element, { scale: 3 });
            const imgData = canvas.toDataURL("image/jpeg", 1.0);

            // 2️⃣ Proper A4 page PDF (NO CROPPING)
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = 210;
            const pageHeight = 297;

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                pdf.addPage();
                position = heightLeft - imgHeight;
                pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const pdfBlob = pdf.output("blob");
            const pdfFileName = `Booking_${new Date().toISOString().slice(0, 10)}.pdf`;

            // 3️⃣ Send to server
            const formDataToSend = new FormData();
            formDataToSend.append("file", pdfBlob, pdfFileName);
            formDataToSend.append(
                "customerCode",
                getCustomer.find(c => c.Customer_Name === invoiceData[0]?.CustomerName)?.Customer_Code || "764"
            );
            formDataToSend.append(
                "locationCode",
                JSON.parse(localStorage.getItem("Login"))?.Branch_Code || "MUM"
            );
            formDataToSend.append("subject", "Booking PDF File");
            formDataToSend.append("message", "Please find attached the booking PDF.");

            const response = await postApi("/Smart/AutoMailSend", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response?.success) {
                Swal.fire("Success", `Email sent successfully to ${response?.to}`, "success");
            } else {
                Swal.fire("Error", response?.error || "Email sending failed", "error");
            }
        } catch (error) {
            console.error("Email send failed:", error);
            Swal.fire("Error", "Failed to send email. Check your network or server.", "error");
        }
    };


    const handleDownloadPDF = async () => {
        const element = document.querySelector("#pdf");
        if (!element) return;

        // High resolution screenshot
        const canvas = await html2canvas(element, { scale: 3 });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        const pdf = new jsPDF("p", "mm", "a4"); // Use fixed A4 size
        const pageWidth = 210;
        const pageHeight = 297;

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            pdf.addPage();
            position = heightLeft - imgHeight;
            pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

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

    const freightTotal = invoiceData.reduce((sum, inv) => sum + Number(inv.Rate || 0), 0);

    const subTotal = docketTotal + hamaliTotal + deliveryTotal + fovTotal + fuelTotal + odaTotal + insuranceTotal + packingTotal + otherTotal + freightTotal;
    const igst = subTotal * invoiceData[0]?.IGSTPer / 100;
    const cgst = subTotal * invoiceData[0]?.CGSTPer / 100;
    const sgst = subTotal * invoiceData[0]?.SGSTPer / 100;
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
      size: auto; /* Let browser allow orientation change */
      margin: 0mm;
  }

  body * {
      visibility: hidden;
  }
  
  #printable-section, #printable-section * {
      visibility: visible;
  }
  
  #printable-section {
      width: 100% !important;
      margin: 0;
      padding: 0;
      position: static !important; /* Important: allow orientation rendering correctly */
  }

  .foot {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
  }

  table {
      width: 100% !important;
      border-collapse: collapse;
      font-size: 10px !important;
  }

  th, td {
      border: 1px solid black !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
  }

  .stamp {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important; 
      background-color: transparent !important;
  }

  button {
      display:none !important;
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
                            onClick={sendMail}
                            style={{ padding: "1px", borderRadius: "6px", background: "blue", width: "50px", color: "white", border: "none", cursor: "pointer" }}
                        >
                            <TbMailShare size={25} />
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

                <div className="container-2" id="pdf" style={{
                    borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px",
                    width: "992px", direction: "flex",
                    flexDirection: "column", gap: "5px", fontFamily: '"Times New Roman", Times, serif',
                }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "950px", display: "flex", flexDirection: "column" }}>

                        < div id="printable-section" style={{ padding: "0px" }}>
                            <div className='p-4' style={{ border: "2px solid silver" }}>

                                <div style={{ height: "130px", display: "flex", flexDirection: "row", border: "none", paddingBottom: "5px", gap: "50px" }}>
                                    <div style={{ width: "25%" }}>
                                        <img src={getBranch?.Branch_Logo} alt="" style={{ height: "120px", width: "100%" }} />
                                    </div>
                                    <div style={{ width: "75%", display: "flex", flexDirection: "column",gap:"5px" }}>
                                        <div style={{fontSize: "24px", fontWeight: "bold"  }}>
                                            {getBranch?.Company_Name}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", width: "100%", fontSize: "12px", textAlign: "start" }}>
                                            <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>Address :</div><div style={{ textAlign: "start" }}>{getBranch?.Branch_Add1},{getBranch?.Branch_PIN}</div></div>
                                            <div style={{ display: "flex", whiteSpace: "nowrap", gap: "20px" }}>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>Mob :</div>    <div style={{ width: "100%", textAlign: "start" }}>(+91) {getBranch?.MobileNo}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>Email :</div>  <div style={{ width: "100%", textAlign: "start" }}>{getBranch?.Email}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>GST No :</div> <div style={{ width: "100%", textAlign: "start" }}>{getBranch?.BranchGSTNo}</div></div>
                                            </div>
                                            <div style={{ display: "flex", whiteSpace: "nowrap", gap: "20px" }}>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>City :</div>    <div style={{ width: "100%", textAlign: "start" }}>{getBranch?.Branch_Name}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>State :</div>  <div style={{ width: "100%", textAlign: "start" }}>{getBranch?.State_Name}</div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", border: "1px solid black", marginBottom: "5px", padding: "10px" }}>
                                    
                                        <div style={{ display: "flex", flexDirection: "column", width:"60%" }}>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"15%"}}>Client Name</div>  <div style={{width:"2%"}}>:</div> <div style={{fontWeight:"normal",width:"83%"}}>{invoiceData[0]?.CustomerName}</div></div>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"15%"}}>Address</div>      <div style={{width:"2%"}}>:</div> <div style={{fontWeight:"normal",width:"83%"}}>{invoiceData[0]?.Customer_Add1},{invoiceData[0]?.Customer_Add2},{invoiceData[0]?.Customer_Add3}</div></div>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"15%"}}>State</div>        <div style={{width:"2%"}}>:</div> <div style={{fontWeight:"normal",width:"83%"}}>{invoiceData[0]?.State_Name}</div></div>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"15%"}}>Pin Code</div>     <div style={{width:"2%"}}>:</div> <div style={{fontWeight:"normal",width:"83%"}}>{invoiceData[0]?.Pin_Code}</div></div>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"15%"}}>Mobile No</div>    <div style={{width:"2%"}}>:</div> <div style={{fontWeight:"normal",width:"83%"}}>(+91) {invoiceData[0]?.Customer_Mob}</div></div>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"15%"}}>Gst No</div>       <div style={{width:"2%"}}>:</div> <div style={{fontWeight:"normal",width:"83%"}}>{invoiceData[0]?.Gst_No}</div></div>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"15%"}}>Email</div>        <div style={{width:"2%"}}>:</div> <div style={{fontWeight:"normal",width:"83%"}}>{invoiceData[0]?.Email_Id}</div></div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", width:"30%"}}>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"30%"}}>Invoice No</div>  <div style={{width:"5%"}}>:</div> <div style={{fontWeight:"normal"}}>{invoiceData[0]?.BillNo}</div></div>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"30%"}}>Invoice Date</div>      <div style={{width:"5%"}}>:</div> <div style={{fontWeight:"normal"}}>{invoiceData[0]?.BillDate}</div></div>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"30%"}}>Invoice From</div>        <div style={{width:"5%"}}>:</div> <div style={{fontWeight:"normal"}}>{invoiceData[0]?.BillFrom}</div></div>
                                            <div style={{display:"flex",width:"100%",fontWeight:"bold"}}><div style={{width:"30%"}}>Invoice To</div>     <div style={{width:"5%"}}>:</div> <div style={{fontWeight:"normal"}}>{formatDateToDDMMYYYY(invoiceData[0]?.BillTo)}</div></div>
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
                                                    <th style={headerCellStyle}>Sr No</th>
                                                    <th style={headerCellStyle}>Docket No</th>
                                                    <th style={headerCellStyle}>Date</th>
                                                    {isConsigChecked && <th style={headerCellStyle}>Consignee Name</th>}
                                                    <th style={headerCellStyle}>Origin</th>
                                                    <th style={headerCellStyle}>Destination</th>
                                                    <th style={headerCellStyle}>Mode</th>
                                                    <th style={headerCellStyle}>Qty</th>
                                                    {isActualChecked && <th style={headerCellStyle}>Weight</th>}
                                                    {isVolChecked && <th style={headerCellStyle}>Volumetric Wt</th>}
                                                    {isCharedChecked && <th style={headerCellStyle}>Charged Wt</th>}
                                                    {isRateChecked && <th style={headerCellStyle}>Rate Per Kg</th>}
                                                    {isDocketChecked && <th style={headerCellStyle}>Dkt Chrgs</th>}
                                                    {isHamaliChecked && <th style={headerCellStyle}>Pickup Chrgs</th>}
                                                    {isDeliveryChecked && <th style={headerCellStyle}>Delivery Chrgs</th>}
                                                    {isFovChecked && <th style={headerCellStyle}>FOV Chrgs</th>}
                                                    {isFuelChecked && <th style={headerCellStyle}>Fuel Chrgs</th>}
                                                    {isODAChecked && <th style={headerCellStyle}>ODA Chrgs</th>}
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
                                                            <td style={cellStyle}>{invoice?.DocketNo}</td>
                                                            <td style={cellStyle}>{formatDateToDDMMYYYY(invoice?.BookDate)}</td>
                                                            {isConsigChecked && <td style={cellStyle}>{invoice?.ConsigneeName}</td>}
                                                            <td style={cellStyle}>{invoice?.FromDest}</td>
                                                            <td style={cellStyle}>{invoice?.ToDest}</td>
                                                            <td style={cellStyle}>{invoice?.ModeName}</td>
                                                            <td style={cellStyle}>{invoice?.Qty}</td>
                                                            {isActualChecked && <td style={cellStyle}>{invoice?.ActualWt}</td>}
                                                            {isVolChecked && <td style={cellStyle}>{invoice?.VolumetricWt}</td>}
                                                            {isCharedChecked && <td style={cellStyle}>{invoice?.ChargedWt}</td>}
                                                            {isRateChecked && <td style={cellStyle}>{invoice?.RatePerkg}</td>}
                                                            {isDocketChecked && <td style={cellStyle}>{invoice?.DocketChrgs}</td>}
                                                            {isHamaliChecked && <td style={cellStyle}>{invoice?.HamaliChrgs}</td>}
                                                            {isDeliveryChecked && <td style={cellStyle}>{invoice?.DeliveryChrgs}</td>}
                                                            {isFovChecked && <td style={cellStyle}>{invoice?.Fov_Chrgs}</td>}
                                                            {isFuelChecked && <td style={cellStyle}>{invoice?.FuelCharges}</td>}
                                                            {isODAChecked && <td style={cellStyle}>{invoice?.ODA_Chrgs}</td>}
                                                            {isInsuranceChecked && <td style={cellStyle}>{invoice?.InsuranceChrgs}</td>}
                                                            {isPackingChecked && <td style={cellStyle}>{invoice?.PackingChrgs}</td>}
                                                            {isOtherChecked && <td style={cellStyle}>{invoice?.OtherCharges}</td>}

                                                            <td style={cellStyle}>{invoice?.Rate}</td>
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
                                <div className='foot'>
                                    <div style={{ width: "100%", display: "flex", border: "1px solid black", marginTop: "10px", justifyContent: "space-between", fontSize: "12px" }}>
                                        <div style={{ display: "flex", justifyContent:"space-between", alignItems: "start", flexDirection: "column", gap: "10px" ,padding:"10px"}}>
                                            <div style={{fontWeight:"bold"}}> Tax Payable on Revers charge (Yes/No)</div>
                                            
                                            <div style={{display: "flex", whiteSpace: "nowrap", flexDirection: "column", borderTop: "none", justifyContent: "end", fontSize: "13px" }}>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>Bank Name :</div>    <div style={{ textAlign: "start" }}>{getBranch?.Bank_Name}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>Branch :</div>  <div style={{ textAlign: "start" }}>{getBranch?.Company_Name}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>A/C No :</div> <div style={{ textAlign: "start" }}>{getBranch?.AccountNo}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>IFSC Code :</div> <div style={{ textAlign: "start" }}>{getBranch?.IFSC_Code}</div></div>
                                            </div>
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
                                                    <div>Fuel Charges</div>
                                                    <div>{fuelTotal.toFixed(2)}</div>
                                                </div>
                                            )}

                                            {isODAChecked && (
                                                <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                    <div>ODA Charges</div>
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
                                                <div>IGST@ of {invoiceData[0]?.IGSTPer}%</div>
                                                <div>{igst.toFixed(2)}</div>
                                            </div>

                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>CGST@ of {invoiceData[0]?.CGSTPer}%</div>
                                                <div>{cgst.toFixed(2)}</div>
                                            </div>

                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px", borderBottom: "1px solid black" }}>
                                                <div>SGST@ of {invoiceData[0]?.SGSTPer}%</div>
                                                <div>{sgst.toFixed(2)}</div>
                                            </div>

                                            <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                <div>Gross Total</div>
                                                <div>{grossTotal.toFixed(2)}</div>
                                            </div>


                                        </div>
                                    </div>
                                    <div style={{width: "100%", display: "flex", border: "1px solid black",borderTop:"none",fontWeight:"bold",paddingLeft:"5px"}}>Amount in words : {toTitleCase(toWords(Number(grossTotal || 0).toFixed(2)))}</div>


                                    <div style={{ width: "100%", display: "flex", whiteSpace: "nowrap", border: "1px solid black", borderTop: "none", padding: "5px", fontSize: "10px" }}>
                                        <div style={{ display: "flex", width: "65%", gap: "2px", flexDirection: "column" }}>
                                            <div style={{ fontWeight: "bold", fontSize: "11px"}}> TERMS :</div>
                                            {
                                                isTermChecked && termArr.length > 0 && termArr.map((data, index) => (
                                                    <div style={{ marginLeft: "5px",whiteSpace:"wrap" }}> {index + 1}. {data}.</div>
                                                ))

                                            }
                                            <div style={{ fontWeight: "bold", fontSize: "11px", marginLeft: "10px", marginTop: "20px", marginBottom: "20px" }}> This is Computerised Generated Bill hence does not require any  signature & Stam</div>
                                        </div>
                                        <div style={{ display: "flex", width: "35%", justifyContent: "center", alignItems: "center" }}>
                                            <div className='stamp' style={{
                                                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "40%",
                                                gap: "120px", fontWeight: "bold", fontSize: "13px", height: "130px", backgroundImage: `url(${getBranch?.Company_Stamp})`, // 👈 use your stored image
                                                backgroundSize: "contain",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                            }}>
                                                <div style={{}}>For <b style={{ marginLeft: "5px", fontWeight: "bold", fontSize: "11px" }}>{getBranch?.Company_Name}</b></div>
                                                <div> Auth. Signatory</div>
                                            </div>
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