import React from "react";
import './orderentry.css';



function PaymentEntry() {
    return (
        <>
            <div className="body">
                <div className="order-container">
                    <form action="" className="order-form">
                        <header style={{ color: "black", fontSize: "18px", fontWeight: "600" }}>Payment Statement</header>
                        <div className="order-fields">

                            <div className="order-input">
                                <label htmlFor="">Order No</label>
                                <input type="text" placeholder="enter order no" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Order Date</label>
                                <input type="date" placeholder="enter order date" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Supplier Name</label>
                                <select value="">
                                    <option disabled value="">select supplier name</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Supplier Order No</label>
                                <input type="text" placeholder="enter supplier order no" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Supplier Order Date</label>
                                <input type="date" placeholder="enter supplier order no" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Advance %</label>
                                <input type="text" placeholder="enter advance" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Balance %</label>
                                <input type="text" placeholder="enter balance" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Order Quantity</label>
                                <input type="text" placeholder="enter order quantity" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Order Amount</label>
                                <input type="tel" placeholder="enter order amount" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Description</label>
                                <input type="text" placeholder="enter description" />
                            </div>

                        </div>
                    </form>

                    <div className="order-table">
                        <table className="table table-hover table-bordered">
                            <thead className="table-head">
                                <tr>
                                    <th>SR No</th>
                                    <th>Product Name</th>
                                    <th>HSN Code</th>
                                    <th>Currency</th>
                                    <th>Rate</th>
                                    <th>Quantity</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="table-buttons">
                            <button className="submit-button">Add</button>
                            <button className="submit-button">Edit</button>
                            <button className="submit-button">Delete</button>

                        </div>
                    </div>

                    <form action="" className="order-form">
                        <header>Payment Entry</header>
                        <span></span>
                        <div className="order-fields">

                            <div className="order-input">
                                <label htmlFor="">After Convert Amount</label>
                                <input type="tel" placeholder="enter convert amount" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Transfer Amount</label>
                                <input type="tel" placeholder="enter transfer amount" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Balance Amount</label>
                                <input type="tel" placeholder="enter balance amount" />
                            </div>
                        </div>

                        <header>Payment Transfer Detail</header>
                        <span></span>

                        <div className="order-fields">

                            <div className="order-input">
                                <label htmlFor="">Currency</label>
                                <select value="">
                                    <option disabled value="">select currency</option>
                                    <option>Rupee</option>
                                    <option>Dollar</option>
                                    <option>Euro</option>
                                </select>
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Convert / Exchange Rate</label>
                                <select value="">
                                    <option disabled value="">select exchange rate</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Rate</label>
                                <input type="numtelber" placeholder="enter rate" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Payment Date</label>
                                <input type="date" placeholder="enter payment date" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Payment %</label>
                                <input type="tel" placeholder="enter payment %" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Amount</label>
                                <input type="tel" placeholder="enter amount" />
                            </div>

                            <header>Bank Detail</header>
                            <span></span>
                            <div className="order-fields">

                                <div className="order-input">
                                    <label htmlFor="">Bank Name</label>
                                    <select value="">
                                        <option disabled value="">select bank name</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                    </select>
                                </div>

                                <div className="order-input">
                                    <label htmlFor="">Swift Code</label>
                                    <input type="text" placeholder="enter swift code" />
                                </div>

                                <div className="order-input">
                                    <label htmlFor="">INR Exchange Rate</label>
                                    <input type="tel" placeholder="enter exchange rate" />
                                </div>

                                <div className="order-input">
                                    <label htmlFor="">Date</label>
                                    <input type="date" placeholder="enter date" />
                                </div>
                            </div>

                        </div>


                        <div className="form-buttons">
                            <button className="submit-button">Submit</button>
                            <button className="submit-button">Cancel</button>
                        </div>
                    </form>

                </div>
            </div>

        </>
    );
};

export default PaymentEntry;