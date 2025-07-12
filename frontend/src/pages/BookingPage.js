import React, { useState, useEffect } from "react";
import styles from "./BookingPage.module.css";
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
  const slotCount =
    health && (career || rel) ? cartItems.length - 1 : cartItems.length;

  useEffect(() => {
    const fetchBookedSlots = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_PUBLIC_API_URL}/booked-slots`
      );
      if (!res) {
        console.log("Failed to fetch data from backend");
        return;
      }
      const data = await res.json();
      setBookedSlots(data);
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
      clearTimeout(reservationTimers[slotKey]);
      delete reservationTimers[slotKey];
      setReservationTimers({ ...reservationTimers });

      setSelectedSlots(
        selectedSlots.filter(
          (item) => !(item.day === day && item.slot === slot)
        )
      );
    } else if (selectedSlots.length < slotCount) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_PUBLIC_API_URL}/reserve-slot`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, slot, duration: 5 }),
          }
        );

        if (response.ok) {
          const reservedSlot = await response.json();
          setSelectedSlots([...selectedSlots, { day, slot }]);

          const timer = setTimeout(() => {
            setSelectedSlots((prevSlots) =>
              prevSlots.filter(
                (item) =>
                  !(
                    item.day === reservedSlot.day &&
                    item.slot === reservedSlot.slot
                  )
              )
            );
          }, 5 * 60 * 1000);

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
      alert(
        "Please enter your name and phone number before proceeding to payment."
      );
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert(
        "Razorpay SDK failed to load. Please check your internet connection."
      );
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_PUBLIC_API_URL}/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPrice }),
        }
      );

      if (!response.ok) {
        alert("Failed to create Razorpay order. Please try again.");
        return;
      }

      const order = await response.json();
      const keyRes = await fetch(
        `${process.env.REACT_APP_PUBLIC_API_URL}/get-razorpay-key`
      );
      const { key } = await keyRes.json();

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Slot Booking",
        description: "Complete your booking payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const result = await fetch(
              `${process.env.REACT_APP_PUBLIC_API_URL}/confirm-booking`,
              {
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
              }
            );

            if (result.ok) {
              alert("Payment successful! Slots booked.");
              setSelectedSlots([]);
              setName("");
              setPhone("");

              const refreshResponse = await fetch(
                `${process.env.REACT_APP_PUBLIC_API_URL}/booked-slots`
              );
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

  const getSlotClass = (day, slot) => {
    if (isSlotBooked(day, slot)) return styles.slotBooked;
    if (isSlotSelected(day, slot)) return styles.slotSelected;
    return styles.slotAvailable;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Book Your Slots</h2>
      <h3 className={styles.heading}>
        You need to book any {slotCount} slot(s) for:
      </h3>
      {cartItems.map((item) => (
        <h3 key={item.name}>{item.name}</h3>
      ))}

      <div className={styles.grid}>
        <div className={`${styles.cell} ${styles.cellHeader}`}>Day/Time</div>
        {slots.map((slot, index) => (
          <div key={index} className={`${styles.cell} ${styles.cellHeader}`}>
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
              <div className={`${styles.cell} ${styles.dayLabel}`}>{day}</div>
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  className={`${styles.cell} ${getSlotClass(day, slot)}`}
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

      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Enter your phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={styles.input}
        />
      </div>

      <button onClick={handlePayment} className={styles.payButton}>
        Proceed to Payment
      </button>

      <h3>Subtotal: Rs.{totalPrice}</h3>
    </div>
  );
};

export default BookingPage;
