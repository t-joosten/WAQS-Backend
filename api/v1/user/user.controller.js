const mongoose = require('mongoose');
const User = require('../../../models/User');

exports.GetUsers = (req, res) => {
  try {
    User.paginate({}, { page: req.query.page, limit: 10 }, (err, result) => {
      if (err) res.send(err);
      res.json(result);
    });
  } catch (err) {
    res.json({ message: 'Something went wrong getting the users.' });
  }
};

exports.UpdateUser = (req, res, next) => {
  try {
    User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
      if (err) {
        res.json({ success: false, message: 'User could not be updated.' });
      }
      res.json({ success: true, message: 'User has been updated.' });
    });
  } catch (err) {
    res.json({ success: false, message: 'User could not be updated.' });
  }
};

exports.DeleteUser = (req, res, next) => {
  try {
    User.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.json({ success: false, message: 'User could not be deleted.' });
      }
      res.json({ success: true, message: 'User has been deleted.' });
    });
  } catch (err) {
    res.json({ success: false, message: 'User could not be deleted.' });
  }
};
