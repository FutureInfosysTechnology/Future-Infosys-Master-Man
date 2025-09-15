import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getApi, postApi, putApi, deleteApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";

function ShortEntry() {
  const [getCustomer, setGetCustomer] = useState([]);
  const [getMode, setGetMode] = useState([]);
  const [getDest, setGetDestination] = useState([]);
  const today=new Date();
  const [bookingDate, setBookingDate] = useState(today);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const handleDateChange = (date) => {
    setBookingDate(date);
  };
  const [formData, setFormData] = useState({
    Customer_Code: '',
    Customer_Name: '',
    Origin_code: '',
    Destination_Code: '',
    Docket_No: '',
    Consignee_Pin: '',
    Cityname: '',
    Consignee_Name: '',
    Pcs: '',
    DoxSpx: '',
    ActualWt: '',
    Chargablewt: '',
    Amount: '',
    Mode_code: '',
    Mode_Name: '',
    ShipperName: '',
    ShipperPhone: '',
    Consignee_Mob: '',
    volumetricWt: ''
  });

  const allModeOptions = getMode.map(mode => ({ label: mode.Mode_Name, value: mode.Mode_Code }));
  const allDesOptions = getDest.map(dest => ({ label: dest.City_Name, value: dest.City_Code }));
  const allCustomerOptions = getCustomer.map(cust => ({ label: cust.Customer_Name, value: cust.Customer_Code.toString() }));

  useEffect(() => {
    setBookingDate(new Date());
    getApi('/Master/getCustomerdata').then(response => {
      if (response?.status === 1) setGetCustomer(response.Data);
    });
    getApi('/Master/getMode').then(response => {
      if (response?.status === 1) setGetMode(response.Data);
    });
    getApi('/Master/getdomestic').then(response => {
      if (response?.status === 1) setGetDestination(response.Data);
    });
  }, []);

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
     Customer_Code: '',
    Customer_Name: '',
    Origin_code: '',
    Destination_Code: '',
    Docket_No: '',
    Consignee_Pin: '',
    Cityname: '',
    Consignee_Name: '',
    Pcs: '',
    DoxSpx: '',
    ActualWt: '',
    Chargablewt: '',
    Amount: '',
    Mode_code: '',
    Mode_Name: '',
    ShipperName: '',
    ShipperPhone: '',
    Consignee_Mob: '',
    volumetricWt: ''
      
    }));
    setSelectedDestination(null);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.ShipperPhone.length !== 10 || formData.Consignee_Mob.length !== 10) {
      Swal.fire('Error', 'Mobile numbers must be exactly 10 digits.', 'error');
      return;
    }
    const payload = {
      docketNo: formData.Docket_No,
      bookDate: bookingDate ? bookingDate.toISOString().split('T')[0] : null,
      customerCode: formData.Customer_Code,
      shipperName: formData.ShipperName,
      shipperPhone: formData.ShipperPhone,
      consigneeName: formData.Consignee_Name,
      consigneePin: formData.Consignee_Pin,
      consigneeMob: formData.Consignee_Mob,
      modeCode: formData.Mode_code,
      originCode: formData.Origin_code,
      destinationCode: formData.Destination_Code,
      DoxSpx: formData.DoxSpx,
      qty: formData.Pcs?.toString() || '0',
      actualWt: formData.ActualWt || "0",
      volumetricWt: formData.volumetricWt || '0',
      chargedWt: formData.Chargablewt,
      rate: formData.Amount,
      branchCode:JSON.parse(localStorage.getItem("Login")).Branch_Code,
      
    };
    try {
      const res = await postApi("/Booking/ShortBooking", payload);
      if (res.status === 1) {
        Swal.fire('Success', 'Booking saved successfully!', 'success').then(resetForm);
      } else Swal.fire('Error', res.message, 'error');
    } catch (err) {
      Swal.fire('Error', 'Failed to save booking.', 'error');
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.ShipperPhone.length !== 10 || formData.Consignee_Mob.length !== 10) {
      Swal.fire('Error', 'Mobile numbers must be exactly 10 digits.', 'error');
      return;
    }
    const payload = {
      BookDate: bookingDate ? bookingDate.toISOString().split('T')[0] : null,
      Customer_Code: formData.Customer_Code,
      Shipper_Name: formData.ShipperName,
      ShipperPhone: formData.ShipperPhone,
      Consignee_Name: formData.Consignee_Name,
      Consignee_Pin: formData.Consignee_Pin,
      Consignee_Mob: formData.Consignee_Mob,
      Mode_code: formData.Mode_code,
      Origin_code: formData.Origin_code,
      Destination_Code: formData.Destination_Code,
      DoxSpx: formData.DoxSpx,
      Qty: String(formData.Pcs),
      ActualWt: String(formData.ActualWt),
      VolumetricWt: String(formData.volumetricWt || '0'),
      ChargedWt: String(formData.Chargablewt),
      Rate: String(formData.Amount),
      Branch_Code:JSON.parse(localStorage.getItem("Login")).Branch_Code,
    };
    try {
      const res = await putApi(`/Booking/UpdateShortBooking?docketNo=${formData.Docket_No}`, payload);
      if (res.status === 1) {
        Swal.fire('Updated!', res.message || 'Booking updated.', 'success');
        resetForm();
      } else Swal.fire('Error', res.message || 'Update failed.', 'error');
    } catch (err) {
      Swal.fire('Error', 'Something went wrong while updating.', 'error');
      console.log(err);
    }
  };


  const handleSearch = async () => {
    if (!formData.Docket_No) return Swal.fire("Warning", "Enter Docket No", "warning");
    try {
      const res = await getApi(`/Booking/getShortBookingByDocketNo?DocketNo=${formData.Docket_No}`);
      if (res.status === 1 && res.data) {
        const data = res.data;
        const customer = getCustomer.find(c => c.Customer_Code.toString() === data.Customer_Code);
        const mode = getMode.find(m => m.Mode_Code === data.Mode_code);
        const origin = getDest.find(c => c.City_Code === data.Origin_code);
        const destination = getDest.find(c => c.City_Code === data.Destination_Code);

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
          DoxSpx: data.DoxSpx,
          Pcs: data.Qty,
          ActualWt: data.ActualWt,
          volumetricWt: data.VolumetricWt,
          Chargablewt: data.ChargedWt,
          Amount: data.Rate,
          Cityname: ''
        });

        setBookingDate(data.BookDate);
        setSelectedMode(mode ? { label: mode.Mode_Name, value: mode.Mode_Code } : null);
        setSelectedOrigin(origin ? { label: origin.City_Name, value: origin.City_Code } : null);
        setSelectedDestination(destination ? { label: destination.City_Name, value: destination.City_Code } : null);
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
          resetForm();
        } else {
          Swal.fire('Error', res.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete booking.', 'error');
      }
    }
  };




  return (
    <div className="container py-1">
      <div className="card shadow-sm p-4">
        <form onSubmit={handleSave}>
          <div className="row g-2">
            <div className="col-md-6 col-lg-4">
              <label className="form-label">Customer</label>

              <Select
                className="blue-selectbooking"
                classNamePrefix="blue-selectbooking"
                options={allCustomerOptions}
                value={formData.Customer_Code ? allCustomerOptions.find(opt => opt.value === formData.Customer_Code) : null}
                onChange={(selectedOption) => {
                  setFormData(prev => ({
                    ...prev,
                    Customer_Code: selectedOption.value,
                    Customer_Name: selectedOption.label
                  }));
                }}
                placeholder="Select Customer"
                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                }}
              />
            </div>

            <div className="col-md-6 col-lg-4">
              <label className="form-label">Booking Date</label>
              <DatePicker
                selected={bookingDate}
                onChange={(date) => handleDateChange(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control form-control-sm"
                wrapperClassName="w-100"
              />
            </div>

            <div className="col-md-6 col-lg-4">
              <label className="form-label">Mode</label>
              <Select
                className="blue-selectbooking"
                classNamePrefix="blue-selectbooking"
                options={allModeOptions}
                value={selectedMode}
                onChange={(selected) => {
                  setSelectedMode(selected);
                  setFormData(prev => ({
                    ...prev,
                    Mode_code: selected?.value || ''
                  }));
                }}
                placeholder="Select Mode"
                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                }}
              />
            </div>

            <div className="col-md-6 col-lg-4">
              <label className="form-label">Docket No</label>
              <input
                type="text"
                placeholder="Docket No"
                className="form-control"
                value={formData.Docket_No}
                onChange={(e) =>
                  setFormData({ ...formData, Docket_No: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    // Don't prevent tab, just trigger handleSearch after a short delay
                    setTimeout(() => {
                      handleSearch();
                    }, 100); // Adjust delay if needed
                  }
                }}
              />
            </div>


            <div className="col-md-4">
              <label className="form-label">Shipper Name</label>
              <input type="text" placeholder='Shipper Name' className="form-control" value={formData.ShipperName} onChange={(e) => setFormData({ ...formData, ShipperName: e.target.value })} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Shipper Phone</label>
              <input
                type="text"
                maxLength="10"
                pattern="\d{10}"
                placeholder='Shipper Phone'
                className="form-control"
                value={formData.ShipperPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) {
                    setFormData({ ...formData, ShipperPhone: val });
                  }
                }}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Consignee Name</label>
              <input type="text" placeholder='Consignee Name' className="form-control" value={formData.Consignee_Name} onChange={(e) => setFormData({ ...formData, Consignee_Name: e.target.value })} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Consignee Mobile</label>
              <input
                type="text"
                maxLength="10"
                pattern="\d{10}"
                placeholder='Consignee Mobile'
                className="form-control"
                value={formData.Consignee_Mob}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) {
                    setFormData({ ...formData, Consignee_Mob: val });
                  }
                }}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Origin</label>
              <Select
                className="blue-selectbooking"
                classNamePrefix="blue-selectbooking"
                options={allDesOptions}
                value={selectedOrigin}
                onChange={(selected) => {
                  setSelectedOrigin(selected);
                  setFormData({ ...formData, Origin_code: selected?.value || '' });
                }}
                placeholder="Select Origin"
                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                }}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                placeholder="Pin Code"
                className="form-control"
                maxLength={6}
                pattern="\d{6}"
                value={formData.Consignee_Pin}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d{0,6}$/.test(input)) {
                    setFormData({ ...formData, Consignee_Pin: input });
                  }
                }}
              />
            </div>



            <div className="col-md-4">
              <label className="form-label">Destination</label>
              <Select
                className="blue-selectbooking"
                classNamePrefix="blue-selectbooking"
                options={allDesOptions}
                value={selectedDestination}
                onChange={(selected) => {
                  setSelectedDestination(selected);
                  setFormData({ ...formData, Destination_Code: selected?.value || '' });
                }}
                placeholder="Select Destination"
                menuPortalTarget={document.body} // ✅ Moves dropdown out of scroll container
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }) // ✅ Keeps dropdown on top
                }}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Pcs</label>
              <input
                type="number"
                placeholder="Pcs"
                className="form-control"
                value={formData.Pcs}
                onChange={(e) => setFormData({ ...formData, Pcs: e.target.value })}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Product Type</label>
              <select
              style={{ height: '35px', fontSize:"15px"}}
                className="form-control"
                value={formData.DoxSpx} // separate field for type
                onChange={(e) => setFormData({ ...formData, DoxSpx: e.target.value })}
              >
                <option value="">Product</option>
                <option value="Dox">Dox</option>
                <option value="Spx">Spx</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Actual Weight</label>
              <input type="number" min="0" className="form-control" value={formData.ActualWt} onChange={(e) => setFormData({ ...formData, ActualWt: e.target.value })} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Volumetric Weight</label>
              <input type="number" min="0" className="form-control" value={formData.volumetricWt} onChange={(e) => setFormData({ ...formData, volumetricWt: e.target.value })} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Chargable Weight</label>
              <input type="number" min="0" className="form-control" value={formData.Chargablewt} onChange={(e) => setFormData({ ...formData, Chargablewt: e.target.value })} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Amount</label>
              <input type="number" min="0" className="form-control" value={formData.Amount} onChange={(e) => setFormData({ ...formData, Amount: e.target.value })} />
            </div>

            <div className="col-md-2 custom-save-button">

              <button type="submit" className="btn btn-success w-100" onClick={handleSave}>Save</button>
            </div>
            <div className="col-md-2 custom-save-button">


              <button type="button" className="btn btn-primary w-100" onClick={handleUpdate}>Update</button>


            </div>
            <div className="col-md-2 custom-save-button">

              <button type="button" className="btn btn-warning w-100" onClick={handleSearch}>Search</button>

            </div>
            <div className="col-md-2 custom-save-button">

              <button type="button" className="btn btn-danger w-100" onClick={() => handleDelete(formData.Docket_No)}>Delete</button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ShortEntry;
