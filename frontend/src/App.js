import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material"; //Box is a div with some shading and some colours
import ServiceDetails from "./pages/ServiceDetails";
import { StateContext, useStateContext } from "./context/StateContext";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Booking from "./pages/Booking";
import ContactUs from "./pages/ContactUs";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Success from "./pages/Success";
import ProfileBookingsPage from "./pages/ProfileBookingsPage";
import { useEffect } from "react";
const App = () => {
  //app returns the structure
  const { setUser } = useStateContext();

  return (
    <Box width="400px" sx={{ width: { xl: "1488 px" } }} m="auto">
      <StateContext>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/:slug" element={<ServiceDetails />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/booking-page" element={<Booking />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/success" element={<Success />} />
          <Route path="/profile" element={<ProfileBookingsPage />} />
        </Routes>
        <Footer />
      </StateContext>
    </Box>
  );
};

export default App;
