/*
Author (Rajat chauhan)

emailId : rajatchauhan527@gmail.com

*/
const jwt = require("jsonwebtoken");
const process = require('process')
require('dotenv').config()


const token_verify = (req, res, next) => {

  const token = req.headers["x-access-token"];


  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log("decoded",decoded)
    req.userId = decoded.userId
    req.role = decoded.role
    req.email = decoded.email
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = token_verify;