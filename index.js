const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');
const cors = require('cors');

require('./db/models/index');
const mongoose = require('mongoose');
const routes = require('./routes');
const apiRoutes = require('./api/v1/routes');
const services = require('./services');

const app = express();
app.use(cors());

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

app.listen(process.env.PORT || 4000, () => console.log(`App listening on port ${process.env.PORT}!`));
