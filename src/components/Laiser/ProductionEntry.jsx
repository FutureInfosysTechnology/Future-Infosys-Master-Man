import React from "react";



function ProductionEntry() {
    return (
        <>
            <div className="body">
                <div className="order-container">
                    <header style={{ color: "black", fontSize: "18px", fontWeight: "600" }}>Credit Note</header>
                    <div className="production-header">
                        <div className="production-radio">
                            <div className="order-no">
                                <input type="radio" name="order" id="order" />
                                <label htmlFor="order">Order No</label>
                            </div>

                            <div className="order-no">
                                <input type="radio" name="order" id="order" />
                                <label htmlFor="">Supplier Order no</label>
                            </div>
                        </div>

                        <div className="production-search">
                            <input type="search" name="" id="" />
                            <button className="search-button">Search</button>
                        </div>
                    </div>

                    <form action="" className="order-form">
                        <header>Order Entry</header>
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
                                <label htmlFor="">Quantity</label>
                                <input type="number" placeholder="enter quantity" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Total Amount</label>
                                <input type="text" placeholder="enter total amount" />
                            </div>
                        </div>
                    </form>

                    <div className="production-header">
                        <div className="production-radio">
                            <div className="order-no">
                                <input type="radio" name="supplier" id="supplier" />
                                <label htmlFor="order">Order Details</label>
                            </div>

                            <div className="order-no">
                                <input type="radio" name="supplier" id="supplier" />
                                <label htmlFor="">After Exchange Rate</label>
                            </div>
                        </div>
                    </div>

                    <div className="gap" style={{ marginTop: "20px" }}></div>

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
                        <header style={{ color: "black" }}>Production Plan</header>
                        <span></span>
                        <div className="order-fields">

                            <div className="order-input">
                                <label htmlFor="">Batch No</label>
                                <input type="tel" placeholder="enter convert amount" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Inspection Required</label>
                                <select value="">
                                    <option disabled value="">select yes/no</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Production Ready Date</label>
                                <input type="date" placeholder="enter production ready date" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Dispatch Date</label>
                                <input type="date" placeholder="enter dispatch date" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Description</label>
                                <input type="text" placeholder="enter description" />
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Description</label>
                                <input type="text" placeholder="enter description" />
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

export default ProductionEntry;