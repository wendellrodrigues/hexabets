const passport          = require('passport');
const JwtStrategy       = require('passport-jwt').Strategy;
const LocalStrategy     = require('passport-local').Strategy;
const ExtractJwt        = require('passport-jwt').ExtractJwt;
const mongoose          = require('mongoose');
const User              = mongoose.model('users'); // Comes from bottom of User.js file where it says model

const { JSONWebToken }    = require('./keys');
const { facebookAuth }    = require('./keys');

const FacebookStrategy  = require('passport-facebook-token');


// JWT Options
const optsJWT = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey    : JSONWebToken.secret
}

// Facebook OAuth Options
const optsFacebook = {
  clientID:  facebookAuth.clientID,
  clientSecret: facebookAuth.clientSecret
}

// Local Options
const optsLocal = {
  usernameField: 'email'
}



/**
 * JSON WEB TOKEN STRATEGY
 * First find where its getting the token from (the header)
 * Then, passport decodes the token and we have access to payload, and done
 * We call done when we want to exit from the function
 * We call payload when we want to access some of the token's data
 */
passport.use(new JwtStrategy(optsJWT, 
  async (payload, done) => {
  try {
    // Find the user in the token (We have access to the payload specified in the controller signToken function)
    const user = User.findById(payload.id);

    // If the user exists, return it
    if(user) {
      return done(null, user); // returns done with no errors and user
    }

    // If not found found, return null
    done(null, false);

  } catch(err) {
    done(err, false);
  }
}))

/**
 * FACEBOOK OAUTH STRATEGY
 */
 passport.use('facebookToken', new FacebookStrategy(optsFacebook,
  async(accessToken, refreshToken, profile, done) => {
    try{
      //  Check if there is an existing user. If not, create a new one
      await User.findOne({ 'facebook.id': profile.id })
        .then(user => {
          if(user) {
            console.log('user exists')
            return done(null, profile);
          }

          // Gather name strings from facebook object
          const firstName = profile.name.givenName;
          const lastName = profile.name.familyName;
          
          // Create new user
          console.log('creating new user');
          const newUser = new User({
            method: 'facebook',
            facebook: {
              id: profile.id,
              firstName,
              lastName,
              email: profile.emails[0].value,
            }
          })
          // Save user to DB
          newUser.save();

          // Continue to next func
          done(null, newUser)
        })

    } catch(error) {
      done(error, false, error.message)
    }
  }))


/**
 * LOCAL STRATEGY
 * Used for email/password authentication on login
 */
passport.use(new LocalStrategy(optsLocal, 
  async(email, password, done) => {
    try{
      // Find the user given the email
      const user = await User.findOne({ 'local.email': email });

      // If not, handle it
      if(!user) {
        return done(null, user);
      }

      // If found, check if password is correct
      const isMatch = await user.isValidPassword(password);

      // If not, handle it
      if(!isMatch) {
        return done(null, false)
      }

      // If yes, return the user
      done(null, user)
    } catch(err){
        done(err, false)
    }
  }))
