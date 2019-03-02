const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const _ = require('lodash');
const speakeasy = require('speakeasy');
const jwt = require('jsonwebtoken');
const path = require('path');

const jwtStrategry  = require('./jwt');
const users = require('./users.js');
const secretKey = require('./secretKey.js');

const app = express();
app.use(helmet());
app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(jwtStrategry);

app.post('/api/login', (req, res) => {
  const { username, password, token } = req.body;

  const authUser = _.find(users, { username });
  if (!authUser) {
    return res.status(401).json({ message: 'Incorrect username/password' });
  }

  const tokenVerified = speakeasy.totp.verify({
    secret: authUser.secret,
    encoding: 'base32',
    token: req.body.token
  });

  const bypassVerified = authUser.bypass === req.body.token;

  bcrypt.compare(password, authUser.hashedPassword, function(err, valid) {
    if (valid && (tokenVerified || bypassVerified)) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: '5m' });
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Incorrect username/password' });
    }
  });
})

app.get('/api/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.status(200).json({ authKey: req.user.authKey });
});

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname + '../build/index.html'));
});

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

const server = https.createServer(httpsOptions, app).listen(443, () => {
  console.log('Watch Tower running at ' + 443)
});