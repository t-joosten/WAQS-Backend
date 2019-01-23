const mongoose = require('mongoose');
const Device = require('./device.model');
const Measurement = require('../measurement/measurement.model');

exports.GetDevice = (req, res) => {
  Device.findById(req.params.id, (err, device) => {
    if (err) res.send(err);
    res.json(device);
  });
};

exports.GetDeviceAndMeasurements = (req, res) => {
  Device.findById(req.params.id).populate('measurements').exec((err, device) => {
    if (err) res.send(err);
    res.json(device);
  });
};

exports.GetDevices = (req, res) => {
  if (req.query.all) {
    Device.find({}, (err, result) => {
      if (err) res.send(err);
      res.json(result);
    });
  } else {
    Device.paginate({}, { page: req.query.page, limit: 8 }, (err, result) => {
      if (err) res.send(err);
      res.json(result);
    });
  }
};

exports.CreateDevice = async (device) => {
  try {
    await Device.create(device, (err, createdDevice) => {
      if (err) return console.log(err);
      return createdDevice;
    });
  } catch (err) {
    console.log(err);
  }
};

exports.UpdateDevice = (req, res, next) => {
  try {
    if (req.body.updatedAt) req.body.updatedAt = new Date();
    Device.findByIdAndUpdate(req.params.id, req.body, (err, device) => {
      if (err) {
        res.json({ success: false, message: 'Device could not be updated.' });
      }
      res.json({ success: true, message: 'Device has been updated.' });
    });
  } catch (err) {
    res.json({ success: false, message: 'Device could not be updated.' });
  }
};

exports.DeleteDevice = (req, res, next) => {
  try {
    Device.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.json({ success: false, message: 'Device could not be deleted.' });
      }
      Measurement.remove({ deviceId: req.params.id }, (err) => {
        if (err) console.log(err);
      });
      res.json({ success: true, message: 'Device has been deleted.' });
    });
  } catch (err) {
    res.json({ success: false, message: 'Device could not be deleted.' });
  }
};

exports.CheckIfDeviceExists = async (appId, deviceId) => {
  try {
    let device;

    await Device.findOne({ appId, devId: deviceId }, (err, res) => {
      device = res;
    });

    return device;
  } catch (err) {
    console.log(err);
  }
};

exports.GetOrCreateDevice = async (device) => {
  try {
    Device.findOneAndUpdate(
      { appId: device.appId, devId: device.devId }, // find a document with that filter
      device, // document to insert when nothing was found
      { upsert: true, new: true, runValidators: true }, // options
      (err, doc) => { // callback
        if (err) {
          console.log('Could not find or create device');
        } else {
          return doc;
        }
      },
    );
  } catch (e) {
    console.log('Can not create device.');
  }
};
