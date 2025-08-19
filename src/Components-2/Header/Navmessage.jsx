import react from 'react';
// import img1 from '../Asset/images/001.jpg';
// import img2 from '../Asset/images/002.jpg';
import '../Dashboard/Mainstyle.css';
import './nav.css';


function Navmessage(){
    return(
        <li className="nav-item dropdown">
            <a href="#" className="nav-link nav-icon" data-bs-toggle="dropdown">
                <i className="bi bi-chat-left-text"></i>
                <span className="badge bg-primary badge-number">3</span>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications" style={{marginTop:"30px", padding:"20px"}}>
                <li className="dropdown-header">you have 4 new notifications
                    <a href="">
                        <span className="badge rounded-pill bg-primary p-2 ms-2">view all</span>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="message-item">
                    <a href="">
                        <img src="" alt="" className='rounded-circle' />
                        <div>
                            <h4>Maria Hudson</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, veritatis.</p>
                            <p>4 hrs. ago</p>
                        </div>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="message-item">
                    <a href="">
                        <img src="" alt="" className='rounded-circle'/>
                        <div>
                            <h4>Anna Nelson</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, mollitia.</p>
                            <p>6 hrs. ago</p>
                        </div>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="message-item">
                    <a href="">
                        <img src="" alt="" className='rounded-circle'/>
                        <div>
                            <h4>Anna Nelson</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, mollitia.</p>
                            <p>6 hrs. ago</p>
                        </div>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                    <a href="">
                        <img src="" alt="" className='rounded-circle'/>
                        <div>
                            <h4>Anna Nelson</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, mollitia.</p>
                            <p>6 hrs. ago</p>
                        </div>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li className="dropdown-footer">
                    <a href="">show all Messages</a>
                </li>

            </ul>
        </li>
    )
}

export default Navmessage;