import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLeft, AiOutlineShopping } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { useStateContext } from "../context/StateContext";
import "./Cart.css";

const Cart = () => {
  const cartRef = useRef(null);
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    onRemove,
    user,
  } = useStateContext();
  const navigate = useNavigate();

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowCart(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setShowCart]);

  // Close when clicking the backdrop (not the drawer)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setShowCart(false);
  };

  return (
    <div
      ref={cartRef}
      className="cart-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <aside className="cart-drawer">
        {/* Header */}
        <button
          type="button"
          className="cart-back"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft size={20} />
          <span className="cart-title">Your Cart</span>
          <span className="cart-count" aria-label={`${totalQuantities} items`}>
            {totalQuantities}
          </span>
        </button>

        {/* Empty state */}
        {cartItems.length < 1 && (
          <div className="cart-empty">
            <AiOutlineShopping size={80} className="cart-empty-icon" />
            <h3>No items yet</h3>
            <p className="muted">Explore services to add them here.</p>
            <Link to="/" className="w-100">
              <button
                type="button"
                className="btn-brand w-100 mt-2"
                onClick={() => setShowCart(false)}
              >
                Keep exploring
              </button>
            </Link>
          </div>
        )}

        {/* Items */}
        {cartItems.length >= 1 && (
          <div className="cart-list">
            {cartItems.map((item, index) => {
              const key = item._id || item.id || `${item.name}-${index}`;
              return (
                <div key={key} className="cart-item">
                  <img
                    className="cart-item-image"
                    src={`/tarot_assets/converted/${item.name}.jpg`}
                    alt={item.name}
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-row">
                      <h5 className="cart-item-name">{item.name}</h5>
                      <h4 className="cart-item-price">₹ {item.price}</h4>
                    </div>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => onRemove(item)}
                      aria-label={`Remove ${item.name}`}
                      title="Remove"
                    >
                      <TiDeleteOutline size={22} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {cartItems.length >= 1 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <strong>₹ {totalPrice}</strong>
            </div>

            {!user ? (
              <button
                type="button"
                className="btn-brand w-100"
                onClick={() => {
                  navigate("/login");
                  setShowCart(false);
                }}
              >
                Login to Proceed
              </button>
            ) : (
              <button
                type="button"
                className="btn-brand w-100"
                onClick={() => {
                  navigate("/booking-page");
                  setShowCart(false);
                }}
              >
                Proceed to Book Slot Timings
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};

export default Cart;
