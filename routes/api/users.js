const express   = require('express'); //To use the router
const router    = express.Router();
const bcrypt    = require('bcryptjs'); //For hashing passwords
const jwt       = require('jsonwebtoken');
const keys      = require('../../config/keys');

const passport     = require('passport');
//const passport_register  = require('passport');



const nexmoKey = require('../../config/keys').nexmoKey; 
const nexmoSecret = require('../../config/keys').nexmoSecret; 

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: nexmoKey,
  apiSecret: nexmoSecret
});


//Load User and Partial model
const User = require('../../models/User');
const PartialUser = require('../../models/PartialUser');



// @route     /api/users/register
// @desc      Test public profile
// @access    Public

/**
 * Flow goes like this: Register takes in firstName, lastName, email, and phone, then sends a jwt auth token to verify
 * Verify verifies the phone number and sends a jwt auth token to password
 * Password then uses bcrypt to create the account
 */
router.post('/register', (req, res) => {
  // Mongoose method allows  
  User.findOne({ email: req.body.email })      //Promise returns a user
    .then(user => {
      if(user) { // Mongoose first finds if the email exists
        return res.status(400).json({email: 'Email already exists'})
      } else {
        User.findOne({ mobilePhone: req.body.mobilePhone })
          .then(user => {
            if(user) {
              return res.status(400).json({mobilePhone: 'Phone number already in use'})
            } else {

              // Create Payload for JWT to send to /verify route
              const partialUser = new PartialUser ({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobilePhone: req.body.mobilePhone, 
                //Creates an ID that we use with the payload to 
              })

              //Payload is what goes into the JWT 
              const payload = {
                id: partialUser._id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobilePhone: req.body.mobilePhone, 
              }

              //Phone Veritication with Nexmo
              nexmo.verify.request({ number: partialUser.mobilePhone, brand: 'Hexabets'}, (err, result) => {
                if(err) { res.sendStatus(500) }
                else {
                  console.log(partialUser.mobilePhone);
                  let requestId = result.request_id;
                  if(result.status == '0') {

                    partialUser.phoneVerificationID = requestId; 

                    partialUser // Partial User is then to be sent to phone verification, and finally to password 
                      .save()
                      .then(partialUser => {
                        // jwt sends payload to verify route
                        jwt.sign(
                          payload, 
                          keys.secretOrKey, 
                          { expiresIn: 3600 }, 
                          (err, token) => {
                            if(err) {res.json(err)}
                            else {
                              res.json({
                                success: true,
                                token: 'Bearer ' + token
                              }).catch(err => res.json(err))
                            }
                          }
                        )
                      })
                  } else { res.status(401).json(result.error_text); }
                }
              })
            }
          })
      }
    })
})



/**
 * @route   /api/users/verify
 * @desc    Receives a bearer token in the header and a pin in the body
 *          Receives a reqId from the user found in the partialUser Auth Token
 * @access  Private
 */
router.post('/verify', passport.authenticate('partialUser', { session: false }), (req, res) => {

  PartialUser.findById(req.user.id)
    .then(partialUser => {
      let pin = req.body.pin;
      let reqId = partialUser.phoneVerificationID;

      nexmo.verify.check({request_id: reqId, code: pin}, (err, result) => {
        if(err) {
          res.json(err)
        } else {
          if(result && result.status == '0') {
            partialUser.phoneVerified = true;
            
    
          } else {
            return res.status(400).json({verifyPhone: 'Invalid Verification Code'})
          }
        }
      })
    })
})


/**
 * @route   /api/users/password
 * @desc    Comes in from verification with bearer token containing partialUser information.
 *          Verified has to be true
 *          Creates new full User object with bcrypt
 * @access  Private
 */
router.post('/password', passport.authenticate('verifyUser', { session: false } , (req, res) => {





  //Create a newUser object to be saved in the bcrypt salt. Possible put it 
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    mobilePhone: req.body.mobilePhone, //TODO: Verification
    //password: req.body.password,
  });
  res = newUser;

  // Generate salt for hashing passwords
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
    })
  })

}))
              



// @route     /api/users/login
// @desc      Login User / Return a JWT token
// @access    Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find the user by email
  User.findOne({email})
    .then(user => {
      //Check for user by email
      if(!user) {
        return res.status(400).json({email: 'User not found'})
      }
      //Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            //Payload
            const payload = {   //Create JWT Payload
              id: user.id, 
              firstName: user.firstName,
              lastName: user.lastName
            }

            //Sign Token
            jwt.sign(
                payload, 
                keys.secretOrKey, 
                { expiresIn: 1e10 }, 
                () => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token
                  })
                }); //Takes in payload, which is what we want to include in the token, some user information
          } else {
            return res.status(400).json({password: 'Password incorrect'})
          }
        })
    })

})




module.exports = router;