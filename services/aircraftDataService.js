// Service to retrieve additional aircraft data for a given registration number.
// The aircraft data is scraped from the RadarBox website using Axios and Cheerio.
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

async function scrapeAircraftData(registration) {
  try {
    const url = `https://www.radarbox.com/data/registration/${registration}?tab=activity`;
    const data = await axios.get(url);
    const $ = cheerio.load(data.data);
    // console.log(pretty($.html()));

    const aircraftData = {}; // Object to store scraped aircraft data.

    // Origin and destination airports.

    const origin = $('#origin');
    const destination = $('#destination');

    aircraftData.origin = {
      city: origin.find('#city').text().trim(),
      code: origin.find('#code').text().trim(),
    };

    aircraftData.destination = {
      city: destination.find('#city').text().trim(),
      code: destination.find('#code').text().trim(),
    };

    // Time and date of the flight.

    const departure = $('#time').find('#departure');
    const arrival = $('#time').find('#arrival');

    aircraftData.origin.airport = departure.attr('name');
    aircraftData.destination.airport = arrival.attr('name');

    aircraftData.departure = {
      date: departure.find('#date').text().trim(),
      scheduled: departure.find('#scheduled').text().trim().slice(10),
      departed: departure.find('#time').children('span').text().trim(),
      timezone: departure.find('#time').children('small').attr('title'),
    };

    if (departure.find('#delay').text().trim() === 'DELAYED') {
      aircraftData.departure.status = 'Delayed';
    } else {
      aircraftData.departure.status = 'On time';
    };

    aircraftData.arrival = {
      date: arrival.find('#date').text().trim(),
      scheduled: arrival.find('#scheduled').text().trim().slice(10),
      estimated: arrival.find('#time').children('span').text().trim(),
      timezone: arrival.find('#time').children('small').attr('title'),
    };

    if (arrival.find('#delay').text().trim() === 'DELAYED') {
      aircraftData.arrival.status = 'Delayed';
    } else {
      aircraftData.arrival.status = 'On time';
    };

    aircraftData.progress = {
      percentage: $('#progress').attr('title'),
      status: $('.FlightStatus').first().text().trim().toLowerCase(),
    };

    // To-do...

    return aircraftData;
  } catch (error) {
    console.error('Failed to scrape aircraft registration data', error);
  }
};

module.exports = { scrapeAircraftData };
