[![Linkedin](https://img.shields.io/badge/style--5eba00.svg?label=Thomas%20Mercuriot&logo=linkedin&style=social)](https://www.linkedin.com/in/thomasmercuriot/ "Let's connect on Linkedin !")
[![Front-End](https://badgen.net/badge/>/Read%20the%20Front-End%20documentation?icon=github&label/)](https://github.com/thomasmercuriot/react-flight-radar "Read the Front-End Documentation")

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

Retrieves live airspace data for a specified geographic area using the [OpenSky%20Network%20REST%20API](https://openskynetwork.github.io/opensky-api/index.html), which collects data from the ADS-B[^3] Exchange. The data is filtered to include only the relevant information needed for this project. The geographic area is defined by box coordinates, which are passed as query parameters from the front-end.

[^3]: [Wikipedia : Automatic Dependant Surveillance Broadcast (ADS-B)](https://fr.wikipedia.org/wiki/Automatic_dependent_surveillance-broadcast)

| Parameters | Type | Description | Example |
| lamin | Float | Minimum Latitude (Box Coordinates) | 48.6278 |
| lomin | Float | Minimum Longitude (Box Coordinates) | 2.2547 |
| lamax | Float | Maximum Latitude (Box Coordinates) | 49.3854 |
| lomax | Float | Maximum Longitude (Box Coordinates) | 2.8453 |

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
| 10 | **squawk** | Integer | The transponder code |
