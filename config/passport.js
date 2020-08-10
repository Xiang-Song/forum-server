require('dotenv').config();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User } = require('../models');

passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
        session: false,
      },
      (req, username, password, done) => {
        console.log(username);
        console.log(req.body.email);
  
        try {
          User.findOne({
            where: {
              [Op.or]: [
                {
                  userName: username
                },
                { email: req.body.email },
              ],
            },
          }).then(user => {
            if (user != null) {
              console.log('username or email already taken');
              return done(null, false, {
                message: 'username or email already taken',
              });
            }
            bcrypt.hash(password, 10).then(hashedPassword => {
              User.create({
                userName: username,
                password: hashedPassword,
                email: req.body.email,
              }).then(user => {
                console.log('user created');
                return done(null, user);
              });
            });
          });
        } catch (err) {
          return done(err);
        }
      },
    ),
  );


  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        session: false,
      },
      (username, password, done) => {
        try {
          User.findOne({
            where: {
              userName: username
            },
          }).then(user => {
            if (user === null) {
              return done(null, false, { message: 'username not exist' });
            }
            bcrypt.compare(password, user.password).then(response => {
              if (response !== true) {
                console.log('passwords do not match');
                return done(null, false, { message: 'passwords do not match' });
              }
              console.log('user found & authenticated');
              return done(null, user);
            });
          });
        } catch (err) {
          done(err);
        }
      },
    ),
  );
  

  const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.SECRET,
  };
  
  passport.use(
    'jwt',
    new JWTstrategy(opts, (jwt_payload, done) => {
      try {
        User.findOne({
          where: {
            id: jwt_payload.id,
          },
        }).then(user => {
          if (user) {
            console.log('user found in db in passport');
            done(null, user);
          } else {
            console.log('user not found in db');
            done(null, false);
          }
        });
      } catch (err) {
        done(err);
      }
    }),
  );