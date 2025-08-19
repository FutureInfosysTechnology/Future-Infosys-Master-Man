import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../../../Tabs/tabs.css';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { getApi, postApi, deleteApi, putApi } from '../Zonemaster/ServicesApi';



const Countrylist = () => {

  const [country, setCountry] = useState([]);                 // to get country data
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [countryData, setCountryData] = useState({
    countryCode: '',
    countryName: '',
  });                                                        // to add country data



  const fetchData = async () => {
    const response = await getApi('/Master/getCountry');
    setCountry(Array.isArray(response.Data) ? response.Data : []);
  };
  useEffect(() => {
    fetchData();
  }, []);


  const handleGenerateCode = () => {
    const newCode = `${Math.floor(Math.random() * 1000)}`;
    setCountryData({ ...countryData, countryCode: newCode });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const requestBody = {
      Country_Code: countryData.countryCode,
      Country_Name: countryData.countryName
    }

    try {
      const response = await postApi('/Master/updateCountry', requestBody, 'POST');

      if (response.status === 1) {
        setCountry(country.map((country) => country.Country_Code === countryData.countryCode ? response.Data : country));
        setCountryData({
          countryCode: '', countryName: ''
        });
        Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
        setModalIsOpen(false);
        await fetchData();
      } else {
        Swal.fire('Error!', response.message || 'Failed to update the country.', 'error');
      }
    } catch (error) {
      console.error('Failed to update country:', error);
      Swal.fire('Error', 'Failed to update country data', 'error');
    }
  }

  const handleSaveCountry = async (e) => {
    e.preventDefault();

    const requestBody = {
      countryCode: countryData.countryCode,
      countryName: countryData.countryName
    }

    try {
      const response = await postApi('/Master/addCountry', requestBody, 'POST');
      if (response.status === 1) {
        setCountryData({ countryCode: '', countryName: '' });
        Swal.fire('Saved!', response.message || 'Your changes have been saved.', 'success');
        setModalIsOpen(false);
        await fetchData();
      }
      else {
        Swal.fire('Error!', response.message || 'Your changes have been saved.', 'error');
      }
    } catch (err) {
      console.error('Save Error:', err);
      Swal.fire('Error', 'Failed to save Country data', 'error');
    }
  };


  const handleDeleteCountry = async (Country_Code) => {
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
        await deleteApi(`/Master/deleteCountry?CountryCode=${Country_Code}`);
        setCountry(country.filter((country) => country.CountryCode !== Country_Code));
        Swal.fire('Deleted!', 'Country has been deleted.', 'success');
        await fetchData();
      }
    } catch (err) {
      console.error('Delete Error:', err);
      Swal.fire('Error', 'Failed to delete Country', 'error');
    }
  };

  const filteredZones = country.filter((country) =>
    (country && country.Country_Code && country.Country_Code?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (country && country.Country_Name && country.Country_Name?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredZones.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredZones.length / rowsPerPage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(country);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'country');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(file, 'country.xlsx');
  };

  const handleExportcountryPDF = () => {
    const pdfData = country.map(({ id, code, name }) =>
      [id, code, name]);

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('Country Master Data', 14, 20);

    const headers = [['Sr.No', 'Country Code', 'Country Name']];
    pdf.autoTable({
      head: headers,
      body: pdfData,
      startY: 30,
      theme: 'grid'
    });
    pdf.save('country.pdf');
  };

  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);


  return (
    <>

      <div className="body">
        <div className="container1">

          <div className="addNew">
            <div>
              <button className='add-btn' onClick={() => {
                setModalIsOpen(true); setReadOnly(false);
                setCountryData({ countryCode: '', countryName: '' })
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
            <table className='table table-bordered table-sm'>
              <thead className='table-sm'>
                <tr>
                  <th scope="col">Sr.No</th>
                  <th scope="col">Country Code</th>
                  <th scope="col">Country Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className='table-body'>

                {currentRows.map((country, index) => (
                  <tr key={index}>
                    <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                    <td>{country.Country_Code}</td>
                    <td>{country.Country_Name}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>
                        <button onClick={() => {
                          setReadOnly(true);
                          setCountryData({
                            countryCode: country.Country_Code,
                            countryName: country.Country_Name
                          });
                          setModalIsOpen(true);
                        }} className='edit-btn'><i className='bi bi-pen'></i></button>
                        <button onClick={() => handleDeleteCountry(country.Country_Code)} className='edit-btn'><i className='bi bi-trash'></i>
                        </button>
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
            className="custom-modal-mode" contentLabel='Modal'>
            <div className='custom-modal-content'>
              <div className="header-tittle">
                <header>Country Master</header>
              </div>

              <div className='container2'>
                <form onSubmit={handleSaveCountry}>

                  <div className="fields2">
                    <div className="input-field1">
                      <label htmlFor="">Country Code</label>
                      <input type="text" placeholder="country Code" value={countryData.countryCode}
                        onChange={(e) => setCountryData({ ...countryData, countryCode: e.target.value })} required
                        readOnly={readOnly} />
                    </div>

                    {!readOnly && (
                      <div className="input-field1">
                        <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                          onClick={handleGenerateCode}>Generate Code</button>
                      </div>
                    )}

                    <div className="input-field1">
                      <label htmlFor="">Country Name</label>
                      <input type="text" value={countryData.countryName}
                        onChange={(e) => setCountryData({ ...countryData, countryName: e.target.value })}
                        placeholder='Enter Country Name' required />
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
    </>
  );
};

export default Countrylist;
