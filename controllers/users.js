const jwt                   = require('jsonwebtoken');
const jwt_decode            = require('jwt-decode');
ObjectId                    = require('mongodb').ObjectID;

const User                  = require('../models/User');
const { JSONWebToken }      = require('../config/keys');


const validateRegisterInput = require('../validation/register');
const validateLoginInput    = require('../validation/login');

const secretOrKey           = require('../config/keys')


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

  /**
   * Sends a Request to a local friend
   */
  requestLocalFriend: async(req, res, next) => {

    // Decode Auth Token
    const decodedUser = jwt_decode(req.headers.authorization);
    const decodedUserId = decodedUser._id;

    // Get Friend user ID (from request)
    const localFriendID = req.params.userID

    // Update this User's friends array to include requested friend request
    await User.findById(decodedUserId)
      .then(user => {
        user.friends.push({
          status: 'requested',
          addedWhen: Date.now(),
          friendID: localFriendID
        })
        user.save();
      })

    // Update requested User's friends array to include pending friend request
    await User.findById(localFriendID)
      .then(user => {
        user.friends.push({
          status: 'pending',
          addedWhen: Date.now(),
          friendID: decodedUserId
        })
        user.save();
      })
    
    res.status(200);

  },

  /**
   * Accepts Local Friend
   */
  acceptLocalFriend: async(req, res, next) => {

    // Decode Auth Token
    const decodedUser = jwt_decode(req.headers.authorization);
    const accepterID = decodedUser._id;

    // Get Friend user ID (from request)
    const requesterID = req.params.userID

    // Update accepter friend array object to 'accepted'
    await User.update({
        '_id': ObjectId(accepterID), 
        'friends.friendID': requesterID}, 
        { $set : { 'friends.$.status': 'accepted' } })

    // Update requester friend array object to 'accepted'
    await User.update({
      '_id': ObjectId(requesterID), 
      'friends.friendID': accepterID}, 
      { $set : { 'friends.$.status': 'accepted' } })

  }





}

