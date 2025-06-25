import React from 'react'
import './App.css';
import {Route,Routes} from 'react-router-dom';
import {Box} from '@mui/material';//Box is a div with some shading and some colours
import ServiceDetails from './pages/ServiceDetails';
import { StateContext } from './context/StateContext';
import Home from './pages/Home';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import BookingPage from './pages/BookingPage';
import ContactUs from './pages/ContactUs';
const App = () => {
  //app returns the structure
  return (
    
         <Box width="400px" sx={{width:{xl : '1488 px'}}} m="auto">
  <StateContext>
  <Navbar />
   <Routes>
  <Route path="/" element={<Home />}></Route>
    <Route path="/:slug" element={<ServiceDetails />} /> 
    <Route path="/contact-us" element={<ContactUs />} /> 
    <Route path="/booking-page" element={<BookingPage />} /> 
   </Routes>
   <Footer />
  </StateContext>
   </Box>
  

  )
}

export default App
