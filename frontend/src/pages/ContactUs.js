import React from "react";

const ContactUs = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #FFC0CB, #800080)",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    padding: "30px",
    maxWidth: "600px",
    width: "90%",
    textAlign: "left",
  };

  const headingStyle = {
    fontSize: "24px",
    marginBottom: "20px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#800080",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const inputStyle = {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  };

  const textAreaStyle = {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    width: "100%",
    height: "100px",
    resize: "none",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #800080, #FFC0CB)",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "center",
    transition: "opacity 0.3s",
  };

  const buttonHoverStyle = {
    opacity: "0.8",
  };

  const infoSectionStyle = {
    marginTop: "30px",
    textAlign: "center",
  };

  const infoHeadingStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  const infoTextStyle = {
    fontSize: "16px",
    lineHeight: "1.6",
  };

  return (
    <div id="contactus" style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Contact Us</h2>
        <form style={formStyle}>
          <input
            type="text"
            placeholder="Full Name"
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email Address"
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Phone Number"
            style={inputStyle}
          />
          <textarea
            placeholder="Your Message"
            style={textAreaStyle}
          ></textarea>
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.opacity = buttonHoverStyle.opacity)}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
          >
            Send Message
          </button>
        </form>
      </div>
      <div style={infoSectionStyle}>
        <h3 style={infoHeadingStyle}>Our Contact Details</h3>
        <p style={infoTextStyle}>
          📍 Address: 1/1 a,Bombai Bagan Road,Roydighi,Kolkata-700061.        </p>
        <p style={infoTextStyle}>📞 Phone: +91 8910809985</p>
        <p style={infoTextStyle}>📧 Email: panchi1094@gmail.com</p>
      </div>
    </div>
  );
};

export default ContactUs;
