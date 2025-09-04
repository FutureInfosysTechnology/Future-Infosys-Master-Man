import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
const DockerPrint1 = () => {
    const [data,setData]=useState([]);
    const [formData, setFormData] = useState({
        from: "",
        to: "",
    })
    const navigate = useNavigate();
    const handleFormChange = (value, key) => {
        setFormData({ ...formData, [key]: value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await getApi(`/Booking/DocketReceipt?FromDocket=DKT0036859&ToDocket=DKT0037950`);
            if (response.status === 1) {
                console.log(response.Data);
                setData(response.Data);
                navigate("/MobileReceipt", { state: { data:response.Data } });
        }}
        catch (error) {
            console.error("API Error:", error);
            setData([]);
            Swal.fire('No Data', 'No records found.', 'info');
        }
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

export default DockerPrint1
