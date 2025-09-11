import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom"
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
const DocketPrint4 = () => {
    const [data,setData]=useState([]);
    const [formData, setFormData] = useState({
        from: "",
        to: "",
    })
    const location=useLocation();
    console.log(formData);
    const navigate = useNavigate();
    const handleFormChange = (value, key) => {
        setFormData({ ...formData, [key]: value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
                navigate("/MobileReceipt", { state: { from:formData.from,to:formData.to,path:location.pathname } });
    }
    return (
        <>
            <div className="container1">
                <form onSubmit={handleSubmit}>
                    <div className="fields2">
                        <div className="input-field3">
                            <label htmlFor="">From</label>
                            <input type="text" placeholder='From Docket' value={formData.from} onChange={(e) => handleFormChange(e.target.value, "from")} />
                        </div>
                        <div className="input-field3">
                            <label htmlFor="">To</label>
                            <input type="text" placeholder='To Docket' value={formData.to} onChange={(e) => handleFormChange(e.target.value, "to")} />
                        </div>



                        <div className="bottom-buttons" style={{ marginTop: "22px", marginLeft: "12px" }}>
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
