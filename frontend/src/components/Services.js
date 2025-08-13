import React from "react";
import Service from "./Service";
import { useStateContext } from "../context/StateContext";
import "./Services.css";

const Services = () => {
  const { readingList = [], healingList = [] } = useStateContext();

  return (
    <section id="services" className="services-section">
      {/* Readings */}
      <div className="services-group">
        <h2 className="services-heading">
          Readings
          <span className="heading-underline" />
        </h2>

        <div className="services-grid">
          {readingList.map((service, idx) => (
            <Service
              key={service._id || service.slug || service.name || idx}
              service={service}
            />
          ))}
          {readingList.length === 0 && (
            <div className="services-empty">
              New readings arriving soon. Check back shortly ✨
            </div>
          )}
        </div>
      </div>

      {/* Healing */}
      <div className="services-group">
        <h2 className="services-heading">
          Healing
          <span className="heading-underline" />
        </h2>

        <div className="services-grid">
          {healingList.map((service, idx) => (
            <Service
              key={service._id || service.slug || service.name || idx}
              service={service}
            />
          ))}
          {healingList.length === 0 && (
            <div className="services-empty">
              Healing sessions will appear here soon 💮
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
