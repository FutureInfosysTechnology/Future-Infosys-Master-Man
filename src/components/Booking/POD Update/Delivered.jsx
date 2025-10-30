import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';
import 'react-toggle/style.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { getApi, putApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";

function Delivered() {
    const today = new Date();
    const time = String(today.getHours()).padStart(2, "0") + ":" + String(today.getMinutes()).padStart(2, "0");
    const [deliveryData, setDeliveryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        DocketNo: '',
        ReferenceNo: '',
        toDate: today,
        time: time,
        Status: "",
        image: null,
        RecName: "",
        RecMob: "",
        Remark: "",
    })
    const resetForm=()=>
    {
        setFormData((prev)=>({
            ...prev,
            DocketNo: '',
        ReferenceNo: '',
        toDate: today,
        time: time,
        Status: "",
        image: null,
        RecName: "",
        RecMob: "",
        Remark: "",
        }))
    }
    const statusOptions = [
        { value: "Delivered", label: "Delivered" },
        { value: "RTO", label: "RTO" },
    ];
    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`; // ✅ yyyy-MM-dd format
    };
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    const getDelieveredData = async (awbNo, refNo) => {
        try {
            setIsLoading(true);
            const response = await getApi(`/Master/getTrackingData?DocketNo=${awbNo}`);
            if (response.status === 1) {
                setDeliveryData(response.Data);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            Swal.fire({
                icon: 'warning',
                title: 'No Data Found',
                text: 'No data available for the selected AWB NO or REf NO.',
                showConfirmButton: true,
            });
        } finally {
            setIsLoading(false);
        }
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result }); // Base64 string
            };
            reader.readAsDataURL(file);
        }
    };
 const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            DocketNo: formData.DocketNo,
            Status: formData.Status,
            DelvDT: formatDate(formData.toDate), // ✅ formatted date
            DelvTime: formData.time,
            Receiver_Name: formData.RecName,
            Receiver_Mob_No: formData.RecMob,
            POD_Images: formData.image,
            Remark: formData.Remark,
            Stamp: "USR01", // change as per login user
        };

        try {
            const res = await putApi("DocketBooking/Deliveryupdate", payload);

            if (res.status === 1) {
                Swal.fire("Success", res.message, "success");
                await getDelieveredData(formData.DocketNo, formData.ReferenceNo);
                resetForm();
            } else {
                Swal.fire("Error", res.message, "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong while updating", "error");
        }
    };

    console.log(formData);
    const handleSearch = (e) => {
        getDelieveredData(formData.DocketNo, formData.ReferenceNo);
    };

    console.log(deliveryData.length);
    return (
        <>
            <div className="body">
                <div className="container1">
                    <form onSubmit={handleSubmit} style={{ marginBottom: "10px" }}>
                        <div className="fields2">
                            <div className="input-field3">
                                <label >LR_NO</label>
                                <input type="tel" placeholder="AWB Number" value={formData.DocketNo}
                                    onChange={(e) => setFormData({ ...formData, DocketNo: e.target.value })}
                                     onBlur={handleSearch}
                                />
                            </div>

                            <div className="input-field3">
                                <label >AGENT LR_NO</label>
                                <input type="tel" placeholder="Reference Number" value={formData.ReferenceNo}
                                    onChange={(e) => setFormData({ ...formData, ReferenceNo: e.target.value })} />
                            </div>

                            <div className="input-field3">
                                <label >Status</label>
                                <Select
                                    options={statusOptions}
                                    value={statusOptions.find(opt => opt.value === formData.Status) || null}
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            Status: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Status"
                                    required
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                    menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                                    styles={{
                                        placeholder: (base) => ({
                                            ...base,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }),
                                        menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                                    }}
                                />
                            </div>

                            <div className="input-field3">
                                <label >Delivery_Date</label>
                                <DatePicker
                                    portalId="datepicker-portal"
                                    selected={formData.toDate}
                                    onChange={(date) => handleDateChange(date, "toDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label >Delivery_Time</label>
                                <input type="time" value={formData.time} onChange={(e) => { setFormData({ ...formData, time: e.target.value }) }} />
                            </div>

                            <div className="input-field3">
                                <label >Receiver Name</label>
                                <input type="text" placeholder="Enter Receiver Name" value={formData.RecName} onChange={(e) => { setFormData({ ...formData, RecName: e.target.value }) }} />
                            </div>

                            <div className="input-field3">
                                <label >Mobile No</label>
                                <input type="tel" maxLength="10" id="mobile"
                                    name="mobile" pattern="[0-9]{10}" placeholder="Enter Mobile No" value={formData.RecMob} onChange={(e) => { setFormData({ ...formData, RecMob: e.target.value }) }} />
                            </div>

                            <div className="input-field3">
                                <label >POD_IMG</label>
                                <input style={{ padding: "5px" }} type="file" accept="image/*" onChange={handleFileChange}  />
                            </div>

                            <div className="input-field3">
                                <label >Remark</label>
                                <input type="text" placeholder="Enter Remark" value={formData.Remark} onChange={(e) => { setFormData({ ...formData, Remark: e.target.value }) }} />
                            </div>

                            <div className="input-field3">
                                <label style={{ marginBottom: "18px" }}></label>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <button style={{ height: "40px", width: "48%" }} className="ok-btn" type="submit">Submit</button>
                                    <button style={{ height: "40px", width: "48%", marginLeft: "10px" }} className="ok-btn" onClick={resetForm}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {deliveryData.length > 0 && (<div style={{width:"100%",border:"1px solid black" }}></div>)}

                    {isLoading && <div className="loader"></div>}
                    {deliveryData.length > 0 && (
                        <form style={{marginTop:"10px"}}>
                            <div className="fields2">
                                <div className="input-field3">
                                    <label >Docket Number</label>
                                    <input type="tel" placeholder="Docket No" value={deliveryData[0]?.DocketNo || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Booking Date</label>
                                    <input type="text" placeholder="Booking Date" value={deliveryData[0]?.BookDate || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Origin</label>
                                    <input type="text" placeholder="Origin"
                                        value={deliveryData[0]?.OriginCity || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Destination</label>
                                    <input type="text" placeholder="Destination" value={deliveryData[0]?.StatusEntry[0]?.Destination_name || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Consignee Name</label>
                                    <input type="text" placeholder="Customer Name" value={deliveryData[0]?.Consignee_Name || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Consignee Mob No</label>
                                    <input type="tel" placeholder="Mobile No" value={deliveryData[0]?.Consignee_Mob || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Pin code</label>
                                    <input type="tel" placeholder="Pin Code" value={deliveryData[0]?.Consignee_Pin || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Actual Weight</label>
                                    <input type="tel" placeholder="Actual Wt." value={deliveryData[0]?.ActualWt || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Charged Weight</label>
                                    <input type="tel" placeholder="Charged Wt." value={deliveryData[0]?.ChargedWt || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Vendor Name</label>
                                    <input type="text" value={deliveryData[0]?.Vendor_Name || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Vendor Docket No</label>
                                    <input type="text" placeholder="Vendor Docket No" value={deliveryData[0]?.VendorAwbNo || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Manifest No</label>
                                    <input type="text" placeholder="Manifest No"
                                        value={deliveryData[0]?.ManifestNo || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Manifest Date</label>
                                    <input type="text" placeholder="Manifest Date"
                                        value={deliveryData[0]?.ManifestDate || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >DRS No</label>
                                    <input type="tel" placeholder="DRS No"
                                        value={deliveryData[0]?.DrsNo || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Mode</label>
                                    <input type="text" placeholder="Mode"
                                        value={deliveryData[0]?.Mode_Name || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Invoice No</label>
                                    <input type="tel" placeholder="Invoice No" value={deliveryData[0]?.InvoiceNo || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Invoice Value</label>
                                    <input type="text" placeholder="Invoice Value" value={deliveryData[0]?.InvValue || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Quantity</label>
                                    <input type="text" placeholder="Qty" value={deliveryData[0]?.Qty || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Receiver Name</label>
                                    <input type="text" placeholder="Receiver Name" value={deliveryData[0]?.RecvName || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Receiver Mob No</label>
                                    <input type="tel" placeholder="Mobile No" value={deliveryData[0]?.ReceivedMo || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Delivery Date</label>
                                    <input type="text" placeholder="Delivery Date" value={deliveryData[0]?.DelvDT || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Delivery Time</label>
                                    <input type="text" placeholder="Delivery Time" value={deliveryData[0]?.StatusEntry[0]?.DelvTime || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >E Way Bill No</label>
                                    <input type="text" placeholder="E Way Bill No" value={deliveryData[0]?.EWaybill || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Exp Date of Delivery</label>
                                    <input type="text" placeholder="Exp Date" value={deliveryData[0]?.ExptDateOfDelvDt || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Remark</label>
                                    <input type="text" placeholder="Remark" value={deliveryData[0]?.Remark || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Stamp</label>
                                    <input type="text" placeholder="Stamp" value={deliveryData[0]?.SignStamp || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Status</label>
                                    <input type="text" placeholder="Status" value={deliveryData[0]?.Status || ''} readOnly />
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default Delivered;