import React from 'react'

const DocketPrint4 = () => {
  return (
    <div className="container1">
            <form action="">
                <div className="fields2">
                    <div className="input-field3">
                        <label htmlFor="">From</label>
                        <input type="text" placeholder='Enter From' />
                    </div>

                    <div className="input-field3">
                        <label htmlFor="">To</label>
                        <input type="text" placeholder='Enter To' />
                    </div>

                    <div className="input-field3">
                        <label htmlFor="">Date</label>
                        <input type="date" placeholder='Enter Date' />
                    </div>

                    <div className="bottom-buttons" style={{ marginTop: "18px", marginLeft: "25px" }}>
                        <button className='ok-btn'>Submit</button>
                        <button className='ok-btn'>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
  )
}

export default DocketPrint4
