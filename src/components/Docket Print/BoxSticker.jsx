import React from 'react'
import Footer from '../../Components-2/Footer';
import Sidebar1 from '../../Components-2/Sidebar1';
import Header from '../../Components-2/Header/Header';
import barcode from '../../Assets/Images/barcode-svgrepo-com.png';

function BoxSticker() {
  return (
    <>
      <Header />
      <Sidebar1 />
      <div className="main-body" id="main-body">
        <div className="container">
          <div className="container" style={{ padding: "0px", margin:"10px" }}>
            <div style={{ height: "200px", width: "450px", border: "1px solid black", display: "flex", flexDirection: "row" }}>
              <div style={{ display: "flex", flexDirection: "column", paddingLeft: "10px", paddingTop: "5px", width: "50%" }}>
                <b>UK EXPRESS</b>
                <b style={{ fontSize: "14px", marginTop: "10px", marginBottom: "10px" }}>SHIPPER / SENDER</b>
                <b style={{ fontSize: "12px" }}>SURESH KUMAR</b>
                <p style={{ margin: "0px", fontSize: "12px" }}>171 RAMJI FADIYU</p>
                <p style={{ margin: "0px", fontSize: "12px" }}>VASANAPURA</p>
                <p style={{ margin: "0px", fontSize: "12px" }}>VADODARA, GUJARAT, 391770</p>
                <b style={{ fontSize: "12px" }}>INDIA</b>
              </div>

              <div style={{ display: "flex", flexDirection: "column", paddingRight: "10px", paddingTop: "5px", width: "50%", alignItems: "end" }}>
                <b style={{ fontSize: "14px" }}>MUMBAI</b>
                <label htmlFor="" style={{ fontSize: "12px" }}>SHIP DATE : <b>11-01-2025</b></label>
                <label htmlFor="" style={{ fontSize: "12px", marginBottom: "15px" }}>TOTAL WEIGHT : <b>12,900 KG</b></label>

                <p style={{ margin: "0px", fontSize: "12px", backgroundColor: "black", color: "white", width: "28px" }}>WPX</p>
                <b style={{ fontSize: "22px", marginTop: "10px" }}>1/1</b>
              </div>
            </div>

            <div style={{ height: "90px", border: "1px solid black", width: "450px", alignItems: "center", display: "flex", flexDirection: "column" }}>
              <img src={barcode} alt="" style={{ height: "60px", width: "200px" }} />
              <b>729834</b>
            </div>

            <div style={{ height: "220px", width: "450px", border: "1px solid black", display: "flex", flexDirection: "column", fontSize: "15px", paddingLeft: "10px", paddingTop: "10px" }}>
              <b style={{ fontSize: "14px" }}>RECEIVER</b>
              <b>RAMESH KUMAR</b>
              <b>480 A - KATHERING ROAD</b>
              <b>LONDON</b>
              <b>UK</b>
              <b>E78DP</b>
              <b>UNITED KINGDOM</b>
              <b>PH : 447448497197</b>
            </div>

            <div style={{ height: "110px", border: "1px solid black", width: "450px", alignItems: "center", display: "flex", flexDirection: "column" }}>
              <img src={barcode} alt="" style={{ height: "60px", width: "200px" }} />
              <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", paddingLeft: "10px", paddingRight: "10px" }}>
                <label htmlFor="" style={{ textAlign: "start" }}>SHIPPER REF</label>
                <label htmlFor="">BILL TO SENDER</label>
              </div>
              <div style={{ textAlign: "end", width: "100%", paddingRight: "10px" }}>
                <b>SUB</b>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default BoxSticker;