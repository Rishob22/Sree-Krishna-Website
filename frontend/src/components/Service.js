import React from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import "./Service.css";

const Service = ({ service }) => {
  const { onAdd } = useStateContext();

  const isHealth = service?.name === "Health";
  // Fallbacks for safety
  const slug = service?.slug || "";
  const name = service?.name || "Service";
  const imageSrc = `/tarot_assets/converted/${name}.jpg`;

  return (
    <div className="service-card">
      <Link
        to={`/${slug}`}
        className="service-media"
        aria-label={`View ${name}`}
      >
        <img src={imageSrc} alt={name} loading="lazy" />
      </Link>

      <div className="service-body">
        <h3 className="service-name">{name}</h3>

        {/* Pricing */}
        {!isHealth ? (
          <div className="service-price">
            <span className="price-primary">₹ {service?.price}</span>
          </div>
        ) : (
          <div className="service-price stack">
            <div>
              <span className="price-primary">₹ 1,176</span>
            </div>
            <div className="price-note">
              ₹ 624 <span className="muted">with Relationship/Career</span>
            </div>
          </div>
        )}

        <p className="service-desc">
          Experience the best services for tarot reading and healing.
        </p>

        <div className="service-actions">
          <Link
            to={`/${slug}`}
            className="btn-ghost"
            aria-label={`Know more about ${name}`}
          >
            Know More
          </Link>
          <button
            type="button"
            className="btn-brand"
            onClick={() => onAdd(service)}
            aria-label={`Add ${name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Service;
