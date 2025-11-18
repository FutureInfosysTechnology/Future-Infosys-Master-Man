import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom"
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
const DocketPrint1 = () => {
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
        try {
                    const response = await getApi(`/Booking/DocketReceipt?FromDocket=${formData.from}&ToDocket=${formData.to}`);
                    if (response.status === 1) {
                        console.log(response);
                        console.log(response.Data);
                        setData(response.Data);
                        response.Data && navigate("/MobileReceipt", { state: { data:response.Data,path:location.pathname,tab:"print1" } });
                    }
                    else
                    {
                        Swal.fire("Warning", `Warong Docket Number`, "warning");
                    }
                }
                catch (error) {
                    console.error("API Error:", error);
                }
                finally {
                }
    }
    return (
        <>
            <div className="container1">
                <form onSubmit={handleSubmit} style={{backgroundColor:"#f2f4f3"}}>
                    <div className="fields2">
                        <div className="input-field3">
                            <label htmlFor="">From</label>
                            <input type="text" placeholder='From Docket' value={formData.from} onChange={(e) => handleFormChange(e.target.value, "from")} required/>
                        </div>
                        <div className="input-field3">
                            <label htmlFor="">To</label>
                            <input type="text" placeholder='To Docket' value={formData.to} onChange={(e) => handleFormChange(e.target.value, "to")} required/>
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

export default DocketPrint1
