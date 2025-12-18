import { useEffect, useState } from 'react';
import { getApi, postApi, deleteApi, putApi } from "../Area Control/Zonemaster/ServicesApi";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
    const [trainData, setTrainData] = useState({
        trainId: '',
        trainCode: '',
        trainName: '',
        trainNo: '',
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all trains
    const fetchData = async () => {
        try {
            const response = await getApi('/Master/GetAllTrains'); // Replace with your endpoint
            setData(Array.isArray(response.data) ? response.data : []);
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

    // Save new train
    const handleSave = async (e) => {
        e.preventDefault();
        const body = {
            Train_Code: trainData.trainCode,
            Train_Name: trainData.trainName,
            Train_No: trainData.trainNo,
        };
        try {
            const response = await postApi('/Master/AddTrainMaster', body);
            if (response.status === 1) {
                Swal.fire("Saved!", response.message, "success");
                setTrainData({ trainId: '', trainCode: '', trainName: '', trainNo: '' });
                setModalIsOpen(false);
                fetchData();
            } else {
                Swal.fire("Error!", response.message, "error");
            }
        } catch (err) {
            console.error("Save Error:", err);
            Swal.fire("Error", "Failed to save train", "error");
        }
    };

    // Update existing train
    const handleUpdate = async (e) => {
        e.preventDefault();
        const body = {
            Train_ID: trainData.trainId,
            Train_Code: trainData.trainCode,
            Train_Name: trainData.trainName,
            Train_No: trainData.trainNo,
        };
        try {
            const response = await putApi('/Master/UpdateTrainMaster', body);
            if (response.status === 1) {
                Swal.fire("Updated!", response.message, "success");
                setTrainData({ trainId: '', trainCode: '', trainName: '', trainNo: '' });
                setModalIsOpen(false);
                fetchData();
            } else {
                Swal.fire("Error!", response.message, "error");
            }
        } catch (err) {
            console.error("Update Error:", err);
            Swal.fire("Error", "Failed to update train", "error");
        }
    };

    // Delete train
    const handleDelete = async (trainId) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the train.",
            icon: "warning",
            showCancelButton: true
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteApi(`/Master/DeleteTrainMaster?Train_ID=${trainId}`);
                Swal.fire("Deleted!", "Train removed", "success");
                fetchData();
            } catch (err) {
                console.error("Delete Error:", err);
                Swal.fire("Error!", "Failed to delete", "error");
            }
        }
    };

    // Pagination & search
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const filteredData = currentRows.filter((d) =>
        (d?.Train_Code?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d?.Train_Name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d?.Train_No?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSearchChange = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };
    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    // Export Excel
    const handleExportExcel = () => {
        const exportData = currentRows.map(train => ({
            'Train ID': train.Train_ID,
            'Train Code': train.Train_Code,
            'Train Name': train.Train_Name,
            'Train No': train.Train_No,
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Trains');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }), 'trains.xlsx');
    };

    // Export PDF
    const handleExportPDF = () => {
        if (!currentRows.length) return alert("No data to export");
        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text("Train Master Data", 14, 20);
        const headers = [['Sr.No', 'Train ID', 'Train Code', 'Train Name', 'Train No']];
        const pdfData = currentRows.map((train, index) => [
            index + 1,
            train.Train_ID,
            train.Train_Code,
            train.Train_Name,
            train.Train_No
        ]);
        autoTable(pdf, { head: headers, body: pdfData, startY: 30, theme: 'grid' });
        pdf.save("trains.pdf");
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='body'>
            <div className="container1">

                {/* ADD / EXPORT / SEARCH */}
                <div className="addNew">
                    <div>
                        <button className='add-btn' onClick={() => { setModalIsOpen(true); setIsEditMode(false); setTrainData({ trainId: '', trainCode: '', trainName: '', trainNo: '' }); }}>
                            <i className="bi bi-plus-lg"></i> ADD NEW
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

                {/* TRAIN TABLE */}
                <div className='table-container'>
                    <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
                        <thead className='table-sm'>
                            <tr>
                                <th>Actions</th>
                                <th>Train ID</th>
                                <th>Train Code</th>
                                <th>Train Name</th>
                                <th>Train No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((train, index) => (
                                <tr key={`${train.Train_ID}-${index}`} style={{ fontSize: "12px", position: "relative" }}>
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
                                                    left: "120px",
                                                    top: "0px",
                                                    borderRadius: "10px",
                                                    backgroundColor: "white",
                                                    zIndex: "999999",
                                                    height: "30px",
                                                    width: "50px",
                                                    padding: "10px",
                                                }}
                                            >
                                                <button className='edit-btn' onClick={() => { setIsEditMode(true); setOpenRow(null); setTrainData({ trainId: train.Train_ID, trainCode: train.Train_Code, trainName: train.Train_Name, trainNo: train.Train_No }); setModalIsOpen(true); }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button className='edit-btn' onClick={() => { setOpenRow(null); handleDelete(train.Train_ID); }}>
                                                    <i className='bi bi-trash'></i>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td>{train.Train_ID}</td>
                                    <td>{train.Train_Code}</td>
                                    <td>{train.Train_Name}</td>
                                    <td>{train.Train_No}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
                    <div className="pagination">
                        <button className="ok-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>{'<'}</button>
                        <span style={{ padding: "5px" }}>Page {currentPage} of {totalPages}</span>
                        <button className="ok-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>{'>'}</button>
                    </div>
                    <div className="rows-per-page" style={{ display: "flex", flexDirection: "row", marginLeft: "10px" }}>
                        <label htmlFor="rowsPerPage" style={{ marginTop: "16px", marginRight: "10px" }}>Rows per page:</label>
                        <select id="rowsPerPage" value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} style={{ height: "40px", width: "60px", marginTop: "10px" }}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                {/* MODAL */}
                <Modal isOpen={modalIsOpen} overlayClassName="custom-overlay" className="custom-modal-mode" contentLabel='Modal'>
                    <div className='custom-modal-content'>
                        <div className="header-tittle"><header>Train Master</header></div>
                        <div className='container2'>
                            <form onSubmit={handleSave}>
                                <div className="fields2">
                                    <div className="input-field1">
                                        <label>Train Code</label>
                                        <input type='text' value={trainData.trainCode} onChange={e => setTrainData({ ...trainData, trainCode: e.target.value })} placeholder='Enter Train Code' required />
                                    </div>
                                    <div className="input-field1">
                                        <label>Train Name</label>
                                        <input type='text' value={trainData.trainName} onChange={e => setTrainData({ ...trainData, trainName: e.target.value })} placeholder='Enter Train Name' required />
                                    </div>
                                    <div className="input-field1">
                                        <label>Train No</label>
                                        <input type='text' value={trainData.trainNo} onChange={e => setTrainData({ ...trainData, trainNo: e.target.value })} placeholder='Enter Train No' required />
                                    </div>
                                </div>
                                <div className='bottom-buttons'>
                                    {!isEditMode && <button type='submit' className='ok-btn'>Submit</button>}
                                    {isEditMode && <button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>}
                                    <button type='button' onClick={() => setModalIsOpen(false)} className='ok-btn'>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>

            </div>
        </div>
    );
};

export default TrainEntry;
