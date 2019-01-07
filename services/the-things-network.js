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
          console.log(payload);

          // Packet (hex size)
          const sizePackageSize = 2;
          const sizeHash = 2;
          const sizeStop = 2;

          // Sensor packet (hex size)
          const sizeSensorPackageSize = 1;
          const sizeSensorGate = 1;
          const sizeSensorAbsoluteValueSize = 1;
          const sizeSensorDecimalValueSize = 1;
          const sizeSensorId = 2;
          const sizeSensorHash = 2;
          const sizeSensorAbsoluteValue = 0;
          const sizeSensorDecimalValue = 0;

          function hex2bin(hex) {
            return (parseInt(hex, 16).toString(2)).padStart(8, '0');
          }

          function bin2dec(bin) {
            return parseInt(bin, 2);
          }

          function hex2dec(hex) {
            return parseInt(hex, 16);
          }

          // Convert buffer to string
          let payloadHex = payload.payload_raw.toString('hex');
          const countBytes = payloadHex.length / 2;

          console.log();
          console.log(payloadHex);
          console.log();

          const packageSizeHex = payloadHex.slice(0, sizePackageSize);
          const packageSizeDec = hex2dec(packageSizeHex);
          payloadHex = payloadHex.slice(sizePackageSize, payloadHex.length);

          console.log('Package size:');
          console.log(`payload: ${payloadHex}\t\t hex: ${packageSizeHex}\t\t\t dec: ${packageSizeDec}\t\t\t bin: ${hex2bin(packageSizeHex)}`);

          const packageStopHex = payloadHex.slice(-sizeStop);
          const packageStopDec = hex2dec(packageStopHex);
          payloadHex = payloadHex.slice(0, payloadHex.length - sizeStop);

          console.log('Package stop:');
          console.log(`payload: ${payloadHex}\t\t\t hex: ${packageStopHex}\t\t\t dec: ${packageStopDec}\t\t\t bin: ${hex2bin(packageStopHex)}`);

          const packageHashHex = payloadHex.slice(-sizeHash);
          const packageHashDec = hex2dec(packageHashHex);
          payloadHex = payloadHex.slice(0, payloadHex.length - sizeHash);

          console.log('Package hash:');
          console.log(`payload: ${payloadHex}\t\t\t hex: ${packageHashHex}\t\t\t dec: ${packageHashDec}\t\t\t bin: ${hex2bin(packageHashHex)}`);

          // Get all sensor data
          while (payloadHex.length > 0) {
            const sensorValue = {};

            const sensorPackageSizeHex = payloadHex.slice(0, sizeSensorPackageSize);
            const sensorPackageSizeDec = hex2dec(sensorPackageSizeHex);
            payloadHex = payloadHex.slice(sizeSensorPackageSize, payloadHex.length);
            sensorValue.size = sensorPackageSizeDec;

            console.log('Sensor package size:');
            console.log(`payload: ${payloadHex}\t\t\t hex: ${sensorPackageSizeHex}\t\t\t\t dec: ${sensorPackageSizeDec}\t\t\t\t bin: ${hex2bin(sensorPackageSizeHex)}`);

            const sensorGateHex = payloadHex.slice(0, sizeSensorGate);
            const sensorGateDec = hex2dec(sensorGateHex);
            payloadHex = payloadHex.slice(sizeSensorGate, payloadHex.length);
            sensorValue.gateId = sensorGateDec;

            console.log('Sensor gate:');
            console.log(`payload: ${payloadHex}\t\t\t hex: ${sensorGateHex}\t\t\t\t dec: ${sensorGateDec}\t\t\t\t bin: ${hex2bin(sensorGateHex)}`);

            const sensorAbsValueSizeHex = payloadHex.slice(0, sizeSensorAbsoluteValueSize);
            const sensorAbsValueSizeDec = hex2dec(sensorAbsValueSizeHex);
            payloadHex = payloadHex.slice(sizeSensorAbsoluteValueSize, payloadHex.length);
            sensorValue.absSize = sensorAbsValueSizeDec;

            console.log('Sensor absolute value size:');
            console.log(`payload: ${payloadHex}\t\t\t hex: ${sensorAbsValueSizeHex}\t\t\t\t dec: ${sensorAbsValueSizeDec}\t\t\t\t bin: ${hex2bin(sensorAbsValueSizeHex)}`);

            const sensorDecValueSizeHex = payloadHex.slice(0, sizeSensorDecimalValueSize);
            const sensorDecValueSizeDec = hex2dec(sensorDecValueSizeHex);
            payloadHex = payloadHex.slice(sizeSensorDecimalValueSize, payloadHex.length);
            sensorValue.decSize = sensorDecValueSizeDec;

            console.log('Sensor decimal value size:');
            console.log(`payload: ${payloadHex}\t\t\t hex: ${sensorDecValueSizeHex}\t\t\t\t dec: ${sensorDecValueSizeDec}\t\t\t bin: ${hex2bin(sensorDecValueSizeHex)}`);

            const sensorIdHex = payloadHex.slice(0, sizeSensorId);
            const sensorIdDec = hex2dec(sensorIdHex);
            payloadHex = payloadHex.slice(sizeSensorId, payloadHex.length);
            sensorValue.id = sensorIdDec;

            console.log('Sensor id:');
            console.log(`payload: ${payloadHex}\t\t\t\t hex: ${sensorIdHex}\t\t\t dec: ${sensorIdDec}\t\t\t bin: ${hex2bin(sensorIdHex)}`);

            const sensorAbsValueHex = payloadHex.slice(0, sensorAbsValueSizeDec);
            const sensorAbsValueDec = hex2dec(sensorAbsValueHex);
            payloadHex = payloadHex.slice(sensorAbsValueSizeDec, payloadHex.length);
            sensorValue.absValue = sensorAbsValueDec;

            console.log('Sensor absolute value:');
            console.log(`payload: ${payloadHex}\t\t\t\t hex: ${sensorAbsValueHex}\t\t\t dec: ${sensorAbsValueDec}\t\t\t bin: ${hex2bin(sensorAbsValueHex)}`);

            const sensorDecValueHex = payloadHex.slice(0, sensorDecValueSizeDec);
            const sensorDecValueDec = hex2dec(sensorDecValueHex);
            payloadHex = payloadHex.slice(sensorDecValueSizeDec, payloadHex.length);
            sensorValue.decValue = sensorDecValueDec;

            console.log('Sensor decimal value:');
            console.log(`payload: ${payloadHex}\t\t\t\t hex: ${sensorDecValueHex}\t\t\t\t dec: ${sensorDecValueDec}\t\t\t bin: ${hex2bin(sensorDecValueHex)}`);

            sensorValue.value = `${sensorValue.absValue}.${sensorValue.decValue}`;

            const sensorHashHex = payloadHex.slice(0, sizeSensorHash);
            const sensorHashDec = hex2dec(sensorHashHex);
            payloadHex = payloadHex.slice(sizeSensorHash, payloadHex.length);
            sensorValue.hash = sensorHashDec;

            console.log('Sensor hash:');
            console.log(`payload: ${payloadHex}\t\t\t\t hex: ${sensorHashHex}\t\t\t\t dec: ${sensorHashDec}\t\t\t bin: ${hex2bin(sensorHashHex)}`);

            console.log(sensorValue);
          }

          console.log(payloadHex);


          /* async function checkIfDeviceExists() {
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
          }); */
        });
      })
      .catch((error) => {
        console.error(error);
        console.error('Could not connect to The Things Network. Check your credentials.');
      });
  }
};
