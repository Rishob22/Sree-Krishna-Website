import React from "react";

const AboutUs = () => {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #FFC0CB, #800080)",
    fontFamily: "'Arial', sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    padding: "40px",
    maxWidth: "700px",
    width: "100%",
    textAlign: "center",
  };

  const imageContainerStyle = {
    borderRadius: "50%",
    overflow: "hidden",
    width: "120px",
    height: "120px",
    margin: "0 auto 20px auto", // Center the image
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const headingStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#800080",
    marginBottom: "20px",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
  };

  const descriptionStyle = {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#555",
    margin: "0 auto",
    maxWidth: "600px",
  };

  const dividerStyle = {
    width: "50px",
    height: "4px",
    backgroundColor: "#800080",
    margin: "20px auto",
    borderRadius: "4px",
  };

  return (
    <div id="aboutus" style={containerStyle}>
      <div style={cardStyle}>
        <div style={imageContainerStyle}>
          <img
            src="https://via.placeholder.com/150" // Replace with the founder's image URL
            alt="Founder"
            style={imageStyle}
          />
        </div>
        <h2 style={headingStyle}>About Us</h2>
        <div style={dividerStyle}></div>
        <p style={descriptionStyle}>
          Welcome to our platform! Founded with a passion for excellence and a
          commitment to quality, we aim to bring the best to our customers. Our
          team, led by a visionary founder, works tirelessly to innovate and
          create a remarkable experience. Join us as we continue to grow and make
          a difference in the world!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
