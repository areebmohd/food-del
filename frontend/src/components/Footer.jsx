import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer1">
        <div className="sec1">
          <h2>ABOUT US</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
            excepturi cum perferendis distinctio sed dolorum. Distinctio dolore
            velit minima saepe quod,dolor sit amet, consectetur adipisicing
            elit. Dolore excepturi cum perferendis distinctio sed dolorum.
            Distinctio dolore quaerat voluptas nemo soluta.
          </p>
        </div>
        <div className="sec3">
          <h2>GET IN TOUCH</h2>
          <p>+ 91 728-536-8790</p>
          <p>contact@fooddel.com</p>
        </div>
        <div className="sec2">
          <h2>LOCATION</h2>
          <ul>
            <li>New Delhi</li>
            <li>India</li>
          </ul>
        </div>
      </div>
      <div className="footer2">
        <p>Copyright 2025 © fooddel.com - All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
