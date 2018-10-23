const app = require('express')();
const server = require('http').Server(app);
global.io = require('socket.io')(server);

const dotenv = require('dotenv');
const chalk = require('chalk');
const cors = require('cors');

require('./db/models/index');
const mongoose = require('mongoose');
const routes = require('./routes');
const apiRoutes = require('./api/v1/routes');
const services = require('./services');


/** Setup CORS */
//const whitelist = ['http://localhost:4200', 'undefined'];
const corsOptions = {
  credentials: true,
  /*origin: (origin, callback) => {
    console.log(origin);
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },*/
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

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

server.listen(process.env.PORT || 4000, () => console.log(`App listening on port ${process.env.PORT}, open your browser on http://localhost:${process.env.PORT}/`));
