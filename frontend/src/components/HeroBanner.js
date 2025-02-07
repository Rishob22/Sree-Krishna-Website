import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import HeroBannerImage from '../assets/images/banner_final.avif';

const HeroBanner = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        p: '20px',
        overflow: 'hidden', // Ensures the image doesn't overflow the container
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={HeroBannerImage}
        alt="banner"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: { lg: '100%', xs: '50%' },
          objectFit: 'cover',
          zIndex: -1, // Moves the image behind the text
          opacity: 0.5, // Adjusts the visibility for better text readability
        }}
      />

      {/* Text Content */}
      <Box
        sx={{
          mt: { lg: '200px', xs: '100px' },
          ml: { sm: '50px' },
          textAlign: { xs: 'center', lg: 'left' },
        }}
      >
        <Typography color="#FF2625" fontWeight="600" fontSize="26px">
          Sri Krishna Enlightened
          <br />
          Future Reading and Karma Healing
        </Typography>

        <Typography fontWeight={700} sx={{ fontSize: { lg: '44px', xs: '36px' } }}>
          Know why you are here
        </Typography>

        <Typography fontSize="20px" lineHeight="30px" mb={3}>
          Check out the most effective Tarot reading and healing services
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FF2625',
            color: '#FFFFFF',
            textTransform: 'none',
            fontSize: { lg: '16px', xs: '14px' },
            padding: { lg: '10px 20px', xs: '8px 16px' },
          }}
          href="#services"
        >
          Explore Services
        </Button>
      </Box>
    </Box>
  );
};

export default HeroBanner;
