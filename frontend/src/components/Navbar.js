import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AiOutlineShopping } from "react-icons/ai";
import Logo from "../assets/images/Logo.png";
import Cart from "./Cart";
import { useStateContext } from "../context/StateContext";
import "./Navbar.css";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showCart, setShowCart, totalQuantities, user, setUser } =
    useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:599px)");
  const API = process.env.REACT_APP_API_BASE_URL;
  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignup = () => {
    navigate("/signup");
  };
  const handleDrawerToggle = () => setMobileOpen((v) => !v);

  // Smooth scroll to hash targets
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  // Helper navigate + close drawer (mobile)
  const go = (to) => {
    if (isMobile) handleDrawerToggle();
    if (to.startsWith("#")) {
      navigate({ pathname: "/", hash: to });
    } else if (to.includes("#")) {
      const [path, hash] = to.split("#");
      navigate({ pathname: path || "/", hash: `#${hash}` });
    } else {
      navigate(to);
    }
  };

  // 1) PROFILE button → hit /user/profile, update context, then navigate
  const handleProfile = async () => {
    try {
      const res = await fetch(`${API}/user/profile`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        // Support either { user: {...} } or direct user object
        setUser(data?.user || data);
        navigate("/profile");
      } else if (res.status === 401) {
        navigate("/login");
      } else {
        // Fallback: still let user see profile page shell
        navigate("/profile");
      }
    } catch {
      navigate("/profile");
    } finally {
      if (isMobile) setMobileOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Book Services", to: "/#services" }, // ensure section id="services"
    { label: "Contact Us", to: "/contact-us" },
    { label: "About Us", to: "/#aboutus" }, // ensure section id="aboutus"
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <header className="navbar-root">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            <img className="brand-logo" src={Logo} alt="Sree Krishna Logo" />
            <span className="brand-name d-none-sm"></span>
          </Link>

          {/* Desktop nav (no Drawer on desktop) */}
          <nav className="nav-links d-none-xs" aria-label="Primary Navigation">
            {navLinks.map(({ label, to }) => (
              <Link key={label} to={to} className="nav-link">
                {label}
              </Link>
            ))}

            {/* Profile button (hits endpoint) */}
            {user && (
              <button className="nav-link nav-btn" onClick={handleProfile}>
                Profile
              </button>
            )}

            {/* Auth or Greeting */}
            {user ? (
              <span className="nav-greeting">
                Welcome, {user?.name?.split(" ")[0] || "User"}!
              </span>
            ) : (
              <div className="nav-auth">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-link">
                  Signup
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu toggle (icon only visible on mobile) */}
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              className="menu-btn d-only-xs"
              aria-label="Open menu"
            >
              <MenuIcon sx={{ fontSize: 30, color: "var(--violet-700)" }} />
            </IconButton>
          )}
        </div>
      </header>

      {/* 2) Drawer ONLY on mobile */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          PaperProps={{
            sx: {
              width: 280,
              background:
                "linear-gradient(180deg, #ffffff 0%, var(--bg-soft-1, #fdf2f8) 50%, var(--bg-soft-2, #faf5ff) 100%)",
              color: "var(--slate-700)",
              borderLeft: "1px solid rgba(139,92,246,0.12)",
            },
          }}
        >
          <Stack direction="row" justifyContent="space-between" sx={{ p: 1.5 }}>
            <img
              src={Logo}
              alt="Sree Krishna Logo"
              style={{ width: 56, height: 56, borderRadius: "50%" }}
            />
            <IconButton onClick={handleDrawerToggle} aria-label="Close menu">
              <CloseIcon sx={{ fontSize: 28, color: "var(--violet-700)" }} />
            </IconButton>
          </Stack>

          <List sx={{ px: 1 }}>
            {/* Profile at top in mobile menu */}
            {!user && (
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogin} sx={{ borderRadius: 2 }}>
                  <ListItemText
                    primary="Login"
                    primaryTypographyProps={{
                      fontSize: 18,
                      fontWeight: 700,
                      sx: { color: "var(--violet-700)" },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {!user && (
              <ListItem disablePadding>
                <ListItemButton onClick={handleSignup} sx={{ borderRadius: 2 }}>
                  <ListItemText
                    primary="Signup"
                    primaryTypographyProps={{
                      fontSize: 18,
                      fontWeight: 700,
                      sx: { color: "var(--violet-700)" },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {user && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleProfile}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText
                    primary="Profile"
                    primaryTypographyProps={{
                      fontSize: 18,
                      fontWeight: 700,
                      sx: { color: "var(--violet-700)" },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {navLinks.map(({ label, to }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton onClick={() => go(to)} sx={{ borderRadius: 2 }}>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: 18,
                      fontWeight: 600,
                      sx: { color: "var(--violet-700)" },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Mobile auth / greeting */}
          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{ px: 2, py: 2, mt: "auto" }}
          >
            {user ? (
              <span className="nav-greeting">
                Welcome, {user?.name?.split(" ")[0] || "User"}!
              </span>
            ) : (
              <>
                <button className="btn-ghost" onClick={() => go("/login")}>
                  Login
                </button>
                <button className="btn-ghost" onClick={() => go("/signup")}>
                  Signup
                </button>
              </>
            )}
          </Stack>
        </Drawer>
      )}

      {/* Floating Cart Button */}
      <button
        className="cart-fab"
        onClick={() => setShowCart(true)}
        aria-label={`Open cart (${totalQuantities} items)`}
      >
        <AiOutlineShopping size={24} />
        <span className="cart-badge" aria-hidden="true">
          {totalQuantities}
        </span>
      </button>

      {showCart && <Cart />}
    </>
  );
};

export default Navbar;
