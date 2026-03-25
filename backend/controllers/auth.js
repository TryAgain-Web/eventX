const {validationResult} = require('express-validator');

const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];

    return res.status(422).json({
      message: firstError ? firstError.msg : 'Validation failed',
      field: firstError ? firstError.path : null,
    });
  }

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const userDeatails = {
        username: username,
        email: email,
        password: hashedPassword
      }

      await User.save(userDeatails);
      res.status(201).json({ message: 'User registered!'});
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }

};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];

    return res.status(422).json({
      message: firstError ? firstError.msg : 'Validation failed',
      field: firstError ? firstError.path : null,
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    const [users] = await User.findByEmail(email);
    const existingUser = users[0];

    if (!existingUser) {
      return res.status(401).json({
        message: 'Email not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Incorrect password',
      });
    }

    res.status(200).json({
      message: 'Login successful',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
