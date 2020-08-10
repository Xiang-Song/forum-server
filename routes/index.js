require('dotenv').config();

var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt = require('jsonwebtoken');

let { User } = require('../models');


router.post('/register', (req, res, next) => {
  passport.authenticate('register', (err, user, info) => {
    if (err) {
      console.error(err);
    }
    if (info !== undefined) {
      console.error(info.message);
      res.status(403).send(info.message);
    } else {
      req.logIn(user, error => {
        console.log(user);
        const data = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          username: user.userName,
        };
        console.log(data);
        User.findOne({
          where: {
            userName: data.username,
          },
        }).then(user => {
          console.log(user);
          user
            .update({
              firstName: data.firstname,
              lastName: data.lastname,
              email: data.email,
            })
            .then(() => {
              console.log('user created in db');
              res.status(200).send({ message: 'user created' });
            });
        });
      });
    }
  })(req, res, next);
});


router.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) {
      console.error(`error ${err}`);
    }
    if (info !== undefined) {
      console.error(info.message);
      if (info.message === 'username not exist') {
        res.status(401).send(info.message);
      } else {
        res.status(403).send(info.message);
      }
    } else {
      req.logIn(user, err => {
        User.findOne({
          where: {
            userName: req.body.username,
          },
        }).then(user => {
          const token = jwt.sign({ id: user.id }, process.env.SECRET, {
            expiresIn: 60 * 60,
          });
          res.status(200).send({
            auth: true,
            token,
            message: 'user found & logged in',
          });
        });
      });
    }
  })(req, res, next);
})


router.get('./finduser', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.status(401).send(info.message);
    } else if (user.userName === req.query.username) {
      User.findOne({
        where: {
          userName: req.query.username,
        },
      }).then((userInfo) => {
        if (userInfo != null) {
          console.log('user found in db from findUsers');
          res.status(200).send({
            auth: true,
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            email: userInfo.email,
            username: userInfo.userName,
            password: userInfo.password,
            message: 'user found in db',
          });
        } else {
          console.error('no user exists in db with that username');
          res.status(401).send('no user exists in db with that username');
        }
      });
    } else {
      console.error('jwt id and username do not match');
      res.status(403).send('username and jwt token do not match');
    }
  })(req, res, next);
})


module.exports = router;
