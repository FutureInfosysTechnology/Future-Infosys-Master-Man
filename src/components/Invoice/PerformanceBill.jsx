import React, { useState } from 'react';
import Modal from 'react-modal';


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
                        <div className="card left-card" >
                            <div className="section-title">SHIPPER</div>
                            <form action="" style={{margin:"0px", padding:"0px"}}>
                                <div className="fields2">
                                    <div className="input-field1">
                                        <label htmlFor="">Shipper</label>
                                        <select value="">
                                            <option value="" disabled>Select Shipper</option>
                                            <option value=""></option>
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Shipper Address</label>
                                        <input type="text" placeholder='Shipper Address' />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Shipper Address</label>
                                        <input type="text" placeholder='Shipper Address' />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Shipper City</label>
                                        <select value="">
                                            <option value="" disabled>Select City</option>
                                            <option value=""></option>
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Pin Code</label>
                                        <input type="tel" maxLength={6} placeholder='Pin Code' />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Shipper State</label>
                                        <select value="">
                                            <option value="" disabled>Select State</option>
                                            <option value=""></option>
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Aadhar No</label>
                                        <input type="tel" maxLength={12} placeholder='Aadhar No' />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">GST No</label>
                                        <input type="text" maxLength={16} placeholder='GST No' />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="card right-card">
                            <div className="section-title">RECEIVER</div>
                            <form action="" style={{margin:"0px", padding:"0px"}}>
                                <div className="fields2">
                                    <div className="input-field1">
                                        <label htmlFor="">Receiver</label>
                                        <select value="">
                                            <option value="" disabled>Select Receiver</option>
                                            <option value=""></option>
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Receiver Address</label>
                                        <input type="text" placeholder='Receiver Address' />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Receiver Address</label>
                                        <input type="text" placeholder='Receiver Address' />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Receiver City</label>
                                        <select value="">
                                            <option value="" disabled>Select City</option>
                                            <option value=""></option>
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Pin Code</label>
                                        <input type="tel" maxLength={6} placeholder='Pin Code' />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Receiver State</label>
                                        <select value="">
                                            <option value="" disabled>Select State</option>
                                            <option value=""></option>
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Mobile No</label>
                                        <input type="tel" maxLength={10} placeholder='Mobile No' />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">GST No</label>
                                        <input type="text" maxLength={16} placeholder='GST No' />
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>

                    <div className="card">
                        <div className="section-title">Courier Details</div>
                        <form style={{ margin: "0px", padding: "0px" }}>
                            <div className="fields2">
                                <div className="input-field3">
                                    <label htmlFor="">Invoice No</label>
                                    <input type="tel" placeholder='Invoice No' />
                                </div>
                                <div className="input-field3">
                                    <label htmlFor="">Invoice Date</label>
                                    <input type="date" />
                                </div>

                                <div className="input-field3">
                                    <label htmlFor="">Docket No</label>
                                    <input type="text" placeholder='Docket No' />
                                </div>

                                <div className="input-field3">
                                    <label htmlFor="">Country of Origin</label>
                                    <select value="">
                                        <option value="" disabled>Select Country</option>
                                        <option value="">India</option>
                                    </select>
                                </div>

                                <div className="input-field3">
                                    <label htmlFor="">Final Destination</label>
                                    <select value="">
                                        <option value="" disabled>Select Destination</option>
                                        <option value=""></option>
                                    </select>
                                </div>

                                <div className="input-field3">
                                    <label htmlFor="">No of Boxes</label>
                                    <input type="tel" placeholder='No of Boxes' />
                                </div>

                                <div className="input-field3">
                                    <label htmlFor="">Total Weight</label>
                                    <input type="tel" placeholder='Total Weight' />
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