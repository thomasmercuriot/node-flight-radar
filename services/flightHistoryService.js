// Serivce to scrape flight history data from https://www.radarbox.com/.
// We already scrape the flight history of a given airframe (${registration}) in the aircraftDataService.js file.
// However, we also need to scrape the flight history of a given callsign (${callsign}) to display the most recent flights for a specific route.

// Learn more about RadarBox at https://www.radarbox.com/.

// DISCLAIMER:
// Web scraping is generally not recommended for several reasons:
// 1. Legal and Ethical Concerns: Many websites have terms of service that explicitly prohibit scraping, and scraping without permission can violate these terms, leading to potential legal action.
// 2. Server Load: Scraping can place a significant load on a website's server, potentially disrupting service for other users or even leading to IP bans if the site detects excessive requests.
// 3. Data Integrity: Websites can change their structure or data format at any time, which may break your scraping logic and lead to inaccurate or incomplete data.

// This code is intended for educational purposes only, as part of a personal project to practice and improve programming skills. This application is not intended for public use, and no users will be accessing it.
// If you plan to scrape data for more than personal use, it's highly recommended to seek permission from the website owner or use official APIs if available.

const axios = require('axios'); // Axios is a simple promise based HTTP client for the browser and node.js.
const cheerio = require('cheerio'); // Cheerio is a fast, flexible, and lean implementation of core jQuery designed specifically for the server. (https://www.freecodecamp.org/news/how-to-scrape-websites-with-node-js-and-cheerio/)
const pretty = require('pretty'); // Pretty is a Node.js utility that takes raw HTML and returns a pretty-printed version.

async function scrapeFlightHistory(callsign) {
  try {
    const url = `https://www.radarbox.com/data/flights/${callsign}`;
    const data = await axios.get(url);
    const $ = cheerio.load(data.data);
    // console.log(pretty($.html()));

    const otherFlights = $('#root').find('table').find('tbody').find('tr');
    const otherFlightList = [];

    otherFlights.each((i, element) => {
      const otherFlightData = {
        date: $(element).find('#date').text().trim(),
        callsign: callsign,
        origin: $(element).find('#departure').text().trim(),
        scheduledDeparture: $(element).find('#std').text().trim(),
        actualDeparture: $(element).find('#atd').text().trim(),
        destination: $(element).find('#arrival').text().trim(),
        scheduledArrival: $(element).find('#sta').text().trim(),
        aircraftType: $(element).find('#aircraft').text().trim(),
        delay: ($(element).find('#delay').find('span').attr('class') === 'red' ? 'Delayed' : 'On time'),
        status: $(element).find('#status').find('span').text().trim(),
        duration: $(element).find('#duration').text().trim(),
      }
      if (otherFlightData.date !== '') {
        otherFlightList.push(otherFlightData);
      }
    });

    const flightHistory = otherFlightList;
    return flightHistory;
  } catch (error) {
    console.error('Failed to scrape flight history', error);
    throw new Error('Failed to scrape flight history');
  }
};

module.exports = { scrapeFlightHistory };
