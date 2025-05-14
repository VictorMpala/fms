import React from 'react';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import PropTypes from "prop-types";

function GoogleMapsCard({ latitude = 0, longitude = 0 }) {
  // If no real coordinates, use default placeholder (London)
  const hasValidCoords = latitude !== 0 && longitude !== 0;
  const mapSrc = hasValidCoords
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-0.1276!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDAzJzI2LjciTiAwMCcwMC4wIlc!5e0!3m2!1sen!2sus!4v1234567890";

  return (
    <MDBox 
      variant="gradient" 
      bgColor="white" 
      borderRadius="lg" 
      coloredShadow="dark" 
      p={2} 
      mb={2}
    >
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <MDTypography variant="h6" color="dark">
          Fleet Locations
        </MDTypography>
        <MDButton 
          variant="outlined" 
          color="dark" 
          size="small"
        >
          View Details
        </MDButton>
      </MDBox>
      
      <MDBox 
        sx={{ 
          width: '100%', 
          height: '400px', 
          borderRadius: '10px', 
          overflow: 'hidden' 
        }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-0.1276!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDAzJzI2LjciTiAwMCcwMC4wIlc!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </MDBox>
    </MDBox>
  );
}

GoogleMapsCard.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
};

export default GoogleMapsCard;
