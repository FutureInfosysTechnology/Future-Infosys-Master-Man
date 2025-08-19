
import React, { useEffect, useState } from 'react';
import Footer from '../../Components-2/Footer';
import '../Tabs/tabs.css';
import Countrylist from '../CountryMast/Countrylist';
import Statemast from '../StateMast/Statemast';
import ZoneMaster from '../Zonemaster/Zonemaster';

const InternationalCityList = () => {


    return (
        <>
            <div className="main-body">
                <div className="container-5">
                    <input type="radio" name="slider" id="zone"></input>
                    <input type="radio" name="slider" id="multiple"></input>
                    <input type="radio" name="slider" id="state"></input>
                    <input type="radio" name="slider" id="country"></input>
                    <nav>
                        <label for="zone" className="zone">Zone Master</label>
                        <label for="multiple" className="multiple">Multiple City</label>
                        <label for="state" className="state">State Master</label>
                        <label for="country" className="country">Country Master</label>

                        <div className="slider"></div>
                    </nav>
                    <section>
                        <div className="content content-1">
                            <ZoneMaster />
                        </div>

                        <div className="content content-2">
                            <div className="body">
                                <div className="container1">

                                    <form action="#">
                                        <div className="form first">
                                            <div className="details personal">
                                                <div className="fields">

                                                    <div className="input-field">
                                                        <label htmlFor="">State Code </label>
                                                        <input type="text" placeholder="State_Code" />
                                                    </div>

                                                    <div className="input-field">
                                                        <label htmlFor="">State Name</label>
                                                        <input type="text" placeholder="State_Name" />
                                                    </div>

                                                    <div className="input-field">
                                                        <label htmlFor="">Country Name</label>
                                                        <select>
                                                            <option disabled value="">Select Country</option>
                                                            <option>India</option>
                                                        </select>
                                                    </div>

                                                    <div className="input-field2"><label htmlFor="">Find Zone Name</label></div>
                                                    <div className="input-field2">

                                                        <input type="text" placeholder="Find State Name" />
                                                        <button className="find-btn" type="submit" title="Find">Submit</button>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="bottom-buttons">
                                                <button className="ok-btn" onClick="">Ok</button>
                                                <button className="ok-btn" onClick="">Cancel</button>
                                            </div>

                                        </div>
                                    </form>

                                    <div className='table-container'>
                                        <table className='table table-bordered table-sm'>
                                            <thead className='table-info body-bordered table-sm'>
                                                <tr>
                                                    <th scope="col">Sr.No</th>
                                                    <th scope="col">State_Code</th>
                                                    <th scope="col">State_Name</th>
                                                    <th scope="col">Country_Name</th>
                                                    <th scope="col">Edit</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className='table-body'>
                                            
                                                    <tr>
                                                        <td>1</td>
                                                        <td>1</td>
                                                        <td>1</td>
                                                        <td>1</td>
                                                        <td>
                                                            <button>Edit</button>
                                                        </td>
                                                        <td>
                                                            <button>Delete</button>
                                                        </td>
                                                    </tr>
                                        
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="pagination">
                                        <button> {'<'} </button>
                                        <button> {'>'} </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="content content-3">
                            <Statemast />
                        </div>

                        <div className="content content-4">
                            <Countrylist />
                        </div>
                    </section>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default InternationalCityList;

