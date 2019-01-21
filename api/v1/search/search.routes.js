const express = require('express');
const router = express.Router();

const search = require('./search.controller');

router.route('/:id')
  .get(search.GetSearchResults);

module.exports = router;
