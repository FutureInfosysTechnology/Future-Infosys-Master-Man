import React, { useEffect, useState } from 'react';
import { getApi, postApi, deleteApi } from "../Area Control/Zonemaster/ServicesApi";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";


const ProductEntry = () => {
  const [openRow, setOpenRow] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // UPDATED — All flightData → productData
  const [productData, setProductData] = useState({
    productCode: '',
    productName: '',
    productNo: '',
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
      ZoneCode: productData.productCode,
      ZoneName: productData.productName,
    };

    try {
      const response = await postApi('/Master/UpdateZone', requestBody, 'POST');
      if (response.status === 1) {
        setData(data.map((d) => d.Zone_Code === productData.productCode ? response.Data : d));
        setProductData({
          productCode: '',
          productName: '',
          productNo: '',
        });
        Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
        setModalIsOpen(false);
        await fetchData();
      }
      else {
        Swal.fire('Error!', response.message || 'Failed to update product.', 'error');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      Swal.fire('Error', 'Failed to update product data', 'error');
    }
  }


  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await postApi(`/Master/addZone?ZoneCode=${productData.productCode}&ZoneName=${productData.productName}`);

      if (response.status === 1) {
        setData([...data, response.Data]);
        setProductData({
          productCode: '',
          productName: '',
          productNo: '',
        });
        Swal.fire('Saved!', response.message || 'Product saved successfully.', 'success');
        setModalIsOpen(false);
        await fetchData();
      } else {
        Swal.fire('Error!', response.message || 'Failed to add product.', 'error');
      }
    } catch (err) {
      console.error('Save Error:', err);
      Swal.fire('Error', 'Failed to save product data', 'error');
    }
  };


  const handleDelete = async (productCode) => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (confirmDelete.isConfirmed) {
      try {
        await deleteApi(`/Master/DeleteZone?ZoneCode=${productCode}`);
        setData(data.filter((d) => d.ZoneCode !== productCode));
        Swal.fire('Deleted!', 'Product deleted successfully.', 'success');
        await fetchData();
      } catch (err) {
        console.error('Delete Error:', err);
        Swal.fire('Error', 'Failed to delete product.', 'error');
      }
    }
  };


  const filteredData = data.filter((d) =>
    (d.Zone_Code?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (d.Zone_Name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);


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
                setProductData({
                  productCode: '',
                  productName: '',
                  productNo: '',
                });
              }}>
                <i className="bi bi-plus-lg"></i>
                <span>ADD NEW</span>
              </button>

              <div className="dropdown">
                <button className="dropbtn"><i className="bi bi-file-earmark-arrow-down"></i> Export</button>
                <div className="dropdown-content">
                  <button onClick={() => { }} >Export to Excel</button>
                  <button onClick={() => { }} >Export to PDF</button>
                </div>
              </div>
            </div>


            <div className="search-input">
              <input className="add-input" type="text" placeholder="search"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                  <th>Product Code</th>
                  <th>Product Name</th>
                </tr>
              </thead>

              <tbody className='table-body'>
                {currentRows.map((row, index) => (
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
                            flexDirection: "row",
                            position: "absolute",
                            left: "150px",
                            top: "0px",
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
                            setProductData({
                              productCode: row.Zone_Code,
                              productName: row.Zone_Name
                            });
                            setModalIsOpen(true);
                          }}>
                            <i className='bi bi-pen'></i>
                          </button>

                          <button className='edit-btn' onClick={() => {
                            setOpenRow(null);
                            handleDelete(row.Zone_Code);
                          }}>
                            <i className='bi bi-trash'></i>
                          </button>
                        </div>
                      )}

                    </td>

                    <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                    <td>{row.Zone_Code}</td>
                    <td>{row.Zone_Name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <Modal id="modal" overlayClassName="custom-overlay" isOpen={modalIsOpen}
            className="custom-modal-mode">

            <div className='custom-modal-content'>
              <div className="header-tittle">
                <header>Product Master</header>
              </div>

              <div className='container2'>
                <form onSubmit={handleSave}>
                  <div className="fields2">

                    <div className="input-field1">
                      <label>Product Code</label>
                      <input type='text'
                        value={productData.productCode}
                        onChange={(e) => setProductData({ ...productData, productCode: e.target.value })}
                        placeholder='Enter Product Code' required />
                    </div>

                    <div className="input-field1">
                      <label>Product Name</label>
                      <input type='text'
                        value={productData.productName}
                        onChange={(e) => setProductData({ ...productData, productName: e.target.value })}
                        placeholder='Enter Product Name' required />
                    </div>

                    

                  </div>

                  <div className='bottom-buttons'>
                    {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                    {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
                    <button type='button' onClick={() => setModalIsOpen(false)} className='ok-btn'>Close</button>
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

export default ProductEntry;
