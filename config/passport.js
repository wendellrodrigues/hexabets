const passport          = require('passport');
const JwtStrategy       = require('passport-jwt').Strategy;
const ExtractJwt        = require('passport-jwt').ExtractJwt;
const mongoose          = require('mongoose');
const User              = mongoose.model('users'); // Comes from bottom of User.js file where it says model
const {JSONWebToken}    = require('./keys');
const FacebookStrategy  = require('passport-facebook');


const opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Where the jwt is extracted from: the header
opts.secretOrKey    = JSONWebToken.secret;                      // The secret key

/**
 * First find where its getting the token from (the header)
 * Then, passport decodes the token and we have access to payload, and done
 * We call done when we want to exit from the function
 * We call payload when we want to access some of the token's data
 */
passport.use(new JwtStrategy(opts, (payload, done) => {
  try {
    // Find the user in the token (We have access to the payload specified in the controller signToken function)
    const user = User.findById(payload.id);

    // If the user exists, return it
    if(user) {
      return done(null, user);
    }

    // If not found found, return null
    done(null, false);

  } catch(err) {
    done(err, false);
  }
}))




























// const opts =  {};

// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = keys.secretOrKey;

// module.exports = passport => {

//   passport.use('login',
//     new JwtStrategy(opts, (jwt_payload, done) => {
//     //Should include payload stuff from users
//     User.findById(jwt_payload.id) //promise includes a user
//         .then(user => {
//             if(user) {
//                 return done(null, user);
//             }
//             return done(null, false); //If user not found, still return done but false as second parameter
//         })
//         .catch(err => console.log(err));
//   }));

//   passport.use('facebook',
//     new FacebookStrategy({
//       clientID: keys.facebookAuth.clientID,
//       clientSecret: keys.facebookAuth.clientSecret,
//       callbackURL: keys.facebookAuth.callbackURL,
//       profileFields:keys.facebookAuth.profileFields
//     }, async(accessToken, refreshToken, profile, done) => {
//         try {
//           console.log(`profile: ${profile}`);
//           console.log(`access token: ${accessToken}`);
//           console.log(`refresh token: ${refreshToken}`);
//       } catch(err) {
//         done(err, false, err.message)
//       }
//     })
  
//   )



  



// }
































/**
 * 
 * passport.use('login',
    new FacebookStrategy({
      clientID: keys.facebookAuth.clientID,
      clientSecret: keys.facebookAuth.clientSecret,
      callbackURL: keys.facebookAuth.callbackURL,
      profileFields:keys.facebookAuth.profileFields
      }, function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        var me = new user({
          email:profile.emails[0].value,
          name:profile.displayName
        });

        
        user.findOne({email:me.email}, function(err, u) {
          if(!u) {
            me.save(function(err, me) {
              if(err) return done(err);
              done(null,me);
            });
          } else {
            console.log(u);
            done(null, u);
          }
        });
      }
  ));

  passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    user.findById(id, function(err, user) {
      done(err, user);
    });
  });
 **/