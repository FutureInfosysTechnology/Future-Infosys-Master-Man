import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';
import 'react-toggle/style.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
        Reciept: "",

    })
    const statusOptions = [
        { value: "Arrived", label: "Arrived" },
        { value: "Schedule", label: "Schedule" },
        { value: "Dispatch", label: "Dispatch" },
        { value: "Delivered", label: "Delivered" },
        { value: "Return", label: "Return" }  // (maybe you meant "Return"?)
    ];
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    const getDelieveredData = async (awbNo, refNo) => {
        try {
            setIsLoading(true);
            const response = await axios.get('https://sunraise.in/JdCourierlablePrinting/Delivery/getTrackingData', {
                params: {
                    awbNo: Array.isArray(formData.DocketNo) ? formData.DocketNo.join(",") : formData.DocketNo,
                    refNo: Array.isArray(formData.ReferenceNo) ? formData.ReferenceNo.join(",") : formData.ReferenceNo,
                }
            })

            if (response.data.status === 1) {
                const data = response.data.Data;
                setTimeout(() => {
                    setIsLoading(false);
                    setDeliveryData(data.length > 0 ? data : []);
                }, 1000);
            } else {
                alert('Error fetching data.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert('Error fetching data. Please try again later.');
            setIsLoading(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        getDelieveredData(formData.DocketNo, formData.ReferenceNo);
    };


    return (
        <>
            <div className="body">
                <div className="container1">
                    <form action="" onSubmit={handleSubmit} style={{ marginBottom: "10px" }}>
                        <div className="fields2">
                            <div className="input-field3">
                                <label >AWB Number</label>
                                <input type="tel" placeholder="AWB Number" value={formData.DocketNo}
                                    onChange={(e) => setFormData({ ...formData, DocketNo: e.target.value })} />
                            </div>

                            <div className="input-field3">
                                <label >Reference Number</label>
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
                                <label >Date</label>
                                <DatePicker
                                    selected={formData.toDate}
                                    onChange={(date) => handleDateChange(date, "toDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="input-field3">
                                <label >Time</label>
                                <input type="time" value={formData.time} onChange={(e) => { setFormData({ ...formData, time: e.target.value }) }} />
                            </div>

                            <div className="input-field3">
                                <label >Nature Of Receipt</label>
                                <Select
                                    options={statusOptions}
                                    value={statusOptions.find(opt => opt.value === formData.Reciept) || null}
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            Reciept: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Reciept"
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
                                <label >Receiver Name</label>
                                <input type="text" placeholder="Enter Receiver Name" />
                            </div>

                            <div className="input-field3">
                                <label >Mobile No</label>
                                <input type="tel" maxLength="10" id="mobile"
                                    name="mobile" pattern="[0-9]{10}" placeholder="Enter Mobile No" />
                            </div>

                            <div className="input-field3">
                                <label >Remark</label>
                                <input type="text" placeholder="Enter Remark" />
                            </div>

                            <div className="input-field3">
                                <label >Upload Image</label>
                                <input style={{ padding: "5px" }} type="file" />
                            </div>

                            <div className="input-field3">
                                <label style={{ marginBottom: "18px" }}></label>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <button style={{ height: "40px", width: "48%" }} className="ok-btn" type="submit">Submit</button>
                                    <button style={{ height: "40px", width: "48%", marginLeft: "10px" }} className="ok-btn">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <span style={{ height: "1px", backgroundColor: "lightgray" }}></span>

                    {isLoading && <div className="loader"></div>}
                    {deliveryData.length > 0 && (
                        <form>
                            <div className="fields2">
                                <div className="input-field3">
                                    <label >Docket Number</label>
                                    <input type="tel" placeholder="Docket No" value={deliveryData[0]?.DocketNo || ''} readOnly />
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
                                    <label >Customer Name</label>
                                    <input type="text" placeholder="Customer Name" value={deliveryData[0]?.Consignee_Name || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Customer Mobile No</label>
                                    <input type="tel" placeholder="Mobile No" value={deliveryData[0]?.Consignee_Mob || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Pin code</label>
                                    <input type="tel" placeholder="Pin Code" value={deliveryData[0]?.Consignee_Pin || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Booking Date</label>
                                    <input type="text" placeholder="Booking Date" value={deliveryData[0]?.bookdate || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Receiver Name</label>
                                    <input type="text" placeholder="Receiver Name" value={deliveryData[0]?.RecvName || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Receiver Mobile No</label>
                                    <input type="tel" placeholder="Mobile No" value={deliveryData[0]?.ReceivedMo || ''} readOnly />
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
                                    <label >Origin</label>
                                    <input type="text" placeholder="Origin"
                                        value={deliveryData[0]?.Origin_City || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Destination</label>
                                    <input type="text" placeholder="Destination"
                                        value={deliveryData[0]?.Destination_City || ''} readOnly />
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
                                    <label >Delivery Date</label>
                                    <input type="text" placeholder="Delivery Date" value={deliveryData[0]?.DelvDT || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >Delivery Time</label>
                                    <input type="text" placeholder="Delivery Time" value={deliveryData[0]?.DelvTime || ''} readOnly />
                                </div>

                                <div className="input-field3">
                                    <label >E Way Bill No</label>
                                    <input type="text" placeholder="E Way Bill No" value={deliveryData[0]?.EwayBill || ''} readOnly />
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
                                    <input type="text" placeholder="Stamp" value={deliveryData[0]?.Stamp || ''} readOnly />
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