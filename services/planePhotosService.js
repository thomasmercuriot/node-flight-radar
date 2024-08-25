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

async function scrapePlanePhotos(registration) {
  try {
    const url = `https://www.airhistory.net/marks-all/${registration}`;
    const data = await axios.get(url);
    const $ = cheerio.load(data.data);
    // console.log(pretty($.html()));

    const photoLinks = $('.mb-3');

    const photoLinksList = [];
    photoLinks.each((i, element) => {
      if ($(element).find('a').attr('href')) {
        photoLinksList.push($(element).find('a').attr('href'));
      }
    });

    const photoCount = photoLinksList.length;
    const randomIndex = Math.floor(Math.random() * photoCount); // The aim is to display a random photo from the list. This makes the feature more interesting and engaging.
    const randomPhotoLink = `https://www.airhistory.net${photoLinksList[randomIndex]}`; // The user can track a specific aircraft multiple times and see different photos of it each time.

    const photoData = await axios.get(randomPhotoLink);
    const $photo = cheerio.load(photoData.data);
    const photoSrc = $photo('.img-fluid').attr('src');

    const photoUrl = `https://www.airhistory.net${photoSrc}`;

    // To-do:
    // Let's also scrape some more usefull data from the page such as the photographer and the date of the photo.

    return photoUrl;
  } catch (error) {
    console.error('Failed to scrape aircraft registration data', error);
  }
};

module.exports = { scrapePlanePhotos };
