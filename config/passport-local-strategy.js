const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User=require('../models/users_model');
//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
    },
    function(username, password, done){
        User.findOne({username: username}, function(err, user){
            if(err){
                console.log('Error in finding user --> Passport');
                return done(err);
            }
            if(!user || user.password != password){
                console.log('Invalid username/password.');
                return done(null, false);
            }
            return done(null, user);
            // if (err) { return done(err); }
            // if (!user) { return done(null, false); }
            // if (!user.verifyPassword(password)) { return done(null, false); }
            // return done(null, user);
        });
    }
));


//Serializing
passport.serializeUser(function(user,done){
    done (null, user.id);
    // done (null, user);
});

//Deserializing
passport.deserializeUser(function(id,done){
    User.findById(id, function(err,user){
        if(err){
            console.log('Error in finding user --> Deserializer Passport');
            return done(err);
        }
        return done(null, user);
    });
    // return done(null, user);
});

// Check user authentication middleware
passport.checkAuthentication = function(req, res, next){
    //if user is signed in, pass the request to controller action
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains signed in user from session cookie and we are sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}



module.exports = passport;