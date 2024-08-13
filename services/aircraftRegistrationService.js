// Service to convert the given ICAO24 address to the aircraft registration number.
// The registration number is scraped from the RadarBox website using Axios and Cheerio.
// Learn more about RadarBox at https://www.radarbox.com/.

// Note: The initial plan was to use https://www.planespotters.net/search?q=${icao24}, but the website prevents scraping by using a CAPTCHA challenge.

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

async function scrapeAircraftRegistration(icao24) {
  try {
    const url = `https://www.radarbox.com/data/mode-s/${icao24}`;
    const data = await axios.get(url);
    const $ = cheerio.load(data.data);
    // console.log(pretty($.html()));
    const registration = $('#secondary').text().trim();
    console.log('ICAO24 to registration conversion successful. Registration:', registration);
    return registration;
  } catch (error) {
    console.error('Failed to scrape aircraft registration data', error);
  }
};

module.exports = { scrapeAircraftRegistration };
