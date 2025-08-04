import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AiOutlineShopping } from "react-icons/ai";
import Logo from "../assets/images/Logo.png";
import Cart from "./Cart";
import { useStateContext } from "../context/StateContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showCart, setShowCart, totalQuantities, user, setUser } =
    useStateContext();
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isBookHovered, setIsBookHovered] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isSignupHovered, setIsSignupHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      // Attempt to delete client-side cookie (for good measure)
      document.cookie =
        "signedin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const navStyle = (hovered) => ({
    textDecoration: "none",
    color: "#3A1212",
    fontSize: "18px",
    fontWeight: "bold",
    fontFamily: "Cinzel Decorative",
    cursor: "pointer",
    transform: hovered ? "scale(1.2)" : "scale(1)",
    transition: "transform 0.3s ease",
  });

  const loginSignupButtons = (
    <Stack direction="row" spacing={2} alignItems="center">
      <Link
        to="/login"
        style={navStyle(isLoginHovered)}
        onMouseEnter={() => setIsLoginHovered(true)}
        onMouseLeave={() => setIsLoginHovered(false)}
      >
        Login
      </Link>
      <Link
        to="/signup"
        style={navStyle(isSignupHovered)}
        onMouseEnter={() => setIsSignupHovered(true)}
        onMouseLeave={() => setIsSignupHovered(false)}
      >
        Signup
      </Link>
    </Stack>
  );

  const userGreeting = (
    <Stack direction="row" spacing={2} alignItems="center">
      <span
        style={{
          fontWeight: "bold",
          fontFamily: "Cinzel Decorative",
          color: "#3A1212",
          whiteSpace: "nowrap",
        }}
      >
        Welcome, {user?.name?.split(" ")[0] || "User"}!
      </span>
      <button
        onClick={handleLogout}
        style={{
          background: "none",
          border: "none",
          color: "#FF2625",
          fontWeight: "bold",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </Stack>
  );

  const floatingCartStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
    background: "#fff",
    borderRadius: "50%",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
    padding: "10px",
    cursor: "pointer",
  };

  return (
    <>
      {/* Desktop Navbar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: "40px",
          py: "20px",
          borderBottom: "2px solid #e0e0e0",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "100px", height: "100px" }}
          />
        </Link>
        <Stack direction="row" alignItems="center" spacing={5}>
          <Link
            to="/"
            style={navStyle(isHomeHovered)}
            onMouseEnter={() => setIsHomeHovered(true)}
            onMouseLeave={() => setIsHomeHovered(false)}
          >
            Home
          </Link>
          <Link
            to="/#Services"
            style={navStyle(isBookHovered)}
            onMouseEnter={() => setIsBookHovered(true)}
            onMouseLeave={() => setIsBookHovered(false)}
          >
            Book Services
          </Link>
          <Link
            to="/contact-us"
            style={navStyle(isContactHovered)}
            onMouseEnter={() => setIsContactHovered(true)}
            onMouseLeave={() => setIsContactHovered(false)}
          >
            Contact Us
          </Link>
          <Link
            to="/#aboutus"
            style={navStyle(isAboutHovered)}
            onMouseEnter={() => setIsAboutHovered(true)}
            onMouseLeave={() => setIsAboutHovered(false)}
          >
            About Us
          </Link>
          {user ? userGreeting : loginSignupButtons}
        </Stack>
      </Stack>

      {/* Mobile Navbar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: "20px",
          py: "10px",
          borderBottom: "2px solid #e0e0e0",
          display: { xs: "flex", sm: "none" },
        }}
      >
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "80px", height: "80px" }}
          />
        </Link>
        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon sx={{ fontSize: "32px", color: "#3A1212" }} />
        </IconButton>
      </Stack>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ p: "10px" }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "60px", height: "60px" }}
          />
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon sx={{ fontSize: "32px", color: "#3A1212" }} />
          </IconButton>
        </Stack>
        <List sx={{ width: "250px", p: "10px" }}>
          <ListItem button onClick={handleDrawerToggle}>
            <ListItemText
              primary="Home"
              primaryTypographyProps={{ fontSize: "20px" }}
            />
          </ListItem>
          <ListItem button onClick={handleDrawerToggle}>
            <ListItemText
              primary="Book Services"
              primaryTypographyProps={{ fontSize: "20px" }}
            />
          </ListItem>
          <ListItem button onClick={handleDrawerToggle}>
            <ListItemText
              primary="Contact Us"
              primaryTypographyProps={{ fontSize: "20px" }}
            />
          </ListItem>
          <ListItem button onClick={handleDrawerToggle}>
            <ListItemText
              primary="About Us"
              primaryTypographyProps={{ fontSize: "20px" }}
            />
          </ListItem>
        </List>
      </Drawer>

      {/* Mobile Login/Signup or Greeting */}
      <Stack
        direction="row"
        justifyContent="center"
        spacing={2}
        sx={{ display: { xs: "flex", sm: "none" }, mt: 2 }}
      >
        {user ? userGreeting : loginSignupButtons}
      </Stack>

      {/* Floating Cart Button */}
      <div style={floatingCartStyle} onClick={() => setShowCart(true)}>
        <AiOutlineShopping size={30} />
        <span
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            background: "#FF2625",
            color: "#fff",
            fontSize: "12px",
            borderRadius: "50%",
            padding: "2px 6px",
          }}
        >
          {totalQuantities}
        </span>
      </div>

      {showCart && <Cart />}
    </>
  );
};

export default Navbar;
