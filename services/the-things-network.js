const waterfall = require('async/waterfall');
const ttn = require('ttn');

const mongoose = require('mongoose');
const Log = mongoose.model('Log');
const Device = mongoose.model('Device');
const Measurement = mongoose.model('Measurement');
const DeviceController = require('../api/v1/device/device.controller');
const MeasurementController = require('../api/v1/measurement/measurement.controller');

const ProtocolDecoder = require('../helpers/ProtocolDecoder');

module.exports = class TTNService {
  static async connectToTTN(appKey, accessKey) {
    ttn.data(appKey, accessKey)
      .then((client) => {
        client.on('uplink', (devId, payload) => {
          console.log(payload);
          console.log();

          const data = ProtocolDecoder.decode(payload.payload_raw.toString('hex'));

          async function checkIfDeviceExists() {
            const device = await DeviceController.CheckIfDeviceExists(data.appId, data.devId);
            return device;
          }

          async function createOrGetDevice(foundDevice) {
            if (foundDevice) {
              console.log('Device found');
              return foundDevice;
            }

            console.log('Creating device');
            const device = await DeviceController.CreateDevice(new Device({
              name: data.deviceId,
              appId: data.appId,
              devId: data.devId,
              hardwareSerial: data.hardwareSerial,
              deviceValuesUpdatedAt: null,
              sensorValuesUpdatedAt: null,
            }));
            return device;
          }

          async function updateDeviceAndCreateMeasurements(device) {
            console.log(device);
            if (data.sensors.length > 0) {
              data.sensors.forEach((sensor) => {
                let deviceValuesUpdated = false;
                let sensorValuesUpdated = false;

                switch (sensor.gateId) {
                  case 13: // GPS - Longitude
                    deviceValuesUpdated = true;
                    break;
                  case 14: // GPS - Latitude
                    deviceValuesUpdated = true;
                    break;
                  case 15: // GPS - Altitude
                    deviceValuesUpdated = true;
                    break;
                  case 16: // Battery
                    deviceValuesUpdated = true;
                    device.battery = sensor.value;
                    break;
                  default:
                    sensorValuesUpdated = true;
                    MeasurementController.CreateMeasurement(new Measurement({
                      deviceId: device._id,
                      gateId: sensor.gateId,
                      substanceId: sensor.id,
                      value: sensor.value,
                      createdAt: data.time,
                    })).then((test) => {
                      console.log(test);
                    });
                    break;
                }

                if (deviceValuesUpdated) device.deviceValuesUpdatedAt = data.time;
                if (sensorValuesUpdated) device.sensorValuesUpdatedAt = data.time;

                Device.findByIdAndUpdate(device._id, device, (err, res) => {
                  if (err) {
                    console.log('Device could not be updated.');
                  }
                  console.log(res);
                });
              });
            }
          }

          console.log('data');
          console.log(data);

          if (data !== null) {
            data.appId = payload.app_id;
            data.devId = payload.dev_id;
            data.hardwareSerial = payload.hardware_serial;
            data.time = payload.metadata.time;
            console.log(data);

            await checkIfDeviceExists,
              createOrGetDevice,
              updateDeviceAndCreateMeasurements,


              waterfall([
              checkIfDeviceExists,
              createOrGetDevice,
              updateDeviceAndCreateMeasurements,
            ], (err, result) => {
              if (err) console.log(err);
            });
          }
        });
      })
      .catch((error) => {
        console.error(error);
        console.error('Could not connect to The Things Network. Check your credentials.');
      });
  }
};
