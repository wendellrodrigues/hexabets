const JwtStrategy       = require('passport-jwt').Strategy;
const ExtractJwt        = require('passport-jwt').ExtractJwt;
const mongoose          = require('mongoose');
const User              = mongoose.model('users'); //Comes from bottom of User.js file where it says model
const keys              = require('./keys');
const FacebookStrategy  = require('passport-facebook');


const opts =  {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {

  passport.use('login',
    new JwtStrategy(opts, (jwt_payload, done) => {
    //Should include payload stuff from users
    User.findById(jwt_payload.id) //promise includes a user
        .then(user => {
            if(user) {
                return done(null, user);
            }
            return done(null, false); //If user not found, still return done but false as second parameter
        })
        .catch(err => console.log(err));
  }));

  passport.use('facebook',
    new FacebookStrategy({
      clientID: keys.facebookAuth.clientID,
      clientSecret: keys.facebookAuth.clientSecret,
      callbackURL: keys.facebookAuth.callbackURL,
      profileFields:keys.facebookAuth.profileFields
    }, async(accessToken, refreshToken, profile, done) => {
        try {
          console.log(`profile: ${profile}`);
          console.log(`access token: ${accessToken}`);
          console.log(`refresh token: ${refreshToken}`);
      } catch(err) {
        done(err, false, err.message)
      }
    })
  
  )



  



}
































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