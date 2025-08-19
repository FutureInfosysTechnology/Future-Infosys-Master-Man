import React from 'react'

function ViewQuery() {
    return (
        <>

            <div className="body">
                <div className="container1" style={{ padding: "20px" }}>

                    <div className="addNew">
                        <div className="search-input">
                            <input className="add-input" type="text" placeholder="search" />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className='table table-bordered'>
                            <thead className='table-info'>
                                <tr>
                                    <th>Sr No</th>
                                    <th>Complaint No</th>
                                    <th>Date</th>
                                    <th>Docket No</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody className='table-body'>
                                <tr>
                                    <td>1</td>
                                    <td>52</td>
                                    <td>25/10/2024</td>
                                    <td>1234</td>
                                    <td>a</td>
                                    <td>Solved</td>
                                    <td>
                                        <button className='ok-btn' style={{ height: "30px", width: "50px" }}>
                                            <i className='bi bi-trash' style={{ fontSize: "20px" }}></i>
                                        </button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>2</td>
                                    <td>52</td>
                                    <td>25/10/2024</td>
                                    <td>1234</td>
                                    <td>a</td>
                                    <td>Solved</td>
                                    <td>
                                        <button className='ok-btn' style={{ height: "30px", width: "50px" }}>
                                            <i className='bi bi-trash' style={{ fontSize: "20px" }}></i>
                                        </button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>3</td>
                                    <td>52</td>
                                    <td>25/10/2024</td>
                                    <td>1234</td>
                                    <td>a</td>
                                    <td>Solved</td>
                                    <td>
                                        <button className='ok-btn' style={{ height: "30px", width: "50px" }}>
                                            <i className='bi bi-trash' style={{ fontSize: "20px" }}></i>
                                        </button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>4</td>
                                    <td>52</td>
                                    <td>25/10/2024</td>
                                    <td>1234</td>
                                    <td>a</td>
                                    <td>Solved</td>
                                    <td>
                                        <button className='ok-btn' style={{ height: "30px", width: "50px" }}>
                                            <i className='bi bi-trash' style={{ fontSize: "20px" }}></i>
                                        </button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>5</td>
                                    <td>52</td>
                                    <td>25/10/2024</td>
                                    <td>1234</td>
                                    <td>a</td>
                                    <td>Solved</td>
                                    <td>
                                        <button className='ok-btn' style={{ height: "30px", width: "50px" }}>
                                            <i className='bi bi-trash' style={{ fontSize: "20px" }}></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

        </>
    )
}

export default ViewQuery;