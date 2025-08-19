import React from "react";



function ExcelImport() {

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
                            <label htmlFor="">AWB No</label>
                            <input type="tel" placeholder="Enter Awb No" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Time</label>
                            <input type="time" placeholder="Enter Time" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">From</label>
                            <select value="">
                                <option value="" disabled>Select From Location</option>
                                <option value="">Mumbai</option>
                                <option value="">Navi Mumbai</option>
                                <option value="">Pune</option>
                            </select>
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">To</label>
                            <select value="">
                                <option value="" disabled>Select From Location</option>
                                <option value="">Mumbai</option>
                                <option value="">Navi Mumbai</option>
                                <option value="">Pune</option>
                            </select>
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Remark</label>
                            <input type="text" placeholder="Enter Remark" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">File</label>
                            <input style={{ paddingTop: "7px" }} type="file" placeholder="" />
                        </div>
                    </div>

                    <div className="bottom-buttons">
                        <button type="submit" className="ok-btn">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ExcelImport;