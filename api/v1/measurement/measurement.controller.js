const mongoose = require('mongoose');
const Measurement = require('./measurement.model');
const Device = require('../device/device.model');

exports.GetMeasurements = (req, res) => {
  try {
    Measurement.find({}, (err, task) => {
      if (err) res.send(err);
      res.json(task);
    });
  } catch (err) {
    res.json({ message: 'Something went wrong with getting the measurements.' });
  }
};

exports.GetMeasurementsByDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;

    // const firstDate = req.params.first_date;
    // const lastDate = req.params.last_date;

    await Measurement.find({ deviceId })
      // .where('createdAt').gte(firstDate).lte(lastDate)
      .exec((err, result) => {
        if (err) res.status(404).send(err);
        res.json(result);
      });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong with getting the measurements.' });
  }
};

exports.GetLastMeasurementsByDevice = (req, res) => {
  const deviceId = req.params.id;
  console.log(deviceId);
  Measurement.aggregate([{ $match: { deviceId } }, { $sort: { createdAt: -1 } }, { $group: { _id: '$gateId' } }])
    .then((docs) => {
      console.log(docs);
      res.json(docs);
    });


  /* .exec((err, result) => {
    if (err) res.send(err);
    console.log(result);
    res.json(result);
  }); */

  /* Measurement.find({ deviceId }).sort({ createdAt: -1 }).exec((err, result) => {
    if (err) res.send(err);
    res.json(result);
  }); */
};

exports.CreateMeasurement = async (newMeasurement) => {
  try {
    let measurement;

    await newMeasurement.save((err, createdMeasurement) => {
      measurement = createdMeasurement;
    });

    return measurement;
  } catch (err) {
    console.log(err);
    return { message: 'Could not create measurement.' };
  }
};
