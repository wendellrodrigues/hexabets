const User                  = require('../models/User');
const validateRegisterInput = require('../validation/register');
const validateLoginInput    = require('../validation/login');

module.exports = {

  validateRegister: async(req, res, next) => { 
     
    const { errors, isValid } = validateRegisterInput(req.body);  //request comes from the route

    //If any errors are found
    if(!isValid) {
      return res.status(400).json({ errors })
    }

    const email = req.body.email;

    // Check if user already exists by email
    User.findOne({ email }) 
      .then(user => {
        console.log(user);
        if(user) {
          errors.email = 'Email already exists' 
          return res.status(403).json({ errors }); 
        }
        next(); //So it goes on to next middleware (from UserController)
      })
    },


  validateLogin: async(req, res, next) => {
    const { errors, isValid } = validateLoginInput(req.body);

    //Check form errors
    if(!isValid) { 
      return res.status(200).json({ errors });
    }

    //Check if email actually exists in database. 
    const email = req.body.email;
    User.findOne({ email }) 
      .then(user => {
        if(user) {
          next();
        } else {
          errors.email = 'Email does not exist' 
          return res.status(403).json({ errors });  //403 means forbidden
        }
      })
  },


}





/** EXAMPLE OF HOW IT WAS LIKE BEFORE
 * validateRegister: () => {  
    return(req, res, next) => {   // Passed in as middleware from the api before it goes to the controller

      const { errors, isValid } = validateRegisterInput(req.body);  //request comes from the route

      //If any errors are found
      if(!isValid) {
        return res.status(400).json({errors})
      }


      next(); //So it goes on to next middleware (from UserController)
    }

  }, 
 */
