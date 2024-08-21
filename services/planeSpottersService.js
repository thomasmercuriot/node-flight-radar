// Service to fetch a low resolution aircraft photo from the PlaneSpotters Photo API.
// The aim is to use the low resolution photo as a thumbnail while a higher resolution photo is being scraped from https://www.planepictures.net/. (see planePicturesService.js)
// The low resolution photo will be displayed immediately on the pop-up, providing a better user experience, while the higher resolution photo will only be displayed in a more detailed view.

// The photo API returns the latest photo (by date taken) for an aircraft's registration: https://api.planespotters.net/pub/photos/reg/${registration}.
// Learn more about PlaneSpotters at https://www.planespotters.net.
// Read the photo API documentation at https://www.planespotters.net/photo/api.

const axios = require('axios'); // Axios is a simple promise based HTTP client for the browser and node.js.

async function fetchPlaneSpotters(registration) {
  try {
    const url = `https://api.planespotters.net/pub/photos/reg/${registration}`;
    const response = await axios.get(url);
    const thumbnail = response.data.photos[0].thumbnail_large.src; // The large thumbnail has a fixed height of 280px regardless of format and dynamic width. Widths typically range between 360px and 500px.
    return thumbnail;
  } catch (error) {
    console.error('Failed to fetch data from PlaneSpotters Photo API', error);
    throw new Error('Failed to fetch data from PlaneSpotters Photo API');
  }
};

module.exports = { fetchPlaneSpotters };
