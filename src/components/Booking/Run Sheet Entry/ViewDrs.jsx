import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'react-toggle/style.css';
import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";

import { use } from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";


function ViewDrs() {
     const extractArray = (res) => {
        if (Array.isArray(res?.Data)) return res.Data;
        if (Array.isArray(res?.data)) return res.data;
        return [];
    };
    const navigate=useNavigate();
    const location=useLocation();
    const [data, setData] = useState([]);
    const [empData, setEmpData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openRow, setOpenRow] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [formData, setFormData] = useState({
        toDate: today,
        fromDate: firstDayOfMonth,
        empName:"",
        drsNo:"",
    })
    const fetchData = async (endpoint, params) => {
            try {
                const response = await getApi(endpoint, { params });
                console.log(response.data);
                const drsData = extractArray(response);
    
                if (drsData.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Data Found',
                        text: 'No data available for the selected date range.',
                        showConfirmButton: true,
                    });
                }
                setData(drsData);
            } catch (err) {
                console.error('Fetch Manifest Error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
    
            const params = {
    sessionLocationCode: 'MUM',
    drsNo: formData.drsNo,
    fromDate: formData.fromDate,
    toDate: formData.toDate,
    employeeCode: formData.empName,
    pageNumber: currentPage,
    pageSize: rowsPerPage
};
fetchData('/Runsheet/getViewRunsheet',params);
};
  const fetchEmp = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            setData(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
        }
    };

    useEffect(() => {
        fetchEmp('/Master/GetEmployee', setEmpData);
    }, [])

    
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    const deliveryBoyOptions = [
        { value: "vivek", label: "Vivek" },
        { value: "suresh", label: "Suresh" },
        { value: "mahesh", label: "Mahesh" }
    ];
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(data.length / rowsPerPage);

     const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };
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
                const updatedData = data.filter((_, i) => i !== index);
                setData(updatedData);
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
    const handleOpenDrsPrint = (drsData) => {
        navigate("/drsrunsheet",{state:{data:drsData,from: location.pathname}})
    };

    return (
        <>

            <div className="container1">
                <form onSubmit={handleSubmit}>
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
                                options={empData.map(emp => ({
                                    value: emp.Employee_Code,   // adjust keys from your API
                                    label: emp.Employee_Name
                                }))}
                                value={
                                    formData.empName
                                        ? { value: formData.empName, label: empData.find(c => c.Employee_Code === formData.empName)?.Employee_Name || "" }
                                        : null
                                }
                                onChange={(selectedOption) =>
                                    setFormData({
                                        ...formData,
                                        empName: selectedOption ? selectedOption.value : ""
                                    })
                                }
                                placeholder="Select Employee"
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
                            <input type="tel" placeholder="Enter DRS No" value={formData.drsNo} onChange={(e) => setFormData({...formData,drsNo:e.target.value})} />
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
                {isLoading ? (<div className="loader"></div>) : (
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
                                <th scope="col">Vehicle No</th>
                                <th scope="col">Area</th>
                                <th scope="col">Counting</th>

                            </tr>
                        </thead>
                        <tbody className='table-body'>

                            {currentRows.map((drsData, index) => (
                                <tr key={drsData.id} style={{ fontSize: "12px", position: "relative" }}>
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
                                                <button className='edit-btn' onClick={() => handleOpenDrsPrint(drsData)}>
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
                                    <td>{index+1}</td>
                                    <td>{drsData.DrsNo}</td>
                                    <td>{drsData.DrsDate}</td>
                                    <td>{drsData.employeeName}</td>
                                    <td>{}</td>
                                    <td>{drsData.VehicleNo}</td>
                                    <td>{drsData.Area}</td>
                                    <td>{drsData.counting}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>)}

                <div style={{ display: "flex", flexDirection: "row" }}>
                                <div className="pagination">
                                    <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                        {'<'}
                                    </button>
                                    <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                                    <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                        {'>'}
                                    </button>
                                </div>

                                <div className="rows-per-page" style={{ display: "flex", flexDirection: "row", color: "black", marginLeft: "10px" }}>
                                    <label htmlFor="rowsPerPage" style={{ marginTop: "16px", marginRight: "10px" }}>Rows per page:</label>
                                    <select
                                        style={{ height: "40px", width: "60px", marginTop: "10px" }}
                                        id="rowsPerPage"
                                        value={rowsPerPage}
                                        onChange={handleRowsPerPageChange}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={200}>200</option>
                                        <option value={500}>500</option>
                                    </select>
                                </div>
                            </div>

            </div>
        </>
    );
};

export default ViewDrs;