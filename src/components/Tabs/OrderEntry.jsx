import React from "react";
import '../Tabs/tabs.css';


function OrderEntry() {
    return (
        <>
            <div className="container1">

                <form action="#" className="tab-form">
                    <div className="form first">
                        <div className="details personal">
                            <span className="tittle">Personal Details <button className="generate-btn" onClick={generateRandomCode}>Generate-Order No</button></span>
                            <span></span>

                            <div className="fields">

                                <div className="input-field">
                                    <label htmlFor="">Order No </label>

                                    <input type="text" placeholder="enter your code/ generate code" value={code} onChange={handleInputChange} maxLength="6" required />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="">Order Date</label>
                                    <input type="date" placeholder="enter order date" required />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="">Supplier Name</label>
                                    <input type="text" placeholder="enter supplier name" required />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="">Supplier Order No</label>
                                    <input type="number" placeholder="enter supplier order no" required />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="">Supplier Order Date</label>
                                    <input type="date" placeholder="enter supplier order date" required />
                                </div>

                                <div className="input-field">
                                    <label htmlFor="">Company Name</label>
                                    <select required>
                                        <option disabled value="">Select company</option>
                                        <option>Future Infosys</option>
                                    </select>
                                </div>

                                <div className="input-field">
                                    <label htmlFor="">Order Location</label>
                                    <select required>
                                        <option disabled value="">Select order location</option>
                                        <option>Maharashtra</option>
                                    </select>
                                </div>


                            </div>
                        </div>

                        <div className="bottom-buttons">
                            <button className="ok-btn" onClick={handleClick}>Ok</button>
                            <button className="ok-btn" onClick={handleCancel}>Cancel</button>
                        </div>

                    </div>
                </form>
            </div>
        </>
    )
}

export default OrderEntry;