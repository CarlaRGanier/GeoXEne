const express = require('express');
const app = express();
const cors = require('cors');
const proxy = require('express-http-proxy');
const cache = require('apicache').middleware;
const md5 = require('crypto-js/md5');
const base64 = require ('crypto-js/enc-base64');
const db = require('better-sqlite3')('database.db');

app.use(cors('http://localhost'));

let hash = (x) => base64.stringify(md5(x));

let emulate = (req, res, next) => {
  let location = db.prepare(`SELECT * FROM localization WHERE address=? `).get(req);
  db.close();
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
