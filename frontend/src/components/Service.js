import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../context/StateContext';
const Service = ({ service }) => {
  const {onAdd}=useStateContext();
  return (
    <div style={cardStyle}>
      <Link to={`/${service.slug}`} style={{textDecoration:'none'}} >
        <div className="product-card" style={cardContentStyle}>
          <img
            src={`/tarot_assets/converted/${service.name}.jpg`}
            width={250}
            height={250}
            className="product-image"
            style={imageStyle}
            alt={service.name}
          />
          <center>
            <p className="product-name" style={nameStyle}>{service.name}</p>
            {
            (service.name==="Health") && (<><p className="product-price" style={priceStyle}>Rs.1176</p>
            <br>
            </br>
            <p className="product-price" style={priceStyle}>Rs.624(with Relationship/Career)</p>
            </>)
            
            }
            {
              (service.name!="Health") && <p className="product-price" style={priceStyle}>Rs.{service.price}</p>
            }
            
          </center>
          
        </div>
      </Link >
      <p className="description" style={descriptionStyle}>
        Experience the best services for tarot reading and healing.
      </p>
      <div className="button-group" style={buttonGroupStyle}>
        <Link to={`/${service.slug}`} style={buttonStyle}>Know More</Link>
        <button onClick={()=>{onAdd(service);}} style={{ ...buttonStyle, backgroundColor: '#FF2625', color: '#FFFFFF' }}>Add to Cart</button>
      </div>
    </div>
  );
};

// Inline styles
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  maxWidth: '300px',
  margin: '20px auto',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  backgroundColor: '#fff',
};

const cardContentStyle = {
  marginBottom: '12px',
};

const imageStyle = {
  borderRadius: '8px',
  marginBottom: '12px',
};

const nameStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#3A1212',
};

const priceStyle = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#FF2625',
};

const descriptionStyle = {
  fontSize: '20px',
  color: '#555',
  marginBottom: '16px',
};

const buttonGroupStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  gap: '12px',
};

const buttonStyle = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  backgroundColor: '#f0f0f0',
  color: '#3A1212',
};

export default Service;
