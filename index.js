const app = require('express')();
const server = require('http').Server(app);
global.io = require('socket.io')(server);
require('dotenv').config();
const chalk = require('chalk');
const cors = require('cors');

require('./db/models/index');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const Measurement = require('./api/v1/measurement/measurement.model');
const Device = require('./api/v1/device/device.model');
const routes = require('./routes');
const apiRoutes = require('./api/v1/routes');
const services = require('./services');

mongoose.Promise = require('bluebird');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: 'false' }));

/** Setup CORS */
// const whitelist = ['http://localhost:4200', 'undefined'];
const corsOptions = {
  credentials: true,
  /* origin: (origin, callback) => {
    console.log(origin);
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }, */
};

app.use(cors(corsOptions));

/** Connect to MongoDB. */
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(process.env.MONGODB_URI_DEV, { useNewUrlParser: true, promiseLibrary: require('bluebird') }).then(() => console.log('connection succesful'))
    .catch(err => console.error(err));
} else {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, promiseLibrary: require('bluebird') }).then(() => console.log('connection succesful'))
    .catch(err => console.error(err));
}

mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/** Initiate connection with The Things Network */
try {
  services.ttnService.connectToTTN(process.env.TTN_APP_ID, process.env.TTN_ACCESS_KEY);
} catch (err) {
  console.log(err);
}

/** Connect all our routes to our application */
app.use('/api/v1', apiRoutes);
app.use('/', routes);

app.use(passport.initialize());

app.use('/create-test-data', async (req, res) => {
  const startDate = new Date(2018, 1, 1, 0, 0, 0);
  const currentDate = new Date(2018, 1, 1, 0, 0, 0);

  Device.create({
    name: 'IOT Stadslab',
    appId: 'iot_lab',
    devId: 'device_1',
    lat: 51.682369,
    long: 5.295309,
    hardwareSerial: '00E12B4CEABA61AD',
  }, (err, createdDevice) => {
    if (err) return console.log(err);
    for (let i = 0; i <= 300; i += 1) {
      Measurement.create({
        device: createdDevice._id,
        createdAt: new Date(startDate.getTime() + (i * 86400000)),
        values: {
          Temperature: Math.floor((Math.random() * 4) + 19),
          pH: Math.floor((Math.random() * 5) + 3),
          O2: Math.floor((Math.random() * 8) + 5),
        },
      }, (err, createdMeasurement) => {
        if (err) return console.log(err);
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.send('done');
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(process.env.PORT || 4000, () => console.log(`App listening on port ${process.env.PORT}, open your browser on http://localhost:${process.env.PORT}/`));
