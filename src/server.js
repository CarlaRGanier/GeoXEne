const express = require('express');
const app = express();
const cors = require('cors');
const proxy = require('express-http-proxy');
const cache = require('apicache').middleware;
const md5 = require('crypto-js/md5');
const base64 = require ('crypto-js/enc-base64');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db',sqlite3.OPEN_READWRITE);

db.run(`INSERT INTO localization (address, lat, lng) VALUES ("Tombe 4, Nécropole au Nord de l'Eridanos, Kerameikos",37.97821996444386,23.71865999861794)`);


const geocoding = {
  "Tombe 2, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97824388117687, lng: 23.718648807908984 },
  "Tombe 3, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97821996444386, lng: 23.71865999861794 },
  "Tombe 4, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.978240496693424, lng: 23.718688698474313 },
  "Tombe 5, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97821732623209, lng: 23.71872850041234 },
  "Tombe 6, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.978204131822544, lng: 23.718751193952546 },
  "Tombe 7, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97819673199066, lng: 23.718772651624665 },
  "Tombe 8, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97819250351496, lng: 23.71879317735662 },
  "Tombe 9, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.978261047642185, lng: 23.718681612577445 },
  "Tombe 10, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97825472162928, lng: 23.71872084517933 },
  "Tombe 11, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97825049315692, lng: 23.718732915119897 },
  "Tombe 12, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.978281389709856, lng: 23.71870015217474 },
  "Tombe 13, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97830253206032, lng: 23.71870015217474 },
  "Tombe 14, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.978307817647, lng: 23.71872697426489 },
  "Tombe 15, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97829196088586, lng: 23.71873099757841 },
  "Tombe 16, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.978275047003535, lng: 23.718745749727994 },
  "Tombe 17, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97826553294301, lng: 23.718756478564053 },
  "Tombe 18, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97819250351496, lng: 23.71879317735662 },
  "Tombe 19, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.978261047642185, lng: 23.718681612577445 },
  "Tombe 20, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97825472162928, lng: 23.71872084517933 },
  "Tombe 21, Nécropole au Nord de l'Eridanos, Kerameikos": { lat: 37.97825049315692, lng: 23.718732915119897 },
  "Tombe 4, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.978724672859826, lng: 23.716668995127026 },
  "Tombe 5, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.978724672859826, lng: 23.71667301844055 },
  "Tombe 6, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97872678708238, lng: 23.716675700649564 },
  "Tombe 7, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97871093041175, lng: 23.716654242977445 },
  "Tombe 11, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97873630108311, lng: 23.716681065067593 },
  "Tombe 12, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.978724672859826, lng: 23.716695817217175 },
  "Tombe 13, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.978723615748535, lng: 23.716702522739713 },
  "Tombe 14, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.978720444414535, lng: 23.716713251575772 },
  "Tombe 15, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.978709873300254, lng: 23.716695817217175 },
  "Tombe 16, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97870035929609, lng: 23.71669849942619 },
  "Tombe 17, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.9787056448541, lng: 23.71668374727661 },
  "Tombe 18, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97870035929609, lng: 23.7166824061721 },
  "Tombe 19, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97869401662599, lng: 23.716681065067593 },
  "Tombe 20, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.978688731067116, lng: 23.716679723963086 },
  "Tombe 22, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.978715158857575, lng: 23.71674543808395 },
  "Tombe 24, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.978718330191796, lng: 23.716722639307324 },
  "Tombe 25, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.9787056448541, lng: 23.716733368143384 },
  "Tombe 26, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97869824507278, lng: 23.716717274889294 },
  "Tombe 27, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97869507373771, lng: 23.716722639307324 },
  "Tombe 28, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97869295951424, lng: 23.716728003725354 },
  "Tombe 29, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97869401662599, lng: 23.7167360503524 },
  "Tombe 30, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.978701416407745, lng: 23.716738732561414 },
  "Tombe 31, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97869930218445, lng: 23.716749461397473 },
  "Tombe 32, Nécropole au Sud de l'Eridanos, Kerameikos": { lat: 37.97869507373771, lng: 23.716744096979443 },
  "Société académique de l'Aube, Troyes": { lat: 48.30125604190763, lng: 4.080524344621788 },
};

app.use(cors('http://localhost'));

let hash = (x) => base64.stringify(md5(x));

let emulate = (req, res, next) => {
  let location = geocoding[req.query.address];
  if (location || !req.query.address) {
    let place_id = hash(req.query.address);
    let results = (location) ? [{geometry: {location}, place_id}] : [];
    res.json({results});
  } else {
    next();
  }
}

let transmit = proxy('https://maps.googleapis.com', {
  proxyReqPathResolver: (x) => `/maps/api/geocode${x.url}`
});

let sendAddresses = (_, res) => res.json(Object.keys(geocoding));

app.get('/json', cache('15 minutes'), emulate, transmit);
app.get('/addresses', sendAddresses);
app.use(express.static('public'));

app.listen(3000);
console.log("Test it on http://localhost:3000/");
