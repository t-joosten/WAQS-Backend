const mongoose = require('mongoose');
const Device = require('../device/device.model');
const User = require('../../../models/User');

exports.GetSearchResults = (req, res) => {
  const searchQuery = req.params.id;
  try {
    Promise.all([
      Device.find({ name: new RegExp(searchQuery, 'ig') }).limit(20).exec(),
      User.find({ fullName: new RegExp(searchQuery, 'ig') }).limit(20).exec(),
    ])
      .then((results) => {
        res.json(results);
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: 'Could not get search results' });
      });
  } catch (err) {
    console.log(err);
    res.json({ message: 'Could not get search results' });
  }
};
