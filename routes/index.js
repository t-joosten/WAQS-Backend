const routes = require('express').Router();

const mongoose = require('mongoose');
const Log = mongoose.model('Log');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.get('/logs', (req, res) => {
  Log.find({}).sort({ createdAt: 'desc' }).exec((err, logs) => {
    res.send(logs);
  });
});

module.exports = routes;
