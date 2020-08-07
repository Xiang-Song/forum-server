var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');

let { User } = require('../models');

const initializePassport = require('./passport')
initializePassport(
  passport,
  username => User.findAll({where: {userName: username}}),
  id => User.findAll({where: {id:id}})
)

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: 'http://localhost:3000/home',
  failureRedirect: 'http://localhost:3000/login',
  failureFlash: true
}))

router.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = await User.create({
      userName: req.body.username,
      email: req.body.email,
      password: hashedPassword
    })
    console.log(user)
    res.redirect('http://localhost:3000/login')
  } catch {
    res.redirect('http://localhost:3000/register')
  }
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('http://localhost:3000/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('http://localhost:3000/')
  }
  next()
}

module.exports = router;
