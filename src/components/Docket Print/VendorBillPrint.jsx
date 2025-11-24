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

function VendorBillPrint() {

    const location = useLocation();
    const navigate = useNavigate();
    const data = location?.state?.data || "";
    const fromPath = location?.state?.from || "/";
    const tab = location?.state?.tab;
    const [getBranch, setGetBranch] = useState([]);
    const [vendorData, setGetVendorData] = useState({});
    console.log(location.state);
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
        setGetVendorData(data);
    }, [])
    const pageRef = useRef();
    
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
  pdf.save(`VendorBill_${data?.VendorID}.pdf`);
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
    margin: 0 auto !important;
    overflow: hidden !important;
    background: white !important;
    box-sizing: border-box !important;
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
                            onClick={() => navigate(fromPath, { state: { tab:tab } })}
                            style={{ padding: "5px 10px", borderRadius: "6px", background: "gray", color: "white", border: "none", cursor: "pointer" }}
                        >
                            Exit
                        </button>
                    </div>
                </div>

                <div className="container-2" ref={pageRef} id="pdf" style={{
                    borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px"
                    , paddingBottom: "20px", width: "793px", direction: "flex", fontFamily: "Roboto",
                    flexDirection: "column", gap: "5px", fontSize: "10px", fontWeight: "bold",border:"none"
                }}>

                    <div className="container-2" style={{ borderRadius: "0px", border: "none", width: "750px", display: "flex", flexDirection: "column" }}>
                        < div id="printable-section" className="container-3" style={{ padding: "0px", border: "none" }}>
                        <div className="container-3 px-0 py-0" style={{ border: "2px solid black", height: "815px"}}>

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
                                                <div style={{ fontSize: "12px", fontWeight: "bolder" }}>Bill No:</div>
                                                <div>{vendorData.BillNo}</div>
                                            </div>
                                            <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <div style={{ fontSize: "12px", fontWeight: "bolder" }}>Bill Date:</div>
                                                <div>{vendorData.BillDate}</div>
                                            </div>
                                            <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <div style={{ fontSize: "12px", fontWeight: "bolder" }}>Bill From:</div>
                                                <div>{vendorData.BillFrom}</div>
                                            </div>
                                            <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <div style={{ fontSize: "12px", fontWeight: "bolder" }}>Bill To:</div>
                                                <div>{vendorData.BillTo}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="div2" style={{ display: "flex", flexDirection: "row", borderBottom: "2px solid black", }}>
                                    <div style={{ width: "50%", borderRight: "2px solid black", display: "flex", paddingBottom: "5px", flexDirection: "column", paddingLeft: "8px", paddingTop: "5px", gap: "2px" }}>
                                        <div style={{ fontSize: "12px" }}>CUSTOMER TO</div>
                                        <div style={{ fontSize: "13px", fontWeight: "bolder" }}>{vendorData?.Customer_Name}</div>
                                        <div style={{ display: "flex", gap: "2px" }}>
                                            <div style={{ width: "12%" }}> Address:</div>
                                            <div style={{ width: "80%" }}></div>
                                        </div>
                                        <div style={{ display: "flex", gap: "15px" }}>
                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <div style={{ fontWeight: "bolder" }}>GST No:</div>
                                                <div></div>
                                            </div>
                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <div style={{ fontWeight: "bolder" }}> State Name:</div>
                                                <div></div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "15px" }}>
                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <div style={{ fontWeight: "bolder" }}> Mobile No:</div>
                                                <div> (+91)   </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ width: "50%", paddingBottom: "5px", display: "flex", flexDirection: "column", paddingLeft: "8px", paddingTop: "5px", gap: "2px" }}>
                                        <div style={{ fontSize: "12px" }}>VENDOR TO</div>
                                        <div style={{ fontSize: "13px", fontWeight: "bolder" }}>{vendorData?.Vendor_Name}</div>
                                        <div style={{ display: "flex", gap: "2px" }}>
                                            <div style={{ width: "12%" }}> Address:</div>
                                            <div style={{ width: "80%" }}> </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "15px" }}>
                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <div style={{ fontWeight: "bolder" }}>GST No:</div>
                                                <div></div>
                                            </div>
                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <div style={{ fontWeight: "bolder" }}> State Name:</div>
                                                <div></div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "15px" }}>
                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <div style={{ fontWeight: "bolder" }}> Mobile No:</div>
                                                <div> (+91)  </div>
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
                                    <div style={{ width: "60%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>DISCRIPTION</div>
                                    <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>VENDOR AWBNO</div>
                                    <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center" }}>AMOUNT</div>
                                </div>
                                <div style={{ position: "relative", height: "550px" }}>
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
                                            height: "532px",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "row",
                                        }}>
                                            {/* S.NO */}
                                            <div style={{ width: "10%", display: "flex", flexDirection: "column", borderRight: "2px solid black", gap: "5px", paddingTop: "5px" }}>
                                               1
                                            </div>

                                            {/* ITEMS */}
                                            <div style={{ width: "60%", display: "flex", flexDirection: "column", borderRight: "2px solid black", gap: "5px", paddingTop: "5px", textAlign: "start", paddingLeft: "10px" }}>
                                                {vendorData?.OtherCharges}
                                            </div>

                                            {/* HSN */}
                                            <div style={{ width: "15%", display: "flex", flexDirection: "column", borderRight: "2px solid black", gap: "5px", paddingTop: "5px" }}>
                                               {vendorData?.VendorAWBNo}
                                            </div>

                                            

                                            {/* AMOUNT */}
                                            <div style={{ width: "15%", display: "flex", flexDirection: "column", gap: "5px", paddingTop: "5px" }}>
                                                {vendorData?.Amount}
                                            </div>
                                        </div>
                                        <div className="div5" style={{ height: "25px", textAlign: "center", display: "flex", flexDirection: "row", }}>
                                            <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                            <div style={{ width: "60%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                            <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>IGST (0)%</div>
                                            <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
                                        </div>
                                        <div className="div6" style={{ height: "25px", textAlign: "center", display: "flex", flexDirection: "row", }}>
                                            <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                            <div style={{ width: "60%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                            <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>CGST (9)%</div>
                                            <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center" }}>{vendorData?.GST/2}</div>
                                        </div>
                                        <div className="div7" style={{ height: "25px", textAlign: "center", display: "flex", flexDirection: "row", borderBottom: "2px solid black" }}>
                                            <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                            <div style={{ width: "60%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                            <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>SGST (9)%</div>
                                            <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center" }}>{vendorData?.GST/2}</div>
                                        </div>
                                    </div>
                                </div>
                            <div className="div8" style={{ height: "30px", textAlign: "center", display: "flex", flexDirection: "row", backgroundColor: "rgba(255, 192, 203, 0.1)" }}>

                                <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                <div style={{ width: "60%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>TOTAL</div>
                                <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}></div>
                                <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center" }}>{vendorData?.TotalAmount}</div>
                            </div>
                        </div>
                        <div className="second px-0 py-0 mt-2" style={{ border: "2px solid black" }}>
                            <div className="div1" style={{
                                height: "40px", textAlign: "center", display: "flex", flexDirection: "row",
                                fontWeight: "bolder", fontSize: "11px", backgroundColor: "rgba(255, 192, 203, 0.1)", borderBottom: "2px solid black"
                            }}>

                                <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>Taxable Value</div>
                                <div style={{ width: "20%", display: "flex", flexDirection: "column", borderRight: "2px solid black" }}>
                                    <div style={{ borderBottom: "2px solid black" }}>IGST</div>
                                    <div style={{ display: "flex" ,height:"100%"}}>
                                        <div style={{ width: "40%", borderRight: "2px solid black", display:"flex",justifyContent:"center", alignItems:"center"}}>Rate</div>
                                        <div style={{ width: "60%",display:"flex",justifyContent:"center", alignItems:"center" }}>Amount</div>
                                    </div>
                                </div>
                                <div style={{ width: "20%", display: "flex", flexDirection: "column", borderRight: "2px solid black" }}>
                                    <div style={{ borderBottom: "2px solid black" }}>CGST</div>
                                   <div style={{ display: "flex" ,height:"100%"}}>
                                        <div style={{ width: "40%", borderRight: "2px solid black", display:"flex",justifyContent:"center", alignItems:"center"}}>Rate</div>
                                        <div style={{ width: "60%",display:"flex",justifyContent:"center", alignItems:"center" }}>Amount</div>
                                    </div>
                                </div>
                                <div style={{ width: "20%", display: "flex", flexDirection: "column", borderRight: "2px solid black" }}>
                                    <div style={{ borderBottom: "2px solid black" }}>SGST</div>
                                    <div style={{ display: "flex" ,height:"100%"}}>
                                        <div style={{ width: "40%", borderRight: "2px solid black", display:"flex",justifyContent:"center", alignItems:"center"}}>Rate</div>
                                        <div style={{ width: "60%",display:"flex",justifyContent:"center", alignItems:"center" }}>Amount</div>
                                    </div>
                                </div>
                                <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}> Total Tax Amount</div>
                            </div>
                            <div className="div2" style={{ height: "20px", textAlign: "center", display: "flex", flexDirection: "row", }}>
                                <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "2px solid black" }}>{vendorData?.Amount}</div>
                                <div style={{ width: "20%", display: "flex", borderRight: "2px solid black" }}>

                                    <div style={{ width: "40%", borderRight: "2px solid black", paddingTop: "3px" }}> 0%</div>
                                    <div style={{ width: "60%", paddingTop: "3px" }}>0</div>

                                </div>
                                <div style={{ width: "20%", display: "flex", borderRight: "2px solid black" }}>

                                    <div style={{ width: "40%", borderRight: "2px solid black", paddingTop: "3px" }}> 9%</div>
                                    <div style={{ width: "60%", paddingTop: "3px" }}>{vendorData?.GST/2}</div>

                                </div>
                                <div style={{ width: "20%", display: "flex", borderRight: "2px solid black" }}>

                                    <div style={{ width: "40%", borderRight: "2px solid black", paddingTop: "3px" }}> 9%</div>
                                    <div style={{ width: "60%", paddingTop: "3px" }}>{vendorData?.GST/2}</div>

                                </div>
                                <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>{vendorData?.TotalAmount}</div>
                            </div>
                        </div>
                        <div className="third px-0 py-0 mt-2" style={{ border: "2px solid black" }}>
                            <div style={{ display: "flex", flexDirection: "column", padding: "5px", borderBottom: "2px solid black" }}>
                                <div style={{ fontWeight: "bolder", fontSize: "13px" }}> Total Amount (in words)
                                </div>
                                <div> {vendorData?.TotalAmount ? numberToIndianCurrency(Number(vendorData?.TotalAmount)) : ""}</div>
                            </div>
                            <div style={{ display: "flex" }}>
                                <div style={{ display: "flex", flexDirection: "column", fontSize: "11px", width: "50%", padding: "5px", borderRight: "2px solid black" }}>
                                    <div style={{ fontWeight: "bolder", fontSize: "13px" }}> Bank Details</div>
                                    <div style={{ display: "flex" }}><div style={{ width: "30%" }}>Name:</div><div>{getBranch.Company_Name}</div></div>
                                    <div style={{ display: "flex" }}><div style={{ width: "30%" }}>IFSC Code:</div><div>{getBranch.IFSC_Code}</div></div>
                                    <div style={{ display: "flex" }}><div style={{ width: "30%" }}>Account No:</div><div>{getBranch.AccountNo}</div></div>
                                    <div style={{ display: "flex" }}><div style={{ width: "30%" }}> Bank:</div><div>{getBranch.Bank_Name}</div></div>
                                </div>
                                <div style={{ display: "flex", width: "50%", flexDirection: "column", justifyContent:"space-around", alignItems: "center", paddingBottom: "5px" }}>
                                    <div style={{ fontWeight: "bolder", fontSize: "13px" }}>Authorised Signatory For
                                    </div>
                                    <div style={{ fontWeight: "bolder", fontSize: "13px" }}>{getBranch.Company_Name}</div>
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

export default VendorBillPrint;