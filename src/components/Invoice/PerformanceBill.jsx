import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import "./permonce.css"
import Swal from "sweetalert2";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import { getApi, postApi, putApi, deleteApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
function PerformanceBill() {
    const getTodayDate = () => {
        const today = new Date();
        return today;
    };
    const parseDDMMYYYY = (str) => {
        if (!str) return null;
        const [day, month, year] = str.split("/");
        return new Date(`${year}-${month}-${day}`);
    };
    const [editIndex, setEditIndex] = useState(null);
    const [formData, setFormData] = useState({
        invoiceNo: "",
        invoiceID: null,
        invDate: getTodayDate(),
        invDueDate: getTodayDate(),
        DocketNo: "",
        ogCountry: "",
        destination: "",
        boxes: "",
        totalWt: "",
        ConsigneeName: "",
        ConsigneeAdd1: "",
        ConsigneeAdd2: "",
        ConsigneeState: "",
        ConsigneePin: "",
        Consignee_City: "",
        ConsigneeMob: "",
        ConsigneeEmail: "",
        ConsigneeGST: "",
        ConsigneeCountry: "",
        Shipper_Name: "",
        ShipperAdd: "",
        ShipperAdd2: "",
        ShipperCity: "",
        Shipper_StateCode: "",
        Shipper_GstNo: "",
        ShipperPin: "",
        ShipperPhone: "",
        ShipperEmail: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const [getState, setGetState] = useState([]);
    const [getCity, setGetCity] = useState([]);
    const [getCountry, setGetCountry] = useState([]);
    const [allReceiverOption, setAllReceiverOption] = useState([])
    const [allShipperOption, setAllShipperOption] = useState([])
    const [invoiceSubmittedData, setInvoiceSubmittedData] = useState([]);
    const [invoice, setInvoice] = useState({
        Items: "", HSN: "", QTY: 0, Rate: 0, Amount: 0
    });
    useEffect(() => {
        console.log(invoiceSubmittedData);
    }, [invoiceSubmittedData])
    useEffect(() => {
        console.log(formData);
    }, [formData])
    const handleInvoiceChange = (e) => {
        const { name, value } = e.target;
        setInvoice((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
   useEffect(()=>{
        setInvoice((prev)=>({
            ...prev,
            Amount:invoice.QTY*invoice.Rate,


        }))
    },[invoice.QTY,invoice.Rate])
    const handleAddRow = (e) => {
        e.preventDefault();

        if (!invoice.Items) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill atleast one item.',
                confirmButtonText: 'OK',
            });
            return;
        }
        if (editIndex !== null) {
            // update existing row
            const updated = [...invoiceSubmittedData];
            updated[editIndex] = invoice;
            setInvoiceSubmittedData(updated);
            setEditIndex(null);
        } else {
            // add new row
            setInvoiceSubmittedData((prev) => [...prev, invoice]);
        }
        setInvoice({
            Items: "", HSN: "", QTY: 0, Rate: 0, Amount: 0
        });
    };
    const resetAllForm = () => {
        setFormData({
            invoiceNo: "",
            invoiceID: null,
            invDate: getTodayDate(),
            invDueDate: getTodayDate(),
            DocketNo: "",
            ogCountry: "",
            destination: "",
            boxes: "",
            totalWt: "",
            ConsigneeName: "",
            ConsigneeAdd1: "",
            ConsigneeAdd2: "",
            ConsigneeState: "",
            ConsigneePin: "",
            Consignee_City: "",
            ConsigneeMob: "",
            ConsigneeEmail: "",
            ConsigneeGST: "",
            ConsigneeCountry: "",
            Shipper_Name: "",
            ShipperAdd: "",
            ShipperAdd2: "",
            ShipperCity: "",
            Shipper_StateCode: "",
            Shipper_GstNo: "",
            ShipperPin: "",
            ShipperPhone: "",
            ShipperEmail: "",
        });
        setInvoice({
            Items: "", HSN: "", QTY: 0, Rate: 0, Amount: 0
        });
        setInvoiceSubmittedData([]);
    }
    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString("en-CA");
    };
    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.Shipper_Name || !formData.invoiceNo) {
            return Swal.fire({
                icon: "warning",
                title: "Missing Field",
                text: "Fill all missing fields",
            });
        }
        if(invoiceSubmittedData.length<1)
        {
            return Swal.fire({
                icon: "warning",
                title: "Empty Items",
                text: "Select Atleast one item",
            });
        }
        try {
            const payload = {
                // Shipper
                Branch_code:JSON.parse(localStorage.getItem("Login"))?.Branch_Code || "MUM",
                ShipperName: formData.Shipper_Name,
                ShipperAddress: formData.ShipperAdd,
                Shipper_Address2: formData.ShipperAdd2,
                ShipperCity: formData.ShipperCity,
                ShipperStateCode: formData.Shipper_StateCode,
                ShipperPinCode: formData.ShipperPin,
                ShipperMobileNo: formData.ShipperPhone,
                ShipperGSTNo: formData.Shipper_GstNo,

                // Receiver
                ReceiverName: formData.ConsigneeName,
                ReceiverAddress: formData.ConsigneeAdd1,
                Receiver_Address2: formData.ConsigneeAdd2,
                ReceiverCity: formData.Consignee_City,
                ReceiverStateCode: formData.ConsigneeState,
                ReceiverPinCode: formData.ConsigneePin,
                ReceiverMobileNo: formData.ConsigneeMob,
                ReceiverGSTNo: formData.ConsigneeGST,

                // Invoice
                InvoiceNo: formData.invoiceNo,
                InvoiceDate: formatDate(formData.invDate),
                InvoiceDue: formatDate(formData.invDueDate),
                DocketNo: formData.DocketNo,
                Destination_Code: formData.destination,
                Qty: formData.boxes,
                Country_Name: formData.ogCountry,
                TotalWeight: formData.totalWt,
                // Items
                Items: invoiceSubmittedData,
            };

            const response = await postApi("/Smart/AddProformaInvoice", payload);

            if (response.success) {
                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Proforma Invoice saved successfully!",
                });
                // reset form + items
                resetAllForm();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: response.message || "Error saving invoice.",
                });
            }
        } catch (err) {
            console.error("Save error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        }
    };


    const handleSearch = async () => {
        if (!formData.invoiceNo) {
            return Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Invoice Number is Required",
            });
        }

        try {
            const response = await getApi(
                `/Smart/GetProformaInvoiceByNo?InvoiceNo=${formData.invoiceNo}`
            );

            if (response.status === 1 && response.data.length > 0) {
                const responseInvoice = response.data[0]; // assuming only one invoice is returned

                Swal.fire({
                    icon: "success",
                    title: "Data Fetched",
                    text: `Invoice ${formData.invoiceNo} has been fetched successfully`,
                });

                // ✅ Update formData with response values
                setFormData((prev) => ({
                    ...prev,
                    invoiceNo: responseInvoice.InvoiceNo,
                    invoiceID: responseInvoice.InvoiceID,
                    invDate: parseDDMMYYYY(responseInvoice.InvoiceDate),
                    invDueDate: parseDDMMYYYY(responseInvoice.InvoiceDue),
                    ogCountry:responseInvoice.Country_Name,
                    DocketNo: responseInvoice.DocketNo,
                    destination: responseInvoice.Destination_Code,
                    boxes: responseInvoice.Qty,
                    totalWt: responseInvoice.TotalWeight,
                    Shipper_Name: responseInvoice.ShipperName,
                    ShipperAdd: responseInvoice.ShipperAddress,
                    ShipperAdd2: responseInvoice.Shipper_Address2,
                    ShipperCity: responseInvoice.ShipperCity,
                    Shipper_StateCode: responseInvoice.ShipperStateCode,
                    ShipperPin: responseInvoice.ShipperPinCode,
                    ShipperPhone: responseInvoice.ShipperMobileNo,
                    Shipper_GstNo: responseInvoice.ShipperGSTNo,
                    ConsigneeName: responseInvoice.ReceiverName,
                    ConsigneeAdd1: responseInvoice.ReceiverAddress,
                    ConsigneeAdd2: responseInvoice.Receiver_Address2,
                    Consignee_City: responseInvoice.ReceiverCity,
                    ConsigneeState: responseInvoice.ReceiverStateCode,
                    ConsigneePin: responseInvoice.ReceiverPinCode,
                    ConsigneeMob: responseInvoice.ReceiverMobileNo,
                    ConsigneeGST: responseInvoice.ReceiverGSTNo,
                }));


                // ✅ SetgetInvoice line items
                if (responseInvoice.Items) {
                    setInvoiceSubmittedData(
                        responseInvoice.Items.map((item) => ({
                            Items: item.Items,
                            HSN: item.HSN,
                            QTY: item.QTY,
                            Rate: item.Rate,
                            Amount: item.Amount,
                        }))
                    );
                }


            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: response.message || "Error fetching invoice.",
                });
            }
        } catch (err) {
            console.error("Save error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        }
    }
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!formData.invoiceNo) {
            return Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Invoice Number is Required",
            });
        }

        try {
            const payload = {
                // Shipper
                Branch_code:JSON.parse(localStorage.getItem("Login"))?.Branch_Code || "MUM",
                ShipperName: formData.Shipper_Name,
                ShipperAddress: formData.ShipperAdd,
                Shipper_Address2: formData.ShipperAdd2,
                ShipperCity: formData.ShipperCity,
                ShipperStateCode: formData.Shipper_StateCode,
                ShipperPinCode: formData.ShipperPin,
                ShipperMobileNo: formData.ShipperPhone,
                ShipperGSTNo: formData.Shipper_GstNo,

                // Receiver
                ReceiverName: formData.ConsigneeName,
                ReceiverAddress: formData.ConsigneeAdd1,
                Receiver_Address2: formData.ConsigneeAdd2,
                ReceiverCity: formData.Consignee_City,
                ReceiverStateCode: formData.ConsigneeState,
                ReceiverPinCode: formData.ConsigneePin,
                ReceiverMobileNo: formData.ConsigneeMob,
                ReceiverGSTNo: formData.ConsigneeGST,

                // Invoice
                InvoiceID: formData.invoiceID,
                InvoiceNo: formData.invoiceNo,
                InvoiceDate: formatDate(formData.invDate),
                InvoiceDue: formatDate(formData.invDueDate),
                DocketNo: formData.DocketNo,
                Destination_Code: formData.destination,
                Qty: formData.boxes,
                Country_Name: formData.ogCountry,
                TotalWeight: formData.totalWt,

                // Items
                Items: invoiceSubmittedData,
            };
            console.log(payload);
            const response = await putApi("/Smart/updateProformaInvoice", payload);

            if (response.success) {
                Swal.fire({
                    icon: "success",
                    title: "Updated",
                    text: "Proforma Invoice updated successfully!",
                });
                // reset form + items
                resetAllForm();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: response.message || "Error updating invoice.",
                });
            }
        } catch (err) {
            console.error("Save error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        }
    };
    const handleDelete = async (e) => {
        e.preventDefault();
        if (!formData.invoiceID) {
            return Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Invoice ID is Required",
            });
        }
        try {
            const response = await deleteApi(`Smart/DeleteProformaInvoice?InvoiceID=${formData.invoiceID}`);

            if (response.status == 1) {
                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: `${formData.invoiceNo} is deleted`,
                });
                // reset form + items
                resetAllForm();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: response.message || "Error deleting invoice.",
                });
            }
        } catch (err) {
            console.error("Save error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        }

    }

    // const currentRows = zones.slice(indexOfFirstRow, indexOfLastRow);

    // const totalPages = Math.ceil(zones.length / rowsPerPage);

    // const handlePreviousPage = () => {
    //     if (currentPage > 1) setCurrentPage(currentPage - 1);
    // };

    // const handleNextPage = () => {
    //     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    // };
    const fetchReceiverData = async () => {
        try {
            const response = await getApi("/Master/GetReceiver");

            if (response.status === 1 && Array.isArray(response.Data)) {
                const cleanedData = response.Data.map((receiver) => ({
                    value: receiver.Receiver_Code,
                    label: receiver.Receiver_Name?.trim() || "",
                    Receiver_Email: receiver.Receiver_Email?.trim() || "",
                    Receiver_Mob: receiver.Receiver_Mob?.trim() || "",
                    Receiver_Add1: receiver.Receiver_Add1?.trim() || "",
                    Receiver_Add2: receiver.Receiver_Add2?.trim() || "",
                    Receiver_Pin: receiver.Receiver_Pin?.trim() || "",
                    GSTNo: receiver.GSTNo?.trim() || "",
                    State_Code: receiver.State_Code?.trim() || "",
                    City_Code: receiver.City_Code?.trim() || "",
                    City_Name: receiver.City_Name?.trim() || "",
                    State_Name: receiver.State_Name?.trim() || "",

                }));
                console.log(cleanedData);
                setAllReceiverOption(cleanedData);
            } else {
                console.warn("Receiver API returned no data.");
                setAllReceiverOption([]);
            }
        } catch (error) {
            console.error("Error fetching receiver data:", error);
        }
    };
    const fetchShipper = async () => {
        try {
            const response = await getApi("/Master/GetSmartShipperMaster");

            if (response.status === 1 && Array.isArray(response.data)) {
                const cleanedData = response.data.map((shipper) => ({
                    value: shipper.Shipper_Code,
                    label: shipper.Shipper_Name?.trim() || "",
                    shipper_Email: shipper.Email?.trim() || "",
                    shipper_Mob: shipper.Mobile?.trim() || "",
                    shipper_Add1: shipper.Add1?.trim() || "",
                    shipper_Add2: shipper.Add2?.trim() || "",
                    shipper_Pin: shipper.Pin?.trim() || "",
                    GSTNo: shipper.GSTNo?.trim() || "",
                    State_Code: shipper.State_Code?.trim() || "",
                    City_Code: shipper.City_Code?.trim() || "",
                    City_Name: shipper.City_Name?.trim() || "",
                    State_Name: shipper.State_Name?.trim() || "",
                }));
                console.log(cleanedData);
                setAllShipperOption(cleanedData);
            } else {
                console.warn("Receiver API returned no data.");
                setAllShipperOption([]);
            }
        } catch (error) {
            console.error("Error fetching receiver data:", error);
        }
    };
    const fetchData = async (endpoint, setData) => {


        try {
            const response = await getApi(endpoint);
            // Check if the response contains data, then update the corresponding state
            if (response && response.Data) {
                setData(Array.isArray(response.Data) ? response.Data : []);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error(`Error fetching data from ${endpoint}:`, err);

        } finally {
            // Set loading state to false after fetching
        }
    };

    useEffect(() => {
        fetchReceiverData();
        fetchShipper();

        fetchData('/Master/GetState', setGetState);
        fetchData('/Master/getdomestic', setGetCity);
        fetchData('/Master/getCountry', setGetCountry);

    }, []);
    return (
        <>

            <div className="body">
                <div className="container1">

                    <div className='container-2'>
                        <div className="card left-card">
                            <div className="section-title">SHIPPER</div>
                            <form style={{ margin: "0px", padding: "0px" }}>
                                <div className="fields2 row mx-0 ">
                                    <div className="input-field col-md-6">
                                        <label className="form-label">Shipper</label>
                                        <CreatableSelect
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={allShipperOption}
                                            value={
                                                formData.Shipper_Name ?
                                                    {
                                                        value: formData.Shipper_Name,
                                                        label: formData.Shipper_Name,
                                                    }
                                                    : null
                                            }
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    Shipper_Name: selectedOption.label,
                                                    ShipperAdd: selectedOption.shipper_Add1,
                                                    ShipperAdd2: selectedOption.shipper_Add2,
                                                    ShipperCity: selectedOption.City_Code,
                                                    Shipper_StateCode: selectedOption.State_Code,
                                                    Shipper_GstNo: selectedOption.GSTNo,
                                                    ShipperPin: selectedOption.shipper_Pin,
                                                    ShipperPhone: selectedOption.shipper_Mob,
                                                    ShipperEmail: selectedOption.shipper_Email,
                                                }));
                                            }}
                                            placeholder="Select Shipper Name"
                                            isSearchable
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: base => ({ ...base, zIndex: 9999 })
                                            }}
                                            formatCreateLabel={(inputValue) => inputValue}
                                        />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Shipper Address</label>
                                        <input type="text" className="form-control" placeholder="Shipper Address"
                                            value={formData.ShipperAdd}
                                            onChange={(e) => setFormData({ ...formData, ShipperAdd: e.target.value })} />
                                    </div>
                                    <div className="input-field col-md-6">
                                        <label className="form-label">Shipper Address</label>
                                        <input type="text" className="form-control" placeholder="Shipper Address"
                                            value={formData.ShipperAdd2}
                                            onChange={(e) => setFormData({ ...formData, ShipperAdd2: e.target.value })} />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Pin Code</label>
                                        <input type="tel" className="form-control" maxLength={6} pattern='[0-9]{6}' placeholder="Pin Code"
                                            value={formData.ShipperPin}
                                            onChange={(e) => setFormData({ ...formData, ShipperPin: e.target.value })} />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Shipper City</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getCity.map((city) => ({
                                                value: city.City_Code,
                                                label: city.City_Name,
                                            }))}
                                            value={
                                                formData.ShipperCity
                                                    ? {
                                                        value: formData.ShipperCity,
                                                        label:
                                                            getCity.find((c) => c.City_Code === formData.ShipperCity)
                                                                ?.City_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setFormData({
                                                    ...formData,
                                                    ShipperCity: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select City"
                                            isSearchable={true}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            }}
                                        />
                                    </div>
                                    <div className="input-field col-md-6">
                                        <label className="form-label">Shipper State</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getState.map((st) => ({
                                                value: st.State_Code,
                                                label: st.State_Name,
                                            }))}
                                            value={
                                                formData.Shipper_StateCode
                                                    ? {
                                                        value: formData.Shipper_StateCode,
                                                        label:
                                                            getState.find((s) => s.State_Code === formData.Shipper_StateCode)
                                                                ?.State_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setFormData({
                                                    ...formData,
                                                    Shipper_StateCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select State"
                                            isSearchable={true}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            }}
                                        />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Mobile No</label>
                                        <input type="tel" className="form-control" maxLength={10} placeholder="Mobile No" value={formData.ShipperPhone}
                                            onChange={(e) => setFormData({ ...formData, ShipperPhone: e.target.value })} />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">GST No</label>
                                        <input type="text" className="form-control" maxLength={16} placeholder="GST No"
                                            value={formData.Shipper_GstNo}
                                            onChange={(e) => setFormData({ ...formData, Shipper_GstNo: e.target.value })} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="card right-card mx-0">
                            <div className="section-title">RECEIVER</div>
                            <form action="" style={{ margin: "0px", padding: "0px" }}>
                                <div className="fields2 row mx-0">
                                    <div className="input-field col-md-6">
                                        <label className="form-label">Receiver</label>
                                        <CreatableSelect
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={allReceiverOption}
                                            value={
                                                formData.ConsigneeName
                                                    ? {
                                                        value: formData.ConsigneeName,
                                                        label: formData.ConsigneeName,
                                                    }
                                                    : null
                                            }
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ConsigneeName: selectedOption.label,
                                                    Consignee_City: selectedOption.City_Code,
                                                    ConsigneeState: selectedOption.State_Code,
                                                    ConsigneePin: selectedOption.Receiver_Pin,
                                                    ConsigneeMob: selectedOption.Receiver_Mob,
                                                    ConsigneeEmail: selectedOption.Receiver_Email,
                                                    ConsigneeAdd1: selectedOption.Receiver_Add1,
                                                    ConsigneeAdd2: selectedOption.Receiver_Add2,
                                                    ConsigneeGST: selectedOption.GSTNo,
                                                }));
                                                // setSelectedOriginPinCode(selectedOption.Receiver_Pin)
                                            }}
                                            placeholder="Select Receiver Name"
                                            isSearchable
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: base => ({ ...base, zIndex: 9999 })
                                            }}
                                            formatCreateLabel={(inputValue) => inputValue}
                                        />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Receiver Address</label>
                                        <input type="text" className="form-control" placeholder='Receiver Address'
                                            value={formData.ConsigneeAdd1}
                                            onChange={(e) => setFormData({ ...formData, ConsigneeAdd1: e.target.value })} />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Receiver Address</label>
                                        <input type="text" className="form-control" placeholder='Receiver Address'
                                            value={formData.ConsigneeAdd2}
                                            onChange={(e) => setFormData({ ...formData, ConsigneeAdd2: e.target.value })} />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Pin Code</label>
                                        <input type="tel" className="form-control" maxLength={6} pattern="[0-9]{6}" placeholder='Pin Code'
                                            value={formData.ConsigneePin}
                                            onChange={(e) => setFormData({ ...formData, ConsigneePin: e.target.value })} />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Receiver City</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getCity.map((city) => ({
                                                value: city.City_Code,
                                                label: city.City_Name,
                                            }))}
                                            value={
                                                formData.Consignee_City
                                                    ? {
                                                        value: formData.Consignee_City,
                                                        label:
                                                            getCity.find((c) => c.City_Code === formData.Consignee_City)
                                                                ?.City_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setFormData({
                                                    ...formData,
                                                    Consignee_City: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select City"
                                            isSearchable={true}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            }}
                                        />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Receiver State</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getState.map((st) => ({
                                                value: st.State_Code,
                                                label: st.State_Name,
                                            }))}
                                            value={
                                                formData.ConsigneeState
                                                    ? {
                                                        value: formData.ConsigneeState,
                                                        label:
                                                            getState.find((s) => s.State_Code === formData.ConsigneeState)
                                                                ?.State_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setFormData({
                                                    ...formData,
                                                    ConsigneeState: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select State"
                                            isSearchable={true}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            }}
                                        />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">Mobile No</label>
                                        <input type="tel" className="form-control" maxLength={10} placeholder='Mobile No'
                                            value={formData.ConsigneeMob}
                                            onChange={(e) => setFormData({ ...formData, ConsigneeMob: e.target.value })} />
                                    </div>

                                    <div className="input-field col-md-6">
                                        <label className="form-label">GST No</label>
                                        <input type="text" className="form-control" maxLength={16} placeholder='GST No'
                                            value={formData.ConsigneeGST}
                                            onChange={(e) => setFormData({ ...formData, ConsigneeGST: e.target.value })} />
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>

                 <div className="card mt-0" style={{width:"100%"}}>
  <div className="section-title">Courier Details</div>
  <form className="m-0 px-2 py-2" >
    <div className="row g-3 mx-0">
      
      {/* Invoice No */}
      <div className="input-field col-12 col-sm-12 col-md-6 col-lg-3">
        <label className="form-label">Invoice No</label>
        <input
          type="tel"
          className="form-control"
          placeholder="Invoice No"
          value={formData.invoiceNo}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
        />
      </div>

      {/* Invoice Date */}
      <div className="input-field col-12 col-sm-12 col-md-6 col-lg-3">
        <label className="form-label">Invoice Date</label>
        <DatePicker
          portalId="rootPortal"
          selected={formData.invDate}
          onChange={(date) => setFormData({ ...formData, invDate: date })}
          dateFormat="dd/MM/yyyy"
          className="form-control form-control-sm"
        />
      </div>

      {/* Due Date */}
      <div className="input-field col-12 col-sm-12 col-md-6 col-lg-3">
        <label className="form-label">Due Date</label>
        <DatePicker
          portalId="rootPortal"
          selected={formData.invDueDate}
          onChange={(date) => setFormData({ ...formData, invDueDate: date })}
          dateFormat="dd/MM/yyyy"
          className="form-control form-control-sm"
        />
      </div>

      {/* Docket No */}
      <div className="input-field col-12 col-sm-12 col-md-6 col-lg-3">
        <label className="form-label">Docket No</label>
        <input
          type="text"
          className="form-control"
          placeholder="Docket No"
          value={formData.DocketNo}
          onChange={(e) => setFormData({ ...formData, DocketNo: e.target.value })}
        />
      </div>

      {/* Country of Origin */}
      <div className="input-field col-12 col-sm-12 col-md-6 col-lg-3">
        <label className="form-label">Country of Origin</label>
        <Select
          className="blue-selectbooking"
          classNamePrefix="blue-selectbooking"
          options={getCountry.map((st) => ({
            value: st.Country_Code,
            label: st.Country_Name,
          }))}
          value={
            formData.ogCountry
              ? {
                  value: formData.ogCountry,
                  label:
                    getCountry.find((s) => s.Country_Code === formData.ogCountry)
                      ?.Country_Name || "",
                }
              : null
          }
          onChange={(selected) =>
            setFormData({
              ...formData,
              ogCountry: selected ? selected.value : "",
            })
          }
          placeholder="Select Country"
          isSearchable={true}
          isClearable={false}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>

      {/* Final Destination */}
      <div className="input-field col-12 col-sm-12 col-md-6 col-lg-3">
        <label className="form-label">Final Destination</label>
        <Select
          className="blue-selectbooking"
          classNamePrefix="blue-selectbooking"
          options={getCity.map((city) => ({
            value: city.City_Code,
            label: city.City_Name,
          }))}
          value={
            formData.destination
              ? {
                  value: formData.destination,
                  label:
                    getCity.find((c) => c.City_Code === formData.destination)
                      ?.City_Name || "",
                }
              : null
          }
          onChange={(selected) =>
            setFormData({
              ...formData,
              destination: selected ? selected.value : "",
            })
          }
          placeholder="Select Destination"
          isSearchable={true}
          isClearable={false}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>

      {/* No of Boxes */}
      <div className="input-field col-12 col-sm-12 col-md-6 col-lg-3">
        <label className="form-label">No of Boxes</label>
        <input
          type="tel"
          className="form-control"
          placeholder="No of Boxes"
          value={formData.boxes}
          onChange={(e) => setFormData({ ...formData, boxes: e.target.value })}
        />
      </div>

      {/* Total Weight */}
      <div className="input-field col-12 col-sm-12 col-md-6 col-lg-3">
        <label className="form-label">Total Weight</label>
        <input
          type="tel"
          className="form-control"
          placeholder="Total Weight"
          value={formData.totalWt}
          onChange={(e) => setFormData({ ...formData, totalWt: e.target.value })}
        />
      </div>

    </div>
  </form>
</div>


                    <div className='table-container' style={{ margin: "0px" }}>
                        <table className='table table-bordered table-sm'>
                            <thead className='table-info table-sm'>
                                <tr>
                                    <th scope="col">Desciption Of Goods</th>
                                    <th scope="col">HSN Code</th>
                                    <th scope="col">QTY</th>
                                    <th scope="col">Rate</th>
                                    <th scope="col">Total Amount</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>
                                <tr>
                                    <td>
                                        <input type="text" placeholder="ITEM" name="Items"
                                            style={{ textAlign: "center" }} value={invoice.Items}
                                            onChange={handleInvoiceChange} />
                                    </td>
                                    <td>
                                        <input type="text" placeholder="HSN NO" name="HSN"
                                            style={{ textAlign: "center" }} value={invoice.HSN}
                                            onChange={handleInvoiceChange} />
                                    </td>
                                    <td>
                                        <input type="tel" placeholder="QTY" name="QTY"
                                            style={{ textAlign: "center" }} value={invoice.QTY}
                                            onChange={handleInvoiceChange} />
                                    </td>
                                    <td>
                                        <input type="tel" placeholder="Rate" name="Rate"
                                            style={{ textAlign: "center" }} value={invoice.Rate}
                                            onChange={handleInvoiceChange} />
                                    </td>
                                    <td>
                                        <input type="tel" placeholder="TOTAL" name="Amount"
                                            style={{ textAlign: "center" }} value={invoice.Amount}
                                            onChange={handleInvoiceChange} />
                                    </td>
                                    <td>
                                        <button className="ok-btn" style={{ width: "30px", height: "30px" }}
                                            onClick={handleAddRow}>
                                            <i className="bi bi-plus" style={{ fontSize: "18px" }}></i>
                                        </button>
                                    </td>
                                </tr>
                                {Array.isArray(invoiceSubmittedData) && invoiceSubmittedData.map((data, index) => (
                                    <tr key={index}>

                                        <td>{data.Items}</td>
                                        <td>{data.HSN}</td>
                                        <td>{data.QTY}</td>
                                        <td>{data.Rate}</td>
                                        <td>{data.Amount}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <button className='edit-btn'
                                                    onClick={() => {
                                                        setInvoice({
                                                            Items: data.Items,
                                                            HSN: data.HSN,
                                                            QTY: data.QTY,
                                                            Rate: data.Rate,
                                                            Amount: data.Amount,
                                                        });
                                                        setEditIndex(index);
                                                    }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button onClick={() => {
                                                    setInvoiceSubmittedData(invoiceSubmittedData.filter((_, ind) => ind !== index));
                                                    setEditIndex(null);
                                                    setInvoice({ Items: "", HSN: "", QTY: 0, Rate: 0, Amount: 0 });
                                                }}
                                                    className='edit-btn'><i className='bi bi-trash'></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* <div className="pagination">
                        <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            {'<'}
                        </button>
                        <span style={{ color: "#333", padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                        <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            {'>'}
                        </button>
                    </div> */}

                    <div className="bottom-buttons" style={{display:"flex",flexWrap:"wrap"}}>
                        <button className='ok-btn' onClick={handleSave}>Save</button>
                        <button className='ok-btn' onClick={handleUpdate}>Update</button>
                        <button className='ok-btn' onClick={handleDelete}>Delete</button>
                        <button className='ok-btn' onClick={resetAllForm}>Cancel</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PerformanceBill;