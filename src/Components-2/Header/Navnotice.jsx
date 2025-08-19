import React from "react";
import '../Dashboard/Mainstyle.css';
import './nav.css';



function Navnotice(){
    return(
        <li className="nav-item dropdown">
            <a href="#" className="nav-link nav-icon" data-bs-toggle="dropdown">
                <i className="bi bi-bell"></i>
                <span className="badge bg-primary badge-number">4</span>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications" style={{marginTop:"30px"}}>
                <li className="dropdown-header">you have 4 new notifications
                    <a href="">
                        <span className="badge rounded-pill bg-primary p-2 ms-2">view all</span>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="notification-item">
                    <i className="bi bi-exclamation-circle text-warning"></i>
                    <div>
                        <h4>Lorem ipsum dolor sit amet.</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, atque.</p>
                        <p>30 min ago</p>
                    </div>
                </li>

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="notification-item">
                    <i className="bi bi-x-circle text-danger"></i>
                    <div>
                        <h4>Lorem ipsum dolor sit amet.</h4>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda, recusandae.</p>
                        <p>1 hour ago</p>
                    </div>
                </li>

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="notification-item">
                    <i className="bi bi-check-circle text-success"></i>
                    <div>
                        <h4>Lorem ipsum dolor sit amet.</h4>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum, repudiandae!</p>
                        <p>2 hrs ago</p>
                    </div>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                    <i className="bi bi-info-circle text-primary"></i>
                    <div>
                        <h4>Lorem ipsum dolor sit amet.</h4>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum, repudiandae!</p>
                        <p>4 hrs ago</p>
                    </div>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li className="dropdown-footer">
                    <a href="">show all notifications</a>
                </li>

            </ul>
        </li>
    )
}

export default Navnotice;