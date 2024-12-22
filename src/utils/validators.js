// utils/validators.js

export const validateLatLng = (lat, lng) => {
    // Ensure lat and lng are valid numbers within allowed ranges
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
  
    if (
      isNaN(latitude) || 
      isNaN(longitude) || 
      latitude < -90 || 
      latitude > 90 || 
      longitude < -180 || 
      longitude > 180
    ) {
      return false;
    }
  
    return true;
  };
  