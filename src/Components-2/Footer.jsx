import React from "react";
import './footer.css';



function Footer() {
    return (
        <footer id="footer" className="footer">
            <div className="copyright">
                &copy; Copyright{''}
                <strong>
                    <span style={{marginRight:"1px", marginLeft:"3px", color:"#4FD1C5"}}>Future Infosys Technology </span>
                </strong>
                 .All Rights Reserved 
            </div>
            {/* <div className="credits">
                Designed by
                <a href="#" style={{color:"#4FD1C5", marginLeft:"3px"}}><strong> Vivek Singh</strong></a>
            </div> */}
        </footer>
    )
}

export default Footer;