import React, { useState } from "react";
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'react-toggle/style.css';

function ViewDrs() {

    const [zones, setZones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBoy, setSelectedBoy] = useState(null);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        toDate: today,
        fromDate: firstDayOfMonth,
    })
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    const deliveryBoyOptions = [
        { value: "vivek", label: "Vivek" },
        { value: "suresh", label: "Suresh" },
        { value: "mahesh", label: "Mahesh" }
    ];
    const rowsPerPage = 10;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = zones.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(zones.length / rowsPerPage);


    const handleDelete = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedZones = zones.filter((_, i) => i !== index);
                setZones(updatedZones);
                Swal.fire(
                    'Deleted!',
                    'Your zone has been deleted.',
                    'success'
                );
            }
        });
    };



    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    return (
        <>

            <div className="container1">
                <form action="">
                    <div className="fields2">
                        <div className="input-field3">
                            <label htmlFor="">From Date</label>
                            <DatePicker
                                selected={formData.fromDate}
                                onChange={(date) => handleDateChange(date, "fromDate")}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                            />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">To Date</label>
                            <DatePicker
                                selected={formData.toDate}
                                onChange={(date) => handleDateChange(date, "toDate")}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                            />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Delivery Boy</label>
                            <Select
                                options={deliveryBoyOptions}
                                value={selectedBoy}
                                onChange={(option) => setSelectedBoy(option)}
                                placeholder="Select Delivery Boy"
                                isSearchable
                                classNamePrefix="blue-selectbooking"
                                className="blue-selectbooking"
                                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                                styles={{
                                    placeholder: (base) => ({
                                        ...base,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }),
                                    menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                                }}
                            />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">DRS No</label>
                            <input type="tel" placeholder="Enter DRS No" />
                        </div>

                        <div className="bottom-buttons" style={{ marginTop: "18px", marginLeft: "11px" }}>
                            <button className="ok-btn">Search</button>
                            <button className="ok-btn">Download</button>
                        </div>
                    </div>


                </form>

                {/* <div className="addNew">
                    <div className="search-input">
                        <input className="add-input" type="text" placeholder="search" />
                        <button type="submit" title="search">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div> */}

                <div className='table-container'>
                    <table className='table table-bordered table-sm'>
                        <thead className='table-info body-bordered table-sm'>
                            <tr>
                                <th scope="col">Sr.No</th>
                                <th scope="col">Drs No</th>
                                <th scope="col">Drs Date</th>
                                <th scope="col">Employee Name</th>
                                <th scope="col">Employee Contact No</th>
                                <th scope="col">Area</th>
                                <th scope="col">Total Awb</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>

                            {currentRows.map((zone, index) => (
                                <tr key={zone.id}>
                                    <td>{zone.id}</td>
                                    <td>{zone.code}</td>
                                    <td>{zone.code}</td>
                                    <td>{zone.name}</td>
                                    <td>{zone.name}</td>
                                    <td>{zone.name}</td>
                                    <td>{zone.name}</td>
                                    <td>
                                        <button className="ok-btn" style={{ marginRight: "5px" }}>Download</button>
                                        <button className='edit-btn'>
                                            <i className='bi bi-pen'></i></button>
                                        <button onClick={() => handleDelete(index)} className='edit-btn'>
                                            <i className='bi bi-trash'></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                        {'<'}
                    </button>
                    <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                    <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                        {'>'}
                    </button>
                </div>

            </div>
        </>
    );
};

export default ViewDrs;