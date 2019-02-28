const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const fs = require('fs');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const https = require('https');
const uuid = require('uuid/v4');
const _ = require('lodash');
const speakeasy = require('speakeasy');
const app = express();

const users = require('./users.js');

app.use(helmet());
app.use(express.static('build'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  genid: (req) => {
    console.log(`Request object sessionID from client: ${req.sessionID}`)
    return uuid();
  },
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  { passReqToCallback: true },
  function(req, username, password, done) {
    const authUser = _.find(users, { username: username });

    if (!authUser) {
      return done(null, false, { message: 'Incorrect username/password.'});
    }

    const tokenVerified = speakeasy.totp.verify({
      secret: authUser.secret,
      encoding: 'base32',
      token: req.body.token
    });

    const bypassVerified = authUser.bypass === req.body.token;

    bcrypt.compare(password, authUser.hashedPassword, function(err, res) {
      if (res && (tokenVerified || bypassVerified)) {
        return done(null, authUser);
      } else {
        return done(null, false, { message: 'Incorrect username/password.'});
      }
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = _.find(users, { id: id }) || false;
  done(null, user);
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    console.log(`req.user: ${JSON.stringify(req.user)}`)
    req.login(user, (err) => {
      if(req.isAuthenticated()) {
        res.redirect('/authenticated');
      } else {
        res.redirect('/');
      }
    })
  })(req, res, next);
})

app.get('/authenticated', (req, res) => {
  if(req.isAuthenticated()) {
    res.send(req.user.authKey);
  } else {
    res.redirect('/');
  }
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

const server = https.createServer(httpsOptions, app).listen(443, () => {
  console.log('Watch Tower running at ' + 443)
});
