const waterfall = require('async/waterfall');
const ttn = require('ttn');

const mongoose = require('mongoose');
const Log = mongoose.model('Log');
const Device = mongoose.model('Device');
const Measurement = mongoose.model('Measurement');
const DeviceController = require('../api/v1/device/device.controller');
const MeasurementController = require('../api/v1/measurement/measurement.controller');

module.exports = class TTNService {
  static connectToTTN(appKey, accessKey) {
    ttn.data(appKey, accessKey)
      .then((client) => {
        client.on('uplink', (devId, payload) => {
          async function checkIfDeviceExists() {
            const device = await DeviceController.CheckIfDeviceExists(payload.app_id, payload.dev_id);
            return device;
          }

          async function createOrGetDevice(foundDevice) {
            let device;

            if (foundDevice) {
              device = foundDevice;
            } else {
              device = await DeviceController.CreateDevice(new Device({
                name: payload.dev_id,
                appId: payload.app_id,
                devId: payload.dev_id,
                hardwareSerial: payload.hardware_serial,
              }));
            }

            return device;
          }

          async function createLog(device) {
            await new Log({ type: 'TTN LOG', message: payload }).save();
            return device;
          }

          async function createMeasurement(device) {
            if (!payload.payload_fields) { return; }

            await MeasurementController.CreateMeasurement(new Measurement({
              device: device._id,
              values: payload.payload_fields,
            }));
          }

          waterfall([
            checkIfDeviceExists,
            createOrGetDevice,
            createLog,
            createMeasurement,
          ], (err, result) => {
            if (err) console.log(err);
          });
        });
      })
      .catch((error) => {
        console.error('Error', error);
        process.exit(1);
      });
  }
};
