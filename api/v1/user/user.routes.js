const express = require('express');
const router = express.Router();

const user = require('./user.controller');
const VerifyToken = require('../../../helpers/VerifyToken');

// User routes
router.get('/', VerifyToken, user.GetUsers);
router.put('/:id', VerifyToken, user.UpdateUser);
router.delete('/:id', VerifyToken, user.DeleteUser);

module.exports = router;
