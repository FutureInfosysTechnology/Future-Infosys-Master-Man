import React, { useRef, useState, useEffect } from 'react';
import logoimg from '../../Assets/Images/AceLogo.jpeg';
import { useLocation } from 'react-router-dom';
import 'jspdf-autotable';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


function Manifest() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const manifestNo = params.get('manifestNo');
    const sumQty = params.get('sumQty');
    const sumActualWt = params.get('sumActualWt');
    const [getBranch, setGetBranch] = useState([]);
    const pageRef = useRef();
    const [manifestData, setManifestData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi(`/Manifest/viewManifestPrint?sessionLocationCode=MUM&manifestNo=${manifestNo}`);
                setManifestData(Array.isArray(response.data) ? response.data : []);
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

    const manifest = manifestData.length > 0 ? manifestData[0] : {};

    const fetchBranchData = async () => {
        try {
            const response = await getApi('/Master/getBranch');
            setGetBranch(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranchData();
    }, []);

    useEffect(() => {
        if (isDataLoaded) {
            window.print();
        }
    }, [isDataLoaded]);

    const BranchData = getBranch.length > 0 ? getBranch[0] : {};

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


    return (
        < div id="printable-section" ref={pageRef} className="container-3" style={{ padding: "0px" }}>
            <div className="container-3" style={{ border: "7px double black" }}>

                <div style={{ height: "130px", display: "flex", flexDirection: "row", borderBottom: "1px solid black", paddingBottom: "5px", marginBottom: "5px" }}>
                    <div style={{ width: "40%" }}>
                        <img src={logoimg} alt="" style={{ height: "120px" }} />
                    </div>
                    <div style={{ width: "60%" }}>
                        <div style={{ textAlign: "center" }}>
                            <p><b style={{ fontSize: "24px" }}>Aventure Cargo Express</b></p>
                        </div>
                        <div style={{ textAlign: "center", display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "11px" }}><b>Office Address :</b>{BranchData.Branch_Add1}
                            </span>
                            <span style={{ fontSize: "10px", marginLeft: "5px" }}><b>Pin Code : {BranchData.Branch_PIN}</b></span>
                            <span style={{ fontSize: "10px", marginLeft: "5px" }}><b>Mob : {BranchData.MobileNo}</b></span>
                            <span style={{ fontSize: "10px", marginLeft: "5px" }}><b>Email : {BranchData.Email}</b></span>
                            <span style={{ fontSize: "10px", marginLeft: "5px" }}><b>GST No : {BranchData.GSTNo}</b></span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", fontSize: "12px", borderBottom: "1px solid black", paddingBottom: "15px", marginBottom: "5px", marginTop: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
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
                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.remark}</label>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
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
                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.originName}</label>
                        </div>

                        <div>
                            <label htmlFor=""><b>DESTINATION CITY :</b></label>
                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.toDestName}</label>
                        </div>

                        <div>
                            <label htmlFor=""><b>MODE :</b></label>
                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.modeName}</label>
                        </div>

                        <div>
                            <label htmlFor=""><b>VEHICLE TYPE :</b></label>
                            <label htmlFor="" style={{ marginLeft: "10px" }}>{manifest.vehicleType}</label>
                        </div>
                    </div>
                </div>

                <div className="table-container2" style={{ borderBottom: "1px solid black" }}>
                    <table className='table table-bordered table-sm' style={{ border: "1px solid black" }}>
                        <thead className='thead'>
                            <tr className='tr'>
                                <th scope="col" className='th'>Sr.No</th>
                                <th scope="col" className='th'>Date</th>
                                <th scope="col" className='th'>Docket.No</th>
                                <th scope="col" className='th'>Customer.Name</th>
                                <th scope="col" className='th'>Receiver</th>
                                <th scope="col" className='th'>From</th>
                                <th scope="col" className='th'>To</th>
                                <th scope="col" className='th'>MODE</th>
                                <th scope="col" className='th'>QTY</th>
                                <th scope="col" className='th'>Actual.Wt</th>
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
                    <div className='page'>
                        <p>Prepared by :</p><p><b style={{ fontSize: "12px", marginLeft: "5px", marginRight: "10px" }}>Aventure Cargo Express</b></p>
                        <p>Checked by :</p><span style={{ height: "1px", width: "150px", color: "black", border: "1px solid black", marginTop: "20px" }}></span>
                    </div>

                    <div className='page'>
                        <p>Signature With Stamp :</p><span style={{ height: "1px", width: "150px", color: "black", border: "1px solid black", marginTop: "20px" }}></span>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Manifest;