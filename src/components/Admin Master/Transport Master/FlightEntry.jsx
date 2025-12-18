import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from 'react';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { deleteApi, getApi, postApi, putApi } from "../Area Control/Zonemaster/ServicesApi";


const FlightEntry = () => {
  const [openRow, setOpenRow] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flightData, setFlightData] = useState({
    flightId: '',
    flightCode: '',
    flightName: '',
    flightNo: '',
  });
  const [searchQuery, setSearchQuery] = useState('');



  const fetchData = async () => {
    try {
      const response = await getApi('/Master/GetAllFlights');
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


  const handleUpdate = async (e) => {
    e.preventDefault();

    const body = {
      Flight_ID: flightData.flightId,
      Flight_Code: flightData.flightCode,
      Flight_Name: flightData.flightName,
      Flight_No: flightData.flightNo
    };

    try {
      const response = await putApi('/Master/UpdateFlightMaster', body);

      if (response.status === 1) {
        Swal.fire("Updated!", response.message, "success");
        setFlightData({
          flightId: '',
          flightCode: '',
          flightName: '',
          flightNo: '',
        });
        setModalIsOpen(false);
        fetchData();
      } else {
        Swal.fire("Error!", response.message, "error");
      }

    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error", "Failed to update flight", "error");
    }
  };



  const handleSave = async (e) => {
    e.preventDefault();

    const body = {
      Flight_Code: flightData.flightCode,
      Flight_Name: flightData.flightName,
      Flight_No: flightData.flightNo
    };

    try {
      const response = await postApi(`/Master/AddFlightMaster`, body);

      if (response.status === 1) {
        Swal.fire("Saved!", response.message, "success");
        setFlightData({
          flightId: '',
          flightCode: '',
          flightName: '',
          flightNo: '',
        });
        setModalIsOpen(false);
        fetchData();
      } else {
        Swal.fire("Error!", response.message, "error");
      }

    } catch (err) {
      console.error("Error saving:", err);
      Swal.fire("Error", "Failed to save flight", "error");
    }
  };



  const handleDelete = async (flightId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the flight.",
      icon: "warning",
      showCancelButton: true
    });

    if (confirmDelete.isConfirmed) {
      try {
        await deleteApi(`/Master/DeleteFlightMaster?Flight_ID=${flightId}`);

        Swal.fire("Deleted!", "Flight removed", "success");
        fetchData();

      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error!", "Failed to delete", "error");
      }
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const filteredData = currentRows.filter((d) =>
    (d?.Flight_Code && d?.Flight_Code.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (d?.Flight_Name && d?.Flight_Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (d?.Flight_No   && d?.Flight_No.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };


  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleExportExcel = () => {
    const exportData = currentRows.map(flight => ({
      'Flight ID': flight.Flight_ID,
      'Flight Code': flight.Flight_Code,
      'Flight Name': flight.Flight_Name,
      'Flight No': flight.Flight_No
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Flights');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    saveAs(file, 'flights.xlsx');
  };


 const handleExportPDF = () => {
    if (!currentRows || currentRows.length === 0) {
        alert("No data to export");
        return;
    }

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Flight Master Data", 14, 20);

    const headers = [['Sr.No', 'Flight ID', 'Flight Code', 'Flight Name', 'Flight No']];
    const pdfData = currentRows.map((flight, index) => [
        index + 1,
        flight.Flight_ID,
        flight.Flight_Code,
        flight.Flight_Name,
        flight.Flight_No
    ]);

    autoTable(pdf, {
        head: headers,
        body: pdfData,
        startY: 30,
        theme: 'grid',
    });

    pdf.save("flights.pdf");
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
                setModalIsOpen(true); setIsEditMode(false);
                setFlightData({
                  flightId: '',
                  flightCode: '',
                  flightName: '',
                  flightNo: '',
                });
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
                  <th scope="col">Flight ID</th>
                  <th scope="col">Flight Code</th>
                  <th scope="col">Flight Name</th>
                  <th scope="col">Flight No</th>
                </tr>
              </thead>

              <tbody className='table-body'>
                {filteredData.map((flight, index) => (
                  <tr key={`${flight.Flight_ID}-${index}`} style={{ fontSize: "12px", position: "relative" }}>

                    {/* ACTION BUTTON */}
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
                          {/* EDIT */}
                          <button
                            className='edit-btn'
                            onClick={() => {
                              setIsEditMode(true);
                              setOpenRow(null);
                              setFlightData({
                                flightId: flight.Flight_ID,
                                flightCode: flight.Flight_Code,
                                flightName: flight.Flight_Name,
                                flightNo: flight.Flight_No
                              });
                              setModalIsOpen(true);
                            }}
                          >
                            <i className='bi bi-pen'></i>
                          </button>

                          {/* DELETE */}
                          <button
                            className='edit-btn'
                            onClick={() => {
                              setOpenRow(null);
                              handleDelete(flight.Flight_ID);   // FIXED
                            }}
                          >
                            <i className='bi bi-trash'></i>
                          </button>
                        </div>
                      )}
                    </td>

                    {/* FIELDS */}
                    <td>{flight.Flight_ID}</td>
                    <td>{flight.Flight_Code}</td>
                    <td>{flight.Flight_Name}</td>
                    <td>{flight.Flight_No}</td>
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
                <header>Flight Master</header>
              </div>

              <div className='container2'>
                <form onSubmit={handleSave}>
                  <div className="fields2">
                    <div className="input-field1">
                      <label htmlFor="">Flight Code </label>
                      <input type='tel' value={flightData.flightCode}
                        onChange={(e) => setFlightData({ ...flightData, flightCode: e.target.value })}
                        placeholder='Enter Flight Code' required />
                    </div>

                    <div className="input-field1">
                      <label htmlFor="">Flight Name</label>
                      <input type='text' value={flightData.flightName}
                        onChange={(e) => setFlightData({ ...flightData, flightName: e.target.value })}
                        placeholder='Enter Flight Name' required />
                    </div>

                    <div className="input-field1">
                      <label htmlFor="">Flight No </label>
                      <input type='tel' value={flightData.flightNo}
                        onChange={(e) => setFlightData({ ...flightData, flightNo: e.target.value })}
                        placeholder='Enter Flight No' required />
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
          </Modal >

        </div >
      </div>

    </>

  );
};

export default FlightEntry;