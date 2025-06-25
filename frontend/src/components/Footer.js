import React from "react";
import Logo from "../assets/images/Logo.png";

const Footer = () => {
  const footerStyle = {
    background: "linear-gradient(135deg, #6A0572, #A42CD6)", // Gradient background
    color: "#ffffff",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    textAlign: "left",
  };

  const logoContainerStyle = {
    flex: "1 1 auto",
  };

  const logoStyle = {
    width: "120px",
    height: "auto",
  };

  const columnStyle = {
    flex: "1 1 300px",
    minWidth: "200px",
  };

  const headingStyle = {
    fontSize: "20px",
    marginBottom: "15px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const linkListStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    lineHeight: "2",
  };

  const linkStyle = {
    color: "#FFD700", // Golden for elegance
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.3s",
  };

  const linkHoverStyle = {
    color: "#FFFFFF", // White on hover
  };

  const socialIconsStyle = {
    display: "flex",
    gap: "10px",
  };

  const iconStyle = {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#A42CD6",
    fontSize: "18px",
    cursor: "pointer",
    transition: "transform 0.3s, background-color 0.3s",
  };

  const iconHoverStyle = {
    transform: "scale(1.1)",
    backgroundColor: "#FFD700",
  };

  const separatorStyle = {
    height: "1px",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    margin: "30px 0",
    width: "100%",
  };

  const copyrightStyle = {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginTop: "20px",
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        {/* Logo Section */}
        <div style={logoContainerStyle}>
          <img
            src={Logo} // Replace with your logo URL
            alt="Logo"
            style={logoStyle}
          />
        </div>

        {/* Quick Links Column */}
        <div style={columnStyle}>
          <h3 style={headingStyle}>Quick Links</h3>
          <ul style={linkListStyle}>
            <li>
              <a
                href="#services"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.color = linkHoverStyle.color)}
                onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#contact"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.color = linkHoverStyle.color)}
                onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#privacy"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.color = linkHoverStyle.color)}
                onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Column */}
        <div style={columnStyle}>
          <h3 style={headingStyle}>Follow Us</h3>
          <div style={socialIconsStyle}>
            {["F", "T", "I"].map((icon, index) => (
              <div
                key={index}
                style={iconStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = iconHoverStyle.transform;
                  e.currentTarget.style.backgroundColor =
                    iconHoverStyle.backgroundColor;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.backgroundColor = "#ffffff";
                }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div style={separatorStyle}></div>

      {/* Copyright */}
      <div style={copyrightStyle}>
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
