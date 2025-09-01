import React, { useState, useEffect } from 'react';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import barcode from '../../Assets/Images/barcode-svgrepo-com.png';
import logo from '../../Assets/Images/AceLogo.jpeg';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
import { useLocation } from 'react-router-dom';


function MobileReceipt() {

    const [getBranch, setGetBranch] = useState([]);
    const [loading, setLoading] = useState(true);
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
    const cellsStyle = {
        borderStyle: "solid", borderWidth: "2px 0 2px 2px", borderColor: "black",
        textAlign: "start",
        whiteSpace: "nowrap",
        fontSize: "10px",
        paddingLeft: "2px"
    }
    const tableStyle = {
        borderCollapse: "collapse"
    }
    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="container">
                    <div className="container-2" style={{ borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "840px" }}>
                        <div className="container-2" style={{ borderRadius: "0px", width: "800px", display: "flex", flexDirection: "column" }}>
                            <div className='div1' style={{ width: "100%", height: "90px", border: "2px solid black", display: "flex" }}>
                                <div className='logo' style={{ width: "24%", height: "100%" }}></div>
                                <div className='heading' style={{ width: "38%", height: "100%", display: "flex", flexDirection: "column", gap: "0px", alignItems: "start", marginTop: "5px" }}>
                                    <div style={{ fontSize: "14px", fontWeight: "bolder" }}>KANDOLIYA EXPRESS LOGISTICS</div>
                                    <div style={{ fontSize: "14px", fontWeight: "bolder" }}>PRIVATE LIMETED</div>
                                    <div style={{ lineHeight: "1", fontSize: "10px" }}>weoiyytoiywytiotoiyutoiyt
                                        dsfsdgweoihoihgiogehioghoighahoihugiuguigwieghigehgewaihg weiuywtewetyitewyieyweiyteitweotwieuoewtiteyite</div>
                                </div>
                                <div className='booking' style={{ width: "38%", height: "100%", display: "flex", flexDirection: "column" }}>
                                    <div style={{ paddingLeft: "5px", fontWeight: "bold", fontSize: "12px" }}>GST No: 256sdswegjjoghg</div>
                                    <table style={tableStyle}>
                                        <tbody >
                                            <tr>
                                                <td style={cellsStyle}>Booking Date:</td>
                                                <td style={cellsStyle}>22/08/2025</td>
                                            </tr>
                                            <tr>
                                                <td style={cellsStyle}>Booking Branch:</td>
                                                <td style={cellsStyle}>Mumbai</td>
                                            </tr>
                                            <tr>
                                                <td style={cellsStyle}>Booking Mode:</td>
                                                <td style={cellsStyle}>
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                                                        <label htmlFor="" style={{ display: "flex", alignItems: "center" }}><input type="checkbox" /><span>RAIL</span></label>
                                                        <label htmlFor="" style={{ display: "flex", alignItems: "center" }}><input type="checkbox" /><span>AIR</span></label>
                                                        <label htmlFor="" style={{ display: "flex", alignItems: "center" }}><input type="checkbox" /><span>MULTIMODEL</span></label>
                                                        <label htmlFor="" style={{ display: "flex", alignItems: "center" }}><input type="checkbox" /><span>FTL</span></label></div></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='div2' style={{ width: "100%", fontSize: "10px", height: "20px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                <div style={{ width: "30%", fontWeight: "bold", borderRight: "2px solid black", paddingLeft: "5px", paddingTop: "2px" }}>CONSIGNOR :</div>
                                <div style={{ width: "30%", fontWeight: "bold", borderRight: "2px solid black", paddingLeft: "5px", paddingTop: "2px" }}>CONSIGNEE:</div>
                                <div style={{ width: "40%", display: "flex", textAlign: "center" }}>
                                    <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>ORIGIN</div>
                                    <div style={{ width: "25%", borderRight: "2px solid black", paddingTop: "2px" }}>MUMBAI</div>
                                    <div style={{ width: "25%", fontWeight: "bold", borderRight: "2px solid black", paddingTop: "2px" }}>DESTINATION</div>
                                    <div style={{ width: "25%", paddingTop: "2px" }}>DELHI</div>
                                </div>
                            </div>
                            <div className='div3' style={{ width: "100%", fontSize: "10px", height: "130px", borderStyle: "solid", borderWidth: "0 2px 2px 2px", borderColor: "black", display: "flex" }}>
                                <div className='consignor px-2' style={{ width: "30%", borderRight: "2px solid black", display: "flex", flexDirection: "column", gap: "10px", paddingTop: "2px" }}>
                                    <div style={{ fontWeight: "bold" }}>PCI ANALYTICS PVT.LTD</div>
                                    <div style={{ height: "45px" }}> A-71 , ROAD NO. 22 WAGLE INDUSTRIAL
                                        ESTATEOPP. LODHA GRANDEZZANEAR SPRAYTECH</div>
                                    <div style={{ display: "flex", gap: "2px" }}><div style={{ fontWeight: "bold" }}>PiN CODE : </div><span>400604</span></div>
                                    <div style={{ display: "flex", gap: "2px" }}><div style={{ fontWeight: "bold" }}>GST NO : </div><span> 27AAECP1826E1ZN</span></div>
                                </div>
                                <div className='consignee px-2' style={{ width: "30%", borderRight: "2px solid black", display: "flex", flexDirection: "column", gap: "10px", paddingTop: "2px" }}>
                                    <div style={{ fontWeight: "bold" }}> MR. RAGHUVENDRA</div>
                                    <div style={{ height: "45px" }}>  AGILENT TECHNOLOGIES INTERNATIONAL
                                        PVT LTDPLOT NO. CP 11 , SECTOR- 8 , IMT
                                        MANESAR ,</div>
                                    <div style={{ display: "flex", gap: "2px" }}><div style={{ fontWeight: "bold" }}>PiN CODE : </div><span> 122051</span></div>
                                    <div style={{ display: "flex", gap: "2px" }}><div style={{ fontWeight: "bold" }}>GST NO : </div><span> 27AbBCD1826E1TV</span></div>
                                </div>
                                <div className='docket px-2' style={{ width: "40%", display: "flex", flexDirection: "column",gap:"3px", paddingTop: "2px" }}>
                                    <div style={{ fontWeight: "bold", height: "10%" }}>  DOCKET No : </div>
                                    <div style={{ display: "flex", flexDirection: "column", height: "90%" }}>
                                        <div style={{ display: "flex",height:"100%" ,flexDirection: "column", alignItems:"center",gap:"0px"}}>
                                            <img src={barcode} alt="barcode" style={{ height: "70%", width: "150px"}} />
                                            <b style={{fontSize:"20px"}}>1000000001</b> </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileReceipt;