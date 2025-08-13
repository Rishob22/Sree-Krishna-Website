import React from "react";
import { useParams, Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { useStateContext } from "../context/StateContext";
import { Toaster } from "react-hot-toast";

const ServiceDetails = () => {
  const { serviceList, onAdd } = useStateContext();
  const { slug } = useParams();

  // Find the current service safely
  const service = Array.isArray(serviceList)
    ? serviceList.find((s) => s?.slug === slug)
    : null;

  // If not found, show a friendly message
  if (!service) {
    return (
      <>
        <Toaster />
        <section className="service-details">
          <div className="product-detail-container" style={{ padding: 24 }}>
            <div style={{ margin: "0 auto", textAlign: "center" }}>
              <h2 className="service-title" style={{ marginBottom: 8 }}>
                Service not found
              </h2>
              <p className="service-description" style={{ marginBottom: 16 }}>
                The service you’re looking for doesn’t exist or has been moved.
              </p>
              <Link
                to="/#services"
                className="buy-now"
                style={{ textDecoration: "none" }}
              >
                Back to Services
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const { name, description, duration, price } = service;
  const isHealth = name === "Health";

  return (
    <>
      <Toaster />
      <div className="service-details">
        <div className="product-detail-container">
          {/* Image */}
          <div className="image-section">
            <div className="image-container">
              <img
                src={`/tarot_assets/converted/${name}.jpg`}
                alt={name}
                className="product-detail-image"
                loading="lazy"
              />
            </div>
          </div>

          {/* Details */}
          <div className="product-detail-desc">
            <h1 className="service-title">{name}</h1>

            <div className="reviews">
              <div className="stars" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar key={i} />
                ))}
              </div>
              <p className="review-count">(20 Reviews)</p>
            </div>

            <h4 className="details-heading">Details:</h4>
            <p className="service-description">{description}</p>

            <h4 className="details-heading">Duration:</h4>
            <p className="service-description">
              {duration} minutes per session
            </p>

            {/* Pricing */}
            {!isHealth ? (
              <p className="price">Price: Rs.{price}</p>
            ) : (
              <>
                <p className="price" style={{ marginBottom: 6 }}>
                  Price: Rs.1176
                </p>
                <p className="service-description" style={{ marginTop: 0 }}>
                  <strong>Rs.624</strong> <span>with Relationship/Career</span>
                </p>
              </>
            )}

            {/* Actions */}
            <div className="buttons">
              <button
                onClick={() => onAdd(service)}
                type="button"
                className="add-to-cart"
                aria-label={`Add ${name} to cart`}
              >
                Add to Cart
              </button>
              <Link
                to="/#services"
                className="buy-now"
                style={{ textDecoration: "none", textAlign: "center" }}
                aria-label="Back to Services"
              >
                Back to Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails;
