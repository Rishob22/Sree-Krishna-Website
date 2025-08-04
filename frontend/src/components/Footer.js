import React from "react";
import Logo from "../assets/images/Logo.png";

const Footer = () => {
  const arialFont = { fontFamily: "'Arial', sans-serif" };

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #6A0572, #A42CD6)",
        padding: "40px 20px",
        color: "#fff",
        ...arialFont,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          ...arialFont,
        }}
      >
        {/* Logo Section */}
        <div style={{ flex: "1 1 250px", marginBottom: "20px" }}>
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: "120px",
              height: "auto",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Quick Links */}
        <div style={{ flex: "1 1 250px", marginBottom: "20px" }}>
          <h5
            style={{
              ...arialFont,
              fontWeight: "bold",
              marginBottom: "16px",
              textTransform: "uppercase",
              fontSize: "18px",
            }}
          >
            Quick Links
          </h5>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li style={{ marginBottom: "8px" }}>
              <a
                href="#services"
                style={{
                  ...arialFont,
                  color: "#FFD700",
                  textDecoration: "none",
                }}
              >
                Services
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                href="#contact"
                style={{
                  ...arialFont,
                  color: "#FFD700",
                  textDecoration: "none",
                }}
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#privacy"
                style={{
                  ...arialFont,
                  color: "#FFD700",
                  textDecoration: "none",
                }}
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div style={{ flex: "1 1 250px", marginBottom: "20px" }}>
          <h5
            style={{
              ...arialFont,
              fontWeight: "bold",
              marginBottom: "16px",
              textTransform: "uppercase",
              fontSize: "18px",
            }}
          >
            Follow Us
          </h5>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              {
                href: "https://www.facebook.com/DivineTarotMediumHealerMeghna/",
                src: "/facebook.webp",
                alt: "Facebook",
              },
              {
                href: "https://www.instagram.com/divinetarotmediumhealermeghna/",
                src: "/images.jpeg",
                alt: "Instagram",
              },
              {
                href: "https://wa.me/message/MGKFJRGNVIJFF1",
                src: "/WhatsApp.webp",
                alt: "WhatsApp",
              },
            ].map(({ href, src, alt }) => (
              <a
                key={alt}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={src}
                  alt={alt}
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    padding: "6px",
                    transition: "transform 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.3)",
          marginTop: "30px",
        }}
      ></div>

      {/* Footer Text */}
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "rgba(255, 255, 255, 0.7)",
          ...arialFont,
        }}
      >
        © {new Date().getFullYear()} Sree Krishna Enlightened Tarot Healing and
        Reading. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
