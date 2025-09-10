import React, { useRef, useState, useEffect } from 'react';
import logoimg from '../../Assets/Images/AceLogo.jpeg';
import { useLocation, useNavigate } from 'react-router-dom';
import 'jspdf-autotable';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';


function Manifest() {

    const location = useLocation();
    const navigate = useNavigate();
    const manifest = location?.state?.data || {};
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
                const response = await getApi("/Master/getBranch");
                if (response.status === 1) {
                    console.log(response.Data);
                    setGetBranch(response.Data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])
    const BranchData = getBranch.length > 0 ? getBranch[1] : {};

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi(`/Manifest/viewManifestPrint?sessionLocationCode=MUM&manifestNo=${manifestNo}`);
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

    // const generatePDF = async () => {
    //     if (!pageRef.current) return;
    //     const canvas = await html2canvas(pageRef.current, { scale: 2 });
    //     const imgData = canvas.toDataURL('image/png');

    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     const pdfWidth = pdf.internal.pageSize.getWidth();
    //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //     pdf.save(`Manifest_${manifestNo}.pdf`);
    // };

    // if (loading) return <p>Loading...</p>;
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
        pdf.save(`Manifest_${manifestNo}.pdf`);
    };

    return (
        <>
            <style>
                {`@media print {
  body * {
  margin:0
    visibility: hidden; /* Hide everything by default */
  }
  
  #pdf, #pdf * {
  margin:0
    visibility: visible; /* Show only the PDF container */
  }
  
  #pdf {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box;
  }

  .table, .table th, .table td {
    border: 1px solid black !important; /* Ensure borders show */
    -webkit-print-color-adjust: exact; /* Keep background colors */
    print-color-adjust: exact;
    white-space: nowrap;
  }

  .th {
    background-color: rgba(36, 98, 113, 1) !important;
    color: white !important;
  }

  .container-2, .container-3 {
    width: 100% !important; /* Fit page width */
  }
  button {
    display: none !important; /* Hide buttons in print */
  }
}
`}
            </style>

            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="container">
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", margin: "10px 20px" }}>
                        <button
                            onClick={handleDownloadPDF}
                            style={{ padding: "8px 10px", borderRadius: "6px", background: "green", color: "white", border: "none", cursor: "pointer" }}
                        >
                            Download
                        </button>
                        <button
                            onClick={() => window.print()}
                            style={{ padding: "8px 10px", borderRadius: "6px", background: "red", color: "white", border: "none", cursor: "pointer" }}
                        >
                            Print
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            style={{ padding: "8px 10px", borderRadius: "6px", background: "gray", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
                        >
                            Exit
                        </button>
                    </div>

                    <div className="container-2" id="pdf" style={{ borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "840px", direction: "flex", flexDirection: "column", gap: "5px" }}>

                        <div className="container-2" style={{ borderRadius: "0px", width: "800px", display: "flex", flexDirection: "column" }}>

                            < div id="printable-section" className="container-3" style={{ padding: "0px" }}>
                                <div className="container-3" style={{ border: "7px double black" }}>

                                    <div style={{ height: "130px", display: "flex", flexDirection: "row", borderBottom: "1px solid black", paddingBottom: "5px", marginBottom: "5px" }}>
                                        <div style={{ width: "40%" }}>
                                            <img src={logoimg} alt="" style={{ height: "120px" }} />
                                        </div>
                                        <div style={{ width: "60%", display: "flex", flexDirection: "column" }}>
                                            <div style={{ textAlign: "center", height: "40%" }}>
                                                <p><b style={{ fontSize: "24px" }}>{BranchData.Company_Name}</b></p>
                                            </div>
                                            <div style={{ textAlign: "center", display: "flex", paddingLeft: "5px", marginLeft: "50px" }}>
                                                <div style={{ display: "flex", flexDirection: "column", fontWeight: "bold", width: "20%", fontSize: "10px", textAlign: "start" }}>
                                                    <span style={{}}>Address :</span>
                                                    <span style={{}}>Pin Code :</span>
                                                    <span style={{}}>Mob :</span>
                                                    <span style={{}}>Email :</span>
                                                    <span style={{}}>GST No :</span>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column", width: "70%", fontSize: "10px", textAlign: "start" }}>
                                                    <span>{BranchData.Branch_Add1}</span>
                                                    <span>{BranchData.Branch_PIN}</span>
                                                    <span>{BranchData.MobileNo}</span>
                                                    <span>{BranchData.Email}</span>
                                                    <span>{BranchData.GSTNo}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", fontSize: "10px", border: "1px solid black", marginBottom: "5px", marginTop: "20px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", width: "50%", borderRight: "1px solid black", padding: "10px" }}>
                                            <div>
                                                <label htmlFor=""><b>VENDOR NAME :</b></label>
                                                <span style={{ marginLeft: "10px" }}>{manifest.vendorName}</span>
                                            </div>

                                            <div>
                                                <label htmlFor=""><b>VEHICLE NO :</b></label>
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.vehicleNo}</label>
                                            </div>

                                            <div>
                                                <label htmlFor=""><b>DRIVER NAME :</b></label>
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.driverName}</label>
                                            </div>

                                            <div>
                                                <label htmlFor=""><b>DRIVER MOBILE NO :</b></label>
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.driverMobile}</label>
                                            </div>

                                            <div>
                                                <label htmlFor=""><b>REMARK :</b></label>
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.Remark}</label>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", width: "50%", padding: "10px" }}>
                                            <div>
                                                <label htmlFor=""><b>MANIFEST NO :</b></label>
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.manifestNo}</label>
                                            </div>

                                            <div>
                                                <label htmlFor=""><b>MANIFEST DATE :</b></label>
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.manifestDt}</label>
                                            </div>

                                            <div>
                                                <label htmlFor=""><b>ORIGIN CITY :</b></label>
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.fromDest}</label>
                                            </div>

                                            <div>
                                                <label htmlFor=""><b>DESTINATION CITY :</b></label>
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.toDest}</label>
                                            </div>

                                            <div>
                                                <label htmlFor=""><b>MODE :</b></label>
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.Mode_Name}</label>
                                            </div>

                                            <div>
                                                <label htmlFor=""><b>VEHICLE TYPE :</b></label>
                                                <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.VehicleType}</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-container2" style={{ borderBottom: "1px solid black" }}>
                                        <table className='table table-bordered table-sm' style={{ border: "1px solid black" }}>
                                            <thead className='thead'>
                                                <tr className='tr'>
                                                    <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Sr.No</th>
                                                    <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Date</th>
                                                    <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Docket.No</th>
                                                    <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Customer.Name</th>
                                                    <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Consignee.Name</th>
                                                    <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>From</th>
                                                    <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>To</th>
                                                    <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>MODE</th>
                                                    <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>QTY</th>
                                                    <th scope="col" className='th' style={{ backgroundColor: "rgba(36, 98, 113, 1)" }}>Actual.Wt</th>
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
                                            <p style={{ textAlign: "start", paddingLeft: "5px" }}><b style={{ fontSize: "12px", marginRight: "10px" }}>{BranchData.Company_Name}</b></p>
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


                </div>
            </div >
        </>
    );
}

export default Manifest;