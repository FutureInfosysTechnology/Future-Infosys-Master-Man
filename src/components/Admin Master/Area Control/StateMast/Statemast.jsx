
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../../../Tabs/tabs.css';
import { deleteApi, getApi, postApi } from '../Zonemaster/ServicesApi';


const Statemast = () => {
    const [openRow, setOpenRow] = useState(null);
    const [state, setState] = useState([]);                  // To Get State Dat        // To Get Country Data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [stateData, setStateData] = useState({
        stateCode: '',
        stateName: '',
        countryCode: '',
    });                                                     // To Add State Data


    const fetchStateData = async () => {
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
    useEffect(() => {
        fetchStateData();
    }, []);

    const fetchData = async (endpoint, setData) => {
        try {
            const response = await getApi(endpoint);
            setData(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };



    const handleGenerateCode = () => {
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setStateData({ ...stateData, stateCode: newCode });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            State_Code: stateData.stateCode,
            State_Name: stateData.stateName
        }

        try {
            const response = await postApi('/Master/UpdateState', requestBody, 'POST');
            if (response.status === 1) {
                setState(state.map((state) => state.State_Code === stateData.stateCode ? response.Data : state));
                setStateData({ stateCode: '', stateName: '' });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchStateData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the state.', 'error');
            }
        } catch (err) {
            console.error('Error updating state:', err);
            Swal.fire('Error', 'Failed to update state data', 'error');
        }
    }


    const handleSaveState = async (e) => {
        e.preventDefault();

        const requestBody = {
            StateCode: stateData.stateCode,
            StateName: stateData.stateName,
            CountryCode: stateData.countryCode
        }

        try {
            const response = await postApi('/Master/AddStateMast', requestBody, 'POST');
            if (response.status === 1) {
                setState([...state, response.Data]);
                setStateData({ stateCode: '', stateName: '' });
                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchStateData();
            }
            else {
                Swal.fire('Error!', response.message || 'Failed to add the new state.', 'error');
            }
        } catch (err) {
            console.error('Error saving state:', err);
            Swal.fire('Error', 'Failed to save state data', 'error');
        }
    };


    const filteredZones = state.filter((state) =>
        (state && state.State_Code && state.State_Code?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (state && state.State_Name && state.State_Name?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredZones.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredZones.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDeleteState = async (State_Code) => {
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
                await deleteApi(`/Master/deleteState?StateCode=${State_Code}`);
                setState(state.filter((state) => state.StateCode !== State_Code));
                Swal.fire('Deleted!', 'State has been deleted.', 'success');
                await fetchData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete State', 'error');
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(state);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'State');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'state.xlsx');
    };

    const handleExportstatePDF = () => {
        const pdfData = state.map(({ id, code, name, country }) =>
            [id, code, name, country]);

        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text('State Master Data', 14, 20);

        const headers = [['Sr.No', 'State Code', 'State Name', 'Country Name']];
        pdf.autoTable({ head: headers, body: pdfData, startY: 30, theme: 'grid' });
        pdf.save('state.pdf');
    };

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;



    return (
        <>

            <div className="body">
                <div className="container1">

                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => {
                                setModalIsOpen(true); setIsEditMode(false);
                                setStateData({ stateCode: '', stateName: '' })
                            }}>
                                <i className="bi bi-plus-lg"></i>
                                <span>ADD NEW</span>
                            </button>

                            <div className="dropdown">
                                <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                                <div className="dropdown-content">
                                    <button onClick={handleExportExcel}>Export to Excel</button>
                                    <button onClick={handleExportstatePDF}>Export to PDF</button>
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
                                <tr><th scope="col">Actions</th>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">State Code</th>
                                    <th scope="col">State Name</th>

                                </tr>
                            </thead>
                            <tbody className='table-body'>


                                {currentRows.map((state, index) => (
                                    <tr key={`${state.id}-${index}`} style={{ fontSize: "12px", position: "relative" }}>
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
                                                        left: "150px",
                                                        top: "0px",
                                                        borderRadius: "10px",
                                                        backgroundColor: "white",
                                                        zIndex: "999999",
                                                        height: "30px",
                                                        width: "50px",
                                                        padding: "10px",
                                                    }}
                                                >
                                                   <button onClick={() => {
                                                    setIsEditMode(true);
                                                    setOpenRow(null);
                                                    setStateData({
                                                        stateCode: state.State_Code,
                                                        stateName: state.State_Name
                                                    });
                                                    setModalIsOpen(true);
                                                }} className='edit-btn'>
                                                    <i className='bi bi-pen'></i></button>
                                                <button onClick={() => {
                                                    setOpenRow(null);
                                                    handleDeleteState(state.State_Code);
                                                    }} className='edit-btn'><i className='bi bi-trash'></i></button>
                                                </div>
                                            )}
                                        </td>

                                        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                        <td>{state.State_Code}</td>
                                        <td>{state.State_Name}</td>

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
                        className="custom-modal-volumetric" contentLabel='Modal'>
                        <div className='custom-modal-content'>
                            <div className="header-tittle">
                                <header>State Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSaveState}>

                                    <div className="fields2">
                                        <div className="input-field1">
                                            <label htmlFor="">State Code</label>
                                            <input type="text" placeholder="State Code"
                                                value={stateData.stateCode}
                                                onChange={(e) => setStateData({ ...stateData, stateCode: e.target.value })}
                                                required readOnly={isEditMode} />
                                        </div>

                                        {!isEditMode && (
                                            <div className="input-field1">
                                                <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                    onClick={handleGenerateCode}>Generate Code</button>
                                            </div>
                                        )}

                                        <div className="input-field1">
                                            <label htmlFor="">State Name</label>
                                            <input type="text" value={stateData.stateName}
                                                onChange={(e) => setStateData({ ...stateData, stateName: e.target.value })}
                                                placeholder='Enter State Name' required />
                                        </div>

                                        {/* <div className="input-field1">
                                            <label htmlFor="">Country Name</label>
                                            <select required
                                                value={stateData.countryCode}
                                                onChange={(e) => setStateData({ ...stateData, countryCode: e.target.value })}>
                                                <option value="" disabled>Country Name</option>
                                                {getCountry.map((country, index) => (
                                                    <option value={country.Country_Code} key={index}>{country.Country_Name}</option>
                                                ))}
                                            </select>
                                        </div> */}
                                    </div>
                                    <div className='bottom-buttons' style={{ marginLeft: "25px" }}>
                                        {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                        {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>close</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </Modal >
                </div>
            </div >
        </>
    );
};

export default Statemast;