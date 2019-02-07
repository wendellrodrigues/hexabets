const express                   = require('express'); //To use the router
const router                    = require('express-promise-router')();     // To avoid try-catch
const UsersController           = require('../../controllers/users');
const { validateRegister, 
        validateLogin
                     }          = require('../../helpers/routeHelpers');


const bcrypt    = require('bcryptjs'); //For hashing passwords
const jwt       = require('jsonwebtoken');
const keys      = require('../../config/keys');


const passport        = require('passport');
const passportConfig  = require('../../config/passport')

//Load User model
const User = require('../../models/User');

//Authorization strategies
const passportLogin   = passport.authenticate('local', { session: false });
const passportJWT     = passport.authenticate('jwt', { session: false });
const passportGoogle  = passport.authenticate('googleToken', { session: false });

 /*
   * When this route is called, it goes to routeHelpers/validateBody, and checks to see if the schema is valid
   * Then, if it passes, the next() function calls the UsersController.register
   * Else, if it fails, the next() function will not call the UserController.register, and respond with the 400 error provided by Joi
 */
router
  .route('/register')
  .post(
    validateRegister,
    UsersController.register);
 
router
  .route('/login')
  .post(
    validateLogin,
    passportLogin,
    UsersController.login
  );

router
  .route('/oauth/google')
  .post(
    passportGoogle
  )

router
  .route('/secret')
  .get(
    passportJWT,
    UsersController.secret
  );




module.exports = router;