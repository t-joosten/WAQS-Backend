const express = require('express');
const router = express.Router();

const auth = require('./auth.controller');

// Auth routes
router.route('/')
  .get(auth.Get);

router.route('/register').post(auth.Register);
router.route('/login').post(auth.Login);
router.route('/logout').delete(auth.Logout);

module.exports = router;
