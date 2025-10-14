import React, { useState, useEffect } from "react";
import '../../Tabs/tabs.css';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import Select from 'react-select';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";




function DomesticCity() {
    const [openRow, setOpenRow] = useState(null);
    const [getCIty, setGetCIty] = useState([]);       // To Get Domestic City Data
    const [state, setState] = useState([]);           //to get state data
    const [country, setCountry] = useState([]);       //to get country data
    const [getZone, setGetZone] = useState([]);       // To Get Zone Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [readOnly, setReadOnly] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addCity, setAddCity] = useState({
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


    const filteredgetCIty = getCIty.filter((city) =>
        (city && city.City_Code && city.City_Code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (city && city.City_Name && city.City_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (city && city.Zone_Name && city.Zone_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (city && city.State_Name && city.State_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (city && city.Country_Name && city.Country_Name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetCIty.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetCIty.length / rowsPerPage);


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };


    const fetchCityData = async () => {
        try {
            const response = await getApi('/Master/getdomestic');
            setGetCIty(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCityData();
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


    const handleSaveDomesticCity = async (e) => {
        e.preventDefault();

        const requestBody = {
            cityCode: addCity.cityCode,
            cityName: addCity.cityName,
            countryCode: addCity.countryCode,
            ZoneCode: addCity.zoneCode,
            stateCode: addCity.stateCode,
            manifestDestination: addCity.destination,
            destinationDHours: addCity.delivery,
            destinationPHours: addCity.pod,
            productType: addCity.product,
        }

        try {
            const response = await postApi('/Master/addCity', requestBody, 'POST');
            if (response.status === 1) {
                setGetCIty([...getCIty, response.Data]);
                setAddCity({
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
                await fetchCityData();
            } else {
                Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to add Domestic City data', 'error');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            CityCode: addCity.cityCode,
            CityName: addCity.cityName,
            ZoneCode: addCity.zoneCode,
            CountryCode: addCity.countryCode,
            StateCode: addCity.stateCode,
            ManifestDestination: addCity.destination,
            DestinationDHours: addCity.delivery,
            DestinationPHours: addCity.pod,
            ProductType: addCity.product
        }

        try {
            const response = await postApi('/Master/updateCity', requestBody, 'POST');
            if (response.status === 1) {
                setGetCIty(getCIty.map((city) => city.City_Code === addCity.cityCode ? response.Data : city));
                setAddCity({
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
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchCityData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the city.', 'error');
            }
        } catch (error) {
            console.error("Failed to update Domestic City:", error);
            Swal.fire('Error', 'Failed to update city data', 'error');
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
                await deleteApi(`/Master/DeleteCity?CityCode=${City_Code}`);
                setGetCIty(getCIty.filter((city) => city.CityCode !== City_Code));
                Swal.fire('Deleted!', 'City has been deleted.', 'success');
                await fetchCityData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete City', 'error');
        }
    };


    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getCIty);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getCIty');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getCIty.xlsx');
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

            pdf.save('getCIty.pdf');
        });
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
                            setModalIsOpen(true); setReadOnly(false);
                            setAddCity({
                                cityCode: '', cityName: '', countryCode: '', stateCode: '', destination: '',
                                delivery: '', pod: '', product: '', zoneCode: ''
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
                                <th scope="col">City Code</th>
                                <th scope="col">City Name</th>
                                <th scope="col">Zone Name</th>
                                <th scope="col">State Name</th>
                                <th scope="col">Country Name</th>

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
                                                    left: "90px",
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
                                                    setReadOnly(true);
                                                    setOpenRow(null);
                                                    setAddCity({
                                                        cityCode: city.City_Code,
                                                        cityName: city.City_Name,
                                                        zoneCode: city.Zone_Code,
                                                        stateCode: city.State_Code,
                                                        countryCode: city.Country_Name,
                                                        destination: city.Manifest_Destination,
                                                        delivery: city.Destination_DHours,
                                                        pod: city.Destination_PHours
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
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
                            <header>Domestic City Master</header>
                        </div>

                        <div className='container2'>
                            <form onSubmit={handleSaveDomesticCity}>
                                <div className="fields2">
                                    <div className="input-field3">
                                        <label htmlFor="">City Code</label>
                                        <input type="tel" value={addCity.cityCode}
                                            onChange={(e) => setAddCity({ ...addCity, cityCode: e.target.value })}
                                            placeholder="Enter City Code" readOnly={readOnly} />
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">City Name</label>
                                        <input type="text" value={addCity.cityName}
                                            onChange={(e) => setAddCity({ ...addCity, cityName: e.target.value })}
                                            placeholder="Enter City Name" required />
                                    </div>
                                    <div className="input-field3">
                                        <label>Zone Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getZone.map((zone) => ({
                                                value: zone.Zone_Code,
                                                label: zone.Zone_Name,
                                            }))}
                                            value={
                                                addCity.zoneCode
                                                    ? {
                                                        value: addCity.zoneCode,
                                                        label:
                                                            getZone.find((z) => z.Zone_Code === addCity.zoneCode)
                                                                ?.Zone_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    zoneCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Zone Name"
                                            isSearchable
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    <div className="input-field3">
                                        <label>State Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={state.map((s) => ({
                                                value: s.State_Code,
                                                label: s.State_Name,
                                            }))}
                                            value={
                                                addCity.stateCode
                                                    ? {
                                                        value: addCity.stateCode,
                                                        label:
                                                            state.find((s) => s.State_Code === addCity.stateCode)
                                                                ?.State_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    stateCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select State"
                                            isSearchable
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    <div className="input-field3">
                                        <label>Country Name</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={country.map((c) => ({
                                                value: c.Country_Code,
                                                label: c.Country_Name,
                                            }))}
                                            value={
                                                addCity.countryCode
                                                    ? {
                                                        value: addCity.countryCode,
                                                        label:
                                                            country.find(
                                                                (c) => c.Country_Code === addCity.countryCode
                                                            )?.Country_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    countryCode: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Country"
                                            isSearchable
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>

                                    <div className="input-field3">
                                        <label>Manifest To</label>
                                        <Select
                                            className="blue-selectbooking"
                                            classNamePrefix="blue-selectbooking"
                                            options={getCIty.map((city) => ({
                                                value: city.City_Code,
                                                label: city.City_Name,
                                            }))}
                                            value={
                                                addCity.destination
                                                    ? {
                                                        value: addCity.destination,
                                                        label:
                                                            getCIty.find(
                                                                (c) => c.City_Code === addCity.destination
                                                            )?.City_Name || "",
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
                                                    destination: selected ? selected.value : "",
                                                })
                                            }
                                            placeholder="Select Destination"
                                            isSearchable
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>


                                    <div className="input-field3">
                                        <label htmlFor="">Delivery Hours</label>
                                        <input type="text" value={addCity.delivery}
                                            onChange={(e) => setAddCity({ ...addCity, delivery: e.target.value })}
                                            placeholder="Enter Delivery Hrs" required />
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">POD Hours</label>
                                        <input type="text" value={addCity.pod}
                                            onChange={(e) => setAddCity({ ...addCity, pod: e.target.value })}
                                            placeholder="Enter POD Hrs" required />
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
                                                addCity.product
                                                    ? { value: addCity.product, label: addCity.product }
                                                    : null
                                            }
                                            onChange={(selected) =>
                                                setAddCity({
                                                    ...addCity,
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
                                    {readOnly && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
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

export default DomesticCity;