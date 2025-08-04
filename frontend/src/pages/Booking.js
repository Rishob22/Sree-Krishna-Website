import React from "react";
//display the grid from today to the 14th day from today
//if a particular slot doesnt exist in the database then show the slot as unbooked
//if that slot(day,timing) exists in the database then show that its booked
//if the person clicks on proceed,employ the following checks :
/* i)if(the required number of slots are selected) {
         if(the person is logged in){}
         else {if(person has entered the details) {
         prompt the person to recheck the details and edit if required
         }
         else {ask the person to enter the details correctly }
         }
     }
   */

import toast, { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import { useStateContext } from "../context/StateContext";
import "./Booking.css";
import { useState, useEffect } from "react";
const Booking = () => {
  const { cartItems, totalPrice, slotCount } = useStateContext();
  const isLoggedIn = false;
  const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
  const timeSlots = ["3pm-5pm", "5pm-7pm", "7pm-9pm"];
  const notify = () => toast("Here is your toast.");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({});
  // useEffect(() => {
  //   // setBookedSlots((prev) => [...prev, "Friday, Jul 25, 2025-5pm-7pm"]);
  //   const fetchBookedSlots = async () => {
  //     const res = await fetch(
  //       `${process.env.REACT_APP_PUBLIC_API_URL}/booked-slots`
  //     );
  //     if (!res.ok) return console.error("Failed to fetch booked slots.");
  //     const data = await res.json();
  //     data.map((item) => {
  //       setSelectedSlots((prev) => [...prev, `${item.date}-${item.slot}`]);
  //     });
  //   };
  //   fetchBookedSlots();
  // }, []); // runs only once on component mount
  function generateNext14Days() {
    const days = [];
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayString = date.toLocaleDateString("en-US", options); // Format: Monday, Sep 23, 2024
      days.push(dayString);
    }

    return days;
  }
  const handleSlotSelect = (day, slot) => {
    const key = `${day}-${slot}`;
    const alreadySelected = selectedSlots.includes(key);

    if (selectedSlots.length === slotCount && !alreadySelected) {
      notify();
      return;
    }

    if (alreadySelected) {
      setSelectedSlots((prev) => prev.filter((s) => s !== key));
    } else {
      setSelectedSlots((prev) => [...prev, key]);
    }
  };
  const paymentHandler = async (e) => {
    if (totalPrice === 0) {
      toast.success("Select service(s) before payment");
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/payment/create-order`,
      {
        method: "POST", //we send the following to the server along wit the request
        body: JSON.stringify({
          amount: totalPrice * 100,
          currency: "INR",
          receipt: "mondalrishob@gmail.com",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //The response generated from here is the final boss
    const order = await response.json();

    var options = {
      key: razorpayKey, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits.
      currency: "INR",
      name: "Sree Krishna", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const verifyRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/payment/verify-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          }
        );

        const verifyData = await verifyRes.json();
        if (verifyData.status === "success") {
          toast.success("Payment successful and verified!");
          // Navigate to confirmation screen or store info in DB
        } else {
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        name: formData.name, //your customer's name
        email: formData.email,
        contact: formData.phone, //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      retry: {
        enabled: false,
      },
      timeout: 180,
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault(); //prevents autoreload
    if (isLoggedIn) {
    }
    paymentHandler();
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
                      onClick={() => handleSlotSelect(day, slot)}
                    >
                      {isBooked ? "Booked" : isSelected ? "Selected" : "Select"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoggedIn && (
          <div className="container mt-4 p-3 border rounded shadow-sm bg-light">
            <h5 className="mb-3">Enter Your Details to Proceed</h5>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-2">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="container mb-4 d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Proceed
                </button>
              </div>
            </form>
          </div>
        )}
        {isLoggedIn && (
          <div className="container mb-4 d-flex justify-content-center">
            <button type="button" className="btn btn-primary">
              Proceed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
