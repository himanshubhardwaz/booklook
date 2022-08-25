const express = require('express');
var cors = require('cors')
const cookieParser = require('cookie-parser');
const app = express();
const port = 8005;
const path = require('path');
const db = require('./config/mongoose');
const Users = require('./models/users_model');
const Book = require('./models/books_log');

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))


//session creation
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');


app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(__dirname));
let ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


app.use(session({
    name: 'booknook',
    secret: 'secrethuh',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 60 * 24)
    }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//const db = require('./config/mongoose');//const {object} = require('./models/{mongoose_model_name}');
app.use('/', require('./routes/index'));
const Confirm = require('prompt-confirm');


app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running server: ${err}`);
        return;
    }
    else {
        console.log('Server is running on port: ', port);
    }
})