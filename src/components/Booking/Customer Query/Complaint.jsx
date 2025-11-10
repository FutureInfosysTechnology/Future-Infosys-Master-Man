import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function Complaint() {
    const [formData, setFormData] = useState(
        {
            docType: "",
            docNo: "",
            selection: "",
            status: "",
            date: new Date(),
            name: "",
            mob_No: "",
            email: "",
            comp: "",
            action: "",
        }
    )
    const handleForm = (value, key) => {
        setFormData({ ...formData, [key]: value });
    }
    console.log(formData);
    return (
        <>

            <div className="body">
                <div className="container1" style={{ padding: "0px" }}>

                    <form action="" style={{ marginBottom: "10px" }}>
                        <div className="fields2 row mx-0">
                            <div className="col-12 col-md-3">
                                <label htmlFor="" className='form-lable' style={{fontSize: "12px", fontWeight: 500,width:"100%",paddingLeft:"2px", color: "#2e2e2e"}}>Select Docket No</label>
                                <select value={formData.docType} className='form-control' onChange={(e) => handleForm(e.target.value, "docType")}>
                                    <option value="" disabled>Select Docket No</option>
                                    <option value="Docket No">Docket No</option>
                                    <option value="Vendor Docket No">Vendor Docket No</option>
                                </select>
                            </div>

                            <div className="col-12 col-md-3">
                                <label htmlFor="" className='form-lable' style={{fontSize: "12px", fontWeight: 500,width:"100%",paddingLeft:"2px", color: "#2e2e2e"}}>Docket No</label>
                                <div className="fields2">
                                    <input type="text" placeholder="Docket No" className='form-control' value={formData.docNo} onChange={(e) => handleForm(e.target.value, "docNo")} />
                                    <button type="submit" style={{ border: "transparent", background: "none", marginLeft: "-30px" }}>
                                        <i className="bi bi-search" style={{ fontSize: "18px", }}></i></button>
                                </div>
                            </div>

                            <div className="col-12 col-md-3">
                                <label htmlFor="" className='form-lable' style={{fontSize: "12px", fontWeight: 500,width:"100%",paddingLeft:"2px", color: "#2e2e2e"}}>Selection</label>
                                <select className='form-control' value={formData.selection} onChange={(e) => handleForm(e.target.value, "selection")}>
                                    <option value="" disabled> Select Selection</option>
                                    <option value=""></option>
                                </select>
                            </div>

                            <div className="col-12 col-md-3">
                                <label htmlFor="" className='form-lable' style={{fontSize: "12px", fontWeight: 500,width:"100%",paddingLeft:"2px", color: "#2e2e2e"}}>Status</label>
                                <select className='form-control' value={formData.status} onChange={(e) => handleForm(e.target.value, "status")}>
                                    <option value="" disabled> Select Status</option>
                                    <option value=""></option>
                                </select>
                            </div>

                            <div className="col-12 col-md-3">
                                <label htmlFor="" className='form-lable' style={{fontSize: "12px", fontWeight: 500,width:"100%",paddingLeft:"2px", color: "#2e2e2e"}}>Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.date}
                                    onChange={(date) => handleForm(date, "date")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                    style={{ width: "120px", marginLeft: "10px" }}
                                />
                            </div>

                            <div className="col-12 col-md-3">
                                <label htmlFor="" className='form-lable' style={{fontSize: "12px", fontWeight: 500,width:"100%",paddingLeft:"2px", color: "#2e2e2e"}}>Name</label>
                                <input type="text" placeholder='Name' className='form-control' value={formData.name} onChange={(e) => handleForm(e.target.value, "name")} />
                            </div>

                            <div className="col-12 col-md-3">
                                <label htmlFor="" className='form-lable' style={{fontSize: "12px", fontWeight: 500,width:"100%",paddingLeft:"2px", color: "#2e2e2e"}}>Mobile No</label>
                                <input type="tel" className='form-control' maxLength={10} placeholder='Mobile No' value={formData.mob_No} onChange={(e) => handleForm(e.target.value, "mob_No")} />
                            </div>

                            <div className="col-12 col-md-3">
                                <label htmlFor="" className='form-lable' style={{fontSize: "12px", fontWeight: 500,width:"100%",paddingLeft:"2px", color: "#2e2e2e"}}>Email ID</label>
                                <input type="email" className='form-control' placeholder='Email ID' value={formData.email} onChange={(e) => handleForm(e.target.value, "email")} />
                            </div>
                        </div>

                        <div className="row mx-0">
                            <div className="col-12 col-md-6">
                                <label htmlFor="" className='form-lable' style={{fontSize: "12px", fontWeight: 500,width:"100%",paddingLeft:"2px", color: "#2e2e2e"}}>Complaint</label>
                                <textarea type="text" className='form-control' placeholder='Enter Your Complaint Here...'
                                    value={formData.comp} onChange={(e) => handleForm(e.target.value, "comp")}
                                    rows={3} />
                            </div>

                            <div className="col-12 col-md-6">
                                <label htmlFor="" className='form-lable' style={{fontSize: "12px", fontWeight: 500,width:"100%",paddingLeft:"2px", color: "#2e2e2e"}}>Action</label>
                                <textarea type="text" className='form-control' placeholder='Action...'
                                    value={formData.action} onChange={(e) => handleForm(e.target.value, "action")}
                                    rows={3} />
                            </div>
                        </div>

                        <div className="bottom-buttons mt-4">
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