const { fetchOpenSkyNetwork, sortOpenSkyNetworkData } = require('./services/openSkyNetworkService');
const { scrapeAircraftRegistration } = require('./services/aircraftRegistrationService');
const { scrapePlanePictures } = require('./services/planePicturesService');
const { fetchPlaneSpotters } = require('./services/planeSpottersService');

require('dotenv').config();

const app = require('express')();
const PORT = process.env.PORT || 8080;

// The following bounding box coordinates are used for testing purposes.
// The aim is to later provide the bounding box coordinates dynamically based on the user's viewport.

const lamin = 42.0000;
const lomin = -5.8000;
const lamax = 54.0000;
const lomax = 8.7000;

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', async (req, res) => {
  console.log('Received request to /api');
  try {
    console.log('Fetching data from OpenSky Network API');
    const data = await fetchOpenSkyNetwork(lamin, lomin, lamax, lomax);
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
    const photo = await scrapePlanePictures(registration);
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
    const thumbnail = await fetchPlaneSpotters(registration);

    // JSON response
    const aircraftData = {
      registration: registration,
      thumbnail: thumbnail,
    };

    res.status(200).json(aircraftData);
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
