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
    padding: "60px 30px",
    maxWidth: "900px",
    width: "100%",
    textAlign: "center",
  };

  const imageContainerStyle = {
    borderRadius: "50%",
    overflow: "hidden",
    width: "clamp(180px, 40vw, 250px)", // responsive size based on screen width
    height: "clamp(180px, 40vw, 250px)",
    margin: "0 auto 30px auto",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const headingStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#800080",
    marginBottom: "24px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
  };

  const descriptionStyle = {
    fontSize: "20px",
    lineHeight: "2",
    color: "#555",
    margin: "0 auto",
    maxWidth: "700px",
  };

  const dividerStyle = {
    width: "60px",
    height: "5px",
    backgroundColor: "#800080",
    margin: "20px auto",
    borderRadius: "4px",
  };

  return (
    <div id="aboutus" style={containerStyle}>
      <div style={cardStyle}>
        <div style={imageContainerStyle}>
          <img src="/AboutUs.jpg" alt="Founder" style={imageStyle} />
        </div>
        <h2 style={headingStyle}>About Us</h2>
        <div style={dividerStyle}></div>
        <p style={descriptionStyle}>
          Based out of Kolkata, India, Sree Krishna Tarot Reading and Healing
          Services provides the best-in-class services for sustenance of mental
          and spiritual health. Its founder, Ms. Meghna Mondal, has years of
          experience being a Reiki healer. A seasoned Tarot Card Reader and
          social worker, she specializes in empathetic and Reiki-assisted
          healing whilst ensuring world-class professionalism and
          confidentiality. In the rush of the world, embark on your journey to
          structure your spiritual self with Meghna and conquer any challenge
          life throws at you!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
