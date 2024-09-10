// var db = require('../models');
const { body, validationResult } = require('express-validator');



var registerValidation = [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('phone', 'Please include a valid mobile number').isMobilePhone(),
  body('dob', 'Please include a valid date of birth').isDate(),
  body('address', 'Address is required').not().isEmpty(),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];
// Define the validation rules for the user

const validateImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ errors: [{ msg: 'Image is required' }] });
  }
  next();
};

var loginValidation = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  
];

var validateSchema = [
  body('firstName')
    .isLength({ min: 2 })
    .withMessage('minimum 2 characters are allowed')
    .isAlpha()
    .withMessage('Only alphabets are allowed'),
];


var validateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();

}


module.exports = { 
  validateSchema, 
  validateUser,
  registerValidation,
  validateImage,
  loginValidation
  };
