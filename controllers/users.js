const User = require('../models/User');


module.exports = {

  register: async(req, res, next) => {

    // Receives: email & password
    const{ 
      name,
      email, 
      password,
      password2
      } = req.body;

    // Create new user
    const newUser = new User({ 
                          name,
                          email, 
                          password,
                          password2
                          });

    await newUser.save();   //Waits for newUser to be saved to database before next line is processed

    res.json({user: 'New User Created'})

  },

  login: async(req, res, next) => {
    // Generate token 
    console.log('UserController.login() called')
  },

  secret: async(req, res, next) => {
    console.log('UserController.secret() called')
  },



}