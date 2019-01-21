const JwtStrategy   = require('passport-jwt').Strategy;
const ExtractJwt    = require('passport-jwt').ExtractJwt;
const mongoose      = require('mongoose');
const User          = mongoose.model('users'); //Comes from bottom of User.js file where it says model
const keys          = require('../config/keys');

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

    passport.use('partialUser',
        new JwtStrategy(opts, (jwt_payload, done) => {

        PartialUser.findById(jwt_payload.id) //promise includes a user    
            .then(partialUser => {

                if(partialUser) {
                    return done(null, partialUser);
                }
                return done(null, false); //If user not found, still return done but false as second parameter
            })
            .catch(err => console.log(err));
    }));

    passport.use('verifyUser',
        new JwtStrategy(opts, (jwt_payload, done) => {
        //Should include payload stuff from users
        PartialUser.findById(jwt_payload.id) //promise includes a user
            .then(partialUser => {
                if(partialUser) {
                    return done(null, partialUser);
                }
                return done(null, false); //If user not found, still return done but false as second parameter
            })
            .catch(err => console.log(err));
    }));


};
