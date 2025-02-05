import React, { useState } from "react";
import ThemeToggle from "../ThemeToggle";
import "./navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  return (
    <nav>
      {/* Logo */}
      <div className="logo">
        <a href="/">
          <h2>Chilli'n Garlic</h2>
        </a>
      </div>

      {/* Menu Links */}
      <ul className={isMenuOpen ? "open" : ""}>
        <li>
          <a href="/#menu-sections">MENU</a>
        </li>
        <li>
          <a href="/#dessert-sections">DESSERT & BEVERAGES</a>
        </li>
        <li>
          <a href="/#offers-sections">OFFERS</a>
        </li>
        <li>
          <a href="/#aboutus-sections">ABOUT US</a>
        </li>
        <li>
          <a href="/#reservation">RESERVATIONS</a>
        </li>
      </ul>

      {/* Mobile Menu Icon */}
      <div className="menu-icon" onClick={toggleMenu}>
        <i className="fa fa-bars" aria-hidden="true"></i>
      </div>

      {/* Theme Toggle */}
      {/* <ThemeToggle /> */}
    </nav>
  );
};

export default Navbar;
