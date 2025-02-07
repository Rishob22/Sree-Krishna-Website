import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLeft, AiOutlineShopping } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { useStateContext } from "../context/StateContext";

const Cart = () => {
  const cartRef = useRef();
  const {
    totalPrice,
    setTotalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    onRemove,
  } = useStateContext(); // destructuring these values from useStateContext
  const navigate = useNavigate();

  return (
    <div
      ref={cartRef}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "400px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          position: "relative",
          top: "10%",
        }}
      >
        <button
          type="button"
          onClick={() => setShowCart(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          <AiOutlineLeft />
          <span>Your Cart</span>
          <span>({totalQuantities} items)</span>
        </button>
        {cartItems.length < 1 && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
            }}
          >
            <AiOutlineShopping size={100} />
            <h3>Your Cart is Empty</h3>
            <Link to="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Keep exploring
              </button>
            </Link>
          </div>
        )}
        <div>
          {cartItems.length >= 1 &&
            cartItems.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                }}
              >
                <img
                  src={`/tarot_assets/converted/${item.name}.jpg`}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div style={{ marginLeft: "10px", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h5>{item.name}</h5>
                    <h4>Rs.{item.price}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    <TiDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 && (
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h3>Subtotal:</h3>
              <h3>Rs.{totalPrice}</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setTotalPrice(1);
                navigate("/booking-page");
                setShowCart(false);
              }}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Proceed to Book Slot Timings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
