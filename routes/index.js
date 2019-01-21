const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const Log = mongoose.model('Log');

router.get('/', (req, res) => {
  io.emit('chat message', { message: 'banaan' });
  console.log('chat message emitted');
  res.status(200).json({ message: 'Connected!' });
});

/* router.get('/logs', (req, res) => {
  Log.find({}).sort({ createdAt: 'desc' }).exec((err, logs) => {
    res.send(logs);
  });
}); */


module.exports = router;
