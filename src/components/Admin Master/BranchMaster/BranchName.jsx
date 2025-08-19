import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../../Tabs/tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import Modal from 'react-modal';
import { deleteApi, getApi, postApi } from "../Area Control/Zonemaster/ServicesApi";



function BranchName() {

    const [getBranchData, setGetBranchData] = useState([]);        // to get Branch Data
    const [getBankName, setGetBankName] = useState([]);            // To Get Bank Name Data
    const [error, setError] = useState(null);
    const [state, setState] = useState([]);                        // to get state Data
    const [getCity, setGetCity] = useState([]);                    //to get City Data
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [branchData, setBranchData] = useState({
        branchCode: '',
        branchName: '',
        manifestNo: '',
        invoiceNo: '',
        runsheetNo: '',
        branchAdd1: '',
        branchPIN: '',
        email: '',
        website: '',
        gstNo: '',
        hsnNo: '',
        cityCode: '',
        stateCode: '',
        bankCode: '',
        bankName: '',
        ifscCode: '',
        mobileNo: '',
        accountNo: '',
        bankBranch: '',
    });                                                            // to add Branch Data
    const [searchQuery, setSearchQuery] = useState('');


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


    const fetchBranchData = async () => {
        try {
            const response = await getApi('/Master/getBranch');
            setGetBranchData(Array.isArray(response.Data) ? response.Data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err);
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchBranchData();
            await fetchData('/Master/GetState', setState);
            await fetchData('/Master/getdomestic', setGetCity);
            await fetchData('/Master/Getbank', setGetBankName);
        };

        fetchInitialData();
    }, []);


    const handleUpdate = async (e) => {
        e.preventDefault();
        const requestBody = {
            Branch_Code: branchData.branchCode.trim(),
            Branch_Name: branchData.branchName,
            InvoiceNo: branchData.invoiceNo,
            ManifestNo: branchData.manifestNo,
            RunsheetNo: branchData.runsheetNo,
            Branch_Add1: branchData.branchAdd1,
            Branch_PIN: branchData.branchPIN,
            Email: branchData.email,
            Website: branchData.website,
            GSTNo: branchData.gstNo,
            HSNNo: branchData.hsnNo,
            City_Code: branchData.cityCode,
            State_Code: branchData.stateCode,
            Bank_Code: branchData.bankCode,
            AccountNo: branchData.accountNo,
            Bank_Name: branchData.bankName,
            IFSC_Code: branchData.ifscCode,
            MobileNo: branchData.mobileNo,
            Bank_Branch: branchData.bankBranch
        }

        try {
            const response = await postApi('/Master/updateBranch', requestBody, 'POST');
            if (response.status === 1) {
                setGetBranchData(getBranchData.map((branch) => branch.Branch_Code === branchData.branchCode ? response.Data : branch));
                setBranchData({
                    branchCode: '',
                    branchName: '',
                    invoiceNo: '',
                    manifestNo: '',
                    runsheetNo: '',
                    branchAdd1: '',
                    branchPIN: '',
                    email: '',
                    website: '',
                    gstNo: '',
                    hsnNo: '',
                    cityCode: '',
                    stateCode: '',
                    bankCode: '',
                    accountNo: '',
                    bankName: "",
                    ifscCode: '',
                    mobileNo: '',
                    bankBranch: ''
                });
                Swal.fire('Updated!', response.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchBranchData();
            } else {
                Swal.fire('Error!', response.message || 'Failed to update the Branch.', 'error');
            }
        } catch (error) {
            console.error('Error updating branch:', error);
            Swal.fire('Error', 'Failed to update branch data', 'error');
        }
    }

    const handleSaveBranchName = async (e) => {
        e.preventDefault();

        const requestBody = {
            branchCode: branchData.branchCode,
            branchName: branchData.branchName,
            invoiceNo: branchData.invoiceNo,
            manifestNo: branchData.manifestNo,
            runsheetNo: branchData.runsheetNo,
            branchAdd1: branchData.branchAdd1,
            branchPIN: branchData.branchPIN,
            email: branchData.email,
            website: branchData.website,
            gstNo: branchData.gstNo,
            hsnNo: branchData.hsnNo,
            cityCode: branchData.cityCode,
            stateCode: branchData.stateCode,
            bankCode: branchData.bankCode,
            bankName: branchData.bankName,
            ifscCode: branchData.ifscCode,
            mobileNo: branchData.mobileNo,
            bankBranch: branchData.bankBranch,
            accountNo: branchData.accountNo
        }

        try {
            const saveResponse = await postApi('/Master/addBranch', requestBody, 'POST');
            if (saveResponse.status === 1) {
                setBranchData({
                    branchCode: '',
                    branchName: '',
                    invoiceNo: '',
                    manifestNo: '',
                    runsheetNo: '',
                    branchAdd1: '',
                    branchPIN: '',
                    email: '',
                    website: '',
                    gstNo: '',
                    hsnNo: '',
                    cityCode: '',
                    stateCode: '',
                    bankCode: '',
                    bankName: '',
                    ifscCode: '',
                    mobileNo: '',
                    bankBranch: '',
                    accountNo: ''
                });
                Swal.fire('Saved!', saveResponse.message || 'Your changes have been saved.', 'success');
                setModalIsOpen(false);
                await fetchBranchData();
            } else {
                Swal.fire('Error!', saveResponse.message || 'Your changes have been saved.', 'error');
            }
        } catch (err) {
            console.error('Save Error:', err);
            Swal.fire('Error', 'Failed to Save Branch Data', 'error');
        }
    };


    const handleDeleteBranch = async (Branch_Code) => {
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
                await deleteApi(`/Master/deleteBranch?Branch_Code=${Branch_Code}`);
                setGetBranchData(getBranchData.filter((branch) => branch.Branch_Code !== Branch_Code));
                Swal.fire('Deleted!', 'Branch Name has been deleted.', 'success');
                await fetchBranchData();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            Swal.fire('Error', 'Failed to delete Branch Name', 'error');
        }
    };


    const filteredgetBranchData = getBranchData.filter((branch) =>
        (branch && branch.Branch_Code && branch.Branch_Code.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (branch && branch.Branch_Name && branch.Branch_Name.toLowerCase().includes(searchQuery.toLowerCase()) || '')
    );


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredgetBranchData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredgetBranchData.length / rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleGenerateCode = () => {
        const newCode = `${Math.floor(Math.random() * 1000)}`;
        setBranchData({ ...branchData, branchCode: newCode });
    };


    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getBranchData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'getBranchData');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'getBranchData.xlsx');
    };

    const handleExportPDF = () => {
        const pdfData = getBranchData.map(({ id, code, name }) =>
            [id, code, name]);

        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text('Zone Data', 14, 20);

        const headers = [['Sr.No', 'Zone Code', 'Zone Name']];

        pdf.autoTable({
            head: headers,
            body: pdfData,
            startY: 30,
            theme: 'grid'
        });


        pdf.save('Zone.pdf');
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
                                setModalIsOpen(true); setIsEditMode(false);
                                setBranchData({
                                    branchCode: '', branchName: '', manifestNo: '', runsheetNo: '', invoiceNo: '',
                                    branchAdd1: '', branchPIN: '', email: '', website: '', gstNo: '', hsnNo: '', cityCode: '',
                                    stateCode: '', bankName: '', bankCode: '', bankBranch: '', accountNo: '', ifscCode: '',
                                    mobileNo: ''
                                })
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
                        <table className='table table-bordered table-sm'>
                            <thead className='table-sm'>
                                <tr>
                                    <th scope="col">Sr.No</th>
                                    <th scope="col">Branch_Code</th>
                                    <th scope="col">Branch_Name</th>
                                    <th scope="col">Invoice_No</th>
                                    <th scope="col">Manifest_No</th>
                                    <th scope="col">Runsheet_No</th>
                                    <th scope="col">Branch_Add</th>
                                    <th scope="col">Branch_Pin</th>
                                    <th scope="col">HSN_No</th>
                                    <th scope="col">GST_No</th>
                                    <th scope="col">Bank_Name</th>
                                    <th scope="col">State_Name</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>

                                {currentRows.map((branch, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{branch.Branch_Code}</td>
                                        <td>{branch.Branch_Name}</td>
                                        <td>{branch.InvoiceNO}</td>
                                        <td>{branch.ManifestNo}</td>
                                        <td>{branch.RunsheetNo}</td>
                                        <td>{branch.Branch_Add1}</td>
                                        <td>{branch.Branch_PIN}</td>
                                        <td>{branch.HSNNo}</td>
                                        <td>{branch.GSTNo}</td>
                                        <td>{branch.Bank_Name}</td>
                                        <td>{branch.State_Name}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center' }}>
                                                <button className='edit-btn' onClick={() => {
                                                    setIsEditMode(true);
                                                    setBranchData({
                                                        branchCode: branch.Branch_Code,
                                                        branchName: branch.Branch_Name,
                                                        invoiceNo: branch.InvoiceNO,
                                                        manifestNo: branch.ManifestNo,
                                                        runsheetNo: branch.RunsheetNo,
                                                        branchAdd1: branch.Branch_Add1,
                                                        branchPIN: branch.Branch_PIN,
                                                        hsnNo: branch.HSNNo,
                                                        gstNo: branch.GSTNo,
                                                        bankCode: branch.Bank_Name,
                                                        email: branch.Email,
                                                        website: branch.Website,
                                                        mobileNo: branch.MobileNo,
                                                        stateCode: branch.State_Code,
                                                        accountNo: branch.AccountNo,
                                                        ifscCode: branch.IFSC_Code,
                                                        bankBranch: branch.Bank_Branch
                                                    });
                                                    setModalIsOpen(true);
                                                }}>
                                                    <i className='bi bi-pen'></i>
                                                </button>
                                                <button className='edit-btn' onClick={() => handleDeleteBranch(branch.Branch_Code)}>
                                                    <i className='bi bi-trash'></i></button>
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
                        className="custom-modal-branchName" contentLabel="Modal">
                        <div className="custom-modal-content">
                            <div className="header-tittle">
                                <header>Branch Master</header>
                            </div>

                            <div className='container2'>
                                <form onSubmit={handleSaveBranchName}>
                                    <div className="fields2">

                                        <div className="input-field3">
                                            <label htmlFor="">Code </label>
                                            <input
                                                type="text"
                                                placeholder="Enter Code/ generate code"
                                                value={branchData.branchCode}
                                                onChange={(e) => setBranchData({ ...branchData, branchCode: e.target.value })}
                                                readOnly={isEditMode} />
                                        </div>

                                        {/* {!isEditMode && (
                                            <div className="input-field3">
                                                <button className="ok-btn" style={{ marginTop: "18px", height: "35px" }}
                                                    onClick={handleGenerateCode}>Generate Code</button>
                                            </div>
                                        )} */}

                                        <div className="input-field3">
                                            <label htmlFor="">Branch Name</label>
                                            <input type="text" value={branchData.branchName}
                                                onChange={(e) => setBranchData({ ...branchData, branchName: e.target.value })}
                                                placeholder="Enter Name" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Start Manifest No.</label>
                                            <input type="tel" placeholder="Enter Start Manifest No"
                                                value={branchData.manifestNo}
                                                onChange={(e) => setBranchData({ ...branchData, manifestNo: e.target.value })} required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Start Bill No.</label>
                                            <input type="tel" value={branchData.runsheetNo}
                                                onChange={(e) => setBranchData({ ...branchData, runsheetNo: e.target.value })}
                                                placeholder="Enter Start Bill No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Start Invoice No.</label>
                                            <input type="tel" placeholder="Enter Start Invoice No"
                                                value={branchData.invoiceNo}
                                                onChange={(e) => setBranchData({ ...branchData, invoiceNo: e.target.value })} required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Address</label>
                                            <input type="text" placeholder="Enter Address"
                                                value={branchData.branchAdd1}
                                                onChange={(e) => setBranchData({ ...branchData, branchAdd1: e.target.value })} required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Pin code</label>
                                            <input type="tel" id="pincode" name="pincode" maxLength="6"
                                                placeholder="Enter Pin Code" value={branchData.branchPIN}
                                                onChange={(e) => setBranchData({ ...branchData, branchPIN: e.target.value })} required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">E-mail</label>
                                            <input type="email" placeholder="Enter Email"
                                                value={branchData.email}
                                                onChange={(e) => setBranchData({ ...branchData, email: e.target.value })} required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Website</label>
                                            <input type="text" value={branchData.website}
                                                onChange={(e) => setBranchData({ ...branchData, website: e.target.value })}
                                                placeholder="Enter Website" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">GST No</label>
                                            <input type="text" value={branchData.gstNo}
                                                onChange={(e) => setBranchData({ ...branchData, gstNo: e.target.value })}
                                                placeholder="Enter GST No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">HSN No</label>
                                            <input type="text" value={branchData.hsnNo}
                                                onChange={(e) => setBranchData({ ...branchData, hsnNo: e.target.value })}
                                                placeholder="Enter HSN No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">City Name</label>
                                            <select value={branchData.cityCode}
                                                onChange={(e) => setBranchData({ ...branchData, cityCode: e.target.value })} required>
                                                <option value="" disabled >Select City</option>
                                                {getCity.map((city, index) => (
                                                    <option value={city.City_Code} key={index}>{city.City_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">State Name</label>
                                            <select value={branchData.stateCode} required
                                                onChange={(e) => setBranchData({ ...branchData, stateCode: e.target.value })}>
                                                <option value="" disabled >Select state</option>
                                                {state.map((state, index) => (
                                                    <option value={state.State_Code} key={index}>{state.State_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Bank Name</label>
                                            <select required
                                                value={branchData.bankCode}
                                                onChange={(e) => setBranchData({ ...branchData, bankCode: e.target.value })}>
                                                <option value="" disabled>Select Bank Name</option>
                                                {getBankName.map((bank, index) => (
                                                    <option key={index} value={bank.Bank_Code}>{bank.Bank_Name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">AC/No</label>
                                            <input type="tel" value={branchData.accountNo}
                                                onChange={(e) => setBranchData({ ...branchData, accountNo: e.target.value })}
                                                placeholder="Enter Account No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">IFSC</label>
                                            <input type="text" value={branchData.ifscCode}
                                                onChange={(e) => setBranchData({ ...branchData, ifscCode: e.target.value })}
                                                placeholder="Enter IFSC" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Mobile No</label>
                                            <input type="tel" maxLength="10" id="mobile"
                                                value={branchData.mobileNo}
                                                onChange={(e) => setBranchData({ ...branchData, mobileNo: e.target.value })}
                                                name="mobile" pattern="[0-9]{10}" placeholder="Enter Mobile No" required />
                                        </div>

                                        <div className="input-field3">
                                            <label htmlFor="">Branch Location</label>
                                            <input type="text" placeholder="Enter Branch Location"
                                                value={branchData.bankBranch}
                                                onChange={(e) => setBranchData({ ...branchData, bankBranch: e.target.value })} required />
                                        </div>

                                    </div>

                                    <div className='bottom-buttons'>
                                        {!isEditMode && (<button type='submit' className='ok-btn'>Submit</button>)}
                                        {isEditMode && (<button type='button' onClick={handleUpdate} className='ok-btn'>Update</button>)}
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


export default BranchName;