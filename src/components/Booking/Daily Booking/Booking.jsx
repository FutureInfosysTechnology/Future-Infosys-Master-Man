import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
// import { getApi, postApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import { getApi, postApi, putApi, deleteApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import Swal from "sweetalert2";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import sms from '../../../Assets/Images/sms-svgrepo-com.png';
import mail from '../../../Assets/Images/mail-reception-svgrepo-com.png';
import whatsapp from '../../../Assets/Images/whatsapp-svgrepo-com.png';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";


function Booking() {
    const navigate = useNavigate();
    const location = useLocation();
    const [inputValue, setInputValue] = useState("");
    const [isGstCalculated, setIsGstCalculated] = useState(false);
    const [inputValue1, setInputValue1] = useState("");
    const [skipGstCalc, setSkipGstCalc] = useState(false);
    const [UseInput, setUseInput] = useState(0);
    // Utility function to format date safely
    const formatDate = (inputDate) => {
        if (!inputDate) return null; // if undefined or null

        const date = new Date(inputDate);

        // Check if date is valid
        if (isNaN(date)) {
            console.error("Invalid date:", inputDate);
            return null;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };
    const [fecthed, setFecthed] = useState("");
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
    const [getFlight, setGetFlight] = useState([]);
    const [getTrain, setGetTrain] = useState([]);
    const [getProduct, setGetProduct] = useState([]);
    const [selectedModeName, setSelectedModeName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggleActive, setToggleActive] = useState(false);
    const [isFovChecked, setIsFovChecked] = useState(false);
    const [isAllChecked, setIsAllChecked] = useState(false);
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
    const [isShipChecked, setIsShipChecked] = useState(false);
    const [isReceChecked, setIsReceChecked] = useState(false);
    const [isVenChecked, setIsVenChecked] = useState(false);
    const [isFlightChecked, setIsFlightChecked] = useState(false);
    const [isTrainChecked, setIsTrainChecked] = useState(false);
    const [isProChecked, setIsProChecked] = useState(false);
    const [dispatchDate, setDispatchDate] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalVolWt, setTotalVolWt] = useState(0);
    const [totalActWt, setTotalActWt] = useState(0);
    const [totalChargeWt, setTotalChargeWt] = useState(0);
    const [totalVolWt1, setTotalVolWt1] = useState(0);
    const [totalActWt1, setTotalActWt1] = useState(0);
    const [totalChargeWt1, setTotalChargeWt1] = useState(0);
    const [selectedOriginPinCode, setSelectedOriginPinCode] = useState("");
    const [selectedDestPinCode, setSelectedDestPinCode] = useState("");
    const [open, setOpen] = useState(false);
    const [allReceiverOption, setAllReceiverOption] = useState([])
    const [allShipperOption, setAllShipperOption] = useState([])
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
    useEffect(() => {
        console.log(selectedDestPinCode);
    }
        , [selectedDestPinCode])
    const [formData, setFormData] = useState({
        ActualShipper: "",
        ActualWt: 0,
        BillParty: "Client-wise Bill",
        BookDate: getTodayDate(),
        BookMode: "",
        ChargedWt: 0,
        ConsigneeAdd1: "",
        ConsigneeAdd2: "",
        ConsigneeGST: "",
        ConsigneePin: "",
        ConsigneeState: "",
        Consignee_City: "",
        ConsigneeEmail: "",
        ConsigneeMob: "",
        ConsigneeName: "",
        ConsigneeCountry: "",
        Customer_Code: "",
        DeliveryChrgs: 0,
        Dest_Zone: "",
        DestinationCode: "",
        DocketChrgs: 0,
        DocketNo: "",
        DoxSpx: "Box",
        DispatchDate: getTodayDate(),
        EwayBill: "",
        ExptDateOfDelvDt: "",
        Flight_Code: "",
        FovChrgs: 0,
        FovPer: 0,
        FuelCharges: 0,
        FuelPer: 0,
        GreenChrgs: 0,
        HamaliChrgs: 0,
        InsuranceChrgs: 0,
        InvDate: getTodayDate(),
        InvValue: 0,
        InvoiceNo: "",
        Location_Code: "",
        Mode_Code: "",
        ODAChrgs: 0,
        OriginCode: "",
        Origin_Zone: "",
        OtherCharges: 0,
        PackingChrgs: 0,
        QtyOrderEntry: "",
        Rate: 0,
        RatePerkg: 0,
        RateType: "Weight",
        Receiver_Code: "",
        ShipperAdd: "",
        ShipperAdd2: "",
        ShipperAdd3: "",
        ShipperCity: "",
        ShipperEmail: "",
        ShipperPhone: "",
        ShipperPin: "",
        Shipper_GstNo: "",
        Shipper_Name: "",
        Shipper_StateCode: "",
        Status: "",
        TotalAmt: 0,
        TotalGST: 0,
        totalgstPer: 0,
        Train_Code: "",
        VendorRatePerkg: 0,
        VendorAmt: 0,
        VendorAwbNo: "",
        VendorWt: 0,
        Vendor_Code: "",
        VolumetricWt: 0,
        WebAgent: "",
        destZoneName: "",
        orgZoneName: ""

    });
    const [addShipper, setAddShipper] = useState({
        shipperCode: '',
        custCode: '',
        shipperName: '',
        shipperAdd1: '',
        shipperAdd2: '',
        shipperPin: '',
        cityCode: '',
        stateCode: '',
        shipperMob: '',
        shipperEmail: '',
        gstNo: '',
        company: '',
    });
    const [addReceiver, setAddReceiver] = useState({
        receiverCode: '',
        receiverName: '',
        receiverAdd1: '',
        receiverAdd2: '',
        receiverPin: '',
        cityCode: '',
        stateCode: '',
        receiverMob: '',
        receiverEmail: '',
        gstNo: '',
        hsnNo: '',
        sms: false,
        emailId: false,
        whatsApp: false
    })

    const [vendorData, setVendorData] = useState({
        Vendor_Code1: "",
        Vendor_Code2: "",
        VendorAwbNo1: "",
        VendorAwbNo2: ""
    });

    const [vendorShow, setVendorShow] = useState({
        Rate: 0,
        Fuel_Charges: 0,
        Fuel_Per: 0,
        Fov_Charges: 0,
        Fov_Per: 0,
        Docket_Charges: 0,
        ODA_Charges: 0,
        Delivery_Charges: 0,
        Packing_Charges: 0,
        Green_Charges: 0,
        Hamali_Charges: 0,
        Other_Charges: 0,
        Insurance_Charges: 0,
        Subtotal: 0,
        CGSTPer: 0,
        CGSTAmt: 0,
        SGSTPer: 0,
        SGSTAmt: 0,
        IGSTPer: 0,
        IGSTAmt: 0,
        TotalGST: 0,
        TotalAmount: 0
    });


    const [gstData, setGstData] = useState({
        CGSTPer: 0,
        CGSTAMT: 0,
        SGSTPer: 0,
        SGSTAMT: 0,
        IGSTPer: 0,
        IGSTAMT: 0,
        GSTPer: 0,
        TotalGST: 0
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
        DivideBy: 0,
        cft: 0,
        VolmetricWt: 0,
        ActualWt: 0,
        ChargeWt: 0
    });
    const [editIndex, setEditIndex] = useState(null);
    const [InvoicesubmittedData, setInvoiceSubmittedData] = useState([]);
    const [invoiceData, setInvoiceData] = useState({
        PoNo: "",
        PoDate: getTodayDate(),
        InvoiceNo: "",
        InvoiceValue: 0,
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
        DivideBy: 0,
        cft: 0,
        VolmetricWt: 0,
        ActualWt: 0,
        ChargeWt: 0
    })

    useEffect(() => {
        if (formData.freight) {
            const freight = parseFloat(formData.freight) || 0;
            const fuelPer = parseFloat(formData.FuelPer) || 0;
            const fuel = (freight * fuelPer) / 100;
            console.log("fuel", fuel);
            setFormData((prev) => ({
                ...prev,
                FuelCharges: fuel.toFixed(2), // optional, rounds to 2 decimals
            }));
        }
    }, [formData.freight])
    const handleClick = () => {
        console.log("Button clicked aaakkkka");
    };
    <button onClick={handleClick}>Click me</button>


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
                        DestinationCode: City_Code || "",
                        City_Name: City_Name || "",
                        Zone_Name: Zone_Name || ""
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        DestinationCode: "",
                        City_Name: "Not Found",
                        Zone_Name: "Not Found"
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch pincode info:", error);
            }
        }
    };



    const handleGenerateCode = () => {
        if (addShipper.shipperCode !== '') return;
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddShipper({ ...addShipper, shipperCode: newCode });
    };
    const handleGenerateCode1 = () => {
        if (addReceiver.receiverCode !== '') return;
        const newCode1 = `${Math.floor(Math.random() * 1000)}`;
        setAddReceiver({ ...addReceiver, receiverCode: newCode1 });
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
                await fetchReceiverData();

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
    console.log(formData);
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
                    shipper_Add3: shipper.Add3?.trim() || "",
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
    // =======================================================================



    const onToggle = () => setToggleActive(!toggleActive);
    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("bookingState"));
        if (savedState) {
            setIsAllChecked(savedState.isAllChecked || false);
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
            setDispatchDate(savedState.dispatchDate || false);
            setIsShipChecked(savedState.isShipChecked || false);
            setIsReceChecked(savedState.isReceChecked || false);
            setIsVenChecked(savedState.isVenChecked || false);
            setIsFlightChecked(savedState.isFlightChecked || false);
            setIsTrainChecked(savedState.isTrainChecked || false);
            setIsProChecked(savedState.isProChecked || false);
        }
        fetchReceiverData();
        fetchShipper();
    }, []);

    const handleCheckboxChange = (field, value) => {
        const newState = {
            [field]: value
        };
        const currentState = JSON.parse(localStorage.getItem("bookingState")) || {};
        localStorage.setItem("bookingState", JSON.stringify({ ...currentState, ...newState }));
    };
    const handleAllChange = () => {
        const newValue = !isAllChecked;

        setIsAllChecked(newValue);

        const allFields = {
            isFovChecked: newValue,
            isDocketChecked: newValue,
            isDeliveryChecked: newValue,
            isPackingChecked: newValue,
            isGreenChecked: newValue,
            isHamaliChecked: newValue,
            isOtherChecked: newValue,
            isInsuranceChecked: newValue,
            isODAChecked: newValue,
            isFuelChecked: newValue,
            isRemarkChecked: newValue,
            isEWayChecked: newValue,
            isInvoiceValue: newValue,
            isInvoiceNo: newValue,
            dispatchDate: newValue,
            isAllChecked: newValue,
            isShipChecked: newValue,
            isReceChecked: newValue,
            isVenChecked: newValue,
            isFlightChecked: newValue,
            isTrainChecked: newValue,
            isProChecked: newValue
        };

        // Update React states
        setIsFovChecked(newValue);
        setIsDocketChecked(newValue);
        setIsDeliveryChecked(newValue);
        setIsPackingChecked(newValue);
        setIsGreenChecked(newValue);
        setIsHamaliChecked(newValue);
        setIsOtherChecked(newValue);
        setIsInsuranceChecked(newValue);
        setIsODAChecked(newValue);
        setIsFuelChecked(newValue);
        setIsRemarkChecked(newValue);
        setIsEWayChecked(newValue);
        setIsInvoiceValue(newValue);
        setIsInvoiceNo(newValue);
        setDispatchDate(newValue);
        setIsShipChecked(newValue);
        setIsReceChecked(newValue);
        setIsVenChecked(newValue);
        setIsFlightChecked(newValue);
        setIsTrainChecked(newValue);
        setIsProChecked(newValue);

        // Save to localStorage
        localStorage.setItem("bookingState", JSON.stringify(allFields));
    };
    useEffect(() => {
        const allFields = {
            isFovChecked,
            isDocketChecked,
            isDeliveryChecked,
            isPackingChecked,
            isGreenChecked,
            isHamaliChecked,
            isOtherChecked,
            isInsuranceChecked,
            isODAChecked,
            isFuelChecked,
            isReceChecked,
            isShipChecked,
            isVenChecked,
            isFlightChecked,
            isTrainChecked,
            isProChecked,
            isRemarkChecked,
            isEWayChecked,
            isInvoiceNo,
            isInvoiceValue,
            dispatchDate,
        };

        // Check if all are true
        const allChecked = Object.values(allFields).every(Boolean);
        setIsAllChecked(allChecked);
        handleCheckboxChange('isAllChecked', allChecked)
    }, [
        isFovChecked,
        isDocketChecked,
        isDeliveryChecked,
        isPackingChecked,
        isGreenChecked,
        isHamaliChecked,
        isOtherChecked,
        isInsuranceChecked,
        isODAChecked,
        isFuelChecked,
        isReceChecked,
        isShipChecked,
        isVenChecked,
        isFlightChecked,
        isTrainChecked,
        isProChecked,
        isRemarkChecked,
        isEWayChecked,
        isInvoiceNo,
        isInvoiceValue,
        dispatchDate,
    ]);
    const handleFovChange = (e) => {
        setIsFovChecked(e.target.checked);
        handleCheckboxChange('isFovChecked', e.target.checked);
    }
    const handleFlightChange = (e) => {
        setIsFlightChecked(e.target.checked);
        handleCheckboxChange('isFlightChecked', e.target.checked);
    }
    const handleTrainChange = (e) => {
        setIsTrainChecked(e.target.checked);
        handleCheckboxChange('isTrainChecked', e.target.checked);
    }
    const handleProChange = (e) => {
        setIsProChecked(e.target.checked);
        handleCheckboxChange('isProChecked', e.target.checked);
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
        setDispatchDate(e.target.checked);
        handleCheckboxChange('dispatchDate', e.target.checked);
    }

    const handleShipCheck = (e) => {
        setIsShipChecked(e.target.checked);
        handleCheckboxChange('isShipChecked', e.target.checked);
    }

    const handleReceCheck = (e) => {
        setIsReceChecked(e.target.checked);
        handleCheckboxChange('isReceChecked', e.target.checked);
    }

    const handleVenCheck = (e) => {
        setIsVenChecked(e.target.checked);
        handleCheckboxChange('isVenChecked', e.target.checked);
    }
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
    const handleSaveReceiver = async (e) => {
        e.preventDefault();
        const errors = [];
        if (!addReceiver.receiverCode) errors.push("Consignee Code is required");
        if (!addReceiver.receiverName) errors.push("Consignee Name is required");
        if (!addReceiver.cityCode) errors.push("City Code is required");
        if (!addReceiver.stateCode) errors.push("State Code is required");
        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: errors.map(err => `<div>${err}</div>`).join(''),
            });
            return;
        }
        const requestBody = {
            receiverCode: addReceiver.receiverCode,
            receiverName: addReceiver.receiverName,
            receiverAdd1: addReceiver.receiverAdd1,
            receiverAdd2: addReceiver.receiverAdd2,
            receiverPin: addReceiver.receiverPin,
            cityCode: addReceiver.cityCode,
            stateCode: addReceiver.stateCode,
            receiverMob: addReceiver.receiverMob,
            receiverEmail: addReceiver.receiverEmail,
            gstNo: addReceiver.gstNo.toUpperCase(),
            hsnNo: addReceiver.hsnNo,
            sms: addReceiver.sms,
            emailId: addReceiver.emailId,
            whatsApp: addReceiver.whatsApp
        }

        try {
            const response = await postApi('/Master/AddReceiver', requestBody, 'POST')
            if (response.status === 1) {
                setGetReceiver([...getReceiver, response.Data]);
                setAddReceiver({
                    receiverCode: '',
                    receiverName: '',
                    receiverAdd1: '',
                    receiverAdd2: '',
                    receiverPin: '',
                    cityCode: '',
                    stateCode: '',
                    receiverMob: '',
                    receiverEmail: '',
                    gstNo: '',
                    hsnNo: '',
                    sms: false,
                    emailId: false,
                    whatApp: false
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen1(false);
                await fetchReceiverData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add branch data', 'error');
        }
    };

    const handleSaveShipper = async (e) => {
        e.preventDefault();
        const errors = [];
        if (!addShipper.shipperCode) errors.push("Shipper Code is required");
        if (!addShipper.shipperName) errors.push("Shipper Name is required");
        if (!addShipper.cityCode) errors.push("City Code is required");
        if (!addShipper.stateCode) errors.push("State Code is required");
        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: errors.map(err => `<div>${err}</div>`).join(''),
            });
            return;
        }
        const requestBody = {
            shipperCode: addShipper.shipperCode,
            // customerCode: addReceiver.custCode,
            shipperName: addShipper.shipperName,
            add1: addShipper.shipperAdd1,
            add2: addShipper.shipperAdd2,
            pin: addShipper.shipperPin,
            mobile: addShipper.shipperMob,
            stateCode: addShipper.stateCode,
            gstNo: addShipper.gstNo.toUpperCase(),
            email: addShipper.shipperEmail,
            cityCode: addShipper.cityCode,
            companyName: addShipper.company
        };

        try {
            const response = await postApi('/Master/AddShippmerMaster', requestBody, 'POST')
            if (response.status === 1) {
                setAddShipper({
                    shipperCode: '',
                    custCode: '',
                    shipperName: '',
                    shipperAdd1: '',
                    shipperAdd2: '',
                    shipperPin: '',
                    cityCode: '',
                    stateCode: '',
                    shipperMob: '',
                    shipperEmail: '',
                    gstNo: '',
                    company: '',
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchShipper();

            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add branch data', 'error');
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
        fetchData('/Master/GetAllFlights', setGetFlight);
        fetchData('/Master/GetAllTrains', setGetTrain);
        fetchData('/Master/GetAllProducts', setGetProduct);

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
        if (!submittedData || submittedData.length === 0) return; // prevent zero overwrite
        const totalVol1 = submittedData.reduce(
            (acc, d) => acc + parseFloat(d.VolmetricWt || 0), 0
        );
        const totalAct1 = submittedData.reduce(
            (acc, d) => acc + parseFloat(d.ActualWt || 0), 0
        );
        const totalCharge1 = submittedData.reduce(
            (acc, d) => acc + parseFloat(d.ChargeWt || 0), 0
        );

        setTotalVolWt1(totalVol1);
        setTotalActWt1(totalAct1);
        setTotalChargeWt1(totalCharge1);

        setFormData((prev) => ({
            ...prev,
            ActualWt: totalAct1,
            VolumetricWt: totalVol1,
            ChargedWt: totalCharge1,
        }));
    }, [submittedData]);


    useEffect(() => {
        if (!vendorsubmittedData || vendorsubmittedData.length === 0) return;
        const totalVol = vendorsubmittedData.reduce((acc, data) => acc + parseFloat(data.VolmetricWt || 0), 0);
        const totalAct = vendorsubmittedData.reduce((acc, data) => acc + parseFloat(data.ActualWt || 0), 0);
        const totalCharge = vendorsubmittedData.reduce((acc, data) => acc + parseFloat(data.ChargeWt || 0), 0);

        setTotalVolWt(totalVol);
        setTotalActWt(totalAct);
        setTotalChargeWt(totalCharge);
        setFormData((prev) => ({
            ...prev,
            VendorWt: totalAct,
        }));
    }, [vendorsubmittedData]);



    const handleAddRow = (e) => {
        e.preventDefault();

        if (!volumetricData.ActualWt || !volumetricData.ChargeWt || !volumetricData.VolmetricWt) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in the empty fields.',
                confirmButtonText: 'OK',
            });
            return;
        }
        if (!volumetricData.Qty) {
            Swal.fire({
                icon: 'warning',
                title: 'Qty Zero',
                text: 'Qty should not be zero.',
                confirmButtonText: 'OK',
            });
            return;
        }
        if (editIndex !== null) {
            // update existing row
            const updated = [...submittedData];
            updated[editIndex] = volumetricData;
            setSubmittedData(updated);
            setEditIndex(null);
        } else {
            // add new row
            setSubmittedData((prev) => [...prev, volumetricData]);
        }
        setVolumetricData(pre => ({
            ...pre,
            Length: 0,
            Width: 0,
            Height: 0,
            Qty: 0,
            VolmetricWt: 0,
            ActualWt: 0,
            ChargeWt: 0,
        }));
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
        if (editIndex !== null) {
            // update existing row
            const updated = [...vendorsubmittedData];
            updated[editIndex] = vendorVolumetric;
            setVendorSubmittedData(updated);
            setEditIndex(null);
        } else {
            // add new row
            setVendorSubmittedData((prev) => [...prev, vendorVolumetric]);
        }
        setVendorvolumetric(pre => ({
            ...pre,
            Length: 0,
            Width: 0,
            Height: 0,
            Qty: 0,
            VolmetricWt: 0,
            ActualWt: 0,
            ChargeWt: 0,
        }));
    };

    const handleInvoiceAddRow = (e) => {
        e.preventDefault();

        if (!invoiceData.EWayBillNo || !invoiceData.InvoiceNo || !invoiceData.InvoiceValue || !invoiceData.PoDate || !invoiceData.PoNo || !invoiceData.Qty) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in the empty fields.',
                confirmButtonText: 'OK',
            });
            return;
        }
        if (editIndex !== null && InvoicesubmittedData[editIndex]) {
            // Update existing row
            const originalInvoice = InvoicesubmittedData[editIndex];
            const oldInvoice = [...InvoicesubmittedData];
            oldInvoice[editIndex] = invoiceData;
            setInvoiceSubmittedData(oldInvoice);
            setEditIndex(null); // reset edit mode
            // 2️⃣ Update formData

            setFormData((prev) => {
                const replaceInCSV = (csv, oldValue, newValue) => {
                    if (!csv) return "";
                    return csv
                        .split(",")
                        .map(item => item.trim().toLowerCase() === oldValue.toLowerCase() ? newValue : item.trim())
                        .join(",");
                };

                return {
                    ...prev,
                    InvoiceNo: replaceInCSV(prev.InvoiceNo || "", originalInvoice.InvoiceNo || "", invoiceData.InvoiceNo || ""),
                    InvValue: (Number(prev.InvValue || 0) - Number(originalInvoice.InvoiceValue || 0)) + Number(invoiceData.InvoiceValue || 0),
                    EwayBill: replaceInCSV(prev.EwayBill || "", originalInvoice.EWayBillNo || "", invoiceData.EWayBillNo || ""),
                };
            });


        } else {
            setInvoiceSubmittedData([...InvoicesubmittedData, invoiceData]);
            setFormData((prev) => ({
                ...prev,
                InvoiceNo: prev.InvoiceNo
                    ? prev.InvoiceNo + "," + invoiceData.InvoiceNo
                    : invoiceData.InvoiceNo,
                InvValue: Number(prev.InvValue || 0) + Number(invoiceData.InvoiceValue || 0),
                EwayBill: prev.EwayBill
                    ? prev.EwayBill + "," + invoiceData.EWayBillNo
                    : invoiceData.EWayBillNo,
            }));
        }

        setInvoiceData({
            PoNo: "",
            PoDate: getTodayDate(),
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



    // ✅ Keep only this
    const handleShipperChange = (selectedOption) => {
        if (selectedOption) {
            // ✅ Immediately show the label (for existing or created options)
            setFormData((prev) => ({
                ...prev,
                Shipper_Name: selectedOption.value,
                ShipperAdd: selectedOption.shipper_Add1,
                ShipperAdd2: selectedOption.shipper_Add2,
                ShipperAdd3: selectedOption.shipper_Add3,
                ShipperCity: selectedOption.City_Code,
                Shipper_StateCode: selectedOption.State_Code,
                Shipper_GstNo: selectedOption.GSTNo,
                ShipperPin: selectedOption.shipper_Pin,
                ShipperPhone: selectedOption.shipper_Mob,
                ShipperEmail: selectedOption.shipper_Email,
            }));
        } else {
            setFormData((prev) => ({ ...prev, Shipper_Name: "" }));
        }
        setInputValue("");
    };
    useEffect(() => {

        console.log("input==0");
    }, [formData.Customer_Code, formData.Mode_Code]);

    useEffect(() => {
        const handleMakeRate = async () => {
            try {
                const body = {
                    Client_Code: formData.Customer_Code,
                    Mode_Codes: formData.Mode_Code,
                    Origin_Code: formData.OriginCode,
                    Destination_Codes: formData.DestinationCode,
                    Zone_Codes: formData.Dest_Zone,
                    State_Codes: getCity.find(c => c.City_Code === formData.DestinationCode)?.State_Code || "7",
                    Weight: Math.max(parseFloat(formData.ActualWt) || 0, parseFloat(formData.VolumetricWt) || 0, parseFloat(formData.ChargedWt) || 0),
                    Method: formData.BookMode,
                    Dox_Spx: formData.DoxSpx,
                };
                const response = await postApi("/Master/GetCustomerFinalRate_CityState", body);
                console.log(response);
                // 
                if (response?.GetDataSuccess === 1 && response.Data.length > 0) {
                    const rateperKg = response.Data[0].Detail_Rate;
                    // 
                    // ✅ Update rate and trigger GST calculation automatically
                    setFormData((prev) => ({
                        ...prev,
                        RatePerkg: rateperKg,
                    }));
                }
                else {
                    setFormData((prev) => ({
                        ...prev,
                        RatePerkg: 0,
                    }));
                }
            } catch (error) {
                console.error("❌ Error fetching rate:", error);
            }
        };
        // 
        if (formData.Customer_Code && formData.Mode_Code && formData.Dest_Zone && formData.OriginCode) {
            handleMakeRate();
        }
    },
        [formData.Customer_Code,
        formData.Mode_Code,
        formData.OriginCode,
        formData.DestinationCode,
        formData.Dest_Zone,
        formData.BookMode,
        formData.DoxSpx,
        formData.ActualWt,
        formData.VolumetricWt,
        formData.ChargedWt]);



    useEffect(() => {
        const calculateVenGstDetails = async () => {
            try {
                const {
                    Vendor_Code,
                    Mode_Code,
                    VendorAmt,
                } = formData;

                if (!Vendor_Code || !Mode_Code || !VendorAmt) return;

                const body = {
                    Vendor_Code: Vendor_Code,
                    Mode_Code: Mode_Code,
                    Rate: VendorAmt,
                    UseInput: UseInput,
                };

                const response = await postApi(`/Master/VendorcalculateGST`, body);

                const gst = response.Data;
                console.log("✅ GST API Response:", gst);
                setUseInput(gst?.Success);
                console.log(`input==${gst?.Success}`);

                if (gst.Rate == 0) {
                    gst.Rate = formData.VendorAmt;
                    gst.Subtotal = formData.VendorAmt;
                    gst.TotalAmount = formData.VendorAmt;
                }

                setVendorShow(prev => ({
                    ...prev,
                    Rate: gst.Rate,
                    Fuel_Charges: gst.Fuel_Charges,
                    Fuel_Per: gst.Fuel_Per,
                    Fov_Charges: gst.Fov_Charges,
                    Fov_Per: gst.Fov_Per,
                    Docket_Charges: gst.Docket_Charges,
                    ODA_Charges: gst.ODA_Charges,
                    Delivery_Charges: gst.Delivery_Charges,
                    Packing_Charges: gst.Packing_Charges,
                    Green_Charges: gst.Green_Charges,
                    Hamali_Charges: gst.Hamali_Charges,
                    Other_Charges: gst.Other_Charges,
                    Insurance_Charges: gst.Insurance_Charges,
                    Subtotal: gst.Subtotal,
                    CGSTPer: gst.CGSTPer,
                    CGSTAmt: gst.CGSTAmt,
                    SGSTPer: gst.SGSTPer,
                    SGSTAmt: gst.SGSTAmt,
                    IGSTPer: gst.IGSTPer,
                    IGSTAmt: gst.IGSTAmt,
                    TotalGST: gst.TotalGST,
                    TotalAmount: gst.TotalAmount,
                }));

            } catch (error) {
                console.error("❌ Error in GST API:", error);
            }
        };

        if (
            formData.Vendor_Code &&
            formData.Mode_Code &&
            formData.VendorAmt
        ) {
            calculateVenGstDetails();
        }
    }, [
        formData.Vendor_Code,
        formData.Mode_Code,
        formData.VendorAmt,
    ]);

    useEffect(() => {
        // 🔵 1) FETCH RATE → UPDATE VendorAmt → CALL GST
        const handleVenMakeRate = async () => {
            try {
                const body = {
                    Vendor_Code: formData.Vendor_Code,
                    Mode_Codes: formData.Mode_Code,
                    Origin_Code: formData.OriginCode,
                    Destination_Codes: formData.DestinationCode,
                    Zone_Codes: formData.Dest_Zone,
                    State_Codes: getCity.find(c => c.City_Code === formData.DestinationCode)?.State_Code || "27",
                    Weight: parseFloat(formData.VendorWt),
                    Method: "Credit",
                    Dox_Spx: formData.DoxSpx,
                };

                const res = await postApi("/Master/VendorRateCalculation", body);
                if (res.GetDataSuccess === 1 && res.Data.length > 0) {
                    let rateKg = Number(res?.Data?.[0]?.RatePerKg) || 0;
                    let amount = rateKg * Number(formData.VendorWt || 0);

                    // 1️⃣ Update both together to avoid stale data
                    setFormData(prev => ({
                        ...prev,
                        VendorRatePerkg: rateKg,
                        VendorAmt: amount
                    }));

                    // 2️⃣ Immediately calculate GST using fresh amount (not from state)

                }
                else {
                    setFormData(prev => ({
                        ...prev,
                        VendorRatePerkg: 0,
                        VendorAmt: 0
                    }));


                }

            } catch (err) {
                console.log("❌ Rate API Failed", err);


            }
        };

        // 
        if (formData.Vendor_Code && formData.Mode_Code && formData.Dest_Zone && formData.OriginCode && formData.VendorWt) {
            handleVenMakeRate();
        }
    },
        [
            formData.Vendor_Code,
            formData.Mode_Code,
            formData.OriginCode,
            formData.DestinationCode,
            formData.Dest_Zone,
            formData.BookMode,
            formData.DoxSpx,
            formData.VendorWt]);
    useEffect(() => {
        setVendorShow({
            Rate: 0,
            Fuel_Charges: 0,
            Fuel_Per: 0,
            Fov_Charges: 0,
            Fov_Per: 0,
            Docket_Charges: 0,
            ODA_Charges: 0,
            Delivery_Charges: 0,
            Packing_Charges: 0,
            Green_Charges: 0,
            Hamali_Charges: 0,
            Other_Charges: 0,
            Insurance_Charges: 0,
            Subtotal: 0,
            CGSTPer: 0,
            CGSTAmt: 0,
            SGSTPer: 0,
            SGSTAmt: 0,
            IGSTPer: 0,
            IGSTAmt: 0,
            TotalGST: 0,
            TotalAmount: 0
        });

    }, [formData.VendorAmt])

    useEffect(() => {
        const calculateGstDetails = async () => {
            try {
                const {
                    Customer_Code,
                    Mode_Code,
                    Rate,
                    BookMode,
                    FovChrgs,
                    DocketChrgs,
                    ODAChrgs,
                    DeliveryChrgs,
                    PackingChrgs,
                    GreenChrgs,
                    HamaliChrgs,
                    OtherCharges,
                    InsuranceChrgs
                } = formData;

                if (!Customer_Code || !Mode_Code || !Rate || !BookMode) return;

                // Build request body
                const body = {
                    Customer_Code,
                    Mode_Code,
                    Rate,
                    T_Flag: BookMode,
                    FovChrgsInput: FovChrgs || 0,
                    DocketChrgsInput: DocketChrgs || 0,
                    OdaChrgsInput: ODAChrgs || 0,
                    DeliveryChrgsInput: DeliveryChrgs || 0,
                    PackingChrgsInput: PackingChrgs || 0,
                    GreenChrgsInput: GreenChrgs || 0,
                    HamaliChrgsInput: HamaliChrgs || 0,
                    OtherChargesInput: OtherCharges || 0,
                    InsuranceChrgsInput: InsuranceChrgs || 0,
                    UseInput: UseInput,
                };

                const response = await postApi(`/Booking/calculateGST`, body);

                if (response?.status === 0) {
                    const gst = response.Data;
                    console.log("✅ GST API Response:", gst);
                    setUseInput(gst?.Success);
                    console.log(`input==${gst?.Success}`);
                    setGstData({
                        CGSTAMT: gst.CGSTAMT,
                        SGSTAMT: gst.SGSTAMT,
                        IGSTAMT: gst.IGSTAMT,
                        TotalGST: gst.TotalGST,
                        CGSTPer: gst.CGSTPer,
                        SGSTPer: gst.SGSTPer,
                        IGSTPer: gst.IGSTPer,
                        GSTPer: gst.CGSTPer + gst.SGSTPer + gst.IGSTPer,
                    });

                    // setIsGstCalculated(true);
                    setFormData((prev) => ({
                        ...prev,
                        FuelCharges: gst.Fuel_Charges,
                        FuelPer: gst.CustomerFuel,
                        CGST: gst.CGSTAMT,
                        SGST: gst.SGSTAMT,
                        IGST: gst.IGSTAMT,
                        TotalGST: gst.TotalGST,
                        totalgstPer: gst.CGSTPer + gst.SGSTPer + gst.IGSTPer,
                        TotalAmt: gst.TotalAmt,
                        FovChrgs: gst.Fov_Charges,
                        FovPer: gst.Fov_Per || 0,
                        DocketChrgs: gst.Docket_Charges,
                        DeliveryChrgs: gst.Delivery_Charges,
                        PackingChrgs: gst.Packing_Charges,
                        GreenChrgs: gst.Green_Charges,
                        HamaliChrgs: gst.Hamali_Charges,
                        OtherCharges: gst.Other_Charges,
                        InsuranceChrgs: gst.Insurance_Charges,
                    }));
                }
            } catch (error) {
                console.error("❌ Error in GST API:", error);
            }
        };

        // Run only when essential fields change
        if (
            !skipGstCalc &&
            !isGstCalculated &&
            formData.Customer_Code &&
            formData.Mode_Code &&
            formData.Rate &&
            formData.BookMode
        ) {
            calculateGstDetails();
        }
    }, [
        formData.Customer_Code,
        formData.Mode_Code,
        formData.Rate,
        formData.BookMode,
        formData.FovChrgs,
        formData.DocketChrgs,
        formData.ODAChrgs,
        formData.DeliveryChrgs,
        formData.PackingChrgs,
        formData.GreenChrgs,
        formData.HamaliChrgs,
        formData.OtherCharges,
        formData.InsuranceChrgs,
        skipGstCalc
    ]);
    useEffect(() => {
        const getVolum = async (Customer_Code, Mode_Code) => {
            try {
                const response = await getApi(
                    `/Master/GetVolume?Customer_Code=${Customer_Code}&Mode_Code=${Mode_Code}`
                );
                if (response?.status === 1) {
                    const Data = response.data[0];
                    console.log('✅ Data:', Data);
                    setVolumetricData((prev) => ({
                        ...prev,
                        DivideBy: Number(Data.Centimeter),
                        cft: Number(Data.Feet),
                    }))

                }
                else {
                    setVolumetricData((prev) => ({
                        ...prev,
                        DivideBy: 0,
                    }))
                }
            } catch (error) {
                console.error("❌ Error in Volumetric:", error);
            }
        };
        if (formData.Customer_Code && formData.Mode_Code) {
            getVolum(formData.Customer_Code, formData.Mode_Code);
        }
    }, [formData.Customer_Code, formData.Mode_Code]);
    useEffect(() => {

        if (volumetricData.Length && volumetricData.Width && volumetricData.Height && volumetricData.Qty) {
            console.log(volumetricData)
            let ans = 1;
            ans = ans * Number(volumetricData.Length);
            ans = ans * Number(volumetricData.Width);
            ans = ans * Number(volumetricData.Height);
            console.log(ans);
            if (volumetricData.cft) ans = ans * volumetricData.cft;
            console.log(ans);
            ans = ans / volumetricData.DivideBy;
            console.log(ans);
            ans = ans * Number(volumetricData.Qty);
            console.log(ans);
            setVolumetricData((prev) => (
                {
                    ...prev,
                    VolmetricWt: ans.toFixed(2),
                }
            ))
        }
    }, [volumetricData.Length, volumetricData.Width, volumetricData.Height, volumetricData.Qty])
    useEffect(() => {
        const getVolum = async (Vendor_Code, Mode_Code) => {
            try {
                const response = await getApi(
                    `Master/VendorVolumetric?Vondor_Code=${Vendor_Code}&Mode_Code=${Mode_Code}`
                );
                if (response?.status === 1) {
                    const Data = response.data[0];
                    console.log('✅ Data:', Data);
                    setVendorvolumetric((prev) => ({
                        ...prev,
                        DivideBy: Number(Data.Centimeter),
                        cft: Number(Data.Feet),
                    }))

                }
                else {
                    setVendorvolumetric((prev) => ({
                        ...prev,
                        DivideBy: 0,
                    }))
                }
            } catch (error) {
                console.error("❌ Error in Volumetric:", error);
            }
        };
        if (formData.Vendor_Code && formData.Mode_Code) {
            getVolum(formData.Vendor_Code, formData.Mode_Code);
        }
    }, [formData.Vendor_Code, formData.Mode_Code]);
    useEffect(() => {

        if (vendorVolumetric.Length && vendorVolumetric.Width && vendorVolumetric.Height && vendorVolumetric.Qty) {
            console.log(vendorVolumetric)
            let ans = 1;
            ans = ans * Number(vendorVolumetric.Length);
            ans = ans * Number(vendorVolumetric.Width);
            ans = ans * Number(vendorVolumetric.Height);
            console.log(ans);
            if (vendorVolumetric.cft) ans = ans * vendorVolumetric.cft;
            console.log(ans);
            ans = ans / vendorVolumetric.DivideBy;
            console.log(ans);
            ans = ans * Number(vendorVolumetric.Qty);
            console.log(ans);
            setVendorvolumetric((prev) => (
                {
                    ...prev,
                    VolmetricWt: ans.toFixed(2),
                }
            ))
        }
    }, [vendorVolumetric.Length, vendorVolumetric.Width, vendorVolumetric.Height, vendorVolumetric.Qty])
    useEffect(() => {
        const actual = parseFloat(formData.ActualWt) || 0;
        const volumetric = parseFloat(formData.VolumetricWt) || 0;
        const manualCharged = parseFloat(formData.ChargedWt) || 0;
        const ratePerKg = parseFloat(formData.RatePerkg) || 0;

        const highestWeight = Math.max(actual, volumetric, manualCharged);
        setFormData((prev) => ({
            ...prev,
            VendorWt: highestWeight,

        }));
        const freightAmount = highestWeight * ratePerKg;

        if (freightAmount > 0) {
            const fuelPer = parseFloat(formData.FuelPer);
            if (fuelPer > 0) {
                const fuel = (freightAmount * fuelPer) / 100;
                setFormData((prev) => ({
                    ...prev,
                    FuelCharges: fuel.toFixed(2),
                }));
            }
            setFormData((prev) => ({
                ...prev,
                Rate: freightAmount.toFixed(2),

            }));
        }
    }, [formData.ActualWt, formData.VolumetricWt, formData.ChargedWt, formData.RatePerkg]);


    useEffect(() => {
        const wt = parseFloat(formData.VendorWt) || 0;
        const ratePerKg = parseFloat(formData.VendorRatePerkg) || 0;
        const Amount = wt * ratePerKg;
        setFormData((prev) => ({
            ...prev,
            VendorAmt: Amount,

        }));


    }, [formData.VendorWt, formData.VendorRatePerkg]);









    // ================================Rate+All Charges calculate=======================
    const resetAllForms = () => {
        console.log("reset");
        setFormData({
            ActualShipper: "",
            ActualWt: 0,
            BillParty: "Client-wise Bill",
            BookDate: getTodayDate(),
            BookMode: "",
            ChargedWt: 0,
            ConsigneeAdd1: "",
            ConsigneeAdd2: "",
            ConsigneeGST: "",
            ConsigneePin: "",
            ConsigneeState: "",
            Consignee_City: "",
            ConsigneeEmail: "",
            ConsigneeMob: "",
            ConsigneeName: "",
            ConsigneeCountry: "",
            Customer_Code: "",
            DeliveryChrgs: 0,
            Dest_Zone: "",
            DestinationCode: "",
            DocketChrgs: 0,
            DocketNo: "",
            DoxSpx: "Box",
            DispatchDate: getTodayDate(),
            EwayBill: "",
            ExptDateOfDelvDt: "",
            Flight_Code: "",
            FovChrgs: 0,
            FovPer: 0,
            FuelCharges: 0,
            FuelPer: 0,
            GreenChrgs: 0,
            HamaliChrgs: 0,
            InsuranceChrgs: 0,
            InvDate: getTodayDate(),
            InvValue: 0,
            InvoiceNo: "",
            Location_Code: "",
            Mode_Code: "",
            ODAChrgs: 0,
            OriginCode: "",
            Origin_Zone: "",
            OtherCharges: 0,
            PackingChrgs: 0,
            QtyOrderEntry: "",
            Rate: 0,
            RatePerkg: 0,
            RateType: "Weight",
            Receiver_Code: "",
            ShipperAdd: "",
            ShipperAdd2: "",
            ShipperAdd3: "",
            ShipperCity: "",
            ShipperEmail: "",
            ShipperPhone: "",
            ShipperPin: "",
            Shipper_GstNo: "",
            Shipper_Name: "",
            Shipper_StateCode: "",
            Status: "",
            TotalAmt: 0,
            TotalGST: 0,
            totalgstPer: 0,
            Train_Code: "",
            VendorRatePerkg: 0,
            VendorAmt: 0,
            VendorAwbNo: "",
            VendorWt: 0,
            Vendor_Code: "",
            VolumetricWt: 0,
            WebAgent: "",
            destZoneName: "",
            orgZoneName: ""
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
            SGSTAMT: 0,
            TotalGST: 0,
            GSTPer: 0,
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
            cft: 0,
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
            cft: 0,
            VolmetricWt: 0,
            ActualWt: 0,
            ChargeWt: 0,
        });

        setInvoiceData({
            PoNo: "",
            PoDate: getTodayDate(),
            InvoiceNo: "",
            InvoiceValue: 0,
            Description: "",
            Qty: 0,
            EWayBillNo: "",
            Remark: "",
            InvoiceImg: ""
        });

        setSubmittedData([]);
        setInvoiceSubmittedData([]);
        setVendorSubmittedData([]);
    };

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
        if (!formData.OriginCode) errors.push("Origin_Name is required");
        if (!formData.QtyOrderEntry || parseFloat(formData.QtyOrderEntry) <= 0) errors.push("Quantity must be greater than 0");
        // if (!formData.DoxSpx) errors.push("DoxSpx is required");
        // if (!formData.RateType) errors.push("RateType is required");

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
            Location_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
            DocketNo: formData.DocketNo,
            BookDate: formatDate(formData.BookDate),
            Customer_Code: formData.Customer_Code,
            // ✅ Consignee
            Receiver_Code: formData.ConsigneeName, // Code or Value from select
            Consignee_Name:
                allReceiverOption.find(opt => opt.value === formData.ConsigneeName)?.label ||
                formData.ConsigneeName, // Label or text entered
            Consignee_Add1: formData.ConsigneeAdd1,
            Consignee_Add2: formData.ConsigneeAdd2,
            Consignee_State: formData.ConsigneeState,
            Consignee_Pin: formData.ConsigneePin,
            Consignee_City: formData.Consignee_City,
            Consignee_Mob: formData.ConsigneeMob,
            Consignee_Email: formData.ConsigneeEmail,
            Consignee_GST: formData.ConsigneeGST,
            Consignee_Country: formData.ConsigneeCountry,

            // ✅ Shipper
            Shipper_Code: formData.Shipper_Name, // value from dropdown
            Shipper_Name:
                allShipperOption.find(opt => opt.value === formData.Shipper_Name)?.label ||
                formData.Shipper_Name, // label or text entered
            ActualShipper: formData.ActualShipper,
            ShipperAdd: formData.ShipperAdd,
            ShipperAdd2: formData.ShipperAdd2,
            ShipperAdd3: formData.ShipperAdd3,
            ShipperCity: formData.ShipperCity,
            Shipper_StateCode: formData.Shipper_StateCode,
            Shipper_GstNo: formData.Shipper_GstNo,
            ShipperPin: formData.ShipperPin,
            ShipperPhone: formData.ShipperPhone,
            ShipperEmail: formData.ShipperEmail,

            Mode_Code: formData.Mode_Code,
            Origin_code: formData.OriginCode,
            Origin_Zone: formData.Origin_Zone,
            Origin_Pincode: selectedOriginPinCode,
            Destination_Code: formData.DestinationCode,
            Dest_Zone: formData.Dest_Zone,
            Dest_PinCode: selectedDestPinCode,
            BillParty: formData.BillParty,
            DispatchDate: formatDate(formData.DispatchDate),
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
            ActualShipper: formData.ActualShipper,

            InvoiceNo: formData.InvoiceNo,
            InvValue: formData.InvValue,
            EwayBill: formData.EwayBill,
            InvDate: formatDate(formData.InvDate),
            Remark: remarkData.Remark,
            MHWNo: remarkData.MHWNo,
            DestName: formData.DestName,
            T_Flag: formData.BookMode,
            UserName: JSON.parse(localStorage.getItem("Login"))?.Employee_Name,
            MultiInvoice: InvoicesubmittedData.map((invoice) => ({
                PoNo: invoice.PoNo,
                PoDate: formatDate(invoice.PoDate),
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
                setFecthed('');
                console.log(response);
                const generatedDocketNo = formData.DocketNo || response?.DocketNo;

                // Show confirmation popup
                const result = await Swal.fire({
                    title: `Docket Saved Successfully!: ${generatedDocketNo}`,
                    text: "Do you want to print the docket now?",
                    icon: 'success',
                    showCancelButton: true,
                    cancelButtonText: 'No, print',
                    reverseButtons: true,
                    confirmButtonText: 'Yes, print it!',
                });

                if (result.isConfirmed) {
                    try {
                        const res = await getApi(`/Booking/DocketReceipt?FromDocket=${generatedDocketNo}&ToDocket=${generatedDocketNo}`);
                        if (res.status === 1) {
                            navigate("/MobileReceipt", { state: { data: res.Data, path: location.pathname } });
                        }
                    } catch (error) {
                        console.error("API Error:", error);
                    }
                }

                // ✅ Always reset after save (whether user confirms or not)
                const Customer_Code = formData.Customer_Code;
                const Origin_code = formData.OriginCode;
                const Pincode = selectedOriginPinCode;
                const zoneCode = formData.Origin_Zone;
                const zoneName = formData.orgZoneName;
                const bill = formData.BillParty;
                const book = formData.BookMode;
                const mode = formData.Mode_Code;

                resetAllForms();
                setFormData(prev => ({
                    ...prev,
                    Customer_Code: Customer_Code,
                    OriginCode: Origin_code,
                    Origin_Zone: zoneCode,
                    orgZoneName: zoneName,
                    BillParty: bill,
                    BookMode: book,
                    Mode_Code: mode,
                }));
                setSelectedOriginPinCode(Pincode);
            }

        } catch (error) {
            console.error('Unable to save Booking Data:', error);
        }
    };



    const handleUpdate = async (e) => {
        e.preventDefault();
        const requestBody = {
            Location_Code: JSON.parse(localStorage.getItem("Login"))?.Branch_Code,
            DocketNo: formData.DocketNo,
            BookDate: formatDate(formData.BookDate),
            Customer_Code: formData.Customer_Code,
            // ✅ Consignee
            Receiver_Code: formData.ConsigneeName, // Code or Value from select
            Consignee_Name:
                allReceiverOption.find(opt => opt.value === formData.ConsigneeName)?.label ||
                formData.ConsigneeName, // Label or text entered
            Consignee_Add1: formData.ConsigneeAdd1,
            Consignee_Add2: formData.ConsigneeAdd2,
            Consignee_State: formData.ConsigneeState,
            Consignee_Pin: formData.ConsigneePin,
            Consignee_City: formData.Consignee_City,
            Consignee_Mob: formData.ConsigneeMob,
            Consignee_Email: formData.ConsigneeEmail,
            Consignee_GST: formData.ConsigneeGST,
            Consignee_Country: formData.ConsigneeCountry,

            // ✅ Shipper
            Shipper_Code: formData.Shipper_Name, // value from dropdown
            Shipper_Name:
                allShipperOption.find(opt => opt.value === formData.Shipper_Name)?.label ||
                formData.Shipper_Name, // label or text entered
            ActualShipper: formData.ActualShipper,
            ShipperAdd: formData.ShipperAdd,
            ShipperAdd2: formData.ShipperAdd2,
            ShipperAdd3: formData.ShipperAdd3,
            ShipperCity: formData.ShipperCity,
            Shipper_StateCode: formData.Shipper_StateCode,
            Shipper_GstNo: formData.Shipper_GstNo,
            ShipperPin: formData.ShipperPin,
            ShipperPhone: formData.ShipperPhone,
            ShipperEmail: formData.ShipperEmail,

            Mode_Code: formData.Mode_Code,
            Origin_code: formData.OriginCode,
            Origin_Zone: formData.Origin_Zone,
            Origin_Pincode: selectedOriginPinCode,
            Destination_Code: formData.DestinationCode,
            Dest_Zone: formData.Dest_Zone,
            Dest_PinCode: selectedDestPinCode,
            BillParty: formData.BillParty,
            DispatchDate: formatDate(formData.DispatchDate),
            DoxSpx: formData.DoxSpx,
            RateType: formData.RateType,
            Qty: formData.QtyOrderEntry,
            ActualWt: formData.ActualWt,
            VendorWt: formData.VendorWt,
            VendorAmt: formData.VendorAmt,
            VolumetricWt: formData.VolumetricWt,
            ChargedWt: formData.ChargedWt,
            RatePerKg: formData.RatePerkg,
            Rate: formData.Rate,
            FuelPer: formData.FuelPer,
            FuelCharges: formData.FuelCharges,
            Fov_Chrgs: formData.FovChrgs,
            DocketChrgs: formData.DocketChrgs,
            ODA_Chrgs: formData.ODAChrgs,
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


            UserName: JSON.parse(localStorage.getItem("Login"))?.Employee_Name,
            InvoiceNo: formData.InvoiceNo,
            InvValue: formData.InvValue,
            EwayBill: formData.EwayBill,
            InvDate: formatDate(formData.InvDate),
            Remark: remarkData.Remark,
            MHWNo: remarkData.MHWNo,
            DestName: formData.DestName,
            T_Flag: formData.BookMode,
            MultiInvoice: InvoicesubmittedData.map((invoice) => ({
                PoNo: invoice.PoNo,
                PoDate: formatDate(invoice.PoDate),
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
        try {
            const res = await putApi(`/Booking/OrderEntryUpdate`, requestBody);
            if (res.Success) {
                Swal.fire('Updated!', res.message || 'Booking updated.', 'success');
                // ✅ Always reset after save (whether user confirms or not)
                const Customer_Code = formData.Customer_Code;
                const Origin_code = formData.OriginCode;
                const Pincode = selectedOriginPinCode;
                const zoneCode = formData.Origin_Zone;
                const zoneName = formData.orgZoneName;
                const bill = formData.BillParty;
                const book = formData.BookMode;
                const mode = formData.Mode_Code;

                resetAllForms();
                setFormData(prev => ({
                    ...prev,
                    Customer_Code: Customer_Code,
                    OriginCode: Origin_code,
                    Origin_Zone: zoneCode,
                    orgZoneName: zoneName,
                    BillParty: bill,
                    BookMode: book,
                    Mode_Code: mode,
                }));
                setSelectedOriginPinCode(Pincode);
                setFecthed('');
            } else Swal.fire('Error', res.message || 'Update failed.', 'error');
        } catch (err) {
            Swal.fire('Error', 'Something went wrong while updating.', 'error');
            console.log(err);
        }
    };


    const handleSearch = async (docket) => {
        if (!formData.DocketNo) return Swal.fire("Warning", "Enter Docket No", "warning");
        if (fecthed === formData.DocketNo) {
            return Swal.fire("Warning", `Docket ${formData.DocketNo} already Fetched`, "warning");
        }
        try {
            const res = await getApi(`/Booking/getOrderByDocket?docketNo=${formData.DocketNo}`);
            if (res.Success === 1 && res.OrderEntry) {
                Swal.fire({
                    title: 'Success!',
                    text: "Data Fecthed Successfuly",
                    icon: 'success',
                });
                setSkipGstCalc(true);
                setFecthed(docket);
                const data = res.OrderEntry;
                console.log(data);

                setFormData(
                    prev => ({
                        ...prev,
                        Location_Code: data.Location_Code,
                        DocketNo: data.DocketNo,
                        BookDate: data.BookDate,
                        Customer_Code: data.Customer_Code,
                        ConsigneeName: data.Receiver_Code,
                        ConsigneeAdd1: data.Consignee_Add1,
                        ConsigneeAdd2: data.Consignee_Add2,
                        ConsigneeState: data.Consignee_State,
                        ConsigneePin: data.Consignee_Pin,
                        Consignee_City: data.Consignee_City,
                        ConsigneeMob: data.Consignee_Mob,
                        ConsigneeEmail: data.Consignee_Email,
                        ConsigneeGST: data.Consignee_GST,
                        ConsigneeCountry: data.Consignee_Country,
                        Mode_Code: data.Mode_Code,
                        OriginCode: data.Origin_code,
                        DestinationCode: data.Destination_Code,
                        Origin_Zone: data.Origin_Zone,
                        Dest_Zone: data.Dest_Zone,
                        orgZoneName: data.Origin_Zone
                            ? getCity.find(c => c.Zone_Code === data.Origin_Zone)?.Zone_Name || ""
                            : "",

                        destZoneName: data.Dest_Zone
                            ? getCity.find(c => c.Zone_Code === data.Dest_Zone)?.Zone_Name || ""
                            : "",

                        DispatchDate: data.DispatchDate,
                        DoxSpx: data.DoxSpx,
                        RateType: data.RateType,
                        QtyOrderEntry: data.Qty,
                        ActualWt: data.ActualWt,
                        VendorWt: data.VendorWt,
                        VendorAmt: data.VendorAmt,
                        VolumetricWt: data.VolumetricWt,
                        ChargedWt: data.ChargedWt,
                        RatePerkg: data.RatePerKg,
                        Rate: data.Rate,
                        FuelPer: data.FuelPer,
                        FuelCharges: data.FuelCharges,        // ✅ matches API
                        FovChrgs: data.Fov_Chrgs,             // ✅ underscore in API
                        DocketChrgs: data.DocketChrgs,        // ✅ matches API
                        ODAChrgs: data.ODA_Chrgs,             // ✅ underscore in API
                        DeliveryChrgs: data.DeliveryChrgs,    // ✅ matches API
                        PackingChrgs: data.PackingChrgs,      // ✅ matches API
                        GreenChrgs: data.GreenChrgs,          // ✅ matches API
                        HamaliChrgs: data.HamaliChrgs,        // ✅ matches API
                        OtherCharges: data.OtherCharges,      // ✅ matches API
                        InsuranceChrgs: data.InsuranceChrgs,  // ✅ matches API
                        TotalAmt: data.TotalAmt,
                        Status: data.Remark,
                        Vendor_Code: data.Vendor_Code,
                        VendorAwbNo: data.VendorAwbNo,
                        WebAgent: "",
                        ExptDateOfDelvDt: data.ExptDateOfDelvDt,
                        Shipper_Name: data.Shipper_Code,
                        ShipperAdd: data.ShipperAdd,
                        ShipperAdd2: data.ShipperAdd2,
                        ShipperAdd3: data.ShipperAdd3,
                        ShipperPin: data.ShipperPin,
                        ShipperPhone: data.ShipperPhone,
                        ShipperCity: data.ShipperCity,
                        Shipper_StateCode: data.Shipper_StateCode,
                        Shipper_GstNo: data.Shipper_GstNo,
                        ShipperEmail: data.ShipperEmail,
                        UserName: data.UserName,
                        InvoiceNo: data.InvoiceNo,
                        InvValue: data.InvValue,
                        EwayBill: data.EwayBill,
                        InvDate: data.InvDate,
                        BillParty: data.BillParty,
                        BookMode: data.T_Flag,
                        TotalGST: data.CGSTAMT + data.SGSTAMT + data.IGSTAMT,
                        totalgstPer: data.CGSTPer + data.SGSTPer + data.IGSTPer,

                    }));
                setGstData(pre => ({
                    ...pre,
                    CGSTPer: data.CGSTPer,
                    CGSTAMT: data.CGSTAMT,
                    SGSTPer: data.SGSTPer,
                    SGSTAMT: data.SGSTAMT,
                    IGSTPer: data.IGSTPer,
                    IGSTAMT: data.IGSTAMT,
                    GSTPer: data.CGSTPer + data.SGSTPer + data.IGSTPer,
                    TotalGST: data.CGSTAMT + data.SGSTAMT + data.IGSTAMT,
                })
                )
                setRemarkData({
                    Remark: data.Remark,
                    MHWNo: data.MHWNo,
                });
                setSelectedOriginPinCode(data.Origin_Pincode);
                setSelectedDestPinCode(data.Dest_PinCode);

                const multiInvoice = res.MultiInvoice || [];
                console.log("search", multiInvoice);
                const formattedInvoices = multiInvoice.map(item => ({
                    PoNo: item.PoNo || "",
                    PoDate: new Date(item.PoDate) || "",
                    InvoiceNo: item.InvNo || "",
                    InvoiceValue: item.InvValue || "",
                    Description: item.Description || "",
                    Qty: item.Qty || 0,
                    EWayBillNo: item.EWayBill || "",
                    Remark: item.Remark || "",
                    InvoiceImg: item.InvoiceImg || ""
                }));
                setInvoiceSubmittedData(formattedInvoices);
                setSubmittedData(res.Volumetric);
                setVendorSubmittedData(res.VendorVolumetric)



                // Qty: 0,
                // DivideBy: "",
                // VolmetricWt: 0,
                // ActualWt: 0,
                // ChargeWt: 0
                //  Length:item.Length || 0,
                //  Width:item.Width || 0,
                //  Height:item.Height || 0,
                //  Qty.item.Qty || 0,
                //  item.DivideBy || "",
                //  item.VolmetricWt || 0,
                //  item.ActualWt || 0,
                //  item.ChargeWt || 0,
                // }))



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
                const res = await deleteApi(`/Booking/deleteOrderByDocket?docketNo=${docketNo}`);
                if (res.Success) {
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
    const allProductOptions = getProduct.map(p => ({
        value: p.Product_Code,   // what you store
        label: p.Product_Name, // visible in dropdown
    }));

    const allModeOptions = getMode?.length > 0 ? getMode.map(mode => ({ label: mode.Mode_Name, value: mode.Mode_Code })) : null;
    const allCityOptions = getCity?.length > 0 ? getCity.map(dest => ({
        label: dest.City_Name,         // Display name in dropdown
        value: dest.City_Code,         // City code for backen// Origin code
        pincode: dest.Pincode,         // Pincode
        zoneName: dest.Zone_Name,
        zoneCode: dest.Zone_Code,
    })) : null;
    const allVendorOption = getMode?.length > 0 ? getVendor.map(Vendr => ({ label: Vendr.Vendor_Name, value: Vendr.Vendor_Code })) : null;
    // const allReceiverOption = getReceiver.map(receiver => ({
    //     label: receiver.Receiver_Name,
    //     value: receiver.Receiver_Code
    // }));

    const allCustomerOptions = getCustomerdata?.length > 0 ? getCustomerdata.map(cust => ({ label: cust.Customer_Name, value: cust.Customer_Code.toString(), Booking_Type: cust.Booking_Type, CustomerGst: cust.CustomerGst, CustomerFuel: cust.CustomerFuel })) : null;




    return (
        <>

            <div className="body" style={{ margin: "0px", padding: "0px" }}>

                <div className="container1" style={{ padding: "0px", margin: "0px", paddingBottom: "0.8rem" }}>
                    <div className="container-2" style={{ border: "transparent", padding: "0px" }}>
                        <div className="left-card " style={{ margin: "0px" }} >


                            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} style={{ backgroundColor: "white" }}>
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
                                            onKeyDown={(e) => {
                                                if (toggleActive && e.key === "Enter" || toggleActive && e.key === "Tab") {
                                                    handleSearch(formData.DocketNo);
                                                }
                                            }}
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
                                                    formData.Customer_Code ?
                                                        {
                                                            value: formData.Customer_Code,
                                                            label: allCustomerOptions.find(opt => opt.value === formData.Customer_Code)?.label
                                                        } || ""
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        Customer_Code: selectedOption.value,
                                                        Customer_Name: selectedOption.label,
                                                        BookMode: selectedOption.Booking_Type,
                                                        totalgstPer: Number(selectedOption.CustomerGst),
                                                        FuelPer: Number(selectedOption.CustomerFuel),
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


                                <div className="container-fluid" style={{ paddingLeft: "1rem" }}>
                                    <div className="row g-2 align-items-end">
                                        {/* Shipper Name Input */}
                                        {isShipChecked && <div className="col-md-10 col-sm-9 col-12">
                                            <div className="input-field">
                                                <label htmlFor="shipper">Shipper Name</label>
                                                <CreatableSelect
                                                    className="blue-selectbooking"
                                                    classNamePrefix="blue-selectbooking"
                                                    options={allShipperOption}
                                                    value={
                                                        formData.Shipper_Name
                                                            ? allShipperOption.find((opt) => opt.value === formData.Shipper_Name) ||
                                                            { value: formData.Shipper_Name, label: inputValue || formData.Shipper_Name }
                                                            : null
                                                    }
                                                    inputValue={inputValue}
                                                    onInputChange={(val, meta) => {
                                                        if (meta.action === "input-change") {
                                                            // ✅ Immediately reflect what user is typing
                                                            setInputValue(val);

                                                            // ✅ Also update formData live so label and value stay in sync
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                Shipper_Name: val,
                                                            }));
                                                        }
                                                    }}
                                                    onChange={handleShipperChange}
                                                    isClearable
                                                    isSearchable
                                                    formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                                                    placeholder="Select Shipper Name"
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                    }}
                                                />

                                            </div>
                                        </div>}

                                        {/* Plus Button */}
                                        {isShipChecked && <div className="col-md-2 col-sm-3 col-12">
                                            <label className="invisible">+</label>
                                            <button
                                                type="button"
                                                className="ok-btn btn btn-outline-primary w-100"
                                                onClick={() => {
                                                    setAddShipper({
                                                        shipperCode: '',
                                                        custCode: '',
                                                        shipperName: '',
                                                        shipperAdd1: '',
                                                        shipperAdd2: '',
                                                        shipperPin: '',
                                                        cityCode: '',
                                                        stateCode: '',
                                                        shipperMob: '',
                                                        shipperEmail: '',
                                                        gstNo: '',
                                                        company: '',
                                                    });
                                                    setModalIsOpen(true);
                                                }}
                                            >
                                                <i className="bi bi-plus" style={{ fontSize: "20px" }}></i>
                                            </button>
                                        </div>}
                                    </div>
                                </div>

                                <div className="fields2">
                                    {isShipChecked && <>
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
                                        <div className="input-field">
                                            <label htmlFor="">State Name</label>
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

                                        <div className="input-field1">
                                            <label htmlFor="">Shipper Mobile No</label>
                                            <input
                                                type="tel"
                                                placeholder="Shipper Mobile No"
                                                maxLength={10}
                                                value={formData.ShipperPhone}
                                                onChange={(e) => setFormData({ ...formData, ShipperPhone: e.target.value })}
                                            />
                                        </div>

                                        <div className="input-field1">
                                            <label htmlFor="">Pin_Code</label>
                                            <input
                                                type="text"
                                                placeholder="Pin Code"
                                                maxLength={6}
                                                value={formData.ShipperPin}
                                                onChange={(e) => setFormData({ ...formData, ShipperPin: e.target.value })}
                                            />
                                        </div>
                                    </>}
                                    <div className="input-field1">
                                        <label htmlFor="">Booking Mode</label>
                                        <select value={formData.BookMode} onChange={(e) => setFormData({ ...formData, BookMode: e.target.value })}>
                                            <option value="" disabled>Select Booking Mode</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Credit">Credit</option>
                                            <option value="To-pay">To-pay</option>
                                            <option value="Google Pay">Google Pay</option>
                                            <option value="RTGS">RTGS</option>
                                            <option value="NEFT">NEFT</option>
                                        </select>
                                    </div>

                                    {/* Origin Row */}
                                    <div style={{ whiteSpace: "nowrap", display: "flex", width: "100%", gap: "2px" }}>
                                        <div className="input-field1" style={{ width: "21%" }}>
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
                                                value={formData.OriginCode ? { value: formData.OriginCode, label: allCityOptions.find(opt => opt.value === formData.OriginCode)?.label || "" } : null}
                                                onChange={(selected) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        OriginCode: selected.value,
                                                        Origin_code: selected.label,
                                                        Origin_Zone: selected.zoneCode,
                                                        orgZoneName: selected.zoneName

                                                    }));
                                                    setSelectedOriginPinCode(selected?.pincode);
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
                                            <input type="text" placeholder="Zone_Name" value={formData.orgZoneName} readOnly />
                                        </div>
                                    </div>

                                    {/* Destination Row */}
                                    <div style={{ whiteSpace: "nowrap", display: "flex", marginBottom: "1rem", width: "100%", gap: "2px" }}>
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

                                                        ? { value: formData.DestinationCode, label: allCityOptions.find(opt => opt.value === formData.DestinationCode)?.label || "" }
                                                        : null
                                                }
                                                onChange={(selected) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        DestinationCode: selected.value,
                                                        City_Name: selected.label,
                                                        Dest_Zone: selected.zoneCode,
                                                        destZoneName: selected.zoneName
                                                    }));
                                                    setSelectedDestPinCode(selected?.pincode);
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
                                                value={formData.destZoneName}
                                                readOnly
                                            />
                                        </div>
                                    </div>


                                    <div className="card border p-1 mx-0" style={{ overflowX: "hidden", width: "100%" }}>
                                        <div className="section-title">Vendor Information</div>

                                        <div className="fields2" style={{ whiteSpace: "nowrap", paddingRight: "0.5rem" }}>
                                            <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "5px" }}>
                                                <div className="input-field" style={{ flex: "5", position: "relative" }}>
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
                                                                Mode_Code: selectedOption.value
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
                                                <div className="input-field" style={{ flex: "2" }}>
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
                                        {isVenChecked && <><div className="fields2" style={{ whiteSpace: "nowrap", paddingRight: "0.5rem" }}>
                                            <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "5px" }}>
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
                                        </div>
                                            <div className="fields2" style={{ whiteSpace: "nowrap", paddingRight: "0.5rem" }}>
                                                <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "5px" }}>
                                                    <div className="input-field" style={{ flex: "5", position: "relative" }}>
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

                                                    <div className="input-field" style={{ flex: "2" }}>
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
                                                </div>
                                            </div>


                                            <div className="fields2" style={{ whiteSpace: "nowrap", paddingRight: "0.5rem" }}>
                                                <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "5px" }}>
                                                    <div className="input-field1">
                                                        <label className="form-label">Vendor Weight</label>
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            placeholder="V_Weight"
                                                            value={formData.VendorWt}
                                                            onChange={(e) => setFormData({ ...formData, VendorWt: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label className="form-label">Rate Per Kg</label>
                                                        <input
                                                            type="tel"
                                                            placeholder="Rate Per Kg"
                                                            value={formData.VendorRatePerkg || ''}
                                                            onChange={(e) => setFormData({ ...formData, VendorRatePerkg: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label className="form-label">Vendor Amount</label>
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            placeholder="Vendor Amount"
                                                            value={formData.VendorAmt}
                                                            readOnly
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, VendorAmt: e.target.value })
                                                            }
                                                        />
                                                    </div>

                                                    <div className="input-field1">
                                                        <label className="form-label">&nbsp;</label>
                                                        <button
                                                            type="button"
                                                            className="ok-btn"
                                                            onClick={() => setModalIsOpen8(true)}
                                                            style={{ height: "35px", width: "100%", }}
                                                        >
                                                            <i className="bi bi-cash-coin" style={{ fontSize: "24px" }}></i>
                                                        </button>
                                                    </div>





                                                </div>
                                            </div></>}


                                        {isFlightChecked && <div className="fields2" style={{ whiteSpace: "nowrap", paddingRight: "0.5rem" }}>
                                            <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "5px" }}>
                                                <div className="input-field" style={{ flex: "5", position: "relative" }}>
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
                                                            menuPortal: base => ({ ...base, zIndex: 9999 })
                                                        }}
                                                    />

                                                </div>
                                                <div className="input-field" style={{ flex: "2" }}>
                                                    <label>Code</label>
                                                    <input
                                                        type="tel"
                                                        placeholder="Code"
                                                        value={formData.Flight_Code || ''}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>}

                                        {isTrainChecked && <div className="fields2" style={{ whiteSpace: "nowrap", paddingRight: "0.5rem" }}>
                                            <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "5px" }}>
                                                <div className="input-field" style={{ flex: "5", position: "relative" }}>
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
                                                            menuPortal: base => ({ ...base, zIndex: 9999 })
                                                        }}
                                                    />

                                                </div>
                                                <div className="input-field" style={{ flex: "2" }}>
                                                    <label>Code</label>
                                                    <input
                                                        type="tel"
                                                        placeholder="Code"
                                                        value={formData.Train_Code || ''}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>}


                                    </div>

                                </div>
                            </form>




                        </div>



                        <div className="right-card" style={{ margin: "0px" }}>
                            <div className="section-title">Consignee Docket Information</div>
                            <form
                                onSubmit={handleSaveReceiverFromBooking}
                                style={{ padding: 0, margin: 0, backgroundColor: "white" }}
                                onKeyDown={handleKeyDown}
                            >
                                {/* Receiver Name Row */}
                                {isReceChecked && <div className="container-fluid mb-2">
                                    <div className="row g-2 align-items-end">
                                        <div className="col-md-10 col-sm-9 col-12">
                                            <div className="input-field mt-2" style={{ width: "100%", position: "relative" }}>
                                                <label>Consignee Name</label>
                                                <CreatableSelect
                                                    className="blue-selectbooking"
                                                    classNamePrefix="blue-selectbooking"
                                                    options={allReceiverOption}
                                                    value={
                                                        formData.ConsigneeName
                                                            ? allReceiverOption.find((opt) => opt.value === formData.ConsigneeName) ||
                                                            { value: formData.ConsigneeName, label: inputValue || formData.ConsigneeName }
                                                            : null
                                                    }
                                                    onChange={(selectedOption) => {
                                                        setInputValue1("");
                                                        if (selectedOption) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                ConsigneeName: selectedOption.value,
                                                                Consignee_City: selectedOption.City_Code,
                                                                ConsigneeState: selectedOption.State_Code,
                                                                ConsigneeCountry: "INDIA",
                                                                ConsigneePin: selectedOption.Receiver_Pin,
                                                                ConsigneeMob: selectedOption.Receiver_Mob,
                                                                ConsigneeEmail: selectedOption.Receiver_Email,
                                                                ConsigneeAdd1: selectedOption.Receiver_Add1,
                                                                ConsigneeAdd2: selectedOption.Receiver_Add2,
                                                                ConsigneeGST: selectedOption.GSTNo,
                                                            }));
                                                        }
                                                        else {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                ConsigneeName: "",
                                                            }));
                                                        }
                                                        // setSelectedOriginPinCode(selectedOption.Receiver_Pin)
                                                    }}
                                                    inputValue={inputValue1}
                                                    onInputChange={(val, meta) => {
                                                        if (meta.action === "input-change") {
                                                            // ✅ Immediately reflect what user is typing
                                                            setInputValue1(val);
                                                            // ✅ Also update formData live so label and value stay in sync
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                ConsigneeName: val,
                                                            }));
                                                        }
                                                    }}
                                                    isClearable
                                                    isSearchable
                                                    formatCreateLabel={(inputValue1) => `Create "${inputValue1}"`}
                                                    placeholder="Select Consignee Name"
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                    }}
                                                />

                                            </div>
                                        </div>
                                        <div className="col-md-2 col-sm-3 col-12">
                                            <label className="invisible">+</label>
                                            <button
                                                type="button"
                                                className="ok-btn btn btn-outline-primary w-100"
                                                onClick={() => {
                                                    setModalIsOpen1(true);
                                                    setAddReceiver({
                                                        receiverCode: '',
                                                        receiverName: '',
                                                        receiverAdd1: '',
                                                        receiverAdd2: '',
                                                        receiverPin: '',
                                                        cityCode: '',
                                                        stateCode: '',
                                                        receiverMob: '',
                                                        receiverEmail: '',
                                                        gstNo: '',
                                                        hsnNo: '',
                                                        sms: false,
                                                        emailId: false,
                                                        whatsApp: false
                                                    });
                                                }}
                                            >
                                                <i className="bi bi-plus" style={{ fontSize: "20px" }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>}

                                {/* Other Receiver Fields */}
                                <div className="fields2">
                                    {isReceChecked && <>
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
                                            <label>Consignee Address</label>
                                            <input
                                                type="text"
                                                placeholder="Consignee Address"
                                                value={formData.ConsigneeAdd1}
                                                onChange={(e) => setFormData({ ...formData, ConsigneeAdd1: e.target.value })}
                                            />
                                        </div>

                                        <div className="input-field">
                                            <label>Consignee Address2</label>
                                            <input
                                                type="text"
                                                placeholder="Consignee Address2"
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
                                            <label htmlFor="">State Name</label>
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
                                            <div>
                                                <input
                                                    type="email"
                                                    placeholder="Email ID"
                                                    value={formData.ConsigneeEmail}
                                                    onChange={(e) => setFormData({ ...formData, ConsigneeEmail: e.target.value })}
                                                    style={{ flex: 1 }}
                                                />
                                            </div>
                                        </div>
                                    </>}
                                    <div className="input-field3" style={{ marginTop: "23px" }}>
                                        <button className="btn btn-success" style={{}}>Save</button>
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

                                    {isRemarkChecked && (
                                        <div className="input-field1">
                                            <label>Content/Remark</label>
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
                                    <div className="input-field1">
                                        <label>Billing Type</label>
                                        <select value={formData.BillParty} onChange={(e) => setFormData({ ...formData, BillParty: e.target.value })}>
                                            <option value="" disabled>Select Billing Type</option>
                                            <option value="Client-wise Bill">Client-wise Bill</option>
                                            <option value="Shipper-wise Bill">Shipper-wise Bill</option>
                                            <option value="Vendor-wise Bill">Vendor-wise Bill</option>
                                            <option value="Product-wise Bill">Product-wise Bill</option>
                                            <option value="Consignee-wise Bill">Consignee-wise Bill</option>

                                        </select>
                                    </div>

                                    {dispatchDate && (
                                        <div className="input-field1">
                                            <label>Dispatch Date</label>
                                            <DatePicker
                                                selected={formData.DispatchDate ? new Date(formData.DispatchDate) : null}
                                                onChange={(date) =>
                                                    setFormData({ ...formData, DispatchDate: date })
                                                }
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="dd/mm/yyyy"
                                            />
                                        </div>
                                    )}
                                </div>
                            </form>




                            <div className="card mt-2" style={{ border: "transparent", padding: "0px" }}>
                                <div className="section-title">Charges Information</div>

                                <form
                                    action=""
                                    style={{ padding: "0px", margin: "0px", backgroundColor: "white" }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") e.preventDefault();
                                    }}
                                >
                                    <div className="fields2">
                                        {isProChecked && <div className="input-field1">
                                            <label>Package Type</label>

                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={allProductOptions}
                                                value={
                                                    formData.DoxSpx
                                                        ? allProductOptions.find(opt => opt.value === formData.DoxSpx)
                                                        : null
                                                }
                                                onChange={(selectedOption) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        DoxSpx: selectedOption.value,
                                                    }));
                                                }}
                                                placeholder="Select Package Type"
                                                isSearchable
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                                }}
                                            />
                                        </div>}

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
                                                onClick={() => setModalIsOpen9(true)}
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
                                                <label htmlFor="">FOV Charges</label>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <input
                                                        type="tel"
                                                        style={{
                                                            width: "70%",
                                                            borderRight: "1px solid #ccc",
                                                            borderRadius: "4px 0 0 4px",
                                                        }}
                                                        placeholder="FOV Charges"
                                                        value={formData.FovChrgs}
                                                        onChange={(e) => setFormData({ ...formData, FovChrgs: e.target.value })}
                                                    />
                                                    <input
                                                        type="tel"
                                                        placeholder="%"
                                                        style={{
                                                            width: "30%",
                                                            borderLeft: "none",
                                                            borderRadius: "0 4px 4px 0",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                        }}
                                                        value={formData.FovPer !== "" ? `${formData.FovPer}%` : ""}
                                                        onChange={(e) => {
                                                            // ✅ Strip non-numeric chars before saving
                                                            const val = e.target.value.replace(/[^0-9.]/g, "");
                                                            setFormData({ ...formData, FovPer: val });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {isDocketChecked && (
                                            <div className="input-field1">
                                                <label>Docket Charges</label>
                                                <input
                                                    type="tel"
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
                                                    type="tel"
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
                                                    type="tel"
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
                                                    type="tel"
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
                                                    type="tel"
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
                                                    type="tel"
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
                                                    type="tel"
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
                                                    type="tel"
                                                    placeholder="ODA Charges"
                                                    value={formData.ODAChrgs}
                                                    onChange={(e) => setFormData({ ...formData, ODAChrgs: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {isFuelChecked && (
                                            <div className="input-field1">
                                                <label>Fuel Charges</label>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <input
                                                        type="tel"
                                                        placeholder="Fuel Ch."
                                                        style={{
                                                            width: "70%",
                                                            borderRight: "1px solid #ccc",
                                                            borderRadius: "4px 0 0 4px",
                                                        }}
                                                        value={formData.FuelCharges}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, FuelCharges: e.target.value })
                                                        }
                                                    />
                                                    <input
                                                        type="tel"
                                                        placeholder="%"
                                                        style={{
                                                            width: "30%",
                                                            borderLeft: "none",
                                                            borderRadius: "0 4px 4px 0",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                        }}
                                                        value={formData.FuelPer !== "" ? `${formData.FuelPer}%` : ""}
                                                        onChange={(e) => {
                                                            // ✅ Strip non-numeric chars before saving
                                                            const val = e.target.value.replace(/[^0-9.]/g, "");
                                                            setFormData({ ...formData, FuelPer: val });
                                                        }}
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
                                                <label>Total GST</label>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <input
                                                        type="tel" placeholder="IGST" value={formData.TotalGST || ''} readOnly

                                                        style={{
                                                            width: "70%",
                                                            borderRight: "1px solid #ccc",
                                                            borderRadius: "4px 0 0 4px",
                                                        }}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, TotalGST: e.target.value })
                                                        }
                                                    />
                                                    <input
                                                        type="tel"
                                                        placeholder="%"
                                                        style={{
                                                            width: "30%",
                                                            borderLeft: "none",
                                                            borderRadius: "0 4px 4px 0",
                                                            padding: "5px",
                                                            textAlign: "center",
                                                        }}
                                                        value={formData.totalgstPer !== "" ? `${formData.totalgstPer}%` : ""}
                                                        onChange={(e) => {
                                                            // ✅ Strip non-numeric chars before saving
                                                            const val = e.target.value.replace(/[^0-9.]/g, "");
                                                            setFormData({ ...formData, totalgstPer: val });
                                                        }}
                                                    />
                                                </div>
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

                    <div className="bottom-card row"
                        style={{ width: "100%", display: 'flex', marginTop: "0.5rem", gap: '0.5rem', alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0.5rem" }}>

                        <button className="btn btn-success col-4" style={{ width: "90px" }} onClick={handleSubmit} type="button">Save</button>
                        <button className="btn btn-primary col-4" style={{ width: "90px" }} onClick={handleUpdate} type="button">Update</button>
                        <button className="btn btn-warning col-4" style={{ width: "90px" }} onClick={handleSearch} type="button">Search</button>

                        {/* three dots wrapper */}
                        <div className="btn btn-light col-4"
                            style={{ position: "relative", height: "38px", width: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            onClick={() => setOpen(!open)}>
                            <PiDotsThreeOutlineVerticalFill
                                style={{ fontSize: "30px", cursor: "pointer" }}
                            />

                            {/* dropdown must be inside this div ✅ */}
                            {open && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "41px",   // just below button
                                        width: "98px",
                                        backgroundColor: "transparent",
                                        borderRadius: "5px",
                                        zIndex: 9999,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "2px",
                                        padding: "4px"
                                    }}
                                >
                                    <button
                                        className="btn btn-info"
                                        style={{ width: "100%" }}
                                        onClick={() => { setModalIsOpen7(true); setOpen(false) }}
                                    >
                                        Setup
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        style={{ width: "100%" }}
                                        onClick={() => { setOpen(false); handleDelete(formData.DocketNo) }}
                                        type="button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>



                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-receiver" contentLabel="Modal"
                        style={{
                            content: {
                                width: '90%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap"
                            },
                        }}>
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Shipper Name Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSaveShipper}>
                                    <div className="fields2">
                                        <div className="input-field3">
                                            <label htmlFor="">Code </label>
                                            <input
                                                type="text" value={addShipper.shipperCode}
                                                onChange={(e) => setAddShipper({ ...addShipper, ShipperCode: e.target.value })}
                                                placeholder="Enter Code/ Generate Code"
                                                maxLength="3" />
                                        </div>

                                        <div className="input-field3">
                                            <button type="button" className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                onClick={handleGenerateCode}>Generate Code</button>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Shipper Name</label>
                                            <input type="text" value={addShipper.shipperName}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperName: e.target.value })}
                                                placeholder="Shipper Name" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" value={addShipper.shipperAdd1}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperAdd1: e.target.value })}
                                                placeholder="Address" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" value={addShipper.shipperAdd2}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperAdd2: e.target.value })}
                                                placeholder="Address" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Pin code</label>
                                            <input type="tel" id="pincode" name="pincode" maxLength="6"
                                                value={addShipper.shipperPin}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperPin: e.target.value })}
                                                placeholder="Pin Code" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">City Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getCity.map((city) => ({
                                                    value: city.City_Code,
                                                    label: city.City_Name,
                                                }))}
                                                value={
                                                    addShipper.cityCode
                                                        ? {
                                                            value: addShipper.cityCode,
                                                            label:
                                                                getCity.find((c) => c.City_Code === addShipper.cityCode)
                                                                    ?.City_Name || "",
                                                        }
                                                        : null
                                                }
                                                onChange={(selected) =>
                                                    setAddShipper({
                                                        ...addShipper,
                                                        cityCode: selected ? selected.value : "",
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

                                        <div className="input-field3">
                                            <label htmlFor="">State Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getState.map((st) => ({
                                                    value: st.State_Code,
                                                    label: st.State_Name,
                                                }))}
                                                value={
                                                    addShipper.stateCode
                                                        ? {
                                                            value: addShipper.stateCode,
                                                            label:
                                                                getState.find((s) => s.State_Code === addShipper.stateCode)
                                                                    ?.State_Name || "",
                                                        }
                                                        : null
                                                }
                                                onChange={(selected) =>
                                                    setAddShipper({
                                                        ...addShipper,
                                                        stateCode: selected ? selected.value : "",
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

                                        <div className="input-field3">
                                            <label htmlFor="">Mobile No</label>
                                            <input type="tel" maxLength="10" id="mobile"
                                                value={addShipper.shipperMob}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperMob: e.target.value })}
                                                name="mobile" pattern="[0-9]{10}" placeholder="Mobile No" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Email ID</label>
                                            <input type="email" value={addShipper.shipperEmail}
                                                onChange={(e) => setAddShipper({ ...addShipper, shipperEmail: e.target.value })}
                                                placeholder="Email Id" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">GST No</label>
                                            <input type="text" value={addShipper.gstNo}
                                                onChange={(e) => setAddShipper({ ...addShipper, gstNo: e.target.value })}
                                                placeholder="Gst No" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Company Name</label>
                                            <input type="text" value={addShipper.company}
                                                onChange={(e) => setAddShipper({ ...addShipper, company: e.target.value })}
                                                placeholder="Company Name" />
                                        </div>

                                    </div>

                                    <div className='bottom-buttons'>
                                        <button type='submit' className='ok-btn'>Submit</button>
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen1}
                        className="custom-modal-receiver" contentLabel="Modal"
                        style={{
                            content: {
                                width: '90%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap"
                            },
                        }}>
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Consignee Name Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSaveReceiver}>
                                    <div className="fields2">
                                        <div className="input-field3">
                                            <label htmlFor="">Code </label>
                                            <input
                                                type="text" value={addReceiver.receiverCode}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverCode: e.target.value })}
                                                placeholder="Enter Code/ Generate Code"
                                                maxLength="3" />
                                        </div>


                                        <div className="input-field3">
                                            <button type="button" className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                onClick={handleGenerateCode1}>Generate Code</button>
                                        </div>


                                        <div className="input-field3">
                                            <label htmlFor="">Consignee Name</label>
                                            <input type="text" value={addReceiver.receiverName}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverName: e.target.value })}
                                                placeholder="Consignee Name" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" value={addReceiver.receiverAdd1}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverAdd1: e.target.value })}
                                                placeholder="Address" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" value={addReceiver.receiverAdd2}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverAdd2: e.target.value })}
                                                placeholder="Address" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Pin code</label>
                                            <input type="tel" id="pincode" name="pincode" maxLength="6"
                                                value={addReceiver.receiverPin}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverPin: e.target.value })}
                                                placeholder="Pin Code" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">City Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getCity.map((city) => ({
                                                    value: city.City_Code,
                                                    label: city.City_Name,
                                                }))}
                                                value={
                                                    addReceiver.cityCode
                                                        ? {
                                                            value: addReceiver.cityCode,
                                                            label:
                                                                getCity.find((c) => c.City_Code === addReceiver.cityCode)
                                                                    ?.City_Name || "",
                                                        }
                                                        : null
                                                }
                                                onChange={(selected) =>
                                                    setAddReceiver({
                                                        ...addReceiver,
                                                        cityCode: selected ? selected.value : "",
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

                                        <div className="input-field3">
                                            <label htmlFor="">State Name</label>
                                            <Select
                                                className="blue-selectbooking"
                                                classNamePrefix="blue-selectbooking"
                                                options={getState.map((st) => ({
                                                    value: st.State_Code,
                                                    label: st.State_Name,
                                                }))}
                                                value={
                                                    addReceiver.stateCode
                                                        ? {
                                                            value: addReceiver.stateCode,
                                                            label:
                                                                getState.find((s) => s.State_Code === addReceiver.stateCode)
                                                                    ?.State_Name || "",
                                                        }
                                                        : null
                                                }
                                                onChange={(selected) =>
                                                    setAddReceiver({
                                                        ...addReceiver,
                                                        stateCode: selected ? selected.value : "",
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

                                        <div className="input-field3">
                                            <label htmlFor="">Mobile No</label>
                                            <input type="tel" maxLength="10" id="mobile"
                                                value={addReceiver.receiverMob}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverMob: e.target.value })}
                                                name="mobile" pattern="[0-9]{10}" placeholder="Mobile No" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Email ID</label>
                                            <input type="email" value={addReceiver.receiverEmail}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, receiverEmail: e.target.value })}
                                                placeholder="Email Id" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">GST No</label>
                                            <input type="text" value={addReceiver.gstNo}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, gstNo: e.target.value })}
                                                placeholder="Gst No" />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">HSN No</label>
                                            <input type="text" value={addReceiver.hsnNo}
                                                onChange={(e) => setAddReceiver({ ...addReceiver, hsnNo: e.target.value })}
                                                placeholder="HSN No" />
                                        </div>

                                        <div className="input-field2">
                                            <div className="select-radio">
                                                <input type="checkbox" name="mode" id="SMS"
                                                    checked={addReceiver.sms}
                                                    onChange={(e) => setAddReceiver({ ...addReceiver, sms: e.target.checked })} />
                                                <img src={sms} />

                                                <input type="checkbox" name="mode" id="E-mail"
                                                    checked={addReceiver.emailId}
                                                    onChange={(e) => setAddReceiver({ ...addReceiver, emailId: e.target.checked })} />
                                                <img src={mail} />

                                                <input type="checkbox" name="mode" id="WHATSAPP"
                                                    checked={addReceiver.whatsApp}
                                                    onChange={(e) => setAddReceiver({ ...addReceiver, whatsApp: e.target.checked })} />
                                                <img src={whatsapp} />
                                            </div>
                                        </div>

                                    </div>

                                    <div className='bottom-buttons'>
                                        <button type='submit' className='ok-btn'>Submit</button>
                                        <button onClick={() => setModalIsOpen1(false)} className='ok-btn'>close</button>
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
                                            <input type="text" placeholder="CGST Charges" value={gstData.CGSTAMT || 0} readOnly />
                                        </div>
                                        <div className="input-field1" style={{ width: "30%" }}>
                                            <label htmlFor="">CGST %</label>
                                            <input type="text" placeholder="%" value={gstData.CGSTPer || 0} readOnly />
                                        </div>
                                    </div>

                                    <div className="fields2">
                                        <div className="input-field1" style={{ width: "60%" }}>
                                            <label htmlFor="">SGST Amount</label>
                                            <input type="text" placeholder="SGST Charges" value={gstData.SGSTAMT || 0} readOnly />
                                        </div>
                                        <div className="input-field1" style={{ width: "30%" }}>
                                            <label htmlFor="">SGST %</label>
                                            <input type="text" placeholder="%" value={gstData.SGSTPer || 0} readOnly />
                                        </div>
                                    </div>

                                    <div className="fields2">
                                        <div className="input-field1" style={{ width: "60%" }}>
                                            <label htmlFor="">IGST Amount</label>
                                            <input type="text" placeholder="IGST Charges" value={gstData.IGSTAMT || 0} readOnly />
                                        </div>
                                        <div className="input-field1" style={{ width: "30%" }}>
                                            <label htmlFor="">IGST %</label>
                                            <input type="text" placeholder="%" value={gstData.IGSTPer || 0} readOnly />
                                        </div>
                                    </div>

                                    <div className="fields2">
                                        <div className="input-field1" style={{ width: "60%" }}>
                                            <label htmlFor="">Total GST</label>
                                            <input type="text" placeholder="Total GST" value={gstData.TotalGST || 0} readOnly />
                                        </div>
                                        <div className="input-field1" style={{ width: "30%" }}>
                                            <label htmlFor="">Total %</label>
                                            <input type="text" placeholder="%" value={gstData.GSTPer || 0} readOnly />
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
                                <header>Content/Remark</header>
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
                                            <label htmlFor="">Content</label>
                                            <input type="text" placeholder="Content" value={remarkData.MHWNo}
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
                                width: '90%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                height:"auto",
                                whiteSpace: "nowrap"
                            },
                        }}
                        className="custom-modal-mode" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header> Vendor Volumetric</header>
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
                                                    <td>{data.DivideBy}</td>
                                                    <td>{data.Qty}</td>
                                                    <td>{data.VolmetricWt}</td>
                                                    <td>{data.ActualWt}</td>
                                                    <td>{data.ChargeWt}</td>
                                                    <td>
                                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                            <button className='edit-btn'
                                                                onClick={() => {
                                                                    setVendorvolumetric({
                                                                        Length: data.Length,
                                                                        Width: data.Width,
                                                                        Height: data.Height,
                                                                        Qty: data.Qty,
                                                                        DivideBy: data.DivideBy,
                                                                        VolmetricWt: data.VolmetricWt,
                                                                        ActualWt: data.ActualWt,
                                                                        ChargeWt: data.ChargeWt,
                                                                    })
                                                                    setEditIndex(index);
                                                                }}>
                                                                <i className='bi bi-pen'></i>
                                                            </button>
                                                            <button onClick={() => {
                                                                setVendorSubmittedData(vendorsubmittedData.filter((_, ind) => ind !== index));
                                                                setEditIndex(null);
                                                                setVendorvolumetric({
                                                                    Length: 0,
                                                                    Width: 0,
                                                                    Height: 0,
                                                                    Qty: 0,
                                                                    DivideBy: "",
                                                                    VolmetricWt: 0,
                                                                    ActualWt: 0,
                                                                    ChargeWt: 0
                                                                });
                                                            }}
                                                                className='edit-btn'><i className='bi bi-trash'></i></button>
                                                        </div>
                                                    </td>
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
                                width: '90%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                height:"auto",
                                whiteSpace: "nowrap"
                            },
                        }}
                        className="custom-modal-mode" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Volumetric Calculate</header>
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
                                                    <td>{data.DivideBy}</td>
                                                    <td>{data.Qty}</td>
                                                    <td>{data.VolmetricWt}</td>
                                                    <td>{data.ActualWt}</td>
                                                    <td>{data.ChargeWt}</td>
                                                    <td>
                                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                            <button className='edit-btn'
                                                                onClick={() => {
                                                                    setVolumetricData({
                                                                        Length: data.Length,
                                                                        Width: data.Width,
                                                                        Height: data.Height,
                                                                        Qty: data.Qty,
                                                                        DivideBy: data.DivideBy,
                                                                        VolmetricWt: data.VolmetricWt,
                                                                        ActualWt: data.ActualWt,
                                                                        ChargeWt: data.ChargeWt,
                                                                    })
                                                                    setEditIndex(index);
                                                                }}>
                                                                <i className='bi bi-pen'></i>
                                                            </button>
                                                            <button onClick={() => {
                                                                setSubmittedData(submittedData.filter((_, ind) => ind !== index));
                                                                setEditIndex(null);
                                                                setVolumetricData({
                                                                    Length: 0,
                                                                    Width: 0,
                                                                    Height: 0,
                                                                    Qty: 0,
                                                                    DivideBy: "",
                                                                    VolmetricWt: 0,
                                                                    ActualWt: 0,
                                                                    ChargeWt: 0
                                                                });
                                                            }}
                                                                className='edit-btn'><i className='bi bi-trash'></i></button>
                                                        </div>
                                                    </td>
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
                                width: '90%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                height:"auto",
                                whiteSpace: "nowrap"
                            },
                        }}
                        className="custom-modal-mode" contentLabel="Modal">
                        <div className="custom-modal-content">
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
                                                    <DatePicker
                                                        selected={invoiceData.PoDate ? new Date(invoiceData.PoDate) : null}
                                                        onChange={(date) =>
                                                            setInvoiceData({ ...invoiceData, PoDate: date })
                                                        }
                                                        dateFormat="dd/MM/yyyy"
                                                        placeholderText="dd/mm/yyyy"
                                                    />
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

                                            {InvoicesubmittedData?.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{data.PoNo}</td>
                                                    <td>{data.PoDate ? (data.PoDate).toLocaleDateString("en-GB") : ""}</td>
                                                    <td>{data.InvoiceNo}</td>
                                                    <td>{data.InvoiceValue}</td>
                                                    <td>{data.Description}</td>
                                                    <td>{data.Qty}</td>
                                                    <td>{data.EWayBillNo}</td>
                                                    <td>{data.Remark}</td>
                                                    <td>{data.InvoiceImg}</td>
                                                    <td>
                                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                            <button className='edit-btn'
                                                                onClick={() => {
                                                                    setInvoiceData({
                                                                        PoNo: data.PoNo,
                                                                        PoDate: data.PoDate,
                                                                        InvoiceNo: data.InvoiceNo,
                                                                        InvoiceValue: data.InvoiceValue,
                                                                        Description: data.Description,
                                                                        Qty: data.Qty,
                                                                        EWayBillNo: data.EWayBillNo,
                                                                        Remark: data.Remark,
                                                                        InvoiceImg: data.InvoiceImg,
                                                                    });
                                                                    setEditIndex(index);
                                                                }}>
                                                                <i className='bi bi-pen'></i>
                                                            </button>
                                                            <button onClick={() => {
                                                                setInvoiceSubmittedData(InvoicesubmittedData.filter((_, ind) => ind !== index));
                                                                setEditIndex(null);
                                                                setInvoiceData({
                                                                    PoNo: "",
                                                                    PoDate: getTodayDate(),
                                                                    InvoiceNo: "",
                                                                    InvoiceValue: 0,
                                                                    Description: "",
                                                                    Qty: 0,
                                                                    EWayBillNo: "",
                                                                    Remark: "",
                                                                    InvoiceImg: ""
                                                                });
                                                                // Remove from formData
                                                                setFormData((prev) => {
                                                                    const removeFromCSV = (csv, valueToRemove) => {
                                                                        if (!csv) return "";
                                                                        return csv
                                                                            .split(",")
                                                                            .map(item => item.trim())
                                                                            .filter(item => item.toLowerCase() !== String(valueToRemove).toLowerCase())
                                                                            .join(",");
                                                                    };

                                                                    return {
                                                                        ...prev,
                                                                        InvoiceNo: removeFromCSV(prev.InvoiceNo, data.InvoiceNo),
                                                                        InvValue: Number(prev.InvValue || 0) - Number(data.InvoiceValue || 0),
                                                                        EwayBill: removeFromCSV(prev.EwayBill, data.EWayBillNo),
                                                                    };
                                                                });

                                                            }}
                                                                className='edit-btn'><i className='bi bi-trash'></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                            )}
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
                                width: '80%',
                                top: '50%',             // Center vertically
                                left: '50%',
                                whiteSpace: "nowrap",
                                minHeight: "60%",
                                display: "flex",
                                justifyContent: "center",

                            },
                        }}>
                        <div className="custom modal-content">
                            <div className="header-tittle">
                                <header>Charges</header>
                            </div>

                            <div className='container2'>
                                <form>
                                    <div className="fields2">
                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isAllChecked}
                                                onChange={handleAllChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="all" id="all" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                All Select</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isShipChecked}
                                                onChange={handleShipCheck}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="ship" id="ship" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Shipper Details</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isReceChecked}
                                                onChange={handleReceCheck}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="rec" id="rec" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Consingee Details</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isProChecked}
                                                onChange={handleProChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="product" id="product" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Package Type</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isFlightChecked}
                                                onChange={handleFlightChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="flight" id="flight" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Flight Name</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isTrainChecked}
                                                onChange={handleTrainChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="train" id="train" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Train Name</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isVenChecked}
                                                onChange={handleVenCheck}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="ven" id="ven" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Vendor Details</label>
                                        </div>


                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isFovChecked}
                                                onChange={handleFovChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fov" id="fov" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Fov Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isDocketChecked}
                                                onChange={handleDocketChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="docket" id="docket" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Docket Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isDeliveryChecked}
                                                onChange={handleDeliveryChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="delivery" id="delivery" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Delivery Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isPackingChecked}
                                                onChange={handlePackingChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="packing" id="packing" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Packing Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isGreenChecked}
                                                onChange={handleGreenChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="green" id="green" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Green Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isHamaliChecked}
                                                onChange={handleHamaliChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="hamali" id="hamali" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Hamali Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isOtherChecked}
                                                onChange={handleOtherChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="other" id="other" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Other Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isInsuranceChecked}
                                                onChange={handleInsuranceChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="insurance" id="insurance" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Insurance Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isODAChecked}
                                                onChange={handleODAChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="oda" id="oda" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                ODA Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isFuelChecked}
                                                onChange={handleFuelChange}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="fuel" id="fuel" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Fuel Charges</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isRemarkChecked}
                                                onChange={handleRemark}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="remark" id="remark" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Remark / SR No</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isEWayChecked}
                                                onChange={handleEWayBill}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="ewaybill" id="ewaybill" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                E-Way Bill No</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isInvoiceValue}
                                                onChange={handleInvoiceValue}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="invoicevalue" id="invoicevalue" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Invoice Value</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={isInvoiceNo}
                                                onChange={handleInvoiceNo}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="invoiceno" id="invoiceno" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Invoice No</label>
                                        </div>

                                        <div className="input-field1" style={{ display: "flex", flexDirection: "row" }}>
                                            <input type="checkbox"
                                                checked={dispatchDate}
                                                onChange={handledispatch}
                                                style={{ width: "12px", height: "12px", marginTop: "5px" }} name="dispatchDate" id="dispatchDate" />
                                            <label htmlFor="" style={{ marginLeft: "10px", fontSize: "12px" }}>
                                                Dispatch Date</label>
                                        </div>
                                    </div>
                                    <div className='bottom-buttons'>
                                        <button onClick={(e) => { e.preventDefault(); setModalIsOpen7(false) }} className='ok-btn'>close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal >

                    <Modal overlayClassName="custom-overlay" isOpen={modalIsOpen8}
                        className="custom-modal-volumetric" contentLabel="Vendor Charges Modal"
                        style={{
                            content: {
                                height: "auto"
                            }
                        }}>

                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Vendor Charges Summary</header>
                            </div>

                            <div className='container2'>
                                <form>

                                    {/* Rate */}
                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label>Rate</label>
                                            <input type="text" value={vendorShow.Rate || 0} readOnly />
                                        </div>
                                        <div className="input-field1">
                                            <label>Fuel Charges ({vendorShow.Fuel_Per}%)</label>
                                            <input type="text" value={vendorShow.Fuel_Charges || 0} readOnly />
                                        </div>
                                        <div className="input-field1">
                                            <label>FOV Charges ({vendorShow.Fov_Per}%)</label>
                                            <input type="text" value={vendorShow.Fov_Charges || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>Docket Charges</label>
                                            <input type="text" value={vendorShow.Docket_Charges || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>ODA Charges</label>
                                            <input type="text" value={vendorShow.ODA_Charges || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>Delivery Charges</label>
                                            <input type="text" value={vendorShow.Delivery_Charges || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>Packing Charges</label>
                                            <input type="text" value={vendorShow.Packing_Charges || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>Green Charges</label>
                                            <input type="text" value={vendorShow.Green_Charges || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>Hamali Charges</label>
                                            <input type="text" value={vendorShow.Hamali_Charges || 0} readOnly />
                                        </div>
                                        <div className="input-field1">
                                            <label>Insurance Charges</label>
                                            <input type="text" value={vendorShow.Insurance_Charges || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>Other Charges</label>
                                            <input type="text" value={vendorShow.Other_Charges || 0} readOnly />
                                        </div>
                                        <div className="input-field1">
                                            <label>Subtotal</label>
                                            <input type="text" value={vendorShow.Subtotal || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>CGST Amount ({vendorShow.CGSTPer || 0}%)</label>
                                            <input type="text" value={vendorShow.CGSTAmt || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>SGST Amount ({vendorShow.SGSTPer || 0}%)</label>
                                            <input type="text" value={vendorShow.SGSTAmt || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>IGST Amount ({vendorShow.IGSTPer || 0}%)</label>
                                            <input type="text" value={vendorShow.IGSTAmt || 0} readOnly />
                                        </div>
                                        <div className="input-field1">
                                            <label>Total GST ({vendorShow.SGSTPer + vendorShow.SGSTPer || vendorShow.IGSTPer || 0}%)</label>
                                            <input type="text" value={vendorShow.TotalGST || 0} readOnly />
                                        </div>

                                        <div className="input-field1">
                                            <label>Grand Total Amount</label>
                                            <input type="text" value={vendorShow.TotalAmount || 0} readOnly />
                                        </div>
                                    </div>

                                    <div className="bottom-buttons">
                                        <button
                                            className="ok-btn"
                                            type="button"
                                            onClick={() => setModalIsOpen8(false)}
                                        >OK</button>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </Modal>

                </div >

            </div >
        </>
    );
};

export default Booking;