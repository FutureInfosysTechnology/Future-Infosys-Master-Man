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
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";




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
    const [termArr, setTermArr] = useState([]);
    const [isChecked, setIsChecked] = useState({
        Delivery_Charges: false,
        Hamali_Charges: false,
        ODA_Charges: false,
        Charged_Weight: false,
        Consignee_Name: false,
        Fov_Charges: false,
        Packing_Charges: false,
        Other_Charges: false,
        Fuel_Charges: false,
        Volumetric_Weight: false,
        Docket_Charges: false,
        Green_Charges: false,
        Insurance_Charges: false,
        Actual_Weight: false,
        Rate_Per_Kg: false,
        Term_And_Conditions: false
    });
    const tab = location?.state?.tab;
    const [getBranch, setGetBranch] = useState([]);
    const [invoiceData, setInvoiceData] = useState([]);
    console.log(location.state);
    const [loading, setLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
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
        const fetchSetup = async () => {
            try {
                const response = await getApi(`/Master/getInvoicesSetup`);

                if (response.status === 1) {
                    const setup = response.data[0];

                    const updatedChecks = {
                        Delivery_Charges: setup.Delivery_Charges,
                        Hamali_Charges: setup.Hamali_Charges,
                        ODA_Charges: setup.ODA_Charges,
                        Charged_Weight: setup.Charged_Weight,
                        Consignee_Name: setup.Consignee_Name,
                        Fov_Charges: setup.Fov_Charges,
                        Packing_Charges: setup.Packing_Charges,
                        Other_Charges: setup.Other_Charges,
                        Fuel_Charges: setup.Fuel_Charges,
                        Volumetric_Weight: setup.Volumetric_Weight,
                        Docket_Charges: setup.Docket_Charges,
                        Green_Charges: setup.Green_Charges,
                        Insurance_Charges: setup.Insurance_Charges,
                        Actual_Weight: setup.Actual_Weight,
                        Rate_Per_Kg: setup.Rate_Per_Kg,
                        Term_And_Conditions: true
                    };

                    setIsChecked(updatedChecks);
                    setTermArr(response.Terms1_Conditions);
                }

            } catch (error) {
                console.log("Setup Fetch Error:", error);
            }
        };

        fetchSetup();
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

const handleExcelDownloadExact = async () => {
    const element = document.getElementById("pdf");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Manifest");

    // Insert image into sheet
    const imageId = workbook.addImage({
        base64: imgData,
        extension: "png",
    });

    sheet.addImage(imageId, {
        tl: { col: 0, row: 0 },   // position
        ext: { width: canvas.width/3, height: canvas.height/3 } // scale to fit
    });

    // Download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "ManifestLayout.xlsx");
};




    const docketTotal = isChecked.Docket_Charges ? invoiceData.reduce((sum, inv) => sum + Number(inv.DocketChrgs || 0), 0) : 0;
    const hamaliTotal = isChecked.Hamali_Charges ? invoiceData.reduce((sum, inv) => sum + Number(inv.HamaliChrgs || 0), 0) : 0;
    const deliveryTotal = isChecked.Delivery_Charges ? invoiceData.reduce((sum, inv) => sum + Number(inv.DeliveryChrgs || 0), 0) : 0;
    const fovTotal = isChecked.Fov_Charges ? invoiceData.reduce((sum, inv) => sum + Number(inv.Fov_Chrgs || 0), 0) : 0;
    const fuelTotal = isChecked.Fuel_Charges ? invoiceData.reduce((sum, inv) => sum + Number(inv.FuelCharges || 0), 0) : 0;
    const odaTotal = isChecked.ODA_Charges ? invoiceData.reduce((sum, inv) => sum + Number(inv.ODA_Chrgs || 0), 0) : 0;
    const insuranceTotal = isChecked.Insurance_Charges ? invoiceData.reduce((sum, inv) => sum + Number(inv.InsuranceChrgs || 0), 0) : 0;
    const packingTotal = isChecked.Packing_Charges ? invoiceData.reduce((sum, inv) => sum + Number(inv.PackingChrgs || 0), 0) : 0;
    const otherTotal = isChecked.Other_Charges ? invoiceData.reduce((sum, inv) => sum + Number(inv.OtherCharges || 0), 0) : 0;

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
    const chargeFields = [
        { label: "Docket Charges", check: "Docket_Charges", total: docketTotal },
        { label: "Pickup Charges", check: "Hamali_Charges", total: hamaliTotal },
        { label: "Delivery Charges", check: "Delivery_Charges", total: deliveryTotal },
        { label: "FOV Charges", check: "Fov_Charges", total: fovTotal },
        { label: "Fuel Charges", check: "Fuel_Charges", total: fuelTotal },
        { label: "ODA Charges", check: "ODA_Charges", total: odaTotal },
        { label: "Insurance Charges", check: "Insurance_Charges", total: insuranceTotal },
        { label: "Packing Charges", check: "Packing_Charges", total: packingTotal },
        { label: "Other Charges", check: "Other_Charges", total: otherTotal },
    ];



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
                            onClick={()=>handleDownloadPDF()}
                            style={{ padding: "5px 5px", borderRadius: "6px", background: "green", color: "white", border: "none", cursor: "pointer" }}
                        >
                            Download
                        </button>

                        <button
                            onClick={()=>sendMail()}
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

                        <button
                            onClick={() => handleExcelDownloadExact()}
                            style={{ padding: "5px 10px", borderRadius: "6px", background: "yellow", color: "black", border: "none", cursor: "pointer" }}
                        >
                            Excel
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
                                    <div style={{ width: "75%", display: "flex", flexDirection: "column", gap: "5px" }}>
                                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
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

                                    <div style={{ display: "flex", flexDirection: "column", width: "60%" }}>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "15%" }}>Client Name</div>  <div style={{ width: "2%" }}>:</div> <div style={{ fontWeight: "normal", width: "83%" }}>{invoiceData[0]?.CustomerName}</div></div>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "15%" }}>Address</div>      <div style={{ width: "2%" }}>:</div> <div style={{ fontWeight: "normal", width: "83%" }}>{invoiceData[0]?.Customer_Add1},{invoiceData[0]?.Customer_Add2},{invoiceData[0]?.Customer_Add3}</div></div>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "15%" }}>State</div>        <div style={{ width: "2%" }}>:</div> <div style={{ fontWeight: "normal", width: "83%" }}>{invoiceData[0]?.State_Name}</div></div>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "15%" }}>Pin Code</div>     <div style={{ width: "2%" }}>:</div> <div style={{ fontWeight: "normal", width: "83%" }}>{invoiceData[0]?.Pin_Code}</div></div>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "15%" }}>Mobile No</div>    <div style={{ width: "2%" }}>:</div> <div style={{ fontWeight: "normal", width: "83%" }}>(+91) {invoiceData[0]?.Customer_Mob}</div></div>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "15%" }}>Gst No</div>       <div style={{ width: "2%" }}>:</div> <div style={{ fontWeight: "normal", width: "83%" }}>{invoiceData[0]?.Gst_No}</div></div>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "15%" }}>Email</div>        <div style={{ width: "2%" }}>:</div> <div style={{ fontWeight: "normal", width: "83%" }}>{invoiceData[0]?.Email_Id}</div></div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "30%" }}>Invoice No</div>  <div style={{ width: "5%" }}>:</div> <div style={{ fontWeight: "normal" }}>{invoiceData[0]?.BillNo}</div></div>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "30%" }}>Invoice Date</div>      <div style={{ width: "5%" }}>:</div> <div style={{ fontWeight: "normal" }}>{invoiceData[0]?.BillDate}</div></div>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "30%" }}>Invoice From</div>        <div style={{ width: "5%" }}>:</div> <div style={{ fontWeight: "normal" }}>{invoiceData[0]?.BillFrom}</div></div>
                                        <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}><div style={{ width: "30%" }}>Invoice To</div>     <div style={{ width: "5%" }}>:</div> <div style={{ fontWeight: "normal" }}>{formatDateToDDMMYYYY(invoiceData[0]?.BillTo)}</div></div>
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
                                                    {isChecked.Consignee_Name && <th style={headerCellStyle}>Consignee Name</th>}
                                                    <th style={headerCellStyle}>Origin</th>
                                                    <th style={headerCellStyle}>Destination</th>
                                                    <th style={headerCellStyle}>Mode</th>
                                                    <th style={headerCellStyle}>Qty</th>
                                                    {isChecked.Actual_Weight && <th style={headerCellStyle}>Weight</th>}
                                                    {isChecked.Volumetric_Weight && <th style={headerCellStyle}>Volumetric Wt</th>}
                                                    {isChecked.Charged_Weight && <th style={headerCellStyle}>Charged Wt</th>}
                                                    {isChecked.Rate_Per_Kg && <th style={headerCellStyle}>Rate Per Kg</th>}
                                                    {isChecked.Docket_Charges && <th style={headerCellStyle}>Dkt Chrgs</th>}
                                                    {isChecked.Hamali_Charges && <th style={headerCellStyle}>Pickup Chrgs</th>}
                                                    {isChecked.Delivery_Charges && <th style={headerCellStyle}>Delivery Chrgs</th>}
                                                    {isChecked.Fov_Charges && <th style={headerCellStyle}>FOV Chrgs</th>}
                                                    {isChecked.Fuel_Charges && <th style={headerCellStyle}>Fuel Chrgs</th>}
                                                    {isChecked.ODA_Charges && <th style={headerCellStyle}>ODA Chrgs</th>}
                                                    {isChecked.Insurance_Charges && <th style={headerCellStyle}>Insurance Chrgs</th>}
                                                    {isChecked.Packing_Charges && <th style={headerCellStyle}>Packing Chrgs</th>}
                                                    {isChecked.Other_Charges && <th style={headerCellStyle}>Other Chrgs</th>}

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
                                                            {isChecked.Consignee_Name && <td style={cellStyle}>{invoice?.ConsigneeName}</td>}
                                                            <td style={cellStyle}>{invoice?.FromDest}</td>
                                                            <td style={cellStyle}>{invoice?.ToDest}</td>
                                                            <td style={cellStyle}>{invoice?.ModeName}</td>
                                                            <td style={cellStyle}>{invoice?.Qty}</td>
                                                            {isChecked.Actual_Weight && <td style={cellStyle}>{invoice?.ActualWt}</td>}
                                                            {isChecked.Volumetric_Weight && <td style={cellStyle}>{invoice?.VolumetricWt}</td>}
                                                            {isChecked.Charged_Weight && <td style={cellStyle}>{invoice?.ChargedWt}</td>}
                                                            {isChecked.Rate_Per_Kg && <td style={cellStyle}>{invoice?.RatePerkg}</td>}
                                                            {isChecked.Docket_Charges && <td style={cellStyle}>{invoice?.DocketChrgs}</td>}
                                                            {isChecked.Hamali_Charges && <td style={cellStyle}>{invoice?.HamaliChrgs}</td>}
                                                            {isChecked.Delivery_Charges && <td style={cellStyle}>{invoice?.DeliveryChrgs}</td>}
                                                            {isChecked.Fov_Charges && <td style={cellStyle}>{invoice?.Fov_Chrgs}</td>}
                                                            {isChecked.Fuel_Charges && <td style={cellStyle}>{invoice?.FuelCharges}</td>}
                                                            {isChecked.ODA_Charges && <td style={cellStyle}>{invoice?.ODA_Chrgs}</td>}
                                                            {isChecked.Insurance_Charges && <td style={cellStyle}>{invoice?.InsuranceChrgs}</td>}
                                                            {isChecked.Packing_Charges && <td style={cellStyle}>{invoice?.PackingChrgs}</td>}
                                                            {isChecked.Other_Charges && <td style={cellStyle}>{invoice?.OtherCharges}</td>}
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
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexDirection: "column", gap: "10px", padding: "10px" }}>
                                            <div style={{ fontWeight: "bold" }}> Tax Payable on Revers charge (Yes/No)</div>

                                            <div style={{ display: "flex", whiteSpace: "nowrap", flexDirection: "column", borderTop: "none", justifyContent: "end", fontSize: "13px" }}>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>Bank Name :</div>    <div style={{ textAlign: "start" }}>{getBranch?.Bank_Name}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>Branch :</div>  <div style={{ textAlign: "start" }}>{getBranch?.Company_Name}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>A/C No :</div> <div style={{ textAlign: "start" }}>{getBranch?.AccountNo}</div></div>
                                                <div style={{ display: "flex", gap: "5px" }}><div style={{ fontWeight: "bold", }}>IFSC Code :</div> <div style={{ textAlign: "start" }}>{getBranch?.IFSC_Code}</div></div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", width: "20%", justifyContent: "start", alignItems: "start", flexDirection: "column", fontWeight: "bold" }}>

                                            {chargeFields.map(f =>
                                                isChecked[f.check] && (
                                                    <div style={{ width: "100%", paddingRight: "5px", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                                        <div>{f.label}</div>
                                                        <div>{f.total.toFixed(2)}</div>
                                                    </div>
                                                )
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
                                    <div style={{ width: "100%", display: "flex", border: "1px solid black", borderTop: "none", fontWeight: "bold", paddingLeft: "5px" }}>Amount in words : {toTitleCase(toWords(Number(grossTotal || 0).toFixed(2)))}</div>


                                    <div style={{ width: "100%", display: "flex", whiteSpace: "nowrap", border: "1px solid black", borderTop: "none", padding: "5px", fontSize: "10px" }}>
                                        <div style={{ display: "flex", width: "65%", gap: "2px", flexDirection: "column" }}>
                                            <div style={{ fontWeight: "bold", fontSize: "11px" }}> TERMS :</div>
                                            {
                                                isChecked.Term_And_Conditions && termArr.length > 0 && termArr.map((data, index) => (
                                                    <div style={{ marginLeft: "5px", whiteSpace: "wrap" }}> {index + 1}. {data}.</div>
                                                ))

                                            }
                                            <div style={{ fontWeight: "bold", fontSize: "11px", marginLeft: "10px", marginTop: "20px", marginBottom: "20px" }}> This is Computerised Generated Bill hence does not require any  signature & Stam</div>
                                        </div>
                                        <div style={{ display: "flex", width: "35%", justifyContent: "center", alignItems: "center" }}>
                                            <div className='stamp' style={{
                                                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "40%",
                                                gap: "120px", fontWeight: "bold", fontSize: "13px", backgroundImage: `url(${getBranch?.Company_Stamp})`, // 👈 use your stored image
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