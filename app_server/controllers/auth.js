const mongoose = require('mongoose');
const passport = require('passport');

const google = passport.authenticate('google', { scope: ['profile', 'email']});

const googleCallback =  passport.authenticate('google', { failureRedirect: '/', successRedirect: '/' });

const logout = function(req, res) {
    req.logout();
    res.redirect('/');
};


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = {
	google, 
	googleCallback,
    logout
}; 
