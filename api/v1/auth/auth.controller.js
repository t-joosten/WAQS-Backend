const mongoose = require('mongoose');
const passport = require('passport');
require('../../../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const User = require('../../../models/User');

exports.Get = (req, res) => {
  res.send('auth');
};

exports.Register = (req, res) => {
  if (req.body.password !== req.body.confirmPassword) {
    res.json({success: false, msg: 'Passwords do not match.'});
  }
  if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please pass email and password.'});
  } else {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName,
    });
    // save the user
    newUser.save((err, user) => {
      if (err) {
        return res.json({success: false, msg: 'Email already exists.'});
      }
      const token = jwt.sign(user.toJSON(), jwtSecret);
      // return the information including token as JSON
      res.json({success: true, msg: 'Successful created new user.', token: `JWT ${token}`});
    });
  }
};

exports.Login = (req, res) => {
  User.findOne({
    email: req.body.email,
  }, (err, user) => {
    console.log(user);
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.toJSON(), jwtSecret);
          // return the information including token as JSON
          res.json({success: true, token: `${token}`});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
};

exports.Logout = (req, res) => {
  req.logout();

  if (req.user) {
    res.json({success: false});
  } else {
    res.json({success: true});
  }
};
