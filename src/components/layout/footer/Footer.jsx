import React from "react";
import "./style.css";

const Footer = () => {
  return (
    <footer>
      {/* About Us Section */}
      <div className="col col-1">
        <h3>About Us</h3>
        <p>
          Copyright © 2024 Chilli'n Garlic.
          <br /> Sathaphorn Schmidt & Alexander Schmidt
          <br />
          Traditional Thai Restaurant In Rostock Germany.
          <br />
          Arne Nies / Studio panorista / Digital marketing
        </p>
      </div>

      {/* Opening Hours Section */}
      <div className="col">
        <h3>Opening Hours</h3>
        <p>Tuesday to Saturday 16:00 to 22:00</p>
      </div>

      {/* Address Section */}
      <div className="col">
        <h3>Address</h3>
        <ul>
          <li>
            <a
              href="https://maps.app.goo.gl/ju9oWXbtxyNyzuay5?g_st=com.google.maps.preview.copy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chilli’n Garlic-Str. 17 · 18057 Rostock
            </a>
          </li>
          <li>
            <a
              href="https://maps.app.goo.gl/ju9oWXbtxyNyzuay5?g_st=com.google.maps.preview.copy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fritz-Reuter-Str. 17 · 18057 Rostock
            </a>
          </li>
        </ul>
      </div>

      {/* Contact Us Section */}
      <div className="col">
        <h3>Contact Us</h3>
        <ul>
          <li>
            <a
              href="https://www.instagram.com/satha.laphrom/profilecard/?igsh=bTZtMzcwYmUzdzFr"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/share/qcKac8iyFdT5vuAz/?mibextid=LQQJ4d"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </li>
          <li>
            <a
              href="https://rostock.catering/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Rostock.Catering
            </a>
          </li>
          <li>
            <a
              href="https://fritzreuterstuben-rostock.de/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fritzreuterstuben-Rostock
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
