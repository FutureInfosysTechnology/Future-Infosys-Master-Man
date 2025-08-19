import React, { useState, useEffect } from 'react';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import barcode from '../../Assets/Images/barcode-svgrepo-com.png';
import logo from '../../Assets/Images/AceLogo.jpeg';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';


function Docketpdf() {

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

    const BranchData = getBranch.length > 0 ? getBranch[0] : {};


    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="container">
                    <div className="container-2" style={{ borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "840px" }}>
                        <div className="container-2" style={{ borderRadius: "0px", width: "800px", display: "flex", flexDirection: "column" }}>
                            <div className="header-box" style={{ display: "flex", flexDirection: "row", height: "150px", border: "1px solid black" }}>
                                <div className="header-box1" style={{ width: "40%", border: "1px solid black" }}>
                                    <img src={logo} alt="" style={{ height: "100%", width: "100%" }} />
                                </div>

                                <div className="header-box2" style={{
                                    width: "30%", border: "1px solid black",
                                    display: "flex", flexDirection: "column", alignItems: "center",
                                    justifyContent: "center", padding: "5px"
                                }}>
                                    <b style={{ fontSize: "18px" }}>Aventure Cargo Express</b>
                                    <span style={{ fontSize: "11px" }}><b>Offiice Address :</b>{BranchData.Branch_Add1}
                                    </span>
                                    <span style={{ fontSize: "10px", marginLeft: "5px" }}><b>Pin Code : {BranchData.Branch_PIN}</b></span>
                                    <span style={{ fontSize: "10px" }}><b>Mob : {BranchData.MobileNo}</b></span>
                                    <span style={{ fontSize: "10px" }}><b>Email : {BranchData.Email}</b></span>
                                    <span style={{ fontSize: "10px" }}><b>GST No : {BranchData.GSTNo}</b></span>
                                </div>

                                <div className="header-box3" style={{
                                    width: "30%", border: "1px solid black",
                                    display: "flex", flexDirection: "column", alignItems: "center",
                                    padding: "5px"
                                }}>
                                    <b style={{ fontSize: "10px" }}>CONSIGNMENT NOTE NUMBER</b>
                                    <img src={barcode} alt="" style={{ height: "75%", width: "80%" }} />
                                    <b>1000000001</b>
                                </div>
                            </div>

                            <div style={{ height: "30px", border: "1px solid black", display: "flex" }}>
                                <b style={{ marginRight: "15%" }}>DATE OF BOOKING :</b>
                                <b>MODE OF TRANSPORTATION:
                                    AIR <input type="checkbox" style={{ marginRight: "10px" }} />
                                    SURFACE <input type="checkbox" style={{ marginRight: "10px" }} />
                                    TRAIN <input type="checkbox" /></b>
                            </div>

                            <div className="table-container2">
                                <table className='table table-bordered table-sm' style={{ marginTop: "0px", border: "1px solid black", marginBottom: "0px" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "transparent" }}>
                                            <th colSpan={3} style={{ textAlign: "start", backgroundColor: "white" }}>CONSIGNOR</th>
                                            <th colSpan={7} style={{ textAlign: "start", backgroundColor: "white" }}>CONSIGNEE</th>
                                        </tr>
                                        <tr style={{ borderTop: "transparent" }}>
                                            <th colSpan={3} style={{ height: "80px", backgroundColor: "white" }}></th>
                                            <th colSpan={7} style={{ height: "80px", backgroundColor: "white" }}></th>
                                        </tr>
                                        <tr>
                                            <th style={{ borderRight: "transparent", textAlign: "start", backgroundColor: "white" }}>Pin :</th>
                                            <th colSpan={2} style={{ borderLeft: "transparent", textAlign: "start", backgroundColor: "white" }}>Mob :</th>
                                            <th colSpan={5} style={{ borderRight: "transparent", textAlign: "start", backgroundColor: "white" }}>Pin :</th>
                                            <th colSpan={2} style={{ borderLeft: "transparent", textAlign: "start", backgroundColor: "white" }}>Mob :</th>
                                        </tr>
                                        <tr>
                                            <th colSpan={2} style={{ border: "1px solid black", textAlign: "start", backgroundColor: "white" }}>GST NO</th>
                                            <th style={{ border: "1px solid black", backgroundColor: "white" }}>GST NO</th>
                                            <th colSpan={5} style={{ backgroundColor: "white" }}></th>
                                            <th style={{ border: "1px solid black", backgroundColor: "white" }}>CHARGES</th>
                                            <th style={{ border: "1px solid black", backgroundColor: "white" }}>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}>DETAILS OF CARGO</td>
                                            <td style={{ backgroundColor: "white" }} colSpan={7}>DIMENSION OF CARGO</td>
                                            <td style={{ backgroundColor: "white" }}>FREIGHT</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}>ACTUAL WEIGHT</td>
                                            <td style={{ backgroundColor: "white" }}>CHARGEABLE WEIGHT</td>
                                            <td style={{ backgroundColor: "white" }}>BOXES</td>
                                            <td style={{ backgroundColor: "white" }}>L</td>
                                            <td style={{ backgroundColor: "white" }}>W</td>
                                            <td style={{ backgroundColor: "white" }}>H</td>
                                            <td style={{ backgroundColor: "white" }}>A. Wt</td>
                                            <td style={{ backgroundColor: "white" }}>V. Wt</td>
                                            <td style={{ backgroundColor: "white" }}>DOCKET</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>FSC</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}>INVOICE NO.:</td>
                                            <td style={{ backgroundColor: "white" }}>INVOICE E-WAY BILL NO.:</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>ODA</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>COD</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}>INVOICE VALUE</td>
                                            <td style={{ backgroundColor: "white" }}>E-WAY BILL VALID DT.</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>TOTAL</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>GST</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>NET PAYABLE</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }} rowSpan={2}>Signature</td>
                                            <td style={{ backgroundColor: "white" }} colSpan={7}>TOTAL BOXES</td>
                                            <td style={{ backgroundColor: "white" }} rowSpan={2} colSpan={2}>
                                                CREDIT <input type="checkbox" style={{ marginRight: "8px" }} />
                                                CASH <input type="checkbox" style={{ marginRight: "8px" }} />
                                                TO PAY <input type="checkbox" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }} colSpan={7}>REMARKS :</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: "flex", flexDirection: "row", height: "100px" }}>
                                <div style={{ width: "30%", border: "1px solid black", padding: "5px" }}>
                                    <p style={{ fontSize: "9px" }}><b>Read Terms & Conditions Printed Overleaf Carefully </b>
                                        Any Stationary Tax as Levels shall be borne by the consignor or consignee,
                                        <b>Aventure </b>
                                        reserves the lien on shipment till its dues are fully paid. If not covered by special
                                        risk surcharge, claim value on this docket shall in no circumstances exceed Rs. 2000/-
                                        (Rs. Two Thousand) for Parcel and Rs. 500/- (Rs. Five Hundred) For Documents or Packet
                                    </p>
                                </div>

                                <div style={{ width: "10%", border: "1px solid black", padding: "5px" }}>
                                    <p style={{ fontSize: "12px" }}>Consignee's Signature & Contact No.:</p>
                                    <p style={{ fontSize: "12px" }}>Date :</p>
                                </div>

                                <div style={{ width: "10%", border: "1px solid black", padding: "5px" }}></div>

                                <div style={{ width: "30%", border: "1px solid black", padding: "5px" }}>
                                    <p style={{ fontSize: "9px" }}>I/We hereby declare, agree to the terms & condition see of reverse
                                        of the consignors copy & declare that, content on this Docket are true & correct.
                                        <b>Aventure </b> shall not entertain any claim for articles such as Gold, Silver,
                                        Currency, Ferisible Goods, Narcodes items which are banned by Law shall not be
                                        Courtered/Transport.</p>
                                </div>

                                <div style={{ width: "20%", border: "1px solid black", padding: "5px", textAlign: "center" }}>
                                    <p>SHIPPER COPY</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container-2" style={{ borderRadius: "0px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", width: "840px" }}>
                        <div className="container-2" style={{ borderRadius: "0px", width: "800px", display: "flex", flexDirection: "column" }}>
                            <div className="header-box" style={{ display: "flex", flexDirection: "row", height: "150px", border: "1px solid black" }}>
                                <div className="header-box1" style={{ width: "40%", border: "1px solid black" }}>
                                    <img src={logo} alt="" style={{ height: "100%", width: "100%" }} />
                                </div>

                                <div className="header-box2" style={{
                                    width: "30%", border: "1px solid black",
                                    display: "flex", flexDirection: "column", alignItems: "center",
                                    justifyContent: "center", padding: "5px"
                                }}>
                                    <b style={{ fontSize: "18px" }}>Aventure Cargo Express</b>
                                    <span style={{ fontSize: "11px" }}><b>Offiice Address :</b>{BranchData.Branch_Add1}
                                    </span>
                                    <span style={{ fontSize: "10px", marginLeft: "5px" }}><b>Pin Code : {BranchData.Branch_PIN}</b></span>
                                    <span style={{ fontSize: "10px" }}><b>Mob : {BranchData.MobileNo}</b></span>
                                    <span style={{ fontSize: "10px" }}><b>Email : {BranchData.Email}</b></span>
                                    <span style={{ fontSize: "10px" }}><b>GST No : {BranchData.GSTNo}</b></span>
                                </div>

                                <div className="header-box3" style={{
                                    width: "30%", border: "1px solid black",
                                    display: "flex", flexDirection: "column", alignItems: "center",
                                    padding: "5px"
                                }}>
                                    <b style={{ fontSize: "10px" }}>CONSIGNMENT NOTE NUMBER</b>
                                    <img src={barcode} alt="" style={{ height: "75%", width: "80%" }} />
                                    <b>1000000001</b>
                                </div>
                            </div>

                            <div style={{ height: "30px", border: "1px solid black", display: "flex" }}>
                                <b style={{ marginRight: "15%" }}>DATE OF BOOKING :</b>
                                <b>MODE OF TRANSPORTATION:
                                    AIR <input type="checkbox" style={{ marginRight: "10px" }} />
                                    SURFACE <input type="checkbox" style={{ marginRight: "10px" }} />
                                    TRAIN <input type="checkbox" /></b>
                            </div>

                            <div className="table-container2">
                                <table className='table table-bordered table-sm' style={{ marginTop: "0px", border: "1px solid black", marginBottom: "0px" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "transparent" }}>
                                            <th colSpan={3} style={{ textAlign: "start", backgroundColor: "white" }}>CONSIGNOR</th>
                                            <th colSpan={7} style={{ textAlign: "start", backgroundColor: "white" }}>CONSIGNEE</th>
                                        </tr>
                                        <tr style={{ borderTop: "transparent" }}>
                                            <th colSpan={3} style={{ height: "80px", backgroundColor: "white" }}></th>
                                            <th colSpan={7} style={{ height: "80px", backgroundColor: "white" }}></th>
                                        </tr>
                                        <tr>
                                            <th style={{ borderRight: "transparent", textAlign: "start", backgroundColor: "white" }}>Pin :</th>
                                            <th colSpan={2} style={{ borderLeft: "transparent", textAlign: "start", backgroundColor: "white" }}>Mob :</th>
                                            <th colSpan={5} style={{ borderRight: "transparent", textAlign: "start", backgroundColor: "white" }}>Pin :</th>
                                            <th colSpan={2} style={{ borderLeft: "transparent", textAlign: "start", backgroundColor: "white" }}>Mob :</th>
                                        </tr>
                                        <tr>
                                            <th colSpan={2} style={{ border: "1px solid black", textAlign: "start", backgroundColor: "white" }}>GST NO</th>
                                            <th style={{ border: "1px solid black", backgroundColor: "white" }}>GST NO</th>
                                            <th colSpan={5} style={{ backgroundColor: "white" }}></th>
                                            <th style={{ border: "1px solid black", backgroundColor: "white" }}>CHARGES</th>
                                            <th style={{ border: "1px solid black", backgroundColor: "white" }}>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}>DETAILS OF CARGO</td>
                                            <td style={{ backgroundColor: "white" }} colSpan={7}>DIMENSION OF CARGO</td>
                                            <td style={{ backgroundColor: "white" }}>FREIGHT</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}>ACTUAL WEIGHT</td>
                                            <td style={{ backgroundColor: "white" }}>CHARGEABLE WEIGHT</td>
                                            <td style={{ backgroundColor: "white" }}>BOXES</td>
                                            <td style={{ backgroundColor: "white" }}>L</td>
                                            <td style={{ backgroundColor: "white" }}>W</td>
                                            <td style={{ backgroundColor: "white" }}>H</td>
                                            <td style={{ backgroundColor: "white" }}>A. Wt</td>
                                            <td style={{ backgroundColor: "white" }}>V. Wt</td>
                                            <td style={{ backgroundColor: "white" }}>DOCKET</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>FSC</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}>INVOICE NO.:</td>
                                            <td style={{ backgroundColor: "white" }}>INVOICE E-WAY BILL NO.:</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>ODA</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>COD</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}>INVOICE VALUE</td>
                                            <td style={{ backgroundColor: "white" }}>E-WAY BILL VALID DT.</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>TOTAL</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>GST</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                            <td style={{ backgroundColor: "white" }}>NET PAYABLE</td>
                                            <td style={{ backgroundColor: "white" }}></td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }} rowSpan={2}>Signature</td>
                                            <td style={{ backgroundColor: "white" }} colSpan={7}>TOTAL BOXES</td>
                                            <td style={{ backgroundColor: "white" }} rowSpan={2} colSpan={2}>
                                                CREDIT <input type="checkbox" style={{ marginRight: "8px" }} />
                                                CASH <input type="checkbox" style={{ marginRight: "8px" }} />
                                                TO PAY <input type="checkbox" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: "white" }} colSpan={7}>REMARKS :</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: "flex", flexDirection: "row", height: "100px" }}>
                                <div style={{ width: "30%", border: "1px solid black", padding: "5px" }}>
                                    <p style={{ fontSize: "9px" }}><b>Read Terms & Conditions Printed Overleaf Carefully </b>
                                        Any Stationary Tax as Levels shall be borne by the consignor or consignee,
                                        <b>Aventure </b>
                                        reserves the lien on shipment till its dues are fully paid. If not covered by special
                                        risk surcharge, claim value on this docket shall in no circumstances exceed Rs. 2000/-
                                        (Rs. Two Thousand) for Parcel and Rs. 500/- (Rs. Five Hundred) For Documents or Packet
                                    </p>
                                </div>

                                <div style={{ width: "10%", border: "1px solid black", padding: "5px" }}>
                                    <p style={{ fontSize: "12px" }}>Consignee's Signature & Contact No.:</p>
                                    <p style={{ fontSize: "12px" }}>Date :</p>
                                </div>

                                <div style={{ width: "10%", border: "1px solid black", padding: "5px" }}></div>

                                <div style={{ width: "30%", border: "1px solid black", padding: "5px" }}>
                                    <p style={{ fontSize: "9px" }}>I/We hereby declare, agree to the terms & condition see of reverse
                                        of the consignors copy & declare that, content on this Docket are true & correct.
                                        <b>Aventure </b> shall not entertain any claim for articles such as Gold, Silver,
                                        Currency, Ferisible Goods, Narcodes items which are banned by Law shall not be
                                        Courtered/Transport.</p>
                                </div>

                                <div style={{ width: "20%", border: "1px solid black", padding: "5px", textAlign: "center" }}>
                                    <p>SHIPPER COPY</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Docketpdf;