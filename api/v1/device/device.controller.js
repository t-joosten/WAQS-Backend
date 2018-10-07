const mongoose = require('mongoose');
const Device = require('./device.model');

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
  Device.find({}, (err, device) => {
    if (err) res.send(err);
    res.json(device);
  });
};

exports.CreateDevice = (req, res) => {
  const newDevice = new Device(req.body);
  newDevice.save((err, device) => {
    if (err) res.send(err);
    res.json(device);
  });
};

exports.UpdateDevice = (req, res) => {
  res.json({ message: 'Update device not implemented.' });
};

exports.DeleteDevice = (req, res) => {
  res.json({ message: 'Delete device not implemented.' });
};
