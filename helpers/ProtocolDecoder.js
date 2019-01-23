const NumberConverter = require('./NumberConverter');

module.exports = {
  decode(hex) {
    if (hex === '') return null;
    const hexCharsPerByte = 2;
    // Packet (hex size)
    const sizePackageSize = 2;
    const sizeHash = 2;
    const sizeStop = 2;

    // Sensor packet (hex size)
    const sizeSensorPackageSize = 1;
    const sizeSensorGate = 1;
    const sizeSensorAbsoluteValueSize = 1;
    const sizeSensorDecimalValueSize = 1;
    const sizeSensorSubstanceId = 2;
    const sizeSensorHash = 2;

    const measurement = {};
    measurement.sensors = [];

    // Convert buffer to string
    let payloadHex = hex;

    measurement.payload = payloadHex;
    measurement.totalBytes = payloadHex.length / 2;

    // console.log();
    // console.log(payloadHex);
    // console.log();

    const packageSizeHex = payloadHex.slice(0, sizePackageSize);
    const packageSizeDec = NumberConverter.hex2dec(packageSizeHex);
    const packageHexStringToHash = payloadHex.slice(0, (packageSizeDec * hexCharsPerByte) - sizeHash - sizeStop);
    payloadHex = payloadHex.slice(sizePackageSize, payloadHex.length);

    measurement.packageSize = packageSizeDec;

    // console.log('Package size:');
    // console.log(`payload: ${payloadHex}\t\t hex: ${packageSizeHex}\t\t\t dec: ${packageSizeDec}\t\t\t bin: ${NumberConverter.hex2bin(packageSizeHex)}`);

    const packageStopHex = payloadHex.slice(-sizeStop);

    if (!this.isStopHex(packageStopHex)) return null;

    const packageStopDec = NumberConverter.hex2dec(packageStopHex);
    payloadHex = payloadHex.slice(0, payloadHex.length - sizeStop);

    measurement.packageStop = packageStopDec;

    // console.log('Package stop:');
    // console.log(`payload: ${payloadHex}\t\t\t hex: ${packageStopHex}\t\t\t dec: ${packageStopDec}\t\t\t bin: ${NumberConverter.hex2bin(packageStopHex)}`);

    const packageHashHex = payloadHex.slice(-sizeHash);
    const packageHashDec = NumberConverter.hex2dec(packageHashHex);
    payloadHex = payloadHex.slice(0, payloadHex.length - sizeHash);

    // console.log(packageHashDec);
    // console.log(this.calculateHash(packageHexStringToHash));
    // Check package hash
    // if (!this.matchHashes(packageHashDec, this.calculateHash(packageHexStringToHash))) return null;

    measurement.hash = packageHashDec;

    // console.log('Package hash:');
    // console.log(`payload: ${payloadHex}\t\t\t hex: ${packageHashHex}\t\t\t dec: ${packageHashDec}\t\t\t bin: ${NumberConverter.hex2bin(packageHashHex)}`);

    // Get all sensor data
    while (payloadHex.length > 0) {
      const sensorValue = {};

      const sensorPackageSizeHex = payloadHex.slice(0, sizeSensorPackageSize);
      const sensorPackageSizeDec = NumberConverter.hex2dec(sensorPackageSizeHex);
      const sensorPackageHexStringToHash = payloadHex.slice(0, ((sensorPackageSizeDec * hexCharsPerByte) - sizeSensorHash));
      payloadHex = payloadHex.slice(sizeSensorPackageSize, payloadHex.length);
      sensorValue.size = sensorPackageSizeDec;

      // console.log('Sensor package size:');
      // console.log(`payload: ${payloadHex}\t\t\t hex: ${sensorPackageSizeHex}\t\t\t\t dec: ${sensorPackageSizeDec}\t\t\t\t bin: ${NumberConverter.hex2bin(sensorPackageSizeHex)}`);

      const sensorGateHex = payloadHex.slice(0, sizeSensorGate);
      const sensorGateDec = NumberConverter.hex2dec(sensorGateHex);
      payloadHex = payloadHex.slice(sizeSensorGate, payloadHex.length);
      sensorValue.gateId = sensorGateDec;

      // console.log('Sensor gate:');
      // console.log(`payload: ${payloadHex}\t\t\t hex: ${sensorGateHex}\t\t\t\t dec: ${sensorGateDec}\t\t\t\t bin: ${NumberConverter.hex2bin(sensorGateHex)}`);

      const sensorAbsValueSizeHex = payloadHex.slice(0, sizeSensorAbsoluteValueSize);
      const sensorAbsValueSizeDec = NumberConverter.hex2dec(sensorAbsValueSizeHex);
      payloadHex = payloadHex.slice(sizeSensorAbsoluteValueSize, payloadHex.length);
      sensorValue.absSize = sensorAbsValueSizeDec;

      // console.log('Sensor absolute value size:');
      // console.log(`payload: ${payloadHex}\t\t\t hex: ${sensorAbsValueSizeHex}\t\t\t\t dec: ${sensorAbsValueSizeDec}\t\t\t\t bin: ${NumberConverter.hex2bin(sensorAbsValueSizeHex)}`);

      const sensorDecValueSizeHex = payloadHex.slice(0, sizeSensorDecimalValueSize);
      const sensorDecValueSizeDec = NumberConverter.hex2dec(sensorDecValueSizeHex);
      payloadHex = payloadHex.slice(sizeSensorDecimalValueSize, payloadHex.length);
      sensorValue.decSize = sensorDecValueSizeDec;

      // console.log('Sensor decimal value size:');
      // console.log(`payload: ${payloadHex}\t\t\t hex: ${sensorDecValueSizeHex}\t\t\t\t dec: ${sensorDecValueSizeDec}\t\t\t bin: ${NumberConverter.hex2bin(sensorDecValueSizeHex)}`);

      const sensorSubstanceIdHex = payloadHex.slice(0, sizeSensorSubstanceId);
      const sensorSubstanceIdDec = NumberConverter.hex2dec(sensorSubstanceIdHex);
      payloadHex = payloadHex.slice(sizeSensorSubstanceId, payloadHex.length);
      sensorValue.substanceId = sensorSubstanceIdDec;

      // console.log('Sensor id:');
      // console.log(`payload: ${payloadHex}\t\t\t\t hex: ${sensorSubstanceIdHex}\t\t\t dec: ${sensorSubstanceIdDec}\t\t\t bin: ${NumberConverter.hex2bin(sensorSubstanceIdHex)}`);

      // console.log(sensorAbsValueSizeDec * hexCharsPerByte);
      const sensorAbsValueHex = payloadHex.slice(0, sensorAbsValueSizeDec * hexCharsPerByte);
      const sensorAbsValueDec = NumberConverter.hex2dec(sensorAbsValueHex);
      payloadHex = payloadHex.slice(sensorAbsValueSizeDec * hexCharsPerByte, payloadHex.length);
      sensorValue.absValue = sensorAbsValueDec;

      // console.log('Sensor absolute value:');
      // console.log(`payload: ${payloadHex}\t\t\t\t hex: ${sensorAbsValueHex}\t\t\t dec: ${sensorAbsValueDec}\t\t\t bin: ${NumberConverter.hex2bin(sensorAbsValueHex)}`);

      if (sensorDecValueSizeDec !== 0) {
        const sensorDecValueHex = payloadHex.slice(0, sensorDecValueSizeDec * hexCharsPerByte);
        const sensorDecValueDec = NumberConverter.hex2dec(sensorDecValueHex);
        payloadHex = payloadHex.slice(sensorDecValueSizeDec * hexCharsPerByte, payloadHex.length);
        sensorValue.decValue = sensorDecValueDec;

        // console.log('Sensor decimal value:');
        // console.log(`payload: ${payloadHex}\t\t\t\t hex: ${sensorDecValueHex}\t\t\t\t dec: ${sensorDecValueDec}\t\t\t bin: ${NumberConverter.hex2bin(sensorDecValueHex)}`);

        sensorValue.value = `${sensorValue.absValue}.${sensorValue.decValue}`;
      } else {
        sensorValue.value = sensorValue.absValue;
      }

      const sensorHashHex = payloadHex.slice(0, sizeSensorHash);
      const sensorHashDec = NumberConverter.hex2dec(sensorHashHex);
      payloadHex = payloadHex.slice(sizeSensorHash, payloadHex.length);
      sensorValue.hash = sensorHashDec;

      // Check sensor package hash
      // if (!this.matchHashes(sensorHashDec, this.calculateHash(sensorPackageHexStringToHash))) return null;

      // console.log('Sensor hash:');
      // console.log(`payload: ${payloadHex}\t\t\t\t hex: ${sensorHashHex}\t\t\t\t dec: ${sensorHashDec}\t\t\t bin: ${NumberConverter.hex2bin(sensorHashHex)}`);

      measurement.sensors.push(sensorValue);
    }

    return measurement;
  },
  calculateHash(hexString) {
    const hexArray = hexString.match(/.{1,2}/g);
    let hexSum = '00';

    hexArray.forEach((value) => {
      hexSum = NumberConverter.sumHexString(hexSum, value);
    });

    return parseInt(NumberConverter.hex2dec(hexSum) / hexArray.length, 10);
  },
  matchHashes(hash, calculatedHash) {
    return hash === calculatedHash;
  },
  isStopHex(hex) {
    return hex.toLowerCase() === 'ff';
  },
};
