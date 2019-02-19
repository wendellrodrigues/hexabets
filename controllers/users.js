const jwt                   = require('jsonwebtoken');
const jwt_decode            = require('jwt-decode');

const User                  = require('../models/User');
const { JSONWebToken }      = require('../config/keys');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const secretOrKey = require('../config/keys')


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

    // Get Friend user (from request)
    const localFriend = User.findById(req.params.userID)
    //console.log(localFriend);

    // Get current User (from Auth Token)
    const thisUser = User.findById(decodedUserId)

    // Update this User's friends array to include pending request
    await User.findById(decodedUserId)
      .then(user => {

        // Check if user exists 
        user.friends.push({
          status: 'pending',
          addedWhen: Date.now(),
          friend: req.params.userID
        })
        user.save();
      })
    
    









    // Update user

    //Get friend


  },

  /**
   * Accepts Local Friend
   */
  acceptLocalFriend: async(req, res, next) => {



  }














}


// /**
//    * Requests local friend
//    */

//   requestLocalFriend: async(req, res, next) => {

//     const errors = {};

//     //Get the User that is sending the request (this user)



//     // Fetch the user by id 
//     await User.findById(userId)
//       .then(function(thisUser){
//         console.log('this user', thisUser);
//         return res.send(200);
//     });
    

//     //Find the friend
//     User.findById(req.params.userID)
//       .then(localFriend => {

//         //If friend, not found, handle it
//         if(!localFriend) {
//           errors.notFound = 'User not found';
//           return res.status(400).json({errors});
//         }

//         //User.addFriend(localFriend);


//         return res.status(200).json(localFriend);

//       })
      
//     }