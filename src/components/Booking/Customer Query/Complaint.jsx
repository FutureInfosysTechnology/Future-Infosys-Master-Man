import React from 'react'

function Complaint() {
    return (
        <>

            <div className="body">
                <div className="container1" style={{padding:"0px"}}>

                    <form action="" style={{ marginBottom: "10px" }}>
                        <div className="fields2">
                            <div className="input-field3">
                                <label htmlFor="">Select Docket No</label>
                                <select value="">
                                    <option value="" disabled>Select Docket No</option>
                                    <option value="">Docket No</option>
                                    <option value="">Vendor Docket No</option>
                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Docket No</label>
                                <div className="fields2">
                                    <input type="text" placeholder="Docket No" />
                                    <button type="submit" style={{ border: "transparent", background: "none", marginLeft: "-30px" }}>
                                        <i className="bi bi-search" style={{ fontSize: "18px", }}></i></button>
                                </div>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Selection</label>
                                <select value="">
                                    <option value="" disabled> Select Selection</option>
                                    <option value=""></option>
                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Status</label>
                                <select value="">
                                    <option value="" disabled> Select Status</option>
                                    <option value=""></option>
                                </select>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Date</label>
                                <input type="date"/>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Name</label>
                                <input type="text" placeholder='Name' />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Mobile No</label>
                                <input type="tel" maxLength={10} placeholder='Mobile No'/>
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Email ID</label>
                                <input type="email" placeholder='Email ID' />
                            </div>
                        </div>

                        <div className="fields2">
                            <div className="input-field3" style={{ width: "100%" }}>
                                <label htmlFor="">Complaint</label>
                                <input type="text" placeholder='Enter Your Complaint Here' style={{ width: "100%" }} />
                            </div>

                            <div className="input-field3" style={{ width: "100%" }}>
                                <label htmlFor="">Action</label>
                                <input type="text" placeholder='Action' style={{ width: "100%" }} />
                            </div>
                        </div>

                        <div className="bottom-buttons">
                            <button className='ok-btn'>Submit</button>
                            <button className='ok-btn'>Cancel</button>
                        </div>
                    </form>

                </div>
            </div>

        </>
    )
}

export default Complaint;