const passport                  = require('passport');
const router                    = require('express-promise-router')();     // To avoid try-catch
const UsersController           = require('../../controllers/users');
const { validateRegister, 
        validateLogin
      }                         = require('../../helpers/routeHelpers');


//Authorization strategies
const passportLogin     = passport.authenticate('local',         { session: false });
const passportJWT       = passport.authenticate('jwt',           { session: false });
const passportFacebook  = passport.authenticate('facebookToken', { session: false });

/**
 * @route   POST api/users/register
 * @desc    Registers new User / Returns JWT Token for secret routes access
 * @access  public
 */
router
  .route('/register')
  .post(
    validateRegister,
    UsersController.register
  );
 
/**
 * @route   POST api/users/login
 * @desc    Login User / Returns JWT Token for secret routes access
 * @access  public
 */
router
  .route('/login')
  .post(
    validateLogin,
    passportLogin,
    UsersController.login
  );

/**
 * @route   POST api/users/oauth/facebook
 * @desc    Receives access token from facebook
 *          Creates new user OR logs in user
 *          Returns JWT for secret routes access
 * @access  public
 */
router
  .route('/oauth/facebook')
  .post(
    passportFacebook,
    UsersController.facebookOauth
  );

  /**
 * @route   GET api/users/secret
 * @desc    Test function for secret routes
 * @access  private 
 */
router
  .route('/secret')
  .get(
    passportJWT,
    UsersController.secret
  );


module.exports = router;