import React, { useState, useEffect } from "react";
// display the grid from today to the 14th day from today
// if a particular slot doesnt exist in the database then show the slot as unbooked
// if that slot(day,timing) exists in the database then show that its booked
// proceed/payment flow unchanged

import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useStateContext } from "../context/StateContext";
import "./Booking.css";

const Booking = () => {
  const { totalPrice, slotCount, user } = useStateContext();
  const navigate = useNavigate();
  const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

  const timeSlots = ["3pm-5pm", "5pm-7pm", "7pm-9pm"];
  const notifyOverSelection = () =>
    toast.error(`You can only select ${slotCount} slots`);

  const [selectedSlots, setSelectedSlots] = useState([]); // ["<prettyDate>-<time>"]
  const [bookedSlots, setBookedSlots] = useState([]); // same key format

  const DATE_FMT = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // ---- build the next 14 day labels EXACTLY like in DB ----
  function generateNext14Days() {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d.toLocaleDateString("en-US", DATE_FMT)); // e.g., "Tuesday, Aug 19, 2025"
    }
    return days;
  }

  // ---- fetch booked slots and build keys like "<prettyDate>-<time>" ----
  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/slot`);
      if (!res.ok) {
        console.error("Failed to fetch slots.");
        return;
      }
      const data = await res.json();
      // IMPORTANT: your DB uses 'time', not 'slot'
      const booked = Array.isArray(data)
        ? data.map((it) => `${it.date}-${it.time}`)
        : [];
      setBookedSlots(booked);
      // Optional: debug
      // console.log("Booked keys:", booked);
    })();
  }, []); // runs only once on component mount

  const handleSlotSelect = (day, slot) => {
    const key = `${day}-${slot}`;
    const alreadySelected = selectedSlots.includes(key);

    if (selectedSlots.length === slotCount && !alreadySelected) {
      notifyOverSelection();
      return;
    }

    if (alreadySelected) {
      setSelectedSlots((prev) => prev.filter((s) => s !== key));
    } else {
      setSelectedSlots((prev) => [...prev, key]);
    }
  };

  const paymentHandler = async (heldSlots) => {
    if (totalPrice === 0) {
      toast.error("Select service(s) before payment");
      navigate("/");
      return;
    }

    const API = process.env.REACT_APP_API_BASE_URL;

    // ADDED: tiny helper to release held slots
    const releaseHolds = async () => {
      await fetch(`${API}/slot/release`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user._id, selectedSlots }),
      });
    };

    const response = await fetch(`${API}/payment/create-order`, {
      method: "POST",
      body: JSON.stringify({
        amount: totalPrice * 100,
        currency: "INR",
        receipt: "mondalrishob@gmail.com",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const order = await response.json();

    var options = {
      key: razorpayKey,
      amount: order.amount,
      currency: "INR",
      name: "Sree Krishna Enlightened Tarot Reading and Healing",
      description: "Test Transaction",
      image: "../assets/images/Logo.png",
      order_id: order.id,

      // ADDED: release if the checkout is closed
      modal: {
        ondismiss: async function () {
          await releaseHolds();
          toast("Selection released");
        },
      },

      handler: async function (response) {
        const verifyRes = await fetch(`${API}/payment/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.status === "success") {
          toast.success("Payment successful and verified!");
          await fetch(`${API}/slot`, {
            method: "POST",
            body: JSON.stringify({ heldSlots }),
            headers: { "Content-Type": "application/json" },
          });

          navigate("/success");
        } else {
          // ADDED: release if verification fails
          await releaseHolds();
          toast.error("Payment verification failed. Slots released.");
        }
      },

      prefill: {
        name: user.name,
        email: user.email,
      },
      notes: { address: "Razorpay Corporate Office" },
      theme: { color: "#3399cc" },
      retry: { enabled: false },
      timeout: 180,
    };

    const rzp = new window.Razorpay(options);

    // ADDED: release if payment fails event fires
    rzp.on("payment.failed", async function () {
      await releaseHolds();
      toast.error("Payment failed. Slots released.");
    });

    rzp.open();
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    const holdInfo = { userId: user._id, selectedSlots };
    const holdRes = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/slot/hold`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(holdInfo),
      }
    );
    const { heldSlots } = await holdRes.json();
    paymentHandler(heldSlots);
  };

  return (
    <div className="text-center">
      <Toaster />
      <h1>{`Select ${slotCount} slot${
        slotCount > 1 ? "s" : ""
      } from the table`}</h1>
      <div className="container mt-4">
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              {timeSlots.map((slot, index) => (
                <th key={index}>{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {generateNext14Days().map((day, rowIndex) => (
              <tr key={rowIndex}>
                <td>{day}</td>
                {timeSlots.map((slot, colIndex) => {
                  const cellKey = `${day}-${slot}`;
                  const isSelected = selectedSlots.includes(cellKey);
                  const isBooked = bookedSlots.includes(cellKey);
                  return (
                    <td
                      key={colIndex}
                      className={`bookable-cell ${
                        isBooked ? "booked" : isSelected ? "selected" : ""
                      }`}
                      onClick={() => !isBooked && handleSlotSelect(day, slot)}
                    >
                      {isBooked ? "Booked" : isSelected ? "Selected" : "Select"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {user && (
          <div className="container mb-4 d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleProceed}
            >
              Proceed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
