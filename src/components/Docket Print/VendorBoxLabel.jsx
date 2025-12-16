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

function VendorBoxLabel() {
    const [getBranch, setGetBranch] = useState([]);
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


    const handleDownloadPDF = async () => {
    const containerElements = document.querySelectorAll(".download");
    if (containerElements.length === 0) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    let itemCount = 0; // Counter for elements on page

    for (let i = 0; i < containerElements.length; i++) {
        const element = containerElements[i];

        const canvas = await html2canvas(element, {
            scale: 6,
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.scrollWidth,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        // Size of half page
        const imgHeight = pdfHeight / 2 - 10;  // margin
        const imgWidth = pdfWidth - 10;

        const x = 5;   // margin left
        const y = itemCount === 0 ? 5 : pdfHeight / 2 + 5; // top for 1st, half-page for 2nd

        pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);

        itemCount++;

        // If 2 added → new page
        if (itemCount === 2 && i < containerElements.length - 1) {
            pdf.addPage();
            itemCount = 0;
        }
    }

    pdf.save("VendorBoxLabel.pdf");
};



    const docket = data;
    const rate = Number(docket?.Rate || 0);
    const packing = Number(docket?.PackingChrgs || 0);
    const hamali = Number(docket?.HamaliChrgs || 0);
    const service = Number(docket?.InsuranceChrgs || 0);
    const loading = Number(docket?.GreenChrgs || 0);
    const other = Number(docket?.OtherCharges || 0);

    const sgst = Number(docket?.SGSTAMT || 0);
    const cgst = Number(docket?.CGSTAMT || 0);

    const advance = Number(docket?.AdvancePaid || 0);

    // Subtotal
    const subtotal = rate + packing + hamali + service + loading + other;

    // Total GST
    const totalGST = sgst + cgst;

    // Total Freight
    const totalFreight = subtotal + totalGST;

    // Remaining Amount
    const remaining = totalFreight - advance;





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
    top: 0;
    width: auto !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }

  .download {
     page-break-inside: avoid;     /* 🚫 Do NOT cut this docket */
    break-inside: avoid;   
    margin: 0 !important;
  }
    @page {
    size: A4 auto;
    
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
                        <div className="container-2" id='pdf' style={{ borderRadius: "0px", paddingLeft: "20px", fontFamily: '"Times New Roman", Times, serif', paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "1040px", direction: "flex", flexDirection: "column", gap: "5px", justifyContent: "center" }}>
                            {
                                data.map((docket, index) =>
                                (
                                    <div className="docket" key={index} style={{ display: "flex", flexDirection: "column", gap: "100px" }}>
                                        {
                                            Array.from({ length: docket.Qty }, (_, i) => (
                                                <div className='download'>
                                                    <div className="container-2 p-0" style={{ borderRadius: "0px", width: "995px", border: "none", display: "flex", fontSize: "12px", flexDirection: "column", border: "1px solid gray" }}>
                                                        <div className='div1 ' style={{ borderBottom: "1px solid gray", width: "100%", display: "flex", color: "black" }}>
                                                            <div className='logo' style={{
                                                                width: "82%", display: "flex", padding: "5px", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: "1px solid gray"

                                                            }}>
                                                                <div style={{ fontSize: "15px" }}>DOCKET NUMBER</div>
                                                                <BarCode
                                                                    value={docket?.DocketNo}
                                                                    format='CODE128'
                                                                    background='#fff'
                                                                    lineColor='#000'
                                                                    width={2}
                                                                    height={30}
                                                                    displayValue={true}
                                                                />
                                                            </div>
                                                            <div className='heading' style={{ width: "18%", fontWeight: "bold", fontSize: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                {i + 1}/{docket?.Qty}
                                                            </div>
                                                        </div>
                                                        <div className='div2 ' style={{ borderBottom: "1px solid gray", width: "100%", display: "flex", color: "black" }}>
                                                            <div className='left' style={{
                                                                width: "82%", display: "flex", flexDirection: "column",
                                                                borderRight: "1px solid gray"

                                                            }}>
                                                                <div className='l1' style={{ fontWeight: "bold", fontSize: "14px", display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "44%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>CUSTOMER NAME</div>
                                                                    <div style={{ width: "6%", borderRight: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>QTY</div>
                                                                    <div style={{ width: "10%", borderRight: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>ORIGIN</div>
                                                                    <div style={{ width: "17%", borderRight: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>DESTINATION</div>
                                                                    <div style={{ width: "23%", display: "flex", justifyContent: "center", alignItems: "center" }}>SERVICE</div>
                                                                </div>
                                                                <div className='l2' style={{ fontSize: "12px", display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "44%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>{docket?.Customer_Name}</div>
                                                                    <div style={{ width: "6%", borderRight: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.Qty}</div>
                                                                    <div style={{ width: "10%", borderRight: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.Origin_Name}</div>
                                                                    <div style={{ width: "17%", borderRight: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>{docket?.Destination_Name}</div>
                                                                    <div style={{ width: "23%", display: "flex", justifyContent: "center", alignItems: "center" }}>SERVICE</div>
                                                                </div>
                                                                <div className='l3' style={{ fontWeight: "bold", fontSize: "14px", display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>SENDER'S COMPANY</div>
                                                                    <div style={{ width: "50%", display: "flex", paddingLeft: "5px" }}>RECIPIENT'S COMPANY</div>

                                                                </div>
                                                                <div className='l4' style={{ fontSize: "12px", display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>{docket?.Shipper_Name}</div>
                                                                    <div style={{ width: "50%", display: "flex", paddingLeft: "5px" }}>{docket?.Consignee_Name}</div>

                                                                </div>
                                                                <div className='l5' style={{ fontWeight: "bold", fontSize: "14px", display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>SENDER'S NAME</div>
                                                                    <div style={{ width: "50%", display: "flex", paddingLeft: "5px" }}>RECIPIENT'S NAME</div>

                                                                </div>
                                                                <div className='l6' style={{ fontSize: "12px", display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>{docket?.Shipper_Name}</div>
                                                                    <div style={{ width: "50%", display: "flex", paddingLeft: "5px" }}>{docket?.Consignee_Name}</div>

                                                                </div>
                                                                <div className='l7' style={{ fontWeight: "bold", fontSize: "14px", display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>ADDRESS</div>
                                                                    <div style={{ width: "50%", display: "flex", paddingLeft: "5px" }}>ADDRESS</div>

                                                                </div>
                                                                <div className='l8' style={{ fontSize: "12px", display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>{docket?.ShipperAdd},{docket?.ShipperAdd2},{docket?.ShipperAdd3}</div>
                                                                    <div style={{ width: "50%", display: "flex", paddingLeft: "5px" }}>{docket?.Consignee_Add1},{docket?.Consignee_Add2}</div>

                                                                </div>

                                                                <div className='l7' style={{ display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>
                                                                        <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                            <div style={{ fontWeight: "bold", fontSize: "14px", }}>PIN CODE :</div>
                                                                            <div style={{ fontSize: "12px", }}></div>
                                                                        </div>
                                                                        <div style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                            <div style={{ fontWeight: "bold", fontSize: "14px", }}>MOBILE NO :</div>
                                                                            <div style={{ fontSize: "12px", }}>(+91) {docket?.ShipperPhone}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ width: "50%", display: "flex", paddingLeft: "5px" }}>
                                                                        <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                            <div style={{ fontWeight: "bold", fontSize: "14px", }}>PIN CODE :</div>
                                                                            <div style={{ fontSize: "12px", }}>{docket?.Consignee_Pin}</div>
                                                                        </div>
                                                                        <div style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                            <div style={{ fontWeight: "bold", fontSize: "14px", }}>MOBILE NO :</div>
                                                                            <div style={{ fontSize: "12px", }}>(+91) {docket?.Consignee_Mob}</div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className='l8' style={{ fontSize: "12px", display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>{docket?.Shippercity},{docket?.Shipper_State_Name}</div>
                                                                    <div style={{ width: "50%", display: "flex", paddingLeft: "5px" }}>{docket?.Consignee_City},{docket?.Consignee_State_Name},{docket?.Consignee_Country}</div>

                                                                </div>
                                                                <div className='l9' style={{ display: "flex", borderBottom: "1px solid gray" }}>
                                                                    <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px" }}>
                                                                        <div style={{ width: "60%", borderRight: "1px solid gray", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                            <div style={{ fontWeight: "bold", fontSize: "14px", }}>DESCRIPTION OF GOODS</div>
                                                                            <div style={{ fontSize: "12px", }}>CLOTH COVER</div>
                                                                        </div>
                                                                        <div style={{ width: "40%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                            <div style={{ fontWeight: "bold", fontSize: "14px", }}>INTERNATIONAL</div>
                                                                            <div style={{ fontSize: "12px", }}>NON-DOX</div>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ width: "50%", display: "flex", paddingLeft: "5px" }}>
                                                                        <div style={{ width: "50%", borderRight: "1px solid gray", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                            <div style={{ fontWeight: "bold", fontSize: "14px", }}>BOOKING DATE</div>
                                                                            <div style={{ fontSize: "12px", }}>{docket?.BookDate}</div>
                                                                        </div>
                                                                        <div style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                            <div style={{ fontWeight: "bold", fontSize: "14px", }}>INSURANCE</div>
                                                                            <div style={{ fontSize: "12px", display: "flex", gap: "10px" }}>
                                                                                <div style={{ display: "flex" }}>
                                                                                    <input type='checkbox' />
                                                                                    <span>YES</span>
                                                                                </div>
                                                                                <div style={{ display: "flex" }}>
                                                                                    <input type='checkbox' />
                                                                                    <span>NO</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className='l10' style={{ fontSize: "12px", display: "flex" }}>
                                                                    <div style={{ width: "33.33%", borderRight: "1px solid gray", display: "flex", paddingLeft: "5px", display: "flex", padding: "5px", flexDirection: "column", }}>
                                                                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>SHIPPER AGREEMENT</div>
                                                                        <div >Shipper agreement to OM International Courier Cargo Services standard terms and conditions of carriage</div>
                                                                        <div style={{ fontSize: "14px", fontWeight: "bold", display: "flex", marginTop: "30px" }}>SHIPPER SIGNATURE</div>
                                                                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>BOOKING DATE</div>
                                                                        <div>{docket?.BookDate}</div>
                                                                    </div>
                                                                    <div style={{ width: "33.33%", borderRight: "1px solid gray", display: "flex", padding: "5px", flexDirection: "column", alignItems: "center", justifyContent: "center", }}>

                                                                        <div style={{ fontSize: "15px" }}>PARCEL NUMBER</div>
                                                                        <BarCode
                                                                            value={docket?.vendorAwbno}
                                                                            format='CODE128'
                                                                            background='#fff'
                                                                            lineColor='#000'
                                                                            width={2}
                                                                            height={50}
                                                                            displayValue={true}
                                                                        />

                                                                    </div>
                                                                    <div style={{ width: "33.33%", display: "flex", paddingLeft: "5px", flexDirection: "column", gap: "20px" }}>
                                                                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>Received in good condition</div>
                                                                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>NAME</div>
                                                                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>SIGN</div>
                                                                    </div>

                                                                </div>

                                                            </div>
                                                            <div className='right' style={{ width: "18%", fontWeight: "bold", fontSize: "13px", display: "flex", flexDirection: "column" }}>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>Box Weight</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>{docket?.VolumetricWt * docket?.ActualWt * docket?.ChargedWt}</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>DIMS IN CM</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>{docket?.VolumetricWt} * {docket?.ActualWt} * {docket?.ChargedWt} </div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>BOX VOL WT</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>{docket?.VolumetricWt}</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>ACTUAL WEIGHT</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>{docket?.ActualWt}</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>CHARGEABLE WT</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>{docket?.ChargedWt}</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>PAYMENT METHOD</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", height: "6%" }}>{docket?.T_Flag}</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>FREIGHT : {docket?.Rate}</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>OTHER : {docket?.OtherCharges}</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>CGST @ : {docket?.CGSTAMT}</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>SGST @ : {docket?.SGSTAMT}</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>IGST @ : {docket?.IGSTAMT}</div>
                                                                <div style={{ borderBottom: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>TOTAL : {docket?.Rate + docket?.OtherCharges + docket?.CGSTAMT + docket?.IGSTAMT + docket?.SGSTAMT}</div>
                                                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>REF NO : 727552</div>

                                                            </div>
                                                        </div>
                                                        <div className='div3 ' style={{ width: "100%", display: "flex", color: "black" }}>
                                                            <div className='logo' style={{
                                                                width: "100%", display: "flex", padding: "20px", alignItems: "center", justifyContent: "center",

                                                            }}>
                                                                <div style={{ fontSize: "10px", width: "90%", border: "1px solid gray", display: "flex", padding: "5px", fontWeight: "bold", flexDirection: "column" }}>
                                                                    <div>TERMS & CONDITIONS :</div>
                                                                    <div>1. NO CLAIMS WOULD BE ENTERTAINED FOR ANY DAMAGE DURING TRANSIT & DELAY IN DELIVERY DUE TO ANY REASON</div>
                                                                    <div>2. MAXIMUM CLAIMS FOR LOSS OF PARCEL WOULD BE USD 50 UPTO 10 KGS & USD 100 ABOVE 10 KGS OR THE DECLARED VALUE WHICHEVER IS LOWER. </div>
                                                                    <div>3. THIS AWB IS FOR THE ACCOUNT HOLDER AND IT IS NOT TRANSFERABLE.THIS RECEIPT DOES NOT IMPLY WE HAVE PHYSICALLY RECEIVED THE PARCEL IN OUR HUB</div>
                                                                    <div>*** SUBJECT TO MUMBAI JURISDICTION***</div>

                                                                </div>
                                                            </div>

                                                        </div>




                                                    </div>
                                                </div>
                                            ))
                                        }
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

export default VendorBoxLabel;