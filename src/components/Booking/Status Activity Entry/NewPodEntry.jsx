import React, { useEffect, useState } from "react";
import { deleteApi, getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi"
import Footer from "../../../Components-2/Footer";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import Swal from "sweetalert2";
import Select from 'react-select';
import 'react-toggle/style.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./table.css"


function NewPodEntry() {

    const [status, setStatus] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const today = new Date();
    const time = String(today.getHours()).padStart(2, "0") + ":" + String(today.getMinutes()).padStart(2, "0");


    const [getCity, setGetCity] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [docket, setDocket] = useState('');
    const [formData, setFormData] = useState({
        toDate: today,
        fromDest: '',
        toDest: '',
        time: time,
        status: "",
    });
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };
    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            setData(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(today.toISOString().slice(11, 16), "+", today.toLocaleTimeString().slice(0, 5));
        fetchData('/Master/getdomestic', setGetCity);

    }, []);

    /**************** function to export table data in excel and pdf ************/
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(status);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'status');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'status.xlsx');
    };

    const handleExportPDF = () => {
        const input = document.getElementById('table-to-pdf');

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190; // Set width of the image
            const pageHeight = pdf.internal.pageSize.height; // Get the height of the PDF page
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate the height of the image
            let heightLeft = imgHeight;
            let position = 10;  /****Set the margin top of pdf */

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('status.pdf');
        });
    };
    const resetForm = () => {
        setFormData((prev) => ({
            ...prev,
            toDate: today,
            fromDest: '',
            toDest: '',
            time: time,
            status: "",

        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await getApi(`/DocketBooking/GetStatusDetails?DocketNo=${docket}`);
            if (res.status === 1) {
                setStatus(res.data);
                console.log(res.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Status Found',
                    text: res.message,
                })
            }

        }
        catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'warning',
                title: 'No Status Found',
                text: 'No status available for this Docket.',
                showConfirmButton: true,
            });
        }

    }
    const AddStatus = async (e) => {
  e.preventDefault();
  try {
    const queryParams = new URLSearchParams({
      docketNo: docket,
      delvDt: formData.toDate.toISOString().slice(0, 10),
      delvTime: formData.time,
      destinationCode: "DEL",
      destinationName: formData.toDest,
      status: formData.status
    });

    const res = await postApi(`/DocketBooking/StatusEntry?${queryParams.toString()}`, {}); // empty body
    console.log("POST response", res);

    if (res.status === 1) {
      Swal.fire({ icon: 'success', title: 'Status Added', text: res.message });
      resetForm();
      const getRes = await getApi(`/DocketBooking/GetStatusDetails?DocketNo=${docket}`);
      if (getRes.status === 1) setStatus(getRes.data);
    } else {
      Swal.fire({ icon: 'warning', title: 'Failed', text: res.message });
    }

  } catch (error) {
    console.log(error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'API failed' });
  }
};
 const delStatus = async(id)=>
    {
        try{
        const res=await deleteApi(`/DocketBooking/StatusEntryDelete?id=${id}`);
        if (res.status === 1) {
                  Swal.fire('Deleted!', res.message, 'success');
                  const newList=status.flter((data)=>data.id!==id);
                  setStatus(newList);
                  resetForm();
                } else {
                  Swal.fire('Error', res.message, 'error');
                }
              } catch (err) {
                Swal.fire('Error', 'Failed to delete status.', 'error');
              }
    }

    return (
        <>

            <div className="container1">
                <form className="order-form" onSubmit={handleSubmit}>
                    <div className="order-fields" style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                        <div className="input-field" style={{ width: "180px" }}>
                            <label htmlFor="">Docket No</label>
                            <input type="text" placeholder="Enter Docket No" value={docket} onChange={(e) => setDocket(e.target.value)} />
                        </div>
                        <div className="bottom-buttons" style={{ marginTop: "27px", marginLeft: "-1px", width: "60px" }}>
                            <button type="submit" className="ok-btn">Find</button>
                        </div>
                    </div>
                </form>

                {/*<div className="addNew">
                    <button className='add-btn' onClick={() => { setModalIsOpen(true); setModalData({ code: '', name: '' }) }}>
                        <i className="bi bi-plus-lg"></i>
                        <span>ADD NEW</span>
                    </button>

                    <div className="dropdown">
                        <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                        <div className="dropdown-content">
                            <button onClick={handleExportExcel}>Export to Excel</button>
                            <button onClick={handleExportPDF}>Export to PDF</button>
                        </div>
                    </div>

                    <div className="search-input">
                        <input className="add-input" type="text" placeholder="search" />
                        <button type="submit" title="search">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>*/}

                <div className='table-container'>
                    <table className='table table-bordered table-sm tableSize'>
                        <thead className='table-info body-bordered table-sm'>
                            <tr>
                                <th scope="col">Sr.No</th>
                                <th scope="col">Activity Date</th>
                                <th scope="col">Activity Time</th>
                                <th scope="col">From City</th>
                                <th scope="col">To City</th>
                                <th scope="col">Activity</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            <tr>
                                <td>1</td>
                                <td><DatePicker
                                    portalId="root-portal"
                                    selected={formData.toDate}
                                    onChange={(date) => handleDateChange(date, "toDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm custom-datepicker"
                                /></td>
                                <td>
                                    <input className="form-control"
                                        style={{ height: "35px" }}
                                        type="time" value={formData.time} onChange={(e) => { setFormData({ ...formData, time: e.target.value }) }} />
                                </td>
                                <td><Select
                                    options={getCity.map(city => ({
                                        value: city.City_Code,   // adjust keys from your API
                                        label: city.City_Name
                                    }))}
                                    value={
                                        formData.fromDest
                                            ? { value: formData.fromDest, label: getCity.find(c => c.City_Code === formData.fromDest)?.City_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) => {
                                        console.log(selectedOption);
                                        setFormData({
                                            ...formData,
                                            fromDest: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    }
                                    placeholder="Select City"
                                    isSearchable
                                    classNamePrefix="blue-selectbooking"
                                    className="blue-selectbooking"
                                    menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                                    styles={{
                                        placeholder: (base) => ({
                                            ...base,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }),
                                        menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                                    }}
                                /></td>
                                <td><Select
                                    options={getCity.map(city => ({
                                        value: city.City_Name,   // adjust keys from your API
                                        label: city.City_Name
                                    }))}
                                    value={
                                        formData.toDest
                                            ? {value: formData.fromDest, label: getCity.find(c => c.City_Code === formData.fromDest)?.City_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            toDest: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select City"
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
                                /></td>
                                <td><input type="text" className="form-control" style={{ height: "35px" }} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} /></td>
                                <td>
                                    <button className="ok-btn" style={{ width: "60px", height: "30px" }} onClick={AddStatus}>Add +</button>
                                </td>
                            </tr>
                            {status.map((zone, index) => (
                                <tr key={zone.id}>
                                    <td>{index + 1}</td>
                                    <td>{zone.DelvDt}</td>
                                    <td>{zone.DelvTime}</td>
                                    <td>{zone.Origin_name}</td>
                                    <td>{zone.Destination_name}</td>
                                    <td>{zone.status}</td>
                                    <td>
                                        <button className='edit-btn' onClick={()=>delStatus(zone.id)}>
                                            <i className='bi bi-trash'  style={{fontSize:"18px"}}></i></button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

        </>
    );
};
export default NewPodEntry;