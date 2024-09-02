// Service to scrape a list of high resolution aircraft photos from https://www.airhistory.net.
// We can get a list of photos for a specific aircraft registration by searching for the registration number on the website. (${registration})

// Note: This service replaces planePicturesService.js as the https://www.planepictures.net/ website took too long to load the search results. (3-5 seconds per request at best)
// The https://www.airhistory.net/ website is much faster and provides a better user experience. (under 300ms per request)

// Learn more about AirHistory at https://www.airhistory.net/info/about.php.

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

    // Let's also scrape some more usefull data from the page such as the photographer and the date of the photo.

    const photoDataList = [];

    photoLinks.each((i, element) => {

      // For each photo card ($('.mb-3')) we scrape its text content and store it in an array (photoData).

      const data = $(element).find('.value_std');

      const photoData = [];
      data.each((i, element) => {
        photoData.push($(element).text().trim());
      });

      // I noticed that the length of the photoData array can vary depending on the information filled in by each photographer.
      // (e.g. some photographers may not provide the aircraft livery, or the alternate registration, etc.)
      // This is why we need to handle different cases to make sure we always get the right information.
      // After playing around with the website, I noticed that the length of the photoData array could be: 34, 38, 40, 42, or 44.
      // (I'm sure there are more cases, but I'll stick to these for now as they probably cover >95% of the use cases).

      let photoDataJson = {};

      switch (photoData.length) {
        case 34:
          photoDataJson = {
            registration: registration,
            aircraftType: photoData[3],
            locationAirport: photoData[5],
            locationCountry: photoData[6],
            date: photoData[7],
            photographer: (photoData[8] ? photoData[8].slice(0, -7) : 'N/A'),
          }
          // console.log('34');
          break;
        case 38:
          photoDataJson = {
            registration: registration,
            aircraftType: photoData[3],
            locationAirport: photoData[6],
            locationCountry: photoData[7],
            date: photoData[8],
            photographer: (photoData[9] ? photoData[9].slice(0, -7) : 'N/A'),
          }
          // console.log('38');
          break;
        case 40:
          photoDataJson = {
            registration: registration,
            aircraftType: photoData[3],
            aircraftLivery: photoData[6],
            locationAirport: photoData[7],
            locationCountry: photoData[8],
            date: photoData[9],
            photographer: (photoData[10] ? photoData[10].slice(0, -7) : 'N/A'),
          }
          // console.log('40');
          break;
        case 42:
          photoDataJson = {
            registration: registration,
            alternateRegistration: photoData[1],
            aircraftType: photoData[4],
            locationAirport: photoData[7],
            locationCountry: photoData[8],
            date: photoData[9],
            photographer: (photoData[10] ? photoData[10].slice(0, -7) : 'N/A'),
          }
          // console.log('42');
          break;
        case 44:
          photoDataJson = {
            registration: registration,
            alternateRegistration: photoData[1],
            aircraftType: photoData[4],
            aircraftLivery: photoData[7],
            locationAirport: photoData[8],
            locationCountry: photoData[9],
            date: photoData[10],
            photographer: (photoData[11] ? photoData[11].slice(0, -7) : 'N/A'),
          }
          // console.log('44');
          break;
        default:
          break;
      }

      // We then store each photoDataJson object in the photoDataList array so we can later fetch the given information for the selected photo.
      // To make sure we get the relevant information for the selected photo, we need to use the same randomIndex.

      photoDataList.push(photoDataJson);
    });

    // The website will behave differently depending on the number of photos available for the given registration.
    // (e.g. when there is only one photo, we will also srape an empty photoData array (photoDataList[0].aircraftType === undefined))
    // (e.g. when there are two photos or more, we will also srape two empty photoData arrays (photoDataList[0].aircraftType === undefined && photoDataList[1].aircraftType === undefined))

    let aircraftPhotoData = {};

    if (photoDataList.length < 2) {
      aircraftPhotoData = {
        photoUrl: 'N/A',
        photoData: 'N/A',
      };
    } else if (photoDataList.length === 2) {
      aircraftPhotoData = {
        photoUrl: photoUrl,
        photoData: photoDataList[1],
      };
    } else if (photoDataList[0].aircraftType === undefined && photoDataList[1].aircraftType !== undefined) {
      aircraftPhotoData = {
        photoUrl: photoUrl,
        photoData: photoDataList[randomIndex + 1],
      };
    } else {
      aircraftPhotoData = {
        photoUrl: photoUrl,
        photoData: photoDataList[randomIndex + 2],
      };
    }

    return aircraftPhotoData;
  } catch (error) {
    console.error('Failed to scrape aircraft photo', error);
  }
};

module.exports = { scrapePlanePhotos };
