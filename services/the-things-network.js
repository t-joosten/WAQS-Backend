const ttn = require('ttn');

module.exports = class TTNService {
  constructor() {
    console.log('TTN Service initiated');
  }

  static connectToTTN(appKey, accessKey) {
    ttn.data(appKey, accessKey)
      .then((client) => {
        client.on('uplink', (devID, payload) => {
          console.log('Received uplink from', devID);
          console.log(payload);

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
}
