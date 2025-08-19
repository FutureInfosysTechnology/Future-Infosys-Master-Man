import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { getApi } from "../Area Control/Zonemaster/ServicesApi";


function UpdateCustomerRate() {


    const [zones, setZones] = useState([]);
    const [getCustomer, setGetCustomer] = useState([]);  // To Get Customer Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);


    const rowsPerPage = 10;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = zones.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(zones.length / rowsPerPage);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi('/Master/getCustomer');
                setGetCustomer(Array.isArray(response.Data) ? response.Data : []);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;



    return (
        <div className="body">
            <div className="container1">

                <div className="addNew">
                    <button className='add-btn' onClick={() => { setModalIsOpen(true) }}>
                        <i className="bi bi-plus-lg"></i>
                        <span>ADD NEW</span>
                    </button>


                    <div className="search-input">
                        <label htmlFor="" style={{ marginLeft: "470px" }}></label>
                    </div>
                </div>

                <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                    style={{
                        content: {
                            top: '55%',
                            left: '55%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            height: '353px',
                            width: '55%',
                            borderRadius: '10px',
                            padding: "0px"
                        },
                    }}>
                    <div>

                        <div className="header-tittle">
                            <header>Update Customer Rate</header>
                        </div>

                        <div className='container2'>
                            <form>
                                <div className="fields2">

                                    <div className="input-field1">
                                        <label htmlFor="">Customer Name</label>
                                        <select value="">
                                            <option value="" disabled >Select Customer Name</option>
                                            {getCustomer.map((cust, index) => (
                                                <option value={cust.Customer_Code} key={index}>{cust.Customer_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">From Date</label>
                                        <input type="date" required />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">To Date</label>
                                        <input type="date" required />
                                    </div>

                                    <div className='bottom-buttons' style={{ marginTop: "18px", marginLeft: "25px" }}>
                                        <button type='submit' className='ok-btn'>Submit</button>
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>
                                </div>
                            </form>

                            <div className="search-input" style={{ display: "flex", justifyContent: "end" }}>
                                <input className="add-input" type="text" placeholder="search" />
                                <button type="submit" title="search">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                            <div className='table-container' style={{ padding: "10px" }}>
                                <table className='table table-bordered table-sm'>
                                    <thead className='table-info body-bordered table-sm'>
                                        <tr>
                                            <th scope="col">Sr.No</th>
                                            <th scope="col">Customer Name</th>
                                            <th scope="col">From Date</th>
                                            <th scope="col">To Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-body'>

                                        {currentRows.map((_, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td><input type="tel" /></td>
                                                <td><input type="tel" /></td>
                                                <td><input type="tel" /></td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </Modal >

            </div>
        </div>
    )
}

export default UpdateCustomerRate;