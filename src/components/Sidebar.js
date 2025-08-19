import React, { useState, useEffect } from "react";
import SidebarItem from "./SidebarItem";
import items from "../data/sidebar.json";
import axios from 'axios';
import "./sidebar.css";
// import Swal from "sweetalert2";

export default function Sidebar() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    

    useEffect(() => {
        if (fromDate && toDate) {
            fetchData();
        }
    }, [fromDate, toDate]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://www.softctl.com/IONICBACKENDAPI/Bookingdate?fromDate=${fromDate}&toDate=${toDate}`);
            const exceldata = response.data;
            console.log('Fetched data:', exceldata);
            // Assuming you want to set some state here with the fetched data
            // setDatabooking(exceldata.Data);
        } catch (error) {
            console.error('Failed to Fetch data booking:', error);
        }
    };

    

    return (
        <div className="body">
            <div className="sidebar">
                {items.map((item, index) => <SidebarItem key={index} item={item} />)}
            </div>
        </div>

    )
}