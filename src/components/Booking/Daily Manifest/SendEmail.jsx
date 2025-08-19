import React, { useState } from 'react'

function SendEmail() {

    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        mobileNo: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:2600/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.text();
                alert(`Success: ${data}`);
            } else {
                const errorText = await response.text();
                alert(`Error: ${errorText}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };


    return (
        <>
            <div className="body">
                <div className="container1">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="fields2">
                            <div className="input-field3">
                                <label htmlFor="">User Name</label>
                                <input type="text" placeholder='User Name' name='userName'
                                    value={formData.userName}
                                    onChange={handleChange} />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Password</label>
                                <input type="password" placeholder='Password' name='password'
                                    value={formData.password}
                                    onChange={handleChange} />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Mobile No</label>
                                <input type="tel" placeholder='Mobile No' name='mobileNo' maxLength={10}
                                    value={formData.mobileNo}
                                    onChange={handleChange} />
                            </div>

                            <div className="input-field3">
                                <label htmlFor="">Email Id</label>
                                <input type="email" placeholder='Email' name='email'
                                    value={formData.email}
                                    onChange={handleChange} />
                            </div>

                            <div className="bottom-buttons" style={{ marginTop: "18px", marginLeft: "25px" }}>
                                <button className="generate-btn" type="submit">send Email</button>
                                <button className="generate-btn" onClick={() => setFormData({ userName: '', password: '', mobileNo: '', email: '' })}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SendEmail;