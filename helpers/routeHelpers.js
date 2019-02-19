const User                  = require('../models/User');
const validateRegisterInput = require('../validation/register');
const validateLoginInput    = require('../validation/login');
const jwt                   = require('jsonwebtoken');
const jwt_decode            = require('jwt-decode');

module.exports = {

  /**
   * Validates the Local Registration Input
   */
  validateRegister: async(req, res, next) => { 
     
    const { errors, isValid } = validateRegisterInput(req.body);  //request comes from the route

    // If any errors are found
    if(!isValid) {
      return res.status(400).json({ errors })
    }

    const email = req.body.email;

    // Check if user already exists by email
    User.findOne({ 'local.email' : email }) 
      .then(user => {
        if(user) {
          errors.email = 'Email already exists' 
          return res.status(403).json({ errors }); 
        }
        next(); //So it goes on to next middleware (from UserController)
      })
    },

  /**
   * Validates the Local Login Input
   */
  validateLogin: async(req, res, next) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check form errors
    if(!isValid) { 
      return res.status(200).json({ errors });
    }

    // Check if email actually exists in database. 
    const email = req.body.email;
    User.findOne({ 'local.email' : email }) 
      .then(user => {
        if(user) {
          next();
        } else {
          errors.email = 'Email does not exist' 
          return res.status(403).json({ errors });  // 403 means forbidden
        }
      })
  },

  /**
   * Validates a Friend Request
   * Checks if Friend is in database
   * Checks if User sends a friend request to self
   * Checks if Friend request has already been sent (pending)
   * Checks if Friend already exists as an accepted Friend in User's friends array
   */
  validateFriendRequest: async(req, res, next) => {

    const errors = {};
    const friendID = req.params.userID;

    // Check if friend user exists in database, if not, handle it
    try {
      const friend = await User.findById(friendID)
      if(!friend) {
        errors.userNotFound = 'Sorry, user does not exist'
        return res.status(200).json({ errors })
      }
    } catch(err) {  // Handles invalid IDs
      errors.invalidID = 'Invalid User ID'
      return res.status(200).json({ errors })
    }

    const decodedUser = jwt_decode(req.headers.authorization);
    const decodedUserId = decodedUser._id;

    // Check if user is sending friend request to self
    if(decodedUserId == friendID) {
      errors.invalidID = 'Cannot make a friend request to yourself'
      return res.status(200).json({ errors })
    }

    // Check if friend user is already existing in friends array (requested, accepted) 
    User.findById(decodedUserId)
      .then(thisUser => {
        const arrayOfFriends = thisUser.friends;

        arrayOfFriends.find(friendToFind => {
          if(friendToFind.friend == req.params.userID) {   // ID's match and friend is found

            // Check if friend request is pending
            if(friendToFind.status == 'pending') {
              errors.friendPending = 'Friend request aready sent';
              return res.status(200).json({ errors })
            }

            // Check if friend request is accepted
            if(friendToFind.status == 'accepted') {
              errors.friendPending = 'You are already friends with this user';
              return res.status(200).json({ errors })
            }
          }
        })

    next();
  })}
}
