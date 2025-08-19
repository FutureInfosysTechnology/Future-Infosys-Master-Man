import React, { useState, useEffect, PureComponent } from "react";
import './dashboard.css';
import Header from "../Header/Header";
import Sidebar1 from "../Sidebar1";
import Footer from "../Footer";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, PieChart, Pie, Sector, Cell,
    BarChart, Bar, Rectangle, CartesianGrid, Legend
} from 'recharts';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import bookingSvg from "../../Assets/Images/cash-svgrepo-com.png";
import inscanSvg from "../../Assets/Images/scan-barcode-svgrepo-com.png";
import runsheetSvg from "../../Assets/Images/delivery-truck-automobile-svgrepo-com.png";
import manifestSvg from "../../Assets/Images/delivery-truck-truck-svgrepo-com.png";
import statusSvg from "../../Assets/Images/online-shop-shipping-and-delivery-svgrepo-com.png";
import deliverySvg from "../../Assets/Images/tablet-ipad-svgrepo-com.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import percentage from "../../Assets/Images/percentage-percent-svgrepo-com.png";
import person1 from "../../Assets/Images/person1.jpg";
import person2 from "../../Assets/Images/person2.jpg";
import person3 from "../../Assets/Images/person3.jpg";
import person4 from "../../Assets/Images/person4.jpg";
import person5 from "../../Assets/Images/person5.jpg";


const data = [
    {
        name: 'Jan',
        uv: "",
        pv: "",
        amt: "",
    },
    {
        name: 'Feb',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'March',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'April',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'May',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'June',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'July',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

const data1 = [
    {
        name: 'Jan',
        uv: 200,
        pv: 2500,
        amt: 4100,
    },
    {
        name: 'Feb',
        uv: 1000,
        pv: 3398,
        amt: 2210,
    },
    {
        name: 'March',
        uv: 2000,
        pv: 5800,
        amt: 2290,
    },
    {
        name: 'April',
        uv: 780,
        pv: 5908,
        amt: 2000,
    },
    {
        name: 'May',
        uv: 890,
        pv: 3800,
        amt: 2181,
    },
    {
        name: 'June',
        uv: 2390,
        pv: 1800,
        amt: 2500,
    },
    {
        name: 'July',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

const data2 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 }
];

const data3 = [
    {
        name: 'Jan',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Feb',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'March',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'April',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'May',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'June',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'July',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
    {
        name: 'Aug',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
    {
        name: 'Sep',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";


function Dashboard() {

    const [tooltipContent, setTooltipContent] = useState("");
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };


    const handleMouseEnter = (geo) => {
        const { NAME } = geo.properties;
        setTooltipContent(NAME);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const cards = [
        { id: 1, title: "Booking", pending: "24", done: "15", image: bookingSvg },
        { id: 2, title: "Manifest", pending: "31", done: "20", image: manifestSvg },
        { id: 3, title: "Inscan", pending: "10", done: "40", image: inscanSvg },
        { id: 4, title: "Runsheet", pending: "05", done: "30", image: runsheetSvg },
        { id: 5, title: "Status Activity", pending: "10", done: "50", image: statusSvg },
        { id: 6, title: "Delivery Updation", pending: "20", done: "25", image: deliverySvg },
    ];

    const cards1 = [
        { id: 1, title: "Mahesh Kumar", image: person1 },
        { id: 2, title: "Shalini Kumari", image: person2 },
        { id: 3, title: "Ramesh Kumar", image: person3 },
        { id: 4, title: "Shushant", image: person4 },
        { id: 5, title: "Digvijay", image: person5 },
        { id: 6, title: "Soham", image: person1 },
    ];


    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="dashboard-container">

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        slidesPerView={4}
                        spaceBetween={20}
                        autoplay={{ delay: 4000 }}
                        speed={1300}
                        effect="slide"
                        loop={true}
                        className="w-100"
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                    >
                        {cards.map((card) => (
                            <SwiperSlide key={card.id}>
                                <div className="card booking-card1">
                                    <div className="row1">
                                        <div style={{ width: "30%", alignItems: "center", justifyContent: "center", display: "flex" }}>
                                            <img className="card-image" src={card.image} alt="" />
                                        </div>
                                        <div className="column1" style={{ alignItems: "center", justifyContent: "center", width: "70%" }}>
                                            <b>{card.title}</b>
                                            <div className="row1" style={{ marginTop: "10px" }}>
                                                <div className="column1" style={{ alignItems: "center", justifyContent: "center", marginRight: "5px" }}>
                                                    <span>{card.pending}</span>
                                                    <p>Pending</p>
                                                </div>

                                                <div className="column1" style={{ alignItems: "center", justifyContent: "center", marginLeft: "5px" }}>
                                                    <span>{card.done}</span>
                                                    <p>Done</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
                        <div className="card" style={{ width: "70%", marginRight: "10px", height: "350px", padding: "20px", border: "none" }}>
                            <div className="column1">
                                <div className="row1" style={{ justifyContent: "space-between" }}>
                                    <b style={{ marginBottom: "70px" }}>Statistic</b>
                                    <div className="dropdown">
                                        <button onClick={toggleDropdown} className="ok-btn" style={{ height: "30px", width: "130px" }}>
                                            Select Option ▼
                                        </button>

                                        {isOpen && (
                                            <ul className="dropdown-menu" style={{ paddingLeft: "5px" }}>
                                                <li>This Month</li>
                                                <li>This Week</li>
                                                <li>Today</li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <ResponsiveContainer width={"100%"} height={200}>
                                        <LineChart data={data1} margin={{ top: 20 }}>
                                            <XAxis dataKey="name" padding={{ left: 30, right: 30 }}
                                                tick={{ fill: "#aaa", fontSize: 12 }} />
                                            <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="pv"
                                                stroke="purple"
                                            >
                                                <LabelList position="top" offset={200} />
                                            </Line>
                                            <Line type="monotone" dataKey="uv" fill="#0088FE">
                                                <LabelList position="top" offset={200} />
                                            </Line>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ width: "30%", marginLeft: "10px", height: "350px", border: "none" }}>
                            <b>Data</b>
                            <div>
                                <ResponsiveContainer width={"100%"} height={200}>
                                    <PieChart>
                                        <Pie
                                            data={data2}
                                            cx={140}
                                            cy={90}
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data2.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <b>Data</b>
                            <div className="row1" style={{ justifyContent: "space-between" }}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div className="box" style={{ height: "15px", width: "15px", borderRadius: "5px", backgroundColor: "#0088FE", margin: "5px" }}></div>
                                    <p style={{ margin: "0px", padding: "0px" }}>Primary (27%)</p>
                                </div>
                                <b>763</b>
                            </div>

                            <div className="row1" style={{ justifyContent: "space-between" }}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div className="box" style={{ height: "15px", width: "15px", borderRadius: "5px", backgroundColor: "#00C49F", margin: "5px" }}></div>
                                    <p style={{ margin: "0px", padding: "0px" }}>Promotion (11%)</p>
                                </div>
                                <b>321</b>
                            </div>

                            <div className="row1" style={{ justifyContent: "space-between" }}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div className="box" style={{ height: "15px", width: "15px", borderRadius: "5px", backgroundColor: "#FFBB28", margin: "5px" }}></div>
                                    <p style={{ margin: "0px", padding: "0px" }}>Forum (22%)</p>
                                </div>
                                <b>154</b>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ height: "420px", width: "100%", backgroundColor: "#01A3FF", color: "white", border: "none", marginTop: "30px" }}>
                        <div className="row1" style={{ height: "100%", width: "100%" }}>
                            <div className="column1" style={{ height: "100%", width: "75%" }}>
                                <b style={{ marginBottom: "20px", marginLeft: "10px", marginTop: "10px" }}>Statistic</b>

                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data3}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                        barSize={7}

                                    >
                                        <XAxis dataKey="name" tick={{ fill: "#fff" }} />
                                        <YAxis tick={{ fill: "#fff" }} />
                                        <Tooltip />
                                        <Bar dataKey="uv" fill="white" radius={[15, 15, 10, 10]} />
                                        <Bar dataKey="pv" fill="yellow" radius={[15, 15, 10, 10]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="column1" style={{ height: "100%", width: "25%", padding: "10px" }}>
                                <div className="dropdown">
                                    <button onClick={toggleDropdown} className="ok-btn" style={{ height: "30px", width: "130px" }}>
                                        Select Option ▼
                                    </button>

                                    {isOpen && (
                                        <ul className="dropdown-menu" style={{ paddingLeft: "5px" }}>
                                            <li>This Month</li>
                                            <li>This Week</li>
                                            <li>Today</li>
                                        </ul>
                                    )}
                                </div>

                                <div className="row1" style={{ marginTop: "15px", justifyContent: "space-between" }}>
                                    <div className="row1">
                                        <input type="radio" name="" id="" style={{ display: "block", width: "20px" }} />
                                        <div className="column1" style={{ marginLeft: "10px" }}>
                                            <p style={{ color: "white", margin: "0px", padding: "0px" }}>Pending</p>
                                            <b>1982</b>
                                        </div>
                                    </div>

                                    <div className="row1">
                                        <input type="radio" name="" id="" style={{ display: "block", width: "20px" }} />
                                        <div className="column1" style={{ marginLeft: "10px" }}>
                                            <p style={{ color: "white", margin: "0px", padding: "0px" }}>Done</p>
                                            <b>1982</b>
                                        </div>
                                    </div>
                                </div>

                                <div className="card" style={{
                                    height: "120px", marginTop: "20px", color: "white",
                                    backgroundColor: "#36aef3", border: "none", paddingLeft: "20px"
                                }}>
                                    <p style={{ margin: "0px", padding: "0px", color: "white" }}>Pending</p>
                                    <b style={{ fontSize: "18px" }}>$ 12,890,00</b>
                                    <div className="row1" style={{ marginTop: "5px" }}>
                                        <i className="bi bi-arrow-up-circle-fill" style={{ fontSize: "22px", marginRight: "5px" }}></i>
                                        <b>+15 %</b>
                                    </div>
                                </div>

                                <div className="card" style={{
                                    height: "120px", marginTop: "20px", color: "white",
                                    backgroundColor: "#36aef3", border: "none", paddingLeft: "20px"
                                }}>
                                    <p style={{ margin: "0px", padding: "0px", color: "white" }}>Done</p>
                                    <b style={{ fontSize: "18px" }}>$ 12,890,00</b>
                                    <div className="row1" style={{ marginTop: "5px" }}>
                                        <i className="bi bi-arrow-down-circle-fill" style={{ fontSize: "22px", marginRight: "5px" }}></i>
                                        <b>+15 %</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row1" style={{ height: "100%", width: "100%", marginTop: "30px" }}>
                        <div className="card" style={{ width: "50%", height: "170px", marginRight: "15px", border: "none" }}>
                            <div className="row1" style={{ height: "100%", width: "100%", padding: "15px" }}>
                                <div style={{ width: "35%", height: "100%" }}>
                                    <img src={percentage} alt="" style={{ height: "100%" }} />
                                </div>

                                <div style={{ width: "65%", height: "100%", paddingTop: "15px" }}>
                                    <h5 style={{ color: "#4FD1C5", fontWeight: "bold" }}>Upgrade Your Storage</h5>
                                    <p style={{ margin: "0px", padding: "0px", fontSize: "12px" }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, inventore.</p>
                                    <button className="ok-btn" style={{ height: "35px", width: "80px", marginTop: "5px" }}>Upgrade</button>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ width: "50%", height: "170px", marginLeft: "15px", border: "none" }}>
                            <div className="column1" style={{ height: "100%", width: "100%", padding: "15px" }}>
                                <div className="row1" style={{ justifyContent: "space-between" }}>
                                    <b>7,642</b>
                                    <button className="ok-btn" style={{ height: "35px", width: "120px", fontSize: "14px" }}>+ Add Customer</button>
                                </div>
                                <span style={{ fontWeight: "bold", color: "#4FD1C5" }}>Total New Customers</span>
                                <p style={{ margin: "0px", padding: "0px", fontSize: "12px" }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, inventore.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, inventore.
                                </p>
                            </div>
                        </div>
                    </div>

                    <b style={{ marginTop: "30px" }}>User Reviews</b>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        slidesPerView={3}
                        spaceBetween={20}
                        autoplay={{ delay: 4000 }}
                        speed={1300}
                        effect="slide"
                        loop={true}
                        className="w-100"
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 3 },
                        }}
                    >
                        {cards1.map((card) => (
                            <SwiperSlide key={card.id}>
                                <div className="card booking-card1" style={{ height: "160px", padding: "20px" }}>
                                    <div className="column1" style={{ height: "100%", width: "100%" }}>
                                        <div className="row1">
                                            <img src={card.image} alt="" className="card-image" style={{padding:"0px", border:"none", marginRight:"20px"}} />
                                            <div className="column1">
                                                <b>{card.title}</b>
                                                <p style={{margin:"0px", padding:"0px"}}>UI Designer / <i className="bi bi-star-fill" style={{color:"yellow"}}></i> 5.0</p>
                                            </div>
                                        </div>
                                        <p style={{margin:"0px", padding:"0px", fontSize:"12px"}}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit velit quod corporis esse illo quaerat excepturi doloribus nobis soluta consequuntur.</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* <div className="card upper-card">
                        <div>
                            <button className="ok-btn">
                                <i className="bi bi-globe2"></i>
                            </button>
                            <b>Sales by City</b>

                        </div>
                        <div className="dashboard-upper">
                            <div className="country-table">
                                <div style={{ display: "flex", flexDirection: "row", borderBottom: "1px solid silver", height: "60px", alignItems: "center" }}>
                                    <img src={americanflag} alt="" style={{ width: "10%" }} />
                                    <div style={{ display: "flex", flexDirection: "column", width: "30%", marginLeft: "10px" }}>
                                        <b style={{ color: "silver" }}>City :</b>
                                        <label htmlFor="">Mumbai</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Sales :</b>
                                        <label htmlFor="">2,500</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Value :</b>
                                        <label htmlFor="">$25,000</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Bounce :</b>
                                        <label htmlFor="">25.5%</label>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", borderBottom: "1px solid silver", height: "70px", alignItems: "center" }}>
                                    <img src={germanFlag} alt="" style={{ width: "10%" }} />
                                    <div style={{ display: "flex", flexDirection: "column", width: "30%", marginLeft: "10px" }}>
                                        <b style={{ color: "silver" }}>City :</b>
                                        <label htmlFor="">Delhi</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Sales :</b>
                                        <label htmlFor="">2,500</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Value :</b>
                                        <label htmlFor="">$25,000</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Bounce :</b>
                                        <label htmlFor="">25.5%</label>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", borderBottom: "1px solid silver", height: "70px", alignItems: "center" }}>
                                    <img src={englandFlag} alt="" style={{ width: "10%" }} />
                                    <div style={{ display: "flex", flexDirection: "column", width: "30%", marginLeft: "10px" }}>
                                        <b style={{ color: "silver" }}>City :</b>
                                        <label htmlFor="">Pune</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Sales :</b>
                                        <label htmlFor="">2,500</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Value :</b>
                                        <label htmlFor="">$25,000</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Bounce :</b>
                                        <label htmlFor="">25.5%</label>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", height: "70px", alignItems: "center" }}>
                                    <img src={franceFlag} alt="" style={{ width: "10%" }} />
                                    <div style={{ display: "flex", flexDirection: "column", width: "30%", marginLeft: "10px" }}>
                                        <b style={{ color: "silver" }}>City :</b>
                                        <label htmlFor="">Noida</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Sales :</b>
                                        <label htmlFor="">2,500</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Value :</b>
                                        <label htmlFor="">$25,000</label>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
                                        <b style={{ color: "silver" }}>Bounce :</b>
                                        <label htmlFor="">25.5%</label>
                                    </div>
                                </div>
                            </div>

                            <div className="country-map" onMouseMove={handleMouseMove}>
                                <ComposableMap
                                    style={{
                                        width: "100%",
                                        margin: "0px",
                                        padding: "0px",
                                        height: "300px"
                                    }}
                                >
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) =>
                                            geographies.map((geo) => (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    onMouseEnter={() => handleMouseEnter(geo)}
                                                    onMouseLeave={() => setTooltipContent("")}
                                                    style={{
                                                        default: { fill: "#D6D6DA", outline: "none" },
                                                        hover: { fill: "#F53", outline: "none" },
                                                        pressed: { fill: "#E42", outline: "none" },
                                                    }}
                                                />
                                            ))
                                        }
                                    </Geographies>
                                </ComposableMap>
                            </div>
                        </div>
                    </div> */}

                    {/* <div className="card middle-card">
                        <div className="card first-card">
                            <div className="card graph-card">
                                <ResponsiveContainer width={"100%"} height={200}>
                                    <LineChart data={data} margin={{ top: 20 }}>
                                        <XAxis dataKey="name" padding={{ left: 30, right: 30 }}
                                            tick={{ fill: "white", fontSize: 12 }} />
                                        <YAxis tick={{ fill: "white", fontSize: 12 }} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="pv"
                                            stroke="white"
                                        >
                                            <LabelList position="top" offset={200} />
                                        </Line>
                                        <Line type="monotone" dataKey="uv" stroke="#b9b736">
                                            <LabelList position="top" offset={200} />
                                        </Line>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div>
                                <b>Daily Bookings</b>
                            </div>
                        </div>

                        <div className="card second-card">
                            <div className="card graph-card1">
                                <ResponsiveContainer width={"100%"} height={200}>
                                    <LineChart data={data1} margin={{ top: 20 }}>
                                        <XAxis dataKey="name" padding={{ left: 30, right: 30 }}
                                            tick={{ fill: "white", fontSize: 12 }} />
                                        <YAxis tick={{ fill: "white", fontSize: 12 }} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="pv"
                                            stroke="white"
                                        >
                                            <LabelList position="top" offset={200} />
                                        </Line>
                                        <Line type="monotone" dataKey="uv" stroke="blue">
                                            <LabelList position="top" offset={200} />
                                        </Line>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div>
                                <b>Daily Manifest</b>
                            </div>
                        </div>

                        <div className="card third-card">
                            <div className="card graph-card2">
                                <ResponsiveContainer width={"100%"} height={200}>
                                    <LineChart data={data} margin={{ top: 20 }}>
                                        <XAxis dataKey="name" padding={{ left: 30, right: 30 }}
                                            tick={{ fill: "white", fontSize: 12 }} />
                                        <YAxis tick={{ fill: "white", fontSize: 12 }} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="pv"
                                            stroke="black"
                                        >
                                            <LabelList position="top" offset={200} />
                                        </Line>
                                        <Line type="monotone" dataKey="uv" stroke="white">
                                            <LabelList position="top" offset={200} />
                                        </Line>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div>
                                <b>Daily Deliveries</b>
                            </div>
                        </div>
                    </div> */}
                </div>
                <Footer />
            </div>
        </>
    )
}


export default Dashboard;