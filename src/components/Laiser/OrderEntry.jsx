import React, { useState } from "react";
import './orderentry.css';



function OrderEntry() {

    const [formData, setFormData] = useState({
        category: '',
        product: '',
        currency: '',
        rate: '',
        quantity: '',
        amount: '',
    });

    const [submittedData, setSubmittedData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedData((prev) => [...prev, formData]);
        // Reset the form after submission
        setFormData({
            category: '',
            product: '',
            currency: '',
            rate: '',
            quantity: '',
            amount: '',
        });
    };


    return (
        <>

            <div className="body">
                <div className="order-container">
                    <form action="" className="order-form">
                        <header style={{ color: "black", fontSize: "18px", fontWeight: "600" }}>Order Entry</header>
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
                                <select name="" id="">
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
                                <label htmlFor="">Company Name</label>
                                <select name="" id="">
                                    <option disabled value="">select company name</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                            </div>

                            <div className="order-input">
                                <label htmlFor="">Order Location</label>
                                <select name="" id="">
                                    <option disabled value="">select order location</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                            </div>

                        </div>
                    </form>

                    <div className="order-table">
                        <form action="" onSubmit={handleSubmit}>
                            <table className="table">
                                <thead className="table-head">
                                    <tr>
                                        <th>Category Name</th>
                                        <th>Product Name</th>
                                        <th>Currency</th>
                                        <th>Rate</th>
                                        <th>Quantity</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <select name="category" value={formData.category} onChange={handleChange} >
                                                <option value="" disabled>Select Category</option>
                                                <option value="Electronics">Electronics</option>
                                                <option value="Clothing">Clothing</option>
                                            </select>
                                        </td>

                                        <td>
                                            <select name="product" value={formData.product} onChange={handleChange}>
                                                <option value="" disabled>Select Product</option>
                                                <option value="Phone">Phone</option>
                                                <option value="Shirt">Shirt</option>
                                            </select>
                                        </td>

                                        <td>
                                            <select name="currency" value={formData.currency} onChange={handleChange}>
                                                <option value="" disabled>Select Currency</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </td>

                                        <td>
                                            <input type="tel" name="rate" value={formData.rate} onChange={handleChange} placeholder="Rate" />
                                        </td>
                                        <td>
                                            <input type="tel" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" />
                                        </td>
                                        <td>
                                            <input type="tel" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button type="submit" className="submit-button">Submit</button>
                        </form>
                    </div>

                    <div className="order-table">
                        <table className="table table-hover">
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
                                {submittedData.map((data, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.product}</td>
                                        <td>{data.category}</td>
                                        <td>{data.currency}</td>
                                        <td>{data.rate}</td>
                                        <td>{data.quantity}</td>
                                        <td>{data.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="table-buttons">
                            <button className="submit-button">Add</button>
                            <button className="submit-button">Edit</button>
                            <button className="submit-button">Delete</button>

                        </div>
                    </div>

                    <div className="order-table">
                        <table className="table table-hover">
                            <thead className="table-head">
                                <tr>
                                    <th>SR No</th>
                                    <th>Build Date</th>
                                    <th>Bill No</th>
                                    <th>Customer Name</th>
                                    <th>Bill Amount</th>
                                    <th>Received Amount</th>
                                    <th>TDS</th>
                                    <th>Bank Name</th>
                                    <th>Mode Of Payment</th>
                                    <th>Transaction No</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>29/01/2024</td>
                                    <td>SCA986</td>
                                    <td>Vivek Singh</td>
                                    <td>1000 Rs</td>
                                    <td>800 Rs</td>
                                    <td>200 Rs</td>
                                    <td>
                                        <select>
                                            <option disabled value="">Select</option>
                                            <option value="">State Bank Of India</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select>
                                            <option disabled value="">Select</option>
                                            <option value="">RTGS</option>
                                            <option value="">NEFT</option>
                                            <option value="">IMPS</option>
                                            <option value="">UPI</option>
                                        </select>
                                    </td>
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
                </div>
            </div>

        </>
    );
};

export default OrderEntry;