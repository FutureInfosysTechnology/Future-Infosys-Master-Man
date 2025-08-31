import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom"
const DocketPrint4 = () => {
    const [formData, setFormData] = useState({
            from: "",
            to: "",
            toDate: new Date(),
        })
        const navigate=useNavigate();
        const handleFormChange = (value, key) => {
            setFormData({ ...formData, [key]: value });
        }
        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.from || !formData.to || !formData.toDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Fill all input field.',
                });
                return;
            }
            navigate("/mobilereceipt")
        }
  return (
    <>
                <div className="container1">
                    <form onSubmit={handleSubmit}>
                        <div className="fields2">
                            <div className="input-field3">
                                <label htmlFor="">From</label>
                                <input type="text" placeholder='Enter From' value={formData.from} onChange={(e) => handleFormChange(e.target.value, "from")} />
                            </div>
                            <div className="input-field3">
                                <label htmlFor="">To</label>
                                <input type="text" placeholder='Enter To' value={formData.to} onChange={(e) => handleFormChange(e.target.value, "to")} />
                            </div>
    
                            
    
                            <div className="bottom-buttons" style={{ marginTop: "18px", marginLeft: "25px" }}>
                                <button type='submit' className='ok-btn'>Submit</button>
                                <button className='ok-btn'>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </>
  )
}

export default DocketPrint4
