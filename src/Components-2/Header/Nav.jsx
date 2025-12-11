import React, { useEffect, useState } from "react";
import './nav.css';
import '../Dashboard/Mainstyle.css';
import Navnotice from "./Navnotice";
import Navmessage from "./Navmessage";
import Navavtar from "./Navavtar";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getApi } from "../../components/Admin Master/Area Control/Zonemaster/ServicesApi";

function Nav() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    const [formData, setFormData] = useState({
        fromdt: firstDayOfMonth,
        todt: today,
        BranchName: JSON.parse(localStorage.getItem("Login"))?.Branch_Code
    });
    const loadDashboardSummary = async (type, location, fromDate, toDate) => {
        try {
            const response = await getApi(
                `/Master/${type}?Location_Code=${location}&FromDate=${fromDate}&ToDate=${toDate}`
            );

            if (response?.Success === 1) {
                localStorage.setItem(`${type}`, JSON.stringify(response.Data))
            }

        } catch (err) {
            console.error(`Error loading ${type}:`, err);
        }
    };

    useEffect(() => {
        loadDashboardSummary(
            "DashboardBKSummary",
            formData.BranchName,
            formData.fromdt,
            formData.todt,
        );
        loadDashboardSummary(
            "DashboardManifestSummary",
            formData.BranchName,
            formData.fromdt,
            formData.todt,
        );
        loadDashboardSummary(
            "DashboardInsconSummary",
            formData.BranchName,
            formData.fromdt,
            formData.todt,
        );
        loadDashboardSummary(
            "DashboardRunsheetSummary",
            formData.BranchName,
            formData.fromdt,
            formData.todt,
        );
    }, [formData.fromdt, formData.todt])
    return (
        <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center" style={{ display: "flex", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                    <DatePicker
                        portalId="root-portal"
                        selected={formData.fromdt}
                        onChange={(date) => handleDateChange(date, "fromdt")}
                        dateFormat="dd/MM/yyyy"
                        className="form-control form-control-sm"
                    />
                    <DatePicker
                        portalId="root-portal"
                        selected={formData.todt}
                        onChange={(date) => handleDateChange(date, "todt")}
                        dateFormat="dd/MM/yyyy"
                        className="form-control form-control-sm"
                    />
                </div>
                <Navnotice />
                <Navavtar />
            </ul>

        </nav>
    )
}

export default Nav;