const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');

const signupValidation = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please provide a valid email')
    .custom(async (email) =>{
      const user = await User.findByEmail(email);
      if(user[0].length > 0){
        return Promise.reject('Email already exists');
      }
    })
    .normalizeEmail(),
   body('password').isLength({ min: 7 }).withMessage('Password must be at least 7 characters long'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

router.post('/signup', signupValidation, authController.signup);
router.post('/register', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);


module.exports = router;
