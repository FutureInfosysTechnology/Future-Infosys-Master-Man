import React, { useEffect, useState } from 'react';
import { getApi, postApi, deleteApi, putApi } from "../Area Control/Zonemaster/ServicesApi";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  const [productData, setProductData] = useState({
    productId: '',
    productCode: '',
    productName: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all products
  const fetchData = async () => {
    try {
      const response = await getApi('/Master/GetAllProducts');
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Save new product
  const handleSave = async (e) => {
    e.preventDefault();
    const body = {
      Product_Code: productData.productCode,
      Product_Name: productData.productName,
    };
    try {
      const response = await postApi('/Master/AddProductMaster', body);
      if (response.status === 1) {
        Swal.fire("Saved!", response.message, "success");
        setProductData({ productId: '', productCode: '', productName: '' });
        setModalIsOpen(false);
        fetchData();
      } else {
        Swal.fire("Error!", response.message, "error");
      }
    } catch (err) {
      console.error("Save Error:", err);
      Swal.fire("Error", "Failed to save product", "error");
    }
  };

  // Update existing product
  const handleUpdate = async (e) => {
    e.preventDefault();
    const body = {
      Product_ID: productData.productId,
      Product_Code: productData.productCode,
      Product_Name: productData.productName
    };
    try {
      const response = await putApi('/Master/UpdateProductMaster', body);
      if (response.status === 1) {
        Swal.fire("Updated!", response.message, "success");
        setProductData({ productId: '', productCode: '', productName: '' });
        setModalIsOpen(false);
        fetchData();
      } else {
        Swal.fire("Error!", response.message, "error");
      }
    } catch (err) {
      console.error("Update Error:", err);
      Swal.fire("Error", "Failed to update product", "error");
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true
    });
    if (confirmDelete.isConfirmed) {
      try {
        await deleteApi(`/Master/DeleteProductMaster?Product_ID=${productId}`);
        Swal.fire("Deleted!", "Product removed", "success");
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
  const filteredData = currentRows.filter(d =>
    (d?.Product_Code?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (d?.Product_Name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchChange = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Export Excel
  const handleExportExcel = () => {
    const exportData = currentRows.map(p => ({
      'Product ID': p.Product_ID,
      'Product Code': p.Product_Code,
      'Product Name': p.Product_Name
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }), 'products.xlsx');
  };

  // Export PDF
  const handleExportPDF = () => {
    if (!currentRows.length) return alert("No data to export");
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Product Master Data", 14, 20);
    const headers = [['Sr.No', 'Product ID', 'Product Code', 'Product Name']];
    const pdfData = currentRows.map((p, index) => [
      index + 1,
      p.Product_ID,
      p.Product_Code,
      p.Product_Name,
    ]);
    autoTable(pdf, { head: headers, body: pdfData, startY: 30, theme: 'grid' });
    pdf.save("products.pdf");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='body'>
      <div className="container1">

        {/* ADD / EXPORT / SEARCH */}
        <div className="addNew">
          <div>
            <button className='add-btn' onClick={() => { setModalIsOpen(true); setIsEditMode(false); setProductData({ productId: '', productCode: '', productName: '', productPrice: '' }); }}>
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

        {/* PRODUCT TABLE */}
        <div className='table-container'>
          <table className='table table-bordered table-sm' style={{ whiteSpace: "nowrap" }}>
            <thead className='table-sm'>
              <tr>
                <th>Actions</th>
                <th>Product ID</th>
                <th>Product Code</th>
                <th>Product Name</th>

              </tr>
            </thead>
            <tbody>
              {filteredData.map((p, index) => (
                <tr key={`${p.Product_ID}-${index}`} style={{ fontSize: "12px", position: "relative" }}>
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

                        <button className='edit-btn' onClick={() => { setIsEditMode(true); setOpenRow(null); setProductData({ productId: p.Product_ID, productCode: p.Product_Code, productName: p.Product_Name }); setModalIsOpen(true); }}>
                          <i className='bi bi-pen'></i>
                        </button>
                        <button className='edit-btn' onClick={() => { setOpenRow(null); handleDelete(p.Product_ID); }}>
                          <i className='bi bi-trash'></i>
                        </button>
                      </div>
                    )}
                  </td>
                  <td>{p.Product_ID}</td>
                  <td>{p.Product_Code}</td>
                  <td>{p.Product_Name}</td>
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
            <div className="header-tittle"><header>Product Master</header></div>
            <div className='container2'>
              <form onSubmit={handleSave}>
                <div className="fields2">
                  <div className="input-field1">
                    <label>Product Code</label>
                    <input type='text' value={productData.productCode} onChange={e => setProductData({ ...productData, productCode: e.target.value })} placeholder='Enter Product Code' required />
                  </div>
                  <div className="input-field1">
                    <label>Product Name</label>
                    <input type='text' value={productData.productName} onChange={e => setProductData({ ...productData, productName: e.target.value })} placeholder='Enter Product Name' required />
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

export default ProductEntry;
