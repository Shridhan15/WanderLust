const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap', // free and no API key needed
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
