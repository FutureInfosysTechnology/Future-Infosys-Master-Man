import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom"
import { getApi} from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import Select from "react-select";
import DatePicker from "react-datepicker";
function CreditPrint() {
     const extractArray = (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.Data)) return response.Data;
        return [];
    };
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [getCustomer, setGetCustomer] = useState([]);
    const [formData, setFormData] = useState({
        from: new Date(),
        to: new Date(),
    })
    const location = useLocation();
    console.log(formData);
    const navigate = useNavigate();
        const fetchData = async (endpoint, setData) => {
            try {
                const response = await getApi(endpoint);
                setData(extractArray(response));
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
    
        // 🧠 Load Customers and Credit Notes
        useEffect(() => {
            fetchData("/Master/getCustomerdata", setGetCustomer);
        }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await getApi(`/Booking/DocketPrint_2?FromDocket=${formData.from}&ToDocket=${formData.to}`);
            if (response.status === 1) {
                console.log(response);
                console.log(response.Data);
                setData(response.Data);
                response.Data && navigate("/vendorboxlabel", { state: { data: response.Data, path: location.pathname ,tab:"print2"} });
            }
            else {
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
                <form onSubmit={handleSubmit}>
                    <div className="fields2">
                        <div className="input-field1">
                                <label>Customer</label>
                                <Select
                                    options={getCustomer.map((cust) => ({
                                        value: cust.Customer_Code,
                                        label: cust.Customer_Name
                                    }))}
                                    value={
                                        formData.customer
                                            ? {
                                                value: formData.customer,
                                                label:
                                                    getCustomer.find((c) => c.Customer_Code === formData.customer)
                                                        ?.Customer_Name || ""
                                            }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            customer: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    menuPortalTarget={document.body}
                                    styles={{
                                        container: (base) => ({ ...base, width: "100%" }),
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                    }}
                                    placeholder="Select Customer"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                />
                            </div>
                        <div className="input-field3">
                            <label htmlFor="">From</label>
                             <DatePicker
                                                                portalId="root-portal"
                                                                selected={formData.from}
                                                                onChange={(date) => setFormData({ ...formData, from:date })}
                                                                dateFormat="dd/MM/yyyy"
                                                                className="form-control form-control-sm"
                                                            />
                        </div>
                        <div className="input-field3">
                            <label htmlFor="">To</label>
                             <DatePicker
                                                                portalId="root-portal"
                                                                selected={formData.to}
                                                                onChange={(date) => setFormData({ ...formData, to:date })}
                                                                dateFormat="dd/MM/yyyy"
                                                                className="form-control form-control-sm"
                                                            />
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

export default CreditPrint;