const express = require('express'); //To use the router
const router = express.Router();
const bcrypt = require('bcryptjs'); //For hashing passwords

//Load User model
const User = require('../../models/User');

/**   /api/users/exampleRoute     */

// @route     /api/users/test
// @desc      Test public profile
// @access    Public
router.get('/test', (req, res) => res.json({msg: 'Users Works'}));


// @route     /api/users/register
// @desc      Test public profile
// @access    Public
router.post('/register', (req, res) => {
  //Mongoose first finds if the email exists
  User.findOne({ email: req.body.email})      //Promise returns a user
    .then(user => {
      if(user) {
        return res.status(400).json({email: 'Email already exists'})
      } else {
        //Then Mongoose checks if the phone number verified already exists
        User.findOne({ mobilePhone: req.body.mobilePhone})
          .then(user => {
            if(user) {
              return res.status(400).json({mobilePhone: 'Phone number already in use'})
            } else {
                //TODO: Create avatar (possibly bitmoji?)

                const newUser = new User({
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  mobilePhone: req.body.mobilePhone, //TODO: Verification
                  password: req.body.password
                });

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

                
            }
          })
      }
    })
});


module.exports = router;