import React from "react";

const Success = () => {
  const container = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    padding: "24px",
  };

  const card = {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
    padding: "28px",
    textAlign: "center",
  };

  const iconWrap = {
    height: "64px",
    width: "64px",
    margin: "0 auto 12px",
    borderRadius: "50%",
    background: "#e8f5e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const title = {
    fontSize: "22px",
    fontWeight: 600,
    margin: "8px 0 6px",
    color: "#0f172a",
  };
  const desc = { fontSize: "14px", color: "#475569", marginBottom: "18px" };

  const actions = { display: "flex", gap: "10px", justifyContent: "center" };
  const btn = {
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    border: "1px solid #e2e8f0",
    background: "#0f172a",
    color: "#fff",
    textDecoration: "none",
  };

  return (
    <div style={container}>
      <div style={card}>
        <div style={iconWrap}>
          {/* Minimal inline check icon */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M12 21c4.971 0 9-4.029 9-9s-4.029-9-9-9-9 4.029-9 9 4.029 9 9 9Z"
              stroke="#16a34a"
              strokeWidth="1.5"
            />
            <path
              d="M8 12.5l2.5 2.5L16 9.5"
              stroke="#16a34a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 style={title}>Payment successful</h1>
        <p style={desc}>Thank you. Your payment was completed.</p>

        <div style={actions}>
          <a href="/" style={btn}>
            Go to Home
          </a>
          <a href="/profile" style={btn}>
            Go to Bookings
          </a>
        </div>
      </div>
    </div>
  );
};

export default Success;
