import React, { useState } from 'react';



function BulkUpdate() {

    const [pdfFile, setPdfFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Check if the uploaded file is a PDF
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
            console.log('PDF file uploaded:', file.name);
        } else {
            alert('Please upload a valid PDF file.');
            setPdfFile(null);
        }
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (pdfFile) {
            // Process the uploaded PDF file (e.g., send it to a server)
            console.log('Submitting PDF:', pdfFile);
        }
    };


    return (
        <>

            <div className="container1">
                <form action="" onSubmit={handleSubmit}>
                    <div className="fields2">
                        <div className="input-field3">
                            <label htmlFor=""> Status</label>
                            <select value="">
                                <option value="">Arrived</option>
                                <option value="">Schedule</option>
                                <option value="">Dispatch</option>
                            </select>
                        </div>

                        <div className="input-field3">
                            <label htmlFor="">Import</label>
                            <input type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                style={{ paddingTop: '5px' }} />
                        </div>

                        <div className="input-field3" style={{ marginRight: '30px', marginTop:"8px" }}>
                            <label htmlFor=""></label>
                            <button type="submit" disabled={!pdfFile} className='generate-btn' style={{fontSize:"12px"}}>
                                Upload PDF
                            </button>
                        </div>

                        <div className="bottom-buttons" style={{ marginTop: '17px' }}>
                        <button className='ok-btn'>Download</button>
                        <button className='ok-btn'>Error-Log</button>
                    </div>
                    </div>

                </form>
            </div>

        </>
    );
};

export default BulkUpdate;