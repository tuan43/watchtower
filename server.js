const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const fs = require('fs');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const https = require('https');
const uuid = require('uuid/v4');
const _ = require('lodash');

const app = express();
const users = [{
  username: 'tuan43',
  id: '6528169bf9e5',
  hashedPassword: '$2b$10$0kdaeo/a9T.cXEvppsl8oO6S0b3a2fuHgZL.7zb3EdxCrGS3OVrLq',
  authKey: '1529 6939'
}, {
  username: 'sbui',
  id: 'f0db19960850',
  hashedPassword: '$2b$10$90SPNdBml3GHcJJG7C9rA.5HGUJS5otRDucInmnDYDVpfPPSNFRu.',
  authKey: 'I love my mochi! :)'
}];

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
  function(username, password, done) {
    const authUser = _.find(users, { username: username });

    if (!authUser) {
      return done(null, false, { message: 'Incorrect username/password.'});
    }

    bcrypt.compare(password, authUser.hashedPassword, function(err, res) {
      if (res) {
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
