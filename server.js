const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const _ = require('lodash');

const app = express();
const users = [{
  username: 'tuan43',
  hashedPassword: '$2b$10$0kdaeo/a9T.cXEvppsl8oO6S0b3a2fuHgZL.7zb3EdxCrGS3OVrLq',
  authKey: '1529 6939'
}, {
  username: 'sbui',
  hashedPassword: '$2b$10$90SPNdBml3GHcJJG7C9rA.5HGUJS5otRDucInmnDYDVpfPPSNFRu.',
  authKey: 'I love my mochi! :)'
}];

app.use(helmet());
app.use(express.static('build'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let authUser = null;

passport.use(new LocalStrategy(
  function(username, password, done) {
    authUser = _.find(users, { username: username });

    if (!authUser) {
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
    console.log('authUser authenticated ' + authUser);
    res.json({ authKey: authUser.authKey });
  });

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

const server = https.createServer(httpsOptions, app).listen(443, () => {
  console.log('Watch Tower running at ' + 443)
});
