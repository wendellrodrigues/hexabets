const jwt                   = require('jsonwebtoken');

const User                  = require('../models/User');
const { JSONWebToken }      = require('../config/keys');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');


/**
 * Sign a JWT Token 
 */
signToken = (payload) => {
  //Secret key
  const key = JSONWebToken.secret;
  //Signing Options for JWT payload
  const signOptions = {
    issuer: 'hexabets',
    expiresIn: '24h'
  }
  //Create token
  const token = jwt.sign(payload.toJSON(), key, signOptions)
  //return Bearer token
  return 'Bearer ' + token;
}


module.exports = {

  register: async(req, res, next) => {

    const{  
      name,
      email, 
      password,
      } = req.body;

    // Create new user
    const newUser = new User({ 
                          name,
                          email, 
                          password,
                          });

    // Save user to database                      
    await newUser.save();   //Waits for newUser to be saved to database before next line is processed

    //Create token
    const token = signToken(newUser);

    // Respond with token
    res.status(200).json({ token });
  },


  login: async(req, res, next) => {

    //Generate token (we have access to req.user)
    const token = signToken(req.user);

    //Respond with token (Remember, this token along with the token from register can be used to access secret routes that use jwt)
    res.status(200).json({ token })
  },

  secret: async(req, res, next) => {
    console.log('UserController.secret() called')
    res.json({ secret: 'Secret accessed' });
  },



}