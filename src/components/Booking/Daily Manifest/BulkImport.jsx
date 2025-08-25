import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom"
function BulkImport (){
        const [formData, setFormData] = useState({
            file:null,
        })
        const navigate=useNavigate();
        const handleFormChange = (value, key) => {
            setFormData({ ...formData, [key]: value });
        }
        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.file) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Fill all input field.',
                });
                return;
            }
            navigate("/boxsticker")
        }
    return (
        <>
            <div className="container1">
                <form onSubmit={handleSubmit}>
                    <div className="fields2">
                        <div className="input-field3">
                            <label htmlFor="">Import</label>
                            <input style={{paddingTop:"5px"}} type="file" placeholder="choose file" onChange={(e)=>handleFormChange(e.target.files[0],"file")} />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="" style={{marginBottom:"8px"}}></label>
                            <button className="generate-btn">OK</button>
                        </div>

                        <div className="input-field3">
                            <label htmlFor=""></label>
                        </div>

                        <div className="input-field3">
                            <label htmlFor="" style={{marginBottom:"8px"}}></label>
                            <button className="generate-btn" style={{padding:"5px", width:"100%"}}>Download Sample</button>
                        </div>

                        <div className="input-field3">
                            <label htmlFor="" style={{marginBottom:"8px"}}></label>
                            <button className="generate-btn" style={{width:"100%"}}>Error Log</button>
                        </div>
                    </div>

                </form>
            </div>
        </>
    );
};

export default BulkImport;