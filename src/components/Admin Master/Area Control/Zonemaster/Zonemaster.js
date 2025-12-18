import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../../../Tabs/tabs.css';
import { deleteApi, getApi, postApi } from './ServicesApi';


const ZoneMaster = () => {
  const [openRow, setOpenRow] = useState(null);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [zoneData, setZoneData] = useState({
    zoneCode: '',
    zoneName: ''
  });
  const [searchQuery, setSearchQuery] = useState('');



  const fetchData = async () => {
    try {
      const response = await getApi('/Master/getZone');
      setZones(Array.isArray(response.Data) ? response.Data : []);
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
      ZoneCode: zoneData.zoneCode,
      ZoneName: zoneData.zoneName,
    };

    try {
      const response = await postApi('/Master/UpdateZone', requestBody, 'POST');
      if (response.status === 1) {
        setZones(zones.map((zone) => zone.Zone_Code === zoneData.zoneCode ? response.Data : zone));
        setZoneData({ zoneCode: '', zoneName: '' });
        Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
        setModalIsOpen(false);
        await fetchData();
      }
      else {
        Swal.fire('Error!', response.message || 'Failed to update the zone.', 'error');
      }
    } catch (err) {
      console.error('Error updating zone:', err);
      Swal.fire('Error', 'Failed to update zone data', 'error');
    }
  }


  const handleSaveZone = async (e) => {
    e.preventDefault();

    try {
      const response = await postApi(`/Master/addZone?ZoneCode=${zoneData.zoneCode}
          &ZoneName=${zoneData.zoneName}`);
      if (response.status === 1) {
        setZones([...zones, response.Data]);
        setZoneData({ zoneCode: '', zoneName: '' });
        Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
        setModalIsOpen(false);
        await fetchData();
      }
      else {
        Swal.fire('Error!', response.message || 'Failed to add the new zone.', 'error');
      }
    } catch (err) {
      console.error('Error saving zone:', err);
      Swal.fire('Error', 'Failed to save zone data', 'error');
    }
  };


  const handleDeleteZone = async (Zone_Code) => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this zone?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (confirmDelete.isConfirmed) {
      try {
        await deleteApi(`/Master/DeleteZone?ZoneCode=${Zone_Code}`);
        setZones(zones.filter((zone) => zone.ZoneCode !== Zone_Code));
        Swal.fire('Deleted!', 'The zone has been deleted.', 'success');
        await fetchData();
      } catch (err) {
        console.error('Delete Error:', err);
        Swal.fire('Error', 'Failed to delete zone', 'error');
      }
    }
  };

  const filteredZones = zones.filter((zone) =>
    (zone && zone.Zone_Code && zone.Zone_Code?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (zone && zone.Zone_Name && zone.Zone_Name?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredZones.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredZones.length / rowsPerPage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };


  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(zones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Zone');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(file, 'zones.xlsx');
  };

  const handleExportcountryPDF = () => {
    const pdfData = zones.map(({ id, Zone_Code, Zone_Name }) => [id, Zone_Code, Zone_Name]);

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
                setModalIsOpen(true); setIsEditMode(false);
                setZoneData({ zoneCode: '', zoneName: '' })
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
                  <th scope="col">Actions</th>
                  <th scope="col">Sr.No</th>
                  <th scope="col">Zone Code</th>
                  <th scope="col">Zone Name</th>

                </tr>
              </thead>
              <tbody className='table-body'>

                {currentRows.map((zone, index) => (
                  <tr key={`${zone.id}-${index}`} style={{ fontSize: "12px", position: "relative" }}>
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
                            setZoneData({
                              zoneCode: zone.Zone_Code?.trim(),
                              zoneName: zone.Zone_Name
                            });
                            setModalIsOpen(true);
                          }}>
                            <i className='bi bi-pen'></i>
                          </button>
                          <button className='edit-btn' onClick={() =>{
                             setOpenRow(null);
                             handleDeleteZone(zone.Zone_Code);
                          }}>
                            <i className='bi bi-trash'></i></button>
                        </div>
                      )}
                    </td>
                    <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                    <td>{zone.Zone_Code}</td>
                    <td>{zone.Zone_Name}</td>

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
                <header>City Control</header>
              </div>

              <div className='container2'>
                <form onSubmit={handleSaveZone}>
                  <div className="fields2">
                    <div className="input-field1">
                      <label htmlFor="">Zone Code </label>
                      <input type='tel' value={zoneData.zoneCode}
                        onChange={(e) => setZoneData({ ...zoneData, zoneCode: e.target.value })}
                        placeholder='Enter Zone Code' required/>
                    </div>

                    <div className="input-field1">
                      <label htmlFor="">Zone Name</label>
                      <input type='text' value={zoneData.zoneName}
                        onChange={(e) => setZoneData({ ...zoneData, zoneName: e.target.value })}
                        placeholder='Enter Zone Name' required />
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

export default ZoneMaster;