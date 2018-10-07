const mongoose = require('mongoose');
const Measurement = require('./measurement.model');

exports.GetMeasurements = (req, res) => {
  Measurement.find({}, (err, task) => {
    if (err) res.send(err);
    res.json(task);
  });
};

exports.GetMeasurementsByDevice = (req, res) => {
  const deviceId = req.params.device_id;
  //const firstDate = req.params.first_date;
  //const lastDate = req.params.last_date;

  Measurement
    .where('device_id', deviceId)
    //.where('createdAt').gte(firstDate).lte(lastDate)
    .exec((err, result) => {
      if (err) res.send(err);
      res.json(result);
    });
};
