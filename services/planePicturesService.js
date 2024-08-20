// Service to scrape a list of high resolution aircraft photos from https://www.planepictures.net/.
// We can get a list of photos for a specific aircraft registration by searching for the registration number on the website. (${registration})
// The website takes approximately 3-5 seconds to load the search results, so we need to wait for the page to fully load before scraping the photo links.
// This delay is less than optimal for our React application, however i really wanted to include a high resolution photo feature.
// (the other websites i tried to scrape from had CAPTCHA challenges or did not have high resolution photos)
// As a solution, we can use a lower resolution image from the https://planespotters.net/ API as a placeholder until the high resolution photo is loaded.
// (by registration number: https://api.planespotters.net/pub/photos/reg/${registration})
// (by hex code / icao24 address: https://api.planespotters.net/pub/photos/hex/${icao24})
// This approach will provide a better user experience by showing an image immediately, and then allowing the user to scroll to a high resolution photo once loaded.

// Learn more about PlanePictures at https://www.planepictures.net/ & https://www.facebook.com/planepictures.net.
// Learn more about PlaneSpotters at https://www.planespotters.net/ & https://www.planespotters.net/about.

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

async function scrapePlanePictures(registration) {
  try {
    const registrationUrl = `https://www.planepictures.net/v3/search_en.php?stype=reg&srng=1&srch=${registration}&offset=0&range=25`;
    const data = await axios.get(registrationUrl);
    const $ = cheerio.load(data.data);

    const photoLinks = []; // Array to store scraped photo links (maximum 25 photos per page).

    $('.col-sm-4.fb-search-plane-image').each((index, element) => {
      const photoLink = $(element).find('a').attr('href');
      if (photoLink) {
        photoLinks.push(photoLink);
      }
    });

    const photoCount = photoLinks.length;
    const randomIndex = Math.floor(Math.random() * photoCount); // The aim is to display a random photo from the list. This makes the feature more interesting and engaging.
    const randomPhotoLink = photoLinks[randomIndex]; // The user can track a specific aircraft multiple times and see different photos of it each time.

    const regex = /[0-9]+$/;
    const photoId = regex.exec(randomPhotoLink)[0];

    const photoUrl = `https://www.planepictures.net/v3/show_en.php?id=${photoId}`;

    const photoData = await axios.get(photoUrl);
    const $photo = cheerio.load(photoData.data);

    const photoSrc = $photo('.fb-zoomable-image').attr('href');

    return `https://www.planepictures.net${photoSrc}`;
  } catch (error) {
    console.error('Failed to scrape aircraft photo', error);
  }
};

module.exports = { scrapePlanePictures };
