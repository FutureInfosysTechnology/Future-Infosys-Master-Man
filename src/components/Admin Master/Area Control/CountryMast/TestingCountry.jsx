import axios from 'axios';
import { useEffect, useState } from 'react';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import Swal from 'sweetalert';
import CountrymastApi from '../CountryMast/CountrymastApi';
import Sidebar from '../Sidebar';
import SidebarItem from '../SidebarItem';
import '../Zonemaster/Zonemaster.css';


const TestingCountry = () => {
    const [openRow, setOpenRow] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editCountry, setEditCountry] = useState('');
    const [Country, setCountry] = useState({
        Country_ID: '',
        Country_Code: '',
        Country_Name: '',
    });

    const [displayCountry, setDisplayCountry] = useState({
        Storedata: [],
    });

    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:5000/GetCountrymastdata');
            const data = await res.json();

            if (res.ok) {
                setDisplayCountry({ Storedata: Array.isArray(data.Data) ? data.Data : [] });
            } else {
                console.log('Data Not Fetch', data.message);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const changeInput = (e) => {
        const { name, value } = e.target;
        setCountry({
            ...Country,
            [name]: value,
        });
    };

    const editCountryData = (Country_ID) => {
        const countryToEdit = displayCountry.Storedata.find((country) => country.Country_ID === Country_ID);
        if (countryToEdit) {
            setCountry({
                Country_ID: countryToEdit.Country_ID,
                Country_Code: countryToEdit.Country_Code,
                Country_Name: countryToEdit.Country_Name,
            });
            setEditMode(true);
            setEditCountry(Country_ID);
        }
    };

    const Delete = async (Country_ID) => {
        try {
            const confirmDelete = await Swal({
                title: 'Are you sure?',
                text: 'You will not be able to recover this data!',
                icon: 'warning',
                buttons: ['Cancel', 'Yes, delete it!'],
                dangerMode: true,
            });
            if (confirmDelete) {
                const res = await axios.delete(`http://localhost:5000/Deletecountrymastdata?Country_ID=${Country_ID}`);
                if (res.status === 200) {
                    Swal('Deleted!', 'Your data has been deleted.', 'success');
                    fetchData();
                } else {
                    Swal('Error', 'Failed to delete data', 'error');
                }
            } else {
                Swal('Cancelled', 'Your data is safe :)', 'info');
            }
        } catch (error) {
            console.error('API call error:', error);
            Swal('Error', 'Failed to delete data', 'error');
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!editMode) {
                const res = await CountrymastApi.Countrymast(Country);
                if (res.status === 200) {
                    window.alert('Data inserted successfully');
                    setCountry({ Country_ID: '', Country_Code: '', Country_Name: '' });
                    fetchData();
                } else {
                    window.alert('Failed to insert data');
                }
            } else {
                const res = await CountrymastApi.upcountrymast(editCountry, Country.Country_Name, Country);
                if (res.status === 200) {
                    setEditMode(false);
                    setEditCountry('');
                    setCountry({ Country_ID: '', Country_Code: '', Country_Name: '' });
                    window.alert('Data updated successfully');
                    fetchData();
                } else {
                    window.alert('Failed to update data');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            window.alert('Duplicate CountryName Not Allow .');
        }
    };

    const filteredcountryname = displayCountry.Storedata.filter((country) =>
        country.Country_Name && country.Country_Name.toLowerCase().includes(searchText.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredcountryname.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Sidebar>
                <SidebarItem item={{ name: 'Countrylist' }} />
            </Sidebar>
            <div className="row justify-content-end">
                <div className="col col-lg-9">
                    <div className='card p-1 shadow'>
                        <div className="card-header">
                            <p className="submitzonemast">Country List</p>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className='input-group mb-3'>
                                <span className="input-group-text-univershal" id="basic-addon1">
                                    Country_Code
                                </span>
                                <input
                                    type="text"
                                    value={Country.Country_Code}
                                    name="Country_Code"
                                    readOnly={editMode}
                                    onChange={changeInput}
                                    placeholder="Country_Code"
                                />
                                <span className="input-group-text-univershal" id="basic-addon1">
                                    Country_Name
                                </span>
                                <input
                                    type="text"
                                    value={Country.Country_Name}
                                    name="Country_Name"
                                    onChange={changeInput}
                                    placeholder="Country_Name"
                                />
                            </div>
                            <div className='input-group mb-3'>
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    placeholder=" Find Country_Name"
                                    style={{ width: '79%' }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        fontSize: '16px',
                                        backgroundColor: '#007bff',
                                        width: '21%',
                                        marginTop: '3%',
                                        color: 'white',
                                    }}
                                >
                                    {editMode ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                        <div className='table-container'>
                            <table className='table table-bordered table-sm'>
                                <thead className='table-info body-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                                    <tr><th scope="col">Actions</th>
                                        <th scope="col">Sr.No</th>
                                        <th scope="col">Country_Code</th>
                                        <th scope="col">Country_Name</th>

                                    </tr>
                                </thead>
                                <tbody className='table-body'>
                                    {currentItems.map((Storedata, index) => (
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
                                                            left: "100px",
                                                            top: "0px",
                                                            borderRadius: "10px",
                                                            backgroundColor: "white",
                                                            zIndex: "999999",
                                                            height: "30px",
                                                            width: "50px",
                                                            padding: "10px",
                                                        }}
                                                    >
                                                        <button className='unvershaledit' onClick={() => editCountryData(Storedata.Country_ID)}>Edit</button>
                                                        <button className='unvershalsave' onClick={() => Delete(Storedata.Country_ID)}>Delete</button>

                                                    </div>
                                                )}
                                            </td>

                                            <td className="myCell">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                            <td>{Storedata.Country_Code}</td>
                                            <td>{Storedata.Country_Name}</td>

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
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestingCountry;
