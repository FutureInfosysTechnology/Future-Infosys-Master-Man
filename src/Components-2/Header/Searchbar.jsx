import React, { useState } from "react";
import './searchbar.css';
import '../Dashboard/Mainstyle.css';
import Modal from 'react-modal';
import axios from 'axios';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getApi, postApi } from "../../components/Admin Master/Area Control/Zonemaster/ServicesApi";


function Searchbar() {

    const [searchValue, setSearchValue] = useState('');
    const [pincodeData, setPincodeData] = useState([]);
    const [searchTrackingValue, setSearchTrackingValue] = useState('');
    const [trackingData, setTrackingData] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [showImage, setShowImage] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const inputValue = e.target.value.replace(/\D/g, '');
        const sanitizedValue = inputValue.slice(0, 6);
        setSearchValue(sanitizedValue);
        setError('');
        setPincodeData([]);
    };

    const fetchData = async (e) => {
        e.preventDefault();
        if (searchValue.length !== 6) {
            alert('Please enter a 6-digit PIN code.');
            return;
        }

        try {
            const response = await axios.get(`https://speedlogisticsindia.com/pincodeFinder/PincodedataResult?Pincode=${searchValue}`);
            if (response.status === 200) {
                const data = response.data;
                if (Array.isArray(data.Data)) {
                    setModalIsOpen(true);
                    setPincodeData(data.Data);
                    setError('');
                } else {
                    setPincodeData([]);
                    setError('Invalid data format received.');
                }
            } else {
                setError('Failed to fetch data. Please try again.');
            }
        } catch (error) {
            setError('Failed to fetch data. Please check your internet connection.');
        }
    };

    const statusToStep = {
        'Shipped': 1,
        'In Transit': 2,
        'Delivered': 3,
    };

    const handleButtonClick = () => {
        setShowImage(!showImage);
    };

    const handleInputTrackingChange = (e) => {
        const inputValue = e.target.value.slice(0, 200);
        setSearchTrackingValue(inputValue);
        setError('');
        setTrackingData([]);
    };

    const fetchTrackingData = async (e) => {
        e.preventDefault();

        try {
            const res = await getApi(`/Master/getTrackingData?DocketNo=${searchTrackingValue}`);
            if (res.status === 1 && res.Data) {
                setModalIsOpen1(true);
                const updatedData = res.Data.map((item) => {
                    const imageId = item.DocketNo;
                    return {
                        ...item,
                        ImageLink: `https://jdcargo.co.in/PODImg/POD_Image/${imageId}.jpg`,
                    };
                });

                setTrackingData(updatedData);
                setError('');

                if (updatedData.length > 0) {
                    const status = updatedData[0].Status;
                    setCurrentStep(statusToStep[status] || 1);
                }
            } else {
                setTrackingData([]);
                setError('Docket Not Found');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(
                error.response?.data?.message || 'Failed to fetch data. Please check your internet connection or try again later.'
            );
        }
    };


    return (
        <div className="search-bar">
            <form action="#" className="search-form d-flex align-items-center" method="POST">
                <input type="text"
                    name="query"
                    placeholder="Enter Tracking Number"
                    value={searchTrackingValue} onChange={handleInputTrackingChange} />
                <button type="submit" title="search" onClick={(e) => fetchTrackingData(e)}>
                    <i className="bi bi-search"></i>
                </button>

                <input type="text"
                    name="query"
                    placeholder="Enter 6-digit pincode"
                    value={searchValue} onChange={handleInputChange} />
                <button type="submit" title="search" onClick={(e) => fetchData(e)}>
                    <i className="bi bi-search"></i>
                </button>
                
            </form>

            <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                className="custom-modal-receiver" contentLabel="Modal"
                style={{
                    content: {
                        top: '50%',             // Center vertically
                        left: '50%',
                        whiteSpace: "nowrap"
                    },
                }}>
                <div className="custom-modal-content">
                    <div className="header-tittle" style={{ display: "flex", flexDirection: "row" }}>
                        <header style={{ width: "95%", textAlign: "center" }}>Pin Code Finder</header>
                        <button className="ok-btn" style={{ width: "5%", height: "100%", backgroundColor: "red" }}
                            onClick={() => setModalIsOpen(false)}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>


                    <div className='container2'>
                        <div className="table-container">
                            <table className=" table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">Sr.No</th>
                                        <th scope="col">Pincode</th>
                                        <th scope="col">Ref No</th>
                                        <th scope="col">City Name</th>
                                        <th scope="col">Destination_Name</th>
                                        <th scope="col">State_Name</th>
                                        <th scope="col">Remote</th>
                                        <th scope="col">Post/Oda</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pincodeData.map((pincode, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{pincode.Pincode}</td>
                                            <td>{pincode.Ref_No}</td>
                                            <td>{pincode.Destination_City}</td>
                                            <td>{pincode.Destination_Name}</td>
                                            <td>{pincode.State}</td>
                                            <td>{pincode.Remote}</td>
                                            <td>{pincode.oda_type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal >

            <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen1}
                className="custom-modal" contentLabel="Modal" style={{
                    content: {
                        top: '55%',             // Center vertically
                        left: '50%',
                        whiteSpace: "nowrap",
                        height: "90%",
                        width: "100%"
                    },
                }}>
                <div className="custom-modal-content">
                    <div className="header-tittle" style={{ display: "flex", flexDirection: "row" }}>
                        <header className="" style={{ width: "95%", textAlign: "center" }}>Tracking Details</header>
                        <button className="ok-btn " style={{ width: "60px", height: "100%", backgroundColor: "red" }}
                            onClick={() => setModalIsOpen1(false)}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div className='container2'>
                        {/* <span className='BLuedarttracking'><span> JD Cargo - Tracking Details</span></span> */}
                        {trackingData.length > 0 ? (
                            trackingData.map((record, index) => (
                                <div key={index} className="table-container">
                                    <table className="table table-bordered table-sm mb-4">
                                        <thead>
                                            <tr>
                                                <th>Waybill No</th>
                                                <th>Invoice No</th>
                                                <th>Booking Date</th>
                                                <th>Status</th>
                                                <th>Date of Delivery</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{record.DocketNo}</td>
                                                <td>{record.InvoiceNo}</td>
                                                <td>{record.BookDate}</td>
                                                <td>{record.Status}</td>
                                                <td>{record.DelvDT}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        ) : (
                            <div>No tracking data available.</div>
                        )}

                        <div className="steps-container">
                            {[1, 2, 3].map(number => (
                                <span key={number} className="step-container">
                                    {number > 1 && <div className={`line ${number <= currentStep ? 'active' : ''}`}></div>}
                                    <span className={`step-circle ${number <= currentStep ? 'active' : ''}`}>
                                        {number}
                                    </span>
                                    <span className="step-label">{number === 1 ? 'Shipped' : number === 2 ? 'In Transit' : 'Delivered'}</span>
                                </span>
                            ))}
                            <div className="progress-bar-container">
                                <span
                                    className="progress-indicator"
                                    style={{ width: `${((currentStep - 1) / 2) * 72}%` }}
                                ></span>
                            </div>
                        </div>

                        <Tabs defaultActiveKey="details" style={{ width: '100%' }}>
                            <Tab eventKey="details" title="Shipment Details">
                                {trackingData.length > 0 ? (
                                    trackingData.map((record, index) => (
                                        <div key={index} className="shadow">
                                            <div className="shipment-details">
                                                <div className="detail-row">
                                                    <span className="detail-label">Waybill No:</span>
                                                    <span className="detail-value">{record.DocketNo}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">Book Date:</span>
                                                    <span className="detail-value">{record.BookDate}</span>
                                                </div>

                                                <div className="detail-row">
                                                    <span className="detail-label">Origin City:</span>
                                                    <span className="detail-value">{record.OriginCity}</span>
                                                </div>

                                                <div className="detail-row">
                                                    <span className="detail-label">Receiver Name:</span>
                                                    <span className="detail-value">{record.Consignee_Name}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">Destination:</span>
                                                    <span className="detail-value">{record.DestinationCity}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">Status:</span>
                                                    <span className="detail-value">{record.Status}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">Qty:</span>
                                                    <span className="detail-value">{record.Qty}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">EWaybill:</span>
                                                    <span className="detail-value">{record.EWaybill}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">InvoiceNo:</span>
                                                    <span className="detail-value">{record.InvoiceNo}</span>
                                                </div>
                                                <div>

                                                    <button className="btn btn-success" onClick={handleButtonClick}>
                                                        {showImage ? 'Hide Image' : 'Pod Image'}
                                                    </button>
                                                    {showImage && (
                                                        <div className="image-container mt-2">

                                                            {trackingData.length > 0 && (
                                                                <img src={trackingData[0].ImageLink} alt="Tracking" className="img-fluid" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No shipment details available.</div>
                                )}
                            </Tab>

                            <Tab eventKey="status" title="Status and Scans">
                                {trackingData.length > 0 ? (
                                    trackingData.map((record, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                padding: "10px",
                                                margin: 0,
                                                backgroundColor: "white"
                                            }}
                                        >
                                            <b style={{ color: "black", paddingLeft: '10px' }}>Status and Scans</b>
                                            <div
                                                className="scrollable-table"
                                                style={{
                                                    width: '100%',
                                                    overflowX: 'auto',
                                                    margin: 0,
                                                    padding: 0,
                                                }}
                                            >
                                                <table
                                                    className="table table-bordered table-sm"
                                                    style={{
                                                        width: '100%',
                                                        tableLayout: 'fixed', // ensures cells fill evenly
                                                    }}
                                                >
                                                    <thead className="background">
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Time</th>
                                                            <th>Location</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {record.StatusEntry && record.StatusEntry.length > 0 ? (
                                                            record.StatusEntry.map((entry, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{entry.DelvDt}</td>
                                                                    <td>{entry.DelvTime}</td>
                                                                    <td>{entry.Destination_name}</td>
                                                                    <td>{entry.Status}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={4}>No scans available.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No status and scans available.</div>
                                )}
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </Modal >

        </div >
    )
}

export default Searchbar;