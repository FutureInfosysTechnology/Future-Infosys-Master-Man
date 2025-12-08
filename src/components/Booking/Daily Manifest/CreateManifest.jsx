import React, { useContext, useEffect, useState } from "react";
import { getApi, postApi, putApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'react-toggle/style.css';
import { refeshPend } from "../../../App";

function CreateManifest() {
    const { refFun } = useContext(refeshPend)
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [isInput, setInput] = useState("SELF");
    const [getTransport, setGetTransport] = useState([]);
    const [getVehicle, setGetVehicle] = useState([]);
    const [getDriver, setGetDriver] = useState([]);
    const [getVendor, setGetVendor] = useState([]);
    const [getCity, setGetCity] = useState([]);
    const [getBranch, setGetBranch] = useState([]);
    const [getMode, setGetMode] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [getManifest, setGetManifest] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDocketNos, setSelectedDocketNos] = useState([]);
    const [selectedManifestRows, setSelectedManifestRows] = useState([]);
    const [getFlight, setGetFlight] = useState([]);
    const [getTrain, setGetTrain] = useState([]);
    const [fromDate, setFromDate] = useState(firstDayOfMonth);
    const [toDate, setToDate] = useState(today);
    const [formData, setFormData] = useState({
        maniDate: new Date(),
        fromDest: '',
        toDest: '',
        mode: '',
        transportType: '',
        vehicleType: '',
        vehicleNo: '',
        driverName: '',
        driverMobile: '',
        vendorCode: '',
        vendorAwbNo: '',
        MAwbNo: '',
        bagNo: '',
        DoxSpx: '',
        remark: '',
        bookingWeight: '',
        manifestWeight: '',
        Train_Code: '',
        Flight_Code: '',
        docketNo: []
    });


    const [isChecked, setIsChecked] = useState(
        {
            Vehicle_Detail: false,
            Vehicle_Type: false,
            Driver_Name: false,
            Train_Name: false,
            Flight_Name: false,
            Vendor_Name: false,
            Vendor_Awb_No: false,
            Remark: false,
            Manifest_Weight: false,
            MasterAwbNo: false,
            Dox_Spx: false,
            BagNo: false,
        })
    const [isAllChecked, setIsAllChecked] = useState(false);
    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
    };



    const handleCheckChange = (e) => {
        const { name, checked } = e.target;

        // If ALL checkbox is toggled
        if (name === "all") {
            setIsAllChecked(checked); // update main checkbox

            const updated = Object.fromEntries(
                Object.keys(isChecked).map(k => [k, checked])
            );

            setIsChecked(updated);
            return;
        }

        // Individual Checkbox
        setIsChecked(prev => {
            const updated = { ...prev, [name]: checked };

            // If all single checkboxes are true -> selectAll = true
            const allSelected = Object.values(updated).every(v => v === true);
            setIsAllChecked(allSelected);

            return updated;
        });
    };


    const fetchDataM = async () => {
        setLoading(true);
        try {
            // Current page data
            const response = await getApi(`/Manifest/getPendingManifest?branchCode=${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}&pageNumber=${currentPage}&pageSize=${rowsPerPage}`);
            const currentPageData = response?.Data || [];  // <-- remove extra .Data
            setGetManifest(currentPageData);

            // Total records for pagination
            const allDataResponse = await getApi(`/Manifest/getPendingManifest?branchCode=${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}&pageNumber=1&pageSize=10000`);
            const allData = allDataResponse?.Data || [];   // <-- remove extra .Data
            setTotalRecords(allData.length);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchDataM();
    }, [currentPage, rowsPerPage]);

    const filteredgetManifestData = getManifest.filter((manifest) => {
        const lower = searchQuery.toLowerCase();

        const isMatch =
            manifest?.DocketNo?.toLowerCase().includes(lower) ||
            manifest?.customerName?.toLowerCase().includes(lower) ||
            manifest?.fromDest?.toLowerCase().includes(lower) ||
            manifest?.toDest?.toLowerCase().includes(lower) ||
            manifest?.BookDate?.toLowerCase().includes(lower);

        let manifestDate = manifest?.BookDate ? new Date(manifest.BookDate) : null;

        const from = formData.fromDate
            ? new Date(formData.fromDate.setHours(0, 0, 0, 0))
            : null;
        const to = formData.toDate
            ? new Date(formData.toDate.setHours(23, 59, 59, 999))
            : null;

        const isDateInRange =
            (!from || (manifestDate && manifestDate >= from)) &&
            (!to || (manifestDate && manifestDate <= to));

        return isMatch && isDateInRange;
    });
    const convertDateFormat = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
        setCurrentPage(1);
    };

    const handleToDateChange = (e) => {
        setToDate(e.target.value);
        setCurrentPage(1);
    };


    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const fetchData = async (endpoint, setData) => {
        setLoading(true); // Set loading state to true

        try {
            const response = await getApi(endpoint);
            const data = response.Data || response.data
            // Check if the response contains data, then update the corresponding state
            if (data) {
                setData(Array.isArray(data) ? data : []);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error(`Error fetching data from ${endpoint}:`, err);
            setError(err);
        } finally {
            setLoading(false); // Set loading state to false after fetching
        }
    };

    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const response = await getApi(`/Master/getBranch?Branch_Code=${JSON.parse(localStorage.getItem("Login"))?.Branch_Code}`);
                if (response.status === 1) {
                    console.log(response.Data);
                    setGetBranch(response.Data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchBranch();
        const fetchSetup = async () => {
            try {
                const response = await getApi(`/Master/getManifestSetup`);

                if (response.status === 1) {
                    const setup = response.data[0];

                    const updatedChecks = {
                        Vehicle_Detail: setup.Vehicle_Detail,
                        Vehicle_Type: setup.Vehicle_Type,
                        Driver_Name: setup.Driver_Name,
                        Train_Name: setup.Train_Name,
                        Flight_Name: setup.Flight_Name,
                        Vendor_Name: setup.Vendor_Name,
                        Vendor_Awb_No: setup.Vendor_Awb_No,
                        Remark: setup.Remark,
                        Manifest_Weight: setup.Manifest_Weight,
                        MasterAwbNo: setup.MasterAwbNo,
                        Dox_Spx: setup.Dox_Spx,
                        BagNo: setup.BagNo,
                    };

                    // set all checkbox state
                    setIsChecked(updatedChecks);

                    // auto enable Select All if all values true
                    const allSelected = Object.values(updatedChecks).every(v => v === true);
                    setIsAllChecked(allSelected);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSetup();

        fetchData('/Master/getMode', setGetMode);
        fetchData('/Master/getVendor', setGetVendor);
        fetchData('/Master/getdomestic', setGetCity);
        fetchData('/Master/getGetdriver', setGetDriver);
        fetchData('/Master/VehicleMaster', setGetVehicle);
        fetchData('/Master/gettransport', setGetTransport);
        fetchData('/Master/GetAllFlights', setGetFlight);
        fetchData('/Master/GetAllTrains', setGetTrain);
    }, []);


    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedRows(getManifest.map((_, index) => index));
        } else {
            setSelectedRows([]);
        }
    };
    useEffect(() => {
        console.log(isInput);
    }, [isInput])

    const handleRowSelect = (index, docketNo) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
            setSelectedDocketNos(selectedDocketNos.filter(docket => docket !== docketNo));
            setSelectedManifestRows(selectedManifestRows.filter(row => row.DocketNo !== docketNo));
        } else {
            setSelectedRows([...selectedRows, index]);
            setSelectedDocketNos([...selectedDocketNos, docketNo]);
            setSelectedManifestRows([
                ...selectedManifestRows,
                getManifest.find(manifest => manifest.DocketNo === docketNo)
            ]);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDocketNoSelect = () => {
        setFormData((prevData) => ({
            ...prevData,
            docketNo: selectedDocketNos,
        }));
        setModalIsOpen(false);
    };
    const formatDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };

    const allFlightOptions = getFlight.map(f => ({
        value: f.Flight_Code,   // what you store
        label: f.Flight_Name, // visible in dropdown
        flightNo: f.Flight_No,  // extra info if needed
    }));

    const allTrainOptions = getTrain.map(t => ({
        value: t.Train_Code,   // what you store
        label: t.Train_Name, // visible in dropdown
        trainNo: t.Train_No,  // extra info if needed
    }));


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedDocketNos.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select at least one Docket No before submitting the form.',
            });
            return;
        }
        const requestPayload = {
            DocketNo: selectedDocketNos,
            sessionLocationCode: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
            fromDest: formData.fromDest,
            toDest: formData.toDest,
            Mode: formData.mode,
            Remark: formData.remark,
            transporterType: formData.transportType,
            Vehicletype: formData.vehicleType,
            VehicleNo: formData.vehicleNo,
            VendorCode: formData.vendorCode,
            VendorAwbNo: formData.vendorAwbNo,
            driverName: formData.driverName,
            driverMobile: formData.driverMobile,
            ManifestDate: formatDate(formData.maniDate),
            DispatchFlag: "1",
        };
        try {
            const response = await postApi('/Manifest/generateManifest', requestPayload);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Data has been successfully generated!',
                timer: 2000,
                showConfirmButton: true,
            });
            setFormData({
                maniDate: new Date(),
                fromDest: '',
                toDest: '',
                mode: '',
                transportType: '',
                vehicleType: '',
                vehicleNo: '',
                driverName: '',
                driverMobile: '',
                vendorCode: '',
                vendorAwbNo: '',
                MAwbNo: '',
                bagNo: '',
                DoxSpx: '',
                remark: '',
                bookingWeight: '',
                manifestWeight: '',
                Train_Code: '',
                Flight_Code: '',
                docketNo: []
            })
            refFun();

            setSelectedManifestRows([]);
            setSelectedRows([]);
            setSelectedDocketNos([]);
            setSelectAll(false);
        } catch (error) {
            console.error("Error submitting manifest: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while generating data. Please try again.',
            });
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestPayload = {
            Manifest_ID: 1,
            Vehicle_Detail: isChecked.Vehicle_Detail,
            Vehicle_Type: isChecked.Vehicle_Type,
            Driver_Name: isChecked.Driver_Name,
            Train_Name: isChecked.Train_Name,
            Flight_Name: isChecked.Flight_Name,
            Vendor_Name: isChecked.Vendor_Name,
            Vendor_Awb_No: isChecked.Vendor_Awb_No,
            Remark: isChecked.Remark,
            Manifest_Weight: isChecked.Manifest_Weight,
            MasterAwbNo: isChecked.MasterAwbNo,
            Dox_Spx: isChecked.Dox_Spx,
            BagNo: isChecked.BagNo,
        };
        try {
            const response = await putApi('/Master/updateManifestSetup', requestPayload);
            setModalIsOpen2(false);
        } catch (error) {
            console.error("Error submitting manifest: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while generating data. Please try again.',
            });
        }
    };



    return (
        <>
            <div className="body">
                <div className="container1" style={{ padding: "0px" }}>

                    <form onSubmit={handleSubmit} style={{ background: " #f2f4f3" }}>
                        <div className="fields2">
                            <div className="input-field3" >
                                <label htmlFor="">Manifest Date</label>
                                <DatePicker
                                    portalId="root-portal"
                                    selected={formData.maniDate}
                                    onChange={(date) => handleDateChange(date, "maniDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control form-control-sm"
                                />

                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">From City</label>
                                <Select
                                    options={getBranch.map(branch => ({
                                        value: branch.Branch_Code,   // adjust keys from your API
                                        label: branch.Branch_Name
                                    }))}
                                    value={
                                        formData.fromDest
                                            ? {
                                                value: formData.fromDest,
                                                label: getBranch.find(c => c.Branch_Code === formData.fromDest)?.Branch_Name
                                            }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            fromDest: selectedOption ? selectedOption.value : ""
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
                                />
                            </div>
                            <div className="input-field3" >
                                <label htmlFor="">To City</label>
                                <Select
                                    options={getCity.map(city => ({
                                        value: city.City_Code,   // adjust keys from your API
                                        label: city.City_Name
                                    }))}
                                    value={
                                        formData.toDest
                                            ? { value: formData.toDest, label: getCity.find(c => c.City_Code === formData.toDest)?.City_Name || "" }
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
                                />

                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Mode</label>
                                <Select
                                    options={getMode.map(mode => ({
                                        value: mode.Mode_Code,   // adjust keys from your API
                                        label: mode.Mode_Name
                                    }))}
                                    value={
                                        formData.mode
                                            ? { value: formData.mode, label: getMode.find(c => c.Mode_Code === formData.mode)?.Mode_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            mode: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Mode"
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


                            {isChecked.Vehicle_Detail &&
                                <div className="input-field3" >
                                    <label htmlFor="">Vehicle Detail</label>
                                    <Select
                                        options={getTransport.map(tra => ({
                                            value: tra.Transport_Code,   // adjust keys from your API
                                            label: tra.Transport_Name
                                        }))}
                                        value={
                                            formData.transportType
                                                ? { value: formData.transportType, label: getTransport.find(c => c.Transport_Code === formData.transportType)?.Transport_Name || "" }
                                                : null
                                        }
                                        onChange={(selectedOption) => {
                                            setFormData({
                                                ...formData,
                                                transportType: selectedOption ? selectedOption.value : ""
                                            });
                                            setInput(selectedOption.label.trim());
                                        }}
                                        placeholder="Vehicle Details"
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
                                </div>}

                            {isChecked.Vehicle_Type &&
                                <>
                                    <div className="input-field3" >
                                        <label htmlFor="">Vehicle Type</label>
                                        {
                                            isInput === "HIRE" ?
                                                <input type="text" placeholder="Vehicle Type"
                                                    value={formData.vehicleType}
                                                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} />
                                                :
                                                <Select
                                                    options={getVehicle.map(vehicle => ({
                                                        value: vehicle.vehicle_model,   // adjust keys from your API
                                                        label: vehicle.vehicle_model
                                                    }))}
                                                    value={
                                                        formData.vehicleType
                                                            ? { value: formData.vehicleType, label: getVehicle.find(c => c.vehicle_model === formData.vehicleType)?.vehicle_model || "" }
                                                            : null
                                                    }
                                                    onChange={(selectedOption) =>
                                                        setFormData({
                                                            ...formData,
                                                            vehicleType: selectedOption ? selectedOption.value : ""
                                                        })
                                                    }
                                                    placeholder="Vehicle Type"
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
                                        }

                                    </div>
                                    <div className="input-field3" >
                                        <label htmlFor="">Vehicle Number</label>
                                        {

                                            <input type="text" placeholder="Vehicle Number"
                                                value={formData.vehicleNo}
                                                onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })} />



                                        }

                                    </div>
                                </>}
                            {isChecked.Driver_Name &&
                                <>
                                    <div className="input-field3" >
                                        <label htmlFor="">Driver Name</label>
                                        <Select
                                            options={getDriver.map(driver => ({
                                                value: driver.Driver_Code,   // adjust keys from your API
                                                label: driver.Driver_Name
                                            }))}
                                            value={
                                                formData.driverName
                                                    ? { value: formData.driverName, label: getDriver.find(c => c.Driver_Code === formData.driverName)?.Driver_Name || "" }
                                                    : null
                                            }
                                            onChange={(selectedOption) =>
                                                setFormData({
                                                    ...formData,
                                                    driverName: selectedOption ? selectedOption.value : ""
                                                })
                                            }
                                            placeholder="Driver Name"
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
                                    <div className="input-field3" >
                                        <label htmlFor="">Driver Number</label>
                                        <input type="tel" placeholder="Driver Number" maxLength={10}
                                            value={formData.driverMobile} onChange={(e) => setFormData({ ...formData, driverMobile: e.target.value })} />
                                    </div>
                                </>}

                            {isChecked.Train_Name &&
                                <>
                                    <div className="input-field3">
                                        <label>Train Name</label>

                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={allTrainOptions}
                                            value={
                                                formData.Train_Code
                                                    ? allTrainOptions.find(opt => opt.value === formData.Train_Code)
                                                    : null
                                            }
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    Train_Code: selectedOption.value,
                                                }));
                                            }}
                                            placeholder="Select Train Name"
                                            isSearchable
                                            menuPortalTarget={document.body}
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
                                    <div className="input-field3" >
                                        <label htmlFor="">Train Number</label>
                                        <input type="tel" placeholder="Train Number"
                                            value={formData.driverMobile} onChange={(e) => setFormData({ ...formData, driverMobile: e.target.value })} />
                                    </div>
                                </>}

                            {isChecked.Flight_Name &&
                                <>
                                    <div className="input-field3" >
                                        <label>Flight Name</label>

                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={allFlightOptions}
                                            value={
                                                formData.Flight_Code
                                                    ? allFlightOptions.find(opt => opt.value === formData.Flight_Code)
                                                    : null
                                            }
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    Flight_Code: selectedOption.value,
                                                }));
                                            }}
                                            placeholder="Select Flight Name"
                                            isSearchable
                                            menuPortalTarget={document.body}
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
                                    <div className="input-field3" >
                                        <label htmlFor="">Flight Number</label>
                                        <input type="tel" placeholder="Flight Number"
                                            value={formData.driverMobile} onChange={(e) => setFormData({ ...formData, driverMobile: e.target.value })} />
                                    </div>
                                </>}


                            {isChecked.Vendor_Name && <div className="input-field3" >
                                <label htmlFor="">Vendor Name</label>
                                <Select
                                    options={getVendor.map(vendor => ({
                                        value: vendor.Vendor_Code,   // adjust keys from your API
                                        label: vendor.Vendor_Name
                                    }))}
                                    value={
                                        formData.vendorCode
                                            ? { value: formData.vendorCode, label: getVendor.find(c => c.Vendor_Code === formData.vendorCode)?.Vendor_Name || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setFormData({
                                            ...formData,
                                            vendorCode: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Vendor Name"
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

                            </div>}

                            {isChecked.Vendor_Awb_No && <div className="input-field3" >
                                <label htmlFor="">Vendor Awb No</label>
                                <input type="text" placeholder="Vendor Awb No" maxLength={10}
                                    value={formData.vendorAwbNo} onChange={(e) => setFormData({ ...formData, vendorAwbNo: e.target.value })} />
                            </div>}

                            {isChecked.Remark && <div className="input-field3" >
                                <label htmlFor="">Remark</label>
                                <input type="text" placeholder="Remark" value={formData.remark}
                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })} />
                            </div>}

                            {isChecked.MasterAwbNo && <div className="input-field3" >
                                <label htmlFor="">Master Awb No</label>
                                <input type="text" placeholder="Master Awb No" maxLength={10}
                                    value={formData.MAwbNo} onChange={(e) => setFormData({ ...formData, MAwbNo: e.target.value })} />
                            </div>}

                            {isChecked.Dox_Spx && <div className="input-field3" >
                                <label htmlFor="">Dox / Spx </label>
                                <select
                                    value={formData.DoxSpx} onChange={(e) => setFormData({ ...formData, DoxSpx: e.target.value })} >
                                    <option value="">Select Dox/Spx</option>
                                    <option value="Dox">Dox</option>
                                    <option value="Box">Box</option>
                                </select>
                            </div>}

                            {isChecked.BagNo && <div className="input-field3" >
                                <label htmlFor="">Bag No</label>
                                <input type="text" placeholder="Bag No" maxLength={10}
                                    value={formData.bagNo} onChange={(e) => setFormData({ ...formData, bagNo: e.target.value })} />
                            </div>}


                            {isChecked.Manifest_Weight && <div className="input-field3" >
                                <label htmlFor="">Manifest Weight</label>
                                <input type="text" placeholder="Manifest Weight" value={formData.manifestWeight}
                                    onChange={(e) => setFormData({ ...formData, manifestWeight: e.target.value })} />
                            </div>}

                            <div className="input-field3" >
                                <label htmlFor="" style={{ whiteSpace: "nowrap" }}>Bulk Docket Manifest</label>
                                <button type="button" className="ok-btn" style={{ height: "35px", width: "100%", fontSize: "14px", lineHeight: "1" }}
                                    onClick={() => { setModalIsOpen(true) }}>Bulk Docket Manifest</button>
                            </div>

                            <div className="input-field3" >
                                <label htmlFor="">Docket No</label>
                                <input type="text" placeholder="Search..." name="bookingWeight"
                                    value={formData.bookingWeight} onChange={handleFormChange} />
                            </div>


                            <div className="bottom-buttons" style={{ display: "flex", flexDirection: "row", marginTop: "20px", marginLeft: "10px", justifyContent: "center", alignItems: "center", }}>
                                <button type="button" className="ok-btn" style={{ width: "50px" }}>Find</button>
                                <button type="submit" className="ok-btn" style={{}}>Generate</button>
                                <button type="button" className="ok-btn" style={{ width: "50px" }}>Reset</button>
                                <button type="button" className="ok-btn" onClick={() => { setModalIsOpen2(true) }}>Setup</button>
                            </div>

                        </div>
                    </form>
                    <div className="table-container" style={{ padding: "10px", whiteSpace: "nowrap" }}>
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>Sr No.</th>
                                    <th scope="col">Docket.No</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Customer.Name</th>
                                    <th scope="col">Receiver</th>
                                    <th scope="col">Origin</th>
                                    <th scope="col">Destination</th>
                                    <th scope="col">QTY</th>
                                    <th scope="col">Weight</th>
                                    <th scope="col">Invoice.No</th>
                                    <th scope="col">Invoice.Value</th>
                                    <th scope="col">E-Way.Bill.No</th>
                                </tr>
                            </thead>

                            <tbody>
                                {selectedManifestRows.map((docket, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{docket.DocketNo}</td>
                                        <td style={{ width: "100px" }}>{docket.BookDate}</td>
                                        <td>{docket.customerName}</td>
                                        <td>{docket.consigneeName}</td>
                                        <td>{docket.fromDest}</td>
                                        <td>{docket.toDest}</td>
                                        <td>{docket.pcs}</td>
                                        <td>{docket.actualWt}</td>
                                        <td>{docket.invoiceNo}</td>
                                        <td>{docket.invoiceValue}</td>
                                        <td>{docket.eWayBillNo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-createmanifest" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle" style={{ display: "flex", flexDirection: "row" }}>
                                <header style={{ width: "95%", textAlign: "center" }}>Pending Manifest Data</header>
                                <button className="ok-btn" style={{ width: "5%", height: "100%", backgroundColor: "red" }}
                                    onClick={() => setModalIsOpen(false)}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className='container2' style={{ borderRadius: "0px", padding: "20px" }}>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", gap: "50px" }}>
                                    <div className="search-input" style={{ marginBottom: "10px" }}>
                                        <input
                                            className="add-input1"
                                            type="text"
                                            placeholder="search"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            style={{ marginLeft: "0%" }}
                                        />
                                        <button type="submit" title="search">
                                            <i className="bi bi-search"></i>
                                        </button>
                                    </div>
                                    <div className="input-field" style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                                        <label style={{ marginTop: "8px", textAlign: "end" }}>From Date</label>
                                        <DatePicker
                                            selected={fromDate}
                                            onChange={handleFromDateChange}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control form-control-sm"
                                            style={{ width: "120px", marginLeft: "10px" }}
                                        />
                                    </div>

                                    <div className="input-field" id="datepicker-portal" style={{ display: "flex", flexDirection: "row", gap: "10px", marginRight: "50px" }}>
                                        <label style={{ marginTop: "8px", textAlign: "end" }}>To Date</label>
                                        <DatePicker
                                            selected={toDate}
                                            onChange={handleToDateChange}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control form-control-sm"
                                            style={{ width: "120px", marginLeft: "10px" }}
                                        />
                                    </div>

                                    <div className="bottom-buttons">
                                        <button style={{ marginTop: "0px" }} className="ok-btn" onClick={handleDocketNoSelect}>Submit</button>
                                    </div>
                                </div>
                                <div className='table-container'>
                                    <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                                        <thead className='table-sm'>
                                            <tr>
                                                <th scope="col">
                                                    <input type="checkbox" style={{ height: "15px", width: "15px" }} checked={selectAll}
                                                        onChange={handleSelectAll} />
                                                </th>
                                                <th scope="col">Sr.No</th>
                                                <th scope="col">Docket.No</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Customer.Name</th>
                                                <th scope="col">Receiver</th>
                                                <th scope="col">Origin</th>
                                                <th scope="col">Destination</th>
                                                <th scope="col">QTY</th>
                                                <th scope="col">Weight</th>
                                                <th scope="col">Invoice.No</th>
                                                <th scope="col">Invoice.Value</th>
                                                <th scope="col">E-Way.Bill.No</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-body'>
                                            {filteredgetManifestData.map((manifest, index) => (
                                                <tr key={index}>
                                                    <td scope="col">
                                                        <input type="checkbox" style={{ height: "15px", width: "15px" }} checked={selectedRows.includes(index)}
                                                            onChange={() => handleRowSelect(index, manifest.DocketNo)} />
                                                    </td>
                                                    <td>{index + 1}</td>
                                                    <td>{manifest.DocketNo}</td>
                                                    <td style={{ width: "100px" }}>{manifest.BookDate}</td>
                                                    <td>{manifest.customerName}</td>
                                                    <td>{manifest.consigneeName}</td>
                                                    <td>{manifest.fromDest}</td>
                                                    <td>{manifest.toDest}</td>
                                                    <td>{manifest.pcs}</td>
                                                    <td>{manifest.actualWt}</td>
                                                    <td>{manifest.invoiceNo}</td>
                                                    <td>{manifest.invoiceValue}</td>
                                                    <td>{manifest.eWayBillNo}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

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
                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen2}
                        className="custom-modal-custCharges" contentLabel="Modal"
                        style={{
                            content: {
                                top: '50%',
                                left: '50%',
                                whiteSpace: "nowrap",
                                height: "auto"
                            },
                        }}>

                        <div className="custom modal-content">
                            <div className="header-tittle"><header>Charges</header></div>

                            <div className='container2'>
                                <form onSubmit={handleUpdate}>
                                    <div className="fields2">

                                        {/* 🔘 All Select */}
                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                name="all"
                                                checked={isAllChecked}
                                                onChange={handleCheckChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} />
                                            <label style={{ marginLeft: "10px", fontSize: "12px" }}>All Select</label>
                                        </div>

                                        {[
                                            "Vehicle_Detail", "Vehicle_Type", "Driver_Name", "Train_Name",
                                            "Flight_Name", "Vendor_Name", "Vendor_Awb_No", "Remark",
                                            "Manifest_Weight", "MasterAwbNo", "Dox_Spx", "BagNo"
                                        ].map((item, i) => (
                                            <div className="input-field1" style={{ display: "flex", flexDirection: "row" }} key={i}>
                                                <input type="checkbox"
                                                    name={item}
                                                    checked={isChecked[item] || false}
                                                    onChange={handleCheckChange}
                                                    style={{ width: "12px", height: "12px", marginTop: "5px" }} />
                                                <label style={{ marginLeft: "10px", fontSize: "12px" }}>{item}</label>
                                            </div>
                                        ))}

                                    </div>

                                    <div className='bottom-buttons'>
                                        <button className='ok-btn'>Submit</button>
                                        <button type="button" onClick={() => setModalIsOpen2(false)} className='ok-btn'>close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal>



                </div>
            </div>
        </>
    );
};


export default CreateManifest;