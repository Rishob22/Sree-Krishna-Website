import React from 'react'
import HeroBanner from '../components/HeroBanner'
import Services from '../components/Services'
import AboutUs from '../components/AboutUs'
import { Toaster } from 'react-hot-toast'
const Home = () => {
  return (
    <div>
      <Toaster />
      <HeroBanner />
      <Services />
      <AboutUs />
      </div>

  )
}

export default Home
