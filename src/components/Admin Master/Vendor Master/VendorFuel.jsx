import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";


function VendorFuel() {
    const [openRow, setOpenRow] = useState(null);
    const [getVendorCharges, setGetVendorCharges] = useState([]);      // To Get Vendor Charges Data
    const [getVendor, setGetVendor] = useState([]);                    // To Get Vendor Data
    const [getMode, setGetMode] = useState([]);                        // To Get Mode Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFovChecked, setIsFovChecked] = useState(false);
    const [isDocketChecked, setIsDocketChecked] = useState(false);
    const [isDeliveryChecked, setIsDeliveryChecked] = useState(false);
    const [isPackingChecked, setIsPackingChecked] = useState(false);
    const [isGreenChecked, setIsGreenChecked] = useState(false);
    const [isHamaliChecked, setIsHamaliChecked] = useState(false);
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [isInsuranceChecked, setIsInsuranceChecked] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addVendorCharges, setAddVendorCharges] = useState({
        vendorCode: "",
        modeCode: "",
        fuelCharges: "",
        fovCharges: "",
        Fuel_Per: 0,
        Fov_Per: 0,
        docketCharges: "",
        packingCharges: "",
        greenCharges: "",
        hamaliCharges: "",
        otherCharges: "",
        insuranceCharges: "",
        fromDate: "",
        toDate: "",
        deliveryCharges: ""
    })



    const filteredVendor = getVendorCharges.filter((vendor) =>
        (vendor && vendor.Vendor_Code && vendor.Vendor_Code?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Vendor_Name && vendor.Vendor_Name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Mode_Code && vendor.Mode_Code?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Fuel_Charges && vendor.Fuel_Charges?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Fov_Charges && vendor.Fov_Charges?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Docket_Charges && vendor.Docket_Charges?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Dilivery_Charges && vendor.Dilivery_Charges?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Packing_Charges && vendor.Packing_Charges?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Green_Charges && vendor.Green_Charges?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Hamali_Charges && vendor.Hamali_Charges?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Other_Charges && vendor.Other_Charges?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.Insurance_Charges && vendor.Insurance_Charges?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.From_Date && vendor.From_Date?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (vendor && vendor.To_Date && vendor.To_Date?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredVendor.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredVendor.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };


    const fetchVendorChargesData = async () => {
        try {
            const response = await getApi('/Master/GetVendorCharges');
            setGetVendorCharges(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    const fetchVendorData = async () => {
        try {
            const response = await getApi('/Master/getVendor');
            setGetVendor(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchModeData = async () => {
        try {
            const response = await getApi('/Master/getMode');
            setGetMode(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorChargesData();
        fetchVendorData();
        fetchModeData();
    }, []);



    const handleFovChange = (e) => {
        setIsFovChecked(e.target.checked);
    };

    const handleDocketChange = (e) => {
        setIsDocketChecked(e.target.checked);
    };

    const handleDeliveryChange = (e) => {
        setIsDeliveryChecked(e.target.checked);
    };

    const handlePackingChange = (e) => {
        setIsPackingChecked(e.target.checked);
    };

    const handleGreenChange = (e) => {
        setIsGreenChecked(e.target.checked);
    };

    const handleHamaliChange = (e) => {
        setIsHamaliChecked(e.target.checked);
    };

    const handleOtherChange = (e) => {
        setIsOtherChecked(e.target.checked);
    };

    const handleInsuranceChange = (e) => {
        setIsInsuranceChecked(e.target.checked);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            VendorCode: addVendorCharges.vendorCode,
            ModeCode: addVendorCharges.modeCode,
            FuelCharges: addVendorCharges.fuelCharges,
            FovCharges: addVendorCharges.fovCharges,
            Fuel_Per: addVendorCharges.Fuel_Per || 10,
            Fov_Per: addVendorCharges.Fov_Per || 10,
            DocketCharges: addVendorCharges.docketCharges,
            DeliveryCharges: addVendorCharges.deliveryCharges,
            PackingCharges: addVendorCharges.packingCharges,
            GreenCharges: addVendorCharges.greenCharges,
            HamaliCharges: addVendorCharges.hamaliCharges,
            OtherCharges: addVendorCharges.otherCharges,
            InsuranceCharges: addVendorCharges.insuranceCharges,
            FromDate: addVendorCharges.fromDate,
            ToDate: addVendorCharges.toDate
        }

        try {
            const resposne = await postApi('/Master/UpdateVendorCharges', requestBody, 'POST');
            if (resposne.status === 1) {
                setGetVendorCharges(getVendorCharges.map((vendor) => vendor.Vendor_Code === addVendorCharges.vendorCode ? resposne.Data : vendor));
                setAddVendorCharges({
                    vendorCode: '',
                    modeCode: '',
                    fuelCharges: '',
                    fovCharges: '',
                    Fuel_Per: "",
                    Fov_Per: "",
                    docketCharges: '',
                    deliveryCharges: '',
                    packingCharges: '',
                    greenCharges: '',
                    hamaliCharges: '',
                    otherCharges: '',
                    insuranceCharges: '',
                    fromDate: '',
                    toDate: ''
                });
                Swal.fire('Updated!', resposne.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchVendorChargesData();
            } else {
                Swal.fire('Error!', resposne.message || 'Failed to update the Vendor Charges.', 'error');
            }
        } catch (error) {
            console.error("Failed to update Vendor Charges:", error);
            Swal.fire('Error', 'Failed to update vendor charges data', 'error');
        }
    }


    const handleSaveVendorCharges = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                vendorCode: addVendorCharges.vendorCode,
                modeCode: addVendorCharges.modeCode,
                fuelCharges: addVendorCharges.fuelCharges,
                fovCharges: addVendorCharges.fovCharges,
                docketCharges: addVendorCharges.docketCharges,
                deliveryCharges: addVendorCharges.deliveryCharges,
                packingCharges: addVendorCharges.packingCharges,
                greenCharges: addVendorCharges.greenCharges,
                hamaliCharges: addVendorCharges.hamaliCharges,
                otherCharges: addVendorCharges.otherCharges,
                insuranceCharges: addVendorCharges.insuranceCharges,
                fromDate: addVendorCharges.fromDate,
                toDate: addVendorCharges.toDate,
                Fuel_Per: addVendorCharges.Fuel_Per || 0,
                Fov_Per: addVendorCharges.Fov_Per || 0,
            };

            const response = await postApi(`/Master/AddVendorCharges`, payload);

            if (response.status === 1) {

                // Reset state
                setAddVendorCharges({
                    vendorCode: "",
                    modeCode: "",
                    fuelCharges: "",
                    fovCharges: "",
                    docketCharges: "",
                    deliveryCharges: "",
                    packingCharges: "",
                    greenCharges: "",
                    hamaliCharges: "",
                    otherCharges: "",
                    insuranceCharges: "",
                    fromDate: "",
                    toDate: "",
                    Fuel_Per: 0,
                    Fov_Per: 0,
                });

                Swal.fire("Saved!", response.message, "success");
                setModalIsOpen(false);

                await fetchVendorChargesData();
            } else {
                Swal.fire("Error!", response.message, "error");
            }
        } catch (err) {
            console.error("Save Error:", err);
            Swal.fire("Error", "Failed to add vendor charges data", "error");
        }
    };


    const handleDeleteVendorCharges = async (Vendor_Code) => {
        try {
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (confirmation.isConfirmed) {
                await deleteApi(`/Master/DeleteVendorCharges?VendorCode=${Vendor_Code}`);
                setGetVendorCharges(getVendorCharges.filter((vendor) => vendor.VendorCode !== Vendor_Code));
                Swal.fire('Deleted!', 'Vendor Charges has been deleted.', 'success');
                await fetchVendorChargesData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Vendor Charges', 'error');
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getVendor);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getVendor');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getVendor.xlsx');
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

            pdf.save('getVendor.pdf');
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
                                setAddVendorCharges({
                                    vendorCode: "", modeCode: "", fuelCharges: "", fovCharges: "", docketCharges: "",
                                    packingCharges: "", greenCharges: "", hamaliCharges: "", otherCharges: "",
                                    insuranceCharges: "", fromDate: "", toDate: "", deliveryCharges: ""
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
                            <input className="add-input" value={searchQuery}
                                onChange={handleSearchChange} type="text" placeholder="search" />
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
                                    <th scope="col">Vendor_Code</th>
                                    <th scope="col">Mode</th>
                                    <th scope="col">Fuel_Charge</th>
                                    <th scope="col">Fov_Charge</th>
                                    <th scope="col">Docket_Charge</th>
                                    <th scope="col">Delivery_Charge</th>
                                    <th scope="col">Packing_Charge</th>
                                    <th scope="col">Green_Charge</th>
                                    <th scope="col">Hamali_Charge</th>
                                    <th scope="col">Other_Charge</th>
                                    <th scope="col">Insurance_Charge</th>
                                    <th scope="col">From_Date</th>
                                    <th scope="col">To_Date</th>

                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((vendor, index) => (
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
                                                        setAddVendorCharges({
                                                            vendorCode: vendor.Vendor_Code,
                                                            modeCode: vendor.Mode_Code,
                                                            fuelCharges: vendor.Fuel_Charges,
                                                            fovCharges: vendor.Fov_Charges,
                                                            docketCharges: vendor.Docket_Charges,
                                                            deliveryCharges: vendor.Dilivery_Charges,
                                                            packingCharges: vendor.Packing_Charges,
                                                            greenCharges: vendor.Green_Charges,
                                                            hamaliCharges: vendor.Hamali_Charges,
                                                            otherCharges: vendor.Other_Charges,
                                                            insuranceCharges: vendor.Insurance_Charges,
                                                            fromDate: vendor.From_Date,
                                                            toDate: vendor.To_Date
                                                        });
                                                        setModalIsOpen(true);
                                                    }}>
                                                        <i className='bi bi-pen'></i>
                                                    </button>
                                                    <button className='edit-btn' onClick={() => {
                                                        setOpenRow(null);
                                                        handleDeleteVendorCharges(vendor.Vendor_Code);
                                                    }}>
                                                        <i className='bi bi-trash'></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                        <td>{vendor.Vendor_Name}</td>
                                        <td>{vendor.Mode_Code}</td>
                                        <td>{vendor.Fuel_Charges}</td>
                                        <td>{vendor.Fov_Charges}</td>
                                        <td>{vendor.Docket_Charges}</td>
                                        <td>{vendor.Dilivery_Charges}</td>
                                        <td>{vendor.Packing_Charges}</td>
                                        <td>{vendor.Green_Charges}</td>
                                        <td>{vendor.Hamali_Charges}</td>
                                        <td>{vendor.Other_Charges}</td>
                                        <td>{vendor.Insurance_Charges}</td>
                                        <td>{formatDate(vendor.From_Date)}</td>
                                        <td>{formatDate(vendor.To_Date)}</td>

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


                    <Modal id="modal" overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-custCharges" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Vendor Charges Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSaveVendorCharges}>

                                    <div className="fields2">
                                        <div className="input-field3">
                                            <label htmlFor="">Vendor Name</label>
                                            <select value={addVendorCharges.vendorCode}
                                                onChange={(e) => setAddVendorCharges({ ...addVendorCharges, vendorCode: e.target.value })}
                                                required aria-readonly={isEditMode}>
                                                <option value="" disabled>Select Vendor Name</option>
                                                {getVendor.map((vendor, index) => (
                                                    <option value={vendor.Vendor_Code} key={index}>{vendor.Vendor_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Mode</label>
                                            <select value={addVendorCharges.modeCode}
                                                onChange={(e) => setAddVendorCharges({ ...addVendorCharges, modeCode: e.target.value })} required>
                                                <option disabled value="">Select Mode</option>
                                                {getMode.map((mode, index) => (
                                                    <option value={mode.Mode_Code} key={index}>{mode.Mode_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Fuel Charges</label>
                                            <input required type="text"
                                                placeholder="Enter Fuel Charges"
                                                value={addVendorCharges.fuelCharges}
                                                onChange={(e) => setAddVendorCharges({ ...addVendorCharges, fuelCharges: e.target.value })} />
                                        </div>

                                        <div className="input-field3">
                                            <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                onClick={(e) => { e.preventDefault(); setModalIsOpen1(true); }}>
                                                <i className="bi bi-cash-coin"></i>
                                            </button>
                                        </div>

                                        {isFovChecked && (
                                            <div className="input-field3">
                                                <label htmlFor="">FOV </label>
                                                <input type="text" placeholder="Enter FOV "
                                                    value={addVendorCharges.fovCharges}
                                                    onChange={(e) => setAddVendorCharges({ ...addVendorCharges, fovCharges: e.target.value })} required />
                                            </div>
                                        )}

                                        {isDocketChecked && (
                                            <div className="input-field3">
                                                <label htmlFor="">Docket Charges</label>
                                                <input type="text" placeholder="Enter Docket Charges"
                                                    value={addVendorCharges.docketCharges}
                                                    onChange={(e) => setAddVendorCharges({ ...addVendorCharges, docketCharges: e.target.value })} required />
                                            </div>)}

                                        {isDeliveryChecked && (
                                            <div className="input-field3">
                                                <label htmlFor="">Delivery Charges</label>
                                                <input type="text" placeholder="Enter Delivery Charges"
                                                    value={addVendorCharges.deliveryCharges}
                                                    onChange={(e) => setAddVendorCharges({ ...addVendorCharges, deliveryCharges: e.target.value })} required />
                                            </div>)}

                                        {isPackingChecked && (
                                            <div className="input-field3">
                                                <label htmlFor="">Packing Charges</label>
                                                <input type="text" placeholder="Enter Packing Charges"
                                                    value={addVendorCharges.packingCharges}
                                                    onChange={(e) => setAddVendorCharges({ ...addVendorCharges, packingCharges: e.target.value })} required />
                                            </div>)}

                                        {isGreenChecked && (
                                            <div className="input-field3">
                                                <label htmlFor="">Green Charges</label>
                                                <input type="text" placeholder="Enter Green Charges"
                                                    value={addVendorCharges.greenCharges}
                                                    onChange={(e) => setAddVendorCharges({ ...addVendorCharges, greenCharges: e.target.value })} required />
                                            </div>)}

                                        {isHamaliChecked && (
                                            <div className="input-field3">
                                                <label htmlFor="">Hamali Charges</label>
                                                <input type="text" placeholder="Enter Hamali Charges"
                                                    value={addVendorCharges.hamaliCharges}
                                                    onChange={(e) => setAddVendorCharges({ ...addVendorCharges, hamaliCharges: e.target.value })} required />
                                            </div>)}

                                        {isHamaliChecked && (
                                            <div className="input-field3">
                                                <label htmlFor="">Other Charges</label>
                                                <input type="text" placeholder="Enter Other Charges"
                                                    value={addVendorCharges.otherCharges}
                                                    onChange={(e) => setAddVendorCharges({ ...addVendorCharges, otherCharges: e.target.value })} required />
                                            </div>)}

                                        {isInsuranceChecked && (
                                            <div className="input-field3">
                                                <label htmlFor="">Insurance Charges</label>
                                                <input type="text" placeholder="Enter Insurance Charges"
                                                    value={addVendorCharges.insuranceCharges}
                                                    onChange={(e) => setAddVendorCharges({ ...addVendorCharges, insuranceCharges: e.target.value })} required />
                                            </div>)}

                                        <div className="input-field3">
                                            <label htmlFor="">From</label>
                                            <input type="date" placeholder="enter from date"
                                                value={addVendorCharges.fromDate}
                                                onChange={(e) => setAddVendorCharges({ ...addVendorCharges, fromDate: e.target.value })} required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">To Date</label>
                                            <input type="date" placeholder="enter till date"
                                                value={addVendorCharges.toDate}
                                                onChange={(e) => setAddVendorCharges({ ...addVendorCharges, toDate: e.target.value })} required />
                                        </div>

                                    </div>

                                    <div className='bottom-buttons' style={{ marginLeft: "25px" }}>
                                        {!isEditMode && (<button type='submit' className='ok-btn' >Submit</button>)}
                                        {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn' >Update</button>)}
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen1}
                        className="custom-modal-charges" contentLabel="Modal">
                        <div className="custom-modal-content">

                            <div className="header-tittle">
                                <header>Charges</header>
                            </div>

                            <div className='container2'>
                                <form>
                                    <div className="fields2">

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isFovChecked}
                                                onChange={handleFovChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Fov Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isDocketChecked}
                                                onChange={handleDocketChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Docket Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isDeliveryChecked}
                                                onChange={handleDeliveryChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Delivery Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isPackingChecked}
                                                onChange={handlePackingChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Packing Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isGreenChecked}
                                                onChange={handleGreenChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Green Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isHamaliChecked}
                                                onChange={handleHamaliChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Hamali Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isOtherChecked}
                                                onChange={handleOtherChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Other Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isInsuranceChecked}
                                                onChange={handleInsuranceChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="" id="" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Insurance Charges</label>
                                        </div>

                                        <div className='bottom-buttons' style={{ marginLeft: "25px" }}>
                                            <button onClick={(e) => { e.preventDefault(); setModalIsOpen1(false) }} className='ok-btn'>close</button>
                                        </div>
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

export default VendorFuel;