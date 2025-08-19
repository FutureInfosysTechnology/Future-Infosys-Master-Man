import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import '../../Tabs/tabs.css';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";


function InternationalCity() {

    const [international, setInternational] = useState([]);   // to get international city data
    const [state, setState] = useState([]);                   //to get state data
    const [country, setCountry] = useState([]);               //to get country data
    const [getZone, setGetZone] = useState([]);               // To Get Zone Data
    const [getCity, setGetCity] = useState([]);
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
                        <button className='add-btn' onClick={() => { setModalIsOpen(true) }}>
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
                    <table className='table table-bordered table-sm'>
                        <thead className='table-sm'>
                            <tr>
                                <th scope="col" >Sr.No</th>
                                <th scope="col" >City Code</th>
                                <th scope="col" >City Name</th>
                                <th scope="col" >Zone Name</th>
                                <th scope="col" >State Name</th>
                                <th scope="col" >Country Name</th>
                                <th scope="col" >Actions</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            {currentRows.map((city, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                    <td>{city.City_Code}</td>
                                    <td>{city.City_Name}</td>
                                    <td>{city.Zone_Name}</td>
                                    <td>{city.State_Name}</td>
                                    <td>{city.Country_Name}</td>
                                    <td>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                            <button className='edit-btn'><i className='bi bi-pen'></i></button>
                                            <button className='edit-btn' onClick={() => handleDeleteCity(city.City_Code)}><i className='bi bi-trash'></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
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
                            id="rowsPerPage"
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            style={{ height: "40px", width: "60px", marginTop: "10px" }}
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
                                        <select value={addData.zoneCode} required
                                            onChange={(e) => setAddData({ ...addData, zoneCode: e.target.value })}>
                                            <option value="" disabled >Select Zone Name</option>
                                            {getZone.map((zone, index) => (
                                                <option value={zone.Zone_Code} key={index}>{zone.Zone_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">State Name</label>
                                        <select value={addData.stateCode}
                                            onChange={(e) => setAddData({ ...addData, stateCode: e.target.value })} required>
                                            <option value="" disabled >Select State</option>
                                            {state.map((state, index) => (
                                                <option value={state.State_Code} key={index}>{state.State_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">Country Name</label>
                                        <select value={addData.countryCode} required
                                            onChange={(e) => setAddData({ ...addData, countryCode: e.target.value })}>
                                            <option value="" disabled >Select Country</option>
                                            {country.map((country, index) => (
                                                <option value={country.Country_Code} key={index}>{country.Country_Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-field3">
                                        <label htmlFor="">Manifest To</label>
                                        <select value={addData.destination}
                                            onChange={(e) => setAddData({ ...addData, destination: e.target.value })}>
                                            <option value="" disabled>Select Destination</option>
                                            {getCity.map((city, index) => (
                                                <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                            ))}
                                        </select>
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
                                        <select value={addData.product}
                                            onChange={(e) => setAddData({ ...addData, product: e.target.value })} required>
                                            <option value="" disabled>Product Type</option>
                                            <option value="International">International</option>
                                            <option value="Domestic">Domestic</option>
                                        </select>
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
            </div>
        </div>
    )
}

export default InternationalCity;