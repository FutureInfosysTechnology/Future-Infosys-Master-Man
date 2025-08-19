import React from "react";



function ImportDrs() {

    return (
        <>

            <div className="container1">
                <form action="">
                    <div className="fields2">
                        <div className="input-field3">
                            <label htmlFor="">Date</label>
                            <input type="date" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Delivery Agent</label>
                            <input type="text" placeholder="Enter Delivery Agent" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Mobile No</label>
                            <input type="tel" maxLength="10" id="mobile"
                                name="mobile" pattern="[0-9]{10}" placeholder="Enter Mobile no" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Vehicle No</label>
                            <input type="text" placeholder="Enter Vehicle No" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Area</label>
                            <input type="text" placeholder="Enter Area" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Import</label>
                            <input style={{ paddingTop: "6px" }} type="file" placeholder="Select a file" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor=""></label>
                            <button style={{ marginTop: "18px" }} type="submit" className="generate-btn">Upload</button>
                        </div>

                        <div className="bottom-buttons" style={{ marginTop: "18px", marginLeft: "25px" }}>
                            <button className="ok-btn">Download</button>
                            <button className="ok-btn">Error</button>
                        </div>
                    </div>


                </form>
            </div>
        </>
    );
};

export default ImportDrs;