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
const moment = require('moment');
const expressWinston = require('express-winston');
const winston = require('winston');

const jwtStrategry  = require('./jwt');
const users = require('./users.js');
const secretKey = require('./secretKey.js');

// Express setup
const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Router Logic
const router = express.Router();
router.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.status(200).json({ authKey: req.user.authKey });
});

router.post('/login', (req, res) => {
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

  bcrypt.compare(password, authUser.hashedPassword, function(err, validCredentials) {
    if (validCredentials) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: '5m' });
      const expiration = moment().add(5, 'minutes');
      if (tokenVerified) {
        return res.status(200).json({ token, expiration });
      } else {
        bcrypt.compare(req.body.token, authUser.hashedBypass, function(err, validBypass) {
          if (validBypass) {            
            return res.status(200).json({ token, expiration });
          } else {
            return res.status(401).json({ message: 'Incorrect username/password' });
          }
        });
      }
    } else {
      return res.status(401).json({ message: 'Incorrect username/password' });
    }
  });
});

// Logging setup
app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'combined.log' })
  ],
  format: winston.format.combine(
    winston.format.json()
  ),
  msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}"
}));

// Routing setup
app.use('/api', router);
app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname + '/../build/index.html'));
});

// Security
passport.use(jwtStrategry);
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname + '/certs/key.pem')),
  cert: fs.readFileSync(path.join(__dirname + '/certs/cert.pem'))
};

// Start server
const server = https.createServer(httpsOptions, app).listen(443, () => {
  console.log('Watch Tower running at ' + 443)
});