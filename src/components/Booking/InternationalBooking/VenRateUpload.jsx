import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";

function VenRateUpload() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [getVendor, setGetVendor] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        Vendor_Code: "",
        mode: "",
        Dox_Spx: "",
        Rate_Mode: "",
        FromDate: firstDayOfMonth,
        ToDate: today,
    });

    /* ================= FETCH MASTER DATA ================= */

    const fetchVendorData = async () => {
        try {
            const res = await getApi("/Master/getVendor");
            setGetVendor(Array.isArray(res.Data) ? res.Data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchModeData = async () => {
        try {
            const res = await getApi("/Master/GetMode");
            setGetMode(Array.isArray(res.Data) ? res.Data : []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorData();
        fetchModeData();
    }, []);

    /* ================= OPTIONS ================= */

    const vendorOptions = getVendor.map(v => ({
        label: v.Vendor_Name,
        value: v.Vendor_Code,
    }));

    const modeOptions = getMode.map(p => ({
        label: p.Mode_Name,
        value: p.Mode_Code,
    }));

    /* ================= SUBMIT ================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.Vendor_Code) {
            Swal.fire("Validation Error", "Vendor Name is required", "warning");
            return;
        }

        if (!form.mode) {
            Swal.fire("Validation Error", "Mode is required", "warning");
            return;
        }

        if (!fileInputRef.current?.files[0]) {
            Swal.fire("Validation Error", "Please select Excel file", "warning");
            return;
        }

        const formData = new FormData();

        formData.append("Vendor_Code", form.Vendor_Code);
        formData.append("Origin_Code", JSON.parse(localStorage.getItem("Login"))?.Branch_Code || "");
        formData.append("Mode_Codes", JSON.stringify([form.mode]));
        formData.append("Dox_Spx", form.Dox_Spx);
        formData.append("Active_Date", form.FromDate.toISOString().split("T")[0]);
        formData.append("Closing_Date", form.ToDate.toISOString().split("T")[0]);
        formData.append("file", fileInputRef.current.files[0]);

        /* ===== DEBUG LOGS (VERY IMPORTANT) ===== */
        console.log("===== FORM DATA BEING SENT =====");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        console.log("================================");

        try {
            Swal.fire({
                title: "Uploading Excel...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const res = await postApi(
                "/Master/uploadVendorRateExcel",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            Swal.close();
            if (res.status === 1) {
                Swal.fire("Success", res.message, "success");
                fileInputRef.current.value = "";
                setForm({
                Vendor_Code: "",
                mode: "",
                Dox_Spx: "",
                Rate_Mode: "",
                FromDate: firstDayOfMonth,
                ToDate: today,
            })
            }
            else {
                Swal.fire("Warning", res.message, "warning");
                
            }

        } catch (err) {
            Swal.close();
            console.error("UPLOAD ERROR ===>", err);
            Swal.fire("Error", err.message || "Upload failed", "error");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    /* ================= UI (UNCHANGED) ================= */

    return (
        <div className="body">
            <div className="container1">
                <form onSubmit={handleSubmit} style={{ background: "#f2f4f3" }}>
                    <div className="fields2">

                        <div className="input-field1">
                            <label>Vendor Name</label>
                            <Select
                                className="blue-selectbooking"
                                classNamePrefix="blue-selectbooking"
                                options={vendorOptions}
                                value={vendorOptions.find(v => v.value === form.Vendor_Code) || null}
                                onChange={(opt) =>
                                    setForm({ ...form, Vendor_Code: opt?.value || "" })
                                }
                                placeholder="Select Vendor"
                                isSearchable
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>

                        <div className="input-field1">
                            <label>Mode Name</label>
                            <Select
                                className="blue-selectbooking"
                                classNamePrefix="blue-selectbooking"
                                options={modeOptions}
                                value={modeOptions.find(p => p.value === form.mode) || null}
                                onChange={(opt) =>
                                    setForm({ ...form, mode: opt?.value || "" })
                                }
                                placeholder="Select Mode"
                                isSearchable
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>

                        <div className="input-field3">
                            <label>Dox / Spx</label>
                            <select
                                value={form.Dox_Spx}
                                onChange={(e) => setForm({ ...form, Dox_Spx: e.target.value })}
                            >
                                <option value="">Select</option>
                                <option value="Dox">Dox</option>
                                <option value="Spx">Spx</option>
                            </select>
                        </div>

                        <div className="input-field3">
                            <label>Rate Mode</label>
                            <select
                                value={form.Rate_Mode}
                                onChange={(e) => setForm({ ...form, Rate_Mode: e.target.value })}
                            >
                                <option value="">Select rate mode</option>
                                <option value="SFC">SFC</option>
                                <option value="AIR">AIR</option>
                                <option value="SURFACE">SURFACE</option>
                            </select>
                        </div>

                        <div className="input-field3">
                            <label>From</label>
                            <DatePicker
                                selected={form.FromDate}
                                onChange={(date) => setForm({ ...form, FromDate: date })}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                            />
                        </div>

                        <div className="input-field3">
                            <label>To Date</label>
                            <DatePicker
                                selected={form.ToDate}
                                onChange={(date) => setForm({ ...form, ToDate: date })}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                            />
                        </div>

                        <div className="input-field3">
                            <label>Excel File</label>
                            <input
                                style={{ display: "flex", justifyContent: "center",paddingTop:"7px" }}
                                type="file"
                                ref={fileInputRef}
                                accept=".xlsx,.xls"
                                className="form-control"
                            />
                        </div>

                        <div className="bottom-buttons" style={{ marginTop: "22px" }}>
                            <button type="submit" className="ok-btn">Submit</button>
                            <button
                                type="button"
                                className="ok-btn"
                                onClick={() => {
                                    setForm({
                                        Vendor_Code: "",
                                        mode: "",
                                        Dox_Spx: "",
                                        Rate_Mode: "",
                                        FromDate: firstDayOfMonth,
                                        ToDate: today,
                                    });
                                    fileInputRef.current.value = "";
                                }}
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default VenRateUpload;


