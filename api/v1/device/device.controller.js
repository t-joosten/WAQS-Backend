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

exports.CreateDevice = async (newDevice) => {
  try {
    let device;

    await newDevice.save((err, createdDevice) => {
      device = createdDevice;
    });

    return device;
  } catch (err) {
    console.log(err);
  }
};

exports.UpdateDevice = (req, res) => {
  res.json({ message: 'Update device not implemented.' });
};

exports.DeleteDevice = (req, res) => {
  res.json({ message: 'Delete device not implemented.' });
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
