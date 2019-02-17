const express = require('express');
const app = express();
const port = 3000;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.listen(port, () => console.log(`Watchtower listening on port ${port}!`));
