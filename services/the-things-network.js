const ttn = require('ttn');

const mongoose = require('mongoose');
const Log = mongoose.model('Log');

module.exports = class TTNService {
  static connectToTTN(appKey, accessKey) {
    ttn.data(appKey, accessKey)
      .then((client) => {
        client.on('uplink', (devID, payload) => {
          console.log('Received uplink from', devID);
          console.log(payload);

          const log = new Log({ type: 'TTN LOG', message: payload }).save();
          console.log(log);

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
