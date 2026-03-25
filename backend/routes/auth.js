const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');

router.post(
    '/register',
    [
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
       authController.signup
    ],

);


module.exports = router;
