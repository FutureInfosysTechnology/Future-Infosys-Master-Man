import React, { useRef, useState, useEffect } from 'react';
import logoimg from '../../Assets/Images/AceLogo.jpeg';
import { useLocation, useNavigate } from 'react-router-dom';
import 'jspdf-autotable';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";



function Manifest() {

    const location = useLocation();
    const navigate = useNavigate();
    const manifest = location?.state?.data || {};
    const fromPath = location?.state?.from || "/";
    const [getBranch, setGetBranch] = useState([]);
    const [manifestData, setGetManifestData] = useState([]);
    console.log(location.state);
    const manifestNo = manifest?.manifestNo || "";
    const sumQty = manifest?.sumQty || 0;
    const sumActualWt = manifest?.sumActualWt || 0;
    const [loading, setLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    console.log(manifestNo, sumQty, sumActualWt);
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
                const response = await getApi(`/Manifest/viewManifestPrint?sessionLocationCode=${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}&manifestNo=${manifestNo}`);
                setGetManifestData(Array.isArray(response.data) ? response.data : []);
                console.log(response);
            } catch (err) {
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
                setIsDataLoaded(true);
                // generatePDF();
            }
        };
        if (manifestNo) {
            fetchData();
        }
    }, [manifestNo]);

    // useEffect(() => {
    //     if (!loading && manifestData.length > 0 && getBranch.length > 0) {
    //         setTimeout(generatePDF, 1000);
    //     }
    // }, [loading, manifestData, getBranch]);

    const generatePDF = async () => {
        if (!pageRef.current) return;
        const canvas = await html2canvas(pageRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        // 
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        // 
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Manifest_${manifestNo}.pdf`);
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
    saveAs(new Blob([buffer]), `Manifest_${manifestNo}.xlsx`);
};
    // if (loading) return <p>Loading...</p>;

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

                <div className="container-2" style={{ borderRadius: "0px", width: "892px", height: "40px", border: "none" }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "892px", display: "flex", flexDirection: "row", border: "none", justifyContent: "end", gap: "10px", fontSize: "12px", alignItems: "center" }}>
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
                            onClick={() => handleExcelDownloadExact()}
                            style={{ padding: "5px 10px", borderRadius: "6px", background: "yellow", color: "black", border: "none", cursor: "pointer" }}
                        >
                            Excel
                        </button>
                        <button
                            onClick={() => navigate(fromPath, { state: { tab: "viewint" } })}
                            style={{ padding: "5px 10px", borderRadius: "6px", background: "gray", color: "white", border: "none", cursor: "pointer" }}
                        >
                            Exit
                        </button>

                    </div>
                </div>

                <div className="container-2" ref={pageRef} id="pdf" style={{
                    borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "892px", direction: "flex",
                    flexDirection: "column", gap: "5px", fontFamily: '"Times New Roman", Times, serif',
                }}>

                    <div className="container-2" style={{ borderRadius: "0px", width: "850px", display: "flex", flexDirection: "column" }}>

                        < div id="printable-section" className="container-3" style={{ padding: "0px" }}>
                            <div className="container-3" style={{ border: "5px double black" }}>

                                <div style={{ display: "flex", flexDirection: "row", border: "none", paddingBottom: "5px", marginBottom: "5px", gap: "30px" }}>
                                    <div style={{ width: "35%" }}>
                                        <img src={getBranch.Branch_Logo} alt="" style={{ height: "100px", width: "100%" }} />
                                    </div>
                                    <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div style={{ fontSize: "20px", lineHeight: "1", fontWeight: "bold" }}>
                                            {getBranch.Company_Name}
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
                                        <div>
                                            <label htmlFor=""><b>VENDOR NAME :</b></label>
                                            <span style={{ marginLeft: "10px" }}>{manifestData[0]?.vendorName}</span>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>FORWARD NO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.vehicleNo}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>MAWB NO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.driverName}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>CARRIER :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.driverMobile}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>TRAVEL :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.Remark}</label>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "50%", padding: "10px" }}>
                                        <div>
                                            <label htmlFor=""><b>MANIFEST NO :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifestData[0]?.manifestNo}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>MANIFEST DATE :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifestData[0]?.Manifest_Dt}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>ORIGIN CITY :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifestData[0]?.originName}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>DESTINATION CITY :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifestData[0]?.DestName}</label>
                                        </div>

                                        <div>
                                            <label htmlFor=""><b>MODE :</b></label>
                                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifestData[0]?.modeName}</label>
                                        </div>

                                    </div>
                                </div>

                                <div className="table-container2" style={{ borderBottom: "1px solid black" }}>
                                    <table className='table table-bordered table-sm' style={{ border: "1px solid black" }}>
                                        <thead className='thead'>
                                            <tr className='tr'>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Sr.No</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Docket.No</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Shipper</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Consignee</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Dox/Spx</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Content</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>No Ship</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Qty</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Actual.Wt</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Destination</th>
                                                <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Ship</th>
                                            </tr>
                                        </thead>

                                        <tbody className='tbody'>
                                            {manifestData.length > 0 ?
                                                manifestData.map((manifest, index) => (
                                                    <tr key={index} className='tr'>
                                                        <td className='td'>{index + 1}</td>
                                                        <td className='td'>{manifest.bookDate}</td>
                                                        <td className='td'>{manifest.DocketNo}</td>
                                                        <td className='td'>{manifest.customerName}</td>
                                                        <td className='td'>{manifest.T_Flag}</td>
                                                        <td className='td'>{manifest.Consignee}</td>
                                                        <td className='td'>{manifest.fromDestName}</td>
                                                        <td className='td'>{manifest.toDestName}</td>
                                                        <td className='td'>{manifest.modeName}</td>
                                                        <td className='td'>{manifest.Qty}</td>
                                                        <td className='td'>{manifest.ActualWt}</td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="10">No data available</td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>

                                    <div className='page'>

                                         <div>
                                            <label htmlFor="">Total Ship :</label>
                                            <label htmlFor="" style={{ width: "40px", marginLeft: "5px" }}>{sumQty}</label>
                                        </div>
                                        <div>
                                            <label htmlFor="">Total QTY :</label>
                                            <label htmlFor="" style={{ width: "40px", marginLeft: "5px" }}>{sumQty}</label>
                                        </div>

                                        <div>
                                            <label htmlFor="">Total Wt :</label>
                                            <label htmlFor="" style={{ width: "40px", marginLeft: "5px" }}>{sumActualWt}</label>
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

export default Manifest;