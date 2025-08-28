import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'react-toggle/style.css';
import { use } from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


function ViewDrs() {
    const [data, setData] = useState([
        { id: 1, code: 'DRS001', name: 'Vivek' },
        { id: 2, code: 'DRS002', name: 'Suresh' },
        { id: 3, code: 'DRS003', name: 'Mahesh' },
    ]);
    const [openRow, setOpenRow] = useState(null);
    const [zones, setZones] = useState(data);
    const [search, setSearch] = useState("");
    useEffect(() => {
        if (search === "") {
            setZones(data);
        } else {
            setZones(
                data.filter(
                    (item) =>
                        item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.code.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, data]);

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
    const handleOpenDrsPrint = (zone) => {
        const id = zone.id;
        const code = zone.code;
        const name = zone.name;
        const url = `/drsrunsheet?manifestNo=${encodeURIComponent(id)}&sumQty=${encodeURIComponent(code)}&sumActualWt=${encodeURIComponent(name)}`;
        const newWindow = window.open(
            url,
            '_blank', 'width=900,height=600,fullscreen=yes'
        );

        if (newWindow) {
            newWindow.focus();
        }
    };

    return (
        <>

            <div className="container1">
                <form action="">
                    <div className="fields2" style={{ overflow: "visible" }}>
                        <div className="input-field3">
                            <label htmlFor="">From Date</label>
                            <DatePicker
                                portalId="root-portal"
                                selected={formData.fromDate}
                                onChange={(date) => handleDateChange(date, "fromDate")}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                            />

                        </div>

                        <div className="input-field3" style={{ overflow: "visible" }}>
                            <label htmlFor="">To Date</label>
                            <DatePicker
                                portalId="root-portal"
                                selected={formData.toDate}
                                onChange={(date) => handleDateChange(date, "toDate")}
                                dateFormat="dd/MM/yyyy"
                                className="form-control form-control-sm"
                                popperContainer={({ children }) => (
                                    <div style={{ zIndex: 9999 }}>{children}</div>
                                )}
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
                            <input type="tel" placeholder="Enter DRS No" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                                <th scope="col">Actions</th>
                                <th scope="col">Sr.No</th>
                                <th scope="col">Drs No</th>
                                <th scope="col">Drs Date</th>
                                <th scope="col">Employee Name</th>
                                <th scope="col">Employee Contact No</th>
                                <th scope="col">Area</th>
                                <th scope="col">Total Awb</th>

                            </tr>
                        </thead>
                        <tbody className='table-body'>

                            {currentRows.map((zone, index) => (
                                <tr key={zone.id} style={{ fontSize: "12px", position: "relative" }}>
                                    <td>
                                        <PiDotsThreeOutlineVerticalFill
                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                            onClick={() =>
                                                setOpenRow(openRow === index ? null : index) // toggle only this row
                                            }
                                        />

                                        {openRow === index && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    flexDirection: "row",
                                                    position: "absolute",
                                                    alignItems: "center",
                                                    left: "80px",
                                                    top: "0px",
                                                    borderRadius: "10px",
                                                    backgroundColor: "white",
                                                    zIndex: "999999",
                                                    height: "30px",
                                                    width: "100px",
                                                    padding:"10px"
                                                }}
                                            >
                                                <button className='edit-btn' onClick={() => handleOpenDrsPrint(zone)}>
                                                <i className='bi bi-file-earmark-pdf-fill' style={{ fontSize: "18px" ,marginLeft:"20px"}}></i>
                                            </button>
                                            <button className='edit-btn' style={{ fontSize: "18px"}}>
                                                <i className='bi bi-pen'></i></button>
                                            <button className="edit-btn" onClick={() => handleDelete(index)}>
                                                <i className='bi bi-trash' style={{ fontSize: "18px" }}></i>
                                            </button>
                                               
                                            </div>
                                        )}
                                    </td>
                                    <td>{zone.id}</td>
                                    <td>{zone.code}</td>
                                    <td>{zone.code}</td>
                                    <td>{zone.name}</td>
                                    <td>{zone.name}</td>
                                    <td>{zone.name}</td>
                                    <td>{zone.name}</td>
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