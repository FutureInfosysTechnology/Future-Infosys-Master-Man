import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import "./permonce.css"
import Swal from "sweetalert2";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import { getApi } from "../Admin Master/Area Control/Zonemaster/ServicesApi";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
function PerformanceBill() {
    const getTodayDate = () => {
        const today = new Date();
        return today;
    };
    const [formData, setFormData] = useState({
        invoiceNo: "",
        invDate: getTodayDate(),
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
                                                        label:
                                                            allShipperOption.find(opt => opt.value === formData.Shipper_Name)
                                                                ?.label || formData.Shipper_Name,
                                                    }
                                                    : null
                                            }
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    Shipper_Name: selectedOption.value,
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
                                                        label:
                                                            allReceiverOption.find(
                                                                (opt) => opt.value === formData.ConsigneeName
                                                            )?.label || formData.ConsigneeName, // fallback to typed text
                                                    }
                                                    : null
                                            }
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ConsigneeName: selectedOption.value,
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

                    <div className="card mt-1">
                        <div className="section-title">Courier Details</div>
                        <form style={{ margin: "0px", padding: "0px" }}>
                            <div className="row g-3 mx-0">
                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">Invoice No</label>
                                    <input type="tel" className="form-control" placeholder="Invoice No"
                                        value={formData.invoiceNo}
                                        onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })} />
                                </div>

                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">Invoice Date</label>
                                    <DatePicker
                                        portalId='rootPortal'
                                        selected={formData.invDate}
                                        onChange={(date) => setFormData({...formData,invDate:date})}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control form-control-sm"
                                    />
                                </div>

                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">Docket No</label>
                                    <input type="text" className="form-control" placeholder="Docket No"
                                        value={formData.DocketNo}
                                        onChange={(e) => setFormData({ ...formData, DocketNo: e.target.value })} />
                                </div>

                                <div className="input-field col-md-4 col-sm-6">
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

                                <div className="input-field col-md-4 col-sm-6">
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

                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">No of Boxes</label>
                                    <input type="tel" className="form-control" placeholder="No of Boxes"
                                        value={formData.boxes}
                                        onChange={(e) => setFormData({ ...formData, boxes: e.target.value })} />
                                </div>

                                <div className="input-field col-md-4 col-sm-6">
                                    <label className="form-label">Total Weight</label>
                                    <input type="tel" className="form-control" placeholder="Total Weight"
                                        value={formData.totalWt}
                                        onChange={(e) => setFormData({ ...formData, totalWt: e.target.value })} />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className='table-container' style={{ margin: "0px" }}>
                        <table className='table table-bordered table-sm'>
                            <thead className='table-info table-sm'>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Desciption Of Goods</th>
                                    <th scope="col">HSN Code</th>
                                    <th scope="col">QTY</th>
                                    <th scope="col">Rate</th>
                                    <th scope="col">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
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

                    <div className="bottom-buttons">
                        <button className='ok-btn'>Save</button>
                        <button className='ok-btn'>Cancel</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PerformanceBill;