const ttn = require('ttn');

const mongoose = require('mongoose');
const Log = mongoose.model('Log');
const Device = mongoose.model('Device');
const Measurement = require('../api/v1/measurement/measurement.model');

module.exports = class TTNService {
  static connectToTTN(appKey, accessKey) {
    ttn.data(appKey, accessKey)
      .then((client) => {
        client.on('uplink', (devID, payload) => {
          console.log('Received uplink from', devID);
          console.log(payload);

          const log = new Log({ type: 'TTN LOG', message: payload }).save();
          console.log(log);

          Device.findOne({ appId: payload.app_id, devId: payload.dev_id }, (err, device) => {
            if (device === null) {
              console.log('test');
              const newDevice = new Device({
                name: payload.dev_id,
                appId: payload.app_id,
                devId: payload.dev_id,
                hardwareSerial: payload.hardware_serial,
              });
              newDevice.save((err, createdDevice) => {
                console.log(createdDevice);
                if (createdDevice) {
                  console.log(createdDevice);
                  const newMeasurement = new Measurement({
                    device: createdDevice._id,
                    values: payload.payload_fields,
                  });
                  newMeasurement.save((err, createdMeasurement) => {
                    console.log(createdMeasurement);
                  });
                }
              });
            } else {
              console.log(device);
              const newMeasurement = new Measurement({
                device: device._id,
                values: payload.payload_fields,
              });
              newMeasurement.save((err, createdMeasurement) => {
                console.log(createdMeasurement);
              });
            }
          });

          const fields = payload.payload_fields;

          const humidity = fields.Humidity;
          const temperature = fields.Temperature;

          console.log(`Humidity: ${humidity}`);
          console.log(`Temperature: ${temperature}`);
        });
      })
      .catch((error) => {
        console.error('Error', error);
        process.exit(1);
      });
  }
};
