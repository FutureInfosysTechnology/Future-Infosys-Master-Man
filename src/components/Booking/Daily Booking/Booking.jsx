import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
// import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import { getApi, postApi, putApi, deleteApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import Swal from "sweetalert2";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

function Booking() {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [modalIsOpen3, setModalIsOpen3] = useState(false);
    const [modalIsOpen4, setModalIsOpen4] = useState(false);
    const [modalIsOpen5, setModalIsOpen5] = useState(false);
    const [modalIsOpen6, setModalIsOpen6] = useState(false);
    const [modalIsOpen7, setModalIsOpen7] = useState(false);
    const [modalIsOpen8, setModalIsOpen8] = useState(false);
    const [modalIsOpen9, setModalIsOpen9] = useState(false);
    const [getReceiver, setGetReceiver] = useState([]);
    const [getCustomerdata, setgetCustomerdata] = useState([]);
    const [getCountry, setGetCountry] = useState([]);
    const [getVendor, setGetVendor] = useState([]);
    const [getState, setGetState] = useState([]);
    const [getCity, setGetCity] = useState([]);  
    const [getMode, setGetMode] = useState([]);
    const [selectedMode_Code, setSelectedMode_Code] = useState('');
    const [selectedModeName, setSelectedModeName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [shipperSuggestions, setShipperSuggestions] = useState([]);
    const [receiverSuggestions, setReceiverSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggleActive, setToggleActive] = useState(false);
    const [isFovChecked, setIsFovChecked] = useState(false);
    const [isDocketChecked, setIsDocketChecked] = useState(false);
    const [isDeliveryChecked, setIsDeliveryChecked] = useState(false);
    const [isPackingChecked, setIsPackingChecked] = useState(false);
    const [isGreenChecked, setIsGreenChecked] = useState(false);
    const [isHamaliChecked, setIsHamaliChecked] = useState(false);
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [isInsuranceChecked, setIsInsuranceChecked] = useState(false);
    const [isODAChecked, setIsODAChecked] = useState(false);
    const [isFuelChecked, setIsFuelChecked] = useState(false);
    const [isRemarkChecked, setIsRemarkChecked] = useState(false);
    const [isEWayChecked, setIsEWayChecked] = useState(false);
    const [isInvoiceValue, setIsInvoiceValue] = useState(false);
    const [isInvoiceNo, setIsInvoiceNo] = useState(false);
    const [dispatchDate, SetdispatchDate] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalVolWt, setTotalVolWt] = useState(0);
    const [totalActWt, setTotalActWt] = useState(0);
    const [totalChargeWt, setTotalChargeWt] = useState(0);
    const [totalVolWt1, setTotalVolWt1] = useState(0);
    const [totalActWt1, setTotalActWt1] = useState(0);
    const [totalChargeWt1, setTotalChargeWt1] = useState(0);
    const [selectedOriginPinCode, setSelectedOriginPinCode] = useState("");
    const [selectedOriginCityName, setSelectedOriginCityName] = useState("");
    const [selectedOriginZoneName, setSelectedOriginZoneName] = useState("");
    const [selectedDestPinCode, setSelectedDestPinCode] = useState("");
    const [selectedDestCityName, setSelectedDestCityName] = useState("");
    const [selectedDestZoneName, setSelectedDestZoneName] = useState("");
    const [bookingDate, setBookingDate] = useState('');
    const [open, setOpen] = useState(false);

     const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

    const getTodayDate = () => {
  const today = new Date();
  return today;
    };

    // ===============================Enter Block =============================
    const handleKeyDown = (e) => {
        // Prevent Enter key from submitting or opening anything unintentionally
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };



    const [formData, setFormData] = useState({
        custName: "",
        shipper: "",
        receiver: "",
        Location_Code: "",
        Customer_Code: "",
        DocketNo: "",
        BookDate: getTodayDate(),
        Receiver_Code: "",
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
        Mode_Code: "",
        OriginCode: "",
        DestinationCode: "",
        DispatchDate: getTodayDate(),
        DoxSpx: "",
        RateType: "",
        QtyOrderEntry: "",
        ActualWt: 0,
        VendorWt: 0,
        VendorAmt: 0,
        VolumetricWt: 0,
        ChargedWt: 0,
        RatePerkg: 0,
        Rate: 0,
        FuelPer: 0,
        FuelCharges: 0,
        FovChrgs: 0,
        DocketChrgs: 0,
        ODAChrgs: 0,
        DeliveryChrgs: 0,
        PackingChrgs: 0,
        GreenChrgs: 0,
        HamaliChrgs: 0,
        OtherCharges: 0,
        InsuranceChrgs: 0,
        TotalAmt: 0,
        Status: "",
        Vendor_Code: "",
        VendorAwbNo: "",
        WebAgent: "",
        ExptDateOfDelvDt: "",
        Shipper_Name: "",
        ShipperAdd: "",
        ShipperPin: "",
        ShipperPhone: "",
        UserName: "",
        InvoiceNo: "",
        InvValue: 0,
        EwayBill: "",
        InvDate: "",
        BillParty: "",
        DestName: "",
        Mode_Code: "",
    });
    const [shipperData, setShipperData] = useState({
        ActualShipper: "",
        ShipperAdd2: "",
        ShipperAdd3: "",
        ShipperCity: "",
        Shipper_StateCode: "",
        Shipper_GstNo: "",
        ShipperPin: "",
        ShipperPhone: "",
        ShipperEmail: ""
    });
    const [receiverData, setReceiverData] = useState({
        ConsigneeName: "",
        ConsigneeAdd1: "",
        ConsigneeAdd2: "",
        ConsigneeState: "",
        ConsigneePin: "",
        Consignee_City: "",
        ConsigneeMob: "",
        ConsigneeEmail: "",
        ConsigneeGST: "",
        ConsigneeCountry: ""
    });
    const [vendorData, setVendorData] = useState({
        Vendor_Code1: "",
        Vendor_Code2: "",
        VendorAwbNo1: "",
        VendorAwbNo2: ""
    });

    const [gstData, setGstData] = useState({
        CGSTPer: '',
        CGSTAMT: '',
        SGSTPer: '',
        SGSTAMT: '',
        IGSTPer: '',
        IGSTAMT: '',
        GSTPer: '',
        TotalGST: ''
    });

    const [remarkData, setRemarkData] = useState({
        Remark: "",
        MHWNo: ""
    });
    const [vendorsubmittedData, setVendorSubmittedData] = useState([]);
    const [vendorVolumetric, setVendorvolumetric] = useState({
        Length: 0,
        Width: 0,
        Height: 0,
        Qty: 0,
        DivideBy: "",
        VolmetricWt: 0,
        ActualWt: 0,
        ChargeWt: 0
    });
    const [InvoicesubmittedData, setInvoiceSubmittedData] = useState([]);
    const [invoiceData, setInvoiceData] = useState({
        PoNo: "",
        PoDate: "",
        InvoiceNo: "",
        InvoiceValue: "",
        Description: "",
        Qty: 0,
        EWayBillNo: "",
        Remark: "",
        InvoiceImg: ""
    });
    const [submittedData, setSubmittedData] = useState([]);
    const [volumetricData, setVolumetricData] = useState({
        Length: 0,
        Width: 0,
        Height: 0,
        Qty: 0,
        DivideBy: "",
        VolmetricWt: 0,
        ActualWt: 0,
        ChargeWt: 0
    })

    const handleClick = () => {
        console.log("Button clicked aaakkkka");
    };
    <button onClick={handleClick}>Click me</button>


    const handleCustomerSelect = (customer) => {
        setCustomerName(customer.Customer_Name);
        setSuggestions([]);

        setFormData((prev) => ({
            ...prev,
            Customer_Code: customer.Customer_Code,
            Customer_Name: customer.Customer_Name
        }));
    };



    const handleCustomerNameChange = (e) => {
        const name = e.target.value;
        setCustomerName(name);

        // Optional: If you want to clear Customer_Code when typing
        setFormData((prevFormData) => ({
            ...prevFormData,

        }));


    };



    const buttonStyle = {
        padding: "0.5rem 1.5rem",
        borderRadius: "5px",
        border: "none",
        fontWeight: "bold",
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
    };



    const filteredShipper = (name) => {
        if (name) {
            const filtered = getReceiver.filter((shipper) =>
                shipper.Receiver_Name.toLowerCase().includes(name.toLowerCase()));
            setShipperSuggestions(filtered);
        } else {
            setShipperSuggestions([]);
        }
    }

    const handleShipperNameChange = (e) => {
        const name = e.target.value;
        setFormData({ ...formData, Shipper_Name: name });
        filteredShipper(name);
        const matchedShipper = shipperSuggestions.find(shipper => shipper.Receiver_Name.toLowerCase() === name.toLowerCase());

        if (matchedShipper) {
            setFormData({ ...formData, Shipper_Name: matchedShipper.Receiver_Name });
        } else {
            setFormData({ ...formData, Shipper_Name: name });
        }
    }

    const handleShipperSelect = (shipper) => {
        setFormData({ ...formData, Shipper_Name: shipper.Receiver_Name });
        setShipperSuggestions([]);
    }






    const handleOriginPinCodeChange = async (e) => {
        const pincode = e.target.value;
        setSelectedOriginPinCode(pincode);

        if (pincode.length === 6 && /^[0-9]+$/.test(pincode)) {
            try {
                const response = await getApi(`/Master/PincodeFinder?pincode=${pincode}`);
                if (response.status === 1 && Array.isArray(response.data) && response.data.length > 0) {
                    const { City_Name, City_Code, Zone_Name } = response.data[0];
                    setFormData(prev => ({
                        ...prev,
                        OriginCode: City_Code || "",
                        Origin_code: City_Name || "",
                        Origin_zone: Zone_Name || ""
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        OriginCode: "",
                        Origin_code: "Not Found",
                        Origin_zone: "Not Found"
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch pincode info:", error);
            }
        }
    };

    // ✅ Destination pincode change
    const handleDestPinCodeChange = async (e) => {
        const pincode = e.target.value;
        setSelectedDestPinCode(pincode);

        if (pincode.length === 6 && /^[0-9]+$/.test(pincode)) {
            try {
                const response = await getApi(`/Master/PincodeFinder?pincode=${pincode}`);
                if (response.status === 1 && Array.isArray(response.data) && response.data.length > 0) {
                    const { City_Name, City_Code, Zone_Name } = response.data[0];
                    setFormData(prev => ({
                        ...prev,
                        City_Code: City_Code || "",
                        City_Name: City_Name || "",
                        Zone_Name: Zone_Name || ""
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        City_Code: "",
                        City_Name: "Not Found",
                        Zone_Name: "Not Found"
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch pincode info:", error);
            }
        }
    };




    // Fetch receiver list from API and clean data
    const handleSaveReceiverFromBooking = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            const requestBody = {
                receiverCode: "", // Auto-generate in backend if needed
                receiverName: formData.ConsigneeName,
                receiverAdd1: formData.ConsigneeAdd1,
                receiverAdd2: formData.ConsigneeAdd2,
                receiverPin: formData.ConsigneePin || "",
                cityCode: formData.Consignee_City || "",
                stateCode: formData.ConsigneeState || "",
                receiverMob: formData.ConsigneeMob,
                receiverEmail: formData.ConsigneeEmail,
                gstNo: formData.ConsigneeGST,
                hsnNo: "",
                sms: "",
                emailId: "",
                whatApp: ""
            };

            console.log("POSTING TO API:", requestBody);

            const response = await postApi("/Master/AddReceiver", requestBody, "POST");

            if (response.status === 1) {
                Swal.fire("Success", "Receiver saved successfully.", "success");

                // ✅ Refresh list
                await fetchReceivers();

                // ✅ Auto-select newly added receiver
                setFormData((prev) => ({
                    ...prev,
                    ConsigneeName: requestBody.receiverName
                }));

                // ✅ Close modal after save
                setModalIsOpen1(false);
            } else {
                Swal.fire("Error", response.message || "Save failed", "error");
            }
        } catch (err) {
            console.error("API Error", err);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };



    const fetchReceivers = async () => {
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

                allReceiverOption(cleanedData);
            } else {
                console.warn("Receiver API returned no data.");
                allReceiverOption([]);
            }
        } catch (error) {
            console.error("Error fetching receiver data:", error);
        }
    };


    // Filter receiver suggestions based on input
    const filteredReceiver = (name) => {
        if (name) {
            const filtered = getReceiver.filter((receiver) =>
                receiver.Receiver_Name.toLowerCase().includes(name.toLowerCase()) ||
                receiver.Receiver_Email.toLowerCase().includes(name.toLowerCase()) ||
                receiver.Receiver_Mob.toLowerCase().includes(name.toLowerCase()) ||
                receiver.GSTNo.toLowerCase().includes(name.toLowerCase())
            );
            setReceiverSuggestions(filtered);
        } else {
            setReceiverSuggestions([]);
        }
    };

    // Handle input change when typing receiver name
    const handleReceiverNameChange = (e) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            ConsigneeName: name

        }));

        filteredReceiver(name);

        const matchedReceiver = getReceiver.find(
            (receiver) => receiver.Receiver_Name?.trim().toLowerCase() === name.trim().toLowerCase()
        );

        if (matchedReceiver) {
            handleReceiverSelect(matchedReceiver);
        }
    };

    const handleReceiverSelect = (receiver) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            Receiver_Code: receiver.Receiver_Code?.trim() || "",
            ConsigneeName: receiver.Receiver_Name?.trim() || "",
            ConsigneeAdd1: receiver.Receiver_Add1?.trim() || "",
            ConsigneeAdd2: receiver.Receiver_Add2?.trim() || "",
            ConsigneePin: receiver.Receiver_Pin?.trim() || "",
            Consignee_City: receiver.City_Name?.trim() || "",  // ✅ FIXED HERE
            ConsigneeState: receiver.State_Code?.trim() || "",
            ConsigneeMob: receiver.Receiver_Mob?.trim() || "",
            ConsigneeEmail: receiver.Receiver_Email?.trim() || "",
            ConsigneeGST: receiver.GSTNo?.trim() || "",
            ConsigneeCountry: "India"
        }));

        setReceiverSuggestions([]);
    };


    // =======================================================================



    const onToggle = () => setToggleActive(!toggleActive);

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("bookingState"));
        if (savedState) {
            setIsFovChecked(savedState.isFovChecked || false);
            setIsDocketChecked(savedState.isDocketChecked || false);
            setIsDeliveryChecked(savedState.isDeliveryChecked || false);
            setIsPackingChecked(savedState.isPackingChecked || false);
            setIsGreenChecked(savedState.isGreenChecked || false);
            setIsHamaliChecked(savedState.isHamaliChecked || false);
            setIsOtherChecked(savedState.isOtherChecked || false);
            setIsInsuranceChecked(savedState.isInsuranceChecked || false);
            setIsODAChecked(savedState.isODAChecked || false);
            setIsFuelChecked(savedState.isFuelChecked || false);
            setIsRemarkChecked(savedState.isRemarkChecked || false);
            setIsEWayChecked(savedState.isEWayChecked || false);
            setIsInvoiceValue(savedState.isInvoiceValue || false);
            setIsInvoiceNo(savedState.isInvoiceNo || false);
            SetdispatchDate(savedState.dispatchDate || false);
        }
    }, []);

    const handleCheckboxChange = (field, value) => {
        const newState = {
            [field]: value
        };
        const currentState = JSON.parse(localStorage.getItem("bookingState")) || {};
        localStorage.setItem("bookingState", JSON.stringify({ ...currentState, ...newState }));
    };

    const handleFovChange = (e) => {
        setIsFovChecked(e.target.checked);
        handleCheckboxChange('isFovChecked', e.target.checked);
    }

    const handleDocketChange = (e) => {
        setIsDocketChecked(e.target.checked);
        handleCheckboxChange('isDocketChecked', e.target.checked);
    }

    const handleDeliveryChange = (e) => {
        setIsDeliveryChecked(e.target.checked);
        handleCheckboxChange('isDeliveryChecked', e.target.checked);
    }

    const handlePackingChange = (e) => {
        setIsPackingChecked(e.target.checked);
        handleCheckboxChange('isPackingChecked', e.target.checked);
    }

    const handleGreenChange = (e) => {
        setIsGreenChecked(e.target.checked);
        handleCheckboxChange('isGreenChecked', e.target.checked);
    }

    const handleHamaliChange = (e) => {
        setIsHamaliChecked(e.target.checked);
        handleCheckboxChange('isHamaliChecked', e.target.checked);
    }

    const handleOtherChange = (e) => {
        setIsOtherChecked(e.target.checked);
        handleCheckboxChange('isOtherChecked', e.target.checked);
    }

    const handleInsuranceChange = (e) => {
        setIsInsuranceChecked(e.target.checked);
        handleCheckboxChange('isInsuranceChecked', e.target.checked);
    }

    const handleODAChange = (e) => {
        setIsODAChecked(e.target.checked);
        handleCheckboxChange('isODAChecked', e.target.checked);
    }

    const handleFuelChange = (e) => {
        setIsFuelChecked(e.target.checked);
        handleCheckboxChange('isFuelChecked', e.target.checked);
    }

    const handleRemark = (e) => {
        setIsRemarkChecked(e.target.checked);
        handleCheckboxChange('isRemarkChecked', e.target.checked);
    }

    const handleEWayBill = (e) => {
        setIsEWayChecked(e.target.checked);
        handleCheckboxChange('isEWayChecked', e.target.checked);
    }

    const handleInvoiceValue = (e) => {
        setIsInvoiceValue(e.target.checked);
        handleCheckboxChange('isInvoiceValue', e.target.checked);
    }

    const handleInvoiceNo = (e) => {
        setIsInvoiceNo(e.target.checked);
        handleCheckboxChange('isInvoiceNo', e.target.checked);
    }

    const handledispatch = (e) => {
        SetdispatchDate(e.target.checked);
        handleCheckboxChange('dispatchDate', e.target.checked);
    }




    const fetchData = async (endpoint, setData) => {
        setLoading(true); // Set loading state to true

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
            setError(err);
        } finally {
            setLoading(false); // Set loading state to false after fetching
        }
    };




    // Fetch data for each category using useEffect
    useEffect(() => {
        fetchData('/Master/getCustomerdata', setgetCustomerdata);
        fetchData('/Master/GetReceiver', setGetReceiver);
        // fetchData('/Master/AllCustomers', setAllCustomers);
        fetchData('/Master/getCountry', setGetCountry);
        fetchData('/Master/getVendor', setGetVendor);
        fetchData('/Master/GetState', setGetState);
        fetchData('/Master/getdomestic', setGetCity);
        fetchData('/Master/getMode', setGetMode);

    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setVolumetricData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleVendorChange = (e) => {
        const { name, value } = e.target;
        setVendorvolumetric((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInvoiceDetailChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const totalVol = vendorsubmittedData.reduce((acc, data) => acc + parseFloat(data.VolmetricWt || 0), 0);
        const totalAct = vendorsubmittedData.reduce((acc, data) => acc + parseFloat(data.ActualWt || 0), 0);
        const totalCharge = vendorsubmittedData.reduce((acc, data) => acc + parseFloat(data.ChargeWt || 0), 0);

        setTotalVolWt(totalVol);
        setTotalActWt(totalAct);
        setTotalChargeWt(totalCharge);
    }, [vendorsubmittedData]);


    useEffect(() => {
        const totalVol1 = submittedData.reduce((acc, data) => acc + parseFloat(data.VolmetricWt || 0), 0);
        const totalAct1 = submittedData.reduce((acc, data) => acc + parseFloat(data.ActualWt || 0), 0);
        const totalCharge1 = submittedData.reduce((acc, data) => acc + parseFloat(data.ChargeWt || 0), 0);

        setTotalVolWt1(totalVol1);
        setTotalActWt1(totalAct1);
        setTotalChargeWt1(totalCharge1);
    }, [submittedData]);

    const handleAddRow = (e) => {
        e.preventDefault();

        if (!volumetricData.ActualWt || !volumetricData.ChargeWt) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in the empty fields.',
                confirmButtonText: 'OK',
            });
            return;
        }

        setSubmittedData((prev) => [...prev, volumetricData]);
        setVolumetricData({
            Length: "",
            Width: "",
            Height: "",
            Qty: "",
            DivideBy: "",
            VolmetricWt: "",
            ActualWt: 0,
            ChargeWt: ""
        });
    };

    const handleVendorAddRow = (e) => {
        e.preventDefault();

        if (!vendorVolumetric.ActualWt || !vendorVolumetric.ChargeWt) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in the empty fields.',
                confirmButtonText: 'OK',
            });
            return;
        }

        setVendorSubmittedData((prev) => [...prev, vendorVolumetric]);
        setVendorvolumetric({
            Length: 0,
            Width: 0,
            Height: 0,
            Qty: 0,
            DivideBy: 0,
            VolmetricWt: 0,
            ActualWt: 0,
            ChargeWt: 0
        });
    };

    const handleInvoiceAddRow = (e) => {
        e.preventDefault();

        if (!invoiceData.EWayBillNo) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in the empty fields.',
                confirmButtonText: 'OK',
            });
            return;
        }

        setInvoiceSubmittedData((prev) => [...prev, invoiceData]);
        setInvoiceData({
            PoNo: "",
            PoDate: "",
            InvoiceNo: "",
            InvoiceValue: "",
            Description: "",
            Qty: 0,
            EWayBillNo: "",
            Remark: "",
            InvoiceImg: ""
        });
    };

    // =================================close weight ==============================




    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await getApi('/Master/getCustomerdata');
                if (response?.length) {
                    setgetCustomerdata(response);
                    console.log('✅ Customer data loaded');
                }
            } catch (err) {
                console.error('🚨 Error loading customer data:', err);
            }
        };
        fetchCustomerData();
    }, []);

    // 🔁 Fetch Mode Data
    useEffect(() => {
        const fetchModeData = async () => {
            try {
                const response = await getApi('/Master/getMode');
                if (response?.length) {
                    setGetMode(response);
                    console.log('✅ Mode data loaded');
                }
            } catch (err) {
                console.error('🚨 Error loading mode data:', err);
            }
        };
        fetchModeData();
    }, []);

    // 🎯 Mode Name Select Handler
    const handleModeNameChange = (e) => {
        const modeName = e.target.value;
        setSelectedModeName(modeName);

        const selectedMode = getMode.find((mode) => mode.Mode_Name === modeName);
        if (selectedMode) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                Mode_Code: selectedMode.Mode_Code // ✅ this must match
            }));
        }
    };



    useEffect(() => {
        const calculateGstDetails = async (Customer_Code, Mode_Code) => {
            try {
                const response = await getApi(
                    `/Booking/calculateGST?Customer_Code=${Customer_Code}&Mode_Code=${Mode_Code}`
                );
                if (response?.status === 1) {
                    const gst = response.Data;
                    console.log('✅ GST API Response:', gst);

                    setFormData((prev) => ({
                        ...prev,
                        Fuel_Charges: gst.Fuel_Charges,
                        FovChrgs: gst.Fov_Charges,
                        DocketChrgs: gst.Docket_Charges,
                        DeliveryChrgs: gst.Dilivery_Charges,
                        PackingChrgs: gst.Packing_Charges,
                        GreenChrgs: gst.Green_Charges,
                        HamaliChrgs: gst.Hamali_Charges,
                        OtherCharges: gst.Other_Charges,
                        InsuranceChrgs: gst.Insurance_Charges,
                        FuelCharges: gst.FuelCharges,
                        FuelPer: gst.FuelChargesPercent,
                        CGST: gst.CGSTAMT,
                        SGST: gst.SGSTAMT,
                        IGST: gst.IGSTAMT,
                        TotalGST: gst.TotalGST,
                        TotalAmt: gst.TotalAmt
                    }));

                    setGstData({
                        CGSTAMT: gst.CGSTAMT,
                        SGSTAMT: gst.SGSTAMT,
                        IGSTAMT: gst.IGSTAMT,
                        TotalGST: gst.TotalGST,
                        CGSTPer: gst.CGSTPer,
                        SGSTPer: gst.SGSTPer,
                        IGSTPer: gst.IGSTPer,
                        GSTPer: gst.GSTPer
                    });
                }
            } catch (error) {
                console.error("❌ Error in GST API:", error);
            }
        };


        if (formData.Customer_Code && formData.Mode_Code && formData.Rate) {
            calculateGstDetails(formData.Customer_Code, formData.Mode_Code, formData.Rate);
        }
    }, [formData.Customer_Code, formData.Mode_Code, formData.Rate]);

    // 📦 Auto calculate freight rate
    useEffect(() => {
        const actual = parseFloat(formData.ActualWt) || 0;
        const volumetric = parseFloat(formData.VolumetricWt) || 0;
        const manualCharged = parseFloat(formData.ChargedWt) || 0;
        const ratePerKg = parseFloat(formData.RatePerkg) || 0;

        const highestWeight = Math.max(actual, volumetric, manualCharged);
        const freightAmount = highestWeight * ratePerKg;

        if (freightAmount > 0) {
            setFormData((prev) => ({
                ...prev,
                Rate: freightAmount.toFixed(2)
            }));
        }
    }, [formData.ActualWt, formData.VolumetricWt, formData.ChargedWt, formData.RatePerkg]);









    // ================================Rate+All Charges calculate=======================





    const handleSubmit = async (e) => {
        e.preventDefault();
        // Step 1: Basic Validation Logic
        const errors = [];
        // if (!formData.DocketNo) errors.push("DocketNo is required");
        if (!formData.BookDate) errors.push("Booking Date is required");
        if (!formData.Customer_Code) errors.push("Customer is required");
        if (!formData.ActualWt) errors.push("ActualWt is required");
        if (!formData.DestinationCode) errors.push("Destination_Name is required");
        if (!formData.Mode_Code) errors.push("Mode_Name is required");
        if (!formData.OriginCode) errors.push("Origin_Code is required");
        if (!formData.QtyOrderEntry || parseFloat(formData.QtyOrderEntry) <= 0) errors.push("Quantity must be greater than 0");
        if (!formData.DoxSpx) errors.push("DoxSpx is required");
        if (!formData.RateType) errors.push("RateType is required");

        // You can add more required validations here as needed...

        // Step 2: If errors, show and return early
        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: errors.map(err => `<div>${err}</div>`).join(''),
            });
            return;
        }

        // Step 3: Continue if no errors
        const requestBody = {
            Location_Code: "MUM",
            DocketNo: formData.DocketNo,
            BookDate: formData.BookDate,
            Customer_Code: formData.Customer_Code,
            Receiver_Code: formData.Receiver_Code,
            Consignee_Name: formData.ConsigneeName,
            Consignee_Add1: formData.ConsigneeAdd1,
            Consignee_Add2: formData.ConsigneeAdd2,
            Consignee_State: formData.ConsigneeState,
            Consignee_Pin: formData.ConsigneePin,
            Consignee_City: formData.Consignee_City,
            Consignee_Mob: formData.ConsigneeMob,
            Consignee_Email: formData.ConsigneeEmail,
            Consignee_GST: formData.ConsigneeGST,
            Consignee_Country: formData.ConsigneeCountry,
            Mode_Code: formData.Mode_Code,
            Origin_code: formData.OriginCode,
            Origin_zone: formData.Origin_zone,
            Destination_Code: formData.DestinationCode,
            DispatchDate: formData.DispatchDate,
            DoxSpx: formData.DoxSpx,
            RateType: formData.RateType,
            Qty: formData.QtyOrderEntry,
            ActualWt: formData.ActualWt,
            VendorWt: formData.VendorWt,
            VendorAmt: formData.VendorAmt,
            VolumetricWt: formData.VolumetricWt,
            ChargedWt: formData.ChargedWt,
            RatePerkg: formData.RatePerkg,
            Rate: formData.Rate,
            FuelPer: formData.FuelPer,
            FuelCharges: formData.FuelCharges,
            FovChrgs: formData.FovChrgs,
            DocketChrgs: formData.DocketChrgs,
            ODAChrgs: formData.ODAChrgs,
            DeliveryChrgs: formData.DeliveryChrgs,
            PackingChrgs: formData.PackingChrgs,
            GreenChrgs: formData.GreenChrgs,
            HamaliChrgs: formData.HamaliChrgs,
            OtherCharges: formData.OtherCharges,
            InsuranceChrgs: formData.InsuranceChrgs,
            IGSTPer: gstData.IGSTPer,
            IGSTAMT: gstData.IGSTAMT,
            CGSTPer: gstData.CGSTPer,
            CGSTAMT: gstData.CGSTAMT,
            SGSTPer: gstData.SGSTPer,
            SGSTAMT: gstData.SGSTAMT,
            TotalAmt: formData.TotalAmt,
            Status: formData.Status,
            Vendor_Code: formData.Vendor_Code,
            Vendor_Code1: vendorData.Vendor_Code1,
            Vendor_Code2: vendorData.Vendor_Code2,
            VendorAwbNo: formData.VendorAwbNo,
            VendorAwbNo1: vendorData.VendorAwbNo1,
            VendorAwbNo2: vendorData.VendorAwbNo2,
            Shipper_Code: formData.shipper,
            Shipper_Name: formData.Shipper_Name,
            ActualShipper: shipperData.ActualShipper,
            ShipperAdd: formData.ShipperAdd,
            ShipperAdd2: shipperData.ShipperAdd2,
            ShipperAdd3: shipperData.ShipperAdd3,
            ShipperCity: shipperData.ShipperCity,
            Shipper_StateCode: shipperData.Shipper_StateCode,
            Shipper_GstNo: shipperData.Shipper_GstNo,
            ShipperPin: formData.ShipperPin,
            ShipperPhone: formData.ShipperPhone,
            ShipperEmail: shipperData.ShipperEmail,
            UserName: formData.UserName,
            InvoiceNo: formData.InvoiceNo,
            InvValue: formData.InvValue,
            EwayBill: formData.EwayBill,
            InvDate: formData.InvDate,
            BillParty: formData.BillParty,
            Remark: remarkData.Remark,
            MHWNo: remarkData.MHWNo,
            DestName: formData.DestName,
            MultiInvoice: InvoicesubmittedData.map((invoice) => ({
                PoNo: invoice.PoNo,
                PoDate: invoice.PoDate,
                InvoiceNo: invoice.InvoiceNo,
                InvoiceValue: invoice.InvoiceValue,
                Description: invoice.Description,
                Qty: invoice.Qty,
                EWayBillNo: invoice.EWayBillNo,
                Remark: invoice.Remark,
                InvoiceImg: invoice.InvoiceImg
            })),
            Volumetric: submittedData.map((volumetric) => ({
                Length: volumetric.Length,
                Width: volumetric.Width,
                Height: volumetric.Height,
                Qty: volumetric.Qty,
                DivideBy: volumetric.DivideBy,
                VolmetricWt: volumetric.VolmetricWt,
                ActualWt: volumetric.ActualWt,
                ChargeWt: volumetric.ChargeWt
            })),
            Vendorvolumetric: vendorsubmittedData.map((vendor) => ({
                Length: vendor.Length,
                Width: vendor.Width,
                Height: vendor.Height,
                Qty: vendor.Qty,
                DivideBy: vendor.DivideBy,
                VolmetricWt: vendor.VolmetricWt,
                ActualWt: vendor.ActualWt,
                ChargeWt: vendor.ChargeWt
            }))
        };

        // Step 4: Submit
        try {
            const response = await postApi('/Booking/OderEntry', requestBody, 'POST');
            if (response.Success === 1) {
                // Clear all data
                resetAllForms(); // Optional: extract form resetting to its own function
                Swal.fire('Saved!', response.Message || 'Your changes have been saved.', 'success');
                setModalIsOpen8(false);
            }
        } catch (error) {
            console.error('Unable to save Booking Data:', error);
        }
    };


    const resetAllForms = () => {
        setFormData({

            shipper: "",
            receiver: "",
            Location_Code: "",
            DocketNo: "",
            BookDate: "",
            Customer_Code: "",
            Origin_code: '',
            Origin_zone: '',
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
            Mode_Code: "",
            OriginCode: "",
            DestinationCode: "",
            DispatchDate: "",
            DoxSpx: "",
            RateType: "",
            QtyOrderEntry: "",
            ActualWt: 0,
            VendorWt: 0,
            VendorAmt: 0,
            VolumetricWt: 0,
            ChargedWt: 0,
            RatePerkg: 0,
            Rate: 0,
            FuelPer: 0,
            FuelCharges: 0,
            FovChrgs: 0,
            DocketChrgs: 0,
            ODAChrgs: 0,
            DeliveryChrgs: 0,
            PackingChrgs: 0,
            GreenChrgs: 0,
            HamaliChrgs: 0,
            OtherCharges: 0,
            InsuranceChrgs: 0,
            TotalAmt: 0,
            Status: "",
            Vendor_Code: "",
            VendorAwbNo: "",
            WebAgent: "",
            ExptDateOfDelvDt: "",
            Shipper_Name: "",
            ShipperAdd: "",
            ShipperPin: "",
            ShipperPhone: "",
            UserName: "",
            InvoiceNo: "",
            InvValue: 0,
            EwayBill: "",
            InvDate: "",
            BillParty: "",
            DestName: "",
            City_Name: '',
            Zone_Name: ''



        });
        setSelectedOriginPinCode('');
        setSelectedDestPinCode('');
        setSelectedModeName('');




        setVendorData({
            Vendor_Code1: "",
            Vendor_Code2: "",
            VendorAwbNo1: "",
            VendorAwbNo2: ""
        });

        setGstData({
            IGSTPer: 0,
            IGSTAMT: 0,
            CGSTPer: 0,
            CGSTAMT: 0,
            SGSTPer: 0,
            SGSTAMT: 0
        });

        setRemarkData({
            Remark: "",
            MHWNo: ""
        });

        setVendorvolumetric({
            Length: 0,
            Width: 0,
            Height: 0,
            Qty: 0,
            DivideBy: 0,
            VolmetricWt: 0,
            ActualWt: 0,
            ChargeWt: 0
        });

        setVolumetricData({
            Length: 0,
            Width: 0,
            Height: 0,
            Qty: 0,
            DivideBy: 0,
            VolmetricWt: 0,
            ActualWt: 0,
            ChargeWt: 0,
        });

        setInvoiceData({
            PoNo: "",
            PoDate: "",
            InvoiceNo: "",
            InvoiceValue: "",
            Description: "",
            Qty: 0,
            EWayBillNo: "",
            Remark: "",
            InvoiceImg: ""
        });
    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.ShipperPhone.length !== 10 || formData.Consignee_Mob.length !== 10) {
            Swal.fire('Error', 'Mobile numbers must be exactly 10 digits.', 'error');
            return;
        }
        const payload = {
            BookDate: bookingDate,
            Customer_Code: formData.Customer_Code,
            Shipper_Name: formData.ShipperName,
            ShipperPhone: formData.ShipperPhone,
            Consignee_Name: formData.Consignee_Name,
            Consignee_Pin: formData.Consignee_Pin,
            Consignee_Mob: formData.Consignee_Mob,
            Mode_code: formData.Mode_code,
            Origin_code: formData.Origin_code,
            Destination_Code: formData.Destination_Code,
            Qty: String(formData.Pcs),
            ActualWt: String(formData.ActualWt),
            VolumetricWt: String(formData.volumetricWt || '0'),
            ChargedWt: String(formData.Chargablewt),
            Rate: String(formData.Amount)
        };
        try {
            const res = await putApi(`/Booking/UpdateShortBooking?docketNo=${formData.DocketNo}`, payload);
            if (res.status === 1) {
                Swal.fire('Updated!', res.message || 'Booking updated.', 'success');
                resetAllForms();
            } else Swal.fire('Error', res.message || 'Update failed.', 'error');
        } catch (err) {
            Swal.fire('Error', 'Something went wrong while updating.', 'error');
        }
    };


    const handleSearch = async () => {
        if (!formData.DocketNo) return Swal.fire("Warning", "Enter Docket No", "warning");
        try {
            const res = await getApi(`/Booking/getShortBookingByDocketNo?DocketNo=${formData.DocketNo}`);
            if (res.status === 1 && res.data) {
                const data = res.data;
                const customer = getCustomerdata.find(c => c.Customer_Code.toString() === data.Customer_Code);
                const mode = getMode.find(m => m.Mode_Code === data.Mode_code);
                const origin = getCity.find(c => c.City_Code === data.Origin_code);
                const destination = getCity.find(c => c.City_Code === data.Destination_Code);

                setFormData({
                    Docket_No: data.DocketNo,
                    Customer_Code: data.Customer_Code,
                    Customer_Name: customer?.Customer_Name || '',
                    ShipperName: data.Shipper_Name,
                    ShipperPhone: data.ShipperPhone,
                    Consignee_Name: data.Consignee_Name,
                    Consignee_Pin: data.Consignee_Pin,
                    Consignee_Mob: data.Consignee_Mob,
                    Mode_code: data.Mode_code,
                    Mode_Name: mode?.Mode_Name || '',
                    Origin_code: data.Origin_code,
                    Destination_Code: data.Destination_Code,
                    Pcs: data.Qty,
                    ActualWt: data.ActualWt,
                    volumetricWt: data.VolumetricWt,
                    Chargablewt: data.ChargedWt,
                    Amount: data.Rate,
                    Cityname: ''
                });

                setBookingDate(data.BookDate);
                setGetMode(mode ? { label: mode.Mode_Name, value: mode.Mode_Code } : null);
                setGetCity(origin ? { label: origin.City_Name, value: origin.City_Code } : null);
                setSelectedDestCityName(destination ? { label: destination.City_Name, value: destination.City_Code } : null);
            } else {
                Swal.fire("Not Found", res.message || "Booking not found.", "info");
            }
        } catch (err) {
            Swal.fire("Error", "Failed to fetch booking data.", "error");
        }
    };


    const handleDelete = async (docketNo) => {
        if (!docketNo) return Swal.fire('Warning', 'Docket No is required', 'warning');

        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: `Delete booking with Docket No: ${docketNo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#d33'
        });

        if (confirm.isConfirmed) {
            try {
                const res = await deleteApi(`/Booking/deleteShortBooking?docketNo=${docketNo}`);
                if (res.status === 1) {
                    Swal.fire('Deleted!', res.message, 'success');
                    resetAllForms();
                } else {
                    Swal.fire('Error', res.message, 'error');
                }
            } catch (err) {
                Swal.fire('Error', 'Failed to delete booking.', 'error');
            }
        }
    };



    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    // const currentRows = getCustomerdata.slice(indexOfFirstRow, indexOfLastRow);
    // const totalPages = Math.ceil(getCustomerdata.length / rowsPerPage);









    const allModeOptions = getMode.map(mode => ({ label: mode.Mode_Name, value: mode.Mode_Code }));
    const allCityOptions = getCity.map(dest => ({
        label: dest.City_Name,         // Display name in dropdown
        value: dest.City_Code,         // City code for backend
        originName: dest.origin_Name,  // Additional origin name
        originCode: dest.Origin_code,  // Origin code
        pincode: dest.Pincode,         // Pincode
        zone: dest.Zone_Name           // Zone
    }));
    const allVendorOption = getVendor.map(Vendr => ({ label: Vendr.Vendor_Name, value: Vendr.Vendor_Code }));
    const allReceiverOption = getReceiver.map(receiver => ({
        label: receiver.Receiver_Name,
        value: receiver.Receiver_Code
    }));

    const allCustomerOptions = getCustomerdata.map(cust => ({ label: cust.Customer_Name, value: cust.Customer_Code.toString() }));




    return (
        <>

            <div className="body" style={{margin:"0px",padding:"0px"}}>

                <div className="container1"  style={{padding:"0px",margin:"0px",paddingBottom:"0.8rem"}}>
                    <div className="container-2" style={{border: "transparent",padding:"0px"}}>
                        <div className="left-card " style={{margin:"0px"}} >


                            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}  style={{backgroundColor:"white"}}>
                                <div className="section-title">Customer Docket Information</div>

                                <div className="fields2" >
                                    <div className="input-field">
                                        <label htmlFor="shipper">Docket No</label>
                                        <input
                                            type="text"
                                            className={toggleActive ? "docket-input" : "docket-input disabled"}
                                            placeholder={toggleActive ? "Enter Docket No" : "Auto Booking On"}
                                            disabled={!toggleActive}
                                            value={formData.DocketNo}
                                            onChange={(e) => setFormData({ ...formData, DocketNo: e.target.value })}
                                        />
                                    </div>

                                    <div className="toggle-button">
                                        <Toggle
                                            onClick={onToggle}
                                            on={<h2>ON</h2>}
                                            off={<h2>OFF</h2>}
                                            offstyle="danger"
                                            active={toggleActive}
                                        />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="booking-date">Booking Date</label>
                                        <DatePicker
                                                      selected={formData.BookDate}
                                                      onChange={(date) => handleDateChange(date, "BookDate")}
                                                      dateFormat="dd/MM/yyyy"
                                                      className="form-control form-control-sm"
                                                    />
                                    </div>
                                </div>

                                <div className="fields2" >
                                    <div style={{ display: "flex", flexDirection: "row", width: "98%" }}>


                                        <div className="input-field" style={{ width: "80%", position: "relative" }}>
                                            <label>Customer Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={allCustomerOptions}
                                                value={
                                                    formData.Customer_Code
                                                        ? allCustomerOptions.find(opt => opt.value === formData.Customer_Code)
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        Customer_Code: selectedOption.value,
                                                        Customer_Name: selectedOption.label
                                                    }));
                                                }}
                                                placeholder="Select Customer"
                                                isSearchable
                                                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll area
                                                        styles={{
                                                            menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps it above other UI
                                                        }}
                                            />
                                        </div>
                                        <div className="input-field" style={{ width: "25%" }}>
                                            <label>Code</label>
                                            <input
                                                type="tel"
                                                placeholder="Code"
                                                value={formData.Customer_Code || ''}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="container-fluid" style={{paddingLeft:"1rem"}}>
                                    <div className="row g-2 align-items-end">
                                        {/* Shipper Name Input */}
                                        <div className="col-md-10 col-sm-9 col-12">
                                            <div className="input-field">
                                                <label htmlFor="shipper">Shipper Name</label>
                                                <input
                                                    type="text"
                                                    id="shipper-name"
                                                    name="Shipper_Name"
                                                    value={formData.Shipper_Name}
                                                    onChange={handleShipperNameChange}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Shipper Name"
                                                    className="form-control custom-input"
                                                />
                                                {shipperSuggestions.length > 0 && (
                                                    <div className="dropdown1">
                                                        {shipperSuggestions.map((shipper) => (
                                                            <div
                                                                key={shipper.Receiver_Name}
                                                                onClick={() => handleShipperSelect(shipper)}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {shipper.Receiver_Name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Plus Button */}
                                        <div className="col-md-2 col-sm-3 col-12">
                                            <label className="invisible">+</label>
                                            <button
                                                type="button"
                                                className="ok-btn btn btn-outline-primary w-100"
                                                onClick={() => setModalIsOpen(true)}
                                            >
                                                <i className="bi bi-plus" style={{ fontSize: "20px" }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>



                                <div className="container-fluid" style={{paddingLeft:"1rem"}}>
                                    <div className="row g-2">
                                        <div className="col-12">
                                            <div className="input-field">
                                                <label htmlFor="shipper-address">Shipper Address</label>
                                                <input
                                                    type="text"
                                                    id="shipper-address"
                                                    placeholder="Shipper Address"
                                                    value={formData.ShipperAdd}
                                                    onChange={(e) => setFormData({ ...formData, ShipperAdd: e.target.value })}
                                                    className="form-control custom-input"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>






                                <div className="fields2">




                                    <div className="input-field">
                                        <label htmlFor="">Shipper Mobile No</label>
                                        <input
                                            type="tel"
                                            placeholder="Shipper Mobile No"
                                            maxLength={10}
                                            value={formData.ShipperPhone}
                                            onChange={(e) => setFormData({ ...formData, ShipperPhone: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="">Pin_Code</label>
                                        <input
                                            type="text"
                                            placeholder="Pin Code"
                                            maxLength={6}
                                            value={formData.ShipperPin}
                                            onChange={(e) => setFormData({ ...formData, ShipperPin: e.target.value })}
                                        />
                                    </div>

                                    {/* Origin Row */}
                                    <div style={{ whiteSpace:"nowrap", display: "flex" ,width: "100%",gap:"2px" }}>
                                        <div className="input-field1" style={{ width: "21%"}}>
                                            <label>Pincode</label>
                                            <input
                                                type="tel"
                                                placeholder="Pin Code"
                                                value={selectedOriginPinCode}
                                                onChange={handleOriginPinCodeChange}
                                                maxLength={6}
                                                pattern="[0-9]{6}"
                                            />
                                        </div>

                                        <div className="input-field1" style={{ width: "40%" }}>
                                            <label>Origin Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={allCityOptions}
                                                value={formData.OriginCode ? allCityOptions.find(opt => opt.value === formData.OriginCode) : null}
                                                onChange={(selected) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        OriginCode: selected.value,
                                                        Origin_code: selected.label,
                                                        Origin_zone: selected.zone
                                                    }));
                                                    setSelectedOriginPinCode(selected.pincode);
                                                }}
                                                placeholder="Select Origin Name"
                                                isSearchable
                                                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll area
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps it above other UI
                                                }}
                                            />
                                        </div>

                                        <div className="input-field1" style={{ width: "25%" }}>
                                            <label style={{}}>Origin Zone</label>
                                            <input type="text" placeholder="Zone_Name" value={formData.Origin_zone} readOnly />
                                        </div>
                                    </div>

                                    {/* Destination Row */}
                                    <div style={{whiteSpace:"nowrap", display: "flex", marginBottom: "1rem",width: "100%",gap:"2px"}}>
                                        <div className="input-field1" style={{ width: "21%" }}>
                                            <label>Pincode</label>
                                            <input
                                                type="tel"
                                                placeholder="Pin Code"
                                                value={selectedDestPinCode}
                                                onChange={handleDestPinCodeChange}
                                                maxLength={6}
                                                pattern="[0-9]{6}"
                                            />
                                        </div>

                                        <div className="input-field1" style={{ width: "40%" }}>
                                            <label>Destination Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={allCityOptions}
                                                value={
                                                    formData.DestinationCode
                                                        ? allCityOptions.find(opt => opt.value === formData.DestinationCode)
                                                        : null
                                                }
                                                onChange={(selected) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        DestinationCode: selected.value,
                                                        City_Name: selected.label,
                                                        Zone_Name: selected.zone
                                                    }));
                                                    setSelectedDestPinCode(selected.pincode);
                                                }}
                                                placeholder="Select Destination"
                                                isSearchable
                                                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                                                }}
                                            />
                                        </div>

                                        <div className="input-field1" style={{ width: "25%" }}>
                                            <label>Dest Zone</label>
                                            <input
                                                type="text"
                                                placeholder="Zone_Name"
                                                value={formData.Zone_Name}
                                                readOnly
                                            />
                                        </div>
                                    </div>


                                    <div className="card border p-1 mx-0" style={{overflowX:"hidden"}}>
                                        <div className="section-title">Vendor Information</div>

                                        <div className="fields2" style={{whiteSpace:"nowrap",paddingRight:"0.5rem"}}>
                                            <div style={{ display: "flex", flexDirection: "row", width: "100%",gap:"5px" }}>
                                                <div className="input-field" style={{ flex:"5",position: "relative"}}>
                                                    <label>Mode Name</label>

                                                    <Select
                                                        className="blue-selectbooking"
                                                        classNamePrefix="blue-selectbooking"
                                                        options={allModeOptions}
                                                        value={
                                                            formData.Mode_Code
                                                                ? allModeOptions.find(opt => opt.value === formData.Mode_Code)
                                                                : null
                                                        }
                                                        onChange={(selectedOption) => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                Mode_Code: selectedOption.value,
                                                                Mode_Name: selectedOption.label
                                                            }));
                                                        }}
                                                        placeholder="Select Mode Name"
                                                        isSearchable
                                                        menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll area
                                                        styles={{
                                                            menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps it above other UI
                                                        }}
                                                    />
                                                </div>
                                                <div className="input-field" style={{ flex:"2" }}>
                                                    <label>Code</label>
                                                    <input
                                                        type="tel"
                                                        placeholder="Code"
                                                        value={formData.Mode_Code || ''}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="fields2" style={{whiteSpace:"nowrap",paddingRight:"0.5rem" }}>
                                            <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "5px"}}>
                                                <div className="input-field" style={{ flex: "5", position: "relative" }}>
                                                    <label>Vendor Name</label>
                                                    <Select
                                                        className="blue-selectbooking"
                                                        classNamePrefix="blue-selectbooking"
                                                        options={allVendorOption}
                                                        value={
                                                            formData.Vendor_Code
                                                                ? allVendorOption.find(opt => opt.value === formData.Vendor_Code)
                                                                : null
                                                        }
                                                        onChange={(selectedOption) => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                Vendor_Code: selectedOption.value,
                                                                Vendor_Name: selectedOption.label
                                                            }));
                                                        }}
                                                        placeholder="Select Vendor Name"
                                                        isSearchable
                                                        menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll area
                                                        styles={{
                                                            menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps it above other UI
                                                        }}
                                                    />

                                                </div>
                                                <div className="input-field" style={{ flex: "2" }}>
                                                    <label>Code</label>
                                                    <input
                                                        type="tel"
                                                        placeholder="Code"
                                                        value={formData.Vendor_Code || ''}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="row g-2" style={{ marginLeft: "7px" }}>
                                                <div className="col-md-6 col-12">
                                                    <label className="form-label">Vendor Docket No</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Vendor Docket No"
                                                        value={formData.VendorAwbNo}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, VendorAwbNo: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-6 col-12">
                                                    <label className="form-label">Vendor Amount</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="Vendor Amount"
                                                        value={formData.VendorAmt}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, VendorAmt: e.target.value })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                            </form>




                        </div>



                        <div className="right-card" style={{margin:"0px"}}>
                            <div className="section-title">Receiver Docket Information</div>



                            <form
                                onSubmit={handleSaveReceiverFromBooking}
                                style={{ padding: 0, margin: 0,backgroundColor:"white" }}
                                onKeyDown={handleKeyDown}
                            >
                                {/* Receiver Name Row */}
                                <div className="container-fluid mb-2">
                                    <div className="row g-2 align-items-end">
                                        <div className="col-md-10 col-sm-9 col-12">
                                            {/* <div className="input-field" style={{ width: "95%", position: "relative" }}>
                                                <label>Receiver Name</label>
                                                <Select
                                                    className="blue-selectbooking"
                                                    classNamePrefix="blue-selectbooking"
                                                    options={allReceiverOption}
                                                    value={
                                                        formData.ConsigneeName
                                                            ? allReceiverOption.find(opt => opt.label === formData.ConsigneeName)
                                                            : null
                                                    }
                                                    onChange={(selectedOption) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            ConsigneeName: selectedOption.label
                                                        }));
                                                    }}
                                                    placeholder="Select Receiver Name"
                                                    isSearchable
                                                    menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll area
                                                    styles={{
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps it above other UI
                                                    }}
                                                />

                                            </div> */}
                                            <div className="input-field" style={{ width: "100%", position: "relative" }}>
                                                <label>Receiver Name</label>
                                                <Select
                                                    className="blue-selectbooking"
                                                    classNamePrefix="blue-selectbooking"
                                                    options={allReceiverOption}
                                                    value={
                                                        formData.ConsigneeName
                                                            ? allReceiverOption.find(opt => opt.label === formData.ConsigneeName)
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
                                                            ConsigneeGST: selectedOption.GSTNo
                                                        }));
                                                    }}
                                                    placeholder="Select Receiver Name"
                                                    isSearchable
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: base => ({ ...base, zIndex: 9999 })
                                                    }}
                                                />
                                            </div>


                                        </div>
                                        <div className="col-md-2 col-sm-3 col-12">
                                            <label className="invisible">+</label>
                                            <button
                                                type="button"
                                                className="ok-btn btn btn-outline-primary w-100"
                                                onClick={() => setModalIsOpen1(true)}
                                            >
                                                <i className="bi bi-plus" style={{ fontSize: "20px" }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Other Receiver Fields */}
                                <div className="fields2">
                                    <div className="input-field">
                                        <label>Mobile No</label>
                                        <input
                                            type="tel"
                                            placeholder="Mobile No"
                                            maxLength={10}
                                            value={formData.ConsigneeMob}
                                            onChange={(e) => setFormData({ ...formData, ConsigneeMob: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-field">
                                        <label>Receiver Address</label>
                                        <input
                                            type="text"
                                            placeholder="Receiver Address"
                                            value={formData.ConsigneeAdd1}
                                            onChange={(e) => setFormData({ ...formData, ConsigneeAdd1: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-field">
                                        <label>Receiver Address2</label>
                                        <input
                                            type="text"
                                            placeholder="Receiver Address2"
                                            value={formData.ConsigneeAdd2}
                                            onChange={(e) => setFormData({ ...formData, ConsigneeAdd2: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-field">
                                        <label>Pin Code</label>
                                        <input
                                            type="text"
                                            placeholder="Pin Code"
                                            value={formData.ConsigneePin}
                                            maxLength={6}
                                            pattern="[0-9]{6}"
                                            onChange={(e) => setFormData({ ...formData, ConsigneePin: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-field">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            placeholder="Country"
                                            value={formData.ConsigneeCountry}
                                            onChange={(e) => setFormData({ ...formData, ConsigneeCountry: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-field">
                                        <label>GST No</label>
                                        <input
                                            type="text"
                                            placeholder="GST No"
                                            value={formData.ConsigneeGST}
                                            onChange={(e) => setFormData({ ...formData, ConsigneeGST: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-field">
                                        <label>Email ID</label>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <input
                                                type="email"
                                                placeholder="Email ID"
                                                value={formData.ConsigneeEmail}
                                                onChange={(e) => setFormData({ ...formData, ConsigneeEmail: e.target.value })}
                                                style={{ flex: 1 }}
                                            />
                                            <button style={{ backgroundColor: '#28a745', color: '#fff', fontWeight: 'bold', padding: '0.4rem 1.4rem', borderRadius: '5px', border: 'none', marginLeft: "6px" }}>Save</button>
                                        </div>
                                    </div>

                                    {/* Conditional Sections */}
                                    {isInvoiceValue && (
                                        <>
                                            <div className="input-field1">
                                                <label>Invoice Details</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setModalIsOpen6(true)}
                                                    className="ok-btn w-100"
                                                    style={{ color: "black" }}
                                                >
                                                    <i className="bi bi-receipt-cutoff"></i>
                                                </button>
                                            </div>
                                            <div className="input-field1">
                                                <label>Invoice Value</label>
                                                <input
                                                    type="text"
                                                    placeholder="Invoice Value"
                                                    value={formData.InvValue}
                                                    onChange={(e) => setFormData({ ...formData, InvValue: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {isRemarkChecked && (
                                        <div className="input-field1">
                                            <label>Alarm No</label>
                                            <button
                                                type="button"
                                                className="ok-btn"
                                                style={{ height: "35px" }}
                                                onClick={() => setModalIsOpen4(true)}
                                            >
                                                <i className="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    )}

                                    {isEWayChecked && (
                                        <div className="input-field1">
                                            <label>E-Way Bill No</label>
                                            <input
                                                type="text"
                                                placeholder="E-Way Bill No"
                                                value={formData.EwayBill}
                                                onChange={(e) => setFormData({ ...formData, EwayBill: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {isInvoiceNo && (
                                        <div className="input-field1">
                                            <label>Invoice No</label>
                                            <input
                                                type="text"
                                                placeholder="Invoice No"
                                                value={formData.InvoiceNo}
                                                onChange={(e) => setFormData({ ...formData, InvoiceNo: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {dispatchDate && (
                                        <div className="input-field1">
                                            <label>Dispatch Date</label>
                                            <input
                                                type="date"
                                                value={formData.DispatchDate}
                                                onChange={(e) => setFormData({ ...formData, DispatchDate: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </form>




                            <div className="card" style={{ border: "transparent", padding: "0px" }}>
                                <div className="section-title">Charges Information</div>

                                <form
                                    action=""
                                    style={{ padding: "0px", margin: "0px",backgroundColor:"white" }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") e.preventDefault();
                                    }}
                                >
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label>Dox / Spx</label>
                                            <select
                                                value={formData.DoxSpx}
                                                onChange={(e) => setFormData({ ...formData, DoxSpx: e.target.value })}
                                            >
                                                <option value="" disabled>Dox/Spx</option>
                                                <option value="Dox">Dox</option>
                                                <option value="Parcel">Parcel</option>
                                                <option value="Box">Box</option>
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label>Quantity</label>
                                            <input
                                                type="tel"
                                                placeholder="Quantity"
                                                value={formData.QtyOrderEntry}
                                                onChange={(e) => setFormData({ ...formData, QtyOrderEntry: e.target.value })}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label>Wt.Fixed</label>
                                            <select
                                                value={formData.RateType}
                                                onChange={(e) => setFormData({ ...formData, RateType: e.target.value })}
                                            >
                                                <option value="" disabled>Wt/Box</option>
                                                <option value="Weight">Weight</option>
                                                <option value="Fixed">Box</option>
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label>Actual Weight</label>
                                            <input
                                                type="tel"
                                                placeholder="Actual Weight"
                                                value={formData.ActualWt}
                                                onChange={(e) => setFormData({ ...formData, ActualWt: e.target.value })}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label>Volumetric Weight</label>
                                            <input
                                                type="tel"
                                                placeholder="Volumetric Weight"
                                                value={formData.VolumetricWt}
                                                onChange={(e) => setFormData({ ...formData, VolumetricWt: e.target.value })}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label>&nbsp;</label>
                                            <button
                                                type="button"
                                                className="ok-btn"
                                                onClick={() => setModalIsOpen5(true)}
                                                style={{ height: "35px", width: "100%", color: "black" }}
                                            >
                                                <i className="bi bi-calculator" style={{ fontSize: "20px" }}></i>
                                            </button>
                                        </div>

                                        <div className="input-field1">
                                            <label>Charged Weight</label>
                                            <input
                                                type="tel"
                                                placeholder="Charged Weight"
                                                value={formData.ChargedWt}
                                                onChange={(e) => setFormData({ ...formData, ChargedWt: e.target.value })}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label>Vendor Weight</label>
                                            <input
                                                type="tel"
                                                placeholder="Vendor Weight"
                                                value={formData.VendorWt}
                                                onChange={(e) => setFormData({ ...formData, VendorWt: e.target.value })}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label>&nbsp;</label>
                                            <button
                                                type="button"
                                                className="ok-btn"
                                                onClick={() => setModalIsOpen9(true)}
                                                style={{ height: "35px", width: "100%", color: "black" }}
                                            >
                                                <i className="bi bi-calculator" style={{ fontSize: "20px" }}></i>
                                            </button>
                                        </div>

                                        <div className="input-field1">
                                            <label>Rate Per Kg</label>
                                            <input
                                                type="tel"
                                                placeholder="Rate Per Kg"
                                                value={formData.RatePerkg || ''}
                                                onChange={(e) => setFormData({ ...formData, RatePerkg: e.target.value })}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label>Freight Amount</label>
                                            <input
                                                type="tel"
                                                placeholder="Freight Amount"
                                                value={formData.Rate}
                                                readOnly
                                            />
                                        </div>

                                        {isFovChecked && (
                                            <div className="input-field1">
                                                <label>FOV Charges</label>
                                                <input
                                                    type="text"
                                                    placeholder="FOV Charges"
                                                    value={formData.FovChrgs}
                                                    onChange={(e) => setFormData({ ...formData, FovChrgs: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {isDocketChecked && (
                                            <div className="input-field1">
                                                <label>Docket Charges</label>
                                                <input
                                                    type="text"
                                                    placeholder="Docket Charges"
                                                    value={formData.DocketChrgs}
                                                    onChange={(e) => setFormData({ ...formData, DocketChrgs: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {isDeliveryChecked && (
                                            <div className="input-field1">
                                                <label>Delivery Charges</label>
                                                <input
                                                    type="text"
                                                    placeholder="Delivery Charges"
                                                    value={formData.DeliveryChrgs}
                                                    onChange={(e) => setFormData({ ...formData, DeliveryChrgs: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {isPackingChecked && (
                                            <div className="input-field1">
                                                <label>Packing Charges</label>
                                                <input
                                                    type="text"
                                                    placeholder="Packing Charges"
                                                    value={formData.PackingChrgs}
                                                    onChange={(e) => setFormData({ ...formData, PackingChrgs: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {isGreenChecked && (
                                            <div className="input-field1">
                                                <label>Green Charges</label>
                                                <input
                                                    type="text"
                                                    placeholder="Green Charges"
                                                    value={formData.GreenChrgs}
                                                    onChange={(e) => setFormData({ ...formData, GreenChrgs: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {isHamaliChecked && (
                                            <div className="input-field1">
                                                <label>Hamali Charges</label>
                                                <input
                                                    type="text"
                                                    placeholder="Hamali Charges"
                                                    value={formData.HamaliChrgs}
                                                    onChange={(e) => setFormData({ ...formData, HamaliChrgs: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {isOtherChecked && (
                                            <div className="input-field1">
                                                <label>Other Charges</label>
                                                <input
                                                    type="text"
                                                    placeholder="Other Charges"
                                                    value={formData.OtherCharges}
                                                    onChange={(e) => setFormData({ ...formData, OtherCharges: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {isInsuranceChecked && (
                                            <div className="input-field1">
                                                <label>Insurance Charges</label>
                                                <input
                                                    type="text"
                                                    placeholder="Insurance Charges"
                                                    value={formData.InsuranceChrgs}
                                                    onChange={(e) => setFormData({ ...formData, InsuranceChrgs: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {isODAChecked && (
                                            <div className="input-field1">
                                                <label>ODA Charges</label>
                                                <input
                                                    type="text"
                                                    placeholder="ODA Charges"
                                                    value={formData.ODAChrgs}
                                                    onChange={(e) => setFormData({ ...formData, ODAChrgs: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {isFuelChecked && (
                                            <div className="input-field1">
                                                <label>Fuel Charges</label>
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Fuel Ch."
                                                        style={{ width: "50%", borderRight: "transparent" }}
                                                        value={formData.FuelCharges}
                                                        onChange={(e) => setFormData({ ...formData, FuelCharges: e.target.value })}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Fuel %"
                                                        style={{ width: "50%", borderLeft: "transparent" }}
                                                        value={`${formData.FuelPer}%`}
                                                        onChange={(e) => setFormData({ ...formData, FuelPer: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {String(formData.State_Code || '').trim() === '27' ? (
                                            <>
                                                <div className="input-field1">
                                                    <label>CGST (9%)</label>
                                                    <input type="tel" placeholder="CGST" value={formData.CGST || ''} readOnly />
                                                </div>
                                                <div className="input-field1">
                                                    <label>SGST (9%)</label>
                                                    <input type="tel" placeholder="SGST" value={formData.SGST || ''} readOnly />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="input-field1">
                                                <label>Total GST (18%)</label>
                                                <input type="tel" placeholder="IGST" value={formData.TotalGST || ''} readOnly />
                                            </div>
                                        )}

                                        <div className="input-field1">
                                            <label>&nbsp;</label>
                                            <button
                                                type="button"
                                                className="ok-btn"
                                                onClick={() => setModalIsOpen3(true)}
                                            >
                                                <i className="bi bi-cash-coin" style={{ fontSize: "24px" }}></i>
                                            </button>
                                        </div>

                                        <div className="input-field1">
                                            <label>Total Amount</label>
                                            <input type="tel" placeholder="Total Amount" value={formData.TotalAmt} readOnly />
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>

                    </div>

                    <div className="bottom-card" style={{width:"100%", display: 'flex',marginTop:"0.5rem", gap: '0.5rem',alignItems:"center" ,justifyContent:"center",textAlign:"center",padding:"0.5rem"}}>

                        <button style={{ backgroundColor: '#28a745', color: '#fff', fontWeight: 'bold', padding: '0.3rem 1rem', borderRadius: '5px', border: 'none'}} onClick={handleSubmit} type="button">Save</button>
                        <button style={{ backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', padding: '0.3rem 0.5rem', borderRadius: '5px', border: 'none' }} onClick={handleUpdate} type="button">Update</button>
                        <button style={{ backgroundColor: '#ef0751ff', color: '#fff', fontWeight: 'bold', padding: '0.3rem 0.5rem', borderRadius: '5px', border: 'none'}} onClick={handleSearch} type="button">Search</button>
                        <PiDotsThreeOutlineVerticalFill 
                        style={{height:"30px",width:"30px",fontSize:"25px",cursor:"pointer", backgroundColor:"black" ,color:"white",borderRadius: '5px'}}
                        onClick={() => setOpen(!open)}/>

                        <div style={{ position: "relative", display: "inline-block" ,backgroundColor:"yellow"}}>
                            {open && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "20px",
                                        right:"7px",
                                        marginTop: "10px",
                                        background: "#fff",
                                        boxShadow: "0 2px 8px rgba(3, 44, 71, 0.15)",
                                        borderRadius: "5px",
                                        zIndex: 9999,
                                        minWidth: "50px",
                                        overflow: "hidden", // keeps buttons tight
                                    }}
                                >
                                    <button
                                        style={{
                                            backgroundColor: "#28a745",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            padding: "0.2rem 0.5rem",
                                            border: "none",
                                            width: "100%",
                                            display: "block",
                                        }}
                                        onClick={() => setModalIsOpen7(true)}
                                    >
                                        Setup
                                    </button>

                                    <button
                                        style={{
                                            backgroundColor: "#dc3545",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            padding: "0.2rem 0.5rem",
                                            border: "none",
                                            width: "100%",
                                            display: "block",
                                        }}
                                        onClick={handleDelete}
                                        type="button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>


                    </div>



                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-volumetric" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Shipper</header>
                            </div>
                            <div className='container2'>
                                <form>
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Shipper Name</label>
                                            <input type="text" placeholder="Shipper Name" value={formData.Shipper_Name}
                                                onChange={(e) => setFormData({ ...formData, Shipper_Name: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Contact No</label>
                                            <input type="tel" placeholder=" Contact No" maxLength={10} value={shipperData.ShipperPhone}
                                                onChange={(e) => setShipperData({ ...shipperData, ShipperPhone: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Email</label>
                                            <input type="email" placeholder=" Email" value={shipperData.ShipperEmail}
                                                onChange={(e) => setShipperData({ ...shipperData, ShipperEmail: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">GST No</label>
                                            <input type="tel" placeholder=" Gst No" value={shipperData.Shipper_GstNo}
                                                onChange={(e) => setShipperData({ ...shipperData, Shipper_GstNo: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Address</label>
                                            <input type="text" placeholder=" Address 1" value={shipperData.ShipperAdd2}
                                                onChange={(e) => setShipperData({ ...shipperData, ShipperAdd2: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Pin Code</label>
                                            <input type="tel" placeholder=" Pin Code" maxLength={6} value={shipperData.ShipperPin}
                                                onChange={(e) => setShipperData({ ...shipperData, ShipperPin: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">City Name</label>
                                            <select value={shipperData.ShipperCity}
                                                onChange={(e) => setShipperData({ ...shipperData, ShipperCity: e.target.value })}>
                                                <option disabled value="">Select City Name</option>
                                                {getCity.map((city, index) => (
                                                    <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Upload Image</label>
                                            <input type="file" style={{ paddingTop: "7px" }} />
                                        </div>

                                    </div>
                                    <div className="bottom-buttons">
                                        <button className="ok-btn" onClick={() => setModalIsOpen(false)}>Submit</button>
                                        <button className="ok-btn" onClick={() => setModalIsOpen(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen1}
                        className="custom-modal-volumetric" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Receiver Name</header>
                            </div>
                            <div className='container2'>
                                <form>
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Receiver Name</label>
                                            <input type="text" placeholder="Receiver Name" value={formData.ConsigneeName}
                                                onChange={(e) => setFormData({ ...formData, ConsigneeName: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Address</label>
                                            <input type="text" placeholder="Address" value={receiverData.ConsigneeAdd1}
                                                onChange={(e) => setReceiverData({ ...receiverData, ConsigneeAdd1: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Pin Code</label>
                                            <input type="tel" placeholder="Pin Code" maxLength={6} value={receiverData.ConsigneePin}
                                                onChange={(e) => setReceiverData({ ...receiverData, ConsigneePin: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">City</label>
                                            <select value={receiverData.Consignee_City}
                                                onChange={(e) => setReceiverData({ ...receiverData, Consignee_City: e.target.value })}>
                                                <option disabled value="">City Name</option>
                                                {getCity.map((city, index) => (
                                                    <option value={receiverData.City_Code} key={index}>{city.City_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">State</label>
                                            <select value={receiverData.ConsigneeState}
                                                onChange={(e) => setReceiverData({ ...receiverData, ConsigneeState: e.target.value })}>
                                                <option disabled value="">State Name</option>
                                                {getState.map((state, index) => (
                                                    <option value={state.State_Code} key={index}>{state.State_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Country</label>
                                            <select value={receiverData.ConsigneeCountry}
                                                onChange={(e) => setReceiverData({ ...receiverData, ConsigneeCountry: e.target.value })}>
                                                <option disabled value="">Country Name</option>
                                                {getCountry.map((country, index) => (
                                                    <option value={country.Country_Code} key={index}>{country.Country_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Mobile Number</label>
                                            <input type="tel" maxLength={10} placeholder=" Mobile No" value={receiverData.ConsigneeMob}
                                                onChange={(e) => setReceiverData({ ...receiverData, ConsigneeMob: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">GST No</label>
                                            <input type="tel" placeholder=" GST No" value={receiverData.ConsigneeGST}
                                                onChange={(e) => setReceiverData({ ...receiverData, ConsigneeGST: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Email</label>
                                            <input type="email" placeholder=" Email" value={receiverData.ConsigneeEmail}
                                                onChange={(e) => setReceiverData({ ...receiverData, ConsigneeEmail: e.target.value })} />
                                        </div>

                                    </div>
                                    <div className="bottom-buttons">
                                        <button className="ok-btn" onClick={() => setModalIsOpen1(false)}>Submit</button>
                                        <button className="ok-btn" onClick={() => setModalIsOpen1(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen2}
                        className="custom-modal-volumetric" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Vendor</header>
                            </div>
                            <div className='container2'>
                                <form>
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Vendor 2</label>
                                            <select value={vendorData.Vendor_Code1}
                                                onChange={(e) => setVendorData({ ...vendorData, Vendor_Code1: e.target.value })}>
                                                <option disabled value="">Select Vendor</option>
                                                {getVendor.map((vendor, index) => (
                                                    <option value={vendor.Vendor_Code} key={index}>{vendor.Vendor_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Vendor Docket No 2</label>
                                            <input type="tel" placeholder=" Vendor Docket No" value={vendorData.VendorAwbNo1}
                                                onChange={(e) => setVendorData({ ...vendorData, VendorAwbNo1: e.target.value })} />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Vendor 3</label>
                                            <select value={vendorData.Vendor_Code2}
                                                onChange={(e) => setVendorData({ ...vendorData, Vendor_Code2: e.target.value })}>
                                                <option disabled value="">Select Vendor</option>
                                                {getVendor.map((vendor, index) => (
                                                    <option value={vendor.Vendor_Code} key={index}>{vendor.Vendor_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Vendor Docket No 3</label>
                                            <input type="tel" placeholder=" Vendor Docket No" value={vendorData.VendorAwbNo2}
                                                onChange={(e) => setVendorData({ ...vendorData, VendorAwbNo2: e.target.value })} />
                                        </div>

                                    </div>
                                    <div className="bottom-buttons">
                                        <button className="ok-btn">Submit</button>
                                        <button className="ok-btn" onClick={() => setModalIsOpen2(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >



                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen3}
                        className="custom-modal-volumetric" contentLabel="GST Details Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>GST Details</header>
                            </div>
                            <div className='container2'>
                                <form>
                                    <div className="fields2">
                                        <div className="input-field1" style={{ width: "60%" }}>
                                            <label htmlFor="">CGST Amount</label>
                                            <input type="text" placeholder="CGST Charges" value={gstData.CGSTAMT || ""} readOnly />
                                        </div>
                                        <div className="input-field1" style={{ width: "30%" }}>
                                            <label htmlFor="">CGST %</label>
                                            <input type="text" placeholder="%" value={gstData.CGSTPer || ""} readOnly />
                                        </div>
                                    </div>

                                    <div className="fields2">
                                        <div className="input-field1" style={{ width: "60%" }}>
                                            <label htmlFor="">SGST Amount</label>
                                            <input type="text" placeholder="SGST Charges" value={gstData.SGSTAMT || ""} readOnly />
                                        </div>
                                        <div className="input-field1" style={{ width: "30%" }}>
                                            <label htmlFor="">SGST %</label>
                                            <input type="text" placeholder="%" value={gstData.SGSTPer || ""} readOnly />
                                        </div>
                                    </div>

                                    <div className="fields2">
                                        <div className="input-field1" style={{ width: "60%" }}>
                                            <label htmlFor="">IGST Amount</label>
                                            <input type="text" placeholder="IGST Charges" value={gstData.IGSTAMT || ""} readOnly />
                                        </div>
                                        <div className="input-field1" style={{ width: "30%" }}>
                                            <label htmlFor="">IGST %</label>
                                            <input type="text" placeholder="%" value={gstData.IGSTPer || ""} readOnly />
                                        </div>
                                    </div>

                                    <div className="fields2">
                                        <div className="input-field1" style={{ width: "60%" }}>
                                            <label htmlFor="">Total GST</label>
                                            <input type="text" placeholder="Total GST" value={gstData.TotalGST || ""} readOnly />
                                        </div>
                                        <div className="input-field1" style={{ width: "30%" }}>
                                            <label htmlFor="">Total %</label>
                                            <input type="text" placeholder="%" value={gstData.GSTPer || ""} readOnly />
                                        </div>
                                    </div>

                                    <div className="bottom-buttons">
                                        <button className="ok-btn" type="button" onClick={() => setModalIsOpen3(false)}>OK</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal>




                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen4}
                        className="custom-modal-stock" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Remark / Sr No</header>
                            </div>
                            <div className='container2'>
                                <form>
                                    <div className="fields2">
                                        <div className="input-field">
                                            <label htmlFor="">Remark</label>
                                            <input type="text" placeholder="Remark" value={remarkData.Remark}
                                                onChange={(e) => setRemarkData({ ...remarkData, Remark: e.target.value })} />
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="">Alarm No</label>
                                            <input type="text" placeholder="Alarm No" value={remarkData.MHWNo}
                                                onChange={(e) => setRemarkData({ ...remarkData, MHWNo: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="bottom-buttons">
                                        <button className="ok-btn" onClick={() => setModalIsOpen4(false)}>Submit</button>
                                        <button className="ok-btn" onClick={() => setModalIsOpen4(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen5}
                        style={{
                            content: {
                                top: '53%',
                                left: '55%',
                                right: 'auto',
                                bottom: 'auto',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                height: '460px',
                                width: '85%',
                                borderRadius: '5px',
                                padding: "0px"
                            },
                        }}>
                        <div>
                            <div className="header-tittle">
                                <header> Volumetric Calculate</header>
                            </div>
                            <div className='container2'>
                                <div className="table-container" style={{ padding: "10px" }}>
                                    <table className="table table-bordered table-sm">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Length</th>
                                                <th>Width</th>
                                                <th>Height</th>
                                                <th>DIV</th>
                                                <th>QTY</th>
                                                <th>Vol Wt</th>
                                                <th>Actual Wt</th>
                                                <th>Charged Wt</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            <tr>
                                                <td>
                                                    <input type="tel" placeholder="Length" name="Length"
                                                        style={{ textAlign: "center" }} value={vendorVolumetric.Length}
                                                        onChange={handleVendorChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Width" name="Width"
                                                        style={{ textAlign: "center" }} value={vendorVolumetric.Width}
                                                        onChange={handleVendorChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Height" name="Height"
                                                        style={{ textAlign: "center" }} value={vendorVolumetric.Height}
                                                        onChange={handleVendorChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="DIV" name="DivideBy"
                                                        style={{ textAlign: "center" }} value={vendorVolumetric.DivideBy}
                                                        onChange={handleVendorChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="QTY" name="Qty"
                                                        style={{ textAlign: "center" }} value={vendorVolumetric.Qty}
                                                        onChange={handleVendorChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Vol Wt" name="VolmetricWt"
                                                        style={{ textAlign: "center" }} value={vendorVolumetric.VolmetricWt}
                                                        onChange={handleVendorChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Actual Wt" name="ActualWt"
                                                        style={{ textAlign: "center" }} value={vendorVolumetric.ActualWt}
                                                        onChange={handleVendorChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Charged Wt" name="ChargeWt"
                                                        style={{ textAlign: "center" }} value={vendorVolumetric.ChargeWt}
                                                        onChange={handleVendorChange} />
                                                </td>
                                                <td>
                                                    <button className="ok-btn" style={{ width: "30px", height: "30px" }}
                                                        onClick={handleVendorAddRow}>
                                                        <i className="bi bi-plus" style={{ fontSize: "18px" }}></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            {vendorsubmittedData.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{data.Length}</td>
                                                    <td>{data.Width}</td>
                                                    <td>{data.Height}</td>
                                                    <td>{data.Qty}</td>
                                                    <td>{data.DivideBy}</td>
                                                    <td>{data.VolmetricWt}</td>
                                                    <td>{data.ActualWt}</td>
                                                    <td>{data.ChargeWt}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <form action="" style={{ backgroundColor: "white", justifyContent: "center" }}>
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Total Vol. Weight</label>
                                            <input type="text" placeholder="Total Vol. Weight" value={totalVolWt} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Total Act. Weight</label>
                                            <input type="text" placeholder="Total Act. Weight" value={totalActWt} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Total Cha. Weight</label>
                                            <input type="text" placeholder="Total Cha. Weight" value={totalChargeWt} readOnly />
                                        </div>
                                    </div>
                                </form>
                                <div className="bottom-buttons">
                                    <button className="ok-btn" onClick={() => setModalIsOpen5(false)}>Submit</button>
                                    <button className="ok-btn" onClick={() => setModalIsOpen5(false)}>Cancel</button>
                                </div>
                            </div>


                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen9}
                        style={{
                            content: {
                                top: '53%',
                                left: '55%',
                                right: 'auto',
                                bottom: 'auto',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                height: '460px',
                                width: '85%',
                                borderRadius: '5px',
                                padding: "0px"
                            },
                        }}>
                        <div>
                            <div className="header-tittle">
                                <header>Vendor Volumetric</header>
                            </div>
                            <div className='container2'>
                                <div className="table-container" style={{ padding: "10px" }}>
                                    <table className="table table-bordered table-sm">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Length</th>
                                                <th>Width</th>
                                                <th>Height</th>
                                                <th>DIV</th>
                                                <th>QTY</th>
                                                <th>Vol Wt</th>
                                                <th>Actual Wt</th>
                                                <th>Charged Wt</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            <tr>
                                                <td>
                                                    <input type="tel" placeholder="Length" name="Length"
                                                        style={{ textAlign: "center" }} value={volumetricData.Length}
                                                        onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Width" name="Width"
                                                        style={{ textAlign: "center" }} value={volumetricData.Width}
                                                        onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Height" name="Height"
                                                        style={{ textAlign: "center" }} value={volumetricData.Height}
                                                        onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="DIV" name="DivideBy"
                                                        style={{ textAlign: "center" }} value={volumetricData.DivideBy}
                                                        onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="QTY" name="Qty"
                                                        style={{ textAlign: "center" }} value={volumetricData.Qty}
                                                        onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Vol Wt" name="VolmetricWt"
                                                        style={{ textAlign: "center" }} value={volumetricData.VolmetricWt}
                                                        onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Actual Wt" name="ActualWt"
                                                        style={{ textAlign: "center" }} value={volumetricData.ActualWt}
                                                        onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Charged Wt" name="ChargeWt"
                                                        style={{ textAlign: "center" }} value={volumetricData.ChargeWt}
                                                        onChange={handleChange} />
                                                </td>
                                                <td>
                                                    <button className="ok-btn" style={{ width: "30px", height: "30px" }}
                                                        onClick={handleAddRow}>
                                                        <i className="bi bi-plus" style={{ fontSize: "18px" }}></i>
                                                    </button>
                                                </td>
                                            </tr>

                                            {submittedData.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{data.Length}</td>
                                                    <td>{data.Width}</td>
                                                    <td>{data.Height}</td>
                                                    <td>{data.Qty}</td>
                                                    <td>{data.DivideBy}</td>
                                                    <td>{data.VolmetricWt}</td>
                                                    <td>{data.ActualWt}</td>
                                                    <td>{data.ChargeWt}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <form action="" style={{ backgroundColor: "white", justifyContent: "center" }}>
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">Total Vol. Weight</label>
                                            <input type="text" placeholder="Total Vol. Weight" value={totalVolWt1} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Total Act. Weight</label>
                                            <input type="text" placeholder="Total Act. Weight" value={totalActWt1} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Total Cha. Weight</label>
                                            <input type="text" placeholder="Total Cha. Weight" value={totalChargeWt1} readOnly />
                                        </div>
                                    </div>
                                </form>

                                <div className="bottom-buttons">
                                    <button className="ok-btn" onClick={() => setModalIsOpen9(false)}>Submit</button>
                                    <button className="ok-btn" onClick={() => setModalIsOpen9(false)}>Cancel</button>
                                </div>
                            </div>


                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen6}
                        style={{
                            content: {
                                top: '53%',
                                left: '55%',
                                right: 'auto',
                                bottom: 'auto',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                height: '450px',
                                width: '85%',
                                borderRadius: '5px',
                                padding: "0px"
                            },
                        }}>
                        <div>
                            <div className="header-tittle">
                                <header>Invoice Details</header>
                            </div>
                            <div className='container2'>
                                <div className="table-container" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                                    <table className="table table-bordered table-sm">
                                        <thead className="table-info">
                                            <tr>
                                                <th>PO No</th>
                                                <th>PO Date</th>
                                                <th>Invoice No</th>
                                                <th>Invoice Value</th>
                                                <th>Description</th>
                                                <th>QTY</th>
                                                <th>E-Way Bill No</th>
                                                <th>Remark</th>
                                                <th>Invoice Img</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            <tr>
                                                <td>
                                                    <input type="tel" placeholder="PO No" name="PoNo"
                                                        style={{ textAlign: "center" }} value={invoiceData.PoNo}
                                                        onChange={handleInvoiceDetailChange} />
                                                </td>
                                                <td>
                                                    <input type="date" name="PoDate"
                                                        style={{ textAlign: "center" }} value={invoiceData.PoDate}
                                                        onChange={handleInvoiceDetailChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Invoice No" name="InvoiceNo"
                                                        style={{ textAlign: "center" }} value={invoiceData.InvoiceNo}
                                                        onChange={handleInvoiceDetailChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Invoice Value" name="InvoiceValue"
                                                        style={{ textAlign: "center" }} value={invoiceData.InvoiceValue}
                                                        onChange={handleInvoiceDetailChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="Description" name="Description"
                                                        style={{ textAlign: "center" }} value={invoiceData.Description}
                                                        onChange={handleInvoiceDetailChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="QTY" name="Qty"
                                                        style={{ textAlign: "center" }} value={invoiceData.Qty}
                                                        onChange={handleInvoiceDetailChange} />
                                                </td>
                                                <td>
                                                    <input type="tel" placeholder="E-Way Bill No" name="EWayBillNo"
                                                        style={{ textAlign: "center" }} value={invoiceData.EWayBillNo}
                                                        onChange={handleInvoiceDetailChange} />
                                                </td>
                                                <td>
                                                    <input type="text" placeholder="Reamrk" name="Remark"
                                                        style={{ textAlign: "center" }} value={invoiceData.Remark}
                                                        onChange={handleInvoiceDetailChange} />
                                                </td>
                                                <td>
                                                    <input type="file" style={{ textAlign: "center" }}
                                                        value={invoiceData.InvoiceImg} name="InvoiceImg"
                                                        onChange={handleInvoiceDetailChange} />
                                                </td>
                                                <td>
                                                    <button className="ok-btn" style={{ width: "30px", height: "30px" }}
                                                        onClick={handleInvoiceAddRow}>
                                                        <i className="bi bi-plus" style={{ fontSize: "18px" }}></i>
                                                    </button>
                                                </td>
                                            </tr>

                                            {InvoicesubmittedData.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{data.PoNo}</td>
                                                    <td>{data.PoDate}</td>
                                                    <td>{data.InvoiceNo}</td>
                                                    <td>{data.InvoiceValue}</td>
                                                    <td>{data.Description}</td>
                                                    <td>{data.Qty}</td>
                                                    <td>{data.EWayBillNo}</td>
                                                    <td>{data.Remark}</td>
                                                    <td>{data.InvoiceImg}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bottom-buttons">
                                    <button className="ok-btn" onClick={() => setModalIsOpen6(false)}>Submit</button>
                                    <button className="ok-btn" onClick={() => setModalIsOpen6(false)}>Cancel</button>
                                </div>
                            </div>


                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen7}
                        className="custom-modal-setup" contentLabel="Modal" 
                        style={{
          content: {
           
            transform: "translate(-50%, -50%)", // Center the modal
            height:"320px",
            // overflowY:"hidden"
          },
        }}>
                        <div className="custom modal-content">

                            <div className="header-tittle">
                                <header>Charges</header>
                            </div>

                            <div className='container2'>
                                <form>
                                    <div className="fields2" style={{paddingLeft:"10px"}}>
                                        <div className="input-field" style={{ display: "flex", flexDirection: "row"}}>
                                            <input type="checkbox"
                                                checked={isFovChecked}
                                                onChange={handleFovChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fov" id="fov" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Fov Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isDocketChecked}
                                                onChange={handleDocketChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="docket" id="docket" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Docket Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isDeliveryChecked}
                                                onChange={handleDeliveryChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="delivery" id="delivery" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Delivery Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isPackingChecked}
                                                onChange={handlePackingChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="packing" id="packing" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Packing Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isGreenChecked}
                                                onChange={handleGreenChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="green" id="green" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Green Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isHamaliChecked}
                                                onChange={handleHamaliChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="hamali" id="hamali" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Hamali Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isOtherChecked}
                                                onChange={handleOtherChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="other" id="other" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Other Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isInsuranceChecked}
                                                onChange={handleInsuranceChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="insurance" id="insurance" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Insurance Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isODAChecked}
                                                onChange={handleODAChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="oda" id="oda" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                ODA Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isFuelChecked}
                                                onChange={handleFuelChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fuel" id="fuel" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Fuel Charges</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isRemarkChecked}
                                                onChange={handleRemark}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="remark" id="remark" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Remark / SR No</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isEWayChecked}
                                                onChange={handleEWayBill}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="ewaybill" id="ewaybill" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                E-Way Bill No</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isInvoiceValue}
                                                onChange={handleInvoiceValue}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="invoicevalue" id="invoicevalue" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Invoice Value</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isInvoiceNo}
                                                onChange={handleInvoiceNo}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="invoiceno" id="invoiceno" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Invoice No</label>
                                        </div>

                                        <div className="input-field" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={dispatchDate}
                                                onChange={handledispatch}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="dispatchDate" id="dispatchDate" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Dispatch Date</label>
                                        </div>

                                        <div className='bottom-buttons' style={{ marginLeft: "25px" }}>
                                            <button onClick={(e) => { e.preventDefault(); setModalIsOpen7(false) }} className='ok-btn'>close</button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >
                </div >

            </div >
        </>
    );
};

export default Booking;