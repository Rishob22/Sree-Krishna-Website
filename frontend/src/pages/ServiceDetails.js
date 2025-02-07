import React from 'react';
import { useParams } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { useStateContext } from '../context/StateContext';
import { Toaster } from 'react-hot-toast';
const ServiceDetails = () => {
  const {serviceList}=useStateContext();
  const { slug } = useParams();
  const currentServiceArr = serviceList.filter((service) => service.slug === slug);
  const service = currentServiceArr[0];
  const {onAdd}=useStateContext();
  return (
   <>
   <Toaster />
   <div className="service-details">
      <div className="product-detail-container">
        <div className="image-section">
          <div className="image-container">
            <img
              src={`/tarot_assets/converted/${service.name}.jpg`} 
              alt={service.name}
              className="product-detail-image"
            />
          </div>
        </div>
        <div className="product-detail-desc">
          <h1 className="service-title">{service.name}</h1>
          <div className="reviews">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <AiFillStar key={index} />
              ))}
            </div>
            <p className="review-count">(20 Reviews)</p>
          </div>
          <h4 className="details-heading">Details:</h4>
          <p className="service-description">{service.description}</p>
          <h4 className="details-heading">Duration:</h4>
          <p className="service-description">{service.duration} minutes per session</p>
          <p className="price">Price: Rs.{service.price}</p>
          <div className="buttons">
            <button onClick={()=>{onAdd(service);}} type="button" className="add-to-cart">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
   </>
   
  );
};

export default ServiceDetails;
