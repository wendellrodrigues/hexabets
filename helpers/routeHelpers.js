const Joi     = require('joi');

//const User                  = require('../models/User');
const validateRegisterInput = require('../validation/register');

module.exports = {

  //Can replace all this with own custom validation like devconnector project

  validateBody: () => {  
    return(req, res, next) => {   // Passed in as middleware from the api before it goes to the controller

      const { errors, isValid } = validateRegisterInput(req.body);  //request comes from the route

      //If any errors are found
      if(errors.length > 0) {
        req.value['body'] = errors;
        return res.status(400).json({errors, isValid})
      } 

      next(); //So it goes on to next middleware (from UserController)
    }

  }, 


}
