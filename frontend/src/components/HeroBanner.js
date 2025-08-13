import React from "react";
import { Box, Typography, Button } from "@mui/material";
import HeroBannerImage from "../assets/images/banner_final.avif";

const HeroBanner = () => {
  return (
    <Box
      component="section"
      aria-label="Hero"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { lg: 560, md: 520, sm: 480, xs: 420 },
        px: { xs: 2, sm: 4 },
        py: { xs: 6, sm: 8 },
        borderRadius: "20px",
        // Soft page-compatible gradient using your theme tokens
        background:
          "linear-gradient(180deg, #ffffff 0%, var(--bg-soft-1, #fdf2f8) 60%, var(--bg-soft-2, #faf5ff) 100%)",
        boxShadow: "0 20px 44px rgba(139, 92, 246, 0.12)",
        // Auric glows
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: { xs: 280, sm: 420, md: 520 },
          height: { xs: 280, sm: 420, md: 520 },
          background:
            "radial-gradient(closest-side, rgba(139, 92, 246, 0.20), transparent 70%)",
          filter: "blur(8px)",
          pointerEvents: "none",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-25%",
          right: "-10%",
          width: { xs: 260, sm: 360, md: 480 },
          height: { xs: 260, sm: 360, md: 480 },
          background:
            "radial-gradient(closest-side, rgba(244, 63, 94, 0.18), transparent 70%)",
          filter: "blur(10px)",
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={HeroBannerImage}
        alt="Tarot, Reiki and healing banner"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0.35,
          filter: "saturate(1.05) contrast(1.05)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: { lg: 1100, md: 960, sm: 860, xs: "100%" },
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { lg: "1fr 1fr", md: "1fr" },
          alignItems: "center",
          gap: { xs: 3, sm: 4, md: 6 },
        }}
      >
        {/* Text block */}
        <Box
          sx={{
            textAlign: { xs: "center", md: "left" },
            px: { xs: 0, sm: 1 },
          }}
        >
          <Typography
            sx={{
              color: "var(--violet-700)",
              fontWeight: 700,
              letterSpacing: ".5px",
              fontSize: { xs: 18, sm: 20 },
              mb: 1,
              textTransform: "uppercase",
            }}
          >
            Sree Krishna Enlightened
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontFamily: "'Cinzel Decorative', serif",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "var(--brand, #8b5cf6)",
              fontSize: { xs: 30, sm: 36, md: 44 },
              textShadow: "0 2px 14px rgba(139, 92, 246, 0.18)",
            }}
          >
            Tarot Reading & Reiki Healing
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              color: "var(--slate-700)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: { xs: 18, sm: 20 },
              lineHeight: 1.8,
              maxWidth: 620,
              mx: { xs: "auto", md: 0 },
            }}
          >
            Know why you are here. Find clarity and calm with guided tarot,
            Reiki energy work, and compassionate insight.
          </Typography>

          <Box
            sx={{
              mt: { xs: 3, sm: 4 },
              display: "flex",
              gap: 1.5,
              justifyContent: { xs: "center", md: "flex-start" },
              flexWrap: "wrap",
            }}
          >
            <Button
              component="a"
              href="#services"
              aria-label="Explore Services"
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 1.25, sm: 1.5 },
                fontWeight: 600,
                fontSize: { xs: 14, sm: 16 },
                backgroundColor: "var(--brand, #8b5cf6)",
                border: "1px solid var(--brand, #8b5cf6)",
                boxShadow: "0 10px 24px rgba(139,92,246,0.22)",
                "&:hover": {
                  backgroundColor: "var(--brand-strong, #7c3aed)",
                  boxShadow: "0 14px 28px rgba(139,92,246,0.26)",
                },
              }}
            >
              Explore Services
            </Button>

            <Button
              component="a"
              href="#contact"
              aria-label="Contact Us"
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 1.25, sm: 1.5 },
                fontWeight: 600,
                fontSize: { xs: 14, sm: 16 },
                color: "var(--accent, #f43f5e)",
                borderColor: "var(--accent, #f43f5e)",
                backgroundColor: "rgba(244,63,94,0.06)",
                "&:hover": {
                  borderColor: "var(--accent, #f43f5e)",
                  backgroundColor: "rgba(244,63,94,0.12)",
                },
              }}
            >
              Contact
            </Button>
          </Box>
        </Box>

        {/* Spacer / right column keeps image hero airy on large screens */}
        <Box sx={{ display: { xs: "none", lg: "block" } }} />
      </Box>
    </Box>
  );
};

export default HeroBanner;
