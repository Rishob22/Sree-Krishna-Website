import React,{useState} from 'react'
import Service from './Service'
import { useStateContext } from '../context/StateContext';
const Services = () => {
  const {readingList,healingList}=useStateContext();
  return (
     <div id="Services"  style={{marginTop:'20px'}}>
     <center><h1 className='section-title'>Reading</h1></center>
    <div className="products-container">
    {readingList.map((service) => (
      <Service service={service} />
      
    ))}
  </div>
  <center ><h1 className='section-title'>Healing</h1></center>
  <div className="products-container">
  {healingList.map((service) => (
    <Service service={service} />
  ))}
</div>
     </div>
  )
}

export default Services
