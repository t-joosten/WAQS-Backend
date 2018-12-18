const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

module.exports = function verifyToken(req, res, next) {
  console.log('verifying');
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  console.log(token);

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      }
      // if everything is good, save to request for use in other routes
      req.decoded = decoded;
      console.log(decoded);
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }
};
