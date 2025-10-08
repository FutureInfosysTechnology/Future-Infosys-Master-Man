import React, { useState } from 'react';
import Modal from 'react-modal';
import Header from '../../../Components-2/Header/Header';
import Sidebar1 from '../../../Components-2/Sidebar1';
import Footer from '../../../Components-2/Footer';




function RegionMaster() {

    const [modalIsOpen, setModalIsOpen] = useState(false);


    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id='main-body'>
                <div className='body'>
                    <div className="container1">
                        <header style={{ color: "black", fontSize: "18px", fontWeight: "600" }}>Region Master</header>

                        <div className="addNew">
                            <div>
                                <button className='add-btn' onClick={() => setModalIsOpen(true)}>
                                    <i className="bi bi-plus-lg"></i>
                                    <span>ADD NEW</span>
                                </button>

                                <div className="dropdown">
                                    <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                                    <div className="dropdown-content">
                                        <button >Export to Excel</button>
                                        <button >Export to PDF</button>
                                    </div>
                                </div>
                            </div>

                            <div className="search-input">
                                <input className="add-input" type="text" placeholder="search" />
                                <button type="submit" title="search">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>

                        <div className='table-container'>
                            <table className='table table-bordered table-sm' >
                                <thead className='table-info body-bordered table-sm'>
                                    <tr>
                                        <th scope="col">Actions</th>
                                        <th scope="col">Sr.No</th>
                                        <th scope="col">Region Code</th>
                                        <th scope="col">Region Name</th>
                                        
                                    </tr>
                                </thead>
                                <tbody className='table-body'>

                                </tbody>
                            </table>
                        </div>

                        <div className="pagination">
                            <button className="ok-btn" >
                                {'<'}
                            </button>
                            <span style={{ color: "#333", padding: "5px" }}>Page of </span>
                            <button className="ok-btn" >
                                {'>'}
                            </button>
                        </div>


                        <Modal id="modal" overlayClassName="custom-overlay" isOpen={modalIsOpen}
                            className="custom-modal-mode" contentLabel='Modal'>
                            <div className='custom-modal-content'>
                                <div className="header-tittle">
                                    <header>Region Master</header>
                                </div>

                                <div className='container2'>
                                    <form>
                                        <div className="fields2">
                                            <div className="input-field">
                                                <label htmlFor="">Region Code </label>
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <input style={{
                                                        width: "150px",
                                                        borderBottomRightRadius: "0px",
                                                        borderTopRightRadius: "0px",
                                                        borderRightColor: "transparent"
                                                    }}
                                                        type='tel'
                                                        placeholder='Region Code' required />
                                                    <button className="ok-btn"
                                                        style={{
                                                            height: "40px",
                                                            fontSize: "10px", padding: "5px",
                                                            borderTopLeftRadius: "0px",
                                                            borderBottomLeftRadius: "0px"
                                                        }}
                                                    >Generate Code</button>
                                                </div>
                                            </div>

                                            <div className="input-field1">
                                                <label htmlFor="">Region Name</label>
                                                <input type='text'
                                                    placeholder='Region Name' required />
                                            </div>
                                        </div>

                                        <div className='bottom-buttons'>
                                            <button type='submit' className='ok-btn'>Save</button>
                                            <button onClick={() => setModalIsOpen(false)} className='ok-btn'>Close</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Modal >

                    </div >
                </div>
                <Footer />
            </div>
        </>
    )
}

export default RegionMaster;