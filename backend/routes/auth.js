const express = require('express');

const { body, param } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');
const userController = require('../controllers/user');

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

router.get('/user/:id', userController.getUser);

const updateProfileValidation = [
  param('id').isInt().withMessage('Invalid user id'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('bio')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .isLength({ max: 300 })
    .withMessage('Bio must be 300 characters or less'),
  body('profilePicture')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .custom((value) => {
      const v = String(value).trim();
      if (!v) return true;

      // Accept uploaded images encoded as a data URL.
      if (v.startsWith('data:image/')) {
        return true;
      }

      // Accept regular http(s) URLs.
      try {
        const url = new URL(v);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        throw new Error('Invalid profilePicture URL');
      }
    }),
  body('socialLinks').optional({ nullable: true }).isObject().withMessage('socialLinks must be an object'),
  body('socialLinks.twitter').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Invalid twitter URL'),
  body('socialLinks.github').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Invalid github URL'),
  body('socialLinks.linkedin').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Invalid linkedin URL')
];

router.put('/user/:id', updateProfileValidation, userController.updateProfile);




module.exports = router;
