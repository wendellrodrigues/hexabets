const express                   = require('express'); //To use the router
const router                    = require('express-promise-router')();
const UsersController           = require('../../controllers/users');
const { validateRegister, 
        
                     }          = require('../../helpers/routeHelpers');


const bcrypt    = require('bcryptjs'); //For hashing passwords
const jwt       = require('jsonwebtoken');
const keys      = require('../../config/keys');


const passport     = require('passport');

//Load User model
const User = require('../../models/User');

 /*
   * When this route is called, it goes to routeHelpers/validateBody, and checks to see if the schema is valid
   * Then, if it passes, the next() function calls the UsersController.register
   * Else, if it fails, the next() function will not call the UserController.register, and respond with the 400 error provided by Joi
 */
router
  .route('/register')
  .post(
    UsersController.register);
 

router
  .route('/login')
  .post(UsersController.login);

router
  .route('/secret')
  .get(UsersController.secret);




module.exports = router;