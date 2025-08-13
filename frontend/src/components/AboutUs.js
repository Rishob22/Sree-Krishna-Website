import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <section id="aboutus" className="about-section">
      <div className="about-card">
        <div className="about-avatar">
          <img src="/AboutUs.jpg" alt="Founder — Ms. Meghna Mondal" />
        </div>

        <h2 className="about-title">About Us</h2>
        <div className="about-divider" />

        <p className="about-text">
          Based out of Kolkata, India,{" "}
          <strong>Sree Krishna Tarot Reading and Healing</strong> provides
          best-in-class guidance for mental and spiritual wellbeing. Its
          founder, <strong>Ms. Meghna Mondal</strong>, is a seasoned Tarot Card
          Reader and Reiki healer who combines empathy with Reiki-assisted
          healing—delivered with world-class professionalism and
          confidentiality. Amid life’s rush, begin your journey to align your
          spiritual self with Meghna and move through challenges with clarity
          and calm.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
