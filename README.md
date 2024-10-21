[![Linkedin](https://img.shields.io/badge/style--5eba00.svg?label=Thomas%20Mercuriot&logo=linkedin&style=social)](https://www.linkedin.com/in/thomasmercuriot/ "Let's connect on Linkedin !")
[![Made with Node.js](https://img.shields.io/badge/Node.js->=20-blue?logo=node.js&logoColor=green)](https://nodejs.org "Go to Node.js homepage")
![Last Commit](https://badgen.net/github/last-commit/thomasmercuriot/node-flight-radar)
![GitHub contributors](https://img.shields.io/github/contributors/thomasmercuriot/node-flight-radar)
![maintained - no](https://img.shields.io/badge/maintained-no-red)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue)

# Flight Tracking API

## Introduction

Welcome to my first personal coding project ! :airplane: This API is designed to retrieve live flight tracking data and serve it to a [React](https://react.dev) front-end with the goal of building a functional clone of one of my favorite apps : [FlightRadar24](https://www.flightradar24.com). I've always been passionate about aviation, so creating my own flight tracking app from scratch has been an exciting challenge and a fantastic learning experience. You can check out the React front-end repository [here](https://github.com/thomasmercuriot/react-flight-radar).

I started this project to teach myself the basics of [Node.js](https://nodejs.org) and [Express.js](https://expressjs.com), and it’s been a rewarding journey — combining my passion for aviation with learning to code ! Although I’m not planning to actively maintain this repository for now, I’m very open to feedback[^1] and contributions — I'd love to hear from others and continue improving this project as I grow as a developer. With time and experience, I hope to revisit this project and turn this into a polished flight tracking app I can use while plane spotting[^2] !

Thanks for checking out my project, and happy coding ! :rocket:

[^1]: Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/thomasmercuriot/) and share your feedback.
[^2]: [Wikipedia : Aircraft Spotting](https://en.wikipedia.org/wiki/Aircraft_spotting)

## Getting Started

If you'd like to use this project yourself or contribute by suggesting new features, feel free to clone or fork the repository and submit a pull request. Here's how to get started :

### Cloning the Project

1. Clone the repository

To create a local copy of this project on your machine, run the following command in your terminal :

```
git clone git@github.com:thomasmercuriot/node-flight-radar.git
```

2. Navigate to the project directory

```
cd node-flight-radar
```

3. Install the dependencies

Make sure you have [Node.js](https://nodejs.org) installed. Then, install the required dependencies by running :

```
npm install
```

4. Start the Server

Run the following command to start the Node.js server :

```
npm start
```

Your API should now be running locally ! :tada:

### Forking the Project

If you'd like to make your own changes to the project, you can fork the repository :

1. Fork this repository

Click on the **Fork** button at the top right of this repository to create a copy under your own GitHub account.

2. Clone your forked repository

Use the following command to clone the forked repo to your local machine :

```
git clone git@github.com:thomasmercuriot/node-flight-radar.git
```

3. Follow the same steps as above to install dependencies and run the project.

### Submitting a Pull Request (PR)

If you want to contribute by suggesting a feature or fixing a bug, here's how you can submit a pull request (PR) :

1. Create a new branch

It's a good practice to create a new branch for each feature or bug fix :

```
git checkout -b feature-or-fix-name
```

2. Make your changes

Develop your feature or fix and commit the changes.

```
git add .
git commit -m "Describe the feature or fix here"
```

3. Push to your forked repository

```
git push origin feature-or-fix-name
```

4. Open a pull request

Go to the original repository on GitHub and click the **New Pull Request** button. Select your branch and submit your PR with a brief description of the changes.

I'll review your submission as soon as possible. Thanks in advance for contributing ! :rocket:

## Environment Variables

| Environment variable | Default value |
| -------------------- | ------------- |
| `PORT` | `8000` |

## API Endpoints

### GET /api

Retrieves live airspace data for a specified geographic area using the [OpenSky Network REST API](https://openskynetwork.github.io/opensky-api/index.html), which collects data from the ADS-B[^3] Exchange. The data is filtered to include only the relevant information needed for this project. The geographic area is defined by box coordinates, which are passed as query parameters from the front-end.

[^3]: [Wikipedia : Automatic Dependant Surveillance Broadcast (ADS-B)](https://fr.wikipedia.org/wiki/Automatic_dependent_surveillance-broadcast)

| Parameters | Type | Description | Example |
| ---------- | ---- | ----------- | ------- |
| **lamin** | Float | Minimum Latitude (Box Coordinates) | 48.6278 |
| **lomin** | Float | Minimum Longitude (Box Coordinates) | 2.2547 |
| **lamax** | Float | Maximum Latitude (Box Coordinates) | 49.3854 |
| **lomax** | Float | Maximum Longitude (Box Coordinates) | 2.8453 |

Expected Output :

```
GET /api?lamin=48.6278&lomin=2.2547&lamax=49.3854&lomax=2.8453
```

```javascript
[
  {
    "icao24": "39de47",
    "callsign": "TVF81BW",
    "last_contact": 1729521120,
    "longitude": 2.782,
    "latitude": 48.7072,
    "baro_altitude": 1958.34,
    "velocity": 146.03,
    "true_track": 42.29,
    "vertical_rate": -8.45,
    "geo_altitude": 2110.74,
    "squawk": "1465"
  },
  {
    ...
  }
]
```

Where each object represents a flight currently in the specified geographic area.

| Index | Property | Type | Description |
| ----- | -------- | ---- | ----------- |
| 0 | **icao24** | String | Unique ICAO 24-bit address of the transponder in hex string representation |
| 1 | **callsign** | String | Callsign of the vehicle (8 chars) |
| 2 | **last_contact** | Integer | Unix timestamp (seconds) for the last update |
| 3 | **longitude** | Float | WGS-84 longitude in decimal degrees |
| 4 | **latitude** | Float | WGS-84 latitude in decimal degrees |
| 5 | **baro_altitude** | Float | Barometric altitude in meters |
| 6 | **velocity** | Float | Velocity over ground in m/s |
| 7 | **true_track** | Float | True track in decimal degrees clockwise from north (north=0°) |
| 8 | **vertical_rate** | Float | Vertical rate in m/s |
| 9 | **geo_altitude** | Float | Geometric altitude in meters |
| 10 | **squawk** | String | The transponder code |

### GET /api/registration

Converts a given ICAO 24-bit address and returns the corresponding aircraft registration. The registration number is scraped from the [RadarBox](https://www.radarbox.com/) website using [Axios](https://www.npmjs.com/package/axios) and [Cheerio](https://www.npmjs.com/package/cheerio).

> [!WARNING]
> Web scraping is generally not recommended for several reasons :
>
> 1. **Legal and Ethical Concerns** : Many websites have terms of service that explicitly prohibit scraping, and scraping without permission can violate these terms, leading to potential legal action.
> 2. **Server Load** : Scraping can place a significant load on a website's server, potentially disrupting service for other users or even leading to IP bans if the site detects excessive requests.
> 3. **Data Integrity** : Websites can change their structure or data format at any time, which may break your scraping logic and lead to inaccurate or incomplete data.
>
> This code is intended for educational purposes only, as part of a personal project to practice and improve programming skills. This application is not intended for public use. If you plan to scrape data for more than personal use, it's highly recommended to seek permission from the website owner or use official APIs if available.

| Parameters | Type | Description | Example |
| ---------- | ---- | ----------- | ------- |
| **icao24** | String | ICAO 24-bit address | 3949EE |

Expected Output :

```
GET /api/registration/3949EE
```

```javascript
{
  "registration": "F-GSPO"
}
```

| Index | Property | Type | Description |
| ----- | -------- | ---- | ----------- |
| 0 | **registration** | String | Corresponding aircraft registration for a given ICAO 24-bit address |

### GET /api/photo

Returns a high-definition image URL of an aircraft based on its registration number, along with detailed information about the photo and the airframe. The program selects a random photo from the available images for the given registration on [AirHistory.net](https://www.airhistory.net), ensuring a more engaging experience for users who may track the same aircraft multiple times.

> [!WARNING]
> [Web Scraping Disclaimer](#get-apiregistration)

| Parameters | Type | Description | Example |
| ---------- | ---- | ----------- | ------- |
| **registration** | String | Selected aircraft's registration | F-GSPO |

Expected Output :

```
GET /api/photo/F-GSPO
```

```javascript
{
  "photo": {
    "photoUrl": "https://www.airhistory.net/photos/0413575.jpg",
    "photoData": {
        "registration": "F-GSPO",
        "aircraftType": "Boeing 777-228/ER",
        "locationAirport": "Paris - Charles de Gaulle (LFPG / CDG)",
        "locationCountry": "France",
        "date": "25 March 2011",
        "photographer": "Freek Blokzijl"
    }
  }
}
```

```
https://www.airhistory.net/photos/0413575.jpg
```

![F-GSPO](assets/images/F-GSPO.jpg)

F-GSPO - Photo by Freek Blokzijl

| Index | Property | Type | Description |
| ----- | -------- | ---- | ----------- |
| 0 | **photoUrl** | String | URL of the aircraft photo |
| 1 | **photoData** | Object | Contains detailed information about the aircraft and the photo |
| 1.1 | **registration** | String | Aircraft registration number |
| 1.2 | **aircraftType** | String | Aircraft model and type |
| 1.3 | **locationAirport** | String | The name and code of the airport where the photo was taken |
| 1.4 | **locationCountry** | String | Country where the photo was taken |
| 1.5 | **date** | String | Date the photo was taken |
| 1.6 | **photographer** | String | Name of the photographer who took the photo |

In certain cases, the output may also include the following data :

| Index | Property | Type | Description |
| ----- | -------- | ---- | ----------- |
| 1.7 | **alternateRegistration** | String | Previous known registration for the same airframe |
| 1.8 | **aircraftLivery** | String | Special aircraft livery |

### GET /api/aircraft

Returns detailed live flight-tracking data for a given registration as well as information about the aircraft and its recent flight history. The relevant data is scraped from the [RadarBox](https://www.radarbox.com/) website using [Axios](https://www.npmjs.com/package/axios) and [Cheerio](https://www.npmjs.com/package/cheerio).

> [!WARNING]
> [Web Scraping Disclaimer](#get-apiregistration)

| Parameters | Type | Description | Example |
| ---------- | ---- | ----------- | ------- |
| **registration** | String | Selected aircraft's registration | F-GSPO |

Expected Output :

```
GET /api/aircraft/F-GSPO
```

```javascript
{
    "registration": "F-GSPO",
    "data": {
        "overview": {
            "registration": "F-GSPO",
            "callsign": "AF201 / AFR201",
            "airline": "Air France",
            "duration": "12h32m",
            "distance": "8191 km",
            "operationDays": [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
            ]
        },
        "origin": {
            "city": "Beijing",
            "code": "(PEK / ZBAA)",
            "airport": "Beijing Capital International Airport"
        },
        "destination": {
            "city": "Paris",
            "code": "(CDG / LFPG)",
            "airport": "Paris - Charles de Gaulle International Airport"
        },
        "departure": {
            "date": "Monday, October 21 2024",
            "scheduled": "23:00",
            "departed": "23:32",
            "timezone": "China Standard Time (UTC+08:00)",
            "terminal": "2",
            "gate": "14",
            "status": "Delayed"
        },
        "arrival": {
            "date": "Tuesday, October 22 2024",
            "scheduled": "05:55",
            "estimated": "05:32",
            "timezone": "Central European Summer Time (UTC+02:00)",
            "terminal": "2E",
            "gate": "-",
            "status": "On time"
        },
        "progress": {
            "percentage": 41,
            "status": "landing in 7h 59m"
        },
        "aircraft": {
            "type": "Boeing 777-228ER",
            "transponder": "3949EE",
            "serial": "30614/320"
        },
        "thisFlight": {
            "flightNumber": "AF201"
        },
        "otherFlights": [
            {
                "date": "2024 21 Oct",
                "callsign": "AF201",
                "airlineLogo": "https://cdn.radarbox.com/airlines/sq/AFR.png",
                "origin": "Beijing (PEK/ZBAA)",
                "scheduledDeparture": "23:00 CST",
                "actualDeparture": "23:32 CST",
                "destination": "Paris (CDG/LFPG)",
                "scheduledArrival": "05:55 CEST",
                "delay": "On time",
                "status": "Est. Arrival 05:32 CEST",
                "duration": "12h32m"
            },
            {
                "date": "2024 20 Oct",
                "callsign": "AF202",
                "airlineLogo": "https://cdn.radarbox.com/airlines/sq/AFR.png",
                "origin": "Paris (CDG/LFPG)",
                "scheduledDeparture": "22:00 CEST",
                "actualDeparture": "22:13 CEST",
                "destination": "Beijing (PEK/ZBAA)",
                "scheduledArrival": "15:25 CST",
                "delay": "On time",
                "status": "Landed 15:22 CST",
                "duration": "10h43m"
            },
            {
                ...
            }
        ]
    }
}
```

| Index | Property | Type | Description |
| ----- | -------- | ---- | ----------- |
| 0 | **registration** | String | Aircraft registration number |
| 1 | **data** | Object | Main container for the flight data |
| 1.1 | **data.overview** | Object | General overview of the current flight |
| 1.1.1 | **data.overview.registration** | String | Aircraft registration number  |
| 1.1.2 | **data.overview.callsign** | String | Current flight callsign |
| 1.1.3 | **data.overview.airline** | String | Airline name |
| 1.1.4 | **data.overview.duration** | String | Average current flight duration in hours and minutes |
| 1.1.5 | **data.overview.distance** | String | Average current flight distance covered in kilometers |
| 1.1.6 | **data.overview.operationDays** | Array\[String\] | Days of the week when the current flight operates |
| 1.2 | **data.origin** | Object | Details of the current flight departure location |
| 1.2.1 | **data.origin.city** | String | Current flight departure city |
| 1.2.2 | **data.origin.code** | String | Current flight departure airport ICAO/IATA code |
| 1.2.3 | **data.origin.airport** | String | Full name of the current flight departure airport |
| 1.3 | **data.destination** | Object | Details of the current flight arrival location |
| 1.3.1 | **data.destination.city** | String | Current flight arrival city |
| 1.3.2 | **data.destination.code** | String | Current flight arrival airport ICAO/IATA code |
| 1.3.3 | **data.destination.airport** | String | Full name of the current flight arrival airport |
| 1.4 | **data.departure** | Object | Information about the current flight departure |
| 1.4.1 | **data.departure.date** | String | Current flight scheduled departure date |
| 1.4.2 | **data.departure.scheduled** | String | Current flight scheduled departure time |
| 1.4.3 | **data.departure.departed** | String | Current flight actual departure time |
| 1.4.4 | **data.departure.timezone** | String | Current flight departure timezone and UTC offset |
| 1.4.5 | **data.departure.terminal** | String | Current flight departure terminal |
| 1.4.6 | **data.departure.gate** | String | Current flight departure gate |
| 1.4.7 | **data.departure.status** | String | Current flight departure status (e.g. On Time, Delayed, Cancelled) |
| 1.5 | **data.arrival** | Object | Information about the current flight arrival |
| 1.5.1 | **data.arrival.date** | String | Current flight scheduled arrival date |
| 1.5.2 | **data.arrival.scheduled** | String | Current flight scheduled arrival time |
| 1.5.3 | **data.arrival.estimated** | String | Current flight estimated arrival time |
| 1.5.4 | **data.arrival.timezone** | String | Current flight arrival timezone and UTC offset |
| 1.5.5 | **data.arrival.terminal** | String | Current flight arrival terminal |
| 1.5.6 | **data.arrival.gate** | String | Current flight arrival gate |
| 1.5.7 | **data.arrival.status** | String | Current flight arrival status (e.g. On Time, Delayed, Cancelled) |
| 1.6 | **data.progress** | Object | Current flight progress |
| 1.6.1 | **data.progress.percentage** | Integer | Percentage of the current flight completed |
| 1.6.2 | **data.progress.status** | String | Status of the current flight progress (e.g. landing in 7h 59m) |
| 1.7 | **data.aircraft** | Object | Details about the aircraft |
| 1.7.1 | **data.aircraft.type** | String | Aircraft type |
| 1.7.2 | **data.aircraft.transponder** | String | Aircraft’s ICAO 24-bit transponder code |
| 1.7.3 | **data.aircraft.serial** | String | Serial number of the aircraft |
| 1.8 | **data.thisFlight** | Object | Details specific to the current flight |
| 1.8.1 | **data.thisFlight.flightNumber** | String | Current flight number |
| 1.9 | **data.otherFlights** | Array\[Object\] | Aircraft flight history |
| 1.9.1 | **data.otherFlights[].date** | String | Date of the flight |
| 1.9.2 | **data.otherFlights[].callsign** | String | Callsign for the flight |
| 1.9.3 | **data.otherFlights[].airlineLogo** | String | URL to the airline logo |
| 1.9.4 | **data.otherFlights[].origin** | String | Origin city and airport code |
| 1.9.5 | **data.otherFlights[].scheduledDeparture** | String | Scheduled departure time with timezone |
| 1.9.6 | **data.otherFlights[].actualDeparture** | String | Actual departure time with timezone |
| 1.9.7 | **data.otherFlights[].destination** | String | Destination city and airport code |
| 1.9.8 | **data.otherFlights[].scheduledArrival** | String | Scheduled arrival time with timezone |
| 1.9.9 | **data.otherFlights[].delay** | String | Delay status |
| 1.9.10 | **data.otherFlights[].status** | String | Status of the flight (e.g. Landed) |
| 1.9.11 | **data.otherFlights[].duration** | String | Flight duration |

### GET /api/flights

Returns the recent flight history for a given callsign/flight number. The relevant data is scraped from the [RadarBox](https://www.radarbox.com/) website using [Axios](https://www.npmjs.com/package/axios) and [Cheerio](https://www.npmjs.com/package/cheerio).

> [!WARNING]
> [Web Scraping Disclaimer](#get-apiregistration)

| Parameters | Type | Description | Example |
| ---------- | ---- | ----------- | ------- |
| **callsign** | String | Selected flight's callsign | AF201 |

Expected Output :

```
GET /api/flights/AF201
```

```javascript
{
    "flightHistoryData": [
        {
            "date": "2024 23 Oct",
            "callsign": "AF201",
            "origin": "Beijing (PEK/ZBAA)",
            "scheduledDeparture": "23:00 CST",
            "actualDeparture": "",
            "destination": "Paris (CDG/LFPG)",
            "scheduledArrival": "05:55 CEST",
            "aircraftType": "B772",
            "delay": "On time",
            "status": "Scheduled",
            "duration": "12h55m"
        },
        {
            "date": "2024 21 Oct",
            "callsign": "AF201",
            "origin": "Beijing (PEK/ZBAA)",
            "scheduledDeparture": "23:00 CST",
            "actualDeparture": "23:32 CST",
            "destination": "Paris (CDG/LFPG)",
            "scheduledArrival": "05:55 CEST",
            "aircraftType": "B772 (F-GSPO)",
            "delay": "On time",
            "status": "Est. Arrival 05:34 CEST",
            "duration": "12h34m"
        },
        {
            "date": "2024 20 Oct",
            "callsign": "AF201",
            "origin": "Beijing (PEK/ZBAA)",
            "scheduledDeparture": "23:00 CST",
            "actualDeparture": "23:15 CST",
            "destination": "Paris (CDG/LFPG)",
            "scheduledArrival": "05:55 CEST",
            "aircraftType": "B772 (F-GSPJ)",
            "delay": "On time",
            "status": "Landed 06:03 CEST",
            "duration": "12h28m"
        },
        {
            ...
        }
    ]
}
```

This example includes data for flights in the past, present, and upcoming schedules.

| Index | Property | Type | Description |
| ----- | -------- | ---- | ----------- |
| 0 | **flightHistoryData** | Array\[Object\] | List of historical flight data entries (Past, Present, and Future) |
| 0.1 | **flightHistoryData[].date** | String | Date of the flight |
| 0.2 | **flightHistoryData[].callsign** | String | Selected flight's callsign |
| 0.3 | **flightHistoryData[].origin** | String | Flight origin city and airport ICAO/IATA code |
| 0.4 | **flightHistoryData[].scheduledDeparture** | String | Flight scheduled departure time and local time zone |
| 0.5 | **flightHistoryData[].actualDeparture** | String | Flight actual departure time and local time zone |
| 0.6 | **flightHistoryData[].destination** | String | Flight destination city and airport ICAO/IATA code |
| 0.7 | **flightHistoryData[].scheduledArrival** | String | Flight scheduled arrival time and local time zone |
| 0.8 | **flightHistoryData[].aircraftType** | String | Flight aircraft type and registration |
| 0.9 | **flightHistoryData[].delay** | String | Flight delay status |
| 0.10 | **flightHistoryData[].status** | String | Flight status (e.g. Scheduled, Est. Arrival, Landed) |
| 0.11 | **flightHistoryData[].duration** | String | Total flight duration |
