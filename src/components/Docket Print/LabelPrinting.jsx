import React, { useState } from "react";

const LabelPrinting = () => {
  const [formData, setFormData] = useState({
    autoType: "",
    bookDate: "",
    consigneeName: "",
    address1: "",
    address2: "",
    pincode: "",
    contactNo: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="booking-form-container">
      <h2>Booking Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="fields2">
          <div className="input-field3">
            <label>Auto Type</label>
            <input type="text" name="autoType" value={formData.autoType} onChange={handleChange} placeholder="Auto Type" />
          </div>

          <div className="input-field3">
            <label>Book Date</label>
            <input type="date" name="bookDate" value={formData.bookDate} onChange={handleChange} placeholder="Book Date" />
          </div>

          <div className="input-field3">
            <label>Consignee Name</label>
            <input type="text" name="consigneeName" value={formData.consigneeName} onChange={handleChange} placeholder="Consignee Name" />
          </div>

          <div className="input-field3">
            <label>Address Line 1</label>
            <input type="text" name="address1" value={formData.address1} onChange={handleChange} placeholder="Address" />
          </div>

          <div className="input-field3">
            <label>Address Line 2</label>
            <input type="text" name="address2" value={formData.address2} onChange={handleChange} placeholder="Address" />
          </div>

          <div className="input-field3">
            <label>Pin Code</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pin Code" />
          </div>

          <div className="input-field3">
            <label>Consignee Name</label>
            <input type="text" name="consigneeName" value={formData.consigneeName} onChange={handleChange} placeholder="Consignee Name" />
          </div>

          <div className="input-field3">
            <label>Address Line 1</label>
            <input type="text" name="address1" value={formData.address1} onChange={handleChange} placeholder="Address" />
          </div>

          <div className="input-field3">
            <label>Address Line 2</label>
            <input type="text" name="address2" value={formData.address2} onChange={handleChange} placeholder="Address" />
          </div>

          <div className="input-field3">
            <label>Pin Code</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pin Code" />
          </div>

          <div className="input-field3">
            <label>Mobile No</label>
            <input type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} placeholder="Mobile No" />
          </div>

          <div className="input-field3">
            <label>Email ID</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" />
          </div>
        </div>

        <div className="bottom-buttons">
          <button type="submit" className="ok-btn">Save</button>
        </div>
      </form>
    </div>
  );
};

export default LabelPrinting;
