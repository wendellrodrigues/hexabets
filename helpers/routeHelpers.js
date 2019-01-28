//CAN DELETE THIS WHOLE FILE, NOT NEEDED

const Joi     = require('joi');

//const User                  = require('../models/User');
const validateRegisterInput = require('../validation/register');

module.exports = {

  //Can replace all this with own custom validation like devconnector project

  validateRegister: () => {  
    return(req, res, next) => {   // Passed in as middleware from the api before it goes to the controller

      const { errors, isValid } = validateRegisterInput(req.body);  //request comes from the route

      //If any errors are found
      if(!isValid) {
        return res.status(400).json({errors})
      }


      next(); //So it goes on to next middleware (from UserController)
    }

  }, 


}
