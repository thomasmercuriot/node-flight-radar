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

    // General flight information.

    const flightInfo = $('#info-sections-wrapper').find('#info').find('#flight-info').find('#content').find('#value');
    const operationDays = $('#info-sections-wrapper').find('#info').find('#flight-info').find('#content').find('#days-of-operation').find('.active');

    const infoList = [];
    flightInfo.each((i, element) => {
      infoList.push($(element).text().trim());
    });

    const daysList = [];
    operationDays.each((i, element) => {
      daysList.push($(element).text().trim());
    });

    aircraftData.overview = {
      registration: registration,
      callsign: $('#id').first().find('#secondary').text().trim(),
      airline: infoList[0],
      duration: infoList[1],
      distance: infoList[2],
      operationDays: daysList,
    };

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
      terminal: infoList[6],
      gate: infoList[4],
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
      terminal: infoList[7],
      gate: infoList[5],
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

    // Aircraft information.

    const aircraftInfo = $('#info-sections-wrapper').find('#info').find('#aircraft-info').find('#content').find('#value');

    const aircraftInfoList = [];
    aircraftInfo.each((i, element) => {
      aircraftInfoList.push($(element).text().trim());
    });

    console.log(aircraftInfoList);

    aircraftData.aircraft = {
      type: aircraftInfoList[0],
      transponder: aircraftInfoList[2],
      serial: aircraftInfoList[3],
    };

    // Other flights this week.

    const thisFlight = $('#root').find('table').find('tbody').find('.selected');

    const thisFlightData = {
      flightNumber: thisFlight.find('#flight').text().trim(),
    };

    aircraftData.thisFlight = (thisFlightData);

    const otherFlights = $('#root').find('table').find('tbody').find('tr');
    const otherFlightList = [];

    otherFlights.each((i, element) => {
      const otherFlightData = {
        date: $(element).find('#date').text().trim(),
        callsign: $(element).find('#flight').text().trim(),
        origin: $(element).find('#departure').text().trim(),
        scheduledDeparture: $(element).find('#std').text().trim(),
        actualDeparture: $(element).find('#atd').text().trim(),
        destination: $(element).find('#arrival').text().trim(),
        scheduledArrival: $(element).find('#sta').text().trim(),
        delay: ($(element).find('#delay').find('span').attr('class') === 'red' ? 'Delayed' : 'On time'),
        status: $(element).find('#status').find('span').text().trim(),
        duration: $(element).find('#duration').text().trim(),
      }
      if (otherFlightData.date !== '') {
        otherFlightList.push(otherFlightData);
      }
    });

    aircraftData.otherFlights = otherFlightList;

    return aircraftData;
  } catch (error) {
    console.error('Failed to scrape aircraft data for this registration', registration, error);
  }
};

module.exports = { scrapeAircraftData };
