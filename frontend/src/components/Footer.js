import React from "react";
import Logo from "../assets/images/Logo.png";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  const socials = [
    {
      href: "https://www.facebook.com/DivineTarotMediumHealerMeghna/",
      src: "/facebook.webp",
      alt: "Facebook",
      label: "Visit us on Facebook",
    },
    {
      href: "https://www.instagram.com/divinetarotmediumhealermeghna/",
      src: "/images.jpeg",
      alt: "Instagram",
      label: "Visit us on Instagram",
    },
    {
      href: "https://wa.me/message/MGKFJRGNVIJFF1",
      src: "/WhatsApp.webp",
      alt: "WhatsApp",
      label: "Chat with us on WhatsApp",
    },
  ];

  return (
    <footer className="site-footer">
      {/* Soft starry glow layers */}
      <div className="footer-auras" aria-hidden="true">
        <span className="aura aura-violet" />
        <span className="aura aura-rose" />
      </div>

      <div className="footer-inner footer-inner--two">
        {/* Brand */}
        <div className="footer-brand">
          <img className="footer-logo" src={Logo} alt="Sree Krishna Logo" />
          <div className="brand-text">
            <h5 className="brand-title">
              Sree Krishna Tarot Reading & Healing
            </h5>
            <p className="brand-tagline">
              Intuitive guidance, Reiki-assisted healing, and calm clarity.
            </p>
          </div>
        </div>

        {/* Social */}
        <div className="footer-social">
          <h6 className="footer-heading">Follow Us</h6>
          <div className="social-row">
            {socials.map(({ href, src, alt, label }) => (
              <a
                key={alt}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="social-link"
              >
                <img className="social-icon" src={src} alt={alt} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <div className="copy">
          © {year} Sree Krishna Enlightened Tarot Healing and Reading. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
