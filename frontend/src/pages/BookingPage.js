import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/StateContext";

const BookingPage = () => {
  const { cartItems, totalPrice } = useStateContext();
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [reservationTimers, setReservationTimers] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const health = cartItems.find((item) => item.name === "Health");
  const career = cartItems.find((item) => item.name === "Career");
  const rel = cartItems.find((item) => item.name === "Relationship");
  const slotCount = health && (career || rel) ? cartItems.length - 1 : cartItems.length;
  const BACKEND_URL = "https://sree-krishna-website-kb2x.vercel.app";

  // Fetch booked slots from the backend
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/booked-slots`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBookedSlots(data);
        } else {
          console.error("Failed to fetch booked slots.");
        }
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };
    fetchBookedSlots();
  }, []);

  const isSlotBooked = (day, slot) =>
    bookedSlots.some((item) => item.day === day && item.slot === slot);

  const isSlotSelected = (day, slot) =>
    selectedSlots.some((item) => item.day === day && item.slot === slot);

  const handleSlotClick = async (day, slot) => {
    if (isSlotBooked(day, slot)) return;

    const slotKey = `${day}-${slot}`;

    if (isSlotSelected(day, slot)) {
      // Deselect slot and clear reservation
      clearTimeout(reservationTimers[slotKey]);
      delete reservationTimers[slotKey];
      setReservationTimers({ ...reservationTimers });

      setSelectedSlots(selectedSlots.filter((item) => !(item.day === day && item.slot === slot)));
    } else if (selectedSlots.length < slotCount) {
      // Reserve slot
      try {
        const response = await fetch(`${BACKEND_URL}/reserve-slot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day, slot, duration: 5 }),
        });

        if (response.ok) {
          const reservedSlot = await response.json();
          setSelectedSlots([...selectedSlots, { day, slot }]);

          // Start a timer to clear reservation after 5 minutes
          const timer = setTimeout(() => {
            setSelectedSlots((prevSlots) =>
              prevSlots.filter((item) => !(item.day === reservedSlot.day && item.slot === reservedSlot.slot))
            );
          }, 5 * 60 * 1000); // 5 minutes

          setReservationTimers({ ...reservationTimers, [slotKey]: timer });
        } else {
          alert("Failed to reserve slot. It may already be reserved.");
        }
      } catch (error) {
        console.error("Error reserving slot:", error);
      }
    } else {
      alert(`You can only book ${slotCount} slots.`);
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!name || !phone) {
      alert("Please enter your name and phone number before proceeding to payment.");
      return;
    }

    // Ensure Razorpay script is loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    try {
      // Create an order on the backend
      const response = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });
      

      if (!response.ok) {
        alert("Failed to create Razorpay order. Please try again.");
        return;
      }

      const order = await response.json();

      // Configure Razorpay options
      const options = {
        key: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Slot Booking",
        description: "Complete your booking payment",
        order_id: order.id,
        handler: async function (response) {
          // Handle successful payment
          try {
            const result = await fetch(`${BACKEND_URL}/confirm-booking`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                selectedSlots,
                name,
                phone,
              }),
            });
            

            if (result.ok) {
              alert("Payment successful! Slots booked.");
              setSelectedSlots([]);
              setName("");
              setPhone("");

              // Refresh booked slots
              const refreshResponse = await fetch(`${BACKEND_URL}/booked-slots`);
              if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                setBookedSlots(data);
              }
            } else {
              alert("Failed to confirm booking. Please contact support.");
            }
          } catch (error) {
            console.error("Error confirming booking:", error);
            alert("An error occurred. Please try again.");
          }
        },
        prefill: {
          name,
          email: "your_email@example.com",
          contact: phone,
        },
        theme: {
          color: "#800080",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const slots = ["3:00pm - 5:00pm", "5:00pm - 7:00pm", "7:00pm - 9:00pm"];

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 20px",
    background: "linear-gradient(135deg, #FFC0CB, #800080)",
    color: "#fff",
    fontFamily: "'Arial', sans-serif",
    minHeight: "100vh",
    boxSizing: "border-box",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    width: "100%",
    maxWidth: "700px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  };

  const cellStyle = {
    padding: "15px 10px",
    textAlign: "center",
    fontSize: "16px",
    color: "#555",
    fontWeight: "500",
    background: "#f8f8f8",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const headingStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  };

  const slotButtonStyle = (day, slot) => {
    if (isSlotBooked(day, slot)) {
      return {
        ...cellStyle,
        backgroundColor: "#d3d3d3",
        color: "#808080",
        cursor: "not-allowed",
      };
    }

    if (isSlotSelected(day, slot)) {
      return {
        ...cellStyle,
        backgroundColor: "#800080",
        color: "#FFC0CB",
      };
    }

    return {
      ...cellStyle,
      backgroundColor: "#FFC0CB",
      color: "#800080",
      cursor: "pointer",
    };
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Book Your Slots</h2>
      <h3 style={headingStyle}>
        You need to book any {slotCount} slot(s) for:
      </h3>
      {cartItems.map((item) => (
        <h3 key={item.name}>{item.name}</h3>
      ))}
      <br />
      <div style={gridStyle}>
        <div
          style={{
            ...cellStyle,
            fontWeight: "bold",
            backgroundColor: "#800080",
            color: "#fff",
          }}
        >
          Day/Time
        </div>
        {slots.map((slot, index) => (
          <div
            key={index}
            style={{
              ...cellStyle,
              fontWeight: "bold",
              backgroundColor: "#800080",
              color: "#fff",
            }}
          >
            {slot}
          </div>
        ))}

        {dates.map((date, index) => {
          const day = date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          });
          return (
            <React.Fragment key={index}>
              <div style={{ ...cellStyle, fontWeight: "600", color: "#800080" }}>{day}</div>
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  style={slotButtonStyle(day, slot)}
                  onClick={() => handleSlotClick(day, slot)}
                >
                  {isSlotBooked(day, slot)
                    ? "Booked"
                    : isSlotSelected(day, slot)
                    ? "Selected"
                    : "Book"}
                </button>
              ))}
            </React.Fragment>
          );
        })}
      </div>
      <br />

      {/* Form for Name and Phone */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            marginRight: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #800080",
          }}
        />
        <input
          type="text"
          placeholder="Enter your phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #800080",
          }}
        />
      </div>

      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#800080",
          color: "#FFC0CB",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Proceed to Payment
      </button>

      <h3>Subtotal: Rs.{totalPrice}</h3>
    </div>
  );
};

export default BookingPage;
