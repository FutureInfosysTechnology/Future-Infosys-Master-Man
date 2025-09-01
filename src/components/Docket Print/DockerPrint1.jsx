import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom"
import { getApi } from '../Admin Master/Area Control/Zonemaster/ServicesApi';
function DockerPrint1() {
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        toDate: new Date(),
    })
    const [data,setData]=useState([]);
    const navigate=useNavigate();
    const handleFormChange = (value, key) => {
        setFormData({ ...formData, [key]: value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const from =formData.from;
        const to =formData.to;
        if (!from || !to) {
              Swal.fire('Error', 'Both From Docket and To Docket are required.', 'error');
              return;
            }
            try{
                const response=await getApi(`/Booking/DocketReceipt?FromDocket=${encodeURIComponent(from)}&ToDocket=${encodeURIComponent(to)}`);
                if(response.status===1)
                {
                    setData(response.Data);
                    console.log(response.Data);
                    navigate("/docketpdf", { state: { data:response.Data } });
                }
            }catch (error) {
                
                      console.error("API Error:", error);
                      setData([]);
                      Swal.fire('No Data','No records found.', 'info');
            }
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

export default DockerPrint1;