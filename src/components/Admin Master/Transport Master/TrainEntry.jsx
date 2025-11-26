import React, { useEffect, useState } from 'react';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

const TrainEntry = () => {

    const [openRow, setOpenRow] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ---- Changed flightData → trainData ----
    const [trainData, setTrainData] = useState({
        trainCode: '',
        trainName: '',
        trainNo: '',
    });

    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            const response = await getApi('/Master/getZone');
            setData(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const requestBody = {
            ZoneCode: trainData.trainCode,
            ZoneName: trainData.trainName,
        };

        try {
            const response = await postApi('/Master/UpdateZone', requestBody, 'POST');
            if (response.status === 1) {
                setData(data.map((d) =>
                    d.Zone_Code === trainData.trainCode ? response.Data : d
                ));

                setTrainData({ trainCode: '', trainName: '', trainNo: '' });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the train.', 'error');
            }
        } catch (err) {
            console.error('Error updating zone:', err);
            Swal.fire('Error', 'Failed to update train data', 'error');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await postApi(`/Master/addZone?ZoneCode=${trainData.trainCode}&ZoneName=${trainData.trainName}`);
            if (response.status === 1) {

                setData([...data, response.Data]);
                setTrainData({ trainCode: '', trainName: '', trainNo: '' });

                Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchData();

            } else {
                Swal.fire('Error!', response.message || 'Failed to add the new train data.', 'error');
            }
        } catch (err) {
            console.error('Error saving zone:', err);
            Swal.fire('Error', 'Failed to save train data', 'error');
        }
    };

    const handleDelete = async (Train_Code) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this train data?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteApi(`/Master/DeleteZone?ZoneCode=${Train_Code}`);
                setData(data.filter((d) => d.ZoneCode !== Train_Code));

                Swal.fire('Deleted!', 'The train has been deleted.', 'success');
                await fetchData();
            } catch (err) {
                console.error('Delete Error:', err);
                Swal.fire('Error', 'Failed to delete train data', 'error');
            }
        }
    };

    const filteredData = data.filter((d) =>
        (d?.Zone_Code?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (d?.Zone_Name?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Train');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob(
            [excelBuffer],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }
        );
        saveAs(file, 'train.xlsx');
    };

    const handleExportcountryPDF = () => {
        const pdfData = data.map(({ id, Zone_Code, Zone_Name }) => [id, Zone_Code, Zone_Name]);

        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text('Zone Master Data', 14, 20);

        const headers = [['Sr.No', 'Zone Code', 'Zone Name']];
        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 30,
            theme: 'grid'
        });
        pdf.save('zone.pdf');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <div className='body'>
                <div className="container1">

                    <div className="addNew">
                        <div>
                            <button className='add-btn' onClick={() => {
                                setModalIsOpen(true);
                                setIsEditMode(false);
                                setTrainData({ trainCode: '', trainName: '', trainNo: '' });
                            }}>
                                <i className="bi bi-plus-lg"></i>
                                <span>ADD NEW</span>
                            </button>

                            <div className="dropdown">
                                <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                                <div className="dropdown-content">
                                    <button onClick={handleExportExcel}>Export to Excel</button>
                                    <button onClick={handleExportcountryPDF}>Export to PDF</button>
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
                                    <th>Actions</th>
                                    <th>Sr.No</th>
                                    <th>Train Code</th>
                                    <th>Train Name</th>
                                    <th>Train No</th>
                                </tr>
                            </thead>

                            <tbody className='table-body'>
                                {currentRows.map((zone, index) => (
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
                                                    <button className='edit-btn' onClick={() => {
                                                        setIsEditMode(true);
                                                        setOpenRow(null);
                                                        setTrainData({
                                                            trainCode: zone.Zone_Code?.trim(),
                                                            trainName: zone.Zone_Name
                                                        });
                                                        setModalIsOpen(true);
                                                    }}>
                                                        <i className='bi bi-pen'></i>
                                                    </button>

                                                    <button className='edit-btn' onClick={() => {
                                                        setOpenRow(null);
                                                        handleDelete(zone.Zone_Code);
                                                    }}>
                                                        <i className='bi bi-trash'></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                                        <td>{zone.Zone_Code}</td>
                                        <td>{zone.Zone_Name}</td>
                                        <td>12346</td>
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

                    <Modal id="modal" overlayClassName="custom-overlay" isOpen={modalIsOpen}
                        className="custom-modal-mode" contentLabel='Modal'>
                        <div className='custom-modal-content'>
                            <div className="header-tittle">
                                <header>Train Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSave}>
                                    <div className="fields2">

                                        <div className="input-field1">
                                            <label>Train Code</label>
                                            <input type='tel' value={trainData.trainCode}
                                                onChange={(e) => setTrainData({ ...trainData, trainCode: e.target.value })}
                                                placeholder='Enter Train Code' required />
                                        </div>

                                        <div className="input-field1">
                                            <label>Train Name</label>
                                            <input type='text' value={trainData.trainName}
                                                onChange={(e) => setTrainData({ ...trainData, trainName: e.target.value })}
                                                placeholder='Enter Train Name' required />
                                        </div>

                                        <div className="input-field1">
                                            <label>Train No</label>
                                            <input type='tel' value={trainData.trainNo}
                                                onChange={(e) => setTrainData({ ...trainData, trainNo: e.target.value })}
                                                placeholder='Enter Train No' required />
                                        </div>

                                    </div>

                                    <div className='bottom-buttons'>
                                        {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                        {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                                        <button onClick={() => setModalIsOpen(false)} className='ok-btn'>Close</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </Modal>

                </div>
            </div>
        </>
    );
};

export default TrainEntry;
