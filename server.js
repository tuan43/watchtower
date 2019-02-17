const express = require('express');
var secure = require('express-force-https');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const authUser = {
	username: 'tuan43',
	hashedPassword: 'X'
};

app.use(secure);
app.use(express.static('build'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

passport.use(new LocalStrategy(
  function(username, password, done) {
  	if (username !== authUser.username) {
  		return done(null, false, { message: 'Incorrect username/password.'});
  	}

    bcrypt.compare(password, authUser.hashedPassword, function(err, res) {
		  if (res) {
		    return done(null, { message: 'yay' });
		  } else {
		    return done(null, false, { message: 'Incorrect username/password.'});
		  } 
		});
  }
));

app.post('/login', 
	passport.authenticate('local', { session: false, failureRedirect: '/' }), 
	function(req, res) {
    res.json({ key: 'tobi123' });
  });

app.listen(port, () => console.log(`Watchtower listening on port ${port}!`));