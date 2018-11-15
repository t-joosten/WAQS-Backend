const app = require('express')();
const server = require('http').Server(app);
global.io = require('socket.io')(server);

const dotenv = require('dotenv');
const chalk = require('chalk');
const cors = require('cors');

require('./db/models/index');
const mongoose = require('mongoose');
const Measurement = require('./api/v1/measurement/measurement.model');
const routes = require('./routes');
const apiRoutes = require('./api/v1/routes');
const services = require('./services');


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

/** Load environment variables from .env file, where API keys and passwords are configured. */
dotenv.load({ path: '.env' });

/** Connect to MongoDB. */
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(process.env.MONGODB_URI_DEV, { useNewUrlParser: true });
} else {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
}

mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/** Initiate connection with The Things Network */
services.ttnService.connectToTTN(process.env.TTN_APP_ID, process.env.TTN_ACCESS_KEY);

/** Connect all our routes to our application */
app.use('/api/v1', apiRoutes);
app.use('/', routes);

app.use('/create-test-data', async (req, res) => {
  const startDate = new Date(2018, 1, 1, 0, 0, 0);
  const currentDate = new Date(2018, 1, 1, 0, 0, 0);
  const endDate = new Date(2018, 11, 1, 0, 0, 0);

  const deviceId = '5bec0aa848bd9a4c50fc5dd1';

  for (let i = 0; i <= 300; i++) {
    await Measurement.create({
      device: deviceId,
      createdAt: new Date(startDate.getTime() + (i * 86400000)),
      values: {
        Temperature: Math.floor((Math.random() * 100) + 1),
      },
    }, (err, createdMeasurement) => {
      if (err) return console.log(err);
      console.log(createdMeasurement);
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  /* while (currentDate < endDate) {
    console.log(currentDate);
    await Measurement.create({
      device: deviceId,
      createdAt: currentDate,
      values: {
        Temperature: Math.floor((Math.random() * 100) + 1),
      },
    }, (err, createdMeasurement) => {
      if (err) return console.log(err);
      console.log(createdMeasurement);
    });

    console.log('next date');

    currentDate.setDate(currentDate.getDate() + 1);
  } */
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(process.env.PORT || 4000, () => console.log(`App listening on port ${process.env.PORT}, open your browser on http://localhost:${process.env.PORT}/`));
