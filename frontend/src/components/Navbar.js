import React, { useState,useEffect } from 'react';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import { Stack, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { AiOutlineShopping } from 'react-icons/ai';
import Logo from '../assets/images/Logo.png';
import Cart from './Cart';
import { useStateContext } from '../context/StateContext';
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const {showCart,setShowCart,totalQuantities}=useStateContext();
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isBookHovered, setIsBookHovered] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const navigate=useNavigate();
  const handleAboutUsNavigation=()=>{
    navigate("/#aboutus");
  }
  //useEffect and useLocation used to handle the working of the hash to navigate to a given position of some other page
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <>
      {/* Desktop Navbar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: '40px',
          py: '20px',
          borderBottom: '2px solid #e0e0e0',
          display: { xs: 'none', sm: 'flex' }, // Hidden on mobile
        }}
      >
        <Link to="/" alt="logo">
          <img src={Logo} alt="Logo" style={{ width: '100px', height: '100px' }} />
        </Link>

        {/* Navigation Links and Cart Button */}
        <Stack direction="row" alignItems="center" spacing={5}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#3A1212',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'Cinzel Decorative',
              cursor: 'pointer',
              transform: isHomeHovered ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
            }}
            onMouseEnter={() => setIsHomeHovered(true)}
            onMouseLeave={() => setIsHomeHovered(false)}
          >
            Home
          </Link>
          <Link to="/#Services"
            style={{
              textDecoration: 'none',
              color: '#3A1212',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'Cinzel Decorative',
              cursor: 'pointer',
              transform: isBookHovered ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
            }}
            onMouseEnter={() => setIsBookHovered(true)}
            onMouseLeave={() => setIsBookHovered(false)}
          >
            Book Services
          </Link>
          <Link
            to="/contact-us"
            style={{
              textDecoration: 'none',
              color: '#3A1212',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'Cinzel Decorative',
              cursor: 'pointer',
              transform: isContactHovered ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
            }}
            onMouseEnter={() => setIsContactHovered(true)}
            onMouseLeave={() => setIsContactHovered(false)}
          >
            Contact Us
          </Link>
          <Link to="/#aboutus"
            style={{
              textDecoration: 'none',
              color: '#3A1212',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'Cinzel Decorative',
              cursor: 'pointer',
              transform: isAboutHovered ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
            }}
            onMouseEnter={() => setIsAboutHovered(true)}
            onMouseLeave={() => setIsAboutHovered(false)}
          >
            About Us
          </Link>

          {/* Cart Button */}
          <button
            className="cart-icon"
            onClick={() => setShowCart(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#3A1212',
              fontSize: '24px',
              fontWeight: 'bold',
              position: 'relative',
              cursor: 'pointer',
              transform: isCartHovered ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
            }}
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
          >
            <AiOutlineShopping />
            <span
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#FF2625',
                color: '#fff',
                fontSize: '12px',
                borderRadius: '50%',
                padding: '2px 6px',
              }}
            >
              {totalQuantities}
            </span>
          </button>
        </Stack>
      </Stack>

      {/* Mobile Navbar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: '20px',
          py: '10px',
          borderBottom: '2px solid #e0e0e0',
          display: { xs: 'flex', sm: 'none' }, // Hidden on desktop
        }}
      >
        {/* Stack item 1 : Logo */}
        <Link to="/" alt="logo">
          <img src={Logo} alt="Logo" style={{ width: '80px', height: '80px' }} />
        </Link>
       <Stack direction="row">
         {/* Stack item 2 :Following is the cart button */}
         <button
        className="cart-icon"
        onClick={() => setShowCart(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          color: '#3A1212',
          fontSize: '24px',
          fontWeight: 'bold',
          position: 'relative',
          transition: 'transform 0.3s ease',
        }}
      >
        <AiOutlineShopping />
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#FF2625',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '50%',
            padding: '2px 6px',
          }}
        >
          {totalQuantities}
        </span>
      </button>
      {/* Stack item 3 : Menu button */}
        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon sx={{ fontSize: '32px', color: '#3A1212' }} />
        </IconButton>
      </Stack>
      {/* Stack item 3 ends here */}
       </Stack>
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
  <Stack direction="row" justifyContent="space-between" sx={{ p: '10px' }}>
    <img src={Logo} alt="Logo" style={{ width: '60px', height: '60px' }} />
    <IconButton onClick={handleDrawerToggle}>
      <CloseIcon sx={{ fontSize: '32px', color: '#3A1212' }} />
    </IconButton>
  </Stack>
  <List sx={{ width: '250px', p: '10px' }}>

    {/* Navigation Links */}
    <ListItem button>
      <ListItemText
        primary="Home"
        primaryTypographyProps={{ fontSize: '20px' }}
        onClick={handleDrawerToggle}
      />
    </ListItem>
    <ListItem button>
      <ListItemText
        primary="Book Services"
        primaryTypographyProps={{ fontSize: '20px' }}
        onClick={handleDrawerToggle}
      />
    </ListItem>
    <ListItem button>
      <ListItemText
        primary="Contact Us"
        primaryTypographyProps={{ fontSize: '20px' }}
        onClick={handleDrawerToggle}
      />
    </ListItem>
    <ListItem button>
      <ListItemText
        primary="About Us"
        primaryTypographyProps={{ fontSize: '20px' }}
        onClick={handleDrawerToggle}
      />
    </ListItem>
  </List>
</Drawer>
{showCart && <Cart />}
    </>
  );
};

export default Navbar;
