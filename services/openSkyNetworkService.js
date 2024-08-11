// Service to fetch data from OpenSky Network API and sort the data for a cleaner output.
// Learn more about OpenSky Network at https://opensky-network.org/about/about-us.
// Read the REST API documentation at https://openskynetwork.github.io/opensky-api/rest.html.

const axios = require('axios'); // Axios is a simple promise based HTTP client for the browser and node.js.

// To optimize the performance of the API, we can filter the data by providing the bounding box coordinates.
// The bounding box coordinates are the minimum and maximum latitude and longitude values : lamin, lomin, lamax, lomax.

async function fetchOpenSkyNetwork(lamin, lomin, lamax, lomax) {
  try {
    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data from OpenSky Network', error);
    throw new Error('Failed to fetch data from OpenSky Network');
  }
};

// The OpenSky Network API returns an array of states, where each state is a summary of an aircraft's tracking information.
// The data is sorted to include only the relevant information for each aircraft.

function sortOpenSkyNetworkData(data) {

  if (!data || !Array.isArray(data.states)) {
    throw new Error('Invalid data format: states is not an array');
  }

  const sortedData = data.states.map((state) => {
    if (!Array.isArray(state)) {
      throw new Error('Invalid state format');
    }

    const [
      icao24, // [0] Unique ICAO 24-bit address of the transponder in hex string representation.
      callsign, // [1] Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
      origin_country, // [2] Country name inferred from the ICAO 24-bit address.
      time_position, // [3] Unix timestamp (seconds) for the last position update. Can be null if no position report was received by OpenSky within the past 15s.
      last_contact, // [4] Unix timestamp (seconds) for the last update in general. This field is updated for any new, valid message received from the transponder.
      longitude, // [5] WGS-84 longitude in decimal degrees. Can be null.
      latitude, // [6] WGS-84 latitude in decimal degrees. Can be null.
      baro_altitude, // [7] Barometric altitude in meters. Can be null.
      on_ground, // [8] Boolean value which indicates if the position was retrieved from a surface position report.
      velocity, // [9] Velocity over ground in m/s. Can be null.
      true_track, // [10] True track in decimal degrees clockwise from north (north=0°). Can be null.
      vertical_rate, // [11] Vertical rate in m/s. A positive value indicates that the airplane is climbing, a negative value indicates that it descends. Can be null.
      sensors, // [12] IDs of the receivers which contributed to this state vector. Is null if no filtering for sensor was used in the request.
      geo_altitude, // [13] Geometric altitude in meters. Can be null.
      squawk, // [14] The transponder code aka Squawk. Can be null.
      spi, // [15] Whether flight status indicates special purpose indicator.
      position_source, // [16] Origin of this state’s position: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT, 3 = FLARM.
    ] = state;

    return {
      icao24: icao24 || 'N/A',
      callsign: callsign || 'N/A',
      last_contact: last_contact || 0,
      longitude: longitude || 0,
      latitude: latitude || 0,
      baro_altitude: baro_altitude || 0,
      velocity: velocity || 0,
      true_track: true_track || 0,
      vertical_rate: vertical_rate || 0,
      geo_altitude: geo_altitude || 0,
      squawk: squawk || 'N/A',
    };
  });

  return sortedData;
}

module.exports = {
  fetchOpenSkyNetwork,
  sortOpenSkyNetworkData
};
