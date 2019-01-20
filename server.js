const express       = require('express');
const mongoose      = require('mongoose');
const bodyParser    = require('body-parser');
const passport      = require('passport');
const path          = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile')

// Initialization of the express application
const app = express();

// Body Parser Middleware
// Body parser parses HTTP requests into readable json format
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// MongoDB Atlas Configuration
const db = require('./config/keys').mongoURI;

// Connect to MongDB 
mongoose
    .connect(db, { useNewUrlParser: true }) 
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello'));

// Passport Middleware
//app.use(passport.initialize());

// Passport Config
//require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Hexabets server running on localhost port ${port}`));