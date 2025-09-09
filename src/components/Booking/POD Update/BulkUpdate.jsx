import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { postApi,putApi } from "../../Admin Master/Area Control/Zonemaster/ServicesApi";

const BulkUpdate = () => {
  const [excelData, setExcelData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorFileUrl, setErrorFileUrl] = useState(null);
  const fileInputRef = useRef(null);
  const MAX_CALLS = 10;

  // Convert Excel date or string to dd/MM/yyyy
  const formatExcelDate = (value) => {
    if (!value) return '';
    if (typeof value === 'number') {
      const dateCode = XLSX.SSF.parse_date_code(value);
      if (dateCode) {
        return `${String(dateCode.d).padStart(2, '0')}/${String(dateCode.m).padStart(2, '0')}/${dateCode.y}`;
      }
    }
    if (typeof value === 'string') return value.trim();
    return '';
  };

  const formatString = (value) => (value === null || value === undefined ? '' : String(value).trim());

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const bstr = evt.target?.result;
    const workbook = XLSX.read(bstr, { type: 'binary' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    // Map and validate data
    const formattedData = rawData.map((row, index) => {
      const LR_NO = row.LRNO ? String(row.LRNO).trim() : '';
      const Status = row.Status ? String(row.Status).trim() : '';
      const DelvDt = row.DelvDt ? String(row.DelvDt).trim() : '';

      const missingFields = [];
      if (!LR_NO) missingFields.push('LR_NO');
      if (!Status) missingFields.push('Status');
      if (!DelvDt) missingFields.push('DelvDt');

      return {
        ...row,
        LR_NO,
        Status,
        DelvDt,
        _rowIndex: index + 2, // Excel row number
        missingFields
      };
    });

    // Split valid and invalid rows
    const invalidRows = formattedData.filter(r => r.missingFields.length > 0);
    const validRows = formattedData.filter(r => r.missingFields.length === 0);

    if (invalidRows.length > 0) {
      Swal.fire(
        'Validation Error',
        `❌ Rows with missing mandatory fields:\n${invalidRows
          .map(r => `Row ${r._rowIndex}: ${r.missingFields.join(', ')}`)
          .join('\n')}`,
        'error'
      );
    }

    setExcelData(validRows); // only send valid rows
    setProgress(0);
    setErrorFileUrl(null);
  };

  reader.readAsBinaryString(file);
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
  let errorFile = null;

  for (let i = 0; i < MAX_CALLS; i++) {
    const chunk = excelData.slice(i * chunkSize, (i + 1) * chunkSize);
    if (chunk.length === 0) continue;

    try {
      const response = await putApi('DocketBooking/DeliveryUpfromexcel', { excelData: chunk });

      if (response.errorFileUrl) errorFile = response.errorFileUrl;
      if (response.status === 1) successCount += chunk.length;
    } catch (err) {
      console.error(`Chunk ${i + 1} failed`, err);
    }

    setProgress(Math.min(100, ((i + 1) / MAX_CALLS) * 100));
  }

  setUploading(false);
  setErrorFileUrl(errorFile);

  Swal.fire(
    successCount > 0 ? 'Upload Complete' : 'Upload Failed',
    successCount > 0
      ? `✅ ${successCount} of ${excelData.length} rows uploaded.` +
        (errorFile ? " ⚠️ Some errors occurred, download error log." : "")
      : '❌ All rows failed to upload.',
    successCount > 0 ? 'success' : 'error'
  );

  setExcelData([]);
  if (fileInputRef.current) fileInputRef.current.value = '';
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
      <button
        onClick={handleUpload}
        disabled={uploading || excelData.length === 0}
        className="btn btn-primary mb-3"
      >
        {uploading ? 'Uploading...' : 'Start Upload'}
      </button>

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

export default BulkUpdate;
