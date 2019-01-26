const express       = require('express');
const mongoose      = require('mongoose');
const bodyParser    = require('body-parser');
const passport      = require('passport');
const morgan        = require('morgan');
const path          = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile')

//Passport Config
require('./config/passport')(passport);


// MongoDB Atlas Configuration
const db = require('./config/keys').mongoURI;

// Connect to MongDB 
mongoose
    .connect(db, { useNewUrlParser: true }) 
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


// Initialization of the express application
const app = express();

// Middlewares

//Morgan Midleware (for looking through the req, res. DELETE LATER)
app.use(morgan('dev'));

// Body parser Middleware parses HTTP requests into readable json format
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Passport Middleware (For tokens and authorization)
app.use(passport.initialize());


//Test route
app.get('/', (req, res) => res.send('Hello'));


// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);


//Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Hexabets server running on localhost port ${port}`));