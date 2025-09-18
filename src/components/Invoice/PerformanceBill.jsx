import React, { useState } from 'react';
import Modal from 'react-modal';
import "./permonce.css"

function PerformanceBill() {

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    // const currentRows = zones.slice(indexOfFirstRow, indexOfLastRow);

    // const totalPages = Math.ceil(zones.length / rowsPerPage);

    // const handlePreviousPage = () => {
    //     if (currentPage > 1) setCurrentPage(currentPage - 1);
    // };

    // const handleNextPage = () => {
    //     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    // };

    return (
        <>

            <div className="body">
                <div className="container1">

                    <div className='container-2'>

                        <div className="card left-card">
                            <div className="section-title">SHIPPER</div>
                            <form>
                                <div className="fields2 row mx-0">
                                    <div className="input-field col-md-6">
                                        <label className="form-label">Shipper</label>
                                        <select value="" className="form-control">
                                            <option value="" disabled>Select Shipper</option>
                                            <option value="" ></option>
                                        </select>
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Shipper Address</label>
                                        <input type="text" className="form-control" placeholder="Shipper Address" />
                                    </div>
                                    <div className="input-field col-md-6">
                                        <label className="form-label">Shipper Address</label>
                                        <input type="text" className="form-control" placeholder="Shipper Address" />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Pin Code</label>
                                        <input type="tel" className="form-control" maxLength={6} placeholder="Pin Code" />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Shipper City</label>
                                        <select value="" className="form-control">
                                            <option value="" disabled>Select City</option>
                                        </select>
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Aadhar No</label>
                                        <input type="tel" className="form-control" maxLength={12} placeholder="Aadhar No" />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Shipper State</label>
                                        <select value="" className="form-control">
                                            <option value="" disabled>Select State</option>
                                        </select>
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">GST No</label>
                                        <input type="text" className="form-control" maxLength={16} placeholder="GST No" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="card right-card">
                            <div className="section-title">RECEIVER</div>
                            <form action="" style={{ margin: "0px", padding: "0px" }}>
                                <div className="fields2 row mx-0">
                                    <div className="input-field col-md-6">
                                        <label className="form-label">Receiver</label>
                                        <select value="" className="form-control">
                                            <option value="" disabled>Select Receiver</option>
                                            <option value=""></option>
                                        </select>
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Receiver Address</label>
                                        <input type="text" className="form-control" placeholder='Receiver Address' />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Receiver Address</label>
                                        <input type="text" className="form-control" placeholder='Receiver Address' />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Receiver City</label>
                                        <select value="" className="form-control">
                                            <option value="" disabled>Select City</option>
                                            <option value=""></option>
                                        </select>
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Pin Code</label>
                                        <input type="tel" className="form-control" maxLength={6} placeholder='Pin Code' />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Receiver State</label>
                                        <select value="" className="form-control">
                                            <option value="" disabled>Select State</option>
                                            <option value=""></option>
                                        </select>
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Mobile No</label>
                                        <input type="tel" className="form-control" maxLength={10} placeholder='Mobile No' />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">GST No</label>
                                        <input type="text" className="form-control" maxLength={16} placeholder='GST No' />
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>

                    <div className="card">
                        <div className="section-title">Courier Details</div>
                        <form style={{ margin: "0px", padding: "0px" }}>
                            <div className="row g-3 mx-0">
                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">Invoice No</label>
                                    <input type="tel" className="form-control" placeholder="Invoice No" />
                                </div>

                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">Invoice Date</label>
                                    <input type="date" className="form-control" />
                                </div>

                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">Docket No</label>
                                    <input type="text" className="form-control" placeholder="Docket No" />
                                </div>

                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">Country of Origin</label>
                                    <select value="" className="form-control" style={{ height: '35px' }}>
                                        <option value="" disabled>Select Country</option>
                                        <option>India</option>
                                    </select>
                                </div>

                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">Final Destination</label>
                                    <select value="" className="form-control" style={{ height: '35px' }}>
                                        <option value="" disabled>Select Destination</option>
                                    </select>
                                </div>

                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">No of Boxes</label>
                                    <input type="tel" className="form-control" placeholder="No of Boxes" />
                                </div>

                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">Total Weight</label>
                                    <input type="tel" className="form-control" placeholder="Total Weight" />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className='table-container' style={{ margin: "0px" }}>
                        <table className='table table-bordered table-sm'>
                            <thead className='table-info table-sm'>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Desciption Of Goods</th>
                                    <th scope="col">HSN Code</th>
                                    <th scope="col">QTY</th>
                                    <th scope="col">Rate</th>
                                    <th scope="col">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* <div className="pagination">
                        <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            {'<'}
                        </button>
                        <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                        <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            {'>'}
                        </button>
                    </div> */}

                    <div className="bottom-buttons">
                        <button className='ok-btn'>Save</button>
                        <button className='ok-btn'>Cancel</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PerformanceBill;