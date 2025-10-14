import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Select from 'react-select';
import jsPDF from 'jspdf';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


function InternationalCity() {
    const [openRow, setOpenRow] = useState(null);
    const [international, setInternational] = useState([]);   // to get international city data
    const [state, setState] = useState([]);                   //to get state data
    const [country, setCountry] = useState([]);               //to get country data
    const [getZone, setGetZone] = useState([]);               // To Get Zone Data
    const [getCity, setGetCity] = useState([]);
    const [readOnly, setReadOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addData, setAddData] = useState({
        cityCode: '',
        cityName: '',
        countryCode: '',
        stateCode: '',
        destination: '',
        delivery: '',
        pod: '',
        product: '',
        zoneCode: ''
    })



    const filteredCity = international.filter((city) =>
        (city && city.City_Code && city.City_Code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (city && city.City_Name && city.City_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (city && city.Zone_Name && city.Zone_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (city && city.State_Name && city.State_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (city && city.Country_Name && city.Country_Name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredCity.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredCity.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };


    const fetchInternationalData = async () => {
        try {
            const response = await getApi('/Master/Getinternational');
            setInternational(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInternationalData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi('/Master/GetState');
                setState(Array.isArray(response.Data) ? response.Data : []);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi('/Master/getCountry');
                setCountry(Array.isArray(response.Data) ? response.Data : []);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi('/Master/getZone');
                setGetZone(Array.isArray(response.Data) ? response.Data : []);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApi('/Master/getdomestic');
                setGetCity(Array.isArray(response.Data) ? response.Data : []);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleGenerateCode = () => {
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setAddData({ ...addData, cityCode: newCode });
    };


    const handleSaveCity = async (e) => {
        e.preventDefault();

        const requestBody = {
            cityCode: addData.cityCode,
            cityName: addData.cityName,
            countryCode: addData.countryCode,
            stateCode: addData.stateCode,
            manifestDestination: addData.destination,
            destinationDHours: addData.delivery,
            destinationPHours: addData.pod,
            productType: addData.product,
            ZoneCode: addData.zoneCode
        }
        try {
            const response = await postApi('/Master/addCity', requestBody, 'POST');
            if (response.status === 1) {
                setInternational([...international, response.Data]);
                setAddData({
                    cityCode: '',
                    cityName: '',
                    countryCode: '',
                    stateCode: '',
                    destination: '',
                    delivery: '',
                    pod: '',
                    product: '',
                    zoneCode: ''
                });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchInternationalData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add International City data', 'error');
        }
    };

    const handleDeleteCity = async (City_Code) => {
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
                await deleteApi(`/Master/DeleteCityInt?CityCode=${City_Code}`);
                setInternational(international.filter((city) => city.CityCode !== City_Code));
                Swal.fire('Deleted!', 'International City has been deleted.', 'success');
                await fetchInternationalData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete International City', 'error');
        }
    };


    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(international);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'international');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'International.xlsx');
    };

    const handleExportinternationalPDF = () => {
        const pdfData = international.map(({ id, code, name }) =>
            [id, code, name]);
        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text('International City Data', 14, 20);
        const headers = [['Sr.No', 'Code', 'State Name']];
        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 30,
            theme: 'grid'
        });
        pdf.save('International.pdf');
    };


    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;



    return (
        <div className="body">
            <div className="container1">
                <div className="addNew">
                    <div>
                        <button className='add-btn' onClick={() => {
                            setReadOnly(false);
                            setModalIsOpen(true);
                            setAddData({
                                cityCode: '',
                                cityName: '',
                                countryCode: '',
                                stateCode: '',
                                destination: '',
                                delivery: '',
                                pod: '',
                                product: '',
                                zoneCode: ''
                            });
                        }}>
                            <i className="bi bi-plus-lg"></i>
                            <span>ADD NEW</span>
                        </button>

                        <div className="dropdown">
                            <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                            <div className="dropdown-content">
                                <button onClick={handleExportExcel}>Export to Excel</button>
                                <button onClick={handleExportinternationalPDF}>Export to PDF</button>
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
                                <th scope="col" >Actions</th>
                                <th scope="col" >Sr.No</th>
                                <th scope="col" >City Code</th>
                                <th scope="col" >City Name</th>
                                <th scope="col" >Zone Name</th>
                                <th scope="col" >State Name</th>
                                <th scope="col" >Country Name</th>

                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            {currentRows.map((city, index) => (
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
                                                    left: "80px",
                                                    top: "0px",
                                                    borderRadius: "10px",
                                                    backgroundColor: "white",
                                                    zIndex: "999999",
                                                    height: "30px",
                                                    width: "50px",
                                                    padding: "10px",
                                                }}
                                            >
                                                <button className='edit-btn'
                                                onClick={() => {
                                                    setReadOnly(true);
                                                    setOpenRow(null);
                                                    setAddData({
                                                        cityCode: city.City_Code,
                                                        cityName: city.City_Name,
                                                        zoneCode: city.Zone_Code,
                                                        stateCode: city.State_Code,
                                                        countryCode: city.Country_Name,
                                                        destination: city.Manifest_Destination,
                                                        delivery: city.Destination_DHours,
                                                        pod: city.Destination_PHours,
                                                        product: '',
                                                    });
                                                    setModalIsOpen(true);
                                                }}><i className='bi bi-pen'></i></button>
                                            <button className='edit-btn' onClick={() => {
                                                setOpenRow(null);
                                                handleDeleteCity(city.City_Code);
                                                }}><i className='bi bi-trash'></i></button>
                                            </div>
                                        )}
                                    </td>

                                    <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                    <td>{city.City_Code}</td>
                                    <td>{city.City_Name}</td>
                                    <td>{city.Zone_Name}</td>
                                    <td>{city.State_Name}</td>
                                    <td>{city.Country_Name}</td>

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
                    className="custom-modal-receiver" contentLabel="Modal">
                    <div className="custom-modal-content">
                        <div className="header-tittle">
                            <header>InternationalCity Master</header>
                        </div>

                        <div className='container2'>
                            <form onSubmit={handleSaveCity}>

                                <div className="fields2">
                                    <div className="input-field3">
                                        <label htmlFor="">City Code</label>
                                        <input type="tel" placeholder="Enter City Code"
                                            value={addData.cityCode}
                                            onChange={(e) => setAddData({ ...addData, cityCode: e.target.value })} />
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">City Name</label>
                                        <input type="text" placeholder="Enter City Name" value={addData.cityName}
                                            onChange={(e) => setAddData({ ...addData, cityName: e.target.value })} required />
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">Zone Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getZone.map((zone) => ({
                                                value: zone.Zone_Code,
                                                label: zone.Zone_Name,
                                            }))}
                                            value={
                                                addData.zoneCode
                                                    ? {
                                                        value: addData.zoneCode,
                                                        label:
                                                            getZone.find((z) => z.Zone_Code === addData.zoneCode)
                                                                ?.Zone_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    zoneCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Zone Name"
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
                                            options={state.map((s) => ({
                                                value: s.State_Code,
                                                label: s.State_Name,
                                            }))}
                                            value={
                                                addData.stateCode
                                                    ? {
                                                        value: addData.stateCode,
                                                        label:
                                                            state.find((s) => s.State_Code === addData.stateCode)
                                                                ?.State_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
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
                                        <label htmlFor="">Country Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={country.map((c) => ({
                                                value: c.Country_Code,
                                                label: c.Country_Name,
                                            }))}
                                            value={
                                                addData.countryCode
                                                    ? {
                                                        value: addData.countryCode,
                                                        label:
                                                            country.find((c) => c.Country_Code === addData.countryCode)
                                                                ?.Country_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    countryCode: selected ? selected.value : "",
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

                                    <div className="input-field3">
                                        <label htmlFor="">Manifest To</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getCity.map((city) => ({
                                                value: city.City_Code,
                                                label: city.City_Name,
                                            }))}
                                            value={
                                                addData.destination
                                                    ? {
                                                        value: addData.destination,
                                                        label:
                                                            getCity.find((c) => c.City_Code === addData.destination)
                                                                ?.City_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
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

                                    <div className="input-field3">
                                        <label htmlFor="">Delivery Hours</label>
                                        <input type="text" placeholder="Enter Eelivery Hrs" value={addData.delivery}
                                            onChange={(e) => setAddData({ ...addData, delivery: e.target.value })} required />
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">POD Hours</label>
                                        <input type="text" placeholder="Enter POD Hrs" value={addData.pod}
                                            onChange={(e) => setAddData({ ...addData, pod: e.target.value })} required />
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">Product Type</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={[
                                                { value: "International", label: "International" },
                                                { value: "Domestic", label: "Domestic" },
                                            ]}
                                            value={
                                                addData.product
                                                    ? { value: addData.product, label: addData.product }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddData({
                                                    ...addData,
                                                    product: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Product Type"
                                            isSearchable={false}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />

                                    </div>
                                </div>
                                <div className='bottom-buttons'>
                                    {!readOnly && (<button type='submit' className='ok-btn'>Submit</button>)}
                                    {readOnly && (<button type='button' className='ok-btn'>Update</button>)}
                                    <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal >
            </div>
        </div>
    )
}

export default InternationalCity;