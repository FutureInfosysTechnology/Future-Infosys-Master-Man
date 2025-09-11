import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { putApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";

const ExcelImport = () => {
  const [excelData, setExcelData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorFileUrl, setErrorFileUrl] = useState(null);
  const fileInputRef = useRef(null);
  const MAX_CALLS = 10;
const headers = ['DocketNo', 'DelvDt', 'DelvTime', 'Origin_Name', 'Destination_Name', 'Status'];
  const formatExcelDateForBackend = (value) => {
    if (!value) return '';
    if (typeof value === 'number') {
      const dateCode = XLSX.SSF.parse_date_code(value);
      if (dateCode) {
        return `${String(dateCode.d).padStart(2,'0')}/${String(dateCode.m).padStart(2,'0')}/${dateCode.y}`;
      }
    }
    if (typeof value === 'string') {
      const parsed = new Date(value);
      if (!isNaN(parsed)) {
        return `${String(parsed.getDate()).padStart(2,'0')}/${String(parsed.getMonth()+1).padStart(2,'0')}/${parsed.getFullYear()}`;
      }
      return value.trim();
    }
    return '';
  };

  const formatTimeForBackend = (value) => {
    if (!value) return '';
    if (typeof value === 'number') {
      const totalMinutes = Math.round(value * 24 * 60);
      const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
      const minutes = String(totalMinutes % 60).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    if (typeof value === 'string') {
      const parts = value.split(':');
      const h = parts[0] ? parts[0].padStart(2,'0') : '00';
      const m = parts[1] ? parts[1].padStart(2,'0') : '00';
      return `${h}:${m}`;
    }
    return '';
  };

  const formatString = (value) => (value === null || value === undefined ? '' : String(value).trim());

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet);

      const mappedData = rawData
        .map(row => ({
          DocketNo: formatString(row['DocketNo'] || row['Docket No']),
          DelvDt: formatExcelDateForBackend(row['DelvDt'] || row['Delv Date']),
          DelvTime: formatTimeForBackend(row['DelvTime'] || row['Delivery Time']),
          Origin_Name: formatString(row['Origin_Name'] || row['Origin']),
          Destination_Name: formatString(row['Destination_Name'] || row['Destination']),
          Status: formatString(row['Status'] || row['Current Status']),
        }))
        .filter(row => row.DocketNo && row.DelvDt && row.Status);

      setExcelData(mappedData);
      setProgress(0);
      setErrorFileUrl(null);
    };
  };

  const showDuplicatePopup = (message) => {
    Swal.fire({
      icon: 'warning',
      title: '⚠️ Duplicate Entry Detected',
      text: message || 'Some rows already exist in the system.',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    });
  };

  const handleUpload = async () => {
    if (excelData.length === 0) {
      Swal.fire('No Data', 'Please select an Excel file first.', 'warning');
      return;
    }

    setUploading(true);
    setProgress(0);
    setErrorFileUrl(null);

    const chunkSize = Math.ceil(excelData.length / MAX_CALLS);
    let successCount = 0;
    let duplicateCount = 0;
    let errorFile = null;

    for (let i = 0; i < MAX_CALLS; i++) {
      const chunk = excelData.slice(i * chunkSize, (i + 1) * chunkSize);
      if (chunk.length === 0) continue;

      try {
        const response = await putApi('/DocketBooking/StatusEntryBulk', { excelData: chunk });

        if (response.errorFileUrl) errorFile = response.errorFileUrl;

        if (response.status === 1) {
          successCount += chunk.length;
        } else if (response.message && response.message.toLowerCase().includes('duplicate')) {
          duplicateCount += chunk.length;
          // showDuplicatePopup(response.message);
          console.warn(`Duplicate entry: ${response.message}`);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: response.message || 'Unknown error occurred',
          });
          console.error(`API responded with error: ${response.message}`);
        }
      } catch (err) {
        console.error(`Chunk ${i + 1} failed with exception:`, err);
      }

      const calculatedProgress = Math.min(100, Math.round(((i + 1) / MAX_CALLS) * 100));
      setProgress(calculatedProgress);
    }

    setUploading(false);
    setErrorFileUrl(errorFile);

    let summaryMessage = '';
    if (successCount > 0) summaryMessage += `✅ ${successCount} rows uploaded successfully.\n`;
    if (duplicateCount > 0) summaryMessage += `⚠️ ${duplicateCount} duplicate rows detected and skipped.\n`;
    if (!summaryMessage) summaryMessage = '❌ All rows failed to upload.';

    Swal.fire(
      'Upload Summary',
      summaryMessage,
      (successCount > 0 || duplicateCount > 0) ? 'success' : 'error'
    );

    setExcelData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([headers.reduce((acc, key) => ({ ...acc, [key]: '' }), {})]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'StatusTemplate.xlsx');
  };
  const handleDownloadErrorFile = () => {
    if (errorFileUrl) {
      const link = document.createElement("a");
      link.href = errorFileUrl;
      link.download = errorFileUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: 'auto' }}>
      <h3>📤 Excel Upload (10 API Calls)</h3>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="form-control mb-3"
      />
      <div className="row" style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px"}}>
         <button
        onClick={handleUpload}
        disabled={uploading || excelData.length === 0}
        className="btn btn-primary col-10 col-md-4"
      >
        {uploading ? 'Uploading...' : 'Start Upload'}
      </button>
        <button onClick={handleDownloadTemplate} 
        className="btn btn-success col-10 col-md-6">
          ⬇️ Download Template
        </button>
      </div>

      {uploading && (
        <div>
          <div style={{ background: '#e0e0e0', borderRadius: '4px', height: '20px' }}>
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: '#4caf50',
                height: '100%',
                borderRadius: '4px',
                transition: 'width 0.5s ease-in-out',
              }}
            />
          </div>
          <p className="text-center mt-2">{progress}% completed</p>
        </div>
      )}

      {errorFileUrl && !uploading && (
        <div className="mt-3 text-center">
          <button onClick={handleDownloadErrorFile} className="btn btn-danger">
            ⬇️ Download Error Log
          </button>
        </div>
      )}
    </div>
  );
};

export default ExcelImport;
