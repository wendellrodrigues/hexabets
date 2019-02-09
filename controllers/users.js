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
  //Create token
  const token = jwt.sign(JSON.stringify(payload), key)
  //return Bearer token
  return 'Bearer ' + token;
}


module.exports = {

  /**
   * Register Controller
   */
  register: async(req, res, next) => {

    const{  
      firstName,
      lastName,
      email, 
      password,
      } = req.body;

    // Create new user
    const newUser = new User({ 
                          method: 'local',
                          local: {
                            firstName,
                            lastName,
                            email, 
                            password,
                          }
                          });

    // Save user to database                      
    await newUser.save();   //Waits for newUser to be saved to database before next line is processed

    //Create token
    const token = signToken(newUser);

    // Respond with token
    res.status(200).json({ token });
  },

  /**
   * Login Controller
   */
  login: async(req, res, next) => {

    //Generate token (we have access to req.user)
    const token = signToken(req.user);

    //Respond with token (Remember, this token along with the token from register can be used to access secret routes that use jwt)
    res.status(200).json({ token })
  },

  /**
   * Facebook Auth Controller
   */
  facebookOauth: async(req, res, next) => {

    // Create and return a JWT token
    const token = signToken(req.user);
    res.status(200).json({ token })
  }, 

  /**
   * Secret Routes Controller
   */
  secret: async(req, res, next) => {
    console.log('UserController.secret() called')
    res.json({ secret: 'Secret accessed' });
  },



}