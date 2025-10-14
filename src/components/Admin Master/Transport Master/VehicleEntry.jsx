import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


function VehicleEntry() {
    const [openRow, setOpenRow] = useState(null);
    const [getVehicle, setGetVehicle] = useState([]);               // To Get Vehicle Data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addVehicle, setAddVehicle] = useState({
        VehicleCode: "",
        vehicleNumber: "",
        vehicleModel: "",
        registrationNumber: "",
        vehicleType: "",
        insuranceCompany: "",
        insuranceNo: "",
        expiryOfInsurance: "",
        pucNumber: "",
        expiryDateOfPuc: "",
        transportName: "",
        ratePerKg: "",
        employeeCharges: "",
        detentionCharges: ""
    })


    const filteredgetVehicle = getVehicle.filter((transport) =>
        (transport && transport.Vehicle_Code && transport.Vehicle_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (transport && transport.vehicle_number && transport.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetVehicle.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetVehicle.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };



    const fetchData = async () => {
        try {
            const response = await getApi('/Master/VehicleMaster');
            setGetVehicle(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleGenerateCode = () => {
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddVehicle({ ...addVehicle, VehicleCode: newCode });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            Vehicle_Code: addVehicle.VehicleCode,
            vehicle_number: addVehicle.vehicleNumber,
            vehicle_model: addVehicle.vehicleModel,
            registration_number: addVehicle.registrationNumber,
            vehicle_type: addVehicle.vehicleType,
            insurance_company: addVehicle.insuranceCompany,
            insurance_No: addVehicle.insuranceNo,
            expiry_date_of_insurance: addVehicle.expiryOfInsurance,
            puc_number: addVehicle.pucNumber,
            expiry_date_of_puc: addVehicle.expiryDateOfPuc,
            transport_name: addVehicle.transportName,
            rate_per_kg: addVehicle.ratePerKg,
            employee_charges: addVehicle.employeeCharges,
            detention_charges: addVehicle.detentionCharges
        }

        try {
            const response = await postApi('/Master/UpdateVehicle', requestBody, 'POST');
            if (response.status === 1) {
                setGetVehicle(getVehicle.map((vehicle) => vehicle.Vehicle_Code === addVehicle.VehicleCode ? response.Data : vehicle));
                setAddVehicle({
                    VehicleCode: '',
                    vehicleNumber: '',
                    vehicleModel: '',
                    registrationNumber: '',
                    vehicleType: '',
                    insuranceCompany: '',
                    insuranceNo: '',
                    expiryOfInsurance: '',
                    pucNumber: '',
                    expiryDateOfPuc: '',
                    transportName: '',
                    ratePerKg: '',
                    employeeCharges: '',
                    detentionCharges: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the Vehicle.', 'error');
            }
        } catch (error) {
            console.error("Failed to update the Vehicle:", error);
            Swal.fire('Error', 'Failed to update vehicle data', 'error');
        }
    }

    const handleSaveVehicle = async (e) => {
        e.preventDefault();

        try {
            const response = await postApi(`/Master/addVehicle?Vehicle_Code=${addVehicle.VehicleCode}
        &vehicle_number=${addVehicle.vehicleNumber}
        &vehicle_model=${addVehicle.vehicleModel}
        &registration_number=${addVehicle.registrationNumber}
        &vehicle_type=${addVehicle.vehicleType}
        &insurance_company=${addVehicle.insuranceCompany}
        &insurance_No=${addVehicle.insuranceNo}
        &expiry_date_of_insurance=${addVehicle.expiryOfInsurance}
        &puc_number=${addVehicle.pucNumber}
        &expiry_date_of_puc=${addVehicle.expiryDateOfPuc}
        &transport_name=${addVehicle.transportName}
        &rate_per_kg=${addVehicle.ratePerKg}
        &employee_charges=${addVehicle.employeeCharges}
        &detention_charges=${addVehicle.detentionCharges}`);
            if (response.status === 1) {
                setGetVehicle([...getVehicle, response.Data]);
                setAddVehicle({
                    VehicleCode: '',
                    vehicleNumber: '',
                    vehicleModel: '',
                    registrationNumber: '',
                    vehicleType: '',
                    insuranceCompany: '',
                    insuranceNo: '',
                    expiryOfInsurance: '',
                    pucNumber: '',
                    expiryDateOfPuc: '',
                    transportName: '',
                    ratePerKg: '',
                    employeeCharges: '',
                    detentionCharges: ''
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Vehicle data', 'error');
        }
    };

    const handleDeleteVehicle = async (Vehicle_Code) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this zone?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteApi(`/Master/DeleteVehicleDetail?VehicleCode=${Vehicle_Code}`);
                setGetVehicle(getVehicle.filter((vehicle) => vehicle.VehicleCode !== Vehicle_Code));
                Swal.fire('Deleted!', 'The Vehicle has been deleted.', 'success');
                await fetchData();
            } catch (err) {
                console.error('Delete Error:', err);
                Swal.fire('Error', 'Failed to delete Vehicle', 'error');
            }
        }
    };


    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getVehicle);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getVehicle');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getVehicle.xlsx');
    };

    const handleExportPDF = () => {
        const input = document.getElementById('table-to-pdf');

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('getVehicle.pdf');
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;



    return (
        <>
            <div className="body">
                <div className="container1">
                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => {
                                setModalIsOpen(true); setIsEditMode(false);
                                setAddVehicle({
                                    VehicleCode: "", vehicleNumber: "", vehicleModel: "", registrationNumber: "", vehicleType: "",
                                    insuranceCompany: "", insuranceNo: "", expiryOfInsurance: "", pucNumber: "", expiryDateOfPuc: "",
                                    transportName: "", ratePerKg: "", employeeCharges: "", detentionCharges: ""
                                })
                            }}>
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
                        </div>

                        <div className="search-input">
                            <input className="add-input" type="text" placeholder="search"
                                value={searchQuery} onChange={handleSearchChange} />
                            <button type="submit" title="search">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className='table-container'>
                        <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                            <thead className='table-sm'>
                                <tr>
                                    <th scope="col">Actions</th>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Vehicle_Code</th>
                                    <th scope="col">Vehicle_No</th>
                                    <th scope="col">Vehicle_Model</th>
                                    <th scope="col">Registration_No</th>
                                    <th scope="col">Vehicle_Type</th>
                                    <th scope="col">Insurance_Company</th>
                                    <th scope="col">Insurance_No</th>
                                    <th scope="col">Exp_Date</th>
                                    <th scope="col">PUC_No</th>
                                    <th scope="col">Exp_Date</th>
                                    <th scope="col">Transport_Name</th>
                                    <th scope="col">Rate_Per/Kg</th>
                                    <th scope="col">Employee_Charges</th>
                                    <th scope="col">Detention_Charges</th>

                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((vehicle, index) => (
                                    <tr key={index} style={{ fontSize: "12px", position: "relative" }}>
                                        <td>
                                            <PiDotsThreeOutlineVerticalFill
                                                style={{ fontSize: "20px", cursor: "pointer" }}
                                                onClick={() => setOpenRow(openRow === index ? null : index)}
                                            />
                                            {openRow === index && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        flexDirection: "row",
                                                        position: "absolute",
                                                        alignItems: "center",
                                                        left: "60px",
                                                        top: "0px",
                                                        borderRadius: "10px",
                                                        backgroundColor: "white",
                                                        zIndex: "999999",
                                                        height: "30px",
                                                        width: "50px",
                                                        padding: "10px",
                                                    }}
                                                >

                                                   <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setOpenRow(null);
                                                    setAddVehicle({
                                                        VehicleCode: vehicle.Vehicle_Code,
                                                        vehicleNumber: vehicle.vehicle_number,
                                                        vehicleModel: vehicle.vehicle_model,
                                                        registrationNumber: vehicle.registration_number,
                                                        vehicleType: vehicle.vehicle_type,
                                                        insuranceCompany: vehicle.insurance_company,
                                                        insuranceNo: vehicle.insurance_No,
                                                        expiryOfInsurance: vehicle.expiry_date_of_insurance,
                                                        pucNumber: vehicle.puc_number,
                                                        expiryDateOfPuc: vehicle.expiry_date_of_puc,
                                                        transportName: vehicle.transport_name,
                                                        ratePerKg: vehicle.rate_per_kg,
                                                        employeeCharges: vehicle.EmployeeCharges,
                                                        detentionCharges: vehicle.DetentionCharges
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button onClick={() => {
                                                    setOpenRow(null);
                                                    handleDeleteVehicle(vehicle.Vehicle_Code);
                                                    }} className='edit-btn'><i className='bi bi-trash'></i></button>
                                                </div>
                                            )}
                                        </td>

                                        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                        <td>{vehicle.Vehicle_Code}</td>
                                        <td>{vehicle.vehicle_number}</td>
                                        <td>{vehicle.vehicle_model}</td>
                                        <td>{vehicle.registration_number}</td>
                                        <td>{vehicle.vehicle_type}</td>
                                        <td>{vehicle.insurance_company}</td>
                                        <td>{vehicle.insurance_No}</td>
                                        <td>{formatDate(vehicle.expiry_date_of_insurance)}</td>
                                        <td>{vehicle.puc_number}</td>
                                        <td>{formatDate(vehicle.expiry_date_of_puc)}</td>
                                        <td>{vehicle.transport_name}</td>
                                        <td>{vehicle.rate_per_kg}</td>
                                        <td>{vehicle.EmployeeCharges}</td>
                                        <td>{vehicle.DetentionCharges}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="row" style={{ whiteSpace: "nowrap" }}>
                        <div className="pagination col-12 col-md-6 d-flex justify-content-center align-items-center mb-2 mb-md-0">
                            <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                {'<'}
                            </button>
                            <span style={{ color: "#333", padding: "5px" }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                {'>'}
                            </button>
                        </div>

                        <div className="rows-per-page col-12 col-md-6 d-flex justify-content-center justify-content-md-end align-items-center">
                            <label htmlFor="rowsPerPage" className="me-2">Rows per page: </label>
                            <select
                                id="rowsPerPage"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                style={{ height: "40px", width: "50px" }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>


                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-custCharges" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Vehicle Master</header>
                            </div>
                            <div className='container2'>
                                <form onSubmit={handleSaveVehicle}>

                                    <div className="fields2">
                                        <div className="input-field3">
                                            <label htmlFor="">Code </label>
                                            <input type="text"
                                                placeholder="enter your code/ generate code"
                                                value={addVehicle.VehicleCode}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, VehicleCode: e.target.value })}
                                                maxLength="3" readOnly={isEditMode} />
                                        </div>

                                        {!isEditMode && (
                                            <div className="input-field3">
                                                <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                    onClick={handleGenerateCode}>Generate Code</button>
                                            </div>
                                        )}

                                        <div className="input-field3">
                                            <label htmlFor="">Vehicle Number</label>
                                            <input type="tel" value={addVehicle.vehicleNumber}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, vehicleNumber: e.target.value })}
                                                placeholder="Enter Vehicle Number" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Vehicle Model</label>
                                            <select value={addVehicle.vehicleModel}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, vehicleModel: e.target.value })} required>
                                                <option disabled value="">Select Vehicle Model</option>
                                                <option value="Honda">Honda</option>
                                                <option value="Hero">Hero</option>
                                                <option value="Hyundai">Hyundai</option>
                                                <option value="BMW">BMW</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Registration Number</label>
                                            <input type="tel" value={addVehicle.registrationNumber}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, registrationNumber: e.target.value })}
                                                placeholder="Enter Registration Number" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Vehicle Type</label>
                                            <select value={addVehicle.vehicleType}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, vehicleType: e.target.value })} required>
                                                <option disabled value="">Select Vehicle Type</option>
                                                <option value="Truck">Truck</option>
                                                <option value="Semi Truck">Semi Truck</option>
                                                <option value="SUV">SUV</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Insurance Company</label>
                                            <select value={addVehicle.insuranceCompany}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, insuranceCompany: e.target.value })} required>
                                                <option disabled value="">Select Insurance Company</option>
                                                <option value="Go Digit Insurance">Go Digit Insurance</option>
                                                <option value="Semi Truck">Semi Truck</option>
                                                <option value="SUV">SUV</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Insurance Number</label>
                                            <input type="tel" value={addVehicle.insuranceNo}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, insuranceNo: e.target.value })}
                                                placeholder="Enter Insurance Number" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Expiry Date of Insurance</label>
                                            <input type="date" value={addVehicle.expiryOfInsurance}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, expiryOfInsurance: e.target.value })} required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">PUC Number</label>
                                            <input type="tel" value={addVehicle.pucNumber}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, pucNumber: e.target.value })}
                                                placeholder="Enter PVC Number" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Expiry Date of PUC</label>
                                            <input type="date" value={addVehicle.expiryDateOfPuc}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, expiryDateOfPuc: e.target.value })} required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Transport Name</label>
                                            <select value={addVehicle.transportName}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, transportName: e.target.value })} required>
                                                <option disabled value="">Select Transport Name</option>
                                                <option value="Ramesh Kumar">Ramesh Kumar</option>
                                                <option value="Suresh Kumar">Suresh Kumar</option>
                                                <option value="Mahesh Kumar">Mahesh Kumar</option>
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Rate Per Kg</label>
                                            <input type="tel" value={addVehicle.ratePerKg}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, ratePerKg: e.target.value })}
                                                placeholder="Enter Rate Per Kg" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Employee Charges</label>
                                            <input type="tel" value={addVehicle.employeeCharges}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, employeeCharges: e.target.value })}
                                                placeholder="Enter Employee Charges" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Detention Charges</label>
                                            <input type="tel" value={addVehicle.detentionCharges}
                                                onChange={(e) => setAddVehicle({ ...addVehicle, detentionCharges: e.target.value })}
                                                placeholder="Enter Detention Charges" required />
                                        </div>

                                    </div>

                                    <div className='bottom-buttons'>
                                        {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                        {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >
                </div>
            </div>
        </>
    );
};

export default VehicleEntry;