import React, { useState, useEffect } from 'react';
import Footer from '../../Components-2/Footer';
import Sidebar1 from '../../Components-2/Sidebar1';
import Header from '../../Components-2/Header/Header';
import logoimg from '../../Assets/Images/AceLogo.jpeg';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';


function SecondInvoice() {

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
                <div className="container" style={{ padding: "30px" }}>
                    <div className="container" style={{ border: "1px solid black", padding: "0px", width: "879px" }}>

                        <div style={{ height: "130px", display: "flex", flexDirection: "row", borderBottom: "1px solid black" }}>
                            <div style={{ width: "70%", display: "flex", flexDirection: "row", border: "1px solid black" }}>
                                <div style={{ marginRight: "9%" }}>
                                    <img src={logoimg} alt="" style={{ height: "130px", paddingBottom: "2px" }} />
                                </div>
                                <div style={{ textAlign: "center", display: "flex", flexDirection: "column" }}>
                                    <p><b style={{ fontSize: "24px" }}>Aventure Cargo Express</b></p>
                                    <span style={{ fontSize: "10px" }}><b>Email : {BranchData.Email}</b></span>
                                    <span style={{ fontSize: "10px", marginLeft: "10px" }}><b>GST No : {BranchData.GSTNo}</b></span>
                                </div>
                            </div>
                            <div style={{ width: "30%", border: "1px solid black" }}>
                                <div style={{ textAlign: "center", display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontSize: "13px", marginTop: "5px" }}><b>Office Address :</b>{BranchData.Branch_Add1}</span>
                                    <span style={{ fontSize: "13px", marginTop: "5px" }}><b>Pin Code :</b>{BranchData.Branch_PIN}</span>
                                    <span style={{ fontSize: "13px", color: "blue", marginTop: "5px" }}><b>Mob : {BranchData.MobileNo}</b></span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", height: "150px" }}>
                            <div style={{ display: "flex", flexDirection: "column", width: "65%", border: "1px solid black" }}>
                                <p style={{ margin: "0px" }}><b style={{ fontSize: "10px" }}>To,</b></p>
                                <p style={{ margin: "0px", marginLeft: "15px" }}><b style={{ fontSize: "12px" }}>CONVENTUS TECHNOLOGIES PVT LTD.</b></p>
                                <p style={{ margin: "0px", marginLeft: "15px", fontSize: "12px" }}>UNIT 812 , NEELKANTH CORPORATE PARK,</p>
                                <p style={{ margin: "0px", marginLeft: "15px", fontSize: "12px" }}>KIROL ROAD , VIDYAVIHAR WEST</p>
                                <p style={{ margin: "0px", marginLeft: "15px", fontSize: "12px" }}>400086</p>
                                <p style={{ margin: "0px", marginLeft: "15px", fontSize: "12px" }}>25103379    9594996804</p>
                                <p style={{ margin: "0px", marginLeft: "15px" }}><b style={{ fontSize: "12px" }}>GSTIN .:27AADCC8181E1ZN</b></p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", width: "35%" }}>
                                <div style={{ display: "flex", flexDirection: "row", height: "20%" }}>
                                    <div style={{ width: "40%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <label htmlFor=""><b>Invoice No.</b></label>
                                    </div>

                                    <div style={{ width: "60%", border: "1px solid black", paddingLeft: "5px" }}>

                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", height: "20%" }}>
                                    <div style={{ width: "40%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <label htmlFor=""><b>From Date</b></label>
                                    </div>

                                    <div style={{ width: "60%", border: "1px solid black", paddingLeft: "5px" }}>

                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", height: "20%" }}>
                                    <div style={{ width: "40%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <label htmlFor=""><b>To Date</b></label>
                                    </div>

                                    <div style={{ width: "60%", border: "1px solid black", paddingLeft: "5px" }}>

                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", height: "20%" }}>
                                    <div style={{ width: "40%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <label htmlFor=""><b>Invoice Date</b></label>
                                    </div>

                                    <div style={{ width: "60%", border: "1px solid black", paddingLeft: "5px" }}>

                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", height: "20%", border: "1px solid black", paddingLeft: "5px" }}>
                                    <label htmlFor=""><b>Email.:</b></label>
                                    <input type="text" style={{ border: "transparent" }} />
                                </div>
                            </div>
                        </div>

                        <div className="table-container2">
                            <table className='table table-bordered m-0'>
                                <thead>
                                    <tr>
                                        <th className='bg-white'>Sr No</th>
                                        <th className='bg-white'>Date</th>
                                        <th className='bg-white'>Docket No</th>
                                        <th className='bg-white'>Destination</th>
                                        <th className='bg-white'>Boxes</th>
                                        <th className='bg-white'>QTY</th>
                                        <th className='bg-white'>Freight</th>
                                        <th className='bg-white'>Fuel</th>
                                        <th className='bg-white'>Delivery</th>
                                        <th className='bg-white'>Handle</th>
                                        <th className='bg-white'>Green</th>
                                        <th className='bg-white'>Docket</th>
                                        <th className='bg-white'>Others</th>
                                        <th className='bg-white'>Amount</th>
                                    </tr>
                                </thead>

                                <tbody className='table-body'>
                                    <tr>
                                        <td>1</td>
                                        <td>02/01/2024</td>
                                        <td>12345</td>
                                        <td>ANDHERI</td>
                                        <td>2</td>
                                        <td>10</td>
                                        <td>2</td>
                                        <td>1</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>SFC</td>
                                        <td>BD</td>
                                        <td>0</td>
                                        <td>500</td>
                                    </tr>

                                    <tr>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>02/01/2024</td>
                                        <td className='bg-white'>12345</td>
                                        <td className='bg-white'>ANDHERI</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>10</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>1</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>SFC</td>
                                        <td className='bg-white'>BD</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>500</td>
                                    </tr>

                                    <tr>
                                        <td>3</td>
                                        <td>02/01/2024</td>
                                        <td>12345</td>
                                        <td>ANDHERI</td>
                                        <td>2</td>
                                        <td>10</td>
                                        <td>2</td>
                                        <td>1</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>SFC</td>
                                        <td>BD</td>
                                        <td>0</td>
                                        <td>500</td>
                                    </tr>

                                    <tr>
                                        <td className='bg-white'>4</td>
                                        <td className='bg-white'>02/01/2024</td>
                                        <td className='bg-white'>12345</td>
                                        <td className='bg-white'>ANDHERI</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>10</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>1</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>SFC</td>
                                        <td className='bg-white'>BD</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>500</td>
                                    </tr>

                                    <tr>
                                        <td>5</td>
                                        <td>02/01/2024</td>
                                        <td>12345</td>
                                        <td>ANDHERI</td>
                                        <td>2</td>
                                        <td>10</td>
                                        <td>2</td>
                                        <td>1</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>SFC</td>
                                        <td>BD</td>
                                        <td>0</td>
                                        <td>500</td>
                                    </tr>

                                    <tr>
                                        <td className='bg-white'>6</td>
                                        <td className='bg-white'>02/01/2024</td>
                                        <td className='bg-white'>12345</td>
                                        <td className='bg-white'>ANDHERI</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>10</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>1</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>SFC</td>
                                        <td className='bg-white'>BD</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>500</td>
                                    </tr>

                                    <tr>
                                        <td>7</td>
                                        <td>02/01/2024</td>
                                        <td>12345</td>
                                        <td>ANDHERI</td>
                                        <td>2</td>
                                        <td>10</td>
                                        <td>2</td>
                                        <td>1</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>SFC</td>
                                        <td>BD</td>
                                        <td>0</td>
                                        <td>500</td>
                                    </tr>

                                    <tr>
                                        <td className='bg-white'>8</td>
                                        <td className='bg-white'>02/01/2024</td>
                                        <td className='bg-white'>12345</td>
                                        <td className='bg-white'>ANDHERI</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>10</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>1</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>SFC</td>
                                        <td className='bg-white'>BD</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>500</td>
                                    </tr>

                                    <tr>
                                        <td>9</td>
                                        <td>02/01/2024</td>
                                        <td>12345</td>
                                        <td>ANDHERI</td>
                                        <td>2</td>
                                        <td>10</td>
                                        <td>2</td>
                                        <td>1</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>SFC</td>
                                        <td>BD</td>
                                        <td>0</td>
                                        <td>500</td>
                                    </tr>

                                    <tr>
                                        <td className='bg-white'>10</td>
                                        <td className='bg-white'>02/01/2024</td>
                                        <td className='bg-white'>12345</td>
                                        <td className='bg-white'>ANDHERI</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>10</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>1</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>SFC</td>
                                        <td className='bg-white'>BD</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>500</td>
                                    </tr>

                                    <tr>
                                        <td>11</td>
                                        <td>02/01/2024</td>
                                        <td>12345</td>
                                        <td>ANDHERI</td>
                                        <td>2</td>
                                        <td>10</td>
                                        <td>2</td>
                                        <td>1</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>SFC</td>
                                        <td>BD</td>
                                        <td>0</td>
                                        <td>500</td>
                                    </tr>

                                    <tr>
                                        <td className='bg-white'>12</td>
                                        <td className='bg-white'>02/01/2024</td>
                                        <td className='bg-white'>12345</td>
                                        <td className='bg-white'>ANDHERI</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>10</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>1</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>SFC</td>
                                        <td className='bg-white'>BD</td>
                                        <td className='bg-white'>0</td>
                                        <td className='bg-white'>500</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", height: "150px" }}>
                            <div style={{ display: "flex", flexDirection: "column", width: "65%", border: "1px solid black", paddingTop: "10%" }}>

                            </div>

                            <div style={{ display: "flex", flexDirection: "column", width: "35%" }}>
                                <div style={{ display: "flex", flexDirection: "row", height: "20%" }}>
                                    <div style={{ width: "60%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <label htmlFor=""><b>TOTAL</b></label>
                                    </div>

                                    <div style={{ width: "40%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <input type="text" style={{ border: "transparent", width: "100%" }} />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", height: "20%" }}>
                                    <div style={{ width: "60%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <label htmlFor=""><b>IGST @ of 18.00%</b></label>
                                    </div>

                                    <div style={{ width: "40%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <input type="text" style={{ border: "transparent", width: "100%" }} />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", height: "20%" }}>
                                    <div style={{ width: "60%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <label htmlFor=""><b>SGST @ of 9.00%</b></label>
                                    </div>

                                    <div style={{ width: "40%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <input type="text" style={{ border: "transparent", width: "100%" }} />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", height: "20%" }}>
                                    <div style={{ width: "60%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <label htmlFor=""><b>CGST @ of 9.00%</b></label>
                                    </div>

                                    <div style={{ width: "40%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <input type="text" style={{ border: "transparent", width: "100%" }} />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", height: "20%" }}>
                                    <div style={{ width: "60%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <label htmlFor=""><b>BILL AMOUNT</b></label>
                                    </div>

                                    <div style={{ width: "40%", border: "1px solid black", paddingLeft: "5px" }}>
                                        <input type="text" style={{ border: "transparent", width: "100%" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: "30px", paddingLeft: "10px", border: "1px solid black" }}>
                            <p><b>AMOUNT IN WORD-</b> <b>TWO LAKHS TWENTY-TWO THOUSAND SEVEN HUNDRED THIRTY-SIX ONLY</b></p>
                        </div>

                        <div style={{ height: "240px", border: "1px solid black", paddingLeft: "10px" }}>
                            <p style={{ margin: "0px", fontSize: "12px" }}>1. Cheque should be issued in the Favour of "Renu Supplychain"</p>
                            <p style={{ margin: "0px", fontSize: "12px" }}>2. Any delay to pay the Invoice within two weekswill atract 2% Interest per month.</p>
                            <p style={{ margin: "0px", fontSize: "12px" }}>3. GSTIN No :27BDPPP3527C1ZG</p>
                            <p style={{ margin: "0px", fontSize: "12px" }}>4. Pan No. :BDPPP3527C</p>
                            <p style={{ margin: "0px", fontSize: "12px" }}>5. Bank Details:</p>
                            <p style={{ margin: "0px", fontSize: "12px" }}>Company Name: Renu Supplychain Bank Name : Andhra Bank Account No. 270511100003624</p>
                            <p style={{ margin: "0px", fontSize: "12px" }}>IFSC Code : ANDB0002705</p>
                            <p style={{ margin: "0px", fontSize: "12px" }}>Branch : Vasai East -401208</p>
                            <p style={{ margin: "0px", fontSize: "12px", marginTop: "15px" }}><b> Authorised Sign & Stamp</b> <span style={{ marginLeft: "65%" }}><b>Receiver Sign & Stamp </b></span> </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default SecondInvoice;