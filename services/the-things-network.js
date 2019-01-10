/* eslint-disable no-underscore-dangle */
const ttn = require('ttn');

const mongoose = require('mongoose');
const Log = mongoose.model('Log');
const Device = mongoose.model('Device');
const Measurement = mongoose.model('Measurement');

const ProtocolDecoder = require('../helpers/ProtocolDecoder');

module.exports = class TTNService {
  static async connectToTTN(appKey, accessKey) {
    function processSensorData(sensorData, deviceToUpdate, time) {
      const device = deviceToUpdate;
      let deviceValuesUpdated = false;
      let sensorValuesUpdated = false;

      if (sensorData.length > 0) {
        sensorData.forEach((sensor) => {
          switch (sensor.gateId) {
            case 12: // GPS - Longitude
              deviceValuesUpdated = true;
              break;
            case 13: // GPS - Latitude
              deviceValuesUpdated = true;
              break;
            case 14: // GPS - Altitude
              deviceValuesUpdated = true;
              break;
            case 15: // Battery
              device.battery = sensor.value;
              deviceValuesUpdated = true;
              break;
            default:
              sensorValuesUpdated = true;
              Measurement.create({
                deviceId: device._id,
                gateId: sensor.gateId,
                substanceId: sensor.id,
                value: sensor.value,
                createdAt: time,
              });
              break;
          }
        });
      }

      if (deviceValuesUpdated) device.deviceValuesUpdatedAt = time;
      if (sensorValuesUpdated) device.sensorValuesUpdatedAt = time;

      Device.findByIdAndUpdate(device._id, device).exec();
    }

    ttn.data(appKey, accessKey)
      .then((client) => {
        client.on('uplink', async (devId, payload) => {
          const data = ProtocolDecoder.decode(payload.payload_raw.toString('hex'));

          if (!data) {
            console.log('Check failed.');
            return;
          }

          let device = await Device.findOne({ appId: payload.app_id, devId: payload.dev_id });

          if (!device) {
            device = await Device.create({
              name: payload.dev_id,
              appId: payload.app_id,
              devId: payload.dev_id,
              hardwareSerial: payload.hardware_serial,
            });
          }
          console.log(data);

          processSensorData(data.sensors, device, payload.metadata.time);
        });
      });
  }
};
