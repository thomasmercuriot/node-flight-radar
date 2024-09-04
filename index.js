const { fetchOpenSkyNetwork, sortOpenSkyNetworkData } = require('./services/openSkyNetworkService');
const { scrapeAircraftRegistration } = require('./services/aircraftRegistrationService');
const { fetchPlaneSpotters } = require('./services/planeSpottersService');
const { scrapeAircraftData } = require('./services/aircraftDataService');
const { scrapePlanePhotos } = require('./services/planePhotosService');
const { scrapeFlightHistory } = require('./services/flightHistoryService');

require('dotenv').config();

const cors = require('cors');  // npm install cors | CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const app = require('express')();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());  // Enable CORS for all requests. This is required to allow the frontend to access the API.

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', async (req, res) => {
  console.log('Received request to /api');
  const { lamin, lomin, lamax, lomax } = req.query; // Query parameters are the bounding box coordinates of our user's viewport.

  if (!lamin || !lomin || !lamax || !lomax) {
    return res.status(400).json({ message: '400 - Missing query parameters' });
  };

  try {
    console.log('Fetching data from OpenSky Network API');
    // /api?lamin=XXX&lomin=XXX&lamax=XXX&lomax=XXX
    const data = await fetchOpenSkyNetwork(
      parseFloat(lamin),
      parseFloat(lomin),
      parseFloat(lamax),
      parseFloat(lomax)
    );
    console.log('Sorting data from OpenSky Network API');
    const sortedData = sortOpenSkyNetworkData(data);
    res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({ message: '500 - Server error' });
  }
});

app.get('/api/registration/:icao24', async (req, res) => {
  console.log('Received request to /api/aircraft/:icao24');
  const icao24 = req.params.icao24;
  try {
    console.log('Fetching registration data for aircraft with ICAO 24-bit address:', icao24);
    const registration = await scrapeAircraftRegistration(icao24);
    res.status(200).json({ registration });
  } catch (error) {
    res.status(500).json({ message: '500 - Server error' });
  }
});

app.get('/api/photo/:registration', async (req, res) => {
  console.log('Received request to /api/photo/:registration');
  const registration = req.params.registration;
  try {
    // const photo = await scrapePlanePictures(registration);
    const photo = await scrapePlanePhotos(registration);
    res.status(200).json({ photo });
  } catch (error) {
    res.status(500).json({ message: '500 - Server error' });
  }
});

app.get('/api/aircraft/:registration', async (req, res) => {
  console.log('Received request to /api/aircraft/:registration');
  const registration = req.params.registration;
  try {
    console.log('Retrieving data for aircraft with registration number:', registration);

    // Data
    // const thumbnail = await fetchPlaneSpotters(registration); // Removed to improve performance.
    const aircraftData = await scrapeAircraftData(registration);

    // JSON response
    const flightData = {
      registration: registration,
      // thumbnail: thumbnail,
      data: aircraftData,
    };

    res.status(200).json(flightData);
  } catch (error) {
    res.status(500).json({ message: '500 - Server error' });
  }
});

app.get('/api/flights/:callsign', async (req, res) => {
  console.log('Received request to /api/flights/:callsign');
  const callsign = req.params.callsign;
  try {
    const flightHistoryData = await scrapeFlightHistory(callsign);
    res.status(200).json({ flightHistoryData });
  } catch (error) {
    res.status(500).json({ message: '500 - Server error' });
  }
});

// Error handling
app.use((req, res, next) => {
  res.status(404).json({ message: '404 - Resource not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '500 - Server error', error: err });
});

// Start server
app.listen(
  PORT,
  () => console.log(`Server is running on http://localhost:${PORT}`)
);
