import React, { useState } from "react";
import img1 from '../../Assets/Images/person.png';
import Footer from "../Footer";
import Header from "./Header";
import Sidebar1 from "../Sidebar1";



function MyProfile() {

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        email: '',
        mobile: '',
        address: '',
        nationality: '',
        gender: '',
        language: '',
        dob: '',
        twitter: '',
        linkedIn: '',
        facebook: '',
        google: '',
        company: '',
        position: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        console.log(formData);
        setIsEditing(false);
    };

    return (
        <>
            <Header />
            <Sidebar1 />
            <div className="main-body" id="main-body">
                <div className="body">
                    <div className="container" style={{width:"900px"}}>
                        <div className="box1">
                            <div className="upper-box">
                                <img className="profile-img" src={img1} alt="" />
                                <i className="bi bi-pencil-square" onClick={handleEdit}></i>
                            </div>

                            <form action="">
                                <div className="fields2">
                                    <div className="input-field">
                                        <label htmlFor="">First Name</label>
                                        <input name="firstName"
                                            placeholder="Enter your First Name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="">Last Name</label>
                                        <input name="lastName"
                                            placeholder="Enter your Last Name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Password</label>
                                        <input type="password" name="password"
                                            placeholder="Enter your Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                        {/* <a href="" style={{ marginTop: "-34px", marginLeft: "0px" }}>
                                            <label htmlFor="" style={{ color: "blue" }}>CHANGE PASSWORD</label>
                                        </a> */}
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Email</label>
                                        <input name="email"
                                            placeholder="Enter your Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Mobile No</label>
                                        <input type="tel" name="mobile"
                                            maxLength="10"
                                            pattern="[0-9]{10}"
                                            placeholder="Mobile No"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Address</label>
                                        <input type="text" name="address"
                                            placeholder="Enter your Address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Nationality</label>
                                        <select name="nationality"
                                            value={formData.nationality}
                                            onChange={handleChange}
                                            disabled={!isEditing}>
                                            <option disabled value="">Indian</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="box2">
                            <div className="bottom-buttons">
                                {isEditing ? (
                                    <button className="ok-btn" onClick={handleSave}>
                                        <i className="bi bi-check" style={{ marginRight: "5px" }}></i>Save
                                    </button>
                                ) : (
                                    <button className="ok-btn" onClick={handleEdit}>
                                        <i className="bi bi-pen" style={{ marginRight: "5px" }}></i>Edit
                                    </button>
                                )}
                            </div>

                            <form action="">
                                <div className="fields2">
                                    <div className="input-field1">
                                        <label htmlFor="">Gender</label>
                                        <select name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            disabled={!isEditing}>
                                            <option disabled value="">Select Gender</option>
                                            <option value="">Male</option>
                                            <option value="">Female</option>
                                            <option value="">Other</option>
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Language</label>
                                        <select name="language"
                                            value={formData.language}
                                            onChange={handleChange}
                                            disabled={!isEditing}>
                                            <option disabled value="">Select Language</option>
                                            <option value="">Hindi</option>
                                            <option value="">English</option>
                                            <option value="">Marathi</option>
                                        </select>
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Date Of Birth</label>
                                        <input type="date" name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Twitter</label>
                                        <input type="text" name="twitter"
                                            placeholder="Enter Twitter"
                                            value={formData.twitter}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Linked In</label>
                                        <input type="text" name="linkedIn"
                                            placeholder="Enter Linked In"
                                            value={formData.linkedIn}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Facebook</label>
                                        <input type="text" name="facebook"
                                            placeholder="Enter Facebook"
                                            value={formData.facebook}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Google</label>
                                        <input type="text" name="google"
                                            placeholder="Enter Google"
                                            value={formData.google}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Company</label>
                                        <input type="text" name="company"
                                            placeholder="Enter Company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>

                                    <div className="input-field1">
                                        <label htmlFor="">Position</label>
                                        <input type="text" name="position"
                                            placeholder="Enter Position"
                                            value={formData.position}
                                            onChange={handleChange}
                                            disabled={!isEditing} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default MyProfile;