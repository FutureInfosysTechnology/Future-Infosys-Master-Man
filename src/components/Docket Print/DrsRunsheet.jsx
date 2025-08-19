import React, { useState, useEffect } from 'react';
import Header from '../../Components-2/Header/Header';
import Sidebar1 from '../../Components-2/Sidebar1';
import Footer from '../../Components-2/Footer';
import logoimg from '../../Assets/Images/AceLogo.jpeg'
import '../Tabs/tabs.css';
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';


function DrsRunsheet() {

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
                <div className="container-2" style={{ padding: "20px", width: "840px", border: "transparent" }}>
                    <div className="container" style={{ padding: "20px", border: "7px double black" }}>

                        <div className='row1' style={{ height: "140px", borderBottom: "1px solid black", width:"100%" }}>
                            <div style={{ width: "30%" }}>
                                <img src={logoimg} alt="" style={{ height: "130px", paddingBottom: "2px" }} />
                            </div>
                            <div style={{ width: "70%" }}>
                                <div style={{ textAlign: "center" }}>
                                    <p><b style={{ fontSize: "24px" }}>Aventure Cargo Express</b></p>
                                </div>
                                <div style={{ textAlign: "center", display:"flex", flexDirection:"column" }}>
                                    <span style={{ fontSize: "11px" }}><b>Office Address :</b>{BranchData.Branch_Add1}
                                    </span>
                                    <span style={{ fontSize: "10px", marginLeft: "5px" }}><b>Pin Code : {BranchData.Branch_PIN}</b></span>
                                    <span style={{ fontSize: "10px", marginLeft: "5px" }}><b>Mob : {BranchData.MobileNo}</b></span>
                                    <span style={{ fontSize: "10px", marginLeft: "5px" }}><b>Email : {BranchData.Email}</b></span>
                                    <span style={{ fontSize: "10px", marginLeft: "5px" }}><b>GST No : {BranchData.GSTNo}</b></span>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <p><b><u>DELIVERY RUNSHEET</u></b></p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", fontSize: "12px", width:"100%" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div>
                                    <label htmlFor=""><b>DELIVERY BOY NAME :</b></label>
                                    <input type="text" style={{ border: "transparent", paddingLeft: "5px" }} />
                                </div>

                                <div>
                                    <label htmlFor=""><b>DELIVERY BOY NO :</b></label>
                                    <input type="text" maxLength={10} style={{ border: "transparent", paddingLeft: "5px" }} />
                                </div>

                                <div>
                                    <label htmlFor=""><b>VEHICLE NO :</b></label>
                                    <input type="text" style={{ border: "transparent", paddingLeft: "5px" }} />
                                </div>

                                <div>
                                    <label htmlFor=""><b>VEHICLE IN :</b></label>
                                    <input type="text" style={{ border: "transparent", paddingLeft: "5px" }} />
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div>
                                    <label htmlFor=""><b>RUNSHEET NO :</b></label>
                                    <input type="text" style={{ border: "transparent", paddingLeft: "5px" }} />
                                </div>

                                <div>
                                    <label htmlFor=""><b>RUNSHEET DATE :</b></label>
                                    <input type="text" style={{ border: "transparent", paddingLeft: "5px" }} />
                                </div>

                                <div>
                                    <label htmlFor=""><b>AREA NAME :</b></label>
                                    <input type="text" style={{ border: "transparent", paddingLeft: "5px" }} />
                                </div>

                                <div>
                                    <label htmlFor=""><b>VEHICLE OUT :</b></label>
                                    <input type="text" style={{ border: "transparent", paddingLeft: "5px" }} />
                                </div>
                            </div>
                        </div>

                        <div className="table-container2">
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th className='bg-white'>Sr No</th>
                                        <th className='bg-white'>Booking Date</th>
                                        <th className='bg-white'>Docket No</th>
                                        <th className='bg-white'>Receiver</th>
                                        <th className='bg-white'>QTY</th>
                                        <th className='bg-white'>Origin</th>
                                        <th className='bg-white'>Destination</th>
                                        <th className='bg-white'>Receiver Signature / Stamp</th>
                                    </tr>
                                </thead>

                                <tbody className='table-body'>
                                    <tr>
                                        <td>1</td>
                                        <td>02/01/2024</td>
                                        <td>12345</td>
                                        <td>FUTURE INFOSYS</td>
                                        <td>2</td>
                                        <td>ANDHERI</td>
                                        <td>PUNE</td>
                                        <td></td>
                                    </tr>

                                    <tr>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>02/01/2024</td>
                                        <td className='bg-white'>12345</td>
                                        <td className='bg-white'>FUTURE INFOSYS</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>ANDHERI</td>
                                        <td className='bg-white'>PUNE</td>
                                        <td className='bg-white'></td>
                                    </tr>

                                    <tr>
                                        <td>3</td>
                                        <td>02/01/2024</td>
                                        <td>12345</td>
                                        <td>FUTURE INFOSYS</td>
                                        <td>2</td>
                                        <td>ANDHERI</td>
                                        <td>PUNE</td>
                                        <td></td>
                                    </tr>

                                    <tr>
                                        <td className='bg-white'>4</td>
                                        <td className='bg-white'>02/01/2024</td>
                                        <td className='bg-white'>12345</td>
                                        <td className='bg-white'>FUTURE INFOSYS</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>ANDHERI</td>
                                        <td className='bg-white'>PUNE</td>
                                        <td className='bg-white'></td>
                                    </tr>

                                    <tr>
                                        <td>5</td>
                                        <td>02/01/2024</td>
                                        <td>12345</td>
                                        <td>FUTURE INFOSYS</td>
                                        <td>2</td>
                                        <td>ANDHERI</td>
                                        <td>PUNE</td>
                                        <td></td>
                                    </tr>

                                    <tr>
                                        <td className='bg-white'>6</td>
                                        <td className='bg-white'>02/01/2024</td>
                                        <td className='bg-white'>12345</td>
                                        <td className='bg-white'>FUTURE INFOSYS</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>ANDHERI</td>
                                        <td className='bg-white'>PUNE</td>
                                        <td className='bg-white'></td>
                                    </tr>

                                    <tr>
                                        <td>7</td>
                                        <td>02/01/2024</td>
                                        <td>12345</td>
                                        <td>FUTURE INFOSYS</td>
                                        <td>2</td>
                                        <td>ANDHERI</td>
                                        <td>PUNE</td>
                                        <td></td>
                                    </tr>

                                    <tr>
                                        <td className='bg-white'>8</td>
                                        <td className='bg-white'>02/01/2024</td>
                                        <td className='bg-white'>12345</td>
                                        <td className='bg-white'>FUTURE INFOSYS</td>
                                        <td className='bg-white'>2</td>
                                        <td className='bg-white'>ANDHERI</td>
                                        <td className='bg-white'>PUNE</td>
                                        <td className='bg-white'></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", marginTop: "20px", width:"100%" }}>
                            <p>Received by :</p><span style={{ height: "1px", width: "150px", color: "black", border: "1px solid black", marginTop: "20px" }}></span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <p>Prepared by :</p><span style={{ height: "1px", width: "150px", color: "black", border: "1px solid black", marginTop: "20px" }}></span>
                                <p>Checked by :</p><span style={{ height: "1px", width: "150px", color: "black", border: "1px solid black", marginTop: "20px" }}></span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <p>Signature With Stamp :</p><span style={{ height: "1px", width: "150px", color: "black", border: "1px solid black", marginTop: "20px" }}></span>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default DrsRunsheet;