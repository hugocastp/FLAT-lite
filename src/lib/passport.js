const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../databaseInterviews');
const helpers = require('./helpers');
const express = require('express');
const router = express.Router();
const  { sendEmail } = require('./sendEmail');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido/a ' + user.fullname));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'Correo electrónico incorrecto.'));
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  const { fullname } = req.body;

  const user = await pool.query('SELECT username FROM users WHERE username = ?', [username]);
  if (user.length > 0) {
    return done(null, false, req.flash('message', 'El correo electrónico ya esta en uso.'));
  }
  if (fullname.length < 4) {
    return done(null, false, req.flash('message', 'EL nombre debe tener un mínimo de 4 caracteres.'));
  }
  if(!emailRegex.test(username)){
    return done(null, false, req.flash('message', 'Correo electrónico inválido.'));
  }
  if(password.length < 8) {
    return done(null, false, req.flash('message', 'La contraseña debe tener un mínimo de 8 caracteres.'));
  }

  let newUser = {
    fullname,
    username,
    password
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id = result.insertId;
  router.post('/email', sendEmail);
  return done(null, newUser);
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});

