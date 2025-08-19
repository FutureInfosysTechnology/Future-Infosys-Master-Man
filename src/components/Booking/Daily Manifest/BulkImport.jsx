import React from "react";



function BulkImport (){

    return (
        <>
            <div className="container1">
                <form action="">
                    <div className="fields2">
                        <div className="input-field3">
                            <label htmlFor="">Import</label>
                            <input style={{paddingTop:"5px"}} type="file" placeholder="choose file" />
                        </div>

                        <div className="input-field3">
                            <label htmlFor="" style={{marginBottom:"8px"}}></label>
                            <button className="generate-btn">OK</button>
                        </div>

                        <div className="input-field3">
                            <label htmlFor=""></label>
                        </div>

                        <div className="input-field3">
                            <label htmlFor="" style={{marginBottom:"8px"}}></label>
                            <button className="generate-btn" style={{padding:"5px", width:"100%"}}>Download Sample</button>
                        </div>

                        <div className="input-field3">
                            <label htmlFor="" style={{marginBottom:"8px"}}></label>
                            <button className="generate-btn" style={{width:"100%"}}>Error Log</button>
                        </div>
                    </div>

                </form>
            </div>
        </>
    );
};

export default BulkImport;